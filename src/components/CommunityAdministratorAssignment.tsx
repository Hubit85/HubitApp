import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Building, CheckCircle, Loader2, AlertCircle, Phone, 
  Mail, Building2, User, Users, Clock, Send, Star
} from "lucide-react";
import type { CommunityMemberAdministrator } from "@/integrations/supabase/types";

interface PropertyAdministrator {
  id: string;
  user_id: string;
  company_name: string;
  company_cif: string;
  contact_email: string;
  contact_phone?: string;
  license_number?: string;
  profile?: {
    full_name: string;
    email: string;
  };
}

interface AssignmentRequest {
  id: string;
  administrator_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  company_name?: string;
}

export function CommunityAdministratorAssignment() {
  const { user, userRoles } = useSupabaseAuth();
  const [currentAssignment, setCurrentAssignment] = useState<CommunityMemberAdministrator | null>(null);
  const [availableAdministrators, setAvailableAdministrators] = useState<PropertyAdministrator[]>([]);
  const [pendingRequests, setPendingRequests] = useState<AssignmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isCommunityMember = userRoles.some(role => 
    role.role_type === 'community_member' && role.is_verified
  );

  useEffect(() => {
    if (user && isCommunityMember) {
      initializeComponent();
    } else {
      setLoading(false);
    }
  }, [user, isCommunityMember]);

  const initializeComponent = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await Promise.all([
        loadCurrentAssignment(),
        loadPendingAssignmentRequests(),
        loadAvailableAdministrators()
      ]);
    } catch (err) {
      console.error('Error initializing component:', err);
      setError("Error al inicializar el formulario de asignación.");
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentAssignment = async () => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from('community_member_administrators')
      .select('*')
      .eq('user_id', user.id)
      .eq('administrator_verified', true)
      .maybeSingle();
    if (error && error.code !== 'PGRST116') throw error;
    setCurrentAssignment(data as CommunityMemberAdministrator | null);
  };

  const loadPendingAssignmentRequests = async () => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from('community_member_administrators')
      .select('id, company_cif, created_at, company_name')
      .eq('user_id', user.id)
      .eq('administrator_verified', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error loading pending assignment requests:', error);
      return;
    }
    setPendingRequests((data || []).map(req => ({
      id: req.id,
      administrator_id: req.company_cif,
      created_at: req.created_at || new Date().toISOString(), // FIX: Handle null created_at
      status: 'pending',
      company_name: req.company_name,
    })));
  };

  const loadAvailableAdministrators = async () => {
    // CORRECTED: Avoid the problematic JOIN by loading administrators without profiles initially
    const { data, error } = await supabase
      .from('property_administrators')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error loading property administrators:', error);
      setError('Error al cargar la lista de administradores.');
      setAvailableAdministrators([]);
      return;
    }
    
    console.log(`[DEBUG] Found ${data?.length || 0} administrators in database.`);

    const adminList: PropertyAdministrator[] = (data || []).map((admin: any) => ({
      id: admin.id,
      user_id: admin.user_id,
      company_name: admin.company_name || 'Administrador sin nombre',
      company_cif: admin.company_cif || `TEMP-${admin.id.substring(0,8)}`,
      contact_email: admin.contact_email || 'sin-email@registrado.com',
      contact_phone: admin.contact_phone || undefined,
      license_number: admin.license_number || undefined,
      profile: {
        full_name: admin.company_name || 'Administrador',
        email: admin.contact_email || ''
      }
    }));

    setAvailableAdministrators(adminList);
    console.log(`[DEBUG] Processed and set ${adminList.length} administrators to state.`);
    
    // Log the final list for debugging
    console.log(`[DEBUG] FINAL ADMINISTRATOR LIST:`, adminList.map(a => ({
      name: a.company_name,
      email: a.contact_email,
      cif: a.company_cif
    })));
  };

  const handleRequestAssignment = async (administrator: PropertyAdministrator) => {
    if (!user?.id) return;
    setRequesting(administrator.id);
    setError("");
    setSuccess("");

    try {
      const { data, error: insertError } = await supabase
        .from('community_member_administrators')
        .insert({
          user_id: user.id,
          company_name: administrator.company_name,
          company_cif: administrator.company_cif,
          contact_email: administrator.contact_email,
          contact_phone: administrator.contact_phone,
          administrator_verified: false,
          notes: `Solicitud enviada a ${administrator.company_name}.`
        }).select().single();

      if (insertError) throw insertError;

      setSuccess(`✅ Solicitud enviada a ${administrator.company_name}.`);
      await initializeComponent();

    } catch (err: any) {
      console.error("Error requesting assignment:", err);
      setError(err.message || "Error al enviar la solicitud.");
    } finally {
      setRequesting(null);
    }
  };

  if (!isCommunityMember) {
    return (
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-6 text-center">
          <Building className="h-10 w-10 mx-auto mb-3 text-amber-600" />
          <p className="text-sm text-amber-800">Esta función es para miembros de comunidad.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return <Card className="p-6 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></Card>;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-black"><Building /> Administrador de Fincas</CardTitle>
        <CardDescription>Asigna la empresa que administra tu comunidad.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
        {success && <Alert className="border-green-200 bg-green-50 text-green-800"><CheckCircle className="h-4 w-4" /><AlertDescription>{success}</AlertDescription></Alert>}

        {currentAssignment ? (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2">Administrador Asignado</h4>
            <p><strong>Empresa:</strong> {currentAssignment.company_name}</p>
            <p><strong>Email:</strong> {currentAssignment.contact_email}</p>
          </div>
        ) : (
          <>
            {pendingRequests.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-stone-900">Solicitudes Pendientes</h4>
                {pendingRequests.map(req => (
                  <div key={req.id} className="p-3 bg-orange-50 rounded-lg border border-orange-200 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-orange-900">{req.company_name}</p>
                      <p className="text-xs text-orange-700">Enviado: {new Date(req.created_at).toLocaleDateString('es-ES')}</p>
                    </div>
                    <Badge variant="outline" className="text-orange-800 border-orange-300">Pendiente</Badge>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-4">
              <h4 className="font-medium text-stone-900">Administradores Disponibles ({availableAdministrators.length})</h4>
              {availableAdministrators.length === 0 ? (
                <p className="text-sm text-stone-500 text-center py-4">No hay administradores registrados en la plataforma.</p>
              ) : (
                <div className="grid gap-4">
                  {availableAdministrators.map(admin => {
                    const isPending = pendingRequests.some(req => req.administrator_id === admin.company_cif);
                    return (
                      <Card key={admin.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-1 text-sm">
                              <p className="font-semibold text-base text-black">{admin.company_name}</p>
                              <p className="text-stone-600">CIF: {admin.company_cif}</p>
                              <p className="flex items-center gap-2 text-stone-600"><Mail className="h-3 w-3" /> {admin.contact_email}</p>
                              {admin.contact_phone && <p className="flex items-center gap-2 text-stone-600"><Phone className="h-3 w-3" /> {admin.contact_phone}</p>}
                            </div>
                            <div className="ml-4">
                              <Button
                                onClick={() => handleRequestAssignment(admin)}
                                disabled={requesting === admin.id || isPending}
                                size="sm"
                                variant={isPending ? "outline" : "default"}
                              >
                                {requesting === admin.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 
                                 isPending ? <><Clock className="h-3 w-3 mr-1" />Pendiente</> : 
                                 <><Send className="h-3 w-3 mr-1" />Solicitar</>}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
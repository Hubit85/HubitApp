import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Building, CheckCircle, Loader2, AlertCircle, Phone, 
  Mail, Building2, User, Users, Clock, Send, Star, X, RefreshCw
} from "lucide-react";
import type { CommunityMemberAdministrator } from "@/integrations/supabase/types";
import { PropertyAdministratorSyncService } from "@/services/PropertyAdministratorSyncService";

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
  const [syncing, setSyncing] = useState(false);
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
      // PASO 1: Ejecutar sincronización automática primero
      await runSynchronization(false); // false = silenciosa
      
      // PASO 2: Cargar datos después de la sincronización
      await Promise.all([
        loadCurrentAssignment(),
        loadPendingAssignmentRequests(),
        loadSynchronizedAdministrators()
      ]);
    } catch (err) {
      console.error('Error initializing component:', err);
      setError("Error al inicializar el formulario de asignación.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * EJECUTAR SINCRONIZACIÓN COMPLETA
   */
  const runSynchronization = async (showProgress = true) => {
    if (showProgress) {
      setSyncing(true);
      setError("");
      setSuccess("");
    }

    try {
      console.log('🔄 SYNC: Ejecutando sincronización de administradores...');
      
      const syncResult = await PropertyAdministratorSyncService.syncAllPropertyAdministrators();
      
      if (syncResult.success) {
        console.log('✅ SYNC: Sincronización exitosa:', syncResult.message);
        
        if (showProgress) {
          if (syncResult.created_in_property_administrators > 0 || syncResult.created_in_user_roles > 0) {
            setSuccess(`🔄 Sincronización completada: ${syncResult.created_in_property_administrators} en property_administrators, ${syncResult.created_in_user_roles} en user_roles`);
          }
        }
        
        // Recargar administradores después de la sincronización
        await loadSynchronizedAdministrators();
        
      } else {
        console.warn('⚠️ SYNC: Sincronización con errores:', syncResult.errors);
        if (showProgress) {
          setError(`Sincronización parcial: ${syncResult.errors.join(', ')}`);
        }
      }
      
    } catch (syncError) {
      console.error('❌ SYNC: Error en sincronización:', syncError);
      if (showProgress) {
        setError('Error durante la sincronización de administradores');
      }
    } finally {
      if (showProgress) {
        setSyncing(false);
      }
    }
  };

  /**
   * CARGAR ADMINISTRADORES SINCRONIZADOS
   */
  const loadSynchronizedAdministrators = async () => {
    try {
      console.log('🔍 SYNC LOAD: Cargando administradores sincronizados...');
      
      const result = await PropertyAdministratorSyncService.getAllSynchronizedAdministrators();
      
      if (result.success && result.administrators.length > 0) {
        console.log(`✅ SYNC LOAD: Cargados ${result.administrators.length} administradores sincronizados`);
        
        // Convertir a formato del componente
        const adminList: PropertyAdministrator[] = result.administrators.map(admin => ({
          id: admin.id,
          user_id: admin.user_id,
          company_name: admin.company_name,
          company_cif: admin.company_cif,
          contact_email: admin.contact_email,
          contact_phone: admin.contact_phone,
          license_number: admin.license_number,
          profile: {
            full_name: admin.company_name,
            email: admin.contact_email
          }
        }));
        
        setAvailableAdministrators(adminList);
        
        // Verificación para logging
        console.log('🎯 SYNC LOAD: Administradores configurados:', adminList.map(a => ({
          name: a.company_name,
          email: a.contact_email,
          cif: a.company_cif
        })));
        
        setError('');
        
      } else {
        console.warn('⚠️ SYNC LOAD: No se encontraron administradores sincronizados');
        setAvailableAdministrators([]);
        setError(result.message || 'No se encontraron administradores sincronizados');
      }
      
    } catch (err) {
      console.error('❌ SYNC LOAD: Error cargando administradores sincronizados:', err);
      setError('Error al cargar administradores sincronizados');
      setAvailableAdministrators([]);
    }
  };

  const loadCurrentAssignment = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('community_member_administrators')
        .select('*')
        .eq('user_id', user.id)
        .eq('administrator_verified', true)
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading current assignment:', error);
        return;
      }
      
      setCurrentAssignment(data as CommunityMemberAdministrator | null);
    } catch (err) {
      console.error('Exception loading current assignment:', err);
    }
  };

  const loadPendingAssignmentRequests = async () => {
    if (!user?.id) return;
    
    try {
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
        created_at: req.created_at || new Date().toISOString(),
        status: 'pending',
        company_name: req.company_name,
      })));
    } catch (err) {
      console.error('Exception loading pending requests:', err);
    }
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

  const handleDeleteRequest = async (requestId: string, companyName?: string) => {
    try {
      setError("");
      setSuccess("");
      
      const { error } = await supabase
        .from('community_member_administrators')
        .delete()
        .eq('id', requestId);
      
      if (error) {
        console.error('Error deleting request:', error);
        setError('Error al eliminar la solicitud');
      } else {
        setSuccess(`Solicitud a ${companyName || 'la empresa'} eliminada correctamente`);
        await initializeComponent();
      }
    } catch (error) {
      console.error('Exception deleting request:', error);
      setError('Error al eliminar la solicitud');
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
    return (
      <Card className="p-6 text-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        <p className="text-sm text-stone-600 mt-2">Cargando administradores...</p>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-black">
              <Building /> Administrador de Fincas
            </CardTitle>
            <CardDescription>Asigna la empresa que administra tu comunidad</CardDescription>
          </div>
          
          {/* BOTÓN DE SINCRONIZACIÓN MANUAL */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => runSynchronization(true)}
            disabled={syncing || loading}
            className="ml-4"
          >
            {syncing ? (
              <>
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                Sincronizando...
              </>
            ) : (
              <>
                <RefreshCw className="h-3 w-3 mr-2" />
                Actualizar Lista
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {currentAssignment ? (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Administrador Asignado
            </h4>
            <p><strong>Empresa:</strong> {currentAssignment.company_name}</p>
            <p><strong>Email:</strong> {currentAssignment.contact_email}</p>
            {currentAssignment.contact_phone && (
              <p><strong>Teléfono:</strong> {currentAssignment.contact_phone}</p>
            )}
          </div>
        ) : (
          <>
            {pendingRequests.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-stone-900 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  Solicitudes Pendientes ({pendingRequests.length})
                </h4>
                {pendingRequests.map(req => (
                  <div key={req.id} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-orange-900">{req.company_name}</p>
                        <p className="text-xs text-orange-700">
                          Enviado: {new Date(req.created_at).toLocaleDateString('es-ES')}
                        </p>
                        <Badge variant="outline" className="text-orange-800 border-orange-300 mt-2">
                          <Clock className="h-3 w-3 mr-1" />
                          Esperando confirmación del administrador
                        </Badge>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRequest(req.id, req.company_name)}
                        className="ml-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={requesting !== null}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-4">
              <h4 className="font-medium text-stone-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                Administradores Disponibles ({availableAdministrators.length})
              </h4>
              
              {syncing && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Sincronizando administradores...</span>
                  </div>
                </div>
              )}
              
              {availableAdministrators.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 mx-auto mb-3 text-stone-400" />
                  <p className="text-sm text-stone-500 mb-3">
                    No hay administradores registrados en la plataforma.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => runSynchronization(true)}
                    disabled={syncing}
                  >
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Buscar Administradores
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {availableAdministrators.map(admin => {
                    const isPending = pendingRequests.some(req => req.administrator_id === admin.company_cif);
                    return (
                      <Card key={admin.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-blue-600" />
                                <p className="font-semibold text-base text-black">{admin.company_name}</p>
                                <Badge variant="secondary" className="text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  Verificado
                                </Badge>
                              </div>
                              
                              <div className="space-y-1 text-sm">
                                <p className="text-stone-600 flex items-center gap-2">
                                  <span className="font-medium">CIF:</span> {admin.company_cif}
                                </p>
                                <p className="text-stone-600 flex items-center gap-2">
                                  <Mail className="h-3 w-3" /> {admin.contact_email}
                                </p>
                                {admin.contact_phone && (
                                  <p className="text-stone-600 flex items-center gap-2">
                                    <Phone className="h-3 w-3" /> {admin.contact_phone}
                                  </p>
                                )}
                                {admin.license_number && (
                                  <p className="text-stone-600 flex items-center gap-2">
                                    <span className="font-medium text-xs">Nº Licencia:</span> 
                                    {admin.license_number}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="ml-4">
                              <Button
                                onClick={() => handleRequestAssignment(admin)}
                                disabled={requesting === admin.id || isPending}
                                size="sm"
                                variant={isPending ? "outline" : "default"}
                                className={isPending ? "bg-orange-50 border-orange-200 text-orange-800" : ""}
                              >
                                {requesting === admin.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : isPending ? (
                                  <>
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pendiente
                                  </>
                                ) : (
                                  <>
                                    <Send className="h-3 w-3 mr-1" />
                                    Solicitar
                                  </>
                                )}
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
import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  administrator?: PropertyAdministrator;
}

export function CommunityAdministratorAssignment() {
  const { user, profile, userRoles } = useSupabaseAuth(); // FIXED: Added profile to destructuring
  const [currentAssignment, setCurrentAssignment] = useState<CommunityMemberAdministrator | null>(null);
  const [availableAdministrators, setAvailableAdministrators] = useState<PropertyAdministrator[]>([]);
  const [pendingRequests, setPendingRequests] = useState<AssignmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check if user is community member
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
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Load assigned administrator for this community member
      await loadCurrentAssignment();
      
      // Load pending assignment requests for this administrator
      await loadPendingAssignmentRequests(); // FIXED: Use correct function name
      
      // Load available property administrators as fallback
      await loadAvailableAdministrators();
      
    } catch (err) {
      console.error('Error initializing component:', err);
      setError("Error al inicializar el formulario de asignación");
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentAssignment = async () => {
    if (!user?.id) return;

    const { data, error: queryError } = await supabase
      .from('community_member_administrators')
      .select('*')
      .eq('user_id', user.id)
      .eq('administrator_verified', true)
      .maybeSingle();

    if (queryError && queryError.code !== 'PGRST116') {
      throw queryError;
    }

    setCurrentAssignment(data);
  };

  const loadPendingAssignmentRequests = async () => {
    if (!user?.id || !user?.email) return; // Check for email existence early

    try {
      // Find requests where the administrator email matches this user's email
      const { data: requests, error } = await supabase
        .from('community_member_administrators')
        .select('*')
        .eq('contact_email', user.email || '') // Use user.email directly with fallback
        .eq('administrator_verified', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Error loading assignment requests:', error);
        return;
      }

      // Get profile information separately to avoid relationship errors
      let requestsWithProfiles: AssignmentRequest[] = [];
      
      if (requests && requests.length > 0) {
        // Get user IDs for profile lookup
        const userIds = requests.map(req => req.user_id);
        
        // Get profiles separately
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds);

        if (!profileError && profiles) {
          // Map requests with their profiles
          requestsWithProfiles = requests.map(request => {
            const matchingProfile = profiles.find(profile => profile.id === request.user_id);
            
            return {
              id: request.id,
              administrator_id: request.company_cif, // Map to company_cif as identifier
              status: 'pending' as const,
              created_at: request.created_at || new Date().toISOString(),
              administrator: {
                id: request.id,
                user_id: request.user_id,
                company_name: request.company_name,
                company_cif: request.company_cif,
                contact_email: request.contact_email || '',
                contact_phone: request.contact_phone ?? undefined, // FIXED: Convert null to undefined
                profile: matchingProfile ? {
                  full_name: matchingProfile.full_name || 'Usuario',
                  email: matchingProfile.email || ''
                } : {
                  full_name: 'Usuario',
                  email: ''
                }
              }
            };
          });
        } else {
          // Fallback without profiles
          requestsWithProfiles = requests.map(request => ({
            id: request.id,
            administrator_id: request.company_cif,
            status: 'pending' as const,
            created_at: request.created_at || new Date().toISOString(),
            administrator: {
              id: request.id,
              user_id: request.user_id,
              company_name: request.company_name,
              company_cif: request.company_cif,
              contact_email: request.contact_email || '',
              contact_phone: request.contact_phone ?? undefined,
              profile: {
                full_name: 'Usuario',
                email: request.contact_email || ''
              }
            }
          }));
        }
      }

      setPendingRequests(requestsWithProfiles);
    } catch (err) {
      console.error('Error loading pending requests:', err);
    }
  };

  const loadAvailableAdministrators = async () => {
    try {
      console.log('🔍 Loading available property administrators...');

      // CORRECTED: Load DIRECTLY from property_administrators table
      const { data: propertyAdmins, error: propertyAdminsError } = await supabase
        .from('property_administrators')
        .select('*')
        .order('created_at', { ascending: false });

      if (propertyAdminsError) {
        console.error('❌ Error loading property administrators:', propertyAdminsError);
        setError('Error al cargar administradores');
        return;
      }

      // DEBUG: Log ALL raw data from database
      console.log('🐛 DEBUG - ALL ADMINISTRATORS IN DATABASE:', propertyAdmins);

      let adminList: PropertyAdministrator[] = [];

      if (propertyAdmins && propertyAdmins.length > 0) {
        console.log(`📋 Found ${propertyAdmins.length} raw administrators in database`);
        
        // ✅ ACEPTAR TODOS LOS REGISTROS SIN FILTRAR
        propertyAdmins.forEach((admin, index) => {
          console.log(`🔍 Raw admin data ${index + 1}:`, admin);

          // ✅ ACEPTAR TODOS los registros, incluso con datos incompletos
          const companyName = admin.company_name?.trim() || 
                            admin.contact_email?.split('@')[0] || 
                            'Administrador Sin Nombre';
          
          const contactEmail = admin.contact_email?.trim() || 
                             'sin-email@ejemplo.com';

          const adminData: PropertyAdministrator = {
            id: admin.id,
            user_id: admin.user_id,
            company_name: companyName,
            company_cif: admin.company_cif || `SIN-CIF-${admin.id.substring(0, 8)}`,
            contact_email: contactEmail,
            contact_phone: admin.contact_phone || undefined,
            license_number: admin.license_number || undefined,
            profile: {
              full_name: companyName,
              email: contactEmail
            }
          };

          adminList.push(adminData);
          console.log(`✅ ADDED admin ${index + 1}:`, adminData.company_name);
        });
      }

      // DEBUG: Verificar qué administradores se están mostrando
      console.log('🎯 FINAL LIST - Administrators to display:', adminList.map(a => ({
        name: a.company_name,
        email: a.contact_email,
        cif: a.company_cif
      })));

      setAvailableAdministrators(adminList);
      
      if (adminList.length === 0) {
        setError('No se encontraron administradores de fincas');
      } else {
        setError('');
      }

    } catch (err) {
      console.error('❌ Error loading administrators:', err);
      setError('Error al cargar administradores');
    }
  };

  const handleRequestAssignment = async (administrator: PropertyAdministrator) => {
    if (!user?.id) return;

    // Check if already has a verified assignment
    if (currentAssignment) {
      setError("Ya tienes un administrador de fincas asignado");
      return;
    }

    // Check if already has a pending request for this administrator
    const existingRequest = pendingRequests.find(req => 
      req.administrator_id === administrator.company_cif
    );
    
    if (existingRequest) {
      setError("Ya tienes una solicitud pendiente para este administrador");
      return;
    }

    try {
      setRequesting(true);
      setError("");
      setSuccess("");

      // Create assignment request
      const { data, error: insertError } = await supabase
        .from('community_member_administrators')
        .insert({
          user_id: user.id,
          company_name: administrator.company_name,
          company_cif: administrator.company_cif,
          contact_email: administrator.contact_email,
          contact_phone: administrator.contact_phone || null,
          administrator_verified: false, // Pending approval
          notes: `Solicitud enviada a ${administrator.company_name} el ${new Date().toLocaleDateString('es-ES')}. Esperando confirmación del administrador.`
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Send notification to the property administrator
      try {
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: administrator.user_id,
            title: 'Nueva solicitud de asignación de miembro de comunidad',
            message: `${profile?.full_name || 'Un miembro de comunidad'} (${user.email}) ha solicitado ser asignado a la gestión de ${administrator.company_name}. Revisa la solicitud en tu perfil de administrador.`,
            type: 'info',
            category: 'assignment_request',
            related_entity_type: 'community_member_administrator',
            related_entity_id: data.id,
            action_url: `/dashboard?tab=perfil`,
            action_label: 'Ver Solicitudes',
            read: false
          });

        if (notificationError) {
          console.warn("Failed to send notification:", notificationError);
        } else {
          console.log(`Assignment request notification sent to ${administrator.company_name}`);
        }
      } catch (notifError) {
        console.warn("Error sending notification:", notifError);
      }

      setSuccess(`✅ Solicitud enviada exitosamente a ${administrator.company_name}. 

La empresa recibirá una notificación y podrá aprobar tu solicitud desde su panel de administrador. Una vez aprobada, podrás:

• Reportar incidencias directamente a tu administrador
• Recibir respuestas y seguimiento personalizado  
• Acceder a servicios específicos de tu comunidad

¡Te notificaremos cuando recibas una respuesta!`);
      
      // Reload data
      await initializeComponent(); // FIXED: Replace loadAllData with initializeComponent

      // Auto-hide success message
      setTimeout(() => setSuccess(""), 8000);

    } catch (err) {
      console.error("Error requesting assignment:", err);
      setError(err instanceof Error ? err.message : "Error al enviar la solicitud");
    } finally {
      setRequesting(false);
    }
  };

  if (!isCommunityMember) {
    return (
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardContent className="p-6 text-center">
          <Building className="h-12 w-12 mx-auto mb-4 text-amber-600" />
          <h3 className="text-lg font-semibold text-amber-900 mb-2">Función No Disponible</h3>
          <p className="text-sm text-amber-700">
            Esta funcionalidad está disponible solo para miembros de comunidad verificados.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="border-stone-200">
        <CardContent className="p-6 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-stone-600 mx-auto mb-4" />
          <p className="text-stone-600">Cargando información...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-stone-200 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-black">
                Administrador de Fincas
              </CardTitle>
              <CardDescription>
                Gestiona la asignación de tu administrador de fincas
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {(error || success) && (
            <Alert className={`border-2 ${error ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}>
              <div className="flex items-center gap-2">
                {error ? <AlertCircle className="h-4 w-4 text-red-600" /> : <CheckCircle className="h-4 w-4 text-green-600" />}
                <AlertDescription className={`font-medium ${error ? "text-red-800" : "text-green-800"}`}>
                  {error || success}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* Current Assignment */}
          {currentAssignment ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Administrador Asignado
                </Badge>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <Building2 className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-900 mb-1">
                      {currentAssignment.company_name}
                    </h4>
                    <p className="text-sm text-green-700 mb-2">
                      CIF: {currentAssignment.company_cif}
                    </p>
                    
                    <div className="space-y-1">
                      {currentAssignment.contact_email && (
                        <div className="flex items-center gap-2 text-sm text-green-700">
                          <Mail className="h-3 w-3" />
                          <span>{currentAssignment.contact_email}</span>
                        </div>
                      )}
                      {currentAssignment.contact_phone && (
                        <div className="flex items-center gap-2 text-sm text-green-700">
                          <Phone className="h-3 w-3" />
                          <span>{currentAssignment.contact_phone}</span>
                        </div>
                      )}
                    </div>

                    {currentAssignment.notes && (
                      <div className="mt-3 p-2 bg-green-100 rounded text-sm text-green-800">
                        {currentAssignment.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  ¡Todo configurado!
                </h4>
                <p className="text-sm text-blue-800">
                  Ya puedes reportar incidencias directamente a tu administrador asignado. 
                  Las incidencias serán enviadas automáticamente a <strong>{currentAssignment.company_name}</strong>.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Pending Requests */}
              {pendingRequests.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-stone-900 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    Solicitudes Pendientes ({pendingRequests.length})
                  </h4>
                  
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-orange-900">
                            Solicitud enviada
                          </p>
                          <p className="text-sm text-orange-700">
                            Esperando confirmación del administrador
                          </p>
                          <p className="text-xs text-orange-600 mt-1">
                            Enviado: {new Date(request.created_at).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <Badge className="bg-orange-100 text-orange-800">
                          Pendiente
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Available Administrators */}
              <div className="space-y-4">
                <h4 className="font-medium text-stone-900 flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  Administradores de Fincas Disponibles ({availableAdministrators.length})
                </h4>

                {/* Resultados de búsqueda */}
                {availableAdministrators.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-stone-900">Administradores disponibles ({availableAdministrators.length})</h3>
                    <div className="grid gap-4 max-h-60 overflow-y-auto">
                      {availableAdministrators
                        .filter(admin => {
                          if (!searchTerm.trim()) return true;
                          const term = searchTerm.toLowerCase();
                          return admin.company_name.toLowerCase().includes(term) ||
                                 admin.contact_email.toLowerCase().includes(term);
                        })
                        .map((admin) => (
                        <Card 
                          key={admin.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedAdmin?.id === admin.id ? 'ring-2 ring-stone-800' : ''
                          }`}
                          onClick={() => setSelectedAdmin(admin)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4 text-stone-600" />
                                  <span className="font-semibold">{admin.company_name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-stone-600">
                                  <User className="h-3 w-3" />
                                  {admin.profile?.full_name || 'Usuario'}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-stone-600">
                                  <Mail className="h-3 w-3" />
                                  {admin.contact_email}
                                </div>
                                {admin.contact_phone && (
                                  <div className="flex items-center gap-2 text-sm text-stone-600">
                                    <Phone className="h-3 w-3" />
                                    {admin.contact_phone}
                                  </div>
                                )}
                                <div className="flex items-center gap-2 text-sm text-stone-500">
                                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                                    CIF: {admin.company_cif}
                                  </Badge>
                                </div>
                              </div>
                              {selectedAdmin?.id === admin.id && (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    {searchTerm.trim() && availableAdministrators
                      .filter(admin => {
                        const term = searchTerm.toLowerCase();
                        return admin.company_name.toLowerCase().includes(term) ||
                               admin.contact_email.toLowerCase().includes(term);
                      }).length === 0 && (
                      <div className="text-center py-4 text-stone-500">
                        <p>No se encontraron administradores que coincidan con "{searchTerm}"</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <Building2 className="h-12 w-12 mx-auto mb-4 text-stone-400" />
                      <p className="text-stone-600 mb-2">No hay administradores disponibles</p>
                      <p className="text-sm text-stone-500">
                        Los administradores de fincas aparecerán aquí cuando se registren en la plataforma
                      </p>
                    </div>
                    
                    {/* Fallback search option */}
                    <div className="border-t pt-4">
                      <Button 
                        onClick={searchAdministrators} 
                        disabled={searchLoading}
                        variant="outline"
                        className="w-full"
                      >
                        {searchLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Buscando...
                          </>
                        ) : (
                          <>
                            <Search className="h-4 w-4 mr-2" />
                            Buscar en toda la base de datos
                          </>
                        )}
                      </Button>
                      
                      {/* Show search results if any */}
                      {administrators.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h4 className="font-medium text-stone-900">Resultados de búsqueda:</h4>
                          {administrators.map((admin) => (
                            <Card 
                              key={admin.role_id}
                              className={`cursor-pointer transition-all hover:shadow-md ${
                                selectedAdmin?.id === admin.role_id ? 'ring-2 ring-stone-800' : ''
                              }`}
                              onClick={() => setSelectedAdmin({
                                id: admin.role_id,
                                user_id: admin.user_id,
                                company_name: admin.company_name,
                                company_cif: 'SEARCH-' + admin.role_id.substring(0, 8),
                                contact_email: admin.business_email,
                                contact_phone: admin.business_phone,
                                profile: {
                                  full_name: admin.user_name,
                                  email: admin.user_email
                                }
                              })}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-start justify-between">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Building className="h-4 w-4 text-stone-600" />
                                      <span className="font-semibold">{admin.company_name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-stone-600">
                                      <User className="h-3 w-3" />
                                      {admin.user_name}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-stone-600">
                                      <Mail className="h-3 w-3" />
                                      {admin.business_email}
                                    </div>
                                  </div>
                                  {selectedAdmin?.id === admin.role_id && (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <Separator />

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">¿Cómo funciona este sistema?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Solicita asignación:</strong> Haz clic en "Solicitar" junto al administrador de tu comunidad</li>
              <li>• <strong>Espera confirmación:</strong> El administrador recibirá tu solicitud y podrá aprobarla</li>
              <li>• <strong>¡Listo para reportar!</strong> Una vez aprobada, podrás reportar incidencias directamente</li>
              <li>• <strong>Comunicación directa:</strong> Todas tus incidencias llegarán a tu administrador asignado</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
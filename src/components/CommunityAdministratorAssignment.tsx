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
        .select(`
          *,
          profiles!community_member_administrators_user_id_fkey(full_name, email)
        `)
        .eq('contact_email', user.email || '') // Use user.email directly with fallback
        .eq('administrator_verified', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Error loading assignment requests:', error);
        return;
      }

      // FIXED: Properly type the assignment requests with correct mapping and null handling
      const typedRequests = (requests || []).map(request => ({
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
          profile: {
            full_name: request.company_name,
            email: request.contact_email || ''
          }
        }
      }));

      setPendingRequests(typedRequests);
    } catch (err) {
      console.error('Error loading pending requests:', err);
    }
  };

  const loadAvailableAdministrators = async () => {
    try {
      console.log('🔍 Loading available property administrators...');
      
      // First, let's verify our Supabase connection
      const { data: connectionTest, error: connectionError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      if (connectionError) {
        console.error('❌ Supabase connection failed:', connectionError);
        setError('Error de conexión con la base de datos');
        return;
      }

      console.log('✅ Supabase connection verified');

      // STEP 1: Query user_roles for property administrators
      const { data: adminRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          id,
          user_id,
          role_specific_data,
          profiles!user_roles_user_id_fkey(full_name, email, phone)
        `)
        .eq('role_type', 'property_administrator')
        .eq('is_verified', true);

      console.log('📋 Query result from user_roles:', {
        success: !rolesError,
        error: rolesError?.message || 'none',
        dataCount: adminRoles?.length || 0,
        data: adminRoles?.map(r => ({
          id: r.id.substring(0, 8) + '...',
          user_id: r.user_id.substring(0, 8) + '...',
          profileName: r.profiles ? (r.profiles as any).full_name : 'no-profile',
          profileEmail: r.profiles ? (r.profiles as any).email : 'no-email'
        })) || []
      });

      if (rolesError) {
        console.error('❌ Error querying user_roles:', rolesError);
        setError('Error al cargar administradores desde la tabla de roles: ' + rolesError.message);
        return;
      }

      // STEP 2: Fallback query - check profiles directly
      console.log('🔄 Performing fallback query on profiles table...');
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, user_type')
        .eq('user_type', 'property_administrator');

      console.log('📋 Query result from profiles:', {
        success: !profilesError,
        error: profilesError?.message || 'none',
        dataCount: profilesData?.length || 0,
        data: profilesData?.map(p => ({
          id: p.id.substring(0, 8) + '...',
          name: p.full_name,
          email: p.email,
          type: p.user_type
        })) || []
      });

      if (profilesError) {
        console.warn('⚠️ Fallback profile query also failed:', profilesError);
      }

      // STEP 3: Process the results
      const adminList: PropertyAdministrator[] = [];

      // Process adminRoles if we have them
      if (adminRoles && adminRoles.length > 0) {
        console.log(`🔄 Processing ${adminRoles.length} admin roles...`);
        
        adminRoles.forEach((adminRole, index) => {
          console.log(`Processing admin ${index + 1}:`, {
            id: adminRole.id.substring(0, 8) + '...',
            user_id: adminRole.user_id.substring(0, 8) + '...',
            hasProfile: !!adminRole.profiles,
            profileData: adminRole.profiles
          });

          let adminData: PropertyAdministrator;
          
          // Handle profile data safely
          if (adminRole.profiles && 
              typeof adminRole.profiles === 'object' && 
              !Array.isArray(adminRole.profiles) &&
              adminRole.profiles !== null) {
            
            const profile = adminRole.profiles as { 
              full_name: string | null; 
              email: string | null; 
              phone?: string | null 
            };
            
            // Only proceed if we have at least an email
            if (profile.email) {
              adminData = {
                id: adminRole.id,
                user_id: adminRole.user_id,
                company_name: profile.full_name || `Administrador de Fincas`,
                company_cif: `CIF-${adminRole.user_id.substring(0, 8)}`,
                contact_email: profile.email,
                contact_phone: profile.phone || undefined,
                license_number: undefined,
                profile: {
                  full_name: profile.full_name || 'Administrador de Fincas',
                  email: profile.email
                }
              };

              // Apply role-specific data if available
              if (adminRole.role_specific_data && 
                  typeof adminRole.role_specific_data === 'object' &&
                  adminRole.role_specific_data !== null) {
                
                const roleData = adminRole.role_specific_data as Record<string, any>;
                
                if (roleData.company_name && typeof roleData.company_name === 'string') {
                  adminData.company_name = roleData.company_name;
                }
                if (roleData.cif && typeof roleData.cif === 'string') {
                  adminData.company_cif = roleData.cif;
                }
                if (roleData.business_email && typeof roleData.business_email === 'string') {
                  adminData.contact_email = roleData.business_email;
                }
                if (roleData.business_phone && typeof roleData.business_phone === 'string') {
                  adminData.contact_phone = roleData.business_phone;
                }
                if (roleData.professional_number && typeof roleData.professional_number === 'string') {
                  adminData.license_number = roleData.professional_number;
                }
              }

              console.log(`✅ Added admin ${index + 1}:`, {
                name: adminData.company_name,
                email: adminData.contact_email,
                userId: adminData.user_id.substring(0, 8) + '...'
              });

              adminList.push(adminData);
            } else {
              console.warn(`⚠️ Skipping admin ${index + 1}: no email address`);
            }
          } else {
            console.warn(`⚠️ Skipping admin ${index + 1}: no profile data`);
          }
        });
      } 
      
      // If no admins from roles, try profiles fallback
      else if (profilesData && profilesData.length > 0) {
        console.log('🔄 Using profiles fallback data...');
        
        profilesData.forEach((profile, index) => {
          if (profile.email) { // Only add if email exists
            const fallbackAdmin: PropertyAdministrator = {
              id: `fallback-${profile.id}`,
              user_id: profile.id,
              company_name: profile.full_name || `Administrador de Fincas`,
              company_cif: `CIF-${profile.id.substring(0, 8)}`,
              contact_email: profile.email,
              contact_phone: undefined,
              license_number: undefined,
              profile: {
                full_name: profile.full_name || 'Administrador de Fincas',
                email: profile.email
              }
            };
            
            adminList.push(fallbackAdmin);
            console.log(`✅ Fallback admin ${index + 1}:`, {
              name: fallbackAdmin.company_name,
              email: fallbackAdmin.contact_email
            });
          }
        });
      }

      console.log(`📊 Final admin list: ${adminList.length} administrators found`);

      // Set the administrators list
      setAvailableAdministrators(adminList);

      // Enhanced search for expected administrators (Pipaón, Castro)
      const searchTerms = ['pipaón', 'pipan', 'castro'];
      const foundExpectedAdmins = adminList.filter(admin => {
        const searchText = `${admin.company_name} ${admin.contact_email}`.toLowerCase();
        return searchTerms.some(term => searchText.includes(term.toLowerCase()));
      });

      console.log('🔍 Search for expected administrators:', {
        searchTerms,
        foundCount: foundExpectedAdmins.length,
        foundAdmins: foundExpectedAdmins.map(admin => ({
          name: admin.company_name,
          email: admin.contact_email
        }))
      });

      // Provide feedback
      if (adminList.length === 0) {
        console.warn('❌ NO ADMINISTRATORS FOUND');
        setError('No se encontraron administradores de fincas. Asegúrate de que hay administradores registrados y verificados en el sistema.');
      } else {
        console.log(`✅ Successfully loaded ${adminList.length} administrators`);
        
        if (foundExpectedAdmins.length === 0) {
          console.log('ℹ️ Expected administrators (Pipaón, Castro) not found in current list');
        }
      }

    } catch (err) {
      console.error('❌ Critical error loading administrators:', err);
      setError('Error crítico al cargar administradores: ' + (err instanceof Error ? err.message : 'Error desconocido'));
      setAvailableAdministrators([]);
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

                {availableAdministrators.length === 0 ? (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 mx-auto mb-4 text-stone-400" />
                    <p className="text-stone-600 mb-2">No hay administradores disponibles</p>
                    <p className="text-sm text-stone-500">
                      Los administradores de fincas aparecerán aquí cuando se registren en la plataforma
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {availableAdministrators.map((admin) => {
                      const hasPendingRequest = pendingRequests.some(req => 
                        req.administrator_id === admin.company_cif
                      );

                      return (
                        <Card key={admin.id} className="border-stone-200 hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Building2 className="h-5 w-5 text-blue-600" />
                                  <h5 className="font-semibold text-stone-900">
                                    {admin.company_name}
                                  </h5>
                                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                                    <Star className="h-3 w-3 mr-1" />
                                    Verificado
                                  </Badge>
                                </div>

                                <div className="space-y-1 text-sm text-stone-600 mb-3">
                                  <p>CIF: {admin.company_cif}</p>
                                  
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-3 w-3" />
                                    <span>{admin.contact_email}</span>
                                  </div>
                                  
                                  {admin.contact_phone && (
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-3 w-3" />
                                      <span>{admin.contact_phone}</span>
                                    </div>
                                  )}

                                  {admin.license_number && (
                                    <p className="text-xs">
                                      Colegiado: {admin.license_number}
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 text-xs text-stone-500">
                                  <User className="h-3 w-3" />
                                  <span>
                                    Contacto: {admin.profile?.full_name || 'Administrador'}
                                  </span>
                                </div>
                              </div>

                              <div className="ml-4">
                                <Button
                                  onClick={() => handleRequestAssignment(admin)}
                                  disabled={requesting || hasPendingRequest}
                                  size="sm"
                                  className={`${
                                    hasPendingRequest 
                                      ? "bg-orange-100 text-orange-800 border-orange-300" 
                                      : "bg-blue-600 hover:bg-blue-700 text-white"
                                  }`}
                                  variant={hasPendingRequest ? "outline" : "default"}
                                >
                                  {requesting ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : hasPendingRequest ? (
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
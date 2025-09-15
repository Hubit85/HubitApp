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

      // CORRECTED: Load DIRECTLY from property_administrators table (most reliable)
      console.log('🔄 Loading administrators from property_administrators table...');
      const { data: propertyAdmins, error: propertyAdminsError } = await supabase
        .from('property_administrators')
        .select('*')
        .order('created_at', { ascending: false });

      if (propertyAdminsError) {
        console.error('❌ Error loading property administrators:', propertyAdminsError);
        setError('Error al cargar administradores: ' + propertyAdminsError.message);
        setAvailableAdministrators([]);
        return;
      }

      // ENHANCED DEBUGGING: Log raw data from database
      console.log('📋 RAW DATA FROM DATABASE:', {
        total_count: propertyAdmins?.length || 0,
        administrators: propertyAdmins?.map(admin => ({
          id: admin.id,
          company_name: admin.company_name,
          contact_email: admin.contact_email,
          contact_phone: admin.contact_phone,
          user_id: admin.user_id?.substring(0, 8) + '...',
          created_at: admin.created_at
        }))
      });

      let adminList: PropertyAdministrator[] = [];

      if (propertyAdmins && propertyAdmins.length > 0) {
        console.log(`📋 Found ${propertyAdmins.length} administrators in database`);
        
        // CORRECTED: More flexible validation - accept administrators with basic info
        propertyAdmins.forEach((admin, index) => {
          console.log(`🔍 Processing admin ${index + 1}:`, {
            id: admin.id?.substring(0, 8) + '...',
            company_name: admin.company_name,
            contact_email: admin.contact_email,
            contact_phone: admin.contact_phone,
            user_id: admin.user_id?.substring(0, 8) + '...'
          });

          // FIXED: More flexible validation - accept any administrator with basic info
          const hasBasicInfo = (admin.company_name && admin.company_name.trim() !== '') || 
                              (admin.contact_email && admin.contact_email.trim() !== '');

          if (hasBasicInfo) {
            // Use company name if available, otherwise generate from email
            const companyName = admin.company_name?.trim() || 
                              admin.contact_email?.split('@')[0]?.replace(/[^a-zA-Z0-9]/g, ' ') || 
                              'Administrador de Fincas';
            
            // Use contact email if available, otherwise try to get from user profile
            const contactEmail = admin.contact_email?.trim() || '';

            const adminData: PropertyAdministrator = {
              id: admin.id,
              user_id: admin.user_id,
              company_name: companyName,
              company_cif: admin.company_cif || `TEMP-${admin.id.substring(0, 8)}`,
              contact_email: contactEmail,
              contact_phone: admin.contact_phone || undefined,
              license_number: admin.license_number || undefined,
              profile: {
                full_name: companyName,
                email: contactEmail
              }
            };

            adminList.push(adminData);
            
            console.log(`✅ ADDED admin ${index + 1}:`, {
              name: adminData.company_name,
              email: adminData.contact_email,
              cif: adminData.company_cif
            });
          } else {
            console.warn(`⚠️ SKIPPED admin ${index + 1}:`, {
              reason: 'Missing basic information',
              company_name: admin.company_name,
              contact_email: admin.contact_email,
              contact_phone: admin.contact_phone
            });
          }
        });
      } else {
        console.log('📋 No administrators found in property_administrators table');
        
        // FALLBACK: Try to load from user_roles table as backup
        console.log('🔄 Trying fallback: loading from user_roles table...');
        await loadAdministratorsFromUserRolesFallback();
        return;
      }

      // ENHANCED LOGGING: Show the final list
      console.log('📊 FINAL ADMIN LIST:', {
        total_count: adminList.length,
        administrators: adminList.map(admin => ({
          name: admin.company_name,
          email: admin.contact_email,
          cif: admin.company_cif,
          id: admin.id.substring(0, 8) + '...'
        }))
      });

      // EXPECTED ADMINISTRATORS CHECK - More flexible matching
      const expectedTerms = ['castro', 'pipaón', 'pipan', 'borja', 'ddayana', 'administracion'];
      const foundExpectedAdmins = adminList.filter(admin => {
        const searchText = (admin.company_name + ' ' + admin.contact_email).toLowerCase();
        return expectedTerms.some(expected => searchText.includes(expected.toLowerCase()));
      });

      console.log('🔍 EXPECTED ADMINISTRATORS CHECK:', {
        expected_terms: expectedTerms,
        found_count: foundExpectedAdmins.length,
        found_administrators: foundExpectedAdmins.map(admin => ({
          name: admin.company_name,
          email: admin.contact_email,
          id: admin.id.substring(0, 8) + '...'
        }))
      });

      // Set the administrators list
      setAvailableAdministrators(adminList);
      
      // Provide feedback based on results
      if (adminList.length === 0) {
        console.warn('❌ NO ADMINISTRATORS FOUND AFTER PROCESSING');
        setError('No se encontraron administradores de fincas en el sistema.');
      } else if (foundExpectedAdmins.length === 0) {
        console.warn('⚠️ ADMINISTRATORS FOUND BUT NOT THE EXPECTED ONES');
        setError(`Se encontraron ${adminList.length} administradores, pero no los esperados. Mostrando todos los disponibles.`);
      } else {
        console.log(`✅ Successfully loaded ${adminList.length} administrators`);
        setError(''); // Clear any previous errors
      }

    } catch (err) {
      console.error('❌ Critical error loading administrators:', err);
      setError('Error crítico al cargar administradores: ' + (err instanceof Error ? err.message : 'Error desconocido'));
      setAvailableAdministrators([]);
    }
  };

  // FALLBACK METHOD: Load administrators from user_roles table
  const loadAdministratorsFromUserRolesFallback = async () => {
    try {
      console.log('🔄 FALLBACK: Loading from user_roles table...');
      
      const { data: adminRoles, error } = await supabase
        .from('user_roles')
        .select(`
          id,
          user_id,
          role_specific_data,
          profiles:user_id (full_name, email)
        `)
        .eq('role_type', 'property_administrator')
        .eq('is_verified', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Fallback loading failed:', error);
        return;
      }

      const fallbackAdmins: PropertyAdministrator[] = [];

      if (adminRoles && adminRoles.length > 0) {
        adminRoles.forEach((role: any) => {
          const roleData = role.role_specific_data || {};
          const profile = role.profiles || {};
          
          const adminData: PropertyAdministrator = {
            id: role.id,
            user_id: role.user_id,
            company_name: roleData.company_name || profile.full_name || 'Administrador de Fincas',
            company_cif: roleData.cif || roleData.company_cif || `FALLBACK-${role.id.substring(0, 8)}`,
            contact_email: roleData.business_email || roleData.contact_email || profile.email || '',
            contact_phone: roleData.business_phone || roleData.contact_phone || undefined,
            license_number: roleData.license_number || roleData.professional_number || undefined,
            profile: {
              full_name: profile.full_name || 'Administrador',
              email: profile.email || ''
            }
          };

          fallbackAdmins.push(adminData);
        });
      }

      console.log('📊 FALLBACK ADMIN LIST:', {
        count: fallbackAdmins.length,
        admins: fallbackAdmins.map(a => ({ name: a.company_name, email: a.contact_email }))
      });

      setAvailableAdministrators(fallbackAdmins);

    } catch (fallbackError) {
      console.error('❌ Fallback method also failed:', fallbackError);
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
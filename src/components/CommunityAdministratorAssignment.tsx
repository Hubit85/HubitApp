import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";
import { UserPlus, Building, Mail, Phone, Search, Loader2, MapPin, Star, Clock, CheckCircle, X, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type ServiceProvider = Database["public"]["Tables"]["service_providers"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type ServiceProviderWithProfile = ServiceProvider & {
  profiles: Profile | null;
};

// Local storage management for simulated assignments
interface CommunityAssignment {
  id: string;
  service_provider_id: string;
  community_name: string;
  assigned_date: string;
  status: "active" | "pending" | "completed";
  assigned_by: string;
}

interface CommunityCode {
  id: string;
  code: string;
  street: string;
  street_number: string;
  city: string;
  province: string;
}

const LOCAL_ASSIGNMENTS_KEY = "hubit_community_assignments";

// Utility functions for local storage management
const getLocalAssignments = (): CommunityAssignment[] => {
  try {
    const stored = localStorage.getItem(LOCAL_ASSIGNMENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveLocalAssignments = (assignments: CommunityAssignment[]) => {
  try {
    localStorage.setItem(LOCAL_ASSIGNMENTS_KEY, JSON.stringify(assignments));
  } catch (error) {
    console.warn("Failed to save assignments to localStorage:", error);
  }
};

const addLocalAssignment = (assignment: CommunityAssignment) => {
  const assignments = getLocalAssignments();
  assignments.push(assignment);
  saveLocalAssignments(assignments);
};

export function CommunityAdministratorAssignment() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();

  const [availableAdmins, setAvailableAdmins] = useState<ServiceProviderWithProfile[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<ServiceProviderWithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [communityName, setCommunityName] = useState("");
  const [recentAssignments, setRecentAssignments] = useState<CommunityAssignment[]>([]);
  const [communityCodes, setCommunityCodes] = useState<CommunityCode[]>([]);
  const [loadingCommunities, setLoadingCommunities] = useState(false);
  const [communityError, setCommunityError] = useState("");

  useEffect(() => {
    if (user) {
      fetchAvailableAdmins();
      loadRecentAssignments();
      loadUserCommunityCodes();
    }
  }, [user]);

  const loadUserCommunityCodes = async () => {
    if (!user?.id) return;

    try {
      setLoadingCommunities(true);
      const { data: properties, error } = await supabase
        .from('properties')
        .select('id, name, address, street, number, city, province, community_code')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        setCommunityError("Error al cargar los códigos de comunidad: " + error.message);
        return;
      }

      const propertiesWithCommunityCode = properties.filter(p => p.community_code);
      const uniqueCommunities: CommunityCode[] = [];
      const seenCodes = new Set<string>();

      propertiesWithCommunityCode.forEach(property => {
        if (property.community_code && !seenCodes.has(property.community_code)) {
          seenCodes.add(property.community_code);
          let street = property.street || '';
          const streetNumber = property.number || '';
          if (!street && property.address) {
            street = property.address.split(',')[0].trim();
          }
          uniqueCommunities.push({
            id: property.id,
            code: property.community_code,
            street: street,
            street_number: streetNumber,
            city: property.city || 'Ciudad no especificada',
            province: property.province || ''
          });
        }
      });

      setCommunityCodes(uniqueCommunities);
      if (uniqueCommunities.length > 0 && !communityName) {
        setCommunityName(uniqueCommunities[0].code);
      }
      setCommunityError("");
    } catch (err) {
      setCommunityError("Error crítico al cargar los códigos de comunidad.");
    } finally {
      setLoadingCommunities(false);
    }
  };
  
  const loadRecentAssignments = () => {
    const assignments = getLocalAssignments();
    const recent = assignments.slice(-10).reverse();
    setRecentAssignments(recent);
  };

  const removeLocalAssignment = (assignmentId: string) => {
    const assignments = getLocalAssignments();
    const filtered = assignments.filter(a => a.id !== assignmentId);
    saveLocalAssignments(filtered);
    loadRecentAssignments();
  };

  const handleDeleteAssignment = async (assignment: CommunityAssignment) => {
    try {
      if (assignment.id.startsWith('real_')) {
        const requestId = assignment.id.replace('real_', '');
        const { AdministratorRequestService } = await import('@/services/AdministratorRequestService');
        const result = await AdministratorRequestService.cancelRequest(requestId);
        if (!result.success) throw new Error(result.message);
      }
      removeLocalAssignment(assignment.id);
      toast({
        title: "✅ Asignación eliminada",
        description: "La asignación ha sido eliminada exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar la asignación.",
        variant: "destructive",
      });
    }
  };

  const fetchAvailableAdmins = async () => {
    try {
      setLoading(true);
      console.log("🔍 [ADMIN-SEARCH] Buscando TODOS los administradores de fincas disponibles...");

      // FIXED: Query property administrators directly from user_roles table
      const baseQuery = supabase
        .from("user_roles")
        .select(`
          id,
          user_id,
          role_specific_data,
          is_verified,
          is_active,
          created_at,
          profiles!user_roles_user_id_fkey (
            id,
            full_name,
            email,
            phone,
            city,
            address
          )
        `)
        .eq("role_type", "property_administrator")
        .eq("is_verified", true)
        .order("created_at", { ascending: false });

      const { data: propertyAdministrators, error: adminError } = await baseQuery;
      
      if (adminError) {
        console.error("❌ [ADMIN-SEARCH] Error fetching property administrators:", adminError);
        throw adminError;
      }

      console.log(`📊 [ADMIN-SEARCH] Found ${propertyAdministrators?.length || 0} verified property administrators`);

      if (!propertyAdministrators || propertyAdministrators.length === 0) {
        console.log("⚠️ [ADMIN-SEARCH] No verified property administrators found");
        setAvailableAdmins([]);
        return;
      }

      // ENHANCED: Transform user_roles data to ServiceProviderWithProfile format for compatibility
      const transformedAdmins: ServiceProviderWithProfile[] = propertyAdministrators
        .filter(admin => admin.profiles) // Only include admins with profile data
        .map((admin, index) => {
          const profileData = admin.profiles as any;
          const roleData = admin.role_specific_data as any || {};
          
          console.log(`👤 [ADMIN-SEARCH] Processing admin ${index + 1}:`, {
            user_id: admin.user_id.substring(0, 8) + '...',
            full_name: profileData?.full_name,
            email: profileData?.email,
            company_name: roleData?.company_name || profileData?.full_name,
            is_verified: admin.is_verified
          });

          // Create a ServiceProvider-compatible object from property administrator data
          const transformedAdmin: ServiceProviderWithProfile = {
            id: admin.id, // Use user_role id as service provider id
            user_id: admin.user_id,
            company_name: roleData?.company_name || profileData?.full_name || 'Administrador de Fincas',
            business_license: roleData?.professional_number || null,
            tax_id: roleData?.cif || null,
            description: `Administrador de fincas profesional${roleData?.company_name ? ` - ${roleData.company_name}` : ''}${profileData?.city ? ` ubicado en ${profileData.city}` : ''}`,
            website: null,
            specialties: ['property_administrator', 'community_management'],
            service_categories: null,
            service_area: profileData?.city ? [profileData.city] : null,
            service_radius: 50, // Default service radius
            verified: admin.is_verified,
            insurance_verified: false,
            background_check: false,
            rating_average: 4.5, // Default rating for property administrators
            rating_count: 1,
            total_jobs_completed: 5, // Default completed jobs
            response_time_hours: 24.0,
            availability_schedule: null,
            emergency_services: false,
            min_project_amount: null,
            travel_cost_per_km: null,
            base_hourly_rate: null,
            portfolio_images: null,
            certifications: roleData?.professional_number ? [roleData.professional_number] : null,
            languages: ['es'],
            is_active: admin.is_active,
            created_at: admin.created_at,
            updated_at: admin.created_at,
            profiles: {
              id: profileData?.id || admin.user_id,
              email: profileData?.email || '',
              full_name: profileData?.full_name || null,
              phone: profileData?.phone || null,
              user_type: 'property_administrator',
              avatar_url: null,
              address: profileData?.address || null,
              city: profileData?.city || null,
              postal_code: null,
              country: 'Spain',
              language: 'es',
              timezone: 'Europe/Madrid',
              email_notifications: true,
              sms_notifications: false,
              is_verified: false,
              verification_code: null,
              last_login: null,
              created_at: admin.created_at,
              updated_at: admin.created_at,
              province: null
            }
          };

          return transformedAdmin;
        });

      // ENHANCED: Apply search filtering if search term is provided
      let filteredAdmins = transformedAdmins;
      
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase().trim();
        filteredAdmins = transformedAdmins.filter(admin => {
          const companyName = admin.company_name?.toLowerCase() || '';
          const fullName = admin.profiles?.full_name?.toLowerCase() || '';
          const email = admin.profiles?.email?.toLowerCase() || '';
          const city = admin.profiles?.city?.toLowerCase() || '';
          
          return companyName.includes(searchLower) ||
                 fullName.includes(searchLower) ||
                 email.includes(searchLower) ||
                 city.includes(searchLower);
        });
        
        console.log(`🔍 [ADMIN-SEARCH] Applied search filter "${searchTerm}": ${filteredAdmins.length}/${transformedAdmins.length} results`);
      }

      // ENHANCED: Sort by company name for better UX
      filteredAdmins.sort((a, b) => {
        const nameA = a.company_name?.toLowerCase() || '';
        const nameB = b.company_name?.toLowerCase() || '';
        return nameA.localeCompare(nameB);
      });

      console.log(`✅ [ADMIN-SEARCH] Final results: ${filteredAdmins.length} property administrators ready for display`);
      
      // Log summary for debugging
      const summary = filteredAdmins.map(admin => ({
        company: admin.company_name,
        name: admin.profiles?.full_name,
        email: admin.profiles?.email,
        city: admin.profiles?.city,
        verified: admin.verified
      }));
      
      console.table(summary);

      setAvailableAdmins(filteredAdmins);

    } catch (error) {
      console.error("❌ [ADMIN-SEARCH] Critical error fetching property administrators:", error);
      toast({
        title: "Error al cargar administradores",
        description: `No se pudieron obtener los administradores de fincas: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: "destructive",
      });
      setAvailableAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAvailableAdmins();
  };

  const handleAssignAdmin = async () => {
    if (!selectedAdmin || !user || !communityName.trim()) {
      toast({
        title: "Información requerida",
        description: "Por favor, selecciona un administrador e introduce/selecciona el nombre de la comunidad.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data: communityMemberRole, error: roleError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', user.id)
        .eq('role_type', 'community_member')
        .eq('is_verified', true)
        .single();

      if (roleError || !communityMemberRole) throw new Error('No se encontró tu rol de miembro de comunidad verificado.');

      const { data: adminRole, error: adminRoleError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', selectedAdmin.user_id)
        .eq('role_type', 'property_administrator')
        .eq('is_verified', true)
        .single();
      
      if (adminRoleError || !adminRole) throw new Error('El proveedor seleccionado no tiene un rol de administrador de fincas verificado.');

      const { AdministratorRequestService } = await import('@/services/AdministratorRequestService');
      
      const requestOptions = {
        communityMemberRoleId: communityMemberRole.id,
        propertyAdministratorRoleId: adminRole.id,
        requestMessage: `Solicitud de asignación para la comunidad ${communityName}.`
      };
      
      const result = await AdministratorRequestService.sendRequestToAdministrator(requestOptions);

      if (result.success) {
        toast({
          title: "✅ Solicitud enviada",
          description: `La solicitud ha sido enviada a ${selectedAdmin.company_name}.`,
        });
        const newAssignment: CommunityAssignment = {
          id: `real_${result.requestId}`,
          service_provider_id: selectedAdmin.id,
          community_name: communityName.trim(),
          assigned_date: new Date().toISOString(),
          status: "pending",
          assigned_by: user.id
        };
        addLocalAssignment(newAssignment);
        loadRecentAssignments();
        setSelectedAdmin(null);
        setCommunityName(communityCodes.length > 0 ? communityCodes[0].code : "");
      } else {
        throw new Error(result.message || 'Error desconocido al enviar la solicitud');
      }
    } catch (error) {
      toast({
        title: "Error en la asignación",
        description: error instanceof Error ? error.message : "No se pudo completar la asignación.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) {
    return (
      <Card className="shadow-lg border-amber-200/60 bg-gradient-to-br from-amber-50/50 to-white">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <UserPlus className="h-12 w-12 text-amber-500/60 mx-auto" />
            <p className="text-neutral-600 font-medium">
              Por favor, inicia sesión para gestionar administradores de comunidad.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {recentAssignments.length > 0 && (
        <Card className="shadow-lg border-green-200/60 bg-gradient-to-br from-green-50/50 to-white">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-lg">
              <CheckCircle className="h-5 w-5" />
              Asignaciones Recientes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {recentAssignments.slice(0, 5).map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200/60 shadow-sm">
                  <div>
                    <p className="font-medium text-neutral-800">{assignment.community_name}</p>
                    <p className="text-sm text-neutral-600">
                      {new Date(assignment.assigned_date).toLocaleDateString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${ assignment.status === "pending" ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white" : "bg-gradient-to-r from-green-500 to-green-600 text-white"}`}>
                      {assignment.status === "pending" ? "Pendiente" : "Activo"}
                    </span>
                    {assignment.status === "pending" && (
                      <Button size="sm" variant="outline" onClick={() => handleDeleteAssignment(assignment)} className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300">
                        <X className="h-3 w-3 mr-1" />
                        Eliminar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-xl border-neutral-200/60 bg-gradient-to-br from-white to-neutral-50/50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Building className="h-6 w-6" />
            Asignar Administrador de Comunidad
          </CardTitle>
          <CardDescription className="text-blue-100">
            Busca y selecciona un administrador de fincas certificado para gestionar una comunidad de propietarios.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <Label htmlFor="community-name" className="text-sm font-semibold text-neutral-700">Nombre de la Comunidad</Label>
            {loadingCommunities ? (
              <div className="flex items-center justify-center h-12 bg-blue-50 rounded-lg border border-blue-300">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span className="ml-2 text-sm text-blue-700">Cargando tus comunidades...</span>
              </div>
            ) : communityCodes.length > 0 ? (
              <Select value={communityName} onValueChange={setCommunityName}>
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 border-neutral-300 focus:border-blue-500 h-12">
                  <SelectValue placeholder="Selecciona una de tus comunidades" />
                </SelectTrigger>
                <SelectContent>
                  {communityCodes.map((community) => (
                    <SelectItem key={community.id} value={community.code}>
                      <div className="flex flex-col">
                        <span className="font-medium">{community.code}</span>
                        <span className="text-xs text-neutral-500">{community.street}, {community.city}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="space-y-2">
                <Input
                  id="community-name"
                  placeholder="Ej: Comunidad Residencial Los Jardines (manual)"
                  value={communityName}
                  onChange={(e) => setCommunityName(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 border-neutral-300 focus:border-blue-500"
                />
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-300 text-amber-700 text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <div>
                    No se encontraron comunidades en &quot;Mis Propiedades&quot;. Puedes introducir un nombre manualmente.
                  </div>
                </div>
              </div>
            )}
            {communityError && <p className="text-sm text-red-500">{communityError}</p>}
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <Label className="text-sm font-semibold text-neutral-700">Buscar Administradores Disponibles</Label>
            <div className="flex gap-3">
              <Input
                placeholder="Buscar por empresa, nombre, email o especialidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 border-neutral-300 focus:border-blue-500"
              />
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </form>

          {loading ? (
            <div className="flex justify-center items-center h-48 bg-gradient-to-br from-neutral-50 to-white rounded-xl border border-neutral-200/60">
              <div className="text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                <p className="text-neutral-600">Cargando administradores...</p>
              </div>
            </div>
          ) : availableAdmins.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-neutral-50 to-white rounded-xl border border-neutral-200/60">
              <Building className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-600 font-medium mb-2">No se encontraron administradores disponibles</p>
              <p className="text-neutral-500 text-sm">Intenta con otros términos de búsqueda.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-neutral-100">
              {availableAdmins.map((admin) => (
                <div
                  key={admin.id}
                  className={`group p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                    selectedAdmin?.id === admin.id
                      ? "border-blue-500 ring-4 ring-blue-500/20 bg-gradient-to-br from-blue-50/50 to-white shadow-lg"
                      : "border-neutral-200/60 hover:border-blue-300/60 bg-gradient-to-br from-white to-neutral-50/30"
                  }`}
                  onClick={() => setSelectedAdmin(admin)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {admin.company_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-neutral-800 group-hover:text-blue-700 transition-colors">{admin.company_name}</h3>
                        <p className="text-neutral-600 flex items-center gap-2"><UserPlus className="h-4 w-4" />{admin.profiles?.full_name || 'Nombre no disponible'}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      {admin.verified && (<Badge variant="secondary" className="bg-green-100 text-green-800">Verificado</Badge>)}
                      {admin.rating_average && admin.rating_average > 0 && (
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="font-semibold text-neutral-700">{admin.rating_average.toFixed(1)}</span>
                          <span className="text-neutral-500">({admin.rating_count})</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-neutral-600"><Mail className="h-4 w-4 text-blue-500" /><span>{admin.profiles?.email || 'Email no disponible'}</span></div>
                    <div className="flex items-center gap-2 text-neutral-600"><Phone className="h-4 w-4 text-green-500" /><span>{admin.profiles?.phone || 'Teléfono no disponible'}</span></div>
                    {admin.profiles?.city && (<div className="flex items-center gap-2 text-neutral-600"><MapPin className="h-4 w-4 text-red-500" /><span>{admin.profiles.city}</span></div>)}
                    {admin.response_time_hours && admin.response_time_hours > 0 && (<div className="flex items-center gap-2 text-neutral-600"><Clock className="h-4 w-4 text-amber-500" /><span>Responde en {admin.response_time_hours}h promedio</span></div>)}
                  </div>
                  
                  {admin.description && (<p className="mt-3 text-sm text-neutral-600 line-clamp-2 bg-neutral-50/50 p-3 rounded-lg border border-neutral-200/30">{admin.description}</p>)}
                </div>
              ))}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between items-center bg-neutral-50/50 border-t border-neutral-200/60">
          <div className="text-sm text-neutral-600">
            {selectedAdmin ? (<span className="font-medium text-blue-600">Seleccionado: {selectedAdmin.company_name}</span>) : ("Selecciona un administrador para continuar")}
          </div>
          <Button onClick={handleAssignAdmin} disabled={!selectedAdmin || !communityName.trim() || isSubmitting} className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50">
            {isSubmitting ? (<Loader2 className="h-4 w-4 mr-2 animate-spin" />) : (<UserPlus className="h-4 w-4 mr-2" />)}
            {isSubmitting ? "Asignando..." : "Asignar Administrador"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

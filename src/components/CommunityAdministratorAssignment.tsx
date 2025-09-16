import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";
import { UserPlus, Building, Mail, Phone, Search, Loader2, Badge, MapPin, Star, Clock, CheckCircle, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

  useEffect(() => {
    if (user) {
      fetchAvailableAdmins();
      loadRecentAssignments();
    }
  }, [user, searchTerm]);

  const loadRecentAssignments = () => {
    const assignments = getLocalAssignments();
    // Show only recent assignments (last 10)
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
      // Si es una asignación real (con prefijo 'real_'), intentar cancelar la solicitud
      if (assignment.id.startsWith('real_')) {
        const requestId = assignment.id.replace('real_', '');
        const { AdministratorRequestService } = await import('@/services/AdministratorRequestService');
        
        const result = await AdministratorRequestService.cancelRequest(requestId);
        
        if (result.success) {
          toast({
            title: "✅ Solicitud eliminada",
            description: result.message,
          });
        } else {
          throw new Error(result.message);
        }
      }
      
      // Eliminar de localStorage (tanto para reales como simuladas)
      removeLocalAssignment(assignment.id);
      
      toast({
        title: "✅ Asignación eliminada",
        description: "La asignación ha sido eliminada exitosamente.",
      });
      
    } catch (error) {
      console.error("Error eliminando asignación:", error);
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar la asignación. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  const fetchAvailableAdmins = async () => {
    try {
      setLoading(true);
      if (!supabase) return;
      
      // Build the query to get service providers first (no joins to avoid relation errors)
      let query = supabase
        .from("service_providers")
        .select("*")
        .eq("is_active", true);

      // Apply search filter if provided
      if (searchTerm.trim()) {
        query = query.or(
          `company_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
        );
      }

      // Order by rating and verification status
      query = query.order("rating_average", { ascending: false });

      const { data: serviceProviders, error } = await query;

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      if (!serviceProviders || serviceProviders.length === 0) {
        setAvailableAdmins([]);
        return;
      }
      
      // Get profiles separately for each service provider
      const providersWithProfiles: ServiceProviderWithProfile[] = [];
      
      for (const provider of serviceProviders) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", provider.user_id)
            .single();
          
          if (!profileError && profile) {
            // Apply search filter here if needed
            if (searchTerm.trim()) {
              const searchLower = searchTerm.toLowerCase();
              const matchesSearch = (
                provider.company_name.toLowerCase().includes(searchLower) ||
                profile.full_name?.toLowerCase().includes(searchLower) ||
                profile.email.toLowerCase().includes(searchLower) ||
                provider.description?.toLowerCase().includes(searchLower)
              );
              
              if (matchesSearch) {
                providersWithProfiles.push({
                  ...provider,
                  profiles: profile
                });
              }
            } else {
              providersWithProfiles.push({
                ...provider,
                profiles: profile
              });
            }
          }
        } catch (profileError) {
          console.warn(`Failed to fetch profile for provider ${provider.id}:`, profileError);
          // Continue with next provider
        }
      }

      setAvailableAdmins(providersWithProfiles);

    } catch (error) {
      console.error("Error fetching administrators:", error);
      toast({
        title: "Error al cargar administradores",
        description: "No se pudieron obtener los administradores disponibles. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
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
        description: "Por favor, selecciona un administrador e introduce el nombre de la comunidad.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('🔄 COMMUNITY ASSIGNMENT: Starting real administrator request process...');
      
      // Get the current user's community_member role ID
      const { data: communityMemberRole, error: roleError } = await supabase
        .from('user_roles')
        .select('id, user_id, role_type')
        .eq('user_id', user.id)
        .eq('role_type', 'community_member')
        .eq('is_verified', true)
        .single();

      if (roleError || !communityMemberRole) {
        throw new Error('No se encontró tu rol de miembro de comunidad verificado');
      }

      console.log('✅ Found community member role:', communityMemberRole.id);

      // Get the selected administrator's property_administrator role ID
      const { data: adminRole, error: adminRoleError } = await supabase
        .from('user_roles')
        .select('id, user_id, role_type')
        .eq('user_id', selectedAdmin.user_id)
        .eq('role_type', 'property_administrator')
        .eq('is_verified', true)
        .single();

      if (adminRoleError || !adminRole) {
        throw new Error('No se encontró el rol de administrador verificado para el proveedor seleccionado');
      }

      console.log('✅ Found administrator role:', adminRole.id);

      // Use the real AdministratorRequestService
      const { AdministratorRequestService } = await import('@/services/AdministratorRequestService');
      
      const result = await AdministratorRequestService.sendRequestToAdministrator({
        communityMemberRoleId: communityMemberRole.id,
        propertyAdministratorRoleId: adminRole.id,
        requestMessage: `Solicito que ${selectedAdmin.company_name} sea asignado como administrador de la comunidad "${communityName}". Esta solicitud se realiza a través del sistema HuBiT para gestión de incidencias y administración de la comunidad.`
      });

      if (result.success) {
        console.log('✅ COMMUNITY ASSIGNMENT: Request sent successfully');
        
        toast({
          title: "✅ Solicitud enviada exitosamente",
          description: `Se ha enviado la solicitud a ${selectedAdmin.company_name} para gestionar la comunidad "${communityName}". Recibirás una notificación cuando responda.`,
        });
        
        // Reset form
        setSelectedAdmin(null);
        setCommunityName("");
        
        // Simulate processing time for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update recent assignments for display (combining real and demo data)
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
        
      } else {
        throw new Error(result.message || 'Error al enviar la solicitud');
      }
      
    } catch (error) {
      console.error("❌ COMMUNITY ASSIGNMENT: Error in assignment process:", error);
      
      let errorMessage = "No se pudo completar la asignación.";
      if (error instanceof Error) {
        if (error.message.includes('rol')) {
          errorMessage = "Error: " + error.message + ". Verifica que tienes los roles correctos.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error en la asignación",
        description: errorMessage + " Por favor, intenta nuevamente.",
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
      {/* Recent Assignments Preview */}
      {recentAssignments.length > 0 && (
        <Card className="shadow-lg border-green-200/60 bg-gradient-to-br from-green-50/50 to-white">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-lg">
              <CheckCircle className="h-5 w-5" />
              Asignaciones Recientes
            </CardTitle>
            <CardDescription className="text-green-100">
              Últimas asignaciones de administradores realizadas (demostración local)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {recentAssignments.slice(0, 5).map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200/60 shadow-sm">
                  <div>
                    <p className="font-medium text-neutral-800">{assignment.community_name}</p>
                    <p className="text-sm text-neutral-600">
                      {new Date(assignment.assigned_date).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${
                      assignment.status === "pending" 
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white" 
                        : "bg-gradient-to-r from-green-500 to-green-600 text-white"
                    }`}>
                      {assignment.status === "pending" ? "Pendiente" : "Activo"}
                    </span>
                    {assignment.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteAssignment(assignment)}
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-200"
                      >
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
            <span className="block mt-1 text-blue-200 text-sm font-medium">
              🔄 Modo Demostración: Las asignaciones se almacenan localmente
            </span>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          {/* Community Name Input */}
          <div className="space-y-2">
            <Label htmlFor="community-name" className="text-sm font-semibold text-neutral-700">
              Nombre de la Comunidad
            </Label>
            <Input
              id="community-name"
              placeholder="Ej: Comunidad Residencial Los Jardines"
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 border-neutral-300 focus:border-blue-500"
            />
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <Label className="text-sm font-semibold text-neutral-700">
              Buscar Administradores Disponibles
            </Label>
            <div className="flex gap-3">
              <Input
                placeholder="Buscar por empresa, nombre, email o especialidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 border-neutral-300 focus:border-blue-500"
              />
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </form>

          {/* Results */}
          {loading ? (
            <div className="flex justify-center items-center h-48 bg-gradient-to-br from-neutral-50 to-white rounded-xl border border-neutral-200/60">
              <div className="text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                <p className="text-neutral-600">Cargando administradores disponibles...</p>
              </div>
            </div>
          ) : availableAdmins.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-neutral-50 to-white rounded-xl border border-neutral-200/60">
              <Building className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-600 font-medium mb-2">
                No se encontraron administradores disponibles
              </p>
              <p className="text-neutral-500 text-sm">
                Intenta con términos de búsqueda diferentes o verifica más tarde.
              </p>
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
                        <h3 className="font-bold text-lg text-neutral-800 group-hover:text-blue-700 transition-colors">
                          {admin.company_name}
                        </h3>
                        <p className="text-neutral-600 flex items-center gap-2">
                          <UserPlus className="h-4 w-4" />
                          {admin.profiles?.full_name || 'Nombre no disponible'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      {admin.verified && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full shadow-md">
                          <Badge className="h-3 w-3" />
                          Verificado
                        </span>
                      )}
                      {admin.rating_average && admin.rating_average > 0 && (
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="font-semibold text-neutral-700">
                            {admin.rating_average.toFixed(1)}
                          </span>
                          <span className="text-neutral-500">({admin.rating_count})</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-neutral-600">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <span>{admin.profiles?.email || 'Email no disponible'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600">
                      <Phone className="h-4 w-4 text-green-500" />
                      <span>{admin.profiles?.phone || 'Teléfono no disponible'}</span>
                    </div>
                    {admin.profiles?.city && (
                      <div className="flex items-center gap-2 text-neutral-600">
                        <MapPin className="h-4 w-4 text-red-500" />
                        <span>{admin.profiles.city}</span>
                      </div>
                    )}
                    {admin.response_time_hours && admin.response_time_hours > 0 && (
                      <div className="flex items-center gap-2 text-neutral-600">
                        <Clock className="h-4 w-4 text-amber-500" />
                        <span>Responde en {admin.response_time_hours}h promedio</span>
                      </div>
                    )}
                  </div>
                  
                  {admin.description && (
                    <p className="mt-3 text-sm text-neutral-600 line-clamp-2 bg-neutral-50/50 p-3 rounded-lg border border-neutral-200/30">
                      {admin.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between items-center bg-neutral-50/50 border-t border-neutral-200/60">
          <div className="text-sm text-neutral-600">
            {selectedAdmin ? (
              <span className="font-medium text-blue-600">
                Seleccionado: {selectedAdmin.company_name}
              </span>
            ) : (
              "Selecciona un administrador para continuar"
            )}
          </div>
          <Button 
            onClick={handleAssignAdmin} 
            disabled={!selectedAdmin || !communityName.trim() || isSubmitting}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4 mr-2" />
            )}
            {isSubmitting ? "Asignando..." : "Asignar Administrador"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
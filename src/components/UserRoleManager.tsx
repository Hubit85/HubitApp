import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { SupabaseUserRoleService, UserRole } from "@/services/SupabaseUserRoleService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, UserCheck, Clock, User, Users, Building, Settings, Home } from "lucide-react";

export default function UserRoleManager() {
  const { user, profile } = useSupabaseAuth();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (user) {
      setError("");
      setSuccessMessage("");
      
      console.log('🎭 UserRoleManager: Loading roles for user', {
        userId: user.id,
        userEmail: user.email,
        profileUserType: profile?.user_type,
        profileEmail: profile?.email
      });
      
      loadUserRoles();
    }
  }, [user, profile]);

  const loadUserRoles = async () => {
    if (!user?.id) {
      console.warn('⚠️ UserRoleManager: No user ID available');
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      console.log('🔄 Frontend UserRoleManager: Loading user roles...', {
        userId: user.id,
        userEmail: user.email
      });
      
      // CRITICAL FIX: Multi-layered approach to role loading
      let roles: UserRole[] = [];
      let loadingMethod = '';
      
      // Method 1: Try service first (normal path)
      try {
        console.log('🔄 METHOD 1: Using SupabaseUserRoleService...');
        roles = await SupabaseUserRoleService.getUserRoles(user.id);
        loadingMethod = 'service';
        
        console.log('📊 Service result:', {
          rolesCount: roles.length,
          roles: roles.map(r => r.role_type)
        });
        
      } catch (serviceError) {
        console.warn('❌ Service method failed:', serviceError);
        
        // Method 2: Direct database fallback
        try {
          console.log('🔄 METHOD 2: Direct database query fallback...');
          const { data: directRoles, error: directError } = await supabase
            .from('user_roles')
            .select(`
              id,
              user_id,
              role_type,
              is_verified,
              is_active,
              role_specific_data,
              verification_token,
              verification_expires_at,
              verification_confirmed_at,
              created_at,
              updated_at
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });
          
          if (directError) {
            throw directError;
          }
          
          roles = (directRoles || []) as UserRole[];
          loadingMethod = 'direct';
          
          console.log('📊 Direct database result:', {
            rolesCount: roles.length,
            roles: roles.map(r => r.role_type)
          });
          
        } catch (directError) {
          console.error('❌ Direct database method also failed:', directError);
          throw directError;
        }
      }
      
      // Set the roles we found
      setUserRoles(roles);
      
      // Find and set current active role
      const activeRole = roles.find(r => r.is_active) || null;
      setCurrentRole(activeRole);
      
      console.log(`✅ UserRoleManager: Roles loaded successfully via ${loadingMethod}:`, {
        rolesCount: roles.length,
        activeRole: activeRole?.role_type || 'none',
        method: loadingMethod
      });
      
      // Success messaging
      if (roles.length > 0) {
        const verifiedRoles = roles.filter(r => r.is_verified);
        
        let message = `✅ ${roles.length} rol(es) cargado(s) correctamente`;
        if (loadingMethod !== 'service') {
          message += ` (método: ${loadingMethod})`;
        }
        
        if (verifiedRoles.length > 0) {
          message += `. ${verifiedRoles.length} activo(s).`;
        }
        
        setSuccessMessage(message);
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 8000);
        
      } else {
        // Still no roles found after all methods
        console.warn('⚠️ NO ROLES FOUND after all recovery attempts', {
          userId: user.id,
          userEmail: user.email,
          profileUserType: profile?.user_type,
          methodsAttempted: ['service', 'direct']
        });
        
        if (profile?.user_type) {
          setError(`🔄 No se encontraron roles, pero tienes el tipo "${profile.user_type}" en tu perfil. Los roles se crean automáticamente durante el registro. Si acabas de registrarte, cierra sesión y vuelve a entrar.`);
        } else {
          setError("No se encontraron roles. Los roles se crean automáticamente durante el registro. Si tienes problemas, contacta con soporte.");
        }
      }

    } catch (err) {
      console.error("❌ Frontend UserRoleManager: Error loading user roles:", err);
      
      // Enhanced error handling with specific guidance
      let errorMessage = "Error al cargar roles: ";
      
      if (err instanceof Error) {
        if (err.message.includes('NetworkError') || err.message.includes('fetch')) {
          errorMessage += "Problema de conexión. Verifica tu internet y recarga la página.";
        } else if (err.message.includes('401') || err.message.includes('403')) {
          errorMessage += "Sesión expirada. Cierra sesión y vuelve a iniciar sesión.";
        } else if (err.message.includes('500')) {
          errorMessage += "Error del servidor. Intenta recargar la página en unos momentos.";
        } else if (err.message.includes('PGRST')) {
          errorMessage += "Error de base de datos. Contacta con soporte técnico si persiste.";
        } else {
          errorMessage += err.message;
        }
      } else {
        errorMessage += "Error desconocido. Intenta recargar la página.";
      }
      
      setError(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  const handleActivateRole = async (roleType: UserRole['role_type']) => {
    if (!user) return;

    try {
      setSubmitting(true);
      setError("");
      setSuccessMessage("");

      const result = await SupabaseUserRoleService.activateRole(user.id, roleType);

      if (result.success) {
        setSuccessMessage(result.message);
        await loadUserRoles();
        // Recargar la página para actualizar la interfaz con el nuevo rol
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Error activating role:", error);
      setError("Error al activar el rol");
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleIcon = (roleType: UserRole['role_type']) => {
    switch (roleType) {
      case 'particular': return <User className="h-4 w-4" />;
      case 'community_member': return <Users className="h-4 w-4" />;
      case 'service_provider': return <Building className="h-4 w-4" />;
      case 'property_administrator': return <Settings className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-pulse text-center">
            <User className="h-8 w-8 mx-auto mb-2 text-neutral-400" />
            <p className="text-sm text-neutral-600">Cargando roles...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-white to-neutral-50 border-neutral-200/60 shadow-lg shadow-neutral-900/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <UserCheck className="h-6 w-6 text-emerald-600" />
            <div>
              <CardTitle className="text-xl font-semibold">Mis Roles</CardTitle>
              <CardDescription>Visualiza y cambia entre tus diferentes roles en HuBiT</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Success/Error Messages */}
          {(error || successMessage) && (
            <Alert className={`border-2 ${
              error 
                ? "border-red-200 bg-red-50" 
                : "border-green-200 bg-green-50"
            }`}>
              <AlertDescription className={`font-medium ${
                error ? "text-red-800" : "text-green-800"
              }`}>
                {error || successMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Current Roles */}
          <div className="space-y-4">
            <h3 className="font-medium text-neutral-900 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Tus Roles ({userRoles.length})
            </h3>
            
            {userRoles.length === 0 ? (
              <div className="text-center py-8 bg-neutral-50/50 rounded-lg border border-dashed border-neutral-200">
                <User className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                <p className="text-neutral-600 mb-2">No tienes roles configurados</p>
                <p className="text-sm text-neutral-500">Los roles se crean automáticamente durante el registro</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {userRoles.map((role) => (
                  <div 
                    key={role.id} 
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      role.is_active 
                        ? 'border-emerald-200 bg-emerald-50/50 shadow-sm' 
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          role.is_active 
                            ? 'bg-emerald-100 text-emerald-600' 
                            : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          {getRoleIcon(role.role_type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-neutral-900 flex items-center gap-2">
                            {SupabaseUserRoleService.getRoleDisplayName(role.role_type)}
                            {role.is_active && (
                              <Badge variant="default" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                                Activo
                              </Badge>
                            )}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            {role.is_verified ? (
                              <div className="flex items-center gap-1 text-emerald-600">
                                <CheckCircle className="h-3 w-3" />
                                <span className="text-xs">Verificado</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-amber-600">
                                <Clock className="h-3 w-3" />
                                <span className="text-xs">Pendiente</span>
                              </div>
                            )}
                            <span className="text-xs text-neutral-500">
                              Creado: {role.created_at ? new Date(role.created_at).toLocaleDateString() : 'Fecha desconocida'}
                            </span>
                          </div>

                          {(() => {
                            if (role.role_type === 'community_member') {
                              // Safe type guard for role_specific_data
                              const hasValidData = role.role_specific_data && 
                                                   typeof role.role_specific_data === 'object' && 
                                                   !Array.isArray(role.role_specific_data) &&
                                                   role.role_specific_data !== null;
                              
                              if (hasValidData) {
                                const data = role.role_specific_data as Record<string, string>;
                                const communityCode = data.community_code || '';
                                const communityName = data.community_name || '';
                                const apartmentNumber = data.apartment_number || '';
                                
                                return (
                                  <div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-200">
                                    <div className="flex items-center gap-1 text-blue-700">
                                      <Home className="h-3 w-3" />
                                      <span className="text-xs font-medium">
                                        Comunidad: {communityCode ? (communityName || communityCode) : 'No asignada'}
                                      </span>
                                    </div>
                                    {apartmentNumber && (
                                      <div className="text-xs text-blue-600 mt-1">
                                        {apartmentNumber}
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                            }
                            return null;
                          })()}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {role.is_verified && !role.is_active && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleActivateRole(role.role_type)}
                            disabled={submitting}
                            className="bg-transparent hover:bg-emerald-50"
                          >
                            Activar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {userRoles.length > 1 && (
            <div className="space-y-3">
              <h3 className="font-medium text-neutral-900">Cambio Rápido de Rol</h3>
              <div className="flex flex-wrap gap-2">
                {userRoles
                  .filter(role => role.is_verified)
                  .map((role) => (
                    <Button
                      key={role.id}
                      variant={role.is_active ? "default" : "outline"}
                      size="sm"
                      onClick={() => !role.is_active && handleActivateRole(role.role_type)}
                      disabled={role.is_active || submitting}
                      className={role.is_active 
                        ? "bg-emerald-600 hover:bg-emerald-700" 
                        : "bg-transparent hover:bg-emerald-50"
                      }
                    >
                      {getRoleIcon(role.role_type)}
                      <span className="ml-2">
                        {SupabaseUserRoleService.getRoleDisplayName(role.role_type)}
                      </span>
                      {role.is_active && <CheckCircle className="h-3 w-3 ml-2" />}
                    </Button>
                ))}
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200/60">
            <h4 className="font-medium text-blue-900 mb-2">💡 Información sobre Roles</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Los roles se crean automáticamente durante el registro</li>
              <li>• Puedes tener múltiples roles pero solo uno activo a la vez</li>
              <li>• Cambia entre roles fácilmente desde aquí</li>
              <li>• Cada rol tiene acceso a diferentes funcionalidades</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
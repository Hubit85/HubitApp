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
import { CheckCircle, UserCheck, Clock, User, Users, Building, Settings, Home, ArrowRight, Zap } from "lucide-react";

export default function UserRoleManager() {
  const { user, profile, activateRole, refreshRoles, userRoles, activeRole } = useSupabaseAuth();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (user) {
      setError("");
      setSuccessMessage("");
    }
  }, [user, profile]);

  const handleActivateRole = async (roleType: UserRole['role_type']) => {
    if (!user) return;

    try {
      setSubmitting(true);
      setError("");
      setSuccessMessage("");

      const result = await activateRole(roleType);

      if (result.success) {
        setSuccessMessage(`¡Perfecto! Ahora estás usando el rol de ${SupabaseUserRoleService.getRoleDisplayName(roleType)}`);
        await refreshRoles();
        
        // Auto-refresh page to update interface
        setTimeout(() => {
          window.location.reload();
        }, 1500);
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
      case 'particular': return <User className="h-5 w-5" />;
      case 'community_member': return <Users className="h-5 w-5" />;
      case 'service_provider': return <Building className="h-5 w-5" />;
      case 'property_administrator': return <Settings className="h-5 w-5" />;
      default: return <User className="h-5 w-5" />;
    }
  };

  const getRoleColor = (roleType: UserRole['role_type'], isActive: boolean = false) => {
    const colors: Record<UserRole['role_type'], string> = {
      'particular': isActive ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-blue-50 text-blue-700',
      'community_member': isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-green-50 text-green-700',
      'service_provider': isActive ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-purple-50 text-purple-700',
      'property_administrator': isActive ? 'bg-orange-100 text-orange-800 border-orange-200' : 'bg-orange-50 text-orange-700'
    };
    return colors[roleType] || (isActive ? 'bg-gray-100 text-gray-800 border-gray-200' : 'bg-gray-50 text-gray-700');
  };

  const verifiedRoles = userRoles.filter(role => Boolean(role.is_verified));

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

      {/* Quick Role Selector */}
      {verifiedRoles.length > 1 && (
        <Card className="bg-gradient-to-br from-white to-blue-50/30 border-blue-200/60 shadow-lg shadow-blue-900/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-blue-900">Cambio Rápido de Rol</CardTitle>
                <CardDescription>Selecciona el rol que quieres usar ahora mismo</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {verifiedRoles.map((role) => {
                const isActive = role.is_active;
                const colorClasses = getRoleColor(role.role_type, isActive);
                
                return (
                  <div
                    key={role.id}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-md ${
                      isActive 
                        ? 'border-emerald-200 bg-emerald-50 shadow-emerald-100' 
                        : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/30'
                    }`}
                    onClick={() => !isActive && !submitting && handleActivateRole(role.role_type)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${colorClasses}`}>
                          {getRoleIcon(role.role_type)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            {SupabaseUserRoleService.getRoleDisplayName(role.role_type)}
                            {isActive && (
                              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">
                                ✓ ACTIVO
                              </Badge>
                            )}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {role.role_type === 'particular' && 'Usuario individual'}
                            {role.role_type === 'community_member' && 'Residente de comunidad'}
                            {role.role_type === 'service_provider' && 'Empresa o autónomo'}
                            {role.role_type === 'property_administrator' && 'Gestión de propiedades'}
                          </p>
                        </div>
                      </div>
                      
                      {!isActive && (
                        <div className="flex items-center">
                          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      )}
                      
                      {isActive && (
                        <div className="absolute -top-2 -right-2">
                          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>

                    {!isActive && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <Button
                          size="sm"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActivateRole(role.role_type);
                          }}
                          disabled={submitting}
                        >
                          {submitting ? 'Cambiando...' : 'Usar este rol'}
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Role Information */}
      <Card className="bg-gradient-to-br from-white to-neutral-50 border-neutral-200/60 shadow-lg shadow-neutral-900/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <UserCheck className="h-6 w-6 text-emerald-600" />
            <div>
              <CardTitle className="text-xl font-semibold">Todos Mis Roles</CardTitle>
              <CardDescription>Información completa de tus roles en HuBiT</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
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
                            className="bg-transparent hover:bg-emerald-50 border-emerald-300 text-emerald-700"
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

          {/* Help Text */}
          <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200/60">
            <h4 className="font-medium text-blue-900 mb-2">💡 Información sobre Cambio de Roles</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Cambio instantáneo:</strong> Selecciona un rol y la interfaz se actualizará automáticamente</li>
              <li>• <strong>Solo un rol activo:</strong> Puedes tener múltiples roles pero solo uno activo a la vez</li>
              <li>• <strong>Funcionalidades específicas:</strong> Cada rol tiene acceso a diferentes herramientas</li>
              <li>• <strong>Datos seguros:</strong> Toda tu información se mantiene al cambiar entre roles</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
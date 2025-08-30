
import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { SupabaseUserRoleService, UserRole, AddRoleRequest } from "@/services/SupabaseUserRoleService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, Plus, UserCheck, Mail, Clock, Trash2, User, Users, Building, Settings, AlertTriangle, Loader2 } from "lucide-react";

export default function UserRoleManager() {
  const { user, profile } = useSupabaseAuth();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(""); // ARREGLO: Iniciar sin mensaje de error
  const [successMessage, setSuccessMessage] = useState("");
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [newRoleType, setNewRoleType] = useState<UserRole['role_type'] | "">("");
  const [showClearPendingModal, setShowClearPendingModal] = useState(false);

  useEffect(() => {
    if (user) {
      // ARREGLO: Limpiar mensajes al cargar
      setError("");
      setSuccessMessage("");
      loadUserRoles();
    }
  }, [user]);

  const loadUserRoles = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError("");
      
      console.log('🔄 Frontend: Loading user roles...');
      const roles = await SupabaseUserRoleService.getUserRoles(user.id);
      setUserRoles(roles);
      
      const activeRole = await SupabaseUserRoleService.getActiveRole(user.id);
      setCurrentRole(activeRole);

      console.log('✅ Frontend: Roles loaded successfully:', roles.length);

    } catch (err) {
      console.error("❌ Frontend: Error loading user roles:", err);
      
      // Manejo más específico de errores de carga
      if (err instanceof Error) {
        if (err.message.includes('NetworkError') || err.message.includes('fetch')) {
          setError("Error de conexión: No se pudieron cargar los roles. Verifica tu conexión a internet.");
        } else if (err.message.includes('401') || err.message.includes('403')) {
          setError("Sesión expirada: Por favor cierra sesión y vuelve a iniciar sesión.");
        } else if (err.message.includes('500')) {
          setError("Error del servidor: Problema temporal con la base de datos. Intenta recargar la página.");
        } else if (err.message.includes('PGRST')) {
          setError("Error de base de datos: Problema con la consulta de datos. El equipo técnico ha sido notificado.");
        } else {
          setError(`Error al cargar roles: ${err.message}`);
        }
      } else {
        setError("Error desconocido al cargar los roles. Intenta recargar la página.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = async () => {
    if (!user?.id || !newRoleType) return;

    try {
      setSubmitting(true);
      setError("");
      setSuccessMessage("");

      const request: AddRoleRequest = {
        role_type: newRoleType,
        role_specific_data: {}
      };

      console.log('🔄 Frontend: Calling addRole service...');
      const result = await SupabaseUserRoleService.addRole(user.id, request);
      
      console.log('📡 Frontend: Service response:', result);
      
      if (result.success) {
        setSuccessMessage(result.message);
        setNewRoleType("");
        setShowAddRoleModal(false);
        
        // Recargar roles después de agregar
        await loadUserRoles();
      } else {
        // Mostrar el mensaje de error específico de la API
        setError(result.message || "Error desconocido al agregar el rol");
        
        // Si hay detalles adicionales del error, agregarlos
        if (result.errorCode) {
          console.error(`❌ Frontend: API Error Code: ${result.errorCode}`);
        }
        
        if (result.emailError && result.emailErrorDetails) {
          setError(`${result.message} - ${result.emailErrorDetails}`);
        }
      }

    } catch (err) {
      console.error("❌ Frontend: Error adding role:", err);
      
      // Manejo de errores más específico para diferentes tipos de fallas
      if (err instanceof Error) {
        if (err.message.includes('NetworkError') || err.message.includes('fetch')) {
          setError("Error de red: No se pudo conectar con el servidor. Verifica tu conexión a internet.");
        } else if (err.message.includes('500')) {
          setError("Error interno del servidor. El equipo técnico ha sido notificado.");
        } else if (err.message.includes('401') || err.message.includes('403')) {
          setError("Error de autorización: Tu sesión puede haber expirado. Intenta cerrar sesión y volver a iniciar.");
        } else if (err.message.includes('400')) {
          setError("Datos de solicitud inválidos. Verifica la información e intenta nuevamente.");
        } else if (err.message.includes('timeout')) {
          setError("La solicitud tardó demasiado tiempo. Intenta nuevamente en unos momentos.");
        } else {
          setError(`Error técnico: ${err.message}`);
        }
      } else {
        setError("Error inesperado. Si el problema persiste, contacta al soporte técnico.");
      }
    } finally {
      setSubmitting(false);
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

  const handleRemoveRole = async (roleType: UserRole['role_type']) => {
    if (!user) return;

    if (!confirm(`¿Estás seguro de que quieres eliminar tu rol de ${SupabaseUserRoleService.getRoleDisplayName(roleType)}?`)) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccessMessage("");

      const result = await SupabaseUserRoleService.removeRole(user.id, roleType);

      if (result.success) {
        setSuccessMessage(result.message);
        await loadUserRoles();
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Error removing role:", error);
      setError("Error al eliminar el rol");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClearPendingVerifications = async () => {
    if (!user?.id) return;

    try {
      setSubmitting(true);
      setError("");
      setSuccessMessage("");

      const result = await SupabaseUserRoleService.clearPendingVerifications(user.id);
      
      if (result.success) {
        setSuccessMessage(result.message);
        setShowClearPendingModal(false);
        await loadUserRoles();
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Error clearing pending verifications:", error);
      setError("Error al limpiar las verificaciones pendientes");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemovePendingRole = async (roleType: UserRole['role_type']) => {
    if (!user?.id) return;

    try {
      setSubmitting(true);
      setError("");
      setSuccessMessage("");

      const result = await SupabaseUserRoleService.removePendingRole(user.id, roleType);
      
      if (result.success) {
        setSuccessMessage(result.message);
        await loadUserRoles();
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Error removing pending role:", error);
      setError("Error al eliminar la verificación pendiente");
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

  const getAvailableRoles = () => {
    const allRoles = SupabaseUserRoleService.getAllRoleTypes();
    const existingRoleTypes = userRoles.map(r => r.role_type);
    return allRoles.filter(role => !existingRoleTypes.includes(role.value));
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserCheck className="h-6 w-6 text-emerald-600" />
              <div>
                <CardTitle className="text-xl font-semibold">Gestión de Roles</CardTitle>
                <CardDescription>Administra tus diferentes roles en HuBiT</CardDescription>
              </div>
            </div>
            
            {getAvailableRoles().length > 0 && (
              <Dialog open={showAddRoleModal} onOpenChange={setShowAddRoleModal}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Rol
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agregar Nuevo Rol</DialogTitle>
                    <DialogDescription>
                      Selecciona un nuevo rol para tu cuenta. Recibirás un email de verificación.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Select value={newRoleType} onValueChange={(value: UserRole['role_type']) => setNewRoleType(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableRoles().map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            <div className="flex items-center gap-2">
                              {getRoleIcon(role.value)}
                              <div>
                                <div className="font-medium">{role.label}</div>
                                <div className="text-sm text-neutral-500">{role.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddRoleModal(false)}
                      disabled={submitting}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleAddRole} 
                      disabled={!newRoleType || submitting}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {submitting ? "Agregando..." : "Agregar Rol"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            
            {/* Botón para limpiar verificaciones pendientes */}
            {userRoles.some(role => !role.is_verified) && (
              <Dialog open={showClearPendingModal} onOpenChange={setShowClearPendingModal}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-amber-700 border-amber-300 hover:bg-amber-50">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Limpiar Pendientes
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Limpiar Verificaciones Pendientes</DialogTitle>
                    <DialogDescription>
                      Esto eliminará todos los roles que están pendientes de verificación. Esta acción no se puede deshacer.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-amber-800 mb-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">Roles que se eliminarán:</span>
                      </div>
                      <ul className="text-sm text-amber-700 space-y-1">
                        {userRoles
                          .filter(role => !role.is_verified)
                          .map(role => (
                            <li key={role.id} className="flex items-center gap-2">
                              {getRoleIcon(role.role_type)}
                              {SupabaseUserRoleService.getRoleDisplayName(role.role_type)}
                            </li>
                          ))
                        }
                      </ul>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowClearPendingModal(false)}
                      disabled={submitting}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleClearPendingVerifications} 
                      disabled={submitting}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Eliminando...
                        </>
                      ) : (
                        "Eliminar Todas"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
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
                {successMessage && successMessage.includes("verificación") && (
                  <div className="mt-2 text-sm text-green-700">
                    💡 Si no recibes el email en unos minutos, revisa tu carpeta de spam.
                  </div>
                )}
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
                <p className="text-sm text-neutral-500">Agrega un rol para empezar a usar HuBiT</p>
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
                                <span className="text-xs">Pendiente de verificación</span>
                              </div>
                            )}
                            <span className="text-xs text-neutral-500">
                              Creado: {new Date(role.created_at).toLocaleDateString()}
                            </span>
                          </div>
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
                        
                        {!role.is_verified && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-amber-500" />
                            <span className="text-xs text-amber-600">Revisa tu email</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemovePendingRole(role.role_type)}
                              disabled={submitting}
                              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 ml-2"
                              title="Eliminar verificación pendiente"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveRole(role.role_type)}
                          disabled={submitting || (userRoles.filter(r => r.is_verified).length <= 1 && role.is_verified)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title={role.is_verified ? "Eliminar rol verificado" : "Eliminar rol"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {!role.is_verified && (
                      <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-amber-800">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm font-medium">Verificación Pendiente</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemovePendingRole(role.role_type)}
                            disabled={submitting}
                            className="text-amber-700 hover:text-amber-800 hover:bg-amber-100"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                        <p className="text-xs text-amber-700 mt-1">
                          Se ha enviado un email de verificación. El enlace expira en 24 horas.
                        </p>
                      </div>
                    )}
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
            <h4 className="font-medium text-blue-900 mb-2">💡 Información sobre Roles Múltiples</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Puedes tener múltiples roles pero solo uno activo a la vez</li>
              <li>• Cada nuevo rol requiere verificación por email</li>
              <li>• Cambia entre roles fácilmente desde aquí</li>
              <li>• Cada rol tiene acceso a diferentes funcionalidades</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
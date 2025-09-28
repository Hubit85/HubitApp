import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { SupabaseUserRoleService, UserRole } from "@/services/SupabaseUserRoleService";
import { CrossRoleDataSync } from "@/components/CrossRoleDataSync";
import { PropertySyncManager } from "@/components/PropertySyncManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Link2, Settings, Users, Building2, Home, ArrowRight, CheckCircle, 
  Clock, Zap, Info, RefreshCw, MessageSquare, FileCheck
} from "lucide-react";

interface ThreadProgress {
  threadId: string;
  threadName: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  progress: number;
  features: string[];
  lastUpdate: string;
}

interface CrossRoleCapabilities {
  totalRoles: number;
  verifiedRoles: number;
  syncCapabilities: string[];
  availableThreads: ThreadProgress[];
}

export function CrossRoleThreadManager() {
  const { user } = useSupabaseAuth();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [capabilities, setCapabilities] = useState<CrossRoleCapabilities | null>(null);
  const [currentThread, setCurrentThread] = useState<string>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (user) {
      loadCapabilities();
    }
  }, [user]);

  const loadCapabilities = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError("");

      const roles = await SupabaseUserRoleService.getUserRoles(user.id);
      const verifiedRoles = roles.filter(role => role.is_verified);
      setUserRoles(roles);

      // Determine sync capabilities based on verified roles
      const syncCapabilities = [];
      if (verifiedRoles.length >= 2) {
        syncCapabilities.push("Sincronización de Propiedades");
        syncCapabilities.push("Gestión de Documentos Cross-Role");
        
        if (verifiedRoles.some(r => r.role_type === 'property_administrator')) {
          syncCapabilities.push("Administración Unificada");
        }
        
        if (verifiedRoles.some(r => r.role_type === 'service_provider')) {
          syncCapabilities.push("Historial de Servicios Integrado");
        }
      }

      // Define available threads based on user's role combination
      const availableThreads: ThreadProgress[] = [
        {
          threadId: 'thread-1',
          threadName: 'Sistema de Roles Múltiples',
          description: 'Gestión y verificación de roles de usuario con capacidades cross-role',
          status: 'completed',
          progress: 100,
          features: ['Verificación por Email', 'Cambio de Rol Dinámico', 'Gestión de Permisos'],
          lastUpdate: '2025-09-06'
        },
        {
          threadId: 'thread-2',
          threadName: 'Sincronización Cross-Role Avanzada',
          description: 'Sincronización de propiedades y datos entre diferentes roles con opciones configurables',
          status: verifiedRoles.length >= 2 ? 'completed' : 'pending',
          progress: verifiedRoles.length >= 2 ? 100 : 60,
          features: [
            'Sincronización de Propiedades',
            'Gestión de Documentos',
            'Historial de Contratos',
            'Opciones de Sincronización Avanzadas'
          ],
          lastUpdate: '2025-09-06'
        },
        {
          threadId: 'thread-3',
          threadName: 'Dashboard Unificado Inteligente',
          description: 'Dashboard adaptativo que muestra información relevante según el rol activo',
          status: 'in-progress',
          progress: 75,
          features: [
            'Vista Contextual por Rol',
            'Widgets Inteligentes',
            'Notificaciones Cross-Role',
            'Analytics Unificados'
          ],
          lastUpdate: '2025-09-06'
        }
      ];

      setCapabilities({
        totalRoles: roles.length,
        verifiedRoles: verifiedRoles.length,
        syncCapabilities,
        availableThreads
      });

    } catch (err) {
      console.error("Error loading cross-role capabilities:", err);
      setError("Error al cargar las capacidades de roles múltiples");
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (roleType: UserRole['role_type']) => {
    switch (roleType) {
      case 'particular': return <Home className="h-4 w-4" />;
      case 'community_member': return <Users className="h-4 w-4" />;
      case 'service_provider': return <Building2 className="h-4 w-4" />;
      case 'property_administrator': return <Settings className="h-4 w-4" />;
      default: return <Home className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: ThreadProgress['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Zap className="h-4 w-4 text-blue-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-amber-600" />;
      default: return <Clock className="h-4 w-4 text-neutral-600" />;
    }
  };

  const getStatusBadge = (status: ThreadProgress['status'], progress: number) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completado
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Zap className="h-3 w-3 mr-1" />
            En Progreso ({progress}%)
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            Desconocido
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-pulse text-center">
            <Link2 className="h-10 w-10 mx-auto mb-3 text-neutral-400" />
            <p className="text-sm text-neutral-600">Cargando gestión de threads cross-role...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!capabilities) {
    return (
      <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200/60">
        <CardContent className="text-center p-8">
          <Info className="h-10 w-10 mx-auto mb-4 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error de Configuración</h3>
          <p className="text-sm text-red-700">
            No se pudieron cargar las capacidades de roles múltiples. Intenta recargar la página.
          </p>
          {error && (
            <p className="text-xs text-red-600 mt-2">{error}</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-white to-neutral-50 border-neutral-200/60 shadow-xl shadow-neutral-900/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl">
                <Link2 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">Gestión de Threads Cross-Role</CardTitle>
                <CardDescription className="mt-1">
                  Sistema avanzado de desarrollo de funcionalidades para roles múltiples
                </CardDescription>
              </div>
            </div>
            
            <Button 
              onClick={loadCapabilities}
              disabled={loading}
              variant="outline"
              size="sm"
              className="bg-transparent hover:bg-purple-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Status Messages */}
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

          {/* Capabilities Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/60">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-900">{capabilities.totalRoles}</div>
                  <div className="text-sm text-blue-600">Roles Totales</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200/60">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
                <div>
                  <div className="text-2xl font-bold text-emerald-900">{capabilities.verifiedRoles}</div>
                  <div className="text-sm text-emerald-600">Verificados</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/60">
              <div className="flex items-center gap-3">
                <Link2 className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-purple-900">{capabilities.syncCapabilities.length}</div>
                  <div className="text-sm text-purple-600">Capacidades Sync</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200/60">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-amber-600" />
                <div>
                  <div className="text-2xl font-bold text-amber-900">{capabilities.availableThreads.length}</div>
                  <div className="text-sm text-amber-600">Threads Activos</div>
                </div>
              </div>
            </Card>
          </div>

          {/* User Roles Overview */}
          <div className="space-y-3">
            <h3 className="font-medium text-neutral-900 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Roles de Usuario ({userRoles.length})
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {userRoles.map(role => (
                <div key={role.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                  role.is_verified 
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  {getRoleIcon(role.role_type)}
                  <span className="text-sm font-medium">
                    {SupabaseUserRoleService.getRoleDisplayName(role.role_type)}
                  </span>
                  {role.is_active && (
                    <Badge variant="secondary" className="text-xs bg-white/80">
                      Activo
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Thread Management */}
          <Tabs value={currentThread} onValueChange={setCurrentThread} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="sync">Sincronización</TabsTrigger>
              <TabsTrigger value="advanced">Avanzado</TabsTrigger>
              <TabsTrigger value="settings">Configuración</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-medium text-neutral-900 flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  Estado de Threads de Desarrollo
                </h3>

                <div className="space-y-3">
                  {capabilities.availableThreads.map(thread => (
                    <Card key={thread.threadId} className="p-4 border hover:border-neutral-300 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(thread.status)}
                          <div>
                            <h4 className="font-medium text-neutral-900">{thread.threadName}</h4>
                            <p className="text-sm text-neutral-600">{thread.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {getStatusBadge(thread.status, thread.progress)}
                          
                          {thread.status === 'completed' && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <ArrowRight className="h-4 w-4 mr-2" />
                                  Ver Thread
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>{thread.threadName}</DialogTitle>
                                  <DialogDescription>
                                    Detalles completos del thread de desarrollo
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-4 py-4">
                                  <div>
                                    <h5 className="font-medium mb-2">Estado del Proyecto</h5>
                                    <div className="flex items-center gap-2">
                                      {getStatusIcon(thread.status)}
                                      <span className="text-sm">
                                        {thread.status === 'completed' ? 'Completado' : 
                                         thread.status === 'in-progress' ? 'En Progreso' : 'Pendiente'}
                                      </span>
                                      <div className="ml-2 flex-1 bg-neutral-200 rounded-full h-2">
                                        <div 
                                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                          style={{ width: `${thread.progress}%` }}
                                        />
                                      </div>
                                      <span className="text-xs text-neutral-600">{thread.progress}%</span>
                                    </div>
                                  </div>

                                  <div>
                                    <h5 className="font-medium mb-2">Funcionalidades Implementadas</h5>
                                    <div className="space-y-2">
                                      {thread.features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                          <CheckCircle className="h-4 w-4 text-green-600" />
                                          <span className="text-sm">{feature}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <h5 className="font-medium mb-2">Última Actualización</h5>
                                    <p className="text-sm text-neutral-600">{thread.lastUpdate}</p>
                                  </div>
                                </div>
                                
                                <DialogFooter>
                                  <Button variant="outline">Cerrar</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-neutral-600">Progreso</span>
                          <span className="font-medium">{thread.progress}%</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              thread.status === 'completed' 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                : thread.status === 'in-progress'
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                                : 'bg-gradient-to-r from-amber-400 to-orange-400'
                            }`}
                            style={{ width: `${thread.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1">
                        {thread.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {thread.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{thread.features.length - 3} más
                          </Badge>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sync" className="space-y-4">
              {capabilities.verifiedRoles >= 2 ? (
                <div className="space-y-6">
                  <CrossRoleDataSync />
                  <PropertySyncManager />
                </div>
              ) : (
                <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/60">
                  <Info className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Sincronización Cross-Role</h3>
                  <p className="text-sm text-blue-700 mb-4">
                    Necesitas al menos 2 roles verificados para acceder a las funciones de sincronización avanzada.
                  </p>
                  <p className="text-xs text-blue-600">
                    Las capacidades incluyen sincronización de propiedades, documentos, contratos e historial.
                  </p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-medium text-neutral-900">Funcionalidades Avanzadas</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      Sincronización Inteligente
                    </h4>
                    <p className="text-sm text-neutral-600 mb-3">
                      Algoritmos avanzados para detectar y sincronizar cambios automáticamente.
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {capabilities.verifiedRoles >= 2 ? 'Disponible' : 'Requiere 2+ roles'}
                    </Badge>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Settings className="h-4 w-4 text-gray-600" />
                      Configuración Granular
                    </h4>
                    <p className="text-sm text-neutral-600 mb-3">
                      Control detallado sobre qué datos se sincronizan entre roles.
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {capabilities.verifiedRoles >= 2 ? 'Disponible' : 'Requiere 2+ roles'}
                    </Badge>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-blue-600" />
                      Gestión Multi-Propiedad
                    </h4>
                    <p className="text-sm text-neutral-600 mb-3">
                      Administra múltiples propiedades desde diferentes perspectivas de rol.
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {userRoles.some(r => r.role_type === 'property_administrator') ? 'Disponible' : 'Requiere rol Administrador'}
                    </Badge>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                      Comunicación Cross-Role
                    </h4>
                    <p className="text-sm text-neutral-600 mb-3">
                      Sistema de mensajería que funciona entre diferentes roles del mismo usuario.
                    </p>
                    <Badge variant="outline" className="text-xs">En Desarrollo</Badge>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-medium text-neutral-900">Configuración de Thread Manager</h3>
                
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Thread 2 Completado:</strong> El sistema de sincronización cross-role avanzada está funcionando completamente.
                    Las funcionalidades incluyen sincronización de propiedades, gestión de documentos, y configuración granular de opciones.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Capacidades Habilitadas</h4>
                    <div className="space-y-2">
                      {capabilities.syncCapabilities.map((capability, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{capability}</span>
                        </div>
                      ))}
                      {capabilities.syncCapabilities.length === 0 && (
                        <p className="text-sm text-neutral-600">
                          Verifica más roles para habilitar capacidades de sincronización.
                        </p>
                      )}
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Próximas Funcionalidades</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-amber-600" />
                        <span className="text-sm">Dashboard Unificado Inteligente</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-amber-600" />
                        <span className="text-sm">Analytics Cross-Role</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-amber-600" />
                        <span className="text-sm">Automatización de Flujos</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

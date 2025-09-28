import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { CrossRoleDataService, RoleSyncMapping, PropertySyncOptions } from "@/services/CrossRoleDataService";
import { SupabaseUserRoleService, UserRole } from "@/services/SupabaseUserRoleService";
import { SupabasePropertyService } from "@/services/SupabasePropertyService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, RefreshCw, Home, Building2, Users, Link, CheckCircle, AlertTriangle, 
  Info, ArrowRight, Settings, FileText, ClipboardList, History, Zap 
} from "lucide-react";

interface PropertyWithSyncInfo {
  id: string;
  name: string;
  address: string;
  property_type: string;
  syncedRoles: UserRole['role_type'][];
  lastSync?: string;
  documents: number;
  contracts: number;
  budgetHistory: number;
}

interface SyncStatusOverview {
  totalProperties: number;
  syncedProperties: number;
  roles: Array<{
    roleType: UserRole['role_type'];
    syncedProperties: number;
    lastSyncDate?: string;
  }>;
}

export function PropertySyncManager() {
  const { user } = useSupabaseAuth();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [properties, setProperties] = useState<PropertyWithSyncInfo[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatusOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSyncDialog, setShowSyncDialog] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [syncOptions, setSyncOptions] = useState<PropertySyncOptions>({
    includeDocuments: true,
    includeContracts: true,
    includeBudgetHistory: false,
    syncDirection: 'bidirectional'
  });
  const [sourceRole, setSourceRole] = useState<UserRole['role_type'] | "">("");
  const [targetRole, setTargetRole] = useState<UserRole['role_type'] | "">("");

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError("");

      // Load user roles
      const roles = await SupabaseUserRoleService.getUserRoles(user.id);
      const verifiedRoles = roles.filter(role => role.is_verified);
      setUserRoles(verifiedRoles);

      if (verifiedRoles.length < 2) {
        setLoading(false);
        return;
      }

      // Load properties with sync information
      const [propertyData, statusData] = await Promise.all([
        loadPropertiesWithSyncInfo(user.id, verifiedRoles),
        CrossRoleDataService.getSyncStatus(user.id)
      ]);

      setProperties(propertyData);
      setSyncStatus({
        totalProperties: propertyData.length,
        syncedProperties: propertyData.filter(p => p.syncedRoles.length > 1).length,
        roles: statusData.roles
      });

    } catch (err) {
      console.error("Error loading property sync data:", err);
      setError("Error al cargar datos de sincronización de propiedades");
    } finally {
      setLoading(false);
    }
  };

  const loadPropertiesWithSyncInfo = async (
    userId: string, 
    roles: UserRole[]
  ): Promise<PropertyWithSyncInfo[]> => {
    const propertyMap = new Map<string, PropertyWithSyncInfo>();

    for (const role of roles) {
      try {
        let roleProperties: any[] = [];

        if (role.role_type === 'particular' || role.role_type === 'community_member') {
          roleProperties = await SupabasePropertyService.getUserProperties(userId);
        } else if (role.role_type === 'property_administrator') {
          roleProperties = await SupabasePropertyService.getManagedProperties(userId);
        }

        for (const prop of roleProperties) {
          const existing = propertyMap.get(prop.id);
          if (existing) {
            existing.syncedRoles.push(role.role_type);
          } else {
            const propertyWithSync: PropertyWithSyncInfo = {
              id: prop.id,
              name: prop.name,
              address: prop.address,
              property_type: prop.property_type || 'residential',
              syncedRoles: [role.role_type],
              documents: 0, // Will be loaded separately if needed
              contracts: 0,
              budgetHistory: 0
            };

            // Get sync metadata from role data
            const roleData = (role.role_specific_data as Record<string, any>) || {};
            const syncMetadata = roleData.sync_metadata || {};
            if (syncMetadata[prop.id]) {
              propertyWithSync.lastSync = syncMetadata[prop.id].last_updated;
            }

            propertyMap.set(prop.id, propertyWithSync);
          }
        }
      } catch (roleError) {
        console.warn(`Failed to load properties for role ${role.role_type}:`, roleError);
      }
    }

    return Array.from(propertyMap.values());
  };

  const handleBulkSync = async () => {
    if (!user?.id || !sourceRole || !targetRole || selectedProperties.length === 0) {
      setError("Completa todos los campos requeridos");
      return;
    }

    setSyncing(true);
    setError("");
    setSuccessMessage("");

    try {
      const mapping: RoleSyncMapping = {
        sourceRole: sourceRole as UserRole['role_type'],
        targetRole: targetRole as UserRole['role_type'],
        propertyIds: selectedProperties,
        options: syncOptions
      };

      const result = await CrossRoleDataService.syncPropertyAccess(user.id, mapping);

      if (result.success) {
        setSuccessMessage(`✅ ${result.message}`);
        setSelectedProperties([]);
        setShowSyncDialog(false);
        await loadData();

        // Clear success message after 8 seconds
        setTimeout(() => setSuccessMessage(""), 8000);
      } else {
        setError(`❌ ${result.message}`);
        if (result.errors && result.errors.length > 0) {
          setError(`${result.message}\n\nErrores específicos:\n${result.errors.join('\n')}`);
        }
      }

    } catch (err) {
      console.error("Error during bulk sync:", err);
      setError("Error inesperado durante la sincronización masiva");
    } finally {
      setSyncing(false);
    }
  };

  const handleUnsyncProperty = async (propertyId: string, fromRole: UserRole['role_type']) => {
    if (!user?.id) return;

    setSyncing(true);
    setError("");

    try {
      const result = await CrossRoleDataService.unsyncProperty(user.id, fromRole, propertyId);
      
      if (result.success) {
        setSuccessMessage(`✅ ${result.message}`);
        await loadData();
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        setError(`❌ ${result.message}`);
      }
    } catch (err) {
      console.error("Error unsyncing property:", err);
      setError("Error al desincronizar propiedad");
    } finally {
      setSyncing(false);
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

  const getSyncStatusBadge = (property: PropertyWithSyncInfo) => {
    const syncCount = property.syncedRoles.length;
    
    if (syncCount <= 1) {
      return (
        <Badge variant="outline" className="text-neutral-600">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Sin sincronizar
        </Badge>
      );
    } else if (syncCount === 2) {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <Link className="h-3 w-3 mr-1" />
          Sincronizado ({syncCount})
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Multi-sync ({syncCount})
        </Badge>
      );
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-pulse text-center">
            <Link className="h-10 w-10 mx-auto mb-3 text-neutral-400" />
            <p className="text-sm text-neutral-600">Cargando gestor de sincronización...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (userRoles.length < 2) {
    return (
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/60">
        <CardContent className="text-center p-8">
          <Info className="h-10 w-10 mx-auto mb-4 text-amber-600" />
          <h3 className="text-lg font-semibold text-amber-900 mb-2">Gestor de Sincronización de Propiedades</h3>
          <p className="text-sm text-amber-700 mb-4">
            Necesitas tener al menos 2 roles verificados para gestionar la sincronización avanzada de propiedades.
          </p>
          <p className="text-xs text-amber-600">
            El gestor permite configurar opciones avanzadas de sincronización incluyendo documentos, contratos e historial.
          </p>
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
              <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                <Link className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">Gestor de Sincronización de Propiedades</CardTitle>
                <CardDescription className="mt-1">
                  Configuración avanzada de sincronización entre roles con opciones de documentos y contratos
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={loadData}
                disabled={loading || syncing}
                variant="outline"
                size="sm"
                className="bg-transparent hover:bg-blue-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>

              <Dialog open={showSyncDialog} onOpenChange={setShowSyncDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Zap className="h-4 w-4 mr-2" />
                    Sincronización Masiva
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Sincronización Masiva de Propiedades</DialogTitle>
                    <DialogDescription>
                      Configura y ejecuta sincronizaciones masivas entre tus roles con opciones avanzadas
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Tabs defaultValue="properties" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="properties">Propiedades</TabsTrigger>
                      <TabsTrigger value="options">Opciones</TabsTrigger>
                      <TabsTrigger value="preview">Vista Previa</TabsTrigger>
                    </TabsList>

                    <TabsContent value="properties" className="space-y-4">
                      {/* Role Selection */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="sourceRole">Rol de origen</Label>
                          <Select value={sourceRole} onValueChange={(value) => setSourceRole(value as UserRole['role_type'])}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona rol origen" />
                            </SelectTrigger>
                            <SelectContent>
                              {userRoles.map(role => (
                                <SelectItem key={role.role_type} value={role.role_type}>
                                  <div className="flex items-center gap-2">
                                    {getRoleIcon(role.role_type)}
                                    {SupabaseUserRoleService.getRoleDisplayName(role.role_type)}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="targetRole">Rol de destino</Label>
                          <Select value={targetRole} onValueChange={(value) => setTargetRole(value as UserRole['role_type'])}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona rol destino" />
                            </SelectTrigger>
                            <SelectContent>
                              {userRoles
                                .filter(role => role.role_type !== sourceRole)
                                .map(role => (
                                  <SelectItem key={role.role_type} value={role.role_type}>
                                    <div className="flex items-center gap-2">
                                      {getRoleIcon(role.role_type)}
                                      {SupabaseUserRoleService.getRoleDisplayName(role.role_type)}
                                    </div>
                                  </SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Property Selection */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Propiedades a sincronizar</Label>
                          <div className="text-sm text-neutral-600">
                            {selectedProperties.length} de {properties.length} seleccionadas
                          </div>
                        </div>
                        
                        <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg">
                          {properties.map(property => (
                            <div key={property.id} className="flex items-center space-x-3 p-3 hover:bg-neutral-50">
                              <Checkbox
                                id={property.id}
                                checked={selectedProperties.includes(property.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedProperties(prev => [...prev, property.id]);
                                  } else {
                                    setSelectedProperties(prev => prev.filter(id => id !== property.id));
                                  }
                                }}
                              />
                              <div className="flex-1">
                                <label htmlFor={property.id} className="text-sm font-medium cursor-pointer">
                                  {property.name}
                                </label>
                                <p className="text-xs text-neutral-600">{property.address}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  {getSyncStatusBadge(property)}
                                  <Badge variant="outline" className="text-xs">
                                    {property.property_type}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="options" className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Configuración de Sincronización</h4>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label htmlFor="sync-documents">Sincronizar Documentos</Label>
                              <p className="text-xs text-neutral-600">Incluir documentos asociados a las propiedades</p>
                            </div>
                            <Switch
                              id="sync-documents"
                              checked={syncOptions.includeDocuments}
                              onCheckedChange={(checked) => 
                                setSyncOptions(prev => ({ ...prev, includeDocuments: checked }))
                              }
                            />
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label htmlFor="sync-contracts">Sincronizar Contratos</Label>
                              <p className="text-xs text-neutral-600">Incluir contratos y acuerdos de servicio</p>
                            </div>
                            <Switch
                              id="sync-contracts"
                              checked={syncOptions.includeContracts}
                              onCheckedChange={(checked) => 
                                setSyncOptions(prev => ({ ...prev, includeContracts: checked }))
                              }
                            />
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label htmlFor="sync-budget">Sincronizar Historial de Presupuestos</Label>
                              <p className="text-xs text-neutral-600">Incluir historial de presupuestos y cotizaciones</p>
                            </div>
                            <Switch
                              id="sync-budget"
                              checked={syncOptions.includeBudgetHistory}
                              onCheckedChange={(checked) => 
                                setSyncOptions(prev => ({ ...prev, includeBudgetHistory: checked }))
                              }
                            />
                          </div>

                          <Separator />

                          <div className="space-y-3">
                            <Label>Dirección de Sincronización</Label>
                            <Select 
                              value={syncOptions.syncDirection} 
                              onValueChange={(value) => 
                                setSyncOptions(prev => ({ ...prev, syncDirection: value as 'bidirectional' | 'one-way' }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="bidirectional">
                                  <div className="space-y-1">
                                    <div className="font-medium">Bidireccional</div>
                                    <div className="text-xs text-neutral-600">Los cambios se sincronizan en ambas direcciones</div>
                                  </div>
                                </SelectItem>
                                <SelectItem value="one-way">
                                  <div className="space-y-1">
                                    <div className="font-medium">Unidireccional</div>
                                    <div className="text-xs text-neutral-600">Solo del rol origen al rol destino</div>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="preview" className="space-y-4">
                      <div className="space-y-4">
                        <h4 className="font-medium">Vista Previa de la Sincronización</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <Card className="p-4">
                            <div className="flex items-center gap-2 font-medium text-blue-600 mb-2">
                              <ArrowRight className="h-4 w-4" />
                              Origen → Destino
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                {sourceRole && getRoleIcon(sourceRole as UserRole['role_type'])}
                                <span>{sourceRole && SupabaseUserRoleService.getRoleDisplayName(sourceRole as UserRole['role_type'])}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {targetRole && getRoleIcon(targetRole as UserRole['role_type'])}
                                <span>{targetRole && SupabaseUserRoleService.getRoleDisplayName(targetRole as UserRole['role_type'])}</span>
                              </div>
                            </div>
                          </Card>

                          <Card className="p-4">
                            <div className="flex items-center gap-2 font-medium text-green-600 mb-2">
                              <Home className="h-4 w-4" />
                              Propiedades
                            </div>
                            <div className="text-2xl font-bold">{selectedProperties.length}</div>
                            <div className="text-xs text-neutral-600">seleccionadas para sincronizar</div>
                          </Card>

                          <Card className="p-4">
                            <div className="flex items-center gap-2 font-medium text-purple-600 mb-2">
                              <Settings className="h-4 w-4" />
                              Opciones
                            </div>
                            <div className="space-y-1 text-xs">
                              {syncOptions.includeDocuments && (
                                <div className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  Documentos
                                </div>
                              )}
                              {syncOptions.includeContracts && (
                                <div className="flex items-center gap-1">
                                  <ClipboardList className="h-3 w-3" />
                                  Contratos
                                </div>
                              )}
                              {syncOptions.includeBudgetHistory && (
                                <div className="flex items-center gap-1">
                                  <History className="h-3 w-3" />
                                  Historial
                                </div>
                              )}
                            </div>
                          </Card>
                        </div>

                        {selectedProperties.length > 0 && sourceRole && targetRole && (
                          <Alert className="border-blue-200 bg-blue-50">
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                              Se sincronizarán <strong>{selectedProperties.length} propiedades</strong> desde{' '}
                              <strong>{SupabaseUserRoleService.getRoleDisplayName(sourceRole as UserRole['role_type'])}</strong> hacia{' '}
                              <strong>{SupabaseUserRoleService.getRoleDisplayName(targetRole as UserRole['role_type'])}</strong> con las opciones configuradas.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>

                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowSyncDialog(false)}
                      disabled={syncing}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleBulkSync}
                      disabled={!selectedProperties.length || !sourceRole || !targetRole || syncing}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      {syncing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sincronizando...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Ejecutar Sincronización ({selectedProperties.length})
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
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
              <AlertDescription className={`font-medium whitespace-pre-line ${
                error ? "text-red-800" : "text-green-800"
              }`}>
                {error || successMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Sync Status Overview */}
          {syncStatus && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/60">
                <div className="flex items-center gap-3">
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-blue-900">{syncStatus.totalProperties}</div>
                    <div className="text-sm text-blue-600">Propiedades Totales</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200/60">
                <div className="flex items-center gap-3">
                  <Link className="h-8 w-8 text-emerald-600" />
                  <div>
                    <div className="text-2xl font-bold text-emerald-900">{syncStatus.syncedProperties}</div>
                    <div className="text-sm text-emerald-600">Sincronizadas</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200/60">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-amber-600" />
                  <div>
                    <div className="text-2xl font-bold text-amber-900">{syncStatus.totalProperties - syncStatus.syncedProperties}</div>
                    <div className="text-sm text-amber-600">Sin Sincronizar</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/60">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold text-purple-900">{userRoles.length}</div>
                    <div className="text-sm text-purple-600">Roles Activos</div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Properties List */}
          <div className="space-y-4">
            <h3 className="font-medium text-neutral-900 flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Propiedades y Estado de Sincronización
            </h3>
            
            {properties.length === 0 ? (
              <Card className="p-8 text-center">
                <Home className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                <h4 className="font-medium text-neutral-600 mb-2">No hay propiedades</h4>
                <p className="text-sm text-neutral-500">
                  Agrega propiedades desde tus diferentes roles para ver las opciones de sincronización aquí.
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {properties.map(property => (
                  <Card key={property.id} className="p-4 border-2 hover:border-neutral-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-neutral-100 rounded-lg">
                            <Home className="h-5 w-5 text-neutral-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-neutral-900">{property.name}</h4>
                            <p className="text-sm text-neutral-600">{property.address}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-neutral-600">
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">
                              {property.property_type}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span>Disponible en:</span>
                            <div className="flex items-center gap-1">
                              {property.syncedRoles.map(roleType => (
                                <div key={roleType} className="flex items-center gap-1 px-2 py-1 bg-neutral-100 rounded text-xs">
                                  {getRoleIcon(roleType)}
                                  <span>{SupabaseUserRoleService.getRoleDisplayName(roleType)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {property.lastSync && (
                          <div className="mt-2 text-xs text-neutral-500">
                            Última sincronización: {new Date(property.lastSync).toLocaleString()}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {getSyncStatusBadge(property)}
                        
                        {property.syncedRoles.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUnsyncProperty(property.id, property.syncedRoles[0])}
                            disabled={syncing}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Desincronizar
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

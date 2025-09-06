
import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { SupabaseUserRoleService, UserRole } from "@/services/SupabaseUserRoleService";
import { SupabasePropertyService } from "@/services/SupabasePropertyService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, RefreshCw, Home, Building2, Users, Link, CheckCircle, AlertTriangle, Info, ArrowRight } from "lucide-react";

interface PropertySyncData {
  roleType: UserRole['role_type'];
  properties: Array<{
    id: string;
    name: string;
    address: string;
    syncStatus: 'synced' | 'unsynced' | 'pending';
  }>;
}

interface SyncOperation {
  fromRole: UserRole['role_type'];
  toRole: UserRole['role_type'];
  propertyIds: string[];
  operation: 'sync' | 'unsync';
}

export function CrossRoleDataSync() {
  const { user } = useSupabaseAuth();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [propertySyncData, setPropertySyncData] = useState<PropertySyncData[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [pendingSync, setPendingSync] = useState<SyncOperation | null>(null);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError("");

      // Load user roles
      const roles = await SupabaseUserRoleService.getUserRoles(user.id);
      const verifiedRoles = roles.filter(role => role.is_verified);
      setUserRoles(verifiedRoles);

      // Load property data for each role
      const syncData: PropertySyncData[] = [];

      for (const role of verifiedRoles) {
        try {
          let properties: any[] = [];

          if (role.role_type === 'particular' || role.role_type === 'community_member') {
            // Load properties owned/associated with this role
            properties = await SupabasePropertyService.getUserProperties(user.id);
          } else if (role.role_type === 'property_administrator') {
            // Load managed properties
            properties = await SupabasePropertyService.getManagedProperties(user.id);
          }

          const formattedProperties = properties.map(prop => ({
            id: prop.id,
            name: prop.name,
            address: prop.address,
            syncStatus: determineSyncStatus(prop, role, verifiedRoles) as 'synced' | 'unsynced' | 'pending'
          }));

          syncData.push({
            roleType: role.role_type,
            properties: formattedProperties
          });

        } catch (roleError) {
          console.warn(`Failed to load properties for role ${role.role_type}:`, roleError);
        }
      }

      setPropertySyncData(syncData);

    } catch (err) {
      console.error("Error loading cross-role data:", err);
      setError("Error al cargar datos de sincronización de roles");
    } finally {
      setLoading(false);
    }
  };

  const determineSyncStatus = (property: any, currentRole: UserRole, allRoles: UserRole[]): string => {
    // Check if property is accessible from other roles
    const propertyRoleData = property.role_associations || {};
    const availableToOtherRoles = allRoles.some(role => 
      role.role_type !== currentRole.role_type && propertyRoleData[role.role_type]
    );

    return availableToOtherRoles ? 'synced' : 'unsynced';
  };

  const handleSyncProperties = async (fromRole: UserRole['role_type'], toRole: UserRole['role_type']) => {
    if (!selectedProperties.length) {
      setError("Selecciona al menos una propiedad para sincronizar");
      return;
    }

    setSyncing(true);
    setError("");

    try {
      // Update role_specific_data for both roles to include property associations
      for (const propertyId of selectedProperties) {
        await updateRolePropertyAssociation(fromRole, toRole, propertyId, 'add');
      }

      setSuccessMessage(`${selectedProperties.length} propiedad(es) sincronizada(s) exitosamente entre roles`);
      setShowSyncModal(false);
      setSelectedProperties([]);
      
      // Reload data
      await loadUserData();

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);

    } catch (err) {
      console.error("Error syncing properties:", err);
      setError("Error al sincronizar propiedades entre roles");
    } finally {
      setSyncing(false);
    }
  };

  const updateRolePropertyAssociation = async (
    fromRole: UserRole['role_type'], 
    toRole: UserRole['role_type'], 
    propertyId: string, 
    operation: 'add' | 'remove'
  ) => {
    if (!user?.id) return;

    // Get current role data
    const roles = await SupabaseUserRoleService.getUserRoles(user.id);
    const toRoleData = roles.find(r => r.role_type === toRole);
    
    if (!toRoleData) return;

    const currentData = toRoleData.role_specific_data as Record<string, any> || {};
    const propertyAssociations = currentData.property_associations || [];

    let updatedAssociations: string[];

    if (operation === 'add') {
      updatedAssociations = [...new Set([...propertyAssociations, propertyId])];
    } else {
      updatedAssociations = propertyAssociations.filter((id: string) => id !== propertyId);
    }

    const updatedData = {
      ...currentData,
      property_associations: updatedAssociations,
      last_sync: new Date().toISOString(),
      synced_from: fromRole
    };

    // Update the role data
    await SupabaseUserRoleService.updateRoleSpecificData(user.id, toRole, updatedData);
  };

  const handleUnsyncProperties = async (roleType: UserRole['role_type'], propertyIds: string[]) => {
    setSyncing(true);
    setError("");

    try {
      for (const propertyId of propertyIds) {
        await updateRolePropertyAssociation(roleType, roleType, propertyId, 'remove');
      }

      setSuccessMessage(`Propiedades desincronizadas exitosamente`);
      await loadUserData();

      setTimeout(() => setSuccessMessage(""), 5000);

    } catch (err) {
      console.error("Error unsyncing properties:", err);
      setError("Error al desincronizar propiedades");
    } finally {
      setSyncing(false);
    }
  };

  const getRoleIcon = (roleType: UserRole['role_type']) => {
    switch (roleType) {
      case 'particular': return <Home className="h-4 w-4" />;
      case 'community_member': return <Users className="h-4 w-4" />;
      case 'service_provider': return <Building2 className="h-4 w-4" />;
      case 'property_administrator': return <Building2 className="h-4 w-4" />;
      default: return <Home className="h-4 w-4" />;
    }
  };

  const getSyncStatusBadge = (status: string) => {
    switch (status) {
      case 'synced':
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Sincronizado
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Pendiente
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Sin sincronizar
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-pulse text-center">
            <Link className="h-8 w-8 mx-auto mb-2 text-neutral-400" />
            <p className="text-sm text-neutral-600">Cargando sincronización de datos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (userRoles.length < 2) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/60">
        <CardContent className="text-center p-6">
          <Info className="h-8 w-8 mx-auto mb-4 text-blue-600" />
          <h3 className="font-medium text-blue-900 mb-2">Sincronización de Datos Entre Roles</h3>
          <p className="text-sm text-blue-700 mb-4">
            Necesitas tener al menos 2 roles verificados para usar la sincronización de datos.
          </p>
          <p className="text-xs text-blue-600">
            La sincronización permite compartir propiedades y datos entre tus diferentes roles.
          </p>
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
              <Link className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-xl font-semibold">Sincronización de Datos Entre Roles</CardTitle>
                <CardDescription>
                  Gestiona el intercambio de propiedades y datos entre tus diferentes roles
                </CardDescription>
              </div>
            </div>
            
            <Button 
              onClick={loadUserData}
              disabled={loading}
              variant="outline"
              size="sm"
              className="bg-transparent hover:bg-blue-50"
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

          {/* Role Sync Overview */}
          <div className="space-y-4">
            <h3 className="font-medium text-neutral-900 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Propiedades por Rol
            </h3>
            
            <div className="grid gap-4">
              {propertySyncData.map((roleData) => (
                <Card key={roleData.roleType} className="border-2 border-neutral-100 hover:border-neutral-200 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                          {getRoleIcon(roleData.roleType)}
                        </div>
                        <div>
                          <h4 className="font-medium text-neutral-900">
                            {SupabaseUserRoleService.getRoleDisplayName(roleData.roleType)}
                          </h4>
                          <p className="text-sm text-neutral-600">
                            {roleData.properties.length} propiedad(es)
                          </p>
                        </div>
                      </div>
                      
                      {roleData.properties.length > 0 && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="bg-transparent hover:bg-blue-50"
                              onClick={() => {
                                setSelectedProperties([]);
                                setPendingSync({
                                  fromRole: roleData.roleType,
                                  toRole: userRoles.find(r => r.role_type !== roleData.roleType)?.role_type || 'particular',
                                  propertyIds: [],
                                  operation: 'sync'
                                });
                              }}
                            >
                              <Link className="h-4 w-4 mr-2" />
                              Sincronizar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Sincronizar Propiedades</DialogTitle>
                              <DialogDescription>
                                Selecciona las propiedades que quieres sincronizar con otros roles
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4 py-4">
                              {/* Target Role Selection */}
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Sincronizar hacia:</label>
                                <div className="flex flex-wrap gap-2">
                                  {userRoles
                                    .filter(role => role.role_type !== roleData.roleType)
                                    .map(role => (
                                      <Button
                                        key={role.role_type}
                                        variant={pendingSync?.toRole === role.role_type ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setPendingSync(prev => prev ? {...prev, toRole: role.role_type} : null)}
                                        className={pendingSync?.toRole === role.role_type 
                                          ? "bg-blue-600 hover:bg-blue-700" 
                                          : "bg-transparent hover:bg-blue-50"
                                        }
                                      >
                                        {getRoleIcon(role.role_type)}
                                        <span className="ml-2">{SupabaseUserRoleService.getRoleDisplayName(role.role_type)}</span>
                                      </Button>
                                    ))
                                  }
                                </div>
                              </div>
                              
                              {/* Property Selection */}
                              <div className="space-y-3">
                                <label className="text-sm font-medium">Propiedades a sincronizar:</label>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                  {roleData.properties.map(property => (
                                    <div key={property.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-neutral-50">
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
                                      </div>
                                      {getSyncStatusBadge(property.syncStatus)}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <DialogFooter>
                              <Button 
                                variant="outline" 
                                onClick={() => setShowSyncModal(false)}
                                disabled={syncing}
                              >
                                Cancelar
                              </Button>
                              <Button 
                                onClick={() => pendingSync && handleSyncProperties(pendingSync.fromRole, pendingSync.toRole)}
                                disabled={!selectedProperties.length || !pendingSync?.toRole || syncing}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                {syncing ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Sincronizando...
                                  </>
                                ) : (
                                  <>
                                    <ArrowRight className="h-4 w-4 mr-2" />
                                    Sincronizar ({selectedProperties.length})
                                  </>
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </CardHeader>
                  
                  {roleData.properties.length > 0 && (
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {roleData.properties.slice(0, 3).map(property => (
                          <div key={property.id} className="flex items-center justify-between p-2 bg-neutral-50/50 rounded-md">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-neutral-900">{property.name}</p>
                              <p className="text-xs text-neutral-600">{property.address}</p>
                            </div>
                            {getSyncStatusBadge(property.syncStatus)}
                          </div>
                        ))}
                        {roleData.properties.length > 3 && (
                          <p className="text-xs text-neutral-500 text-center pt-2">
                            +{roleData.properties.length - 3} más...
                          </p>
                        )}
                      </div>
                    </CardContent>
                  )}

                  {roleData.properties.length === 0 && (
                    <CardContent className="pt-0">
                      <div className="text-center py-4 text-neutral-500">
                        <Home className="h-6 w-6 mx-auto mb-2 text-neutral-400" />
                        <p className="text-sm">No hay propiedades para este rol</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200/60">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <Info className="h-4 w-4" />
              ¿Cómo funciona la sincronización?
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Sincroniza propiedades entre diferentes roles para acceso unificado</li>
              <li>• Los cambios en propiedades sincronizadas se reflejan en todos los roles</li>
              <li>• Mantén la consistencia de datos entre roles administrativos y particulares</li>
              <li>• La sincronización es segura y reversible en cualquier momento</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

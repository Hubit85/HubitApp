import { useEffect, useState } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { useRouter } from "next/router";
import { SupabaseUserRoleService, UserRole } from "@/services/SupabaseUserRoleService";
import { AdministratorRequestManager } from "@/components/AdministratorRequestManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, UserCheck, User, Users, Building, Settings, Home, Edit3, Mail, Phone, MapPin, Calendar, Shield, ArrowLeft, RefreshCw, MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ProfilePage() {
  const { user, profile, userRoles, activeRole, loading, refreshRoles, activateRole, updateProfile } = useSupabaseAuth();
  const { } = useLanguage();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    country: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedRoleForSwitch, setSelectedRoleForSwitch] = useState<UserRole | null>(null);
  const [showRoleSwitchDialog, setShowRoleSwitchDialog] = useState(false);
  
  // Estado para la propiedad seleccionada
  const [selectedPropertyData, setSelectedPropertyData] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (profile) {
      setEditForm({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        postal_code: profile.postal_code || "",
        country: profile.country || ""
      });
    }

    // Cargar la propiedad seleccionada desde localStorage
    try {
      const savedProperty = localStorage.getItem('selectedProperty');
      if (savedProperty) {
        const propertyData = JSON.parse(savedProperty);
        setSelectedPropertyData(propertyData);
        console.log('🏠 Propiedad cargada desde localStorage:', propertyData);
      }
    } catch (error) {
      console.error('Error cargando propiedad seleccionada:', error);
    }
  }, [user, profile, loading, router]);

  // Función para limpiar la selección de propiedad
  const clearSelectedProperty = () => {
    localStorage.removeItem('selectedProperty');
    setSelectedPropertyData(null);
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setSubmitting(true);
      setError("");
      setSuccessMessage("");

      const result = await updateProfile(editForm);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccessMessage("Perfil actualizado correctamente");
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Error al actualizar el perfil");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleSwitch = async (role: UserRole) => {
    if (role.is_active) return;

    setSelectedRoleForSwitch(role);
    setShowRoleSwitchDialog(true);
  };

  const confirmRoleSwitch = async () => {
    if (!selectedRoleForSwitch) return;

    try {
      setSubmitting(true);
      setError("");
      setSuccessMessage("");

      const result = await activateRole(selectedRoleForSwitch.role_type);

      if (result.success) {
        setSuccessMessage(`Rol cambiado a ${SupabaseUserRoleService.getRoleDisplayName(selectedRoleForSwitch.role_type)} correctamente`);
        setShowRoleSwitchDialog(false);
        
        // Refresh roles and page
        await refreshRoles();
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Error switching role:", error);
      setError("Error al cambiar el rol");
    } finally {
      setSubmitting(false);
      setSelectedRoleForSwitch(null);
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

  const getRoleColor = (roleType: UserRole['role_type'], isActive: boolean) => {
    if (isActive) {
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }

    switch (roleType) {
      case 'particular': return "bg-blue-50 text-blue-700 border-blue-200";
      case 'community_member': return "bg-purple-50 text-purple-700 border-purple-200";
      case 'service_provider': return "bg-orange-50 text-orange-700 border-orange-200";
      case 'property_administrator': return "bg-indigo-50 text-indigo-700 border-indigo-200";
      default: return "bg-neutral-50 text-neutral-700 border-neutral-200";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white flex items-center justify-center">
        <div className="animate-pulse text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
          <p className="text-lg text-neutral-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const verifiedRoles = userRoles.filter(r => r.is_verified === true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="bg-transparent hover:bg-neutral-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Mi Perfil</h1>
            <p className="text-neutral-600 mt-1">Gestiona tu información personal y roles</p>
          </div>
        </div>

        {/* Messages */}
        {(error || successMessage) && (
          <Alert className={`mb-6 border-2 ${error
              ? "border-red-200 bg-red-50"
              : "border-green-200 bg-green-50"
            }`}>
            <AlertDescription className={`font-medium ${error ? "text-red-800" : "text-green-800"
              }`}>
              {error || successMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content with Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Información Personal
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Gestión de Roles
            </TabsTrigger>
            {/* Mostrar pestaña de gestión solo para community_member y property_administrator */}
            {activeRole && (activeRole.role_type === 'community_member' || activeRole.role_type === 'property_administrator') && (
              <TabsTrigger value="management" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                {activeRole.role_type === 'community_member' ? 'Solicitar Gestión' : 'Panel de Gestión'}
              </TabsTrigger>
            )}
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Profile Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info Card */}
                <Card className="bg-gradient-to-br from-white to-neutral-50 border-neutral-200/60 shadow-lg shadow-neutral-900/5">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={profile.avatar_url || undefined} />
                        <AvatarFallback className="bg-emerald-100 text-emerald-700 text-lg font-semibold">
                          {getInitials(profile.full_name || profile.email || "U")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-2xl">{profile.full_name || "Usuario"}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {profile.email}
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                      className="bg-transparent hover:bg-neutral-100"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      {isEditing ? "Cancelar" : "Editar"}
                    </Button>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {isEditing ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="full_name">Nombre completo</Label>
                          <Input
                            id="full_name"
                            value={editForm.full_name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                            placeholder="Tu nombre completo"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Teléfono</Label>
                          <Input
                            id="phone"
                            value={editForm.phone}
                            onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+34 600 000 000"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="address">Dirección</Label>
                          <Input
                            id="address"
                            value={editForm.address}
                            onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                            placeholder="Tu dirección"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">Ciudad</Label>
                          <Input
                            id="city"
                            value={editForm.city}
                            onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value }))}
                            placeholder="Tu ciudad"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postal_code">Código postal</Label>
                          <Input
                            id="postal_code"
                            value={editForm.postal_code}
                            onChange={(e) => setEditForm(prev => ({ ...prev, postal_code: e.target.value }))}
                            placeholder="28001"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="country">País</Label>
                          <Input
                            id="country"
                            value={editForm.country}
                            onChange={(e) => setEditForm(prev => ({ ...prev, country: e.target.value }))}
                            placeholder="España"
                          />
                        </div>
                        <div className="flex gap-3 md:col-span-2">
                          <Button
                            onClick={handleSaveProfile}
                            disabled={submitting}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            {submitting ? "Guardando..." : "Guardar cambios"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                            disabled={submitting}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        {profile.phone && (
                          <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-neutral-500" />
                            <span>{profile.phone}</span>
                          </div>
                        )}
                        {profile.address && (
                          <div className="flex items-center gap-3 md:col-span-2">
                            <MapPin className="h-4 w-4 text-neutral-500" />
                            <span>
                              {profile.address}
                              {profile.city && `, ${profile.city}`}
                              {profile.postal_code && ` - ${profile.postal_code}`}
                              {profile.country && `, ${profile.country}`}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-neutral-500" />
                          <span>
                            Miembro desde {profile.created_at ? new Date(profile.created_at).toLocaleDateString('es-ES') : 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Shield className="h-4 w-4 text-neutral-500" />
                          <span className={profile.is_verified ? "text-green-600" : "text-amber-600"}>
                            {profile.is_verified ? "Perfil verificado" : "Perfil no verificado"}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <Card className="bg-gradient-to-br from-white to-neutral-50 border-neutral-200/60 shadow-lg shadow-neutral-900/5">
                  <CardHeader>
                    <CardTitle className="text-lg">Resumen de tu cuenta</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">Roles totales</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {userRoles.length}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">Roles verificados</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {verifiedRoles.length}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">Rol activo</span>
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                        {activeRole ? SupabaseUserRoleService.getRoleDisplayName(activeRole.role_type) : 'Ninguno'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-gradient-to-br from-white to-neutral-50 border-neutral-200/60 shadow-lg shadow-neutral-900/5">
                  <CardHeader>
                    <CardTitle className="text-lg">Acciones rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent hover:bg-neutral-100"
                      onClick={() => router.push('/dashboard')}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Ir al Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent hover:bg-neutral-100"
                      onClick={refreshRoles}
                      disabled={submitting}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Actualizar roles
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent hover:bg-neutral-100"
                      onClick={() => router.push('/help')}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Obtener ayuda
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Roles Tab */}
          <TabsContent value="roles" className="space-y-6">
            {/* Role Management Section */}
            <Card className="bg-gradient-to-br from-white to-neutral-50 border-neutral-200/60 shadow-lg shadow-neutral-900/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-6 w-6 text-emerald-600" />
                    <div>
                      <CardTitle className="text-xl">Gestión de Roles</CardTitle>
                      <CardDescription>
                        Cambia entre tus diferentes roles para acceder a distintas funcionalidades
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshRoles}
                    disabled={submitting}
                    className="bg-transparent hover:bg-neutral-100"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualizar
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Active Role Display */}
                {activeRole && (
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                        {getRoleIcon(activeRole.role_type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-emerald-800">
                            Rol Activo: {SupabaseUserRoleService.getRoleDisplayName(activeRole.role_type)}
                          </h3>
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Activo
                          </Badge>
                        </div>
                        <p className="text-sm text-emerald-700 mt-1">
                          Este es el rol que estás usando actualmente en la plataforma
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Available Roles for Switching */}
                <div className="space-y-4">
                  <h3 className="font-medium text-neutral-900 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Cambiar Rol ({verifiedRoles.length} disponibles)
                  </h3>

                  {verifiedRoles.length === 0 ? (
                    <div className="text-center py-8 bg-neutral-50/50 rounded-lg border border-dashed border-neutral-200">
                      <User className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                      <p className="text-neutral-600 mb-2">No tienes roles verificados disponibles</p>
                      <p className="text-sm text-neutral-500">Los roles se crean automáticamente durante el registro</p>
                    </div>
                  ) : verifiedRoles.length === 1 ? (
                    <div className="text-center py-6 bg-blue-50/50 rounded-lg border border-dashed border-blue-200">
                      <UserCheck className="h-10 w-10 mx-auto mb-3 text-blue-500" />
                      <p className="text-blue-700 font-medium">Solo tienes un rol activo</p>
                      <p className="text-sm text-blue-600 mt-1">
                        Puedes crear roles adicionales durante el proceso de registro
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {verifiedRoles.map((role) => (
                        <div
                          key={role.id}
                          className={`group p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                            role.is_active
                              ? 'border-emerald-200 bg-emerald-50/50 shadow-sm cursor-default'
                              : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md hover:-translate-y-0.5'
                          }`}
                          onClick={() => !role.is_active && handleRoleSwitch(role)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2.5 rounded-lg transition-colors ${
                                role.is_active
                                  ? 'bg-emerald-100 text-emerald-600'
                                  : `group-hover:scale-110 transition-transform ${getRoleColor(role.role_type, false)}`
                              }`}>
                                {getRoleIcon(role.role_type)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-neutral-900">
                                    {SupabaseUserRoleService.getRoleDisplayName(role.role_type)}
                                  </h4>
                                  {role.is_active && (
                                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Activo
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-neutral-600 mt-1">
                                  {role.role_type === 'particular' && 'Acceso a servicios básicos como usuario individual'}
                                  {role.role_type === 'community_member' && 'Gestión de comunidades y participación activa'}
                                  {role.role_type === 'service_provider' && 'Ofrecer servicios y gestionar presupuestos'}
                                  {role.role_type === 'property_administrator' && 'Administración completa de propiedades'}
                                </p>

                                {role.role_type === 'community_member' && (
                                  <div className="mt-2 space-y-2">
                                    {/* Mostrar comunidad basada en propiedad seleccionada */}
                                    {selectedPropertyData && selectedPropertyData.community_code ? (
                                      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <Home className="h-4 w-4 text-blue-600" />
                                            <div>
                                              <span className="text-sm font-bold text-blue-800">
                                                Comunidad: {selectedPropertyData.community_code}
                                              </span>
                                              <p className="text-xs text-blue-600 mt-0.5">
                                                {selectedPropertyData.name} - {selectedPropertyData.street} {selectedPropertyData.number}
                                              </p>
                                              <p className="text-xs text-blue-500">
                                                {selectedPropertyData.city}, {selectedPropertyData.province}
                                              </p>
                                            </div>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={clearSelectedProperty}
                                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-1 h-auto"
                                          >
                                            <span className="sr-only">Limpiar selección</span>
                                            ×
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="p-2 bg-amber-50 rounded-md border border-amber-200">
                                        <div className="flex items-center gap-1 text-amber-700">
                                          <Home className="h-3 w-3" />
                                          <span className="text-xs font-medium">
                                            Sin comunidad asignada
                                          </span>
                                        </div>
                                        <p className="text-xs text-amber-600 mt-1">
                                          Selecciona una propiedad en &quot;Mis Propiedades&quot; para ver tu comunidad actual.
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {!role.is_active && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity bg-transparent hover:bg-neutral-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRoleSwitch(role);
                                }}
                              >
                                Cambiar
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Help Section */}
                <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200/60">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Información sobre el cambio de roles
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Puedes cambiar entre roles verificados en cualquier momento</li>
                    <li>• Solo un rol puede estar activo a la vez</li>
                    <li>• Cada rol tiene acceso a funcionalidades específicas</li>
                    <li>• Los datos específicos de cada rol se mantienen independientes</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Administrator Request Management Tab - Solo visible para community_member y property_administrator */}
          {activeRole && (activeRole.role_type === 'community_member' || activeRole.role_type === 'property_administrator') && (
            <TabsContent value="management" className="space-y-6">
              <Card className="bg-gradient-to-br from-white to-neutral-50 border-neutral-200/60 shadow-lg shadow-neutral-900/5">
                <CardContent className="p-6">
                  <AdministratorRequestManager 
                    userRole={activeRole.role_type === 'community_member' ? 'community_member' : 'property_administrator'}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        {/* Community Information Section - Solo para miembros de comunidad */}
                {activeRole && activeRole.role_type === 'community_member' && (
                  <Card className="bg-gradient-to-br from-white to-neutral-50 border-neutral-200/60 shadow-lg shadow-neutral-900/5">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Home className="h-5 w-5 text-blue-600" />
                        Mi Comunidad
                      </CardTitle>
                      <CardDescription>
                        Información de la comunidad basada en tu propiedad seleccionada
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedPropertyData && selectedPropertyData.community_code ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                <Building className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-bold text-blue-900 text-lg">
                                  {selectedPropertyData.community_code}
                                </h3>
                                <p className="text-blue-700 text-sm">
                                  Código de Comunidad
                                </p>
                              </div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                              Activa
                            </Badge>
                          </div>
                          
                          <div className="grid gap-3">
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                              <span className="text-sm text-gray-600 font-medium">Propiedad:</span>
                              <span className="text-sm font-semibold">{selectedPropertyData.name}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                              <span className="text-sm text-gray-600 font-medium">Dirección:</span>
                              <span className="text-sm font-semibold">
                                {selectedPropertyData.street} {selectedPropertyData.number}
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                              <span className="text-sm text-gray-600 font-medium">Ubicación:</span>
                              <span className="text-sm font-semibold">
                                {selectedPropertyData.city}, {selectedPropertyData.province}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push('/dashboard?tab=propiedades')}
                              className="flex-1"
                            >
                              <Home className="h-4 w-4 mr-2" />
                              Ver Propiedades
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={clearSelectedProperty}
                              className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                            >
                              Limpiar Selección
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 space-y-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                            <Home className="h-8 w-8 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Sin comunidad seleccionada</h3>
                            <p className="text-sm text-gray-600 mb-4">
                              Para mostrar la información de tu comunidad, primero selecciona una propiedad
                            </p>
                            <Button
                              onClick={() => router.push('/dashboard?tab=propiedades')}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Home className="h-4 w-4 mr-2" />
                              Ir a Mis Propiedades
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

        {/* Role Switch Confirmation Dialog */}
        <Dialog open={showRoleSwitchDialog} onOpenChange={setShowRoleSwitchDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-emerald-600" />
                Confirmar cambio de rol
              </DialogTitle>
              <DialogDescription className="text-left">
                {selectedRoleForSwitch && (
                  <>
                    ¿Estás seguro de que quieres cambiar a <strong>
                      {SupabaseUserRoleService.getRoleDisplayName(selectedRoleForSwitch.role_type)}
                    </strong>?
                    <br /><br />
                    <span className="text-sm text-neutral-600">
                      Esto cambiará tu rol activo y las funcionalidades disponibles en la plataforma.
                    </span>
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRoleSwitchDialog(false);
                  setSelectedRoleForSwitch(null);
                }}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmRoleSwitch}
                disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {submitting ? "Cambiando..." : "Confirmar cambio"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

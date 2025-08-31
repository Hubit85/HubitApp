
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Loader2, User, Crown, Star, LogOut, Settings, CheckCircle, ArrowRight, ChevronDown, 
  Shield, Home, Wrench, FileText, Mail, Phone, Calendar, Users, Building, Store, Bell, 
  CreditCard, ThumbsUp, Award, StarIcon
} from "lucide-react";
import ZoomableSection from "@/components/ZoomableSection";
import { Header } from "@/components/layout/Header";
import PropertyManager from "@/components/dashboard/PropertyManager";
import BudgetRequestManager from "@/components/dashboard/BudgetRequestManager";
import UserRoleManager from "@/components/UserRoleManager";
import ResendTestTool from "@/components/ResendTestTool";

export default function Dashboard() {
  const { user, profile, signOut, loading, userRoles, activeRole, activateRole } = useSupabaseAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRole, setSelectedRole] = useState<string>("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (activeRole) {
      setSelectedRole(activeRole.role_type);
    }
  }, [activeRole]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleRoleChange = async (newRole: string) => {
    if (!user || newRole === selectedRole) return;
    
    try {
      const result = await activateRole(newRole as any);
      if (result.success) {
        setSelectedRole(newRole);
        // You might want to refresh the page or update UI based on new role
      } else {
        console.error("Failed to change role:", result.message);
        // Could show a toast notification here
      }
    } catch (error) {
      console.error("Error changing role:", error);
    }
  };

  const getUserTypeInfo = (userType: string) => {
    switch (userType) {
      case "particular":
        return { icon: User, label: "Particular", color: "bg-stone-600", description: "Usuario individual" };
      case "community_member":
        return { icon: Users, label: "Miembro de Comunidad", color: "bg-stone-700", description: "Residente de comunidad" };
      case "service_provider":
        return { icon: Wrench, label: "Proveedor de Servicios", color: "bg-stone-800", description: "Empresa o autónomo" };
      case "property_administrator":
        return { icon: Building, label: "Administrador de Fincas", color: "bg-stone-900", description: "Gestión de propiedades" };
      default:
        return { icon: User, label: "Usuario", color: "bg-neutral-600", description: "Sin especificar" };
    }
  };

  const getRoleOptions = () => [
    { value: "community_member", label: "Miembro de la comunidad", icon: Users },
    { value: "service_provider", label: "Proveedor de servicios", icon: Wrench },
    { value: "property_administrator", label: "Administrador de fincas", icon: Building },
  ];

  // Base navigation items that are common
  const baseNavItems = [
    { id: "overview", label: "Resumen", icon: Shield },
    { id: "perfil", label: "Mi Perfil", icon: User },
  ];

  // Role-specific navigation items
  const getRoleSpecificNavItems = (roleType: string) => {
    switch (roleType) {
      case "community_member":
        return [
          { id: "presupuesto", label: "Solicitar Presupuesto", icon: FileText },
          { id: "proveedores", label: "Proveedores de Servicios", icon: Store },
          { id: "favoritos", label: "Mis Favoritos", icon: Star },
          { id: "propiedades", label: "Mi Comunidad", icon: Home },
          { id: "historial", label: "Historial de Servicios", icon: FileText },
          { id: "evaluacion", label: "Evaluación de Servicios", icon: StarIcon },
          { id: "notificaciones", label: "Notificaciones", icon: Bell },
          { id: "pagos", label: "Mis Pagos", icon: CreditCard },
          { id: "configuracion", label: "Configuración", icon: Settings },
        ];
      case "service_provider":
        return [
          { id: "servicios", label: "Mis Servicios", icon: Wrench },
          { id: "presupuestos", label: "Gestionar Presupuestos", icon: FileText },
          { id: "clientes", label: "Mis Clientes", icon: Users },
          { id: "calendario", label: "Calendario", icon: Calendar },
          { id: "evaluacion", label: "Evaluación de Servicios", icon: StarIcon },
          { id: "facturacion", label: "Facturación", icon: CreditCard },
          { id: "notificaciones", label: "Notificaciones", icon: Bell },
          { id: "configuracion", label: "Configuración", icon: Settings },
        ];
      case "property_administrator":
        return [
          { id: "propiedades", label: "Gestionar Propiedades", icon: Building },
          { id: "comunidades", label: "Comunidades", icon: Users },
          { id: "presupuestos", label: "Presupuestos y Contratos", icon: FileText },
          { id: "proveedores", label: "Proveedores Autorizados", icon: Store },
          { id: "evaluacion", label: "Evaluación de Servicios", icon: StarIcon },
          { id: "informes", label: "Informes y Reportes", icon: FileText },
          { id: "facturacion", label: "Facturación", icon: CreditCard },
          { id: "notificaciones", label: "Notificaciones", icon: Bell },
          { id: "configuracion", label: "Configuración", icon: Settings },
        ];
      default:
        return [
          { id: "presupuesto", label: "Solicitar Presupuesto", icon: FileText },
          { id: "proveedores", label: "Proveedores de Servicios", icon: Store },
          { id: "favoritos", label: "Mis Favoritos", icon: Star },
          { id: "propiedades", label: "Mis Propiedades", icon: Home },
          { id: "historial", label: "Historial de Servicios", icon: FileText },
          { id: "evaluacion", label: "Evaluación de Servicios", icon: StarIcon },
          { id: "notificaciones", label: "Notificaciones", icon: Bell },
          { id: "pagos", label: "Mis Pagos", icon: CreditCard },
          { id: "configuracion", label: "Configuración", icon: Settings },
        ];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-stone-600 mx-auto mb-4" />
          <p className="text-stone-600 font-medium">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-600 font-medium">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  const currentRole = selectedRole || profile.user_type;
  const userTypeInfo = getUserTypeInfo(currentRole);
  const UserTypeIcon = userTypeInfo.icon;
  const navItems = [...baseNavItems, ...getRoleSpecificNavItems(currentRole)];

  return (
    <>
      <Head>
        <title>Dashboard - HuBiT</title>
        <meta name="description" content="Tu panel de control personalizado en HuBiT" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <Header />

        <div className="flex">
          {/* Sidebar */}
          <div className="w-72 bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-800 text-white shadow-2xl flex flex-col min-h-screen border-r border-stone-700/50">
            <div className="p-6 border-b border-stone-700/60 bg-gradient-to-r from-stone-800/40 to-neutral-800/40">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${userTypeInfo.color} rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/10`}>
                  <UserTypeIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{profile.full_name || "Usuario"}</h3>
                  <p className="text-stone-300 text-sm">{user.email}</p>
                </div>
              </div>
              
              {/* Role Selector */}
              <div className="space-y-2">
                <label className="text-xs text-stone-400 font-medium uppercase tracking-wide">
                  Rol Activo
                </label>
                <Select
                  value={selectedRole}
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger className="w-full bg-stone-800/60 border-stone-600/40 text-white hover:bg-stone-700/80 transition-all duration-300 rounded-lg backdrop-blur-sm shadow-lg">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <UserTypeIcon className="h-4 w-4" />
                        <span className="text-sm">{userTypeInfo.label}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-stone-800/95 border-stone-600/40 backdrop-blur-md shadow-2xl">
                    {getRoleOptions().map((role) => {
                      const RoleIcon = role.icon;
                      return (
                        <SelectItem 
                          key={role.value} 
                          value={role.value}
                          className="text-white hover:bg-stone-700/80 focus:bg-stone-700/80 transition-colors duration-200"
                        >
                          <div className="flex items-center gap-2">
                            <RoleIcon className="h-4 w-4" />
                            <span>{role.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex-1 p-4 bg-gradient-to-b from-transparent to-stone-900/20">
              <nav className="space-y-1">
                {navItems.map((item, index) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "secondary" : "ghost"}
                    className={`w-full justify-start text-left rounded-lg transition-all duration-300 group ${
                      activeTab === item.id 
                        ? "bg-gradient-to-r from-stone-700/80 to-stone-600/80 text-white hover:from-stone-600/90 hover:to-stone-500/90 shadow-lg ring-1 ring-white/10 backdrop-blur-sm" 
                        : "text-stone-300 hover:text-white hover:bg-stone-800/60 backdrop-blur-sm"
                    }`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <item.icon className={`mr-3 h-4 w-4 transition-colors duration-300 ${
                      activeTab === item.id ? "text-white" : "text-stone-400 group-hover:text-white"
                    }`} />
                    <span className="font-medium">{item.label}</span>
                  </Button>
                ))}
              </nav>
            </div>

            {/* Sign Out Button at Bottom */}
            <div className="p-4 border-t border-stone-700/60 bg-gradient-to-r from-stone-800/30 to-neutral-800/30">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/30 transition-all duration-300 rounded-lg backdrop-blur-sm group"
                onClick={handleSignOut}
              >
                <LogOut className="mr-3 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-medium">Cerrar Sesión</span>
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-gray-50">
            <div className="max-w-full px-8 py-8">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <ZoomableSection>
                  <div className="mb-8">
                    <h1 className="text-4xl font-bold text-black mb-2">
                      ¡Bienvenido de vuelta! 👋
                    </h1>
                    <p className="text-stone-600 text-lg">
                      {profile.full_name || "Usuario"} • <span className="text-stone-800 font-semibold">{userTypeInfo.label}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-600 font-medium">Sistema completamente configurado</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                    {/* Main Content Area */}
                    <div className="space-y-8">
                      {/* Status Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="border-stone-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 ${userTypeInfo.color} rounded-full flex items-center justify-center`}>
                                <UserTypeIcon className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-stone-900 mb-1 flex items-center gap-2">
                                  Rol Activo: {userTypeInfo.label}
                                  <Badge className="bg-stone-100 text-stone-700 text-xs">✓ Activo</Badge>
                                </h3>
                                <p className="text-stone-600 text-sm">
                                  {userTypeInfo.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-stone-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                                <Shield className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-stone-900 mb-1">
                                  Sistema Configurado 🎉
                                </h3>
                                <p className="text-stone-600 text-sm">
                                  Base de datos • Roles • Email • Todo listo
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-stone-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                <User className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-stone-900 mb-1">
                                  Perfil Completo
                                </h3>
                                <p className="text-stone-600 text-sm">
                                  Todas las funcionalidades disponibles
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Role-specific functionality preview */}
                      {currentRole && (
                        <div>
                          <div className="mb-6">
                            <h2 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
                              <UserTypeIcon className="h-8 w-8 text-stone-600" />
                              Funcionalidades para {userTypeInfo.label}
                            </h2>
                            <p className="text-stone-600 text-lg">
                              {currentRole === "community_member" && "Gestiona tu vida en la comunidad y solicita servicios"}
                              {currentRole === "service_provider" && "Ofrece tus servicios profesionales y gestiona clientes"}
                              {currentRole === "property_administrator" && "Administra propiedades y comunidades de forma eficiente"}
                              {!["community_member", "service_provider", "property_administrator"].includes(currentRole) && "Gestiona tus propiedades y servicios domésticos"}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {getRoleSpecificNavItems(currentRole).slice(0, 6).map((item, index) => (
                              <Card key={item.id} className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setActiveTab(item.id)}>
                                <CardContent className="p-6">
                                  <div className="flex items-start gap-4 mb-4">
                                    <div className={`w-12 h-12 ${index % 2 === 0 ? 'bg-stone-600' : 'bg-stone-700'} rounded-full flex items-center justify-center group-hover:bg-stone-800 transition-colors`}>
                                      <item.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="text-lg font-bold text-black mb-2">
                                        {item.label}
                                      </h3>
                                      <p className="text-stone-600 text-sm">
                                        {item.id === "evaluacion" && "Califica y comenta los servicios recibidos"}
                                        {item.id === "propiedades" && "Gestiona tus propiedades y espacios"}
                                        {item.id === "presupuesto" && "Solicita presupuestos personalizados"}
                                        {item.id === "proveedores" && "Encuentra profesionales de confianza"}
                                        {item.id === "servicios" && "Gestiona tu catálogo de servicios"}
                                        {item.id === "clientes" && "Administra tu cartera de clientes"}
                                        {item.id === "comunidades" && "Supervisa múltiples comunidades"}
                                        {!["evaluacion", "propiedades", "presupuesto", "proveedores", "servicios", "clientes", "comunidades"].includes(item.id) && "Funcionalidad disponible"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <Badge className="bg-stone-100 text-stone-700">
                                      ✓ Disponible
                                    </Badge>
                                    <ArrowRight className="w-5 h-5 text-stone-600 group-hover:translate-x-1 transition-transform duration-300" />
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Herramientas de Sistema */}
                      <div className="mt-12">
                        <div className="mb-6">
                          <h2 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
                            <Settings className="h-8 w-8 text-stone-600" />
                            Herramientas de Sistema
                          </h2>
                          <p className="text-stone-600 text-lg">Configuración avanzada y administración</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => router.push("/email-templates")}>
                            <CardContent className="p-6 text-center">
                              <div className="w-16 h-16 bg-stone-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-stone-700 transition-colors">
                                <Mail className="h-8 w-8 text-white" />
                              </div>
                              <h3 className="text-lg font-bold text-black mb-3">
                                Email Templates
                              </h3>
                              <p className="text-sm text-stone-600 mb-4">
                                Gestiona plantillas de autenticación
                              </p>
                              <Badge variant="outline" className="text-xs border-stone-300 text-stone-600">
                                Supabase Auth
                              </Badge>
                            </CardContent>
                          </Card>

                          <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => window.open("https://supabase.com/dashboard/project/djkrzbmgzfwagmripozi", "_blank")}>
                            <CardContent className="p-6 text-center">
                              <div className="w-16 h-16 bg-stone-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-stone-800 transition-colors">
                                <Settings className="h-8 w-8 text-white" />
                              </div>
                              <h3 className="text-lg font-bold text-black mb-3">
                                Supabase Dashboard
                              </h3>
                              <p className="text-sm text-stone-600 mb-4">
                                Panel de administración de base de datos
                              </p>
                              <Badge variant="outline" className="text-xs border-stone-300 text-stone-600">
                                Externo
                              </Badge>
                            </CardContent>
                          </Card>

                          <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => router.push("/help")}>
                            <CardContent className="p-6 text-center">
                              <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-stone-900 transition-colors">
                                <FileText className="h-8 w-8 text-white" />
                              </div>
                              <h3 className="text-lg font-bold text-black mb-3">
                                Documentación
                              </h3>
                              <p className="text-sm text-stone-600 mb-4">
                                Guías completas y ayuda
                              </p>
                              <Badge variant="outline" className="text-xs border-stone-300 text-stone-600">
                                Ayuda
                              </Badge>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </div>
                </ZoomableSection>
              )}

              {/* Mi Perfil Tab - Now includes all profile information and role management */}
              {activeTab === "perfil" && (
                <ZoomableSection>
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-black mb-2">Mi Perfil</h1>
                    <p className="text-stone-600">Gestiona tu información personal y roles del sistema</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Details */}
                    <div className="lg:col-span-1">
                      <Card className="border-stone-200 shadow-lg">
                        <CardHeader className="text-center pb-4">
                          <div className={`mx-auto w-24 h-24 ${userTypeInfo.color} rounded-full flex items-center justify-center mb-4`}>
                            <UserTypeIcon className="h-12 w-12 text-white" />
                          </div>
                          <CardTitle className="text-2xl font-bold text-black">
                            Información del Perfil
                          </CardTitle>
                          <CardDescription className="text-stone-600 font-medium">
                            Detalles de tu cuenta
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200">
                              <User className="h-5 w-5 text-stone-500" />
                              <div>
                                <p className="text-sm text-stone-500 font-medium">Nombre</p>
                                <p className="font-semibold text-black">{profile.full_name || "No especificado"}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200">
                              <Mail className="h-5 w-5 text-stone-500" />
                              <div>
                                <p className="text-sm text-stone-500 font-medium">Email</p>
                                <p className="font-semibold text-black">{user.email}</p>
                              </div>
                            </div>

                            {profile.phone && (
                              <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200">
                                <Phone className="h-5 w-5 text-stone-500" />
                                <div>
                                  <p className="text-sm text-stone-500 font-medium">Teléfono</p>
                                  <p className="font-semibold text-black">{profile.phone}</p>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200">
                              <Calendar className="h-5 w-5 text-stone-500" />
                              <div>
                                <p className="text-sm text-stone-500 font-medium">Miembro desde</p>
                                <p className="font-semibold text-black">
                                  {profile.created_at ? new Date(profile.created_at).toLocaleDateString("es-ES", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                  }) : 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-stone-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-stone-600 font-medium">Rol Activo</span>
                              <Badge className={`${userTypeInfo.color} text-white border-0`}>
                                {userTypeInfo.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-stone-500">
                              {userTypeInfo.description}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-stone-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-stone-600 font-medium">Estado</span>
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                ✓ Verificado
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Profile Management Tools - Including Role Management */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Role Management Section */}
                      <Card className="border-stone-200 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-xl font-bold text-black">
                            <Crown className="h-6 w-6 text-stone-600" />
                            Gestión de Roles
                          </CardTitle>
                          <CardDescription>
                            Administra tus diferentes roles en la plataforma
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <UserRoleManager />
                        </CardContent>
                      </Card>

                      {/* System Tools */}
                      <Card className="border-stone-200 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-xl font-bold text-black">
                            <Settings className="h-6 w-6 text-stone-600" />
                            Herramientas del Sistema
                          </CardTitle>
                          <CardDescription>
                            Pruebas y diagnósticos del sistema
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ResendTestTool />
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </ZoomableSection>
              )}

              {/* Properties Tab */}
              {activeTab === "propiedades" && (
                <ZoomableSection>
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-black mb-2">
                      {currentRole === "community_member" ? "Mi Comunidad" : 
                       currentRole === "property_administrator" ? "Gestionar Propiedades" : 
                       "Mis Propiedades"}
                    </h1>
                    <p className="text-stone-600">
                      {currentRole === "community_member" ? "Información y gestión de tu comunidad" : 
                       currentRole === "property_administrator" ? "Administra múltiples propiedades y comunidades" : 
                       "Gestiona tus propiedades residenciales"}
                    </p>
                  </div>
                  <PropertyManager />
                </ZoomableSection>
              )}

              {/* Budget Requests Tab */}
              {activeTab === "presupuesto" && (
                <ZoomableSection>
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-black mb-2">Solicitar Presupuesto</h1>
                    <p className="text-stone-600">Crear nuevas solicitudes de servicios</p>
                  </div>
                  <BudgetRequestManager />
                </ZoomableSection>
              )}

              {/* Service Evaluation Tab */}
              {activeTab === "evaluacion" && (
                <ZoomableSection>
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-black mb-2">Evaluación de Servicios</h1>
                    <p className="text-stone-600">Califica y comenta los servicios recibidos</p>
                  </div>
                  
                  <Card className="border-stone-200 shadow-lg">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <StarIcon className="h-8 w-8 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-black mb-2">
                        Sistema de Evaluaciones
                      </h3>
                      <p className="text-stone-600 mb-6">
                        Aquí podrás calificar los servicios que has recibido, ayudando a otros usuarios a encontrar los mejores proveedores.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-stone-50 rounded-lg">
                          <div className="flex items-center justify-center mb-2">
                            {[1,2,3,4,5].map((star) => (
                              <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <p className="text-sm font-medium text-stone-900">Calificación</p>
                          <p className="text-xs text-stone-600">Puntúa del 1 al 5</p>
                        </div>
                        <div className="p-4 bg-stone-50 rounded-lg">
                          <FileText className="h-6 w-6 text-stone-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-stone-900">Comentarios</p>
                          <p className="text-xs text-stone-600">Comparte tu experiencia</p>
                        </div>
                        <div className="p-4 bg-stone-50 rounded-lg">
                          <ThumbsUp className="h-6 w-6 text-stone-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-stone-900">Recomendación</p>
                          <p className="text-xs text-stone-600">¿Lo recomendarías?</p>
                        </div>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        Próximamente disponible
                      </Badge>
                    </CardContent>
                  </Card>
                </ZoomableSection>
              )}

              {/* Other tabs placeholder */}
              {!["overview", "propiedades", "presupuesto", "perfil", "evaluacion"].includes(activeTab) && (
                <ZoomableSection>
                  <Card className="border-stone-200 shadow-lg">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Settings className="h-8 w-8 text-stone-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-black mb-2">
                        Funcionalidad en Desarrollo
                      </h3>
                      <p className="text-stone-600">
                        Esta sección estará disponible próximamente. Mientras tanto, puedes explorar las otras funcionalidades del dashboard.
                      </p>
                      <Badge className="bg-stone-100 text-stone-700 mt-4">
                        Próximamente
                      </Badge>
                    </CardContent>
                  </Card>
                </ZoomableSection>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
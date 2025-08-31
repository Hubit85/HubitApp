
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, User, Crown, Star, LogOut, Settings, CheckCircle, ArrowRight, ChevronDown } from "lucide-react";
import ZoomableSection from "@/components/ZoomableSection";
import { Header } from "@/components/layout/Header";

export default function Dashboard() {
  const { user, profile, signOut, loading } = useSupabaseAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
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

  const navItems = [
    { id: "overview", label: "Resumen", icon: Shield },
    { id: "perfil", label: "Mi Perfil", icon: User },
    { id: "presupuesto", label: "Solicitar Presupuesto", icon: FileText },
    { id: "proveedores", label: "Proveedores de Servicios", icon: Store },
    { id: "favoritos", label: "Mis Favoritos", icon: Star },
    { id: "propiedades", label: "Mis Propiedades", icon: Home },
    { id: "historial", label: "Historial de Servicios", icon: FileText },
    { id: "notificaciones", label: "Notificaciones", icon: Bell },
    { id: "configuracion", label: "Configuración", icon: Settings },
    { id: "pagos", label: "Mis Pagos", icon: CreditCard },
    { id: "recomendaciones", label: "Recomendaciones", icon: ThumbsUp },
    { id: "premios", label: "Mis Premios", icon: Award },
    { id: "profile", label: "Gestión de Roles", icon: Crown }
  ];

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

  const userTypeInfo = getUserTypeInfo(profile.user_type);
  const UserTypeIcon = userTypeInfo.icon;

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
          <div className="w-64 bg-stone-900 text-white shadow-lg flex flex-col min-h-screen">
            <div className="p-6 border-b border-stone-700">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${userTypeInfo.color} rounded-full flex items-center justify-center`}>
                  <UserTypeIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{profile.full_name || "Usuario"}</h3>
                  <p className="text-stone-300 text-sm">{userTypeInfo.label}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-4">
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "secondary" : "ghost"}
                    className={`w-full justify-start text-left ${
                      activeTab === item.id 
                        ? "bg-stone-700 text-white hover:bg-stone-600" 
                        : "text-stone-300 hover:text-white hover:bg-stone-800"
                    }`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </nav>
            </div>

            {/* Sign Out Button at Bottom */}
            <div className="p-4 border-t border-stone-700">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-200"
                onClick={handleSignOut}
              >
                <LogOut className="mr-3 h-4 w-4" />
                Cerrar Sesión
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

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                      {/* Status Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-stone-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-stone-600 rounded-full flex items-center justify-center">
                                <Crown className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-stone-900 mb-1 flex items-center gap-2">
                                  Rol Asignado: Particular
                                  <Badge className="bg-stone-100 text-stone-700 text-xs">✓ Activo</Badge>
                                </h3>
                                <p className="text-stone-600 text-sm">
                                  Acceso completo a funcionalidades residenciales
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
                      </div>

                      {/* Funcionalidades para Particular */}
                      <div>
                        <div className="mb-6">
                          <h2 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
                            <User className="h-8 w-8 text-stone-600" />
                            Funcionalidades para Particular
                          </h2>
                          <p className="text-stone-600 text-lg">Gestiona tus propiedades y servicios domésticos</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setActiveTab("propiedades")}>
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-stone-600 rounded-full flex items-center justify-center group-hover:bg-stone-700 transition-colors">
                                  <Home className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-black mb-2">
                                    Gestionar Propiedades
                                  </h3>
                                  <p className="text-stone-600">
                                    Registra y administra tus viviendas personales con control total
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

                          <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setActiveTab("presupuesto")}>
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-stone-700 rounded-full flex items-center justify-center group-hover:bg-stone-800 transition-colors">
                                  <Wrench className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-black mb-2">
                                    Servicios Domésticos
                                  </h3>
                                  <p className="text-stone-600">
                                    Fontanería, electricidad, limpieza y mantenimiento
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

                          <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center group-hover:bg-stone-900 transition-colors">
                                  <Star className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-black mb-2">
                                    Evaluación de Servicios
                                  </h3>
                                  <p className="text-stone-600">
                                    Califica y comenta los servicios recibidos
                                  </p>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <Badge className="bg-stone-100 text-stone-700">
                                  ✓ Disponible
                                </Badge>
                                <Star className="w-5 h-5 text-stone-600" />
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-stone-500 rounded-full flex items-center justify-center group-hover:bg-stone-600 transition-colors">
                                  <FileText className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-black mb-2">
                                    Historial y Documentos
                                  </h3>
                                  <p className="text-stone-600">
                                    Facturas, contratos y reportes detallados
                                  </p>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <Badge className="bg-stone-100 text-stone-700">
                                  ✓ Disponible
                                </Badge>
                                <FileText className="w-5 h-5 text-stone-600" />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

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

                    {/* Profile Summary Sidebar */}
                    <div className="lg:col-span-1">
                      <Card className="border-stone-200 shadow-lg hover:shadow-xl transition-shadow duration-300 sticky top-8">
                        <CardHeader className="text-center pb-4">
                          <div className={`mx-auto w-20 h-20 ${userTypeInfo.color} rounded-full flex items-center justify-center mb-4`}>
                            <UserTypeIcon className="h-10 w-10 text-white" />
                          </div>
                          <CardTitle className="text-2xl font-bold text-black">
                            Tu Perfil
                          </CardTitle>
                          <CardDescription className="text-stone-600 font-medium">
                            {user.email}
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

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-100 border border-stone-300">
                              <Crown className="h-5 w-5 text-stone-700" />
                              <div>
                                <p className="text-sm text-stone-600 font-semibold">Rol Activo</p>
                                <p className="font-bold text-black">PARTICULAR</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                              <Shield className="h-5 w-5 text-green-600" />
                              <div>
                                <p className="text-sm text-green-600 font-semibold">Estado del Sistema</p>
                                <p className="font-bold text-green-800">✓ Totalmente Configurado</p>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-stone-200">
                            <div className="text-center space-y-3">
                              <Badge className={`${userTypeInfo.color} text-white border-0 text-sm px-4 py-2`}>
                                {userTypeInfo.label}
                              </Badge>
                              <p className="text-sm text-stone-500">
                                {userTypeInfo.description}
                              </p>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="lg"
                            className="w-full mt-4 border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold"
                            onClick={() => setActiveTab("profile")}
                          >
                            Gestionar Perfil y Roles
                          </Button>
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
                    <h1 className="text-3xl font-bold text-black mb-2">Mis Propiedades</h1>
                    <p className="text-stone-600">Gestiona tus propiedades residenciales</p>
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

              {/* Profile Management Tab */}
              {activeTab === "profile" && (
                <ZoomableSection>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Details */}
                    <div className="lg:col-span-1">
                      <Card className="border-stone-200 shadow-lg">
                        <CardHeader className="text-center pb-4">
                          <div className={`mx-auto w-24 h-24 ${userTypeInfo.color} rounded-full flex items-center justify-center mb-4`}>
                            <UserTypeIcon className="h-12 w-12 text-white" />
                          </div>
                          <CardTitle className="text-2xl font-bold text-black">
                            Tu Perfil Completo
                          </CardTitle>
                          <CardDescription className="text-stone-600 font-medium">
                            Información detallada de tu cuenta
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
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-stone-600 font-medium">Tipo de cuenta</span>
                              <Badge className={`${userTypeInfo.color} text-white border-0`}>
                                {userTypeInfo.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-stone-500 mt-2">
                              {userTypeInfo.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Profile Management Tools */}
                    <div className="lg:col-span-2 space-y-6">
                      <UserRoleManager />
                      <ResendTestTool />
                    </div>
                  </div>
                </ZoomableSection>
              )}

              {/* Other tabs placeholder */}
              {!["overview", "propiedades", "presupuesto", "profile"].includes(activeTab) && (
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
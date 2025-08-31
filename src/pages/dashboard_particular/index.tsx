
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, User, LogOut, Settings, CheckCircle, ArrowRight, 
  Home, Wrench, FileText, StarIcon, Bell, CreditCard, Heart, 
  Clock, Package, Calendar, Phone, Mail
} from "lucide-react";
import ZoomableSection from "@/components/ZoomableSection";
import { Header } from "@/components/layout/Header";
import PropertyManager from "@/components/dashboard/PropertyManager";
import BudgetRequestManager from "@/components/dashboard/BudgetRequestManager";
import UserRoleManager from "@/components/UserRoleManager";
import ResendTestTool from "@/components/ResendTestTool";

export default function DashboardParticular() {
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

  const navItems = [
    { id: "overview", label: "Resumen", icon: Home },
    { id: "perfil", label: "Mi Perfil", icon: User },
    { id: "propiedades", label: "Mis Propiedades", icon: Home },
    { id: "presupuesto", label: "Solicitar Presupuesto", icon: FileText },
    { id: "proveedores", label: "Proveedores de Servicios", icon: Wrench },
    { id: "favoritos", label: "Mis Favoritos", icon: Heart },
    { id: "historial", label: "Historial de Servicios", icon: Clock },
    { id: "evaluacion", label: "Evaluación de Servicios", icon: StarIcon },
    { id: "notificaciones", label: "Notificaciones", icon: Bell },
    { id: "pagos", label: "Mis Pagos", icon: CreditCard },
    { id: "configuracion", label: "Configuración", icon: Settings },
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

  return (
    <>
      <Head>
        <title>Dashboard Particular - HuBiT</title>
        <meta name="description" content="Panel de control para usuarios particulares" />
      </Head>

      <div className="min-h-screen bg-white">
        <Header />

        <div className="flex">
          {/* Sidebar */}
          <div className="w-72 bg-gray-800 text-white shadow-lg flex flex-col min-h-screen">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-stone-600 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{profile.full_name || "Usuario"}</h3>
                  <p className="text-gray-300 text-sm">{user.email}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  Rol: PARTICULAR
                </label>
                <div className="w-full bg-stone-600 text-white rounded-lg p-2 text-center">
                  <span className="text-sm font-medium">Usuario Particular</span>
                </div>
              </div>
            </div>

            <div className="flex-1 p-4">
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className={`w-full justify-start text-left transition-all duration-300 ${
                      activeTab === item.id 
                        ? "bg-gray-700 text-white hover:bg-gray-600" 
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    }`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <item.icon className={`mr-3 h-4 w-4 transition-colors duration-300 ${
                      activeTab === item.id ? "text-white" : "text-gray-400"
                    }`} />
                    <span className="font-medium">{item.label}</span>
                  </Button>
                ))}
              </nav>
            </div>

            {/* Sign Out Button at Bottom */}
            <div className="p-4 border-t border-gray-700">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/30 transition-all duration-300"
                onClick={handleSignOut}
              >
                <LogOut className="mr-3 h-4 w-4" />
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
                      ¡Bienvenido! 🏠
                    </h1>
                    <p className="text-stone-600 text-lg">
                      {profile.full_name || "Usuario"} • <span className="text-stone-800 font-semibold">Usuario Particular</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-600 font-medium">Cuenta configurada correctamente</span>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <Card className="border-stone-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                              <Home className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-stone-900 mb-1">Mis Propiedades</h3>
                              <p className="text-stone-600 text-sm">
                                Gestiona tus inmuebles
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-stone-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                              <FileText className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-stone-900 mb-1">Servicios Solicitados</h3>
                              <p className="text-stone-600 text-sm">
                                Presupuestos y contrataciones
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-stone-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                              <Heart className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-stone-900 mb-1">Proveedores Favoritos</h3>
                              <p className="text-stone-600 text-sm">
                                Tus profesionales de confianza
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Quick Actions */}
                    <div>
                      <h2 className="text-3xl font-bold text-black mb-6 flex items-center gap-3">
                        <Package className="h-8 w-8 text-stone-600" />
                        Acciones Rápidas
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setActiveTab("presupuesto")}>
                          <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-700 transition-colors">
                              <FileText className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-black mb-3">Solicitar Presupuesto</h3>
                            <p className="text-sm text-stone-600 mb-4">
                              Obtén presupuestos de profesionales para tus proyectos
                            </p>
                            <ArrowRight className="w-5 h-5 text-stone-600 group-hover:translate-x-1 transition-transform duration-300 mx-auto" />
                          </CardContent>
                        </Card>

                        <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setActiveTab("proveedores")}>
                          <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-700 transition-colors">
                              <Wrench className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-black mb-3">Buscar Proveedores</h3>
                            <p className="text-sm text-stone-600 mb-4">
                              Encuentra profesionales calificados cerca de ti
                            </p>
                            <ArrowRight className="w-5 h-5 text-stone-600 group-hover:translate-x-1 transition-transform duration-300 mx-auto" />
                          </CardContent>
                        </Card>

                        <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setActiveTab("historial")}>
                          <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-700 transition-colors">
                              <Clock className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-black mb-3">Historial de Servicios</h3>
                            <p className="text-sm text-stone-600 mb-4">
                              Revisa todos los servicios contratados
                            </p>
                            <ArrowRight className="w-5 h-5 text-stone-600 group-hover:translate-x-1 transition-transform duration-300 mx-auto" />
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </ZoomableSection>
              )}

              {/* Mi Perfil Tab */}
              {activeTab === "perfil" && (
                <ZoomableSection>
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-black mb-2">Mi Perfil</h1>
                    <p className="text-stone-600">Gestiona tu información personal</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                      <Card className="border-stone-200 shadow-lg">
                        <CardHeader className="text-center pb-4">
                          <div className="mx-auto w-24 h-24 bg-stone-600 rounded-full flex items-center justify-center mb-4">
                            <User className="h-12 w-12 text-white" />
                          </div>
                          <CardTitle className="text-2xl font-bold text-black">Usuario Particular</CardTitle>
                          <CardDescription className="text-stone-600 font-medium">
                            Propietario individual
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
                        </CardContent>
                      </Card>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                      <Card className="border-stone-200 shadow-lg">
                        <CardHeader>
                          <CardTitle className="text-xl font-bold text-black">Gestión de Roles</CardTitle>
                          <CardDescription>Administra tus roles en la plataforma</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <UserRoleManager />
                        </CardContent>
                      </Card>

                      <Card className="border-stone-200 shadow-lg">
                        <CardHeader>
                          <CardTitle className="text-xl font-bold text-black">Herramientas del Sistema</CardTitle>
                          <CardDescription>Pruebas y diagnósticos</CardDescription>
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
                    <h1 className="text-3xl font-bold text-black mb-2">Mis Propiedades</h1>
                    <p className="text-stone-600">Gestiona tus inmuebles y espacios</p>
                  </div>
                  <PropertyManager />
                </ZoomableSection>
              )}

              {/* Budget Requests Tab */}
              {activeTab === "presupuesto" && (
                <ZoomableSection>
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-black mb-2">Solicitar Presupuesto</h1>
                    <p className="text-stone-600">Obtén presupuestos profesionales para tus proyectos</p>
                  </div>
                  <BudgetRequestManager />
                </ZoomableSection>
              )}

              {/* Service Evaluation Tab */}
              {activeTab === "evaluacion" && (
                <ZoomableSection>
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-black mb-2">Evaluación de Servicios</h1>
                    <p className="text-stone-600">Califica los servicios recibidos</p>
                  </div>
                  
                  <Card className="border-stone-200 shadow-lg">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <StarIcon className="h-8 w-8 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-black mb-2">Sistema de Evaluaciones</h3>
                      <p className="text-stone-600 mb-6">
                        Aquí podrás calificar los servicios recibidos y ayudar a otros usuarios.
                      </p>
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
                      <h3 className="text-2xl font-bold text-black mb-2">Funcionalidad en Desarrollo</h3>
                      <p className="text-stone-600">
                        Esta sección estará disponible próximamente para usuarios particulares.
                      </p>
                      <Badge className="bg-stone-100 text-stone-700 mt-4">Próximamente</Badge>
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

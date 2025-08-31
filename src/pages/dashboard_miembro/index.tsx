
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, Users, LogOut, Settings, CheckCircle, ArrowRight, 
  Home, Wrench, FileText, StarIcon, Bell, CreditCard, Heart, 
  Clock, Package, Calendar, Phone, Mail, Star, MapPin, Shield, Store
} from "lucide-react";
import ZoomableSection from "@/components/ZoomableSection";
import { Header } from "@/components/layout/Header";
import PropertyManager from "@/components/dashboard/PropertyManager";
import BudgetRequestManager from "@/components/dashboard/BudgetRequestManager";
import UserRoleManager from "@/components/UserRoleManager";
import ResendTestTool from "@/components/ResendTestTool";

export default function DashboardMiembro() {
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
    { id: "perfil", label: "Mi Perfil", icon: Users },
    { id: "comunidad", label: "Mi Comunidad", icon: Home },
    { id: "presupuesto", label: "Solicitar Presupuesto", icon: FileText },
    { id: "proveedores", label: "Proveedores Verificados", icon: Store },
    { id: "favoritos", label: "Mis Favoritos", icon: Heart },
    { id: "historial", label: "Historial de Servicios", icon: Clock },
    { id: "evaluacion", label: "Evaluación de Servicios", icon: StarIcon },
    { id: "incidencias", label: "Reportar Incidencias", icon: Shield },
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
        <title>Dashboard Miembro de Comunidad - HuBiT</title>
        <meta name="description" content="Panel de control para miembros de comunidad" />
      </Head>

      <div className="min-h-screen bg-white">
        <Header />

        <div className="flex">
          {/* Sidebar */}
          <div className="w-72 bg-gray-800 text-white shadow-lg flex flex-col min-h-screen">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-stone-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{profile.full_name || "Usuario"}</h3>
                  <p className="text-gray-300 text-sm">{user.email}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  Rol: MIEMBRO DE COMUNIDAD
                </label>
                <div className="w-full bg-stone-700 text-white rounded-lg p-2 text-center">
                  <span className="text-sm font-medium">Miembro de Comunidad</span>
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
                      ¡Bienvenido a tu Comunidad! 🏘️
                    </h1>
                    <p className="text-stone-600 text-lg">
                      {profile.full_name || "Usuario"} • <span className="text-stone-800 font-semibold">Miembro de Comunidad</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-600 font-medium">Conectado con tu comunidad</span>
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
                              <h3 className="font-bold text-stone-900 mb-1">Mi Comunidad</h3>
                              <p className="text-stone-600 text-sm">
                                Residencial Los Olivos
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
                              <h3 className="font-bold text-stone-900 mb-1">Incidencias Activas</h3>
                              <p className="text-stone-600 text-sm">
                                2 incidencias reportadas
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-stone-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                              <Store className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-stone-900 mb-1">Proveedores Verificados</h3>
                              <p className="text-stone-600 text-sm">
                                12 proveedores disponibles
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Community Updates */}
                    <div>
                      <h2 className="text-3xl font-bold text-black mb-6 flex items-center gap-3">
                        <Bell className="h-8 w-8 text-stone-600" />
                        Actualizaciones de la Comunidad
                      </h2>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <Card className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-lg text-blue-900">Junta Extraordinaria Programada</h4>
                                <p className="text-stone-600 mb-2">Se ha convocado una junta extraordinaria para aprobar las obras de la fachada.</p>
                                <div className="flex items-center gap-2 text-sm text-stone-500">
                                  <Calendar className="h-4 w-4" />
                                  <span>25 de Febrero, 2025 - 19:00</span>
                                </div>
                              </div>
                              <Badge className="bg-blue-100 text-blue-800">Importante</Badge>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-green-500">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-lg text-green-900">Nuevos Proveedores Verificados</h4>
                                <p className="text-stone-600 mb-2">Se han añadido 3 nuevos proveedores de servicios verificados para la comunidad.</p>
                                <div className="flex items-center gap-2 text-sm text-stone-500">
                                  <Store className="h-4 w-4" />
                                  <span>Fontanería, Electricidad, Jardinería</span>
                                </div>
                              </div>
                              <Badge className="bg-green-100 text-green-800">Nuevo</Badge>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-orange-500">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-lg text-orange-900">Mantenimiento del Ascensor</h4>
                                <p className="text-stone-600 mb-2">El ascensor principal estará fuera de servicio el próximo martes para mantenimiento.</p>
                                <div className="flex items-center gap-2 text-sm text-stone-500">
                                  <Clock className="h-4 w-4" />
                                  <span>Martes 28 de Febrero - 09:00 a 17:00</span>
                                </div>
                              </div>
                              <Badge className="bg-orange-100 text-orange-800">Aviso</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                      <h2 className="text-3xl font-bold text-black mb-6 flex items-center gap-3">
                        <Package className="h-8 w-8 text-stone-600" />
                        Acciones Rápidas
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setActiveTab("incidencias")}>
                          <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-700 transition-colors">
                              <Shield className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-black mb-3">Reportar Incidencia</h3>
                            <p className="text-sm text-stone-600 mb-4">
                              Informa sobre problemas en tu comunidad
                            </p>
                            <ArrowRight className="w-5 h-5 text-stone-600 group-hover:translate-x-1 transition-transform duration-300 mx-auto" />
                          </CardContent>
                        </Card>

                        <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setActiveTab("presupuesto")}>
                          <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-700 transition-colors">
                              <FileText className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-black mb-3">Solicitar Servicio</h3>
                            <p className="text-sm text-stone-600 mb-4">
                              Obtén presupuestos de proveedores verificados
                            </p>
                            <ArrowRight className="w-5 h-5 text-stone-600 group-hover:translate-x-1 transition-transform duration-300 mx-auto" />
                          </CardContent>
                        </Card>

                        <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setActiveTab("proveedores")}>
                          <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-700 transition-colors">
                              <Store className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-black mb-3">Proveedores Verificados</h3>
                            <p className="text-sm text-stone-600 mb-4">
                              Encuentra profesionales de confianza
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
                    <p className="text-stone-600">Gestiona tu información como miembro de comunidad</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                      <Card className="border-stone-200 shadow-lg">
                        <CardHeader className="text-center pb-4">
                          <div className="mx-auto w-24 h-24 bg-stone-700 rounded-full flex items-center justify-center mb-4">
                            <Users className="h-12 w-12 text-white" />
                          </div>
                          <CardTitle className="text-2xl font-bold text-black">Miembro de Comunidad</CardTitle>
                          <CardDescription className="text-stone-600 font-medium">
                            Residencial Los Olivos
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200">
                              <Users className="h-5 w-5 text-stone-500" />
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

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200">
                              <Home className="h-5 w-5 text-stone-500" />
                              <div>
                                <p className="text-sm text-stone-500 font-medium">Vivienda</p>
                                <p className="font-semibold text-black">Edificio A - Portal 3 - 2ºB</p>
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

              {/* Community Tab */}
              {activeTab === "comunidad" && (
                <ZoomableSection>
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-black mb-2">Mi Comunidad</h1>
                    <p className="text-stone-600">Información y gestión de tu comunidad</p>
                  </div>
                  
                  <div className="space-y-6">
                    <Card className="border-stone-200 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Home className="h-6 w-6 text-stone-600" />
                          Residencial Los Olivos
                        </CardTitle>
                        <CardDescription>
                          Av. Los Olivos 123, Madrid - Administrada por García & Asociados S.L.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-bold text-blue-900 text-2xl">24</h3>
                            <p className="text-blue-700 text-sm">Viviendas</p>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <h3 className="font-bold text-green-900 text-2xl">3</h3>
                            <p className="text-green-700 text-sm">Edificios</p>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <h3 className="font-bold text-purple-900 text-2xl">2</h3>
                            <p className="text-purple-700 text-sm">Áreas Comunes</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-stone-200 shadow-lg">
                        <CardHeader>
                          <CardTitle className="text-lg">Próximas Juntas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-semibold text-blue-900">Junta Extraordinaria</p>
                              <p className="text-sm text-blue-700">25 Feb 2025 - 19:00</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Calendar className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="font-semibold text-gray-900">Junta Ordinaria</p>
                              <p className="text-sm text-gray-700">15 Mar 2025 - 18:30</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-stone-200 shadow-lg">
                        <CardHeader>
                          <CardTitle className="text-lg">Contactos Importantes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                            <Phone className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-semibold text-green-900">Administrador</p>
                              <p className="text-sm text-green-700">García & Asociados - 91 123 45 67</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                            <Phone className="h-5 w-5 text-orange-600" />
                            <div>
                              <p className="font-semibold text-orange-900">Emergencias</p>
                              <p className="text-sm text-orange-700">Conserje - 91 765 43 21</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </ZoomableSection>
              )}

              {/* Budget Requests Tab */}
              {activeTab === "presupuesto" && (
                <ZoomableSection>
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-black mb-2">Solicitar Presupuesto</h1>
                    <p className="text-stone-600">Obtén presupuestos de proveedores verificados de tu comunidad</p>
                  </div>
                  <BudgetRequestManager />
                </ZoomableSection>
              )}

              {/* Incident Reporting Tab */}
              {activeTab === "incidencias" && (
                <ZoomableSection>
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-black mb-2">Reportar Incidencias</h1>
                    <p className="text-stone-600">Informa sobre problemas o averías en tu comunidad</p>
                  </div>
                  
                  <Card className="border-stone-200 shadow-lg">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="h-8 w-8 text-red-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-black mb-2">Sistema de Incidencias</h3>
                      <p className="text-stone-600 mb-6">
                        Aquí podrás reportar incidencias, averías o problemas en las zonas comunes de tu comunidad. El administrador de fincas recibirá la notificación inmediatamente.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-stone-50 rounded-lg">
                          <Shield className="h-6 w-6 text-stone-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-stone-900">Reportar</p>
                          <p className="text-xs text-stone-600">Describe el problema</p>
                        </div>
                        <div className="p-4 bg-stone-50 rounded-lg">
                          <Bell className="h-6 w-6 text-stone-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-stone-900">Notificar</p>
                          <p className="text-xs text-stone-600">Al administrador</p>
                        </div>
                        <div className="p-4 bg-stone-50 rounded-lg">
                          <CheckCircle className="h-6 w-6 text-stone-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-stone-900">Resolver</p>
                          <p className="text-xs text-stone-600">Seguimiento automático</p>
                        </div>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                        Próximamente disponible
                      </Badge>
                    </CardContent>
                  </Card>
                </ZoomableSection>
              )}

              {/* Service Evaluation Tab */}
              {activeTab === "evaluacion" && (
                <ZoomableSection>
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-black mb-2">Evaluación de Servicios</h1>
                    <p className="text-stone-600">Califica los servicios recibidos en tu comunidad</p>
                  </div>
                  
                  <Card className="border-stone-200 shadow-lg">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <StarIcon className="h-8 w-8 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-black mb-2">Sistema de Evaluaciones</h3>
                      <p className="text-stone-600 mb-6">
                        Evalúa los servicios que has recibido para ayudar a otros miembros de la comunidad a encontrar los mejores proveedores.
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
                          <Users className="h-6 w-6 text-stone-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-stone-900">Comunidad</p>
                          <p className="text-xs text-stone-600">Ayuda a tus vecinos</p>
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
              {!["overview", "comunidad", "presupuesto", "perfil", "incidencias", "evaluacion"].includes(activeTab) && (
                <ZoomableSection>
                  <Card className="border-stone-200 shadow-lg">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Settings className="h-8 w-8 text-stone-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-black mb-2">Funcionalidad en Desarrollo</h3>
                      <p className="text-stone-600">
                        Esta sección estará disponible próximamente para miembros de comunidad.
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

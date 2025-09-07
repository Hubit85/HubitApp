
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  User, Users, Building, TrendingUp, AlertTriangle, Calendar, 
  DollarSign, FileText, Settings, Bell, Star, Search, Filter,
  Plus, Edit, Trash2, Eye, CheckCircle, Clock, MapPin, Phone,
  Mail, Shield, Home, BarChart3, Loader2, LogOut, ClipboardList,
  Package, ChevronRight, Video, Briefcase, Store, StarIcon, CreditCard
} from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/layout/Header";
import { SidebarFincas } from "@/components/layout/SidebarFincas";
import PropertySelector from "@/components/PropertySelector";
import ZoomableSection from "@/components/ZoomableSection";
import SupabaseStatus from "@/components/SupabaseStatus";
import SystemStatusCard from "@/components/SystemStatusCard";
import UserRoleManager from "@/components/UserRoleManager";

export default function DashboardAdministrador() {
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
    { id: "overview", label: "Panel de Control", icon: Home },
    { id: "perfil", label: "Mi Perfil", icon: Building },
    { id: "comunidades", label: "Comunidades Gestionadas", icon: Users },
    { id: "propiedades", label: "Gestión de Propiedades", icon: Home },
    { id: "presupuestos", label: "Solicitar Presupuesto", icon: FileText },
    { id: "proveedores", label: "Proveedores Autorizados", icon: Store },
    { id: "incidencias", label: "Gestión de Incidencias", icon: AlertTriangle },
    { id: "juntas", label: "Juntas y Reuniones", icon: Video },
    { id: "evaluacion", label: "Evaluación de Servicios", icon: StarIcon },
    { id: "informes", label: "Informes y Reportes", icon: BarChart3 },
    { id: "facturacion", label: "Facturación", icon: CreditCard },
    { id: "notificaciones", label: "Notificaciones", icon: Bell },
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
        <title>Dashboard Administrador de Fincas - HuBiT</title>
        <meta name="description" content="Panel de control para administradores de fincas" />
      </Head>

      <div className="min-h-screen bg-white">
        <Header />

        <div className="flex">
          {/* Sidebar */}
          <div className="w-72 bg-gray-800 text-white shadow-lg flex flex-col min-h-screen">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-stone-900 rounded-xl flex items-center justify-center shadow-lg">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{profile.full_name || "Usuario"}</h3>
                  <p className="text-gray-300 text-sm">{user.email}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  Rol: ADMINISTRADOR DE FINCAS
                </label>
                <div className="w-full bg-stone-900 text-white rounded-lg p-2 text-center">
                  <span className="text-sm font-medium">Administrador de Fincas</span>
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
                      Panel de Control Administrativo 🏢
                    </h1>
                    <p className="text-stone-600 text-lg">
                      {profile.full_name || "Usuario"} • <span className="text-stone-800 font-semibold">Administrador de Fincas</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-600 font-medium">Sistema de administración activo</span>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Management Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <Card className="border-stone-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                              <Building className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-stone-900 mb-1">Comunidades Gestionadas</h3>
                              <p className="text-2xl font-bold text-blue-600">10</p>
                              <p className="text-stone-600 text-sm">+2 este mes</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-stone-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                              <DollarSign className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-stone-900 mb-1">Presupuesto Total</h3>
                              <p className="text-2xl font-bold text-green-600">€245,000</p>
                              <p className="text-stone-600 text-sm">Administración mensual</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-stone-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                              <AlertTriangle className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-stone-900 mb-1">Incidencias Activas</h3>
                              <p className="text-2xl font-bold text-orange-600">23</p>
                              <p className="text-stone-600 text-sm">-5 vs semana anterior</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-stone-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                              <ClipboardList className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-stone-900 mb-1">Contratos Activos</h3>
                              <p className="text-2xl font-bold text-purple-600">47</p>
                              <p className="text-stone-600 text-sm">Proveedores y servicios</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Management Activity */}
                    <div>
                      <h2 className="text-3xl font-bold text-black mb-6 flex items-center gap-3">
                        <Clock className="h-8 w-8 text-stone-600" />
                        Actividad de Gestión
                      </h2>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border-stone-200 shadow-lg">
                          <CardHeader>
                            <CardTitle className="text-lg">Incidencias Recientes</CardTitle>
                            <CardDescription>Reportes de las comunidades</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                              <div>
                                <h4 className="font-semibold text-red-900">Fuga de agua - Garaje</h4>
                                <p className="text-sm text-red-700">Comunidad Abando</p>
                                <p className="text-xs text-red-600">Urgente - Hace 1 hora</p>
                              </div>
                              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                                Gestionar
                              </Button>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                              <div>
                                <h4 className="font-semibold text-orange-900">Ascensor averiado</h4>
                                <p className="text-sm text-orange-700">Residencial Los Olivos</p>
                                <p className="text-xs text-orange-600">Alta - Hace 3 horas</p>
                              </div>
                              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                                Gestionar
                              </Button>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                              <div>
                                <h4 className="font-semibold text-yellow-900">Iluminación portal</h4>
                                <p className="text-sm text-yellow-700">Comunidad Indautxu</p>
                                <p className="text-xs text-yellow-600">Media - Hace 1 día</p>
                              </div>
                              <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                                Gestionar
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-stone-200 shadow-lg">
                          <CardHeader>
                            <CardTitle className="text-lg">Próximas Juntas</CardTitle>
                            <CardDescription>Reuniones programadas</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                              <div>
                                <h4 className="font-semibold text-blue-900">Junta Extraordinaria</h4>
                                <p className="text-sm text-blue-700">Comunidad Abando - Obras fachada</p>
                                <p className="text-xs text-blue-600">15 Mayo 2025 - 19:00</p>
                              </div>
                              <Badge className="bg-blue-100 text-blue-800">Programada</Badge>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                              <div>
                                <h4 className="font-semibold text-green-900">Reunión Presupuestos</h4>
                                <p className="text-sm text-green-700">Urbide 25 - Presupuesto anual</p>
                                <p className="text-xs text-green-600">22 Mayo 2025 - 18:30</p>
                              </div>
                              <Badge className="bg-green-100 text-green-800">Confirmada</Badge>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                              <div>
                                <h4 className="font-semibold text-purple-900">Asamblea General</h4>
                                <p className="text-sm text-purple-700">Residencial Los Olivos</p>
                                <p className="text-xs text-purple-600">28 Mayo 2025 - 20:00</p>
                              </div>
                              <Badge className="bg-purple-100 text-purple-800">Pendiente</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Quick Management Actions */}
                    <div>
                      <h2 className="text-3xl font-bold text-black mb-6 flex items-center gap-3">
                        <Package className="h-8 w-8 text-stone-600" />
                        Herramientas de Gestión
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setActiveTab("incidencias")}>
                          <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-700 transition-colors">
                              <AlertTriangle className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-black mb-3">Gestionar Incidencias</h3>
                            <p className="text-sm text-stone-600 mb-4">
                              Administra reportes y urgencias
                            </p>
                            <ChevronRight className="w-5 h-5 text-stone-600 group-hover:translate-x-1 transition-transform duration-300 mx-auto" />
                          </CardContent>
                        </Card>

                        <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setActiveTab("presupuestos")}>
                          <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-700 transition-colors">
                              <FileText className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-black mb-3">Licitar Presupuestos</h3>
                            <p className="text-sm text-stone-600 mb-4">
                              Gestiona contratos y licitaciones
                            </p>
                            <ChevronRight className="w-5 h-5 text-stone-600 group-hover:translate-x-1 transition-transform duration-300 mx-auto" />
                          </CardContent>
                        </Card>

                        <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setActiveTab("juntas")}>
                          <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-700 transition-colors">
                              <Video className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-black mb-3">Programar Juntas</h3>
                            <p className="text-sm text-stone-600 mb-4">
                              Organiza reuniones de comunidad
                            </p>
                            <ChevronRight className="w-5 h-5 text-stone-600 group-hover:translate-x-1 transition-transform duration-300 mx-auto" />
                          </CardContent>
                        </Card>

                        <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setActiveTab("informes")}>
                          <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-700 transition-colors">
                              <BarChart3 className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-black mb-3">Generar Informes</h3>
                            <p className="text-sm text-stone-600 mb-4">
                              Reportes y análisis financiero
                            </p>
                            <ChevronRight className="w-5 h-5 text-stone-600 group-hover:translate-x-1 transition-transform duration-300 mx-auto" />
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div>
                      <h2 className="text-3xl font-bold text-black mb-6 flex items-center gap-3">
                        <TrendingUp className="h-8 w-8 text-stone-600" />
                        Resumen Financiero
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="border-stone-200 shadow-lg">
                          <CardHeader className="text-center">
                            <CardTitle className="text-lg">Ingresos Mensuales</CardTitle>
                          </CardHeader>
                          <CardContent className="text-center">
                            <p className="text-3xl font-bold text-green-600 mb-2">€28,450</p>
                            <p className="text-sm text-stone-600">Cuotas de administración</p>
                            <Badge className="bg-green-100 text-green-800 mt-2">+12% vs mes anterior</Badge>
                          </CardContent>
                        </Card>

                        <Card className="border-stone-200 shadow-lg">
                          <CardHeader className="text-center">
                            <CardTitle className="text-lg">Gastos Pendientes</CardTitle>
                          </CardHeader>
                          <CardContent className="text-center">
                            <p className="text-3xl font-bold text-orange-600 mb-2">€8,450</p>
                            <p className="text-sm text-stone-600">Facturas por pagar</p>
                            <Badge className="bg-orange-100 text-orange-800 mt-2">-€1,200 vs anterior</Badge>
                          </CardContent>
                        </Card>

                        <Card className="border-stone-200 shadow-lg">
                          <CardHeader className="text-center">
                            <CardTitle className="text-lg">Morosidad</CardTitle>
                          </CardHeader>
                          <CardContent className="text-center">
                            <p className="text-3xl font-bold text-red-600 mb-2">€2,180</p>
                            <p className="text-sm text-stone-600">Cuotas impagadas</p>
                            <Badge className="bg-red-100 text-red-800 mt-2">3 propietarios</Badge>
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
                    <h1 className="text-3xl font-bold text-black mb-2">Mi Perfil Administrativo</h1>
                    <p className="text-stone-600">Gestiona tu información de administrador de fincas</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                      <Card className="border-stone-200 shadow-lg">
                        <CardHeader className="text-center pb-4">
                          <div className="mx-auto w-24 h-24 bg-stone-900 rounded-full flex items-center justify-center mb-4">
                            <Building className="h-12 w-12 text-white" />
                          </div>
                          <CardTitle className="text-2xl font-bold text-black">Administrador de Fincas</CardTitle>
                          <CardDescription className="text-stone-600 font-medium">
                            Profesional colegiado
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200">
                              <Building className="h-5 w-5 text-stone-500" />
                              <div>
                                <p className="text-sm text-stone-500 font-medium">Empresa</p>
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
                              <Briefcase className="h-5 w-5 text-stone-500" />
                              <div>
                                <p className="text-sm text-stone-500 font-medium">Número de Colegiado</p>
                                <p className="font-semibold text-black">CAF-MAD-2847</p>
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
                              <MapPin className="h-5 w-5 text-stone-500" />
                              <div>
                                <p className="text-sm text-stone-500 font-medium">Zona de Actuación</p>
                                <p className="font-semibold text-black">Madrid y área metropolitana</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200">
                              <Calendar className="h-5 w-5 text-stone-500" />
                              <div>
                                <p className="text-sm text-stone-500 font-medium">En la plataforma desde</p>
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
                          <SystemStatusCard />
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </ZoomableSection>
              )}

              {/* Communities Management Tab */}
              {activeTab === "comunidades" && (
                <ZoomableSection>
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-black mb-2">Comunidades Gestionadas</h1>
                    <p className="text-stone-600">Administra todas las comunidades bajo tu gestión</p>
                  </div>
                  
                  <Card className="border-stone-200 shadow-lg">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-black mb-2">Gestión Integral de Comunidades</h3>
                      <p className="text-stone-600 mb-6">
                        Desde aquí puedes administrar todas las comunidades, ver su estado financiero, gestionar incidencias y programar reuniones.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-stone-50 rounded-lg">
                          <Building className="h-6 w-6 text-stone-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-stone-900">10 Comunidades</p>
                          <p className="text-xs text-stone-600">En administración</p>
                        </div>
                        <div className="p-4 bg-stone-50 rounded-lg">
                          <Users className="h-6 w-6 text-stone-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-stone-900">847 Propietarios</p>
                          <p className="text-xs text-stone-600">Total gestionados</p>
                        </div>
                        <div className="p-4 bg-stone-50 rounded-lg">
                          <DollarSign className="h-6 w-6 text-stone-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-stone-900">€245K/mes</p>
                          <p className="text-xs text-stone-600">Facturación total</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        Accede desde el Dashboard de Administrador de Fincas
                      </Badge>
                    </CardContent>
                  </Card>
                </ZoomableSection>
              )}

              {/* Incident Management Tab */}
              {activeTab === "incidencias" && (
                <ZoomableSection>
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-black mb-2">Gestión de Incidencias</h1>
                    <p className="text-stone-600">Administra incidencias reportadas por las comunidades</p>
                  </div>
                  
                  <Card className="border-stone-200 shadow-lg">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-black mb-2">Sistema de Gestión de Incidencias</h3>
                      <p className="text-stone-600 mb-6">
                        Centraliza todas las incidencias reportadas por miembros de las comunidades, priorízalas y gestiona su resolución con proveedores especializados.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="p-4 bg-stone-50 rounded-lg">
                          <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-stone-900">23 Activas</p>
                          <p className="text-xs text-stone-600">Incidencias</p>
                        </div>
                        <div className="p-4 bg-stone-50 rounded-lg">
                          <Clock className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-stone-900">8 Urgentes</p>
                          <p className="text-xs text-stone-600">Requieren atención</p>
                        </div>
                        <div className="p-4 bg-stone-50 rounded-lg">
                          <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-stone-900">15 Resueltas</p>
                          <p className="text-xs text-stone-600">Esta semana</p>
                        </div>
                        <div className="p-4 bg-stone-50 rounded-lg">
                          <Store className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-stone-900">12 Proveedores</p>
                          <p className="text-xs text-stone-600">Asignados</p>
                        </div>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                        Integrado con sistema de presupuestos automáticos
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
                    <p className="text-stone-600">Supervisa las evaluaciones de servicios en las comunidades</p>
                  </div>
                  
                  <Card className="border-stone-200 shadow-lg">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <StarIcon className="h-8 w-8 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-black mb-2">Sistema de Evaluaciones Centralizadas</h3>
                      <p className="text-stone-600 mb-6">
                        Monitorea y gestiona todas las evaluaciones de servicios realizadas en tus comunidades. Identifica los mejores proveedores y toma decisiones informadas sobre contrataciones futuras.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-stone-50 rounded-lg">
                          <div className="flex items-center justify-center mb-2">
                            {[1,2,3,4,5].map((star) => (
                              <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <p className="text-sm font-medium text-stone-900">Promedio General</p>
                          <p className="text-xs text-stone-600">4.6/5.0 en todas las comunidades</p>
                        </div>
                        <div className="p-4 bg-stone-50 rounded-lg">
                          <Eye className="h-6 w-6 text-stone-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-stone-900">Monitor de Calidad</p>
                          <p className="text-xs text-stone-600">Seguimiento automático</p>
                        </div>
                        <div className="p-4 bg-stone-50 rounded-lg">
                          <BarChart3 className="h-6 w-6 text-stone-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-stone-900">Informes Detallados</p>
                          <p className="text-xs text-stone-600">Análisis de rendimiento</p>
                        </div>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        Próximamente disponible
                      </Badge>
                    </CardContent>
                  </Card>
                </ZoomableSection>
              )}

              {/* Reports Tab */}
              {activeTab === "informes" && (
                <ZoomableSection>
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-black mb-2">Informes y Reportes</h1>
                    <p className="text-stone-600">Genera informes financieros y de gestión</p>
                  </div>
                  
                  <Card className="border-stone-200 shadow-lg">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BarChart3 className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-black mb-2">Centro de Informes</h3>
                      <p className="text-stone-600 mb-6">
                        Genera informes automáticos sobre el estado financiero, incidencias, contratos y rendimiento de las comunidades que administras.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="p-4 bg-stone-50 rounded-lg">
                          <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-stone-900">Financiero</p>
                          <p className="text-xs text-stone-600">Ingresos y gastos</p>
                        </div>
                        <div className="p-4 bg-stone-50 rounded-lg">
                          <AlertTriangle className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-stone-900">Incidencias</p>
                          <p className="text-xs text-stone-600">Reportes de gestión</p>
                        </div>
                        <div className="p-4 bg-stone-50 rounded-lg">
                          <ClipboardList className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-stone-900">Contratos</p>
                          <p className="text-xs text-stone-600">Estado y vencimientos</p>
                        </div>
                        <div className="p-4 bg-stone-50 rounded-lg">
                          <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-stone-900">Rendimiento</p>
                          <p className="text-xs text-stone-600">KPIs y métricas</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        Exportación a PDF y Excel disponible
                      </Badge>
                    </CardContent>
                  </Card>
                </ZoomableSection>
              )}

              {/* Other tabs placeholder */}
              {!["overview", "comunidades", "incidencias", "perfil", "evaluacion", "informes"].includes(activeTab) && (
                <ZoomableSection>
                  <Card className="border-stone-200 shadow-lg">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Settings className="h-8 w-8 text-stone-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-black mb-2">Funcionalidad en Desarrollo</h3>
                      <p className="text-stone-600">
                        Esta sección estará disponible próximamente para administradores de fincas.
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
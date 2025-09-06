
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
  User, Users, Store, TrendingUp, AlertTriangle, Calendar, 
  DollarSign, FileText, Settings, Bell, Star, Search, Filter,
  Plus, Edit, Trash2, Eye, CheckCircle, Clock, MapPin, Phone,
  Mail, Shield, Home, BarChart3, Wrench, Loader2, LogOut, Package,
  ChevronRight, CreditCard, StarIcon, Award, Target, ClipboardList
} from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/layout/Header";
import { SidebarServiceProvider } from "@/components/layout/SidebarServiceProvider";
import PropertySelector from "@/components/PropertySelector";
import ZoomableSection from "@/components/ZoomableSection";
import SupabaseStatus from "@/components/SupabaseStatus";
import SystemStatusCard from "@/components/SystemStatusCard";
import UserRoleManager from "@/components/UserRoleManager";

export default function DashboardProveedor() {
  const { user, profile, userRoles, activeRole, signOut, loading } = useSupabaseAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Get company name from the service provider role data
  const getCompanyName = () => {
    const serviceProviderRole = userRoles.find(role => role.role_type === 'service_provider');
    
    if (serviceProviderRole?.role_specific_data) {
      // Check for company_name in the role specific data
      const roleData = serviceProviderRole.role_specific_data as any;
      
      if (roleData.company_name && typeof roleData.company_name === 'string' && roleData.company_name.trim()) {
        return roleData.company_name;
      }
    }
    
    // Fallback: if no company name in role data, check if profile full_name looks like a company name
    // (this handles the case where the user registered with company name as full_name)
    if (profile?.full_name) {
      const fullName = profile.full_name;
      // Check if it contains business-related words or is longer than typical personal names
      const businessKeywords = ['s.l.', 'sl', 's.a.', 'sa', 'ltda', 'servicios', 'empresa', 'compañía', 'group', 'madrid', 'barcelona', 'valencia'];
      const containsBusinessKeyword = businessKeywords.some(keyword => fullName.toLowerCase().includes(keyword));
      const isLongName = fullName.split(' ').length > 3; // More than 3 words likely a company
      
      if (containsBusinessKeyword || isLongName) {
        return fullName;
      }
    }
    
    // Final fallback
    return "Empresa no especificada";
  };

  const companyName = getCompanyName();

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
    { id: "perfil", label: "Mi Perfil", icon: Wrench },
    { id: "servicios", label: "Mis Servicios", icon: Store },
    { id: "presupuestos", label: "Gestionar Presupuestos", icon: FileText },
    { id: "clientes", label: "Mis Clientes", icon: Users },
    { id: "calendario", label: "Calendario", icon: Calendar },
    { id: "contratos", label: "Contratos Activos", icon: ClipboardList },
    { id: "evaluacion", label: "Evaluaciones Recibidas", icon: StarIcon },
    { id: "facturacion", label: "Facturación", icon: CreditCard },
    { id: "estadisticas", label: "Estadísticas", icon: TrendingUp },
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
        <title>Dashboard Proveedor de Servicios - HuBiT</title>
        <meta name="description" content="Panel de control para proveedores de servicios" />
      </Head>

      <div className="min-h-screen bg-white">
        <Header />

        <div className="flex">
          {/* Sidebar */}
          <div className="w-72 bg-gray-800 text-white shadow-lg flex flex-col min-h-screen">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-stone-800 rounded-xl flex items-center justify-center shadow-lg">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{companyName}</h3>
                  <p className="text-gray-300 text-sm">{user.email}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  Rol: PROVEEDOR DE SERVICIOS
                </label>
                <div className="w-full bg-stone-800 text-white rounded-lg p-2 text-center">
                  <span className="text-sm font-medium">Proveedor de Servicios</span>
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
                      ¡Tu Negocio en Marcha! 🔧
                    </h1>
                    <p className="text-stone-600 text-lg">
                      {companyName} • <span className="text-stone-800 font-semibold">Proveedor de Servicios</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-600 font-medium">Perfil verificado y activo</span>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Business Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <Card className="border-stone-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                              <FileText className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-stone-900 mb-1">Presupuestos Activos</h3>
                              <p className="text-2xl font-bold text-blue-600">12</p>
                              <p className="text-stone-600 text-sm">+3 esta semana</p>
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
                              <h3 className="font-bold text-stone-900 mb-1">Ingresos del Mes</h3>
                              <p className="text-2xl font-bold text-green-600">€3,450</p>
                              <p className="text-stone-600 text-sm">+15% vs mes anterior</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-stone-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                              <Users className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-stone-900 mb-1">Clientes Activos</h3>
                              <p className="text-2xl font-bold text-purple-600">28</p>
                              <p className="text-stone-600 text-sm">+5 nuevos clientes</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-stone-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
                              <Star className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-stone-900 mb-1">Calificación Promedio</h3>
                              <p className="text-2xl font-bold text-amber-600">4.8</p>
                              <div className="flex items-center">
                                {[1,2,3,4,5].map((star) => (
                                  <Star key={star} className="h-3 w-3 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recent Activity */}
                    <div>
                      <h2 className="text-3xl font-bold text-black mb-6 flex items-center gap-3">
                        <Clock className="h-8 w-8 text-stone-600" />
                        Actividad Reciente
                      </h2>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border-stone-200 shadow-lg">
                          <CardHeader>
                            <CardTitle className="text-lg">Nuevas Solicitudes</CardTitle>
                            <CardDescription>Presupuestos pendientes de respuesta</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                              <div>
                                <h4 className="font-semibold text-blue-900">Reparación de Fontanería</h4>
                                <p className="text-sm text-blue-700">Comunidad Los Olivos</p>
                                <p className="text-xs text-blue-600">Hace 2 horas</p>
                              </div>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                Responder
                              </Button>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                              <div>
                                <h4 className="font-semibold text-green-900">Instalación Eléctrica</h4>
                                <p className="text-sm text-green-700">Residencial Madrid</p>
                                <p className="text-xs text-green-600">Hace 5 horas</p>
                              </div>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Responder
                              </Button>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                              <div>
                                <h4 className="font-semibold text-orange-900">Pintura de Fachada</h4>
                                <p className="text-sm text-orange-700">Villa Santa Clara</p>
                                <p className="text-xs text-orange-600">Hace 1 día</p>
                              </div>
                              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                                Responder
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-stone-200 shadow-lg">
                          <CardHeader>
                            <CardTitle className="text-lg">Trabajos Próximos</CardTitle>
                            <CardDescription>Servicios programados esta semana</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                              <div>
                                <h4 className="font-semibold text-purple-900">Mantenimiento de Calefacción</h4>
                                <p className="text-sm text-purple-700">Cliente: María García</p>
                                <p className="text-xs text-purple-600">Mañana 10:00 AM</p>
                              </div>
                              <Badge className="bg-purple-100 text-purple-800">Mañana</Badge>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                              <div>
                                <h4 className="font-semibold text-indigo-900">Revisión de Ascensor</h4>
                                <p className="text-sm text-indigo-700">Cliente: Comunidad Centro</p>
                                <p className="text-xs text-indigo-600">Viernes 9:00 AM</p>
                              </div>
                              <Badge className="bg-indigo-100 text-indigo-800">Viernes</Badge>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                              <div>
                                <h4 className="font-semibold text-teal-900">Instalación de Jardín</h4>
                                <p className="text-sm text-teal-700">Cliente: José Rodríguez</p>
                                <p className="text-xs text-teal-600">Sábado 8:00 AM</p>
                              </div>
                              <Badge className="bg-teal-100 text-teal-800">Sábado</Badge>
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
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setActiveTab("presupuestos")}>
                          <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-700 transition-colors">
                              <FileText className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-black mb-3">Crear Presupuesto</h3>
                            <p className="text-sm text-stone-600 mb-4">
                              Responde a nuevas solicitudes
                            </p>
                            <ChevronRight className="w-5 h-5 text-stone-600 group-hover:translate-x-1 transition-transform duration-300 mx-auto" />
                          </CardContent>
                        </Card>

                        <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setActiveTab("servicios")}>
                          <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-700 transition-colors">
                              <Store className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-black mb-3">Gestionar Servicios</h3>
                            <p className="text-sm text-stone-600 mb-4">
                              Actualiza tu catálogo
                            </p>
                            <ChevronRight className="w-5 h-5 text-stone-600 group-hover:translate-x-1 transition-transform duration-300 mx-auto" />
                          </CardContent>
                        </Card>

                        <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setActiveTab("calendario")}>
                          <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-700 transition-colors">
                              <Calendar className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-black mb-3">Programar Cita</h3>
                            <p className="text-sm text-stone-600 mb-4">
                              Organiza tus trabajos
                            </p>
                            <ChevronRight className="w-5 h-5 text-stone-600 group-hover:translate-x-1 transition-transform duration-300 mx-auto" />
                          </CardContent>
                        </Card>

                        <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setActiveTab("facturacion")}>
                          <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-700 transition-colors">
                              <CreditCard className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-black mb-3">Generar Factura</h3>
                            <p className="text-sm text-stone-600 mb-4">
                              Facturación y pagos
                            </p>
                            <ChevronRight className="w-5 h-5 text-stone-600 group-hover:translate-x-1 transition-transform duration-300 mx-auto" />
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
                    <h1 className="text-3xl font-bold text-black mb-2">Mi Perfil Profesional</h1>
                    <p className="text-stone-600">Gestiona tu información de proveedor de servicios</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                      <Card className="border-stone-200 shadow-lg">
                        <CardHeader className="text-center pb-4">
                          <div className="mx-auto w-24 h-24 bg-stone-800 rounded-full flex items-center justify-center mb-4">
                            <Wrench className="h-12 w-12 text-white" />
                          </div>
                          <CardTitle className="text-2xl font-bold text-black">Proveedor de Servicios</CardTitle>
                          <CardDescription className="text-stone-600 font-medium">
                            Profesional verificado
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200">
                              <Wrench className="h-5 w-5 text-stone-500" />
                              <div>
                                <p className="text-sm text-stone-500 font-medium">Empresa</p>
                                <p className="font-semibold text-black">{companyName}</p>
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
                              <Store className="h-5 w-5 text-stone-500" />
                              <div>
                                <p className="text-sm text-stone-500 font-medium">Especialidad</p>
                                <p className="font-semibold text-black">Fontanería y Electricidad</p>
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
                                <p className="text-sm text-stone-500 font-medium">Zona de Trabajo</p>
                                <p className="font-semibold text-black">Madrid y alrededores</p>
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

              {/* Services Tab */}
              {activeTab === "servicios" && (
                <ZoomableSection>
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-black mb-2">Mis Servicios</h1>
                    <p className="text-stone-600">Gestiona tu catálogo de servicios profesionales</p>
                  </div>
                  
                  <Card className="border-stone-200 shadow-lg">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Store className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-black mb-2">Catálogo de Servicios</h3>
                      <p className="text-stone-600 mb-6">
                        Aquí podrás gestionar todos los servicios que ofreces, actualizar precios, disponibilidad y descripciones detalladas.
                      </p>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
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
                    <h1 className="text-3xl font-bold text-black mb-2">Evaluaciones Recibidas</h1>
                    <p className="text-stone-600">Revisa las calificaciones y comentarios de tus clientes</p>
                  </div>
                  
                  <Card className="border-stone-200 shadow-lg">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <StarIcon className="h-8 w-8 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-black mb-2">Sistema de Evaluaciones</h3>
                      <p className="text-stone-600 mb-6">
                        Aquí podrás ver todas las evaluaciones que tus clientes han dejado sobre tus servicios, tanto calificaciones como comentarios detallados.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-stone-50 rounded-lg">
                          <div className="flex items-center justify-center mb-2">
                            {[1,2,3,4,5].map((star) => (
                              <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <p className="text-sm font-medium text-stone-900">Promedio General</p>
                          <p className="text-xs text-stone-600">4.8/5.0</p>
                        </div>
                        <div className="p-4 bg-stone-50 rounded-lg">
                          <Award className="h-6 w-6 text-stone-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-stone-900">Servicios Completados</p>
                          <p className="text-xs text-stone-600">47 trabajos</p>
                        </div>
                        <div className="p-4 bg-stone-50 rounded-lg">
                          <Target className="h-6 w-6 text-stone-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-stone-900">Tasa de Satisfacción</p>
                          <p className="text-xs text-stone-600">96%</p>
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
              {!["overview", "servicios", "perfil", "evaluacion"].includes(activeTab) && (
                <ZoomableSection>
                  <Card className="border-stone-200 shadow-lg">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Settings className="h-8 w-8 text-stone-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-black mb-2">Funcionalidad en Desarrollo</h3>
                      <p className="text-stone-600">
                        Esta sección estará disponible próximamente para proveedores de servicios.
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
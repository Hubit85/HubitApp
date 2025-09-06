
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
import { BudgetRequestManager } from "@/components/service-provider/BudgetRequestManager";
import { 
  User, Users, Store, TrendingUp, AlertTriangle, Calendar, 
  DollarSign, FileText, Settings, Bell, Star, Search, Filter,
  Plus, Edit, Trash2, Eye, CheckCircle, Clock, MapPin, Phone,
  Mail, Shield, Home, BarChart3, Wrench, Loader2, LogOut, Package,
  ChevronRight, CreditCard, StarIcon, Award, Target, ClipboardList, Building
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
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building className="h-6 w-6 text-white" />
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
                <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-2 text-center shadow-md">
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
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md" 
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
                      <Card className="border-stone-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-blue-100/50">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                              <FileText className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-blue-900 mb-1">Presupuestos Activos</h3>
                              <p className="text-2xl font-bold text-blue-600">12</p>
                              <p className="text-blue-600 text-sm">+3 esta semana</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-stone-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-emerald-50 to-emerald-100/50">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center shadow-lg">
                              <DollarSign className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-emerald-900 mb-1">Ingresos del Mes</h3>
                              <p className="text-2xl font-bold text-emerald-600">€3,450</p>
                              <p className="text-emerald-600 text-sm">+15% vs mes anterior</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-stone-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-purple-100/50">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center shadow-lg">
                              <Users className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-purple-900 mb-1">Clientes Activos</h3>
                              <p className="text-2xl font-bold text-purple-600">28</p>
                              <p className="text-purple-600 text-sm">+5 nuevos clientes</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-stone-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-amber-50 to-amber-100/50">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center shadow-lg">
                              <Star className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-amber-900 mb-1">Calificación Promedio</h3>
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
                        <Card className="border-stone-200 shadow-xl">
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <FileText className="h-5 w-5 text-blue-600" />
                              Nuevas Solicitudes
                            </CardTitle>
                            <CardDescription>Presupuestos pendientes de respuesta</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-200/60 hover:border-blue-300 transition-colors">
                              <div>
                                <h4 className="font-semibold text-blue-900">Reparación de Fontanería</h4>
                                <p className="text-sm text-blue-700">Comunidad Los Olivos</p>
                                <p className="text-xs text-blue-600">Hace 2 horas • Urgencia alta</p>
                              </div>
                              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md">
                                Responder
                              </Button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-lg border border-emerald-200/60 hover:border-emerald-300 transition-colors">
                              <div>
                                <h4 className="font-semibold text-emerald-900">Instalación Eléctrica</h4>
                                <p className="text-sm text-emerald-700">Residencial Madrid</p>
                                <p className="text-xs text-emerald-600">Hace 5 horas • €500-800</p>
                              </div>
                              <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-md">
                                Responder
                              </Button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-lg border border-orange-200/60 hover:border-orange-300 transition-colors">
                              <div>
                                <h4 className="font-semibold text-orange-900">Pintura de Fachada</h4>
                                <p className="text-sm text-orange-700">Villa Santa Clara</p>
                                <p className="text-xs text-orange-600">Hace 1 día • Proyecto grande</p>
                              </div>
                              <Button size="sm" className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-md">
                                Responder
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-stone-200 shadow-xl">
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Calendar className="h-5 w-5 text-purple-600" />
                              Trabajos Próximos
                            </CardTitle>
                            <CardDescription>Servicios programados esta semana</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-lg border border-purple-200/60">
                              <div>
                                <h4 className="font-semibold text-purple-900">Mantenimiento de Calefacción</h4>
                                <p className="text-sm text-purple-700">Cliente: María García</p>
                                <p className="text-xs text-purple-600">Mañana 10:00 AM</p>
                              </div>
                              <Badge className="bg-purple-100 text-purple-800 border-purple-200">Mañana</Badge>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-indigo-100/50 rounded-lg border border-indigo-200/60">
                              <div>
                                <h4 className="font-semibold text-indigo-900">Revisión de Ascensor</h4>
                                <p className="text-sm text-indigo-700">Cliente: Comunidad Centro</p>
                                <p className="text-xs text-indigo-600">Viernes 9:00 AM</p>
                              </div>
                              <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">Viernes</Badge>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-teal-100/50 rounded-lg border border-teal-200/60">
                              <div>
                                <h4 className="font-semibold text-teal-900">Instalación de Jardín</h4>
                                <p className="text-sm text-teal-700">Cliente: José Rodríguez</p>
                                <p className="text-xs text-teal-600">Sábado 8:00 AM</p>
                              </div>
                              <Badge className="bg-teal-100 text-teal-800 border-teal-200">Sábado</Badge>
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
                        <Card className="group border-stone-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer bg-gradient-to-br from-white to-blue-50" onClick={() => setActiveTab("presupuestos")}>
                          <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                              <FileText className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-black mb-3">Gestionar Presupuestos</h3>
                            <p className="text-sm text-stone-600 mb-4">
                              Responde a solicitudes y administra tus cotizaciones
                            </p>
                            <ChevronRight className="w-5 h-5 text-stone-600 group-hover:translate-x-1 transition-transform duration-300 mx-auto" />
                          </CardContent>
                        </Card>

                        <Card className="group border-stone-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer bg-gradient-to-br from-white to-emerald-50" onClick={() => setActiveTab("servicios")}>
                          <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                              <Store className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-black mb-3">Gestionar Servicios</h3>
                            <p className="text-sm text-stone-600 mb-4">
                              Actualiza tu catálogo de servicios
                            </p>
                            <ChevronRight className="w-5 h-5 text-stone-600 group-hover:translate-x-1 transition-transform duration-300 mx-auto" />
                          </CardContent>
                        </Card>

                        <Card className="group border-stone-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer bg-gradient-to-br from-white to-purple-50" onClick={() => setActiveTab("calendario")}>
                          <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                              <Calendar className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-black mb-3">Programar Cita</h3>
                            <p className="text-sm text-stone-600 mb-4">
                              Organiza tus trabajos y agenda
                            </p>
                            <ChevronRight className="w-5 h-5 text-stone-600 group-hover:translate-x-1 transition-transform duration-300 mx-auto" />
                          </CardContent>
                        </Card>

                        <Card className="group border-stone-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer bg-gradient-to-br from-white to-amber-50" onClick={() => setActiveTab("facturacion")}>
                          <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                              <CreditCard className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-black mb-3">Generar Factura</h3>
                            <p className="text-sm text-stone-600 mb-4">
                              Facturación y gestión de pagos
                            </p>
                            <ChevronRight className="w-5 h-5 text-stone-600 group-hover:translate-x-1 transition-transform duration-300 mx-auto" />
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </ZoomableSection>
              )}

              {/* Gestión de Presupuestos Tab */}
              {activeTab === "presupuestos" && (
                <ZoomableSection>
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-600" />
                      Gestión de Presupuestos y Ofertas
                    </h1>
                    <p className="text-stone-600">
                      Encuentra oportunidades de negocio, envía cotizaciones profesionales y gestiona tus propuestas
                    </p>
                  </div>
                  
                  <BudgetRequestManager />
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
                      <Card className="border-stone-200 shadow-xl bg-gradient-to-br from-white to-neutral-50">
                        <CardHeader className="text-center pb-4">
                          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <Building className="h-12 w-12 text-white" />
                          </div>
                          <CardTitle className="text-2xl font-bold text-black">Proveedor de Servicios</CardTitle>
                          <CardDescription className="text-stone-600 font-medium">
                            Profesional verificado
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200/60">
                              <Building className="h-5 w-5 text-blue-600" />
                              <div>
                                <p className="text-sm text-blue-600 font-medium">Empresa</p>
                                <p className="font-semibold text-blue-900">{companyName}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-neutral-50 to-neutral-100/50 border border-neutral-200/60">
                              <Mail className="h-5 w-5 text-neutral-600" />
                              <div>
                                <p className="text-sm text-neutral-600 font-medium">Email</p>
                                <p className="font-semibold text-black">{user.email}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200/60">
                              <Store className="h-5 w-5 text-emerald-600" />
                              <div>
                                <p className="text-sm text-emerald-600 font-medium">Especialidad</p>
                                <p className="font-semibold text-emerald-900">Fontanería y Electricidad</p>
                              </div>
                            </div>

                            {profile.phone && (
                              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100/50 border border-purple-200/60">
                                <Phone className="h-5 w-5 text-purple-600" />
                                <div>
                                  <p className="text-sm text-purple-600 font-medium">Teléfono</p>
                                  <p className="font-semibold text-purple-900">{profile.phone}</p>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-200/60">
                              <MapPin className="h-5 w-5 text-orange-600" />
                              <div>
                                <p className="text-sm text-orange-600 font-medium">Zona de Trabajo</p>
                                <p className="font-semibold text-orange-900">Madrid y alrededores</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-indigo-100/50 border border-indigo-200/60">
                              <Calendar className="h-5 w-5 text-indigo-600" />
                              <div>
                                <p className="text-sm text-indigo-600 font-medium">En la plataforma desde</p>
                                <p className="font-semibold text-indigo-900">
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
                      <Card className="border-stone-200 shadow-xl">
                        <CardHeader>
                          <CardTitle className="text-xl font-bold text-black">Gestión de Roles</CardTitle>
                          <CardDescription>Administra tus roles en la plataforma</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <UserRoleManager />
                        </CardContent>
                      </Card>

                      <Card className="border-stone-200 shadow-xl">
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
                  
                  <Card className="border-stone-200 shadow-xl bg-gradient-to-br from-white to-blue-50">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Store className="h-8 w-8 text-white" />
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
                  
                  <Card className="border-stone-200 shadow-xl bg-gradient-to-br from-white to-amber-50">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <StarIcon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-black mb-2">Sistema de Evaluaciones</h3>
                      <p className="text-stone-600 mb-6">
                        Aquí podrás ver todas las evaluaciones que tus clientes han dejado sobre tus servicios, tanto calificaciones como comentarios detallados.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                          <div className="flex items-center justify-center mb-2">
                            {[1,2,3,4,5].map((star) => (
                              <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <p className="text-sm font-medium text-amber-900">Promedio General</p>
                          <p className="text-xs text-amber-700">4.8/5.0</p>
                        </div>
                        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                          <Award className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-amber-900">Servicios Completados</p>
                          <p className="text-xs text-amber-700">47 trabajos</p>
                        </div>
                        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                          <Target className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-amber-900">Tasa de Satisfacción</p>
                          <p className="text-xs text-amber-700">96%</p>
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
              {!["overview", "servicios", "perfil", "evaluacion", "presupuestos"].includes(activeTab) && (
                <ZoomableSection>
                  <Card className="border-stone-200 shadow-xl bg-gradient-to-br from-white to-neutral-50">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-stone-600 to-stone-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Settings className="h-8 w-8 text-white" />
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

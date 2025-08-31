
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, User, Mail, Phone, Calendar, Settings, LogOut, Home, Users, Wrench, Building, Shield, Crown, Star, ArrowRight, FileText, Code, CheckCircle } from "lucide-react";
import PropertyManager from "@/components/dashboard/PropertyManager";
import BudgetRequestManager from "@/components/dashboard/BudgetRequestManager";
import UserRoleManager from "@/components/UserRoleManager";
import ResendTestTool from "@/components/ResendTestTool";
import ZoomableSection from "@/components/ZoomableSection";

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
        return { icon: User, label: "Particular", color: "bg-gradient-to-r from-blue-500 to-blue-600", description: "Usuario individual" };
      case "community_member":
        return { icon: Users, label: "Miembro de Comunidad", color: "bg-gradient-to-r from-emerald-500 to-emerald-600", description: "Residente de comunidad" };
      case "service_provider":
        return { icon: Wrench, label: "Proveedor de Servicios", color: "bg-gradient-to-r from-purple-500 to-purple-600", description: "Empresa o autónomo" };
      case "property_administrator":
        return { icon: Building, label: "Administrador de Fincas", color: "bg-gradient-to-r from-amber-500 to-amber-600", description: "Gestión de propiedades" };
      default:
        return { icon: User, label: "Usuario", color: "bg-gradient-to-r from-neutral-500 to-neutral-600", description: "Sin especificar" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-neutral-600 font-medium">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600 font-medium">Redirigiendo...</p>
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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <header className="relative bg-white/80 backdrop-blur-md border-b border-neutral-200/50 shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
                  HuBiT
                </div>
                <Badge variant="secondary" className="hidden sm:flex bg-blue-100 text-blue-700 border-blue-200">
                  Dashboard
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/50"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configuración
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-neutral-600 hover:text-red-600 hover:bg-red-50/50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Salir
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <ZoomableSection className="mb-8">
            <div className="relative bg-gradient-to-r from-white/60 via-blue-50/80 to-purple-50/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 rounded-3xl"></div>
              <div className="relative flex items-center gap-6">
                <div className={`w-20 h-20 ${userTypeInfo.color} rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/25`}>
                  <UserTypeIcon className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neutral-800 via-blue-600 to-purple-600 mb-2">
                    ¡Bienvenido de vuelta! 👋
                  </h1>
                  <p className="text-lg text-neutral-600 font-medium">
                    {profile.full_name || "Usuario"} • <span className="text-blue-600">{userTypeInfo.label}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm text-emerald-600 font-medium">Sistema completamente configurado</span>
                  </div>
                </div>
              </div>
            </div>
          </ZoomableSection>

          {/* Enhanced Tabs Navigation */}
          <ZoomableSection>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-lg border border-white/30 shadow-lg h-16 rounded-2xl">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 flex items-center gap-2 text-sm font-semibold py-3 rounded-xl transition-all duration-300"
                >
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Resumen</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="properties" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/25 flex items-center gap-2 text-sm font-semibold py-3 rounded-xl transition-all duration-300"
                >
                  <Building className="h-4 w-4" />
                  <span className="hidden sm:inline">Propiedades</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="requests" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/25 flex items-center gap-2 text-sm font-semibold py-3 rounded-xl transition-all duration-300"
                >
                  <Wrench className="h-4 w-4" />
                  <span className="hidden sm:inline">Solicitudes</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="profile" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-amber-500/25 flex items-center gap-2 text-sm font-semibold py-3 rounded-xl transition-all duration-300"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Perfil</span>
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Quick Stats */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* Status Cards */}
                    <ZoomableSection>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50/80 via-white/50 to-indigo-50/80 backdrop-blur-sm border-blue-200/50 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-1">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-bl-full"></div>
                          <CardContent className="p-6 relative">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <Crown className="h-7 w-7 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-blue-900 mb-1 flex items-center gap-2">
                                  Rol Asignado: Particular
                                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs shadow-md">✓ Activo</Badge>
                                </h3>
                                <p className="text-blue-700 text-sm leading-relaxed">
                                  Acceso completo a funcionalidades residenciales
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50/80 via-white/50 to-green-50/80 backdrop-blur-sm border-emerald-200/50 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-1">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-bl-full"></div>
                          <CardContent className="p-6 relative">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <Shield className="h-7 w-7 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-emerald-900 mb-1">
                                  Sistema Configurado 🎉
                                </h3>
                                <p className="text-emerald-700 text-sm leading-relaxed">
                                  Base de datos • Roles • Email • Todo listo
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </ZoomableSection>

                    {/* Funcionalidades Específicas para Particular */}
                    <ZoomableSection>
                      <div>
                        <div className="mb-8">
                          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neutral-800 via-blue-600 to-purple-600 mb-2 flex items-center gap-3">
                            <User className="h-8 w-8 text-blue-600" />
                            Funcionalidades para Particular
                          </h2>
                          <p className="text-neutral-600 text-lg">Gestiona tus propiedades y servicios domésticos</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card className="group relative overflow-hidden bg-gradient-to-br from-white/80 via-blue-50/30 to-white/60 backdrop-blur-lg border-white/30 shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 hover:-translate-y-2 cursor-pointer" onClick={() => setActiveTab("properties")}>
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <CardContent className="p-8 relative">
                              <div className="flex items-start gap-6 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/25 group-hover:scale-110 transition-transform duration-500">
                                  <Home className="h-8 w-8 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                                    Gestionar Propiedades
                                  </h3>
                                  <p className="text-neutral-600 leading-relaxed">
                                    Registra y administra tus viviendas personales con control total
                                  </p>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg">
                                  ✓ Disponible
                                </Badge>
                                <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-2 transition-transform duration-300" />
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="group relative overflow-hidden bg-gradient-to-br from-white/80 via-emerald-50/30 to-white/60 backdrop-blur-lg border-white/30 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 hover:-translate-y-2 cursor-pointer" onClick={() => setActiveTab("requests")}>
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <CardContent className="p-8 relative">
                              <div className="flex items-start gap-6 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-500">
                                  <Wrench className="h-8 w-8 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                                    Servicios Domésticos
                                  </h3>
                                  <p className="text-neutral-600 leading-relaxed">
                                    Fontanería, electricidad, limpieza y mantenimiento
                                  </p>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg">
                                  ✓ Disponible
                                </Badge>
                                <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-2 transition-transform duration-300" />
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="group relative overflow-hidden bg-gradient-to-br from-white/80 via-purple-50/30 to-white/60 backdrop-blur-lg border-white/30 shadow-xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:-translate-y-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <CardContent className="p-8 relative">
                              <div className="flex items-start gap-6 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/25 group-hover:scale-110 transition-transform duration-500">
                                  <Star className="h-8 w-8 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                                    Evaluación de Servicios
                                  </h3>
                                  <p className="text-neutral-600 leading-relaxed">
                                    Califica y comenta los servicios recibidos
                                  </p>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
                                  ✓ Disponible
                                </Badge>
                                <Star className="w-5 h-5 text-purple-600" />
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="group relative overflow-hidden bg-gradient-to-br from-white/80 via-amber-50/30 to-white/60 backdrop-blur-lg border-white/30 shadow-xl hover:shadow-2xl hover:shadow-amber-500/25 transition-all duration-500 hover:-translate-y-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <CardContent className="p-8 relative">
                              <div className="flex items-start gap-6 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-500/25 group-hover:scale-110 transition-transform duration-500">
                                  <FileText className="h-8 w-8 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                                    Historial y Documentos
                                  </h3>
                                  <p className="text-neutral-600 leading-relaxed">
                                    Facturas, contratos y reportes detallados
                                  </p>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg">
                                  ✓ Disponible
                                </Badge>
                                <FileText className="w-5 h-5 text-amber-600" />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </ZoomableSection>

                    {/* Herramientas de Sistema */}
                    <ZoomableSection>
                      <div className="mt-12">
                        <div className="mb-8">
                          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neutral-800 via-gray-600 to-neutral-700 mb-2 flex items-center gap-3">
                            <Settings className="h-8 w-8 text-gray-600" />
                            Herramientas de Sistema
                          </h2>
                          <p className="text-neutral-600 text-lg">Configuración avanzada y administración</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-50/80 via-white/60 to-indigo-50/80 backdrop-blur-lg border-blue-200/50 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 cursor-pointer" onClick={() => router.push("/email-templates")}>
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <CardContent className="p-6 text-center relative">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/25 mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                                <Mail className="h-8 w-8 text-white" />
                              </div>
                              <h3 className="text-lg font-bold text-neutral-900 mb-3">
                                Email Templates
                              </h3>
                              <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
                                Gestiona plantillas de autenticación
                              </p>
                              <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                                Supabase Auth
                              </Badge>
                            </CardContent>
                          </Card>

                          <Card className="group relative overflow-hidden bg-gradient-to-br from-emerald-50/80 via-white/60 to-green-50/80 backdrop-blur-lg border-emerald-200/50 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-2 cursor-pointer" onClick={() => window.open("https://supabase.com/dashboard/project/djkrzbmgzfwagmripozi", "_blank")}>
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <CardContent className="p-6 text-center relative">
                              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/25 mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                                <Settings className="h-8 w-8 text-white" />
                              </div>
                              <h3 className="text-lg font-bold text-neutral-900 mb-3">
                                Supabase Dashboard
                              </h3>
                              <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
                                Panel de administración de base de datos
                              </p>
                              <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-700">
                                Externo
                              </Badge>
                            </CardContent>
                          </Card>

                          <Card className="group relative overflow-hidden bg-gradient-to-br from-amber-50/80 via-white/60 to-orange-50/80 backdrop-blur-lg border-amber-200/50 shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 hover:-translate-y-2 cursor-pointer" onClick={() => router.push("/help")}>
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <CardContent className="p-6 text-center relative">
                              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-500/25 mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                                <FileText className="h-8 w-8 text-white" />
                              </div>
                              <h3 className="text-lg font-bold text-neutral-900 mb-3">
                                Documentación
                              </h3>
                              <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
                                Guías completas y ayuda
                              </p>
                              <Badge variant="outline" className="text-xs border-amber-200 text-amber-700">
                                Ayuda
                              </Badge>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </ZoomableSection>
                  </div>

                  {/* Profile Summary */}
                  <div className="lg:col-span-1">
                    <ZoomableSection>
                      <Card className="relative overflow-hidden bg-gradient-to-br from-white/80 via-neutral-50/50 to-white/70 backdrop-blur-lg border-white/30 shadow-2xl hover:shadow-2xl transition-all duration-500">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-emerald-400/10 rounded-bl-full"></div>
                        <CardHeader className="text-center pb-6 relative">
                          <div className={`mx-auto w-24 h-24 ${userTypeInfo.color} rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/25 mb-4`}>
                            <UserTypeIcon className="h-12 w-12 text-white" />
                          </div>
                          <CardTitle className="text-2xl font-bold text-neutral-900">
                            Tu Perfil
                          </CardTitle>
                          <CardDescription className="text-neutral-600 font-medium">
                            {user.email}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4 relative">
                          <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-neutral-50/80 to-white/50 hover:from-neutral-100/80 hover:to-white/70 transition-colors border border-neutral-200/50">
                              <User className="h-6 w-6 text-neutral-500" />
                              <div>
                                <p className="text-sm text-neutral-500 font-medium">Nombre</p>
                                <p className="font-semibold text-neutral-900">{profile.full_name || "No especificado"}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 to-blue-100/50 hover:from-blue-100/80 hover:to-blue-200/50 transition-colors border border-blue-200/50">
                              <Crown className="h-6 w-6 text-blue-600" />
                              <div>
                                <p className="text-sm text-blue-600 font-semibold">Rol Activo</p>
                                <p className="font-bold text-blue-900">PARTICULAR</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-emerald-100/50 hover:from-emerald-100/80 hover:to-emerald-200/50 transition-colors border border-emerald-200/50">
                              <Shield className="h-6 w-6 text-emerald-600" />
                              <div>
                                <p className="text-sm text-emerald-600 font-semibold">Estado del Sistema</p>
                                <p className="font-bold text-emerald-900">✓ Totalmente Configurado</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-6 border-t border-neutral-200/50">
                            <div className="text-center space-y-3">
                              <Badge className={`${userTypeInfo.color} text-white border-0 text-base px-6 py-2 shadow-lg`}>
                                {userTypeInfo.label}
                              </Badge>
                              <p className="text-sm text-neutral-500 leading-relaxed">
                                {userTypeInfo.description}
                              </p>
                            </div>
                          </div>

                          <Button 
                            variant="outline" 
                            size="lg" 
                            className="w-full mt-6 bg-gradient-to-r from-white/80 to-neutral-50/80 hover:from-neutral-50/80 hover:to-neutral-100/80 border-neutral-300/50 text-neutral-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300" 
                            onClick={() => setActiveTab("profile")}
                          >
                            Gestionar Perfil y Roles
                          </Button>
                        </CardContent>
                      </Card>
                    </ZoomableSection>
                  </div>
                </div>
              </TabsContent>

              {/* Properties Tab */}
              <TabsContent value="properties">
                <ZoomableSection>
                  <PropertyManager />
                </ZoomableSection>
              </TabsContent>

              {/* Budget Requests Tab */}
              <TabsContent value="requests">
                <ZoomableSection>
                  <BudgetRequestManager />
                </ZoomableSection>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Profile Card */}
                  <div className="lg:col-span-1">
                    <ZoomableSection>
                      <Card className="relative overflow-hidden bg-gradient-to-br from-white/80 via-neutral-50/50 to-white/70 backdrop-blur-lg border-white/30 shadow-2xl hover:shadow-2xl transition-all duration-500">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-emerald-400/10 rounded-bl-full"></div>
                        <CardHeader className="text-center pb-6 relative">
                          <div className={`mx-auto w-24 h-24 ${userTypeInfo.color} rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/25 mb-4`}>
                            <UserTypeIcon className="h-12 w-12 text-white" />
                          </div>
                          <CardTitle className="text-2xl font-bold text-neutral-900">
                            Tu Perfil Completo
                          </CardTitle>
                          <CardDescription className="text-neutral-600 font-medium">
                            Información detallada de tu cuenta
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4 relative">
                          <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-neutral-50/80 to-white/50 hover:from-neutral-100/80 hover:to-white/70 transition-colors border border-neutral-200/50">
                              <User className="h-6 w-6 text-neutral-500" />
                              <div>
                                <p className="text-sm text-neutral-500 font-medium">Nombre</p>
                                <p className="font-semibold text-neutral-900">{profile.full_name || "No especificado"}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-neutral-50/80 to-white/50 hover:from-neutral-100/80 hover:to-white/70 transition-colors border border-neutral-200/50">
                              <Mail className="h-6 w-6 text-neutral-500" />
                              <div>
                                <p className="text-sm text-neutral-500 font-medium">Email</p>
                                <p className="font-semibold text-neutral-900">{user.email}</p>
                              </div>
                            </div>
                            
                            {profile.phone && (
                              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-neutral-50/80 to-white/50 hover:from-neutral-100/80 hover:to-white/70 transition-colors border border-neutral-200/50">
                                <Phone className="h-6 w-6 text-neutral-500" />
                                <div>
                                  <p className="text-sm text-neutral-500 font-medium">Teléfono</p>
                                  <p className="font-semibold text-neutral-900">{profile.phone}</p>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-neutral-50/80 to-white/50 hover:from-neutral-100/80 hover:to-white/70 transition-colors border border-neutral-200/50">
                              <Calendar className="h-6 w-6 text-neutral-500" />
                              <div>
                                <p className="text-sm text-neutral-500 font-medium">Miembro desde</p>
                                <p className="font-semibold text-neutral-900">
                                  {profile.created_at ? new Date(profile.created_at).toLocaleDateString("es-ES", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                  }) : 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-6 border-t border-neutral-200/50">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-neutral-600 font-medium">Tipo de cuenta</span>
                              <Badge className={`${userTypeInfo.color} text-white border-0 shadow-lg`}>
                                {userTypeInfo.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
                              {userTypeInfo.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </ZoomableSection>
                  </div>

                  {/* Profile Management */}
                  <div className="lg:col-span-2 space-y-8">
                    <ZoomableSection>
                      <UserRoleManager />
                    </ZoomableSection>

                    <ZoomableSection>
                      <ResendTestTool />
                    </ZoomableSection>

                    {/* System Configuration */}
                    <ZoomableSection>
                      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50/80 via-white/50 to-indigo-50/80 backdrop-blur-lg border-purple-200/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 via-indigo-400/10 to-blue-400/10 rounded-bl-full"></div>
                        <CardHeader className="relative">
                          <CardTitle className="text-2xl font-bold text-purple-900 flex items-center gap-3">
                            <Code className="h-7 w-7" />
                            Configuración del Sistema
                          </CardTitle>
                          <CardDescription className="text-purple-700 text-base">
                            Herramientas avanzadas de configuración y personalización
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 relative">
                          {[
                            { 
                              text: "Configurar plantillas de email", 
                              completed: true, 
                              action: () => router.push("/email-templates"),
                              description: "Personaliza los emails de autenticación"
                            },
                            { 
                              text: "Verificar conexión con Supabase", 
                              completed: true, 
                              action: () => window.open("https://supabase.com/dashboard/project/djkrzbmgzfwagmripozi", "_blank"),
                              description: "Revisar estado de la base de datos"
                            },
                            { 
                              text: "Configurar notificaciones por email", 
                              completed: false, 
                              description: "Personalizar alertas y comunicaciones"
                            },
                            { 
                              text: "Revisar políticas de seguridad", 
                              completed: true, 
                              description: "Configuración RLS y permisos"
                            }
                          ].map((step, index) => (
                            <div 
                              key={index} 
                              className={`flex items-center gap-4 p-4 rounded-2xl hover:bg-purple-50/70 transition-colors ${step.action ? 'cursor-pointer' : ''} border border-purple-100/50 shadow-sm hover:shadow-md`}
                              onClick={step.action}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
                                step.completed ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' : 'bg-gradient-to-r from-purple-200 to-purple-300 text-purple-700'
                              }`}>
                                {step.completed ? '✓' : index + 1}
                              </div>
                              <div className="flex-1">
                                <span className={`${step.completed ? 'text-neutral-700 font-semibold' : 'text-neutral-900 font-semibold'} text-base`}>
                                  {step.text}
                                </span>
                                <p className="text-sm text-neutral-500 mt-1 leading-relaxed">
                                  {step.description}
                                </p>
                              </div>
                              {step.completed && (
                                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 shadow-sm">
                                  Configurado
                                </Badge>
                              )}
                              {step.action && (
                                <ArrowRight className="w-5 h-5 text-purple-600" />
                              )}
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </ZoomableSection>

                    {/* Next Steps */}
                    <ZoomableSection>
                      <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50/80 via-white/50 to-purple-50/80 backdrop-blur-lg border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-indigo-400/10 rounded-bl-full"></div>
                        <CardHeader className="relative">
                          <CardTitle className="text-2xl font-bold text-blue-900">
                            Próximos Pasos
                          </CardTitle>
                          <CardDescription className="text-blue-700 text-base">
                            Completa tu configuración para aprovechar al máximo HuBiT
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 relative">
                          {[
                            { text: "Actualizar información del perfil", completed: !!profile.phone },
                            { text: "Configurar preferencias de notificaciones", completed: false },
                            { text: "Agregar tu primera propiedad", completed: false, action: () => setActiveTab("properties") },
                            { text: "Crear tu primera solicitud de presupuesto", completed: false, action: () => setActiveTab("requests") }
                          ].map((step, index) => (
                            <div 
                              key={index} 
                              className={`flex items-center gap-4 p-4 rounded-2xl hover:bg-blue-50/70 transition-colors ${step.action ? 'cursor-pointer' : ''} border border-blue-100/50 shadow-sm hover:shadow-md`}
                              onClick={step.action}
                            >
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
                                step.completed ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' : 'bg-gradient-to-r from-neutral-300 to-neutral-400 text-neutral-600'
                              }`}>
                                {step.completed ? '✓' : index + 1}
                              </div>
                              <span className={`flex-1 text-base font-semibold ${step.completed ? 'text-neutral-600 line-through' : 'text-neutral-900'}`}>
                                {step.text}
                              </span>
                              {step.completed && (
                                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 shadow-sm">
                                  Completado
                                </Badge>
                              )}
                              {step.action && !step.completed && (
                                <ArrowRight className="w-5 h-5 text-blue-600" />
                              )}
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </ZoomableSection>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </ZoomableSection>
        </main>
      </div>
    </>
  );
}


import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, User, Mail, Phone, Calendar, Settings, LogOut, Home, Users, Wrench, Building, Shield, Crown, Star, ArrowRight } from "lucide-react";
import PropertyManager from "@/components/dashboard/PropertyManager";
import BudgetRequestManager from "@/components/dashboard/BudgetRequestManager";

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
        return { icon: User, label: "Particular", color: "bg-blue-500", description: "Usuario individual" };
      case "community_member":
        return { icon: Users, label: "Miembro de Comunidad", color: "bg-emerald-500", description: "Residente de comunidad" };
      case "service_provider":
        return { icon: Wrench, label: "Proveedor de Servicios", color: "bg-purple-500", description: "Empresa o autónomo" };
      case "property_administrator":
        return { icon: Building, label: "Administrador de Fincas", color: "bg-amber-500", description: "Gestión de propiedades" };
      default:
        return { icon: User, label: "Usuario", color: "bg-neutral-500", description: "Sin especificar" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-neutral-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600">Redirigiendo...</p>
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
        <meta name="description" content="Tu panel de control en HuBiT" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  HuBiT
                </div>
                <Badge variant="secondary" className="hidden sm:flex">
                  Dashboard
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-600 hover:text-neutral-900"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configuración
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-neutral-600 hover:text-red-600"
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
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 ${userTypeInfo.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                <UserTypeIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">
                  ¡Bienvenido, {profile.full_name || "Usuario"}! 👋
                </h1>
                <p className="text-neutral-600">
                  Has iniciado sesión como {userTypeInfo.label}
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-lg border border-white/20 shadow-sm h-14">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white flex items-center gap-2 text-sm font-medium py-3"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Resumen</span>
              </TabsTrigger>
              <TabsTrigger 
                value="properties" 
                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white flex items-center gap-2 text-sm font-medium py-3"
              >
                <Building className="h-4 w-4" />
                <span className="hidden sm:inline">Propiedades</span>
              </TabsTrigger>
              <TabsTrigger 
                value="requests" 
                className="data-[state=active]:bg-purple-500 data-[state=active]:text-white flex items-center gap-2 text-sm font-medium py-3"
              >
                <Wrench className="h-4 w-4" />
                <span className="hidden sm:inline">Solicitudes</span>
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:bg-amber-500 data-[state=active]:text-white flex items-center gap-2 text-sm font-medium py-3"
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
                  {/* Success Message */}
                  <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-emerald-900 mb-1">
                            ¡Integración con Supabase activa! 🎉
                          </h3>
                          <p className="text-emerald-700 text-sm">
                            Tu cuenta está conectada y lista para gestionar propiedades y solicitudes.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-6">Accesos Rápidos</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Card className="group bg-white/70 backdrop-blur-lg border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setActiveTab("properties")}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <Building className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-neutral-900 mb-1">
                                Gestionar Propiedades
                              </h3>
                              <p className="text-sm text-neutral-600">
                                Administra tus propiedades y comunidades
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
                              Disponible
                            </Badge>
                            <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="group bg-white/70 backdrop-blur-lg border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setActiveTab("requests")}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <Wrench className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-neutral-900 mb-1">
                                Solicitudes de Presupuesto
                              </h3>
                              <p className="text-sm text-neutral-600">
                                Crea y gestiona solicitudes de servicios
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">
                              Disponible
                            </Badge>
                            <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                {/* Profile Summary */}
                <div className="lg:col-span-1">
                  <Card className="bg-white/70 backdrop-blur-lg border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="text-center pb-6">
                      <div className={`mx-auto w-20 h-20 ${userTypeInfo.color} rounded-3xl flex items-center justify-center shadow-lg mb-4`}>
                        <UserTypeIcon className="h-10 w-10 text-white" />
                      </div>
                      <CardTitle className="text-xl font-semibold">
                        Resumen del Perfil
                      </CardTitle>
                      <CardDescription>
                        Información de tu cuenta
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50/50 hover:bg-neutral-100/50 transition-colors">
                          <User className="h-5 w-5 text-neutral-500" />
                          <div>
                            <p className="text-sm text-neutral-500">Nombre</p>
                            <p className="font-medium">{profile.full_name || "No especificado"}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50/50 hover:bg-neutral-100/50 transition-colors">
                          <Mail className="h-5 w-5 text-neutral-500" />
                          <div>
                            <p className="text-sm text-neutral-500">Email</p>
                            <p className="font-medium text-sm">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-neutral-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-600">Tipo de cuenta</span>
                          <Badge className={`${userTypeInfo.color} text-white border-0 text-xs`}>
                            {userTypeInfo.label}
                          </Badge>
                        </div>
                      </div>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-4" 
                        onClick={() => setActiveTab("profile")}
                      >
                        Ver Perfil Completo
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Properties Tab */}
            <TabsContent value="properties">
              <PropertyManager />
            </TabsContent>

            {/* Budget Requests Tab */}
            <TabsContent value="requests">
              <BudgetRequestManager />
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                  <Card className="bg-white/70 backdrop-blur-lg border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="text-center pb-6">
                      <div className={`mx-auto w-20 h-20 ${userTypeInfo.color} rounded-3xl flex items-center justify-center shadow-lg mb-4`}>
                        <UserTypeIcon className="h-10 w-10 text-white" />
                      </div>
                      <CardTitle className="text-xl font-semibold">
                        Tu Perfil
                      </CardTitle>
                      <CardDescription>
                        Información completa de tu cuenta
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50/50 hover:bg-neutral-100/50 transition-colors">
                          <User className="h-5 w-5 text-neutral-500" />
                          <div>
                            <p className="text-sm text-neutral-500">Nombre</p>
                            <p className="font-medium">{profile.full_name || "No especificado"}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50/50 hover:bg-neutral-100/50 transition-colors">
                          <Mail className="h-5 w-5 text-neutral-500" />
                          <div>
                            <p className="text-sm text-neutral-500">Email</p>
                            <p className="font-medium">{user.email}</p>
                          </div>
                        </div>
                        
                        {profile.phone && (
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50/50 hover:bg-neutral-100/50 transition-colors">
                            <Phone className="h-5 w-5 text-neutral-500" />
                            <div>
                              <p className="text-sm text-neutral-500">Teléfono</p>
                              <p className="font-medium">{profile.phone}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50/50 hover:bg-neutral-100/50 transition-colors">
                          <Calendar className="h-5 w-5 text-neutral-500" />
                          <div>
                            <p className="text-sm text-neutral-500">Miembro desde</p>
                            <p className="font-medium">
                              {new Date(profile.created_at).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-neutral-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-600">Tipo de cuenta</span>
                          <Badge className={`${userTypeInfo.color} text-white border-0`}>
                            {userTypeInfo.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">
                          {userTypeInfo.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Profile Actions & Settings */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Next Steps */}
                  <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-blue-900">
                        Próximos Pasos
                      </CardTitle>
                      <CardDescription className="text-blue-700">
                        Completa tu configuración para aprovechar al máximo HuBiT
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { text: "Actualizar información del perfil", completed: !!profile.phone },
                        { text: "Configurar preferencias de notificaciones", completed: false },
                        { text: "Agregar tu primera propiedad", completed: false, action: () => setActiveTab("properties") },
                        { text: "Crear tu primera solicitud de presupuesto", completed: false, action: () => setActiveTab("requests") }
                      ].map((step, index) => (
                        <div 
                          key={index} 
                          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50/50 transition-colors ${step.action ? 'cursor-pointer' : ''}`}
                          onClick={step.action}
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            step.completed ? 'bg-emerald-500 text-white' : 'bg-neutral-200 text-neutral-500'
                          }`}>
                            {step.completed ? '✓' : index + 1}
                          </div>
                          <span className={step.completed ? 'text-neutral-600 line-through' : 'text-neutral-900'}>
                            {step.text}
                          </span>
                          {step.completed && (
                            <Badge variant="secondary" className="ml-auto text-xs bg-emerald-100 text-emerald-700">
                              Completado
                            </Badge>
                          )}
                          {step.action && !step.completed && (
                            <ArrowRight className="w-4 h-4 ml-auto text-blue-600" />
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}
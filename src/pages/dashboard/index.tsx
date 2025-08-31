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
  const [activeTab, setActiveTab] = useState("resumen");
  const [selectedRole, setSelectedRole] = useState("particular");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const roleOptions = [
    { value: "community_member", label: "Miembro de la Comunidad" },
    { value: "service_provider", label: "Proveedor de Servicios" },
    { value: "property_administrator", label: "Administrador de Fincas" }
  ];

  const getRoleInfo = (role: string) => {
    switch (role) {
      case "particular":
        return { label: "Particular", color: "bg-amber-600", description: "Usuario individual" };
      case "community_member":
        return { label: "Miembro de Comunidad", color: "bg-amber-700", description: "Residente de comunidad" };
      case "service_provider":
        return { label: "Proveedor de Servicios", color: "bg-amber-800", description: "Empresa o autónomo" };
      case "property_administrator":
        return { label: "Administrador de Fincas", color: "bg-amber-900", description: "Gestión de propiedades" };
      default:
        return { label: "Usuario", color: "bg-gray-600", description: "Sin especificar" };
    }
  };

  const handleRoleChange = (newRole: string) => {
    setSelectedRole(newRole);
    
    // Navigate to the corresponding role page
    switch (newRole) {
      case "community_member":
        router.push("/community-member");
        break;
      case "service_provider":
        router.push("/service-provider");
        break;
      case "property_administrator":
        router.push("/administrador-fincas");
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-medium">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  const roleInfo = getRoleInfo(selectedRole);

  return (
    <>
      <Head>
        <title>Dashboard - HuBiT</title>
        <meta name="description" content="Tu panel de control personalizado en HuBiT" />
      </Head>

      <Header />
      
      <div className="flex h-screen bg-gray-100 pt-16">
        {/* Sidebar */}
        <div className="w-64 bg-black text-white shadow-lg flex flex-col">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 ${roleInfo.color} rounded-full flex items-center justify-center`}>
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">{profile.full_name || user.email?.split('@')[0] || "Usuario"}</h3>
              </div>
            </div>
            
            {/* Role Selector */}
            <div className="space-y-2">
              <label className="text-gray-300 text-sm font-medium">Cambiar rol:</label>
              <Select value={selectedRole} onValueChange={handleRoleChange}>
                <SelectTrigger className="w-full bg-gray-800 border-gray-600 text-white focus:ring-amber-500">
                  <div className="flex items-center gap-2">
                    <span>Particular</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {roleOptions.map((role) => (
                    <SelectItem 
                      key={role.value} 
                      value={role.value}
                      className="text-white hover:bg-gray-700 focus:bg-gray-700"
                    >
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex-1 p-4">
            <nav className="space-y-1">
              <Button
                variant={activeTab === "resumen" ? "secondary" : "ghost"}
                className={`w-full justify-start text-left ${
                  activeTab === "resumen" 
                    ? "bg-gray-700 text-white hover:bg-gray-600" 
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
                onClick={() => setActiveTab("resumen")}
              >
                <Crown className="mr-3 h-4 w-4" />
                Resumen
              </Button>

              <Button
                variant={activeTab === "mi-perfil" ? "secondary" : "ghost"}
                className={`w-full justify-start text-left ${
                  activeTab === "mi-perfil" 
                    ? "bg-gray-700 text-white hover:bg-gray-600" 
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
                onClick={() => setActiveTab("mi-perfil")}
              >
                <User className="mr-3 h-4 w-4" />
                Mi Perfil
              </Button>

              <Button
                variant={activeTab === "evaluacion-servicios" ? "secondary" : "ghost"}
                className={`w-full justify-start text-left ${
                  activeTab === "evaluacion-servicios" 
                    ? "bg-gray-700 text-white hover:bg-gray-600" 
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
                onClick={() => setActiveTab("evaluacion-servicios")}
              >
                <Star className="mr-3 h-4 w-4" />
                Evaluación de Servicios
              </Button>
            </nav>
          </div>

          {/* Sign Out Button at Bottom */}
          <div className="p-4 border-t border-gray-800">
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
        <div className="flex-1 overflow-hidden">
          <ZoomableSection className="h-full overflow-auto bg-white" enableZoom={true} maxScale={3} minScale={0.5}>
            <div className="p-6 min-h-full">
              
              {/* Resumen Tab */}
              {activeTab === "resumen" && (
                <div>
                  <div className="mb-8">
                    <h1 className="text-4xl font-bold text-black mb-2">
                      ¡Bienvenido de vuelta! 👋
                    </h1>
                    <p className="text-gray-600 text-lg">
                      {profile.full_name || user.email?.split('@')[0] || "Usuario"} • <span className="text-amber-800 font-semibold">{roleInfo.label}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-600 font-medium">Sistema completamente configurado</span>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 ${roleInfo.color} rounded-full flex items-center justify-center`}>
                              <Crown className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-black mb-1 flex items-center gap-2">
                                Rol Activo: {roleInfo.label}
                                <Badge className="bg-amber-100 text-amber-700 text-xs">✓ Activo</Badge>
                              </h3>
                              <p className="text-gray-600 text-sm">
                                {roleInfo.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-black mb-1">
                                Sistema Configurado 🎉
                              </h3>
                              <p className="text-gray-600 text-sm">
                                Base de datos • Roles • Email • Todo listo
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Role-specific Features */}
                    <div>
                      <div className="mb-6">
                        <h2 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
                          <User className="h-8 w-8 text-amber-600" />
                          Funcionalidades para {roleInfo.label}
                        </h2>
                        <p className="text-gray-600 text-lg">{roleInfo.description}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card 
                          className="group border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-white" 
                          onClick={() => router.push("/particular")}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                              <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center group-hover:bg-amber-700 transition-colors">
                                <User className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-black mb-2">Ir a Particular</h3>
                                <p className="text-gray-600">Accede a tu interfaz completa de particular</p>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <Badge className="bg-amber-100 text-amber-700">✓ Disponible</Badge>
                              <ArrowRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="group border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-white">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                              <div className="w-12 h-12 bg-amber-700 rounded-full flex items-center justify-center group-hover:bg-amber-800 transition-colors">
                                <Star className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-black mb-2">Evaluación de Servicios</h3>
                                <p className="text-gray-600">Califica y comenta los servicios recibidos</p>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <Badge className="bg-amber-100 text-amber-700">✓ Disponible</Badge>
                              <Star className="w-5 h-5 text-gray-600" />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mi Perfil Tab */}
              {activeTab === "mi-perfil" && (
                <div>
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-black mb-2">Mi Perfil</h1>
                    <p className="text-gray-600">Gestiona tu información personal y configuración</p>
                  </div>
                  
                  <Card className="border-gray-200 shadow-sm bg-white max-w-2xl">
                    <CardHeader className="text-center pb-4">
                      <div className={`mx-auto w-24 h-24 ${roleInfo.color} rounded-full flex items-center justify-center mb-4`}>
                        <User className="h-12 w-12 text-white" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-black">
                        Tu Perfil Completo
                      </CardTitle>
                      <CardDescription className="text-gray-600 font-medium">
                        Información detallada de tu cuenta
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                          <User className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500 font-medium">Nombre</p>
                            <p className="font-semibold text-black">{profile.full_name || user.email?.split('@')[0] || "No especificado"}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                          <Settings className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500 font-medium">Email</p>
                            <p className="font-semibold text-black">{user.email}</p>
                          </div>
                        </div>

                        {profile.phone && (
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                            <Settings className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Teléfono</p>
                              <p className="font-semibold text-black">{profile.phone}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 font-medium">Rol activo</span>
                          <Badge className={`${roleInfo.color} text-white border-0`}>
                            {roleInfo.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          {roleInfo.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Evaluación de Servicios Tab */}
              {activeTab === "evaluacion-servicios" && (
                <div>
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-black mb-2">Evaluación de Servicios</h1>
                    <p className="text-gray-600">Califica y comenta los servicios que has recibido</p>
                  </div>
                  
                  <Card className="border-gray-200 shadow-sm bg-white">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="h-8 w-8 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-black mb-2">
                        Sistema de Evaluación
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Próximamente podrás calificar y comentar todos los servicios que hayas utilizado. 
                        Tu feedback es muy valioso para mejorar la calidad del servicio.
                      </p>
                      <div className="flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-6 w-6 text-gray-300" />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </ZoomableSection>
        </div>
      </div>
    </>
  );
}
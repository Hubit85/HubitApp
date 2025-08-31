
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, User, Mail, Phone, Calendar, Settings, LogOut, Home, Users, Wrench, Building, Shield, Crown, Star, ArrowRight, FileText, Code, CheckCircle, Bell, CreditCard, Store, Award, ThumbsUp, ChevronDown } from "lucide-react";
import PropertyManager from "@/components/dashboard/PropertyManager";
import BudgetRequestManager from "@/components/dashboard/BudgetRequestManager";
import UserRoleManager from "@/components/UserRoleManager";
import ResendTestTool from "@/components/ResendTestTool";
import ZoomableSection from "@/components/ZoomableSection";
import { Header } from "@/components/layout/Header";

export default function Dashboard() {
  const { user, profile, signOut, loading } = useSupabaseAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
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
    { value: "particular", label: "Particular", icon: User },
    { value: "community_member", label: "Miembro de la Comunidad", icon: Users },
    { value: "service_provider", label: "Proveedor de Servicios", icon: Wrench },
    { value: "property_administrator", label: "Administrador de Fincas", icon: Building }
  ];

  const getRoleInfo = (role: string) => {
    switch (role) {
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

  const getNavigationItems = (role: string) => {
    const commonItems = [
      { id: "overview", label: "Resumen", icon: Shield },
      { id: "perfil", label: "Mi Perfil", icon: User },
      { id: "evaluacion", label: "Evaluación de Servicios", icon: Star },
    ];

    switch (role) {
      case "particular":
        return [
          ...commonItems,
          { id: "presupuesto", label: "Solicitar Presupuesto", icon: FileText },
          { id: "proveedores", label: "Proveedores de Servicios", icon: Store },
          { id: "favoritos", label: "Mis Favoritos", icon: Star },
          { id: "propiedades", label: "Mis Propiedades", icon: Home },
          { id: "historial", label: "Historial de Servicios", icon: FileText },
          { id: "notificaciones", label: "Notificaciones", icon: Bell },
          { id: "configuracion", label: "Configuración", icon: Settings },
          { id: "pagos", label: "Mis Pagos", icon: CreditCard },
          { id: "recomendaciones", label: "Recomendaciones", icon: ThumbsUp },
          { id: "premios", label: "Mis Premios", icon: Award }
        ];
      case "community_member":
        return [
          ...commonItems,
          { id: "comunidad", label: "Mi Comunidad", icon: Users },
          { id: "votaciones", label: "Votaciones", icon: CheckCircle },
          { id: "anuncios", label: "Anuncios", icon: Bell },
          { id: "gastos", label: "Gastos Comunes", icon: CreditCard },
          { id: "mantenimiento", label: "Mantenimiento", icon: Wrench },
          { id: "reservas", label: "Reservas", icon: Calendar },
          { id: "documentos", label: "Documentos", icon: FileText },
          { id: "incidencias", label: "Incidencias", icon: Settings }
        ];
      case "service_provider":
        return [
          ...commonItems,
          { id: "servicios", label: "Mis Servicios", icon: Wrench },
          { id: "solicitudes", label: "Solicitudes", icon: FileText },
          { id: "presupuestos", label: "Presupuestos", icon: CreditCard },
          { id: "contratos", label: "Contratos", icon: Award },
          { id: "calendario", label: "Calendario", icon: Calendar },
          { id: "clientes", label: "Mis Clientes", icon: Users },
          { id: "facturacion", label: "Facturación", icon: Store },
          { id: "estadisticas", label: "Estadísticas", icon: ThumbsUp }
        ];
      case "property_administrator":
        return [
          ...commonItems,
          { id: "propiedades-admin", label: "Propiedades", icon: Building },
          { id: "comunidades", label: "Comunidades", icon: Users },
          { id: "presupuestos-admin", label: "Presupuestos", icon: FileText },
          { id: "contratos-admin", label: "Contratos", icon: Award },
          { id: "proveedores-admin", label: "Proveedores", icon: Store },
          { id: "facturacion-admin", label: "Facturación", icon: CreditCard },
          { id: "reportes", label: "Reportes", icon: ThumbsUp },
          { id: "mantenimiento-admin", label: "Mantenimiento", icon: Wrench }
        ];
      default:
        return commonItems;
    }
  };

  const handleRoleChange = (newRole: string) => {
    setSelectedRole(newRole);
    setActiveTab("overview"); // Reset to overview when role changes
    
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
      case "particular":
        router.push("/particular");
        break;
      default:
        break;
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

  const roleInfo = getRoleInfo(selectedRole);
  const RoleIcon = roleInfo.icon;
  const navItems = getNavigationItems(selectedRole);

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
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${roleInfo.color} rounded-full flex items-center justify-center`}>
                  <RoleIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{profile.full_name || user.email?.split('@')[0] || "Usuario"}</h3>
                </div>
              </div>
              
              {/* Role Selector */}
              <div className="space-y-2">
                <label className="text-stone-300 text-sm font-medium">Rol activo:</label>
                <Select value={selectedRole} onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-full bg-stone-800 border-stone-600 text-white focus:ring-stone-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-stone-800 border-stone-600">
                    {roleOptions.map((role) => {
                      const IconComponent = role.icon;
                      return (
                        <SelectItem 
                          key={role.value} 
                          value={role.value}
                          className="text-white hover:bg-stone-700 focus:bg-stone-700"
                        >
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            {role.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
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
                      {profile.full_name || user.email?.split('@')[0] || "Usuario"} • <span className="text-stone-800 font-semibold">{roleInfo.label}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-600 font-medium">Sistema completamente configurado</span>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-stone-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 ${roleInfo.color} rounded-full flex items-center justify-center`}>
                              <Crown className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-stone-900 mb-1 flex items-center gap-2">
                                Rol Activo: {roleInfo.label}
                                <Badge className="bg-stone-100 text-stone-700 text-xs">✓ Activo</Badge>
                              </h3>
                              <p className="text-stone-600 text-sm">
                                {roleInfo.description}
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

                    {/* Role-specific Features */}
                    <div>
                      <div className="mb-6">
                        <h2 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
                          <RoleIcon className="h-8 w-8 text-stone-600" />
                          Funcionalidades para {roleInfo.label}
                        </h2>
                        <p className="text-stone-600 text-lg">{roleInfo.description}</p>
                      </div>

                      {selectedRole === "particular" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setActiveTab("propiedades")}>
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-stone-600 rounded-full flex items-center justify-center group-hover:bg-stone-700 transition-colors">
                                  <Home className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-black mb-2">Gestionar Propiedades</h3>
                                  <p className="text-stone-600">Registra y administra tus viviendas personales</p>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <Badge className="bg-stone-100 text-stone-700">✓ Disponible</Badge>
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
                                  <h3 className="text-xl font-bold text-black mb-2">Servicios Domésticos</h3>
                                  <p className="text-stone-600">Fontanería, electricidad, limpieza y mantenimiento</p>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <Badge className="bg-stone-100 text-stone-700">✓ Disponible</Badge>
                                <ArrowRight className="w-5 h-5 text-stone-600 group-hover:translate-x-1 transition-transform duration-300" />
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setActiveTab("evaluacion")}>
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center group-hover:bg-stone-900 transition-colors">
                                  <Star className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-black mb-2">Evaluación de Servicios</h3>
                                  <p className="text-stone-600">Califica y comenta los servicios recibidos</p>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <Badge className="bg-stone-100 text-stone-700">✓ Disponible</Badge>
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
                                  <h3 className="text-xl font-bold text-black mb-2">Historial y Documentos</h3>
                                  <p className="text-stone-600">Facturas, contratos y reportes detallados</p>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <Badge className="bg-stone-100 text-stone-700">✓ Disponible</Badge>
                                <FileText className="w-5 h-5 text-stone-600" />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}

                      {selectedRole === "community_member" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-stone-700 rounded-full flex items-center justify-center group-hover:bg-stone-800 transition-colors">
                                  <Users className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-black mb-2">Gestión de Comunidad</h3>
                                  <p className="text-stone-600">Votaciones, anuncios y gastos comunes</p>
                                </div>
                              </div>
                              <Badge className="bg-stone-100 text-stone-700">✓ Disponible</Badge>
                            </CardContent>
                          </Card>

                          <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center group-hover:bg-stone-900 transition-colors">
                                  <Calendar className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-black mb-2">Reservas y Servicios</h3>
                                  <p className="text-stone-600">Reserva instalaciones comunes y servicios</p>
                                </div>
                              </div>
                              <Badge className="bg-stone-100 text-stone-700">✓ Disponible</Badge>
                            </CardContent>
                          </Card>
                        </div>
                      )}

                      {selectedRole === "service_provider" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center group-hover:bg-stone-900 transition-colors">
                                  <Wrench className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-black mb-2">Gestión de Servicios</h3>
                                  <p className="text-stone-600">Administra tus servicios y solicitudes</p>
                                </div>
                              </div>
                              <Badge className="bg-stone-100 text-stone-700">✓ Disponible</Badge>
                            </CardContent>
                          </Card>

                          <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-stone-900 rounded-full flex items-center justify-center">
                                  <Store className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-black mb-2">Clientes y Facturación</h3>
                                  <p className="text-stone-600">Gestiona clientes y procesos de pago</p>
                                </div>
                              </div>
                              <Badge className="bg-stone-100 text-stone-700">✓ Disponible</Badge>
                            </CardContent>
                          </Card>
                        </div>
                      )}

                      {selectedRole === "property_administrator" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-stone-900 rounded-full flex items-center justify-center">
                                  <Building className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-black mb-2">Administración de Propiedades</h3>
                                  <p className="text-stone-600">Gestiona múltiples propiedades y comunidades</p>
                                </div>
                              </div>
                              <Badge className="bg-stone-100 text-stone-700">✓ Disponible</Badge>
                            </CardContent>
                          </Card>

                          <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center">
                                  <ThumbsUp className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-black mb-2">Reportes y Análisis</h3>
                                  <p className="text-stone-600">Estadísticas avanzadas y reportes detallados</p>
                                </div>
                              </div>
                              <Badge className="bg-stone-100 text-stone-700">✓ Disponible</Badge>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  </div>
                </ZoomableSection>
              )}

              {/* Mi Perfil Tab */}
              {activeTab === "perfil" && (
                <ZoomableSection>
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-black mb-2">Mi Perfil</h1>
                    <p className="text-stone-600">Gestiona tu información personal y configuración</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="border-stone-200 shadow-lg">
                      <CardHeader className="text-center pb-4">
                        <div className={`mx-auto w-24 h-24 ${roleInfo.color} rounded-full flex items-center justify-center mb-4`}>
                          <RoleIcon className="h-12 w-12 text-white" />
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
                              <p className="font-semibold text-black">{profile.full_name || user.email?.split('@')[0] || "No especificado"}</p>
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
                            <span className="text-sm text-stone-600 font-medium">Rol activo</span>
                            <Badge className={`${roleInfo.color} text-white border-0`}>
                              {roleInfo.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-stone-500 mt-2">
                            {roleInfo.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-6">
                      <UserRoleManager />
                    </div>
                  </div>
                </ZoomableSection>
              )}

              {/* Evaluación de Servicios Tab */}
              {activeTab === "evaluacion" && (
                <ZoomableSection>
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-black mb-2">Evaluación de Servicios</h1>
                    <p className="text-stone-600">Califica y comenta los servicios que has recibido</p>
                  </div>
                  
                  <Card className="border-stone-200 shadow-lg">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="h-8 w-8 text-stone-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-black mb-2">
                        Sistema de Evaluación
                      </h3>
                      <p className="text-stone-600 mb-6">
                        Próximamente podrás calificar y comentar todos los servicios que hayas utilizado. 
                        Tu feedback es muy valioso para mejorar la calidad del servicio.
                      </p>
                      <div className="flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-6 w-6 text-stone-300" />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
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

              {/* Other tabs placeholder */}
              {!["overview", "perfil", "evaluacion", "propiedades", "presupuesto"].includes(activeTab) && (
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

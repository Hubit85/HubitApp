import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Loader2, User, Crown, Star, LogOut, Settings, CheckCircle, ArrowRight, ChevronDown, ChevronRight,
  Shield, Home, Wrench, FileText, Mail, Phone, Calendar, Users, Building, Store, Bell, 
  CreditCard, ThumbsUp, Award, StarIcon, Heart, Clock, Package, MapPin, Briefcase,
  AlertTriangle, Video, Calculator, BarChart3, Eye, DollarSign, TrendingUp, Target,
  PieChart, ClipboardList
} from "lucide-react";
import ZoomableSection from "@/components/ZoomableSection";
import { Header } from "@/components/layout/Header";
import PropertyManager from "@/components/dashboard/PropertyManager";
import BudgetRequestManager from "@/components/dashboard/BudgetRequestManager";
import UserRoleManager from "@/components/UserRoleManager";

export default function Dashboard() {
  const { user, profile, signOut, loading, userRoles, activeRole, activateRole, refreshRoles } = useSupabaseAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRole, setSelectedRole] = useState<string>("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (activeRole) {
      setSelectedRole(activeRole.role_type);
    }
  }, [activeRole]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleRoleChange = async (newRole: string) => {
    if (!user || newRole === selectedRole) return;
    
    console.log("🔄 Changing role to:", newRole);
    
    try {
      setSelectedRole(newRole);
      
      const result = await activateRole(newRole as any);
      
      if (result.success) {
        console.log("✅ Role changed successfully");
        await refreshRoles();
        // Reset to overview tab when changing roles
        setActiveTab("overview");
      } else {
        console.error("❌ Failed to change role:", result.message);
        setSelectedRole(selectedRole);
        alert(`Error al cambiar el rol: ${result.message}`);
      }
    } catch (error) {
      console.error("💥 Error in handleRoleChange:", error);
      setSelectedRole(selectedRole);
      alert(`Error inesperado al cambiar el rol: ${error instanceof Error ? error.message : "Error desconocido"}`);
    }
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

  const getRoleOptions = () => {
    const availableRoles = [
      { value: "particular", label: "Particular", icon: User },
      { value: "community_member", label: "Miembro de Comunidad", icon: Users },
      { value: "service_provider", label: "Proveedor de Servicios", icon: Wrench },
      { value: "property_administrator", label: "Administrador de Fincas", icon: Building },
    ];

    return availableRoles.filter(roleOption => 
      userRoles.some(userRole => 
        userRole.role_type === roleOption.value && userRole.is_verified
      )
    );
  };

  // Base navigation items that are common
  const baseNavItems = [
    { id: "overview", label: "Resumen", icon: Shield },
    { id: "perfil", label: "Mi Perfil", icon: User },
  ];

  // Role-specific navigation items
  const getRoleSpecificNavItems = (roleType: string) => {
    switch (roleType) {
      case "particular":
        return [
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
      case "community_member":
        return [
          { id: "propiedades", label: "Mis Propiedades", icon: Home },
          { id: "comunidad", label: "Mi Comunidad", icon: Users },
          { id: "servicios", label: "Servicios Disponibles", icon: Store },
          { id: "presupuesto", label: "Solicitar Presupuesto", icon: FileText },
          { id: "proveedores", label: "Proveedores Verificados", icon: Store },
          { id: "favoritos", label: "Mis Favoritos", icon: Heart },
          { id: "historial", label: "Historial de Servicios", icon: Clock },
          { id: "evaluacion", label: "Evaluación de Servicios", icon: StarIcon },
          { id: "incidencias", label: "Reportar Incidencias", icon: Shield },
          { id: "chat", label: "Chat Comunitario", icon: MessageSquare },
          { id: "videoconferencia", label: "Videoconferencias", icon: Video },
          { id: "contratos", label: "Contratos Comunidad", icon: FileCheck },
          { id: "presupuesto-comunidad", label: "Presupuesto Comunidad", icon: Calculator },
          { id: "administrador", label: "Contactar Administrador", icon: Mail },
          { id: "notificaciones", label: "Notificaciones", icon: Bell },
          { id: "configuracion", label: "Configuración", icon: Settings },
        ];
      case "service_provider":
        return [
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
      case "property_administrator":
        return [
          { id: "comunidades", label: "Comunidades Gestionadas", icon: Users },
          { id: "propiedades", label: "Gestión de Propiedades", icon: Home },
          { id: "presupuestos", label: "Presupuestos y Contratos", icon: FileText },
          { id: "proveedores", label: "Proveedores Autorizados", icon: Store },
          { id: "incidencias", label: "Gestión de Incidencias", icon: AlertTriangle },
          { id: "juntas", label: "Juntas y Reuniones", icon: Video },
          { id: "evaluacion", label: "Evaluación de Servicios", icon: StarIcon },
          { id: "informes", label: "Informes y Reportes", icon: BarChart3 },
          { id: "facturacion", label: "Facturación", icon: CreditCard },
          { id: "notificaciones", label: "Notificaciones", icon: Bell },
          { id: "configuracion", label: "Configuración", icon: Settings },
        ];
      default:
        return [
          { id: "propiedades", label: "Mis Propiedades", icon: Home },
          { id: "presupuesto", label: "Solicitar Presupuesto", icon: FileText },
          { id: "proveedores", label: "Proveedores de Servicios", icon: Store },
          { id: "favoritos", label: "Mis Favoritos", icon: Star },
          { id: "historial", label: "Historial de Servicios", icon: FileText },
          { id: "evaluacion", label: "Evaluación de Servicios", icon: StarIcon },
          { id: "notificaciones", label: "Notificaciones", icon: Bell },
          { id: "pagos", label: "Mis Pagos", icon: CreditCard },
          { id: "configuracion", label: "Configuración", icon: Settings },
        ];
    }
  };

  // Role-specific overview content
  const renderRoleOverview = (roleType: string) => {
    const userTypeInfo = getUserTypeInfo(roleType);
    const UserTypeIcon = userTypeInfo.icon;

    switch (roleType) {
      case "particular":
        return (
          <div className="space-y-8">
            {/* Status Cards for Particular */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-stone-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <Home className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-stone-900 mb-1">Mis Propiedades</h3>
                      <p className="text-stone-600 text-sm">Gestiona tus inmuebles</p>
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
                      <p className="text-stone-600 text-sm">Presupuestos y contrataciones</p>
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
                      <p className="text-stone-600 text-sm">Tus profesionales de confianza</p>
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
        );

      case "community_member":
        return (
          <div className="space-y-8">
            {/* Status Cards for Community Member */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-stone-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <Home className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-stone-900 mb-1">Mi Comunidad</h3>
                      <p className="text-stone-600 text-sm">Residencial Los Olivos</p>
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
                      <p className="text-stone-600 text-sm">2 incidencias reportadas</p>
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
                      <p className="text-stone-600 text-sm">12 proveedores disponibles</p>
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
        );

      case "service_provider":
        return (
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
        );

      case "property_administrator":
        return (
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
        );

      default:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-stone-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${userTypeInfo.color} rounded-full flex items-center justify-center`}>
                      <UserTypeIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-stone-900 mb-1 flex items-center gap-2">
                        Rol Activo: {userTypeInfo.label}
                        <Badge className="bg-stone-100 text-stone-700 text-xs">✓ Activo</Badge>
                      </h3>
                      <p className="text-stone-600 text-sm">
                        {userTypeInfo.description}
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

              <Card className="border-stone-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-stone-900 mb-1">
                        Perfil Completo
                      </h3>
                      <p className="text-stone-600 text-sm">
                        Todas las funcionalidades disponibles
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  // Role-specific tab content renderer
  const renderRoleSpecificContent = (tabId: string, roleType: string) => {
    switch (tabId) {
      case "propiedades":
        return (
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-black mb-2">
              {roleType === "community_member" ? "Mi Comunidad" : 
               roleType === "property_administrator" ? "Gestionar Propiedades" : 
               "Mis Propiedades"}
            </h1>
            <p className="text-stone-600">
              {roleType === "community_member" ? "Información y gestión de tu comunidad" : 
               roleType === "property_administrator" ? "Administra múltiples propiedades y comunidades" : 
               "Gestiona tus propiedades residenciales"}
            </p>
            <div className="mt-6">
              <PropertyManager />
            </div>
          </div>
        );

      case "comunidad":
        return (
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-black mb-2">Mi Comunidad</h1>
            <p className="text-stone-600">Información y gestión de tu comunidad</p>
            
            <div className="mt-6 space-y-6">
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
          </div>
        );

      case "presupuesto":
      case "presupuestos":
        return (
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-black mb-2">
              {roleType === "service_provider" ? "Gestionar Presupuestos" : "Solicitar Presupuesto"}
            </h1>
            <p className="text-stone-600">
              {roleType === "service_provider" 
                ? "Gestiona y responde a solicitudes de presupuestos" 
                : "Obtén presupuestos profesionales para tus proyectos"}
            </p>
            <div className="mt-6">
              <BudgetRequestManager />
            </div>
          </div>
        );

      case "evaluacion":
        return (
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-black mb-2">
              {roleType === "service_provider" ? "Evaluaciones Recibidas" : "Evaluación de Servicios"}
            </h1>
            <p className="text-stone-600">
              {roleType === "service_provider" 
                ? "Revisa las calificaciones y comentarios de tus clientes"
                : "Califica los servicios recibidos"}
            </p>
            
            <Card className="border-stone-200 shadow-lg mt-6">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <StarIcon className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">
                  Sistema de Evaluaciones{roleType === "service_provider" ? " - Recibidas" : ""}
                </h3>
                <p className="text-stone-600 mb-6">
                  {roleType === "service_provider"
                    ? "Aquí podrás ver todas las evaluaciones que tus clientes han dejado sobre tus servicios, tanto calificaciones como comentarios detallados."
                    : "Aquí podrás calificar los servicios que has recibido, ayudando a otros usuarios a encontrar los mejores proveedores."}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-stone-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm font-medium text-stone-900">
                      {roleType === "service_provider" ? "Promedio General" : "Calificación"}
                    </p>
                    <p className="text-xs text-stone-600">
                      {roleType === "service_provider" ? "4.8/5.0" : "Puntúa del 1 al 5"}
                    </p>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-lg">
                    {roleType === "service_provider" ? (
                      <>
                        <Award className="h-6 w-6 text-stone-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-stone-900">Servicios Completados</p>
                        <p className="text-xs text-stone-600">47 trabajos</p>
                      </>
                    ) : (
                      <>
                        <FileText className="h-6 w-6 text-stone-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-stone-900">Comentarios</p>
                        <p className="text-xs text-stone-600">Comparte tu experiencia</p>
                      </>
                    )}
                  </div>
                  <div className="p-4 bg-stone-50 rounded-lg">
                    {roleType === "service_provider" ? (
                      <>
                        <Target className="h-6 w-6 text-stone-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-stone-900">Tasa de Satisfacción</p>
                        <p className="text-xs text-stone-600">96%</p>
                      </>
                    ) : (
                      <>
                        <ThumbsUp className="h-6 w-6 text-stone-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-stone-900">Recomendación</p>
                        <p className="text-xs text-stone-600">¿Lo recomendarías?</p>
                      </>
                    )}
                  </div>
                </div>
                <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                  Próximamente disponible
                </Badge>
              </CardContent>
            </Card>
          </div>
        );

      case "incidencias":
        return (
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-black mb-2">
              {roleType === "property_administrator" ? "Gestión de Incidencias" : "Reportar Incidencias"}
            </h1>
            <p className="text-stone-600">
              {roleType === "property_administrator" 
                ? "Administra incidencias reportadas por las comunidades"
                : "Informa sobre problemas o averías en tu comunidad"}
            </p>
            
            <Card className="border-stone-200 shadow-lg mt-6">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {roleType === "property_administrator" ? (
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  ) : (
                    <Shield className="h-8 w-8 text-red-600" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">
                  Sistema de {roleType === "property_administrator" ? "Gestión de " : ""}Incidencias
                </h3>
                <p className="text-stone-600 mb-6">
                  {roleType === "property_administrator"
                    ? "Centraliza todas las incidencias reportadas por miembros de las comunidades, priorízalas y gestiona su resolución con proveedores especializados."
                    : "Aquí podrás reportar incidencias, averías o problemas en las zonas comunes de tu comunidad. El administrador de fincas recibirá la notificación inmediatamente."}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {roleType === "property_administrator" ? (
                    <>
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
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
                <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                  {roleType === "property_administrator" 
                    ? "Integrado con sistema de presupuestos automáticos"
                    : "Próximamente disponible"}
                </Badge>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <Card className="border-stone-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8 text-stone-600" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-2">
                Funcionalidad en Desarrollo
              </h3>
              <p className="text-stone-600">
                Esta sección estará disponible próximamente.
              </p>
              <Badge className="bg-stone-100 text-stone-700 mt-4">
                Próximamente
              </Badge>
            </CardContent>
          </Card>
        );
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

  const currentRole = selectedRole || profile.user_type;
  const userTypeInfo = getUserTypeInfo(currentRole);
  const UserTypeIcon = userTypeInfo.icon;
  const navItems = [...baseNavItems, ...getRoleSpecificNavItems(currentRole)];

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
          <div className="w-72 bg-gray-800 text-white shadow-lg flex flex-col min-h-screen">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${userTypeInfo.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <UserTypeIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{profile.full_name || "Usuario"}</h3>
                  <p className="text-gray-300 text-sm">{user.email}</p>
                </div>
              </div>
              
              {/* Role Selector */}
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  Rol Activo
                </label>
                <Select
                  value={selectedRole}
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600 transition-all duration-300 rounded-lg">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <UserTypeIcon className="h-4 w-4" />
                        <span className="text-sm">{userTypeInfo.label}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {getRoleOptions().map((role) => {
                      const RoleIcon = role.icon;
                      const isCurrentRole = selectedRole === role.value;
                      return (
                        <SelectItem 
                          key={role.value} 
                          value={role.value}
                          className={`text-white transition-colors duration-200 ${
                            isCurrentRole 
                              ? "bg-gray-600 text-white focus:bg-gray-600" 
                              : "hover:bg-gray-600 focus:bg-gray-600"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <RoleIcon className="h-4 w-4" />
                            <span>{role.label}</span>
                            {isCurrentRole && <CheckCircle className="h-3 w-3 ml-1 text-green-400" />}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                
                {/* Mostrar información sobre roles disponibles */}
                {getRoleOptions().length > 1 && (
                  <p className="text-xs text-gray-400 mt-1">
                    {getRoleOptions().length} roles disponibles
                  </p>
                )}
                
                {/* Mostrar si no hay otros roles disponibles */}
                {getRoleOptions().length <= 1 && userRoles.length > 1 && (
                  <p className="text-xs text-amber-400 mt-1">
                    Otros roles pendientes de verificación
                  </p>
                )}
              </div>
            </div>

            <div className="flex-1 p-4">
              <nav className="space-y-2">
                {navItems.map((item, index) => (
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
                      {currentRole === "particular" && "¡Bienvenido! 🏠"}
                      {currentRole === "community_member" && "¡Bienvenido a tu Comunidad! 🏘️"}
                      {currentRole === "service_provider" && "¡Tu Negocio en Marcha! 🔧"}
                      {currentRole === "property_administrator" && "Panel de Control Administrativo 🏢"}
                      {!["particular", "community_member", "service_provider", "property_administrator"].includes(currentRole) && "¡Bienvenido de vuelta! 👋"}
                    </h1>
                    <p className="text-stone-600 text-lg">
                      {profile.full_name || "Usuario"} • <span className="text-stone-800 font-semibold">{userTypeInfo.label}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-600 font-medium">
                        {currentRole === "particular" && "Cuenta configurada correctamente"}
                        {currentRole === "community_member" && "Conectado con tu comunidad"}
                        {currentRole === "service_provider" && "Perfil verificado y activo"}
                        {currentRole === "property_administrator" && "Sistema de administración activo"}
                        {!["particular", "community_member", "service_provider", "property_administrator"].includes(currentRole) && "Sistema completamente configurado"}
                      </span>
                    </div>
                  </div>

                  {renderRoleOverview(currentRole)}
                </ZoomableSection>
              )}

              {/* Mi Perfil Tab - Now includes all profile information and role management */}
              {activeTab === "perfil" && (
                <ZoomableSection>
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-black mb-2">
                      {currentRole === "service_provider" ? "Mi Perfil Profesional" : 
                       currentRole === "property_administrator" ? "Mi Perfil Administrativo" : 
                       "Mi Perfil"}
                    </h1>
                    <p className="text-stone-600">
                      {currentRole === "service_provider" ? "Gestiona tu información de proveedor de servicios" : 
                       currentRole === "property_administrator" ? "Gestiona tu información de administrador de fincas" : 
                       currentRole === "community_member" ? "Gestiona tu información como miembro de comunidad" :
                       "Gestiona tu información personal y roles del sistema"}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Details */}
                    <div className="lg:col-span-1">
                      <Card className="border-stone-200 shadow-lg">
                        <CardHeader className="text-center pb-4">
                          <div className={`mx-auto w-24 h-24 ${userTypeInfo.color} rounded-full flex items-center justify-center mb-4`}>
                            <UserTypeIcon className="h-12 w-12 text-white" />
                          </div>
                          <CardTitle className="text-2xl font-bold text-black">
                            {currentRole === "service_provider" ? "Proveedor de Servicios" : 
                             currentRole === "property_administrator" ? "Administrador de Fincas" : 
                             currentRole === "community_member" ? "Miembro de Comunidad" :
                             "Información del Perfil"}
                          </CardTitle>
                          <CardDescription className="text-stone-600 font-medium">
                            {currentRole === "service_provider" ? "Profesional verificado" : 
                             currentRole === "property_administrator" ? "Profesional colegiado" : 
                             currentRole === "community_member" ? "Residencial Los Olivos" :
                             "Detalles de tu cuenta"}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200">
                              <UserTypeIcon className="h-5 w-5 text-stone-500" />
                              <div>
                                <p className="text-sm text-stone-500 font-medium">
                                  {currentRole === "service_provider" ? "Empresa" : 
                                   currentRole === "property_administrator" ? "Empresa" : 
                                   "Nombre"}
                                </p>
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

                            {currentRole === "community_member" && (
                              <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200">
                                <Home className="h-5 w-5 text-stone-500" />
                                <div>
                                  <p className="text-sm text-stone-500 font-medium">Vivienda</p>
                                  <p className="font-semibold text-black">Edificio A - Portal 3 - 2ºB</p>
                                </div>
                              </div>
                            )}

                            {currentRole === "service_provider" && (
                              <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200">
                                <Store className="h-5 w-5 text-stone-500" />
                                <div>
                                  <p className="text-sm text-stone-500 font-medium">Especialidad</p>
                                  <p className="font-semibold text-black">Fontanería y Electricidad</p>
                                </div>
                              </div>
                            )}

                            {currentRole === "property_administrator" && (
                              <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200">
                                <Briefcase className="h-5 w-5 text-stone-500" />
                                <div>
                                  <p className="text-sm text-stone-500 font-medium">Número de Colegiado</p>
                                  <p className="font-semibold text-black">CAF-MAD-2847</p>
                                </div>
                              </div>
                            )}

                            {profile.phone && (
                              <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200">
                                <Phone className="h-5 w-5 text-stone-500" />
                                <div>
                                  <p className="text-sm text-stone-500 font-medium">Teléfono</p>
                                  <p className="font-semibold text-black">{profile.phone}</p>
                                </div>
                              </div>
                            )}

                            {(currentRole === "service_provider" || currentRole === "property_administrator") && (
                              <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200">
                                <MapPin className="h-5 w-5 text-stone-500" />
                                <div>
                                  <p className="text-sm text-stone-500 font-medium">
                                    {currentRole === "service_provider" ? "Zona de Trabajo" : "Zona de Actuación"}
                                  </p>
                                  <p className="font-semibold text-black">Madrid y {currentRole === "property_administrator" ? "área metropolitana" : "alrededores"}</p>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200">
                              <Calendar className="h-5 w-5 text-stone-500" />
                              <div>
                                <p className="text-sm text-stone-500 font-medium">
                                  {currentRole === "community_member" ? "Miembro desde" : 
                                   (currentRole === "service_provider" || currentRole === "property_administrator") ? "En la plataforma desde" :
                                   "Miembro desde"}
                                </p>
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
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-stone-600 font-medium">Rol Activo</span>
                              <Badge className={`${userTypeInfo.color} text-white border-0`}>
                                {userTypeInfo.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-stone-500">
                              {userTypeInfo.description}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-stone-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-stone-600 font-medium">Estado</span>
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                ✓ Verificado
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Profile Management Tools - Including Role Management */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Role Management Section */}
                      <Card className="border-stone-200 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-xl font-bold text-black">
                            <Crown className="h-6 w-6 text-stone-600" />
                            Gestión de Roles
                          </CardTitle>
                          <CardDescription>
                            Administra tus diferentes roles en la plataforma
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <UserRoleManager />
                        </CardContent>
                      </Card>

                      {/* System Tools */}
                      <Card className="border-stone-200 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-xl font-bold text-black">
                            <Settings className="h-6 w-6 text-stone-600" />
                            Herramientas del Sistema
                          </CardTitle>
                          <CardDescription>
                            Herramientas de configuración y diagnóstico
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Settings className="h-8 w-8 text-stone-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-stone-900 mb-2">Sistema Configurado</h3>
                            <p className="text-stone-600 text-sm">Todas las herramientas del sistema están funcionando correctamente.</p>
                            <Badge className="bg-green-100 text-green-800 mt-3">✓ Operativo</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </ZoomableSection>
              )}

              {/* Role-specific tabs */}
              {activeTab !== "overview" && activeTab !== "perfil" && (
                <ZoomableSection>
                  {renderRoleSpecificContent(activeTab, currentRole)}
                </ZoomableSection>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

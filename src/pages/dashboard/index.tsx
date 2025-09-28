import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Loader2, User, Crown, Star, LogOut, Settings, CheckCircle, ArrowRight, ChevronRight,
  Shield, Home, Wrench, FileText, Mail, Phone, Calendar, Users, Building, Store, Bell, 
  CreditCard, Heart, Clock, Package,
  AlertTriangle, Video, Calculator, BarChart3, DollarSign, TrendingUp,
  ClipboardList, MessageSquare, FileCheck
} from "lucide-react";
import ZoomableSection from "@/components/ZoomableSection";
import { Header } from "@/components/layout/Header";
import PropertyManager from "@/components/dashboard/PropertyManager";
import BudgetRequestManager from "@/components/dashboard/BudgetRequestManager";
import { BudgetRequestManager as ServiceProviderBudgetManager } from "@/components/service-provider/BudgetRequestManager";
import { EnhancedBudgetRequestForm } from "@/components/dashboard/EnhancedBudgetRequestForm";
import { IncidentManagement } from "@/components/dashboard/IncidentManagement";
import { ContractManager } from "@/components/contracts/ContractManager";
import UserRoleManager from "@/components/UserRoleManager";
import { IncidentReportForm } from "@/components/IncidentReportForm";
import { CommunityAdministratorAssignment } from "@/components/CommunityAdministratorAssignment";
import { PropertyAdministratorProfile } from "@/components/PropertyAdministratorProfile";
import { NotificationCenter } from "@/components/NotificationCenter";
import { SupabaseDataViewer } from "@/components/debug/SuperbaseDataViewer";
import ServiceHistoryCard from "@/components/ratings/ServiceHistoryCard";

export default function Dashboard() {
  const { user, profile, signOut, loading, userRoles, activeRole, activateRole, refreshRoles } = useSupabaseAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRole, setSelectedRole] = useState<string>("particular");
  const [incidentToProcess, setIncidentToProcess] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    // CORREGIDO: Usar activeRole real en lugar de profile.user_type
    let newRole = "particular";
    
    // Primera prioridad: rol activo de la tabla user_roles
    if (activeRole?.role_type) {
      newRole = activeRole.role_type;
      console.log("🎯 Usando rol activo de user_roles:", newRole);
    } 
    // Segunda prioridad: primer rol verificado si no hay activo
    else if (userRoles?.length > 0) {
      const verifiedRoles = userRoles.filter(r => r.is_verified);
      if (verifiedRoles.length > 0) {
        newRole = verifiedRoles[0].role_type;
        console.log("🎯 Usando primer rol verificado:", newRole);
      }
    }
    // Última prioridad: profile.user_type (solo como fallback)
    else if (profile?.user_type) {
      newRole = profile.user_type;
      console.log("🎯 Usando profile.user_type como fallback:", newRole);
    }
    
    if (newRole !== selectedRole) {
      console.log(`🔄 Cambiando rol mostrado de "${selectedRole}" a "${newRole}"`);
      setSelectedRole(newRole);
    }

    // Handle URL parameters for specific tabs
    const { tab, incident } = router.query;
    if (tab && typeof tab === 'string') {
      setActiveTab(tab);
    }
    if (incident && typeof incident === 'string') {
      // If there's an incident parameter, we might want to pre-select it
      console.log('Incident parameter detected:', incident);
    }
  }, [activeRole, userRoles, profile, router.query]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleRoleChange = async (newRole: string) => {
    if (!user || newRole === selectedRole || !newRole) return;
    
    try {
      // Show loading state visually
      const roleSelector = document.querySelector('[data-role-selector]') as HTMLElement;
      if (roleSelector) {
        roleSelector.style.opacity = '0.6';
        roleSelector.style.pointerEvents = 'none';
      }

      console.log(`🔄 Iniciando cambio de rol de "${selectedRole}" a "${newRole}"`);
      
      const result = await activateRole(newRole as any);
      
      if (result.success) {
        console.log("✅ Cambio de rol exitoso, actualizando interfaz...");
        
        // Update local state immediately for better UX
        setSelectedRole(newRole);
        
        // Refresh roles to get updated data
        await refreshRoles();
        
        // Reset to overview tab to show new role capabilities
        setActiveTab("overview");
        
        // Show success notification
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse';
        successDiv.innerHTML = `
          <div class="flex items-center gap-2">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Rol cambiado exitosamente</span>
          </div>
        `;
        document.body.appendChild(successDiv);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
          if (document.body.contains(successDiv)) {
            successDiv.style.transition = 'opacity 0.5s ease-out';
            successDiv.style.opacity = '0';
            setTimeout(() => {
              if (document.body.contains(successDiv)) {
                document.body.removeChild(successDiv);
              }
            }, 500);
          }
        }, 3000);
        
      } else {
        console.error("❌ Error al cambiar rol:", result.message);
        
        // Show error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        errorDiv.innerHTML = `
          <div class="flex items-center gap-2">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <span>Error: ${result.message}</span>
          </div>
        `;
        document.body.appendChild(errorDiv);
        
        // Remove error notification after 5 seconds
        setTimeout(() => {
          if (document.body.contains(errorDiv)) {
            document.body.removeChild(errorDiv);
          }
        }, 5000);
      }
    } catch (error) {
      console.error("❌ Error inesperado al cambiar rol:", error);
      
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorDiv.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <span>Error inesperado al cambiar el rol</span>
        </div>
      `;
      document.body.appendChild(errorDiv);
      
      setTimeout(() => {
        if (document.body.contains(errorDiv)) {
          document.body.removeChild(errorDiv);
        }
      }, 5000);
    } finally {
      // Restore role selector state
      const roleSelector = document.querySelector('[data-role-selector]') as HTMLElement;
      if (roleSelector) {
        roleSelector.style.opacity = '1';
        roleSelector.style.pointerEvents = 'auto';
      }
    }
  };

  const handleProcessIncident = (incident: any) => {
    setIncidentToProcess(incident);
    setActiveTab("presupuesto");
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

  const baseNavItems = [
    { id: "overview", label: "Resumen", icon: Shield },
    { id: "perfil", label: "Mi Perfil", icon: User },
  ];

  const getRoleSpecificNavItems = (roleType: string) => {
    const baseItems = [
      // Add diagnostic tab
      { id: "diagnostico", label: "🔧 Diagnóstico Sistema", icon: Settings },
    ];
    
    switch (roleType) {
      case "particular":
        return [
          ...baseItems,
          { id: "propiedades", label: "Mis Propiedades", icon: Home },
          { id: "presupuesto", label: "Solicitar Presupuesto", icon: FileText },
          { id: "proveedores", label: "Proveedores de Servicios", icon: Wrench },
          { id: "favoritos", label: "Mis Favoritos", icon: Heart },
          { id: "historial", label: "Historial de Servicios", icon: Clock },
          { id: "evaluacion", label: "Evaluación de Servicios", icon: Star },
          { id: "notificaciones", label: "Notificaciones", icon: Bell },
          { id: "pagos", label: "Mis Pagos", icon: CreditCard },
          { id: "configuracion", label: "Configuración", icon: Settings },
        ];
      case "community_member":
        return [
          ...baseItems,
          { id: "propiedades", label: "Mis Propiedades", icon: Home },
          { id: "comunidad", label: "Mi Comunidad", icon: Users },
          { id: "servicios", label: "Servicios Disponibles", icon: Store },
          { id: "proveedores", label: "Proveedores Verificados", icon: Store },
          { id: "favoritos", label: "Mis Favoritos", icon: Heart },
          { id: "historial", label: "Historial de Servicios", icon: Clock },
          { id: "evaluacion", label: "Evaluación de Servicios", icon: Star },
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
          ...baseItems,
          { id: "servicios", label: "Mis Servicios", icon: Store },
          { id: "presupuestos", label: "Gestionar Presupuestos", icon: FileText },
          { id: "clientes", label: "Mis Clientes", icon: Users },
          { id: "calendario", label: "Calendario", icon: Calendar },
          { id: "contratos", label: "Contratos Activos", icon: ClipboardList },
          { id: "evaluacion", label: "Evaluación de Servicios", icon: Star },
          { id: "facturacion", label: "Facturación", icon: CreditCard },
          { id: "estadisticas", label: "Estadísticas", icon: TrendingUp },
          { id: "notificaciones", label: "Notificaciones", icon: Bell },
          { id: "configuracion", label: "Configuración", icon: Settings },
        ];
      case "property_administrator":
        return [
          ...baseItems,
          { id: "comunidades", label: "Comunidades Gestionadas", icon: Users },
          { id: "presupuesto", label: "Solicitar Presupuesto", icon: FileText },
          { id: "proveedores", label: "Proveedores Autorizados", icon: Store },
          { id: "incidencias", label: "Gestión de Incidencias", icon: AlertTriangle },
          { id: "juntas", label: "Juntas y Reuniones", icon: Video },
          { id: "evaluacion", label: "Evaluación de Servicios", icon: Star },
          { id: "informes", label: "Informes y Reportes", icon: BarChart3 },
          { id: "facturacion", label: "Facturación", icon: CreditCard },
          { id: "notificaciones", label: "Notificaciones", icon: Bell },
          { id: "configuracion", label: "Configuración", icon: Settings },
        ];
      default:
        return [
          ...baseItems,
          { id: "propiedades", label: "Mis Propiedades", icon: Home },
          { id: "presupuesto", label: "Solicitar Presupuesto", icon: FileText },
          { id: "proveedores", label: "Proveedores de Servicios", icon: Store },
          { id: "favoritos", label: "Mis Favoritos", icon: Star },
          { id: "historial", label: "Historial de Servicios", icon: FileText },
          { id: "evaluacion", label: "Evaluación de Servicios", icon: Star },
          { id: "notificaciones", label: "Notificaciones", icon: Bell },
          { id: "pagos", label: "Mis Pagos", icon: CreditCard },
          { id: "configuracion", label: "Configuración", icon: Settings },
        ];
    }
  };

  const renderRoleOverview = (roleType: string) => {
    const userTypeInfo = getUserTypeInfo(roleType);
    const UserTypeIcon = userTypeInfo.icon;

    switch (roleType) {
      case "particular":
        return (
          <div className="space-y-8">
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
                      Informa sobre problemas en tu comunidad al administrador
                    </p>
                    <ArrowRight className="w-5 h-5 text-stone-600 group-hover:translate-x-1 transition-transform duration-300 mx-auto" />
                  </CardContent>
                </Card>

                <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setActiveTab("administrador")}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-700 transition-colors">
                      <Mail className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-black mb-3">Contactar Administrador</h3>
                    <p className="text-sm text-stone-600 mb-4">
                      Comunícate directamente con el administrador de fincas
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
                      Consulta proveedores autorizados por la comunidad
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

            <div>
              <h2 className="text-3xl font-bold text-black mb-6 flex items-center gap-3">
                <Package className="h-8 w-8 text-stone-600" />
                Herramientas de Gestión
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer bg-gradient-to-br from-white to-blue-50" onClick={() => setActiveTab("presupuesto")}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-black mb-3">Solicitar Presupuesto</h3>
                    <p className="text-sm text-stone-600 mb-4">
                      Gestiona licitaciones y solicita presupuestos para las comunidades
                    </p>
                    <ChevronRight className="w-5 h-5 text-stone-600 group-hover:translate-x-1 transition-transform duration-300 mx-auto" />
                  </CardContent>
                </Card>

                <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer bg-gradient-to-br from-white to-red-50" onClick={() => setActiveTab("incidencias")}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <AlertTriangle className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-black mb-3">Gestionar Incidencias</h3>
                    <p className="text-sm text-stone-600 mb-4">
                      Administra reportes y urgencias de las comunidades
                    </p>
                    <ChevronRight className="w-5 h-5 text-stone-600 group-hover:translate-x-1 transition-transform duration-300 mx-auto" />
                  </CardContent>
                </Card>

                <Card className="group border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer bg-gradient-to-br from-white to-green-50" onClick={() => setActiveTab("comunidades")}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-black mb-3">Comunidades Gestionadas</h3>
                    <p className="text-sm text-stone-600 mb-4">
                      Administra las comunidades bajo tu gestión
                    </p>
                    <ChevronRight className="w-5 h-5 text-stone-600 group-hover:translate-x-1 transition-transform duration-300 mx-auto" />
                  </CardContent>
                </Card>
              </div>
            </div>

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
                      <p className="text-stone-600">
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
                      <p className="text-stone-600">
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

  const renderRoleSpecificContent = (tabId: string, roleType: string) => {
    // Add diagnostic tab for debugging
    if (tabId === "diagnostico") {
      return (
        <>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-black mb-2">🔧 Diagnóstico de Sistema</h1>
            <p className="text-stone-600">Información detallada sobre los datos en Supabase</p>
          </div>
          
          <SupabaseDataViewer />
        </>
      );
    }
    
    switch (tabId) {
      case "propiedades":
        return (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-black mb-2">
                {roleType === "community_member" ? "Mi Comunidad" : "Mis Propiedades"}
              </h1>
              <p className="text-stone-600">
                {roleType === "community_member" ? "Información y gestión de tu comunidad" : "Gestiona tus propiedades residenciales"}
              </p>
            </div>
            {(roleType === "particular" || roleType === "community_member") ? (
              <div className="mt-6">
                <PropertyManager />
              </div>
            ) : (
              <Card className="border-amber-200 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 mt-6">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-2">Funcionalidad No Disponible</h3>
                  <p className="text-amber-700 mb-4">
                    Como miembro de comunidad, no puedes solicitar presupuestos directamente. 
                    Para servicios en tu comunidad, debes reportar la incidencia al administrador de fincas.
                  </p>
                  <p className="text-amber-600 text-sm mb-6">
                    El administrador de fincas será quien gestione los presupuestos en nombre de la comunidad.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      onClick={() => setActiveTab("incidencias")}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Reportar Incidencia
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setActiveTab("administrador")}
                      className="border-amber-300 text-amber-700 hover:bg-amber-50"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Contactar Administrador
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        );

      case "comunidad":
        return (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-black mb-2">Mi Comunidad</h1>
              <p className="text-stone-600">Información y gestión de tu comunidad</p>
            </div>
            
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
          </>
        );

      case "presupuesto":
      case "presupuestos":
        if (roleType === "service_provider") {
          return (
            <>
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  Gestión de Presupuestos y Ofertas
                </h1>
                <p className="text-stone-600">
                  Encuentra oportunidades de negocio, envía cotizaciones profesionales y gestiona tus propuestas
                </p>
              </div>
              <ServiceProviderBudgetManager 
                providerId={activeRole?.id || ""}
              />
            </>
          );
        } else {
          return (
            <>
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-black mb-2">
                  {roleType === "property_administrator" ? "Solicitar Presupuesto" : "Solicitar Presupuesto"}
                </h1>
                <p className="text-stone-600">
                  {roleType === "property_administrator" 
                    ? "Solicita presupuestos profesionales para las comunidades bajo tu administración"
                    : "Obtén presupuestos profesionales para tus proyectos"}
                </p>
              </div>
              {roleType === "community_member" ? (
                <Card className="border-amber-200 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 mt-6">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="h-8 w-8 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-black mb-2">Funcionalidad No Disponible</h3>
                    <p className="text-amber-700 mb-4">
                      Como miembro de comunidad, no puedes solicitar presupuestos directamente. 
                      Para servicios en tu comunidad, debes reportar la incidencia al administrador de fincas.
                    </p>
                    <p className="text-amber-600 text-sm mb-6">
                      El administrador de fincas será quien gestione los presupuestos en nombre de la comunidad.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button 
                        onClick={() => setActiveTab("incidencias")}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Reportar Incidencia
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setActiveTab("administrador")}
                        className="border-amber-300 text-amber-700 hover:bg-amber-50"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Contactar Administrador
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : roleType === "property_administrator" ? (
                <div className="mt-6">
                  <EnhancedBudgetRequestForm 
                    prefilledIncident={incidentToProcess}
                    onSuccess={() => {
                      setIncidentToProcess(null);
                      console.log("Budget request created from incident successfully");
                    }}
                  />
                </div>
              ) : (
                <div className="mt-6">
                  <BudgetRequestManager />
                </div>
              )}
            </>
          );
        }

      case "evaluacion":
        return (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-black mb-2">Evaluación de Servicios</h1>
              <p className="text-stone-600">Califica los servicios recibidos</p>
            </div>
            
            <Card className="border-stone-200 shadow-lg mt-6">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">
                  Sistema de Evaluaciones
                </h3>
                <ServiceHistoryCard 
                  service={{
                    id: 'sample-1',
                    serviceName: 'Servicio de prueba',
                    providerName: 'Proveedor ejemplo',
                    providerImage: '/HuBiT-logo-white.svg',
                    category: 'Fontanería',
                    date: new Date().toLocaleDateString(),
                    cost: 150,
                    status: 'completed',
                    rating: 4.5,
                    comment: 'Servicio excelente',
                    location: 'Madrid',
                    duration: '2 horas'
                  }}
                  onRate={(serviceId: string) => {
                    console.log('Rating service:', serviceId);
                  }}
                  onViewDetails={(serviceId: string) => {
                    console.log('View details:', serviceId);
                  }}
                  onRepeatService={(serviceId: string) => {
                    console.log('Repeat service:', serviceId);
                  }}
                  onContactProvider={(serviceId: string) => {
                    console.log('Contact provider:', serviceId);
                  }}
                />
              </CardContent>
            </Card>
          </>
        );

      case "incidencias":
      case "gestionar-incidencias":
        return (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-black mb-2">
                {roleType === "property_administrator" ? "Gestión de Incidencias" : "Reportar Incidencias"}
              </h1>
              <p className="text-stone-600">
                {roleType === "property_administrator" 
                  ? "Administra incidencias reportadas por las comunidades"
                  : "Informa sobre problemas o averías en tu comunidad"}
              </p>
            </div>
            
            {roleType === "community_member" ? (
              <div className="mt-6">
                <IncidentReportForm 
                  onSuccess={() => {
                    console.log("Incidencia reportada exitosamente desde dashboard principal");
                  }}
                />
              </div>
            ) : roleType === "property_administrator" ? (
              <div className="mt-6">
                <IncidentManagement onProcessIncident={handleProcessIncident} />
              </div>
            ) : (
              <Card className="border-stone-200 shadow-lg mt-6">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-2">Sistema de Incidencias</h3>
                  <p className="text-stone-600 mb-6">
                    Esta funcionalidad está disponible para miembros de comunidad (reportar) y administradores de fincas (gestionar).
                  </p>
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                    No disponible para este rol
                  </Badge>
                </CardContent>
              </Card>
            )}
          </>
        );
      
      case "contratos":
        return (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
                <ClipboardList className="h-8 w-8 text-purple-600" />
                {roleType === "service_provider" ? "Gestión de Contratos" : 
                 roleType === "property_administrator" ? "Contratos de Comunidades" :
                 roleType === "community_member" ? "Mis Contratos" : "Mis Contratos"}
              </h1>
              <p className="text-stone-600">
                {roleType === "service_provider" 
                  ? "Administra contratos activos, crea nuevos contratos desde cotizaciones aceptadas y realiza seguimiento de proyectos"
                  : roleType === "property_administrator"
                  ? "Gestiona contratos de servicios para las comunidades bajo tu administración"
                  : roleType === "community_member"
                  ? "Gestiona contratos de servicios comunitarios, firmas digitales y seguimiento de trabajos"
                  : "Administra tus contratos de servicios"}
              </p>
            </div>
            
            <ContractManager />
          </>
        );

      case "notificaciones":
        // UPDATED: Use actual NotificationCenter component for all users, especially property administrators
        return (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
                <Bell className="h-8 w-8 text-blue-600" />
                {roleType === "property_administrator" ? "Panel de Notificaciones y Solicitudes" : "Mis Notificaciones"}
              </h1>
              <p className="text-stone-600">
                {roleType === "property_administrator" 
                  ? "Gestiona solicitudes de miembros de comunidad y revisa notificaciones importantes del sistema"
                  : "Mantente al día con las actualizaciones y notificaciones importantes"}
              </p>
            </div>
            
            <div className="mt-6">
              <NotificationCenter userRole={roleType as "property_administrator" | "community_member" | "service_provider" | "particular"} />
            </div>
          </>
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

  // CORREGIDO: Usar selectedRole (que ahora refleja el rol activo real) en lugar de profile?.user_type
  const currentRole = selectedRole || "particular";
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
        <Header />

        <div className="flex">
          <div className="w-72 bg-gray-800 text-white shadow-lg flex flex-col min-h-screen">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${userTypeInfo.color} rounded-full flex items-center justify-center`}>
                  <UserTypeIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{profile?.full_name || "Usuario"}</h3>
                  <p className="text-gray-300 text-sm">{user?.email}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  Rol Activo
                </label>
                <Select
                  value={selectedRole}
                  onValueChange={handleRoleChange}
                  data-role-selector
                >
                  <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600 transition-all duration-300 rounded-lg">
                    <SelectValue placeholder="Seleccionar rol">
                      {selectedRole && (
                        <div className="flex items-center gap-2">
                          <UserTypeIcon className="h-4 w-4" />
                          <span className="text-sm">{userTypeInfo.label}</span>
                        </div>
                      )}
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
                          className={`text-white transition-all duration-200 ${
                            isCurrentRole 
                              ? "bg-emerald-600 text-white focus:bg-emerald-600 shadow-md" 
                              : "hover:bg-gray-600 focus:bg-gray-600 hover:scale-105"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <RoleIcon className="h-4 w-4" />
                            <span>{role.label}</span>
                            {isCurrentRole && <CheckCircle className="h-3 w-3 ml-1 text-emerald-200" />}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                
                {getRoleOptions().length > 1 && (
                  <p className="text-xs text-gray-400 mt-1">
                    {getRoleOptions().length} roles disponibles
                  </p>
                )}
                
                {getRoleOptions().length <= 1 && userRoles.length > 1 && (
                  <p className="text-xs text-amber-400 mt-1">
                    Otros roles pendientes de verificación
                  </p>
                )}
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

          <main className="flex-1 bg-gray-50">
            <div className="max-w-full px-8 py-8">
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
                                  {currentRole === "service_provider" || currentRole === "property_administrator" ? "Empresa" : "Nombre"}
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
                                <p className="text-sm text-stone-500 font-medium">
                                  Miembro desde
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

                    <div className="lg:col-span-2 space-y-6">
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

                      {/* Community Administrator Assignment - Only for community members */}
                      {currentRole === "community_member" && (
                        <Card className="border-stone-200 shadow-lg">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl font-bold text-black">
                              <Building className="h-6 w-6 text-stone-600" />
                              Administrador de Fincas
                            </CardTitle>
                            <CardDescription>
                              Asigna la empresa que administra tu comunidad
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <CommunityAdministratorAssignment />
                          </CardContent>
                        </Card>
                      )}

                      {/* Property Administrator Profile - Only for property administrators */}
                      {currentRole === "property_administrator" && (
                        <PropertyAdministratorProfile />
                      )}

                      {/* Generic profile tools for non-property-administrator roles */}
                      {currentRole !== "property_administrator" && (
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
                      )}
                    </div>
                  </div>
                </ZoomableSection>
              )}

              {activeTab !== "overview" && activeTab !== "perfil" && (
                <ZoomableSection>
                  {renderRoleSpecificContent(activeTab, currentRole)}
                </ZoomableSection>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

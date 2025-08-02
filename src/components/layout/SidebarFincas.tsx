import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { MapPin, Calendar, ClipboardList, Building, Wrench, User, ThumbsUp, Award, CreditCard, LogOut, FileText } from "lucide-react";
import { authService } from "@/services/AuthService";

interface SidebarFincasProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function SidebarFincas({ activeTab, setActiveTab }: SidebarFincasProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authService.logout();
      setTimeout(() => {
        router.push('/');
      }, 300);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Error al cerrar sesión. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="w-64 bg-gray-800 text-white shadow-lg flex flex-col h-full">
      <div className="p-4 flex-1">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <nav className="space-y-2">
          <Button 
            variant={activeTab === "mapa" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("mapa")}
          >
            <MapPin className="mr-2 h-5 w-5" />
            Mapa
          </Button>
          <Button 
            variant={activeTab === "activos" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("activos")}
          >
            <Building className="mr-2 h-5 w-5" />
            Activos
          </Button>
          <Button 
            variant={activeTab === "servicios" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("servicios")}
          >
            <Wrench className='mr-2 h-5 w-5' />
            Servicios Actuales
          </Button>
          <Button 
            variant={activeTab === "solicitar-presupuesto" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("solicitar-presupuesto")}
          >
            <FileText className="mr-2 h-5 w-5" />
            Solicitar Presupuesto
          </Button>
          <Button 
            variant={activeTab === "juntas" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("juntas")}
          >
            <Calendar className="mr-2 h-5 w-5" />
            Juntas
          </Button>
          <Button 
            variant={activeTab === "pendientes" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("pendientes")}
          >
            <ClipboardList className="mr-2 h-5 w-5" />
            Temas Pendientes
          </Button>
          <Button 
            variant={activeTab === "usuarios" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("usuarios")}
          >
            <User className="mr-2 h-5 w-5" />
            Usuarios
          </Button>
          <Button 
            variant={activeTab === "aprobaciones" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("aprobaciones")}
          >
            <ThumbsUp className="mr-2 h-5 w-5" />
            Aprobaciones
          </Button>
          <Button 
            variant={activeTab === "premios" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("premios")}
          >
            <Award className="mr-2 h-5 w-5" />
            Premios
          </Button>
          <Button 
            variant={activeTab === "pagos" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("pagos")}
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Pagos
          </Button>
        </nav>
      </div>
      
      {/* Sign Out Button at Bottom */}
      <div className="p-4 border-t border-gray-700">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-200"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}

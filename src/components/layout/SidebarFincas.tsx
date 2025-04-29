import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ClipboardList, Building, Wrench, User, ThumbsUp, Award, CreditCard } from "lucide-react";

interface SidebarFincasProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function SidebarFincas({ activeTab, setActiveTab }: SidebarFincasProps) {
  return (
    <div className="w-64 bg-gray-800 text-white shadow-lg">
      <div className="p-4">
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
    </div>
  );
}
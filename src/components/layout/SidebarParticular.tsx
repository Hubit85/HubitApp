
import React from "react";
import { Button } from "@/components/ui/button";
import { User, FileText, Store, Star, Home, Settings, Bell } from "lucide-react";

interface SidebarParticularProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function SidebarParticular({ activeTab, setActiveTab }: SidebarParticularProps) {
  return (
    <div className="w-64 bg-gray-800 text-white shadow-lg">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <nav className="space-y-2">
          <Button 
            variant={activeTab === "perfil" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("perfil")}
          >
            <User className="mr-2 h-5 w-5" />
            Mi Perfil
          </Button>
          <Button 
            variant={activeTab === "presupuesto" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("presupuesto")}
          >
            <FileText className="mr-2 h-5 w-5" />
            Solicitar Presupuesto
          </Button>
          <Button 
            variant={activeTab === "proveedores" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("proveedores")}
          >
            <Store className="mr-2 h-5 w-5" />
            Proveedores de Servicios
          </Button>
          <Button 
            variant={activeTab === "favoritos" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("favoritos")}
          >
            <Star className="mr-2 h-5 w-5" />
            Mis Favoritos
          </Button>
          <Button 
            variant={activeTab === "propiedades" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("propiedades")}
          >
            <Home className="mr-2 h-5 w-5" />
            Mis Propiedades
          </Button>
          <Button 
            variant={activeTab === "notificaciones" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("notificaciones")}
          >
            <Bell className="mr-2 h-5 w-5" />
            Notificaciones
          </Button>
          <Button 
            variant={activeTab === "configuracion" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("configuracion")}
          >
            <Settings className="mr-2 h-5 w-5" />
            Configuración
          </Button>
        </nav>
      </div>
    </div>
  );
}

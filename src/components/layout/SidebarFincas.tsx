import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { MapPin, Calendar, ClipboardList, Building, Wrench, User, ThumbsUp, Award, CreditCard, LogOut, FileText, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";

interface SidebarFincasProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function SidebarFincas({ activeTab, setActiveTab }: SidebarFincasProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const { signOut } = useSupabaseAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Error al cerrar sesión. Por favor, inténtalo de nuevo.");
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'mapa', label: 'Mapa', icon: MapPin },
    { id: 'activos', label: 'Activos', icon: Building },
    { id: 'servicios', label: 'Servicios Actuales', icon: Wrench },
    { id: 'solicitar-presupuesto', label: 'Solicitar Presupuesto', icon: FileText },
    { id: 'juntas', label: 'Juntas', icon: Calendar },
    { id: 'pendientes', label: 'Temas Pendientes', icon: ClipboardList },
    { id: 'usuarios', label: 'Usuarios', icon: User },
    { id: 'aprobaciones', label: 'Aprobaciones', icon: ThumbsUp },
    { id: 'premios', label: 'Premios', icon: Award },
    { id: 'pagos', label: 'Pagos', icon: CreditCard },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white shadow-lg flex flex-col h-full">
      <div className="p-4 flex-1">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Button 
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {item.label}
            </Button>
          ))}
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
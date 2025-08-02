
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { User, FileText, Store, Star, Home, Settings, Bell, CreditCard, ThumbsUp, Award, LogOut } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { authService } from "@/services/AuthService";

interface SidebarParticularProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function SidebarParticular({ activeTab, setActiveTab }: SidebarParticularProps) {
  const { t } = useLanguage();
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
  
  const navItems = [
    { id: "perfil", label: "myProfile", icon: User },
    { id: "presupuesto", label: "requestQuote", icon: FileText },
    { id: "proveedores", label: "serviceProviders", icon: Store },
    { id: "favoritos", label: "myFavorites", icon: Star },
    { id: "propiedades", label: "myProperties", icon: Home },
    { id: "notificaciones", label: "notifications", icon: Bell },
    { id: "configuracion", label: "configuration", icon: Settings },
    { id: "pagos", label: "myPayments", icon: CreditCard },
    { id: "recomendaciones", label: "recommendations", icon: ThumbsUp },
    { id: "premios", label: "myAwards", icon: Award },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white shadow-lg flex flex-col h-full">
      <div className="p-4 flex-1">
        <h2 className="text-2xl font-bold mb-6">{t("dashboard")}</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Button 
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {t(item.label)}
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
          {t("signOut")}
        </Button>
      </div>
    </div>
  );
}

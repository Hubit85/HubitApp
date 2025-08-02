import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { 
  User, 
  FileText, 
  Store, 
  Star, 
  Home, 
  Settings, 
  Bell, 
  MessageSquare,
  Calendar,
  CreditCard,
  ThumbsUp,
  Award,
  LogOut,
  Video,
  AlertTriangle,
  FileCheck
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { authService } from "@/services/AuthService";

interface SidebarCommunityMemberProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function SidebarCommunityMember({ activeTab, setActiveTab }: SidebarCommunityMemberProps) {
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
    { id: "mis-propiedades", label: "myProperties", icon: Home },
    { id: "servicios", label: "availableServices", icon: Store },
    { id: "chat", label: "communityChat", icon: MessageSquare },
    { id: "videoconferencia", label: "scheduleVideoConference", icon: Video },
    { id: "incidencias", label: "informIssue", icon: AlertTriangle },
    { id: "contratos", label: "communityContracts", icon: FileCheck },
    { id: "presupuesto", label: "communityBudget", icon: FileText },
    { id: "administrador", label: "contactAdministrator", icon: Bell },
    { id: "historial", label: "serviceHistory", icon: Calendar },
    { id: "recomendaciones", label: "recommendations", icon: ThumbsUp },
    { id: "valoraciones", label: "serviceRatings", icon: Star },
    { id: "configuracion", label: "configuration", icon: Settings },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white shadow-lg flex flex-col h-full">
      <div className="p-4 flex-1">
        <h2 className="text-2xl font-bold mb-6">{t("communityMemberDashboard")}</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Button 
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"} 
              className="w-full justify-start text-sm"
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {t(item.label)}
            </Button>
          ))}
        </nav>
      </div>
      
      {/* Sign Out Button at Bottom */}
      <div className="p-4 border-t border-gray-700">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-200 text-sm"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t("signOut")}
        </Button>
      </div>
    </div>
  );
}

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { 
  User, 
  FileText, 
  Store, 
  Star, 
  Settings, 
  Bell,
  Calendar,
  TrendingUp,
  Briefcase,
  Award,
  LogOut,
  History,
  DollarSign,
  Clock
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { authService } from "@/services/AuthService";

interface SidebarServiceProviderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function SidebarServiceProvider({ activeTab, setActiveTab }: SidebarServiceProviderProps) {
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
  
  const menuItems = [
    { id: "overview", label: t("overview"), icon: TrendingUp },
    { id: "profile", label: t("myProfile"), icon: User },
    { id: "services", label: t("professionalServices"), icon: Briefcase },
    { id: "requests", label: t("serviceRequests"), icon: FileText },
    { id: "bids", label: t("activeBids"), icon: DollarSign },
    { id: "historial", label: t("serviceHistory"), icon: Calendar },
    { id: "reviews", label: t("reviews"), icon: Star },
    { id: "earnings", label: t("earnings"), icon: DollarSign },
    { id: "schedule", label: t("schedule"), icon: Clock },
    { id: "notifications", label: t("notifications"), icon: Bell },
    { id: "settings", label: t("settings"), icon: Settings }
  ];

  return (
    <div className="w-64 bg-gray-800 text-white shadow-lg flex flex-col h-full">
      <div className="p-4 flex-1">
        <h2 className="text-2xl font-bold mb-6">{t("serviceProvider")}</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
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
          {t("signOut")}
        </Button>
      </div>
    </div>
  );
}

import React from "react";
import { Button } from "@/components/ui/button";
import { User, FileText, Store, Star, Home, Settings, Bell, CreditCard, ThumbsUp, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SidebarParticularProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function SidebarParticular({ activeTab, setActiveTab }: SidebarParticularProps) {
  const { t } = useLanguage();
  
  return (
    <div className="w-64 bg-gray-800 text-white shadow-lg">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-6">{t("dashboard")}</h2>
        <nav className="space-y-2">
          <Button 
            variant={activeTab === "perfil" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("perfil")}
          >
            <User className="mr-2 h-5 w-5" />
            {t("myProfile")}
          </Button>
          <Button 
            variant={activeTab === "presupuesto" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("presupuesto")}
          >
            <FileText className="mr-2 h-5 w-5" />
            {t("requestQuote")}
          </Button>
          <Button 
            variant={activeTab === "proveedores" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("proveedores")}
          >
            <Store className="mr-2 h-5 w-5" />
            {t("serviceProviders")}
          </Button>
          <Button 
            variant={activeTab === "favoritos" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("favoritos")}
          >
            <Star className="mr-2 h-5 w-5" />
            {t("myFavorites")}
          </Button>
          <Button 
            variant={activeTab === "propiedades" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("propiedades")}
          >
            <Home className="mr-2 h-5 w-5" />
            {t("myProperties")}
          </Button>
          <Button 
            variant={activeTab === "notificaciones" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("notificaciones")}
          >
            <Bell className="mr-2 h-5 w-5" />
            {t("notifications")}
          </Button>
          <Button 
            variant={activeTab === "configuracion" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("configuracion")}
          >
            <Settings className="mr-2 h-5 w-5" />
            {t("configuration")}
          </Button>
          <Button 
            variant={activeTab === "pagos" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("pagos")}
          >
            <CreditCard className="mr-2 h-5 w-5" />
            {t("myPayments") || "Mis Pagos"}
          </Button>
          <Button 
            variant={activeTab === "recomendaciones" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("recomendaciones")}
          >
            <ThumbsUp className="mr-2 h-5 w-5" />
            {t("recommendations") || "Recomendaciones"}
          </Button>
          <Button 
            variant={activeTab === "premios" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("premios")}
          >
            <Award className="mr-2 h-5 w-5" />
            {t("myAwards") || "Mis Premios"}
          </Button>
        </nav>
      </div>
    </div>
  );
}

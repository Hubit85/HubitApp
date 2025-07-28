import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, User, Droplet, Zap, Paintbrush, Grid, Home, Thermometer, Hammer, Key, Wrench, Trees, Truck, Wifi, LogOut } from 'lucide-react';
import { authService } from "@/services/AuthService";

interface RepairCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
}

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

  const repairCategories: RepairCategory[] = [
    { id: 'plumbing', name: t('plumbing'), icon: <Droplet className='h-5 w-5' /> },
    { id: 'electrical', name: t('electrical'), icon: <Zap className='h-5 w-5' /> },
    { id: 'painting', name: t('painting'), icon: <Paintbrush className='h-5 w-5' /> },
    { id: 'flooring', name: t('flooring'), icon: <Grid className='h-5 w-5' /> },
    { id: 'roofing', name: t('roofing'), icon: <Home className='h-5 w-5' /> },
    { id: 'hvac', name: t('hvac'), icon: <Thermometer className='h-5 w-5' /> },
    { id: 'carpentry', name: t('carpentry'), icon: <Hammer className='h-5 w-5' /> },
    { id: 'locksmith', name: t('locksmith'), icon: <Key className='h-5 w-5' /> },
    { id: 'appliance', name: t('applianceRepair'), icon: <Wrench className='h-5 w-5' /> },
    { id: 'landscaping', name: t('landscaping'), icon: <Trees className='h-5 w-5' /> },
    { id: 'moving', name: t('movingServices'), icon: <Truck className='h-5 w-5' /> },
    { id: 'networking', name: t('homeNetworking'), icon: <Wifi className='h-5 w-5' /> },
  ];

  const sidebarItems: { id: string; label: string; icon: React.ElementType | React.ReactNode }[] = [
    { id: "overview", label: t("overview"), icon: MapPin },
    { id: "perfil", label: t("myProfile"), icon: User },
    ...repairCategories.map(c => ({ id: c.id, label: c.name, icon: c.icon }))
  ];

  return (
    <div className="w-64 bg-gray-800 text-white shadow-lg overflow-y-auto flex flex-col h-full">
      <div className="p-4 flex-1">
        <h2 className="text-2xl font-bold mb-6">{t("dashboard")}</h2>
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'default' : 'ghost'}
                className="w-full justify-start text-white hover:bg-gray-700"
                onClick={() => setActiveTab(item.id)}
              >
                <span className="mr-2">
                  {typeof Icon === 'function' ? <Icon className="h-5 w-5" /> : Icon}
                </span>
                {item.label}
              </Button>
            );
          })}
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

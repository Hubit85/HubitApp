
import React from "react";
import {
  User,
  MessageSquare,
  Video,
  AlertTriangle,
  FileCheck,
  Bell,
  Calendar,
  ThumbsUp,
  Star,
  Settings,
  Store,
  Mail,
  Home
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "../ui/button";

interface SidebarCommunityMemberProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function SidebarCommunityMember({ activeTab, setActiveTab }: SidebarCommunityMemberProps) {
    const { t } = useLanguage();

    // IMPORTANTE: Los miembros de comunidad NO pueden solicitar presupuestos directamente
    // Solo pueden reportar incidencias al administrador de fincas
    const navItems = [
        { id: "perfil", label: t("myProfile"), icon: User },
        { id: "mis-propiedades", label: t("myProperties"), icon: Home },
        { id: "servicios", label: t("availableServices"), icon: Store },
        { id: "chat", label: t("communityChat"), icon: MessageSquare },
        { id: "videoconferencia", label: t("scheduleVideoConference"), icon: Video },
        { id: "incidencias", label: t("informIssue"), icon: AlertTriangle }, // ESTA es la funcionalidad principal
        { id: "contratos", label: t("communityContracts"), icon: FileCheck },
        // ELIMINADO: "solicitar presupuesto" - Los miembros NO pueden solicitar presupuestos directamente
        { id: "administrador", label: t("contactAdministrator"), icon: Mail },
        { id: "historial", label: t("serviceHistory"), icon: Calendar },
        { id: "recomendaciones", label: t("recommendations"), icon: ThumbsUp },
        { id: "valoraciones", label: t("serviceRatings"), icon: Star },
        { id: "configuracion", label: t("configuration"), icon: Settings },
    ];

    return (
        <div className="w-64 bg-gray-50 p-4 border-r border-gray-200 overflow-y-auto">
            <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                    <Button
                        key={item.id}
                        variant={activeTab === item.id ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab(item.id)}
                    >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                    </Button>
                ))}
            </nav>
        </div>
    );
}

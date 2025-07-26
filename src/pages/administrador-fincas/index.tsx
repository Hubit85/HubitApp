import React, { useState } from "react";
import Head from "next/head";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  MapPin, 
  Calendar as CalendarIcon, 
  ClipboardList, 
  Building, 
  Wrench,
  Video,
  FileText,
  Calculator,
  AlertTriangle,
  ShoppingBag,
  User,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Edit,
  Trash2
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useRouter } from "next/router";
import ZoomableSection from "@/components/ZoomableSection";

// Coordenadas de Vizcaya, España
const center = {
  lat: 43.2603,
  lng: -2.9334
};

// Coordenadas de Urbide 25, Mungia
const urbideMungia = {
  lat: 43.3553,
  lng: -2.8469
};

// Comunidades ficticias en Bilbao
const comunidades = [
  { id: 1, nombre: "Comunidad Abando", direccion: "Calle Ercilla 24, Bilbao", lat: 43.2610, lng: -2.9350 },
  { id: 2, nombre: "Comunidad Indautxu", direccion: "Alameda Urquijo 58, Bilbao", lat: 43.2630, lng: -2.9410 },
  { id: 3, nombre: "Comunidad Deusto", direccion: "Avenida Lehendakari Aguirre 33, Bilbao", lat: 43.2710, lng: -2.9390 },
  { id: 4, nombre: "Comunidad Santutxu", direccion: "Calle Santutxu 74, Bilbao", lat: 43.2580, lng: -2.9220 },
  { id: 5, nombre: "Comunidad Basurto", direccion: "Calle Autonomía 12, Bilbao", lat: 43.2550, lng: -2.9450 },
  { id: 6, nombre: "Comunidad Casco Viejo", direccion: "Calle Correo 8, Bilbao", lat: 43.2590, lng: -2.9240 },
  { id: 7, nombre: "Comunidad Rekalde", direccion: "Avenida Rekalde 61, Bilbao", lat: 43.2520, lng: -2.9380 },
  { id: 8, nombre: "Comunidad Miribilla", direccion: "Calle Miribilla 12, Bilbao", lat: 43.2540, lng: -2.9280 },
  { id: 9, nombre: "Comunidad Zorroza", direccion: "Carretera Zorroza-Castrejana 42, Bilbao", lat: 43.2720, lng: -2.9620 },
  { id: 10, nombre: "Urbide 25", direccion: "Urbide Kalea 25, Mungia", lat: 43.3553, lng: -2.8469 }
];

// Juntas de comunidades ficticias
const juntas = [
  { id: 1, comunidad: "Comunidad Abando", fecha: new Date(2025, 4, 15), hora: "19:00", asunto: "Junta Ordinaria Anual" },
  { id: 2, comunidad: "Comunidad Indautxu", fecha: new Date(2025, 4, 22), hora: "18:30", asunto: "Renovación Junta Directiva" },
  { id: 3, comunidad: "Comunidad Deusto", fecha: new Date(2025, 5, 5), hora: "20:00", asunto: "Obras Fachada" },
  { id: 4, comunidad: "Urbide 25", fecha: new Date(2025, 5, 12), hora: "19:30", asunto: "Presupuesto Anual" },
  { id: 5, comunidad: "Comunidad Santutxu", fecha: new Date(2025, 6, 3), hora: "18:00", asunto: "Instalación Ascensor" },
  { id: 6, comunidad: "Comunidad Basurto", fecha: new Date(2025, 6, 18), hora: "19:00", asunto: "Renovación Contrato Limpieza" }
];

// Temas pendientes ficticios
const temasPendientes = [
  { id: 1, comunidad: "Comunidad Abando", tipo: "Derrama", descripcion: "Derrama extraordinaria para reparación de tejado", importe: "5.000€", fecha: "15/05/2025" },
  { id: 2, comunidad: "Comunidad Indautxu", tipo: "Deuda", descripcion: "Deuda pendiente del 3ºB - 3 meses", importe: "450€", fecha: "Acumulada" },
  { id: 3, comunidad: "Comunidad Deusto", tipo: "Alzamiento", descripcion: "Alzamiento vivienda 5ºA por impago", estado: "En proceso", fecha: "10/06/2025" },
  { id: 4, comunidad: "Urbide 25", tipo: "Obra", descripcion: "Pendiente aprobación presupuesto pintura", importe: "12.500€", fecha: "Pendiente" },
  { id: 5, comunidad: "Comunidad Santutxu", tipo: "Inspección", descripcion: "Inspección técnica del edificio", estado: "Programada", fecha: "22/05/2025" },
  { id: 6, comunidad: "Comunidad Basurto", tipo: "Deuda", descripcion: "Deuda pendiente del 1ºC - 5 meses", importe: "750€", fecha: "Acumulada" },
  { id: 7, comunidad: "Comunidad Casco Viejo", tipo: "Avería", descripcion: "Reparación urgente de tuberías comunitarias", importe: "2.300€", fecha: "Inmediata" },
  { id: 8, comunidad: "Comunidad Rekalde", tipo: "Derrama", descripcion: "Derrama para instalación de placas solares", importe: "15.000€", fecha: "01/07/2025" }
];

// Sample incidents data
const incidentsData = [
  { id: 1, comunidad: "Comunidad Abando", titulo: "Fuga de agua en el garaje", descripcion: "Fuga importante en tubería principal del garaje", prioridad: "high", estado: "inProgress", reportadoPor: "María García", fechaCreacion: "2025-01-15", ultimaActualizacion: "2025-01-20" },
  { id: 2, comunidad: "Comunidad Indautxu", titulo: "Ascensor averiado", descripcion: "El ascensor principal no funciona desde ayer", prioridad: "urgent", estado: "open", reportadoPor: "Carlos López", fechaCreacion: "2025-01-18", ultimaActualizacion: "2025-01-18" },
  { id: 3, comunidad: "Comunidad Deusto", titulo: "Ruidos molestos", descripcion: "Ruidos constantes en el piso 3º B durante la noche", prioridad: "medium", estado: "resolved", reportadoPor: "Ana Martín", fechaCreacion: "2025-01-10", ultimaActualizacion: "2025-01-22" },
  { id: 4, comunidad: "Urbide 25", titulo: "Problema con la calefacción", descripcion: "La calefacción central no funciona correctamente", prioridad: "high", estado: "inProgress", reportadoPor: "Pedro Sánchez", fechaCreacion: "2025-01-12", ultimaActualizacion: "2025-01-19" },
  { id: 5, comunidad: "Comunidad Santutxu", titulo: "Goteras en el tejado", descripcion: "Goteras en varias viviendas del último piso", prioridad: "urgent", estado: "open", reportadoPor: "Laura Fernández", fechaCreacion: "2025-01-20", ultimaActualizacion: "2025-01-20" }
];

// Sample bids data
const bidsData = [
  { id: 1, comunidad: "Comunidad Abando", titulo: "Renovación de fachada", descripcion: "Renovación completa de la fachada principal", monto: 25000, estado: "pending", licitador: "Construcciones García S.L.", fechaCreacion: "2025-01-10", ultimaActualizacion: "2025-01-15" },
  { id: 2, comunidad: "Comunidad Indautxu", titulo: "Instalación de ascensor", descripcion: "Instalación de nuevo ascensor en el edificio", monto: 45000, estado: "accepted", licitador: "Ascensores Modernos S.A.", fechaCreacion: "2025-01-05", ultimaActualizacion: "2025-01-18" },
  { id: 3, comunidad: "Comunidad Deusto", titulo: "Reforma del jardín", descripcion: "Reforma completa del jardín comunitario", monto: 8500, estado: "rejected", licitador: "Jardines Verdes S.L.", fechaCreacion: "2025-01-12", ultimaActualizacion: "2025-01-20" },
  { id: 4, comunidad: "Urbide 25", titulo: "Pintura interior", descripcion: "Pintura de zonas comunes interiores", monto: 3200, estado: "pending", licitador: "Pinturas Profesionales", fechaCreacion: "2025-01-16", ultimaActualizacion: "2025-01-16" },
  { id: 5, comunidad: "Comunidad Santutxu", titulo: "Reparación de tejado", descripcion: "Reparación urgente de goteras en el tejado", monto: 12000, estado: "accepted", licitador: "Cubiertas del Norte S.L.", fechaCreacion: "2025-01-08", ultimaActualizacion: "2025-01-22" }
];

// Sample contracts data
const contractsData = [
  { id: 1, comunidad: "Comunidad Abando", titulo: "Contrato de Limpieza", tipo: "Servicio", valor: 1200, estado: "active", contratista: "Limpiezas Profesionales S.L.", fechaVencimiento: "2025-12-31", fechaRenovacion: "2025-11-01" },
  { id: 2, comunidad: "Comunidad Indautxu", titulo: "Seguro de Responsabilidad Civil", tipo: "Seguro", valor: 2500, estado: "active", contratista: "Seguros Generales S.A.", fechaVencimiento: "2025-06-30", fechaRenovacion: "2025-05-01" },
  { id: 3, comunidad: "Comunidad Deusto", titulo: "Mantenimiento de Ascensores", tipo: "Mantenimiento", valor: 800, estado: "expired", contratista: "Ascensores Técnicos S.L.", fechaVencimiento: "2025-01-15", fechaRenovacion: "2024-12-01" },
  { id: 4, comunidad: "Urbide 25", titulo: "Jardinería", tipo: "Servicio", valor: 600, estado: "active", contratista: "Jardines Urbanos S.L.", fechaVencimiento: "2025-09-30", fechaRenovacion: "2025-08-01" },
  { id: 5, comunidad: "Comunidad Santutxu", titulo: "Mantenimiento de Calefacción", tipo: "Mantenimiento", valor: 1500, estado: "pending", contratista: "Calefacciones Norte S.A.", fechaVencimiento: "2025-03-31", fechaRenovacion: "2025-02-01" }
];

export default function AdministradorFincas() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("controlPanel");
  const [selectedCommunity, setSelectedCommunity] = useState<number | null>(null);

  const handleMarkerClick = (id: number) => {
    setSelectedMarker(id);
  };

  const closeInfoWindow = () => {
    setSelectedMarker(null);
  };

  const handleServicesDashboardClick = () => {
    router.push("/service-provider/dashboard");
  };

  const filteredJuntas = juntas.filter(junta => {
    if (!date) return false;
    return junta.fecha.getMonth() === date.getMonth() && 
           junta.fecha.getFullYear() === date.getFullYear();
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">{t("urgent")}</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">{t("high")}</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">{t("medium")}</Badge>;
      case 'low':
        return <Badge variant="secondary">{t("low")}</Badge>;
      default:
        return <Badge variant="outline">{t("normal")}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">{t("pending")}</Badge>;
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800">{t("accepted")}</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">{t("rejected")}</Badge>;
      case 'open':
        return <Badge className="bg-blue-100 text-blue-800">{t("open")}</Badge>;
      case 'inProgress':
        return <Badge className="bg-purple-100 text-purple-800">{t("inProgress")}</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">{t("resolved")}</Badge>;
      case 'closed':
        return <Badge className="bg-gray-100 text-gray-800">{t("closed")}</Badge>;
      case 'active':
        return <Badge className="bg-green-100 text-green-800">{t("active")}</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">{t("expired")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <Head>
        <title>{t("estateAdministrator")} - {t("dashboard")}</title>
        <meta name="description" content={t("dashboardDesc")} />
      </Head>

      <Header />

      <div className="flex h-screen bg-gray-100 pt-16">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-white shadow-lg">
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-6">{t("dashboard")}</h2>
            <nav className="space-y-2">
              <Button 
                variant={activeTab === "controlPanel" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("controlPanel")}
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                {t("controlPanel")}
              </Button>
              <Button 
                variant={activeTab === "videoconference" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("videoconference")}
              >
                <Video className="mr-2 h-5 w-5" />
                {t("scheduleVideoConference")}
              </Button>
              <Button 
                variant={activeTab === "mapa" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("mapa")}
              >
                <MapPin className="mr-2 h-5 w-5" />
                {t("map")}
              </Button>
              <Button 
                variant={activeTab === "comunidades" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("comunidades")}
              >
                <Building className="mr-2 h-5 w-5" />
                {t("communities")}
              </Button>
              <Button 
                variant={activeTab === "servicios" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => handleServicesDashboardClick()}
              >
                <Wrench className="mr-2 h-5 w-5" />
                {t("currentServices")}
              </Button>
              <Button 
                variant={activeTab === "juntas" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("juntas")}
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                {t("meetings")}
              </Button>
              <Button 
                variant={activeTab === "pendientes" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("pendientes")}
              >
                <ClipboardList className="mr-2 h-5 w-5" />
                {t("pendingIssues")}
              </Button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <ZoomableSection className="h-full overflow-auto" enableZoom={true} maxScale={3} minScale={0.5}>
            <div className="p-6 min-h-full">
              <h1 className="text-3xl font-bold mb-6">
                {activeTab === "controlPanel" ? t("controlPanel") :
                 activeTab === "videoconference" ? t("scheduleVideoConference") :
                 activeTab === "mapa" ? t("map") :
                 activeTab === "comunidades" ? t("communities") :
                 activeTab === "servicios" ? t("currentServices") :
                 activeTab === "juntas" ? t("meetings") :
                 activeTab === "pendientes" ? t("pendingIssues") :
                 t("estateAdministrator")}
              </h1>

              {/* Panel de Control */}
              {activeTab === "controlPanel" && (
                <div className="space-y-6">
                  {/* Statistics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("managedCommunities")}</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">10</div>
                        <p className="text-xs text-muted-foreground">+2 {t("thisMonth")}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("totalIncidents")}</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">23</div>
                        <p className="text-xs text-muted-foreground">-5 {t("vsLastWeek")}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("totalBids")}</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">+3 {t("thisMonth")}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("pendingPayments")}</CardTitle>
                        <Calculator className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">€8,450</div>
                        <p className="text-xs text-muted-foreground">-€1,200 {t("vsLastWeek")}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>{t("recentIncidents")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {incidentsData.slice(0, 3).map((incident) => (
                            <div key={incident.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                <h4 className="font-medium">{incident.titulo}</h4>
                                <p className="text-sm text-gray-500">{incident.comunidad}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  {getPriorityBadge(incident.prioridad)}
                                  {getStatusBadge(incident.estado)}
                                </div>
                              </div>
                              <Button variant="outline" size="sm">{t("view")}</Button>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4">
                          <Button variant="outline" className="w-full">{t("viewAllIncidents")}</Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>{t("recentBids")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {bidsData.slice(0, 3).map((bid) => (
                            <div key={bid.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                <h4 className="font-medium">{bid.titulo}</h4>
                                <p className="text-sm text-gray-500">{bid.comunidad}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-sm font-medium text-green-600">€{bid.monto.toLocaleString()}</span>
                                  {getStatusBadge(bid.estado)}
                                </div>
                              </div>
                              <Button variant="outline" size="sm">{t("view")}</Button>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4">
                          <Button variant="outline" className="w-full">{t("viewAllBids")}</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Video Conference Tab */}
              {activeTab === "videoconference" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Card>
                        <CardHeader>
                          <CardTitle>{t("scheduleNewMeeting")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <form className="space-y-4">
                            <div>
                              <Label htmlFor="meeting-title">{t("meetingTitle")}</Label>
                              <Input id="meeting-title" placeholder={t("enterMeetingTitle")} />
                            </div>
                            <div>
                              <Label htmlFor="meeting-community">{t("community")}</Label>
                              <select id="meeting-community" className="w-full p-2 border rounded-md">
                                <option value="">{t("pleaseSelect")}</option>
                                {comunidades.map((comunidad) => (
                                  <option key={comunidad.id} value={comunidad.id}>{comunidad.nombre}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <Label htmlFor="meeting-date">{t("date")}</Label>
                              <Input id="meeting-date" type="date" />
                            </div>
                            <div>
                              <Label htmlFor="meeting-time">{t("time")}</Label>
                              <Input id="meeting-time" type="time" />
                            </div>
                            <div>
                              <Label htmlFor="meeting-participants">{t("participants")}</Label>
                              <Input id="meeting-participants" placeholder={t("enterParticipantsEmails")} />
                            </div>
                            <div>
                              <Label htmlFor="meeting-agenda">{t("agenda")}</Label>
                              <Textarea id="meeting-agenda" placeholder={t("enterMeetingAgenda")} />
                            </div>
                            <Button className="w-full">{t("scheduleMeeting")}</Button>
                          </form>
                        </CardContent>
                      </Card>
                    </div>
                    <div>
                      <Card>
                        <CardHeader>
                          <CardTitle>{t("upcomingMeetings")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-bold">{t("communityBudgetDiscussion")}</h3>
                                  <p className="text-sm text-gray-500">Comunidad Abando</p>
                                  <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                    <span>May 15, 2025 - 18:00</span>
                                  </div>
                                </div>
                                <Badge>{t("scheduled")}</Badge>
                              </div>
                              <div className="mt-2">
                                <Button variant="outline" size="sm" className="mr-2">{t("edit")}</Button>
                                <Button size="sm">{t("joinMeeting")}</Button>
                              </div>
                            </div>
                            <div className="border rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-bold">{t("maintenanceCoordinationMeeting")}</h3>
                                  <p className="text-sm text-gray-500">Comunidad Indautxu</p>
                                  <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                    <span>May 20, 2025 - 19:30</span>
                                  </div>
                                </div>
                                <Badge>{t("scheduled")}</Badge>
                              </div>
                              <div className="mt-2">
                                <Button variant="outline" size="sm" className="mr-2">{t("edit")}</Button>
                                <Button size="sm">{t("joinMeeting")}</Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )}

              {/* Mapa */}
              {activeTab === "mapa" && (
                <div className='bg-white rounded-lg shadow-md overflow-hidden'>
                  <div className='p-6'>
                    <h2 className='text-xl font-semibold mb-4'>{t("communityMap")}</h2>
                    <div className='h-[600px] w-full rounded-lg overflow-hidden'>
                      <iframe 
                        src='https://www.openstreetmap.org/export/embed.html?bbox=-3.0334,43.1603,-2.8334,43.3603&layer=mapnik&marker=43.3553,-2.8469' 
                        width='100%' 
                        height='100%' 
                        frameBorder='0' 
                        style={{ border: 0 }} 
                        allowFullScreen 
                        aria-hidden='false' 
                        tabIndex={0}
                      ></iframe>
                    </div>
                    <div className='mt-4'>
                      <h3 className='text-lg font-semibold mb-2'>{t("communitiesOnMap")}</h3>
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {comunidades.map((comunidad) => (
                          <Card key={comunidad.id} className='hover:bg-gray-50 transition-colors'>
                            <CardContent className='p-4'>
                              <div>
                                <h3 className='font-bold text-lg'>{comunidad.nombre}</h3>
                                <p className='text-gray-600'>{comunidad.direccion}</p>
                                <p className='text-sm text-gray-500 mt-2'>
                                  {t("coordinates")}: {comunidad.lat.toFixed(4)}, {comunidad.lng.toFixed(4)}
                                </p>
                              </div>
                              <Button variant='outline' size='sm' className='mt-2'>
                                {t("viewOnMap")}
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Comunidades */}
              {activeTab === "comunidades" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-4">{t("managedCommunities")}</h2>
                  <div className="grid gap-4">
                    {comunidades.map((comunidad) => (
                      <Card key={comunidad.id} className="hover:bg-gray-50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg">{comunidad.nombre}</h3>
                              <p className="text-gray-600">{comunidad.direccion}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedCommunity(selectedCommunity === comunidad.id ? null : comunidad.id)}
                              >
                                {selectedCommunity === comunidad.id ? t("close") : t("viewDetails")}
                              </Button>
                            </div>
                          </div>
                          
                          {selectedCommunity === comunidad.id && (
                            <div className="mt-4 pt-4 border-t">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Card className="bg-blue-50">
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <h4 className="font-medium text-blue-800">{t("communityContracts")}</h4>
                                        <p className="text-2xl font-bold text-blue-700">
                                          {contractsData.filter(c => c.comunidad === comunidad.nombre).length}
                                        </p>
                                      </div>
                                      <FileText className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <div className="mt-2">
                                      <Button variant="outline" size="sm" className="w-full">
                                        {t("view")}
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card className="bg-green-50">
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <h4 className="font-medium text-green-800">{t("communityBudget")}</h4>
                                        <p className="text-2xl font-bold text-green-700">€45,000</p>
                                      </div>
                                      <Calculator className="h-8 w-8 text-green-600" />
                                    </div>
                                    <div className="mt-2">
                                      <Button variant="outline" size="sm" className="w-full">
                                        {t("view")}
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card className="bg-orange-50">
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <h4 className="font-medium text-orange-800">{t("communityIncidents")}</h4>
                                        <p className="text-2xl font-bold text-orange-700">
                                          {incidentsData.filter(i => i.comunidad === comunidad.nombre).length}
                                        </p>
                                      </div>
                                      <AlertTriangle className="h-8 w-8 text-orange-600" />
                                    </div>
                                    <div className="mt-2">
                                      <Button variant="outline" size="sm" className="w-full">
                                        {t("view")}
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card className="bg-purple-50">
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <h4 className="font-medium text-purple-800">{t("communityBids")}</h4>
                                        <p className="text-2xl font-bold text-purple-700">
                                          {bidsData.filter(b => b.comunidad === comunidad.nombre).length}
                                        </p>
                                      </div>
                                      <ShoppingBag className="h-8 w-8 text-purple-600" />
                                    </div>
                                    <div className="mt-2">
                                      <Button variant="outline" size="sm" className="w-full">
                                        {t("view")}
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              {/* Detailed sections for selected community */}
                              <div className="mt-6 space-y-6">
                                {/* Contracts Section */}
                                <div>
                                  <h4 className="text-lg font-semibold mb-3">{t("communityContracts")}</h4>
                                  <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                      <thead className="bg-gray-50">
                                        <tr>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t("title")}</th>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t("contractType")}</th>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t("contractValue")}</th>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t("contractStatus")}</th>
                                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t("actions")}</th>
                                        </tr>
                                      </thead>
                                      <tbody className="bg-white divide-y divide-gray-200">
                                        {contractsData.filter(c => c.comunidad === comunidad.nombre).map((contract) => (
                                          <tr key={contract.id}>
                                            <td className="px-4 py-2 text-sm">{contract.titulo}</td>
                                            <td className="px-4 py-2 text-sm">{contract.tipo}</td>
                                            <td className="px-4 py-2 text-sm">€{contract.valor}</td>
                                            <td className="px-4 py-2 text-sm">{getStatusBadge(contract.estado)}</td>
                                            <td className="px-4 py-2 text-sm">
                                              <div className="flex gap-1">
                                                <Button variant="outline" size="sm"><Eye className="h-3 w-3" /></Button>
                                                <Button variant="outline" size="sm"><Download className="h-3 w-3" /></Button>
                                              </div>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                {/* Incidents Section */}
                                <div>
                                  <h4 className="text-lg font-semibold mb-3">{t("communityIncidents")}</h4>
                                  <div className="space-y-3">
                                    {incidentsData.filter(i => i.comunidad === comunidad.nombre).map((incident) => (
                                      <Card key={incident.id}>
                                        <CardContent className="p-4">
                                          <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                              <h5 className="font-medium">{incident.titulo}</h5>
                                              <p className="text-sm text-gray-600 mt-1">{incident.descripcion}</p>
                                              <div className="flex items-center gap-2 mt-2">
                                                {getPriorityBadge(incident.prioridad)}
                                                {getStatusBadge(incident.estado)}
                                              </div>
                                              <p className="text-xs text-gray-500 mt-1">
                                                {t("reportedBy")}: {incident.reportadoPor} | {t("createdDate")}: {incident.fechaCreacion}
                                              </p>
                                            </div>
                                            <div className="flex gap-1">
                                              <Button variant="outline" size="sm"><Eye className="h-3 w-3" /></Button>
                                              <Button variant="outline" size="sm"><Edit className="h-3 w-3" /></Button>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                </div>

                                {/* Bids Section */}
                                <div>
                                  <h4 className="text-lg font-semibold mb-3">{t("communityBids")}</h4>
                                  <div className="space-y-3">
                                    {bidsData.filter(b => b.comunidad === comunidad.nombre).map((bid) => (
                                      <Card key={bid.id}>
                                        <CardContent className="p-4">
                                          <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                              <h5 className="font-medium">{bid.titulo}</h5>
                                              <p className="text-sm text-gray-600 mt-1">{bid.descripcion}</p>
                                              <div className="flex items-center gap-2 mt-2">
                                                <span className="text-sm font-medium text-green-600">€{bid.monto.toLocaleString()}</span>
                                                {getStatusBadge(bid.estado)}
                                              </div>
                                              <p className="text-xs text-gray-500 mt-1">
                                                {t("bidder")}: {bid.licitador} | {t("createdDate")}: {bid.fechaCreacion}
                                              </p>
                                            </div>
                                            <div className="flex gap-1">
                                              <Button variant="outline" size="sm"><Eye className="h-3 w-3" /></Button>
                                              <Button variant="outline" size="sm"><Edit className="h-3 w-3" /></Button>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Servicios Actuales */}
              {activeTab === "servicios" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-4">{t("currentServices")}</h2>
                  <p className="text-gray-600 mb-4">{t("redirectingToServiceDashboard")}</p>
                  <Button onClick={handleServicesDashboardClick}>{t("goToServiceDashboard")}</Button>
                </div>
              )}

              {/* Juntas */}
              {activeTab === "juntas" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-4">{t("communityMeetings")}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="border rounded-md"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3">
                        {t("scheduledMeetings")}: {date?.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { month: 'long', year: 'numeric' })}
                      </h3>
                      {filteredJuntas.length > 0 ? (
                        <div className="space-y-3">
                          {filteredJuntas.map((junta) => (
                            <Card key={junta.id}>
                              <CardContent className="p-4">
                                <p className="font-bold">{junta.comunidad}</p>
                                <p className="text-sm text-gray-600">
                                  {junta.fecha.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US')} - {junta.hora}
                                </p>
                                <p>{junta.asunto}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">{t("noMeetingsThisMonth")}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Temas Pendientes */}
              {activeTab === "pendientes" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-4">{t("pendingIssues")}</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("community")}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("type")}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("description")}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("amountStatus")}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("date")}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("action")}</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {temasPendientes.map((tema) => (
                          <tr key={tema.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">{tema.comunidad}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                tema.tipo === "Derrama" ? "bg-blue-100 text-blue-800" :
                                tema.tipo === "Deuda" ? "bg-red-100 text-red-800" :
                                tema.tipo === "Alzamiento" ? "bg-purple-100 text-purple-800" :
                                tema.tipo === "Obra" ? "bg-yellow-100 text-yellow-800" :
                                tema.tipo === "Inspección" ? "bg-green-100 text-green-800" :
                                "bg-gray-100 text-gray-800"
                              }`}>
                                {tema.tipo}
                              </span>
                            </td>
                            <td className="px-6 py-4">{tema.descripcion}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{tema.importe || tema.estado}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{tema.fecha}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Button variant="outline" size="sm">{t("manage")}</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </ZoomableSection>
        </div>
      </div>
    </>
  );
}

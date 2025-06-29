import React, { useState, useMemo } from "react";
import Head from "next/head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Wrench, 
  Zap, 
  Paintbrush, 
  Grid, 
  Droplet, 
  Thermometer, 
  Home, 
  Hammer, 
  Trees, 
  Truck, 
  Wifi, 
  Key, 
  Star, 
  Camera, 
  CheckCircle, 
  Clock, 
  Briefcase, 
  Building,
  User,
  MapPin
} from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/layout/Header";
import ZoomableSection from "@/components/ZoomableSection";

interface RepairCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface JobData {
  id: string;
  title: string;
  budget: number;
  priority: 'urgent' | 'normal' | 'low';
  description: string;
  category: string;
}

interface BidData {
  id: string;
  title: string;
  myBid: number;
  status: 'pending' | 'accepted' | 'rejected';
  description: string;
  category: string;
}

export default function ServiceProviderDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { t } = useLanguage();
  
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

  // Datos específicos por categoría
  const categoryData = useMemo(() => {
    const data: Record<string, { jobs: JobData[], bids: BidData[], companyName: string, email: string }> = {
      plumbing: {
        companyName: "Fontanería Express S.L.",
        email: "info@fontaneriaexpress.com",
        jobs: [
          {
            id: "1",
            title: t("bathroomPlumbingOverhaul"),
            budget: 450,
            priority: "urgent",
            description: "Necesito reparar una fuga en el baño principal y cambiar la grifería.",
            category: "plumbing"
          },
          {
            id: "2", 
            title: t("kitchenSinkInstallation"),
            budget: 280,
            priority: "normal",
            description: "Instalación de nuevo fregadero de cocina con grifería incluida.",
            category: "plumbing"
          }
        ],
        bids: [
          {
            id: "1",
            title: t("toiletRepair"),
            myBid: 175,
            status: "pending",
            description: "Reparación de cisterna y cambio de mecanismo interno.",
            category: "plumbing"
          },
          {
            id: "2",
            title: t("leakDetection"),
            myBid: 320,
            status: "accepted",
            description: "Detección y reparación de fuga en tubería principal.",
            category: "plumbing"
          }
        ]
      },
      electrical: {
        companyName: "ElectroTech Profesional S.L.",
        email: "info@electrotech.com",
        jobs: [
          {
            id: "3",
            title: "Instalación de cuadro eléctrico",
            budget: 650,
            priority: "urgent",
            description: "Renovación completa del cuadro eléctrico principal de la vivienda.",
            category: "electrical"
          },
          {
            id: "4",
            title: "Cableado para aire acondicionado",
            budget: 380,
            priority: "normal", 
            description: "Instalación de cableado específico para unidad de aire acondicionado.",
            category: "electrical"
          }
        ],
        bids: [
          {
            id: "3",
            title: "Reparación de cortocircuito",
            myBid: 220,
            status: "pending",
            description: "Localización y reparación de cortocircuito en cocina.",
            category: "electrical"
          },
          {
            id: "4",
            title: "Instalación de enchufes",
            myBid: 150,
            status: "accepted",
            description: "Instalación de 6 enchufes adicionales en salón.",
            category: "electrical"
          }
        ]
      },
      painting: {
        companyName: "Pinturas Decorativas Madrid S.L.",
        email: "info@pinturasdecoratvas.com",
        jobs: [
          {
            id: "5",
            title: "Pintura interior completa",
            budget: 1200,
            priority: "normal",
            description: "Pintura completa de piso de 80m² con preparación de paredes.",
            category: "painting"
          },
          {
            id: "6",
            title: "Pintura de fachada",
            budget: 2500,
            priority: "low",
            description: "Pintura exterior de fachada de edificio de 3 plantas.",
            category: "painting"
          }
        ],
        bids: [
          {
            id: "5",
            title: "Pintura de dormitorio",
            myBid: 350,
            status: "pending",
            description: "Pintura de dormitorio principal con papel pintado.",
            category: "painting"
          },
          {
            id: "6",
            title: "Restauración de puertas",
            myBid: 480,
            status: "accepted",
            description: "Lijado y pintura de 5 puertas de madera.",
            category: "painting"
          }
        ]
      },
      flooring: {
        companyName: "Suelos Premium Madrid S.L.",
        email: "info@suelospremium.com",
        jobs: [
          {
            id: "7",
            title: "Instalación de parquet",
            budget: 1800,
            priority: "normal",
            description: "Instalación de parquet laminado en salón y dormitorios (60m²).",
            category: "flooring"
          },
          {
            id: "8",
            title: "Cambio de baldosas baño",
            budget: 950,
            priority: "urgent",
            description: "Sustitución completa de baldosas en baño principal.",
            category: "flooring"
          }
        ],
        bids: [
          {
            id: "7",
            title: "Reparación de tarima",
            myBid: 280,
            status: "pending",
            description: "Reparación de tarima flotante dañada por humedad.",
            category: "flooring"
          },
          {
            id: "8",
            title: "Instalación de vinilo",
            myBid: 420,
            status: "accepted",
            description: "Instalación de suelo vinílico en cocina (15m²).",
            category: "flooring"
          }
        ]
      },
      roofing: {
        companyName: "Cubiertas y Tejados Madrid S.L.",
        email: "info@cubiertastejados.com",
        jobs: [
          {
            id: "9",
            title: "Reparación de goteras",
            budget: 850,
            priority: "urgent",
            description: "Reparación urgente de goteras en tejado de vivienda unifamiliar.",
            category: "roofing"
          },
          {
            id: "10",
            title: "Instalación de canalones",
            budget: 650,
            priority: "normal",
            description: "Instalación de sistema de canalones en edificio de 2 plantas.",
            category: "roofing"
          }
        ],
        bids: [
          {
            id: "9",
            title: "Impermeabilización terraza",
            myBid: 1200,
            status: "pending",
            description: "Impermeabilización completa de terraza de 40m².",
            category: "roofing"
          },
          {
            id: "10",
            title: "Cambio de tejas",
            myBid: 890,
            status: "accepted",
            description: "Sustitución de tejas dañadas en cubierta.",
            category: "roofing"
          }
        ]
      },
      hvac: {
        companyName: "Climatización Total S.L.",
        email: "info@climatizaciontotal.com",
        jobs: [
          {
            id: "11",
            title: "Instalación aire acondicionado",
            budget: 1200,
            priority: "normal",
            description: "Instalación de sistema de aire acondicionado split en 3 habitaciones.",
            category: "hvac"
          },
          {
            id: "12",
            title: "Mantenimiento caldera",
            budget: 180,
            priority: "urgent",
            description: "Revisión y mantenimiento urgente de caldera de gas.",
            category: "hvac"
          }
        ],
        bids: [
          {
            id: "11",
            title: "Reparación bomba calor",
            myBid: 450,
            status: "pending",
            description: "Reparación de bomba de calor con fuga de refrigerante.",
            category: "hvac"
          },
          {
            id: "12",
            title: "Instalación termostato",
            myBid: 120,
            status: "accepted",
            description: "Instalación de termostato programable digital.",
            category: "hvac"
          }
        ]
      },
      carpentry: {
        companyName: "Carpintería Artesanal Madrid S.L.",
        email: "info@carpinteriaartesanal.com",
        jobs: [
          {
            id: "13",
            title: "Muebles cocina a medida",
            budget: 3500,
            priority: "normal",
            description: "Diseño y fabricación de muebles de cocina a medida.",
            category: "carpentry"
          },
          {
            id: "14",
            title: "Reparación armario empotrado",
            budget: 280,
            priority: "low",
            description: "Reparación de puertas y mecanismos de armario empotrado.",
            category: "carpentry"
          }
        ],
        bids: [
          {
            id: "13",
            title: "Estanterías a medida",
            myBid: 650,
            status: "pending",
            description: "Fabricación e instalación de estanterías de madera maciza.",
            category: "carpentry"
          },
          {
            id: "14",
            title: "Restauración mesa antigua",
            myBid: 320,
            status: "accepted",
            description: "Restauración completa de mesa de comedor antigua.",
            category: "carpentry"
          }
        ]
      },
      locksmith: {
        companyName: "Cerrajería 24h Madrid S.L.",
        email: "info@cerrajeria24h.com",
        jobs: [
          {
            id: "15",
            title: "Cambio cerradura seguridad",
            budget: 180,
            priority: "urgent",
            description: "Cambio urgente de cerradura de alta seguridad en puerta principal.",
            category: "locksmith"
          },
          {
            id: "16",
            title: "Instalación cerradura digital",
            budget: 350,
            priority: "normal",
            description: "Instalación de cerradura digital con código y tarjeta.",
            category: "locksmith"
          }
        ],
        bids: [
          {
            id: "15",
            title: "Apertura puerta blindada",
            myBid: 95,
            status: "pending",
            description: "Apertura de puerta blindada sin dañar la cerradura.",
            category: "locksmith"
          },
          {
            id: "16",
            title: "Duplicado llaves especiales",
            myBid: 45,
            status: "accepted",
            description: "Duplicado de llaves de alta seguridad con chip.",
            category: "locksmith"
          }
        ]
      },
      appliance: {
        companyName: "Reparaciones Electrodomésticos S.L.",
        email: "info@reparacioneselectro.com",
        jobs: [
          {
            id: "17",
            title: "Reparación lavadora",
            budget: 120,
            priority: "urgent",
            description: "Reparación de lavadora que no centrifuga correctamente.",
            category: "appliance"
          },
          {
            id: "18",
            title: "Instalación lavavajillas",
            budget: 85,
            priority: "normal",
            description: "Instalación y conexión de lavavajillas nuevo.",
            category: "appliance"
          }
        ],
        bids: [
          {
            id: "17",
            title: "Reparación frigorífico",
            myBid: 150,
            status: "pending",
            description: "Reparación de frigorífico que no enfría correctamente.",
            category: "appliance"
          },
          {
            id: "18",
            title: "Mantenimiento horno",
            myBid: 75,
            status: "accepted",
            description: "Limpieza y mantenimiento de horno eléctrico.",
            category: "appliance"
          }
        ]
      },
      landscaping: {
        companyName: "Jardines y Paisajes Madrid S.L.",
        email: "info@jardinesypaisajes.com",
        jobs: [
          {
            id: "19",
            title: "Diseño jardín completo",
            budget: 2800,
            priority: "normal",
            description: "Diseño y creación de jardín completo con sistema de riego.",
            category: "landscaping"
          },
          {
            id: "20",
            title: "Poda árboles grandes",
            budget: 450,
            priority: "urgent",
            description: "Poda urgente de árboles de gran porte por seguridad.",
            category: "landscaping"
          }
        ],
        bids: [
          {
            id: "19",
            title: "Mantenimiento césped",
            myBid: 180,
            status: "pending",
            description: "Mantenimiento mensual de césped y plantas ornamentales.",
            category: "landscaping"
          },
          {
            id: "20",
            title: "Instalación riego automático",
            myBid: 850,
            status: "accepted",
            description: "Instalación de sistema de riego automático por aspersión.",
            category: "landscaping"
          }
        ]
      },
      moving: {
        companyName: "Mudanzas Express Madrid S.L.",
        email: "info@mudanzasexpress.com",
        jobs: [
          {
            id: "21",
            title: "Mudanza piso completo",
            budget: 650,
            priority: "normal",
            description: "Mudanza completa de piso de 3 habitaciones con embalaje.",
            category: "moving"
          },
          {
            id: "22",
            title: "Transporte muebles",
            budget: 180,
            priority: "urgent",
            description: "Transporte urgente de muebles grandes entre ciudades.",
            category: "moving"
          }
        ],
        bids: [
          {
            id: "21",
            title: "Mudanza oficina",
            myBid: 420,
            status: "pending",
            description: "Mudanza de oficina con equipos informáticos delicados.",
            category: "moving"
          },
          {
            id: "22",
            title: "Embalaje especializado",
            myBid: 150,
            status: "accepted",
            description: "Embalaje especializado para objetos frágiles y valiosos.",
            category: "moving"
          }
        ]
      },
      networking: {
        companyName: "Redes y Conectividad S.L.",
        email: "info@redesyconectividad.com",
        jobs: [
          {
            id: "23",
            title: "Instalación red WiFi empresarial",
            budget: 850,
            priority: "normal",
            description: "Instalación de red WiFi empresarial con múltiples puntos de acceso.",
            category: "networking"
          },
          {
            id: "24",
            title: "Configuración router avanzado",
            budget: 120,
            priority: "urgent",
            description: "Configuración urgente de router con VPN y firewall.",
            category: "networking"
          }
        ],
        bids: [
          {
            id: "23",
            title: "Cableado estructurado",
            myBid: 380,
            status: "pending",
            description: "Instalación de cableado estructurado Cat6 en oficina.",
            category: "networking"
          },
          {
            id: "24",
            title: "Reparación conexión fibra",
            myBid: 95,
            status: "accepted",
            description: "Reparación de conexión de fibra óptica doméstica.",
            category: "networking"
          }
        ]
      }
    };
    return data;
  }, [t]);

  // Obtener datos de la categoría activa
  const currentCategoryData = useMemo(() => {
    if (activeTab === "overview" || activeTab === "perfil") {
      return categoryData.plumbing; // Default para overview y perfil
    }
    return categoryData[activeTab] || categoryData.plumbing;
  }, [activeTab, categoryData]);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgente</Badge>;
      case 'normal':
        return <Badge variant="outline">Normal</Badge>;
      case 'low':
        return <Badge variant="secondary">Baja</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800">Aceptado</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
    }
  };

  return (
    <>
      <Head>
        <title>{t('serviceProviderDashboard')} | {t('hubit')}</title>
        <meta name='description' content={t('serviceProviderDesc')} />
      </Head>
      
      <Header />
      
      <div className='flex h-screen bg-gray-100 pt-16'>
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-white shadow-lg overflow-y-auto">
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-6">{t("dashboard")}</h2>
            <nav className="space-y-2">
              <Button
                variant={activeTab === "overview" ? 'default' : 'ghost'}
                className="w-full justify-start text-white hover:bg-gray-700"
                onClick={() => setActiveTab("overview")}
              >
                <MapPin className="mr-2 h-5 w-5" />
                {t("overview")}
              </Button>
              <Button
                variant={activeTab === "perfil" ? 'default' : 'ghost'}
                className="w-full justify-start text-white hover:bg-gray-700"
                onClick={() => setActiveTab("perfil")}
              >
                <User className="mr-2 h-5 w-5" />
                {t("myProfile")}
              </Button>
              {repairCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeTab === category.id ? 'default' : 'ghost'}
                  className="w-full justify-start text-white hover:bg-gray-700"
                  onClick={() => setActiveTab(category.id)}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <ZoomableSection className="h-full overflow-auto" enableZoom={true} maxScale={3} minScale={0.5}>
            <div className="p-6 min-h-full">
              <h1 className="text-3xl font-bold mb-6">
                {activeTab === "overview" ? t("serviceProviderDashboard") : 
                 activeTab === "perfil" ? t("myProfile") :
                 (repairCategories.find(c => c.id === activeTab)?.name || "") + " " + t("services")}
              </h1>
              
              {activeTab === "perfil" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4 relative">
                          <Building className="h-12 w-12 text-gray-500" />
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-white hover:bg-gray-100"
                          >
                            <Camera className="h-4 w-4" />
                          </Button>
                        </div>
                        <h2 className="text-xl font-bold">{currentCategoryData.companyName}</h2>
                        <p className="text-gray-500 mb-2">{t("serviceProvider")}</p>
                        <div className="flex items-center justify-center mb-4">
                          <div className="flex mr-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`h-4 w-4 ${star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">4.8 (124 {t("reviews")})</span>
                        </div>
                        <Button className="w-full mb-2">{t("editProfile")}</Button>
                        <Button variant="outline" className="w-full">{t("viewPublicProfile")}</Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle>{t("companyInformation")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><Label>{t("companyName")}</Label><p className="text-gray-600">{currentCategoryData.companyName}</p></div>
                          <div><Label>{t("taxId")}</Label><p className="text-gray-600">B-12345678</p></div>
                          <div><Label>{t("phoneLabel")}</Label><p className="text-gray-600">+34 912 345 678</p></div>
                          <div><Label>{t("emailLabel")}</Label><p className="text-gray-600">{currentCategoryData.email}</p></div>
                        </div>
                        <div className="mt-4"><Label>{t("businessAddress")}</Label><p className="text-gray-600">Calle Mayor 123, 28001 Madrid, España</p></div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
              
              {activeTab === "overview" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{t("activeBids")}</CardTitle><Briefcase className="h-4 w-4 text-muted-foreground" /></CardHeader>
                      <CardContent><div className="text-2xl font-bold">12</div><p className="text-xs text-muted-foreground">+5 {t("vsLastWeek")}</p></CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{t("completedJobs")}</CardTitle><CheckCircle className="h-4 w-4 text-muted-foreground" /></CardHeader>
                      <CardContent><div className="text-2xl font-bold">156</div><p className="text-xs text-muted-foreground">+20 {t("thisMonth")}</p></CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{t("averageRating")}</CardTitle><Star className="h-4 w-4 text-muted-foreground" /></CardHeader>
                      <CardContent><div className="text-2xl font-bold">4.8</div><p className="text-xs text-muted-foreground">{t("basedOn")} 124 {t("reviews")}</p></CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{t("responseTime")}</CardTitle><Clock className="h-4 w-4 text-muted-foreground" /></CardHeader>
                      <CardContent><div className="text-2xl font-bold">2h</div><p className="text-xs text-muted-foreground">{t("average")}</p></CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader><CardTitle>{t("recentActivity")}</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div><h4 className="font-medium">{t("newQuoteRequest")}</h4><p className="text-sm text-gray-500">{t("bathroomPlumbingOverhaul")} - €450</p></div>
                          <Button size="sm">{t("respond")}</Button>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div><h4 className="font-medium">{t("jobCompleted")}</h4><p className="text-sm text-gray-500">{t("kitchenSinkInstallation")} - €280</p></div>
                          <Badge variant="outline" className="bg-green-100 text-green-800">{t("completed")}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {repairCategories.some(c => c.id === activeTab) && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader><CardTitle>{t("availableJobs")} - {repairCategories.find(c => c.id === activeTab)?.name}</CardTitle></CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {currentCategoryData.jobs.map((job) => (
                            <div key={job.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-bold">{job.title}</h4>
                                  <p className="text-sm text-gray-500">{t("budget")}: €{job.budget}</p>
                                </div>
                                {getPriorityBadge(job.priority)}
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{job.description}</p>
                              <Button size="sm">{t("submitBid")}</Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader><CardTitle>{t("myBids")} - {repairCategories.find(c => c.id === activeTab)?.name}</CardTitle></CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {currentCategoryData.bids.map((bid) => (
                            <div key={bid.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-bold">{bid.title}</h4>
                                  <p className="text-sm text-gray-500">{t("myBid")}: €{bid.myBid}</p>
                                </div>
                                {getStatusBadge(bid.status)}
                              </div>
                              <p className="text-sm text-gray-600">{bid.description}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
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

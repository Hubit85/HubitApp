import React, { useState } from "react";
import Head from "next/head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/layout/Header";
import { SidebarCommunityMember } from "@/components/layout/SidebarCommunityMember";
import ZoomableSection from "@/components/ZoomableSection";
import ServiceHistoryCard from "@/components/ratings/ServiceHistoryCard";
import RatingModal from "@/components/ratings/RatingModal";
import Image from "next/image";
import {
  User,
  MessageSquare,
  Video,
  AlertTriangle,
  FileCheck,
  FileText,
  Bell,
  Calendar,
  ThumbsUp,
  Star,
  Settings,
  Store,
  MapPin,
  Filter,
  Search,
  Clock,
  Upload,
  File,
  X,
  Building,
  Mail,
  FileSpreadsheet,
  Phone,
  Send,
  Plus,
  Edit,
  Save,
  Camera,
  Shield,
  Euro,
  Download,
  Eye,
  Users,
  Home,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity
} from "lucide-react";

export default function CommunityMemberDashboard() {
  const [activeTab, setActiveTab] = useState("perfil");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedServiceForRating, setSelectedServiceForRating] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [selectedIssueType, setSelectedIssueType] = useState("maintenance");
  const [attachedImages, setAttachedImages] = useState<File[]>([]);
  const { t } = useLanguage();
  
  // Estados para el perfil
  const [profileData, setProfileData] = useState({
    name: "Ana García",
    email: "ana.garcia@email.com",
    phone: "+34 600 123 456",
    communityName: "Residencial Alameda",
    address: "Calle Mayor 123",
    portalNumber: "Portal 2",
    city: "Madrid",
    apartment: "3º A",
    memberSince: "Enero 2020",
    communityRole: "Presidente"
  });

  // Datos mock para el chat comunitario
  const communityMessages = [
    {
      id: 1,
      sender: "Carlos Martín",
      apartment: "2º B",
      message: "Buenos días, ¿han visto si ya han arreglado la puerta del garaje?",
      timestamp: "10:30",
      isAdmin: false
    },
    {
      id: 2,
      sender: "Administrador",
      apartment: "Admin",
      message: "Buenos días. Confirmamos que la puerta del garaje fue reparada ayer por la tarde. Ya está funcionando correctamente.",
      timestamp: "10:45",
      isAdmin: true
    },
    {
      id: 3,
      sender: "María López",
      apartment: "1º C",
      message: "Perfecto, muchas gracias. ¿Podrían también revisar la iluminación del portal?",
      timestamp: "11:00",
      isAdmin: false
    }
  ];

  // Contratos de la comunidad
  const communityContracts = [
    {
      id: "1",
      title: "Contrato de Mantenimiento de Ascensores",
      provider: "Ascensores Madrid",
      startDate: "01/01/2024",
      endDate: "31/12/2024",
      value: "€5,400/año",
      status: "active",
      description: "Mantenimiento preventivo mensual y reparaciones de emergencia"
    },
    {
      id: "2",
      title: "Servicio de Limpieza",
      provider: "Limpiezas Comunidad",
      startDate: "15/02/2024",
      endDate: "14/02/2025",
      value: "€2,800/año",
      status: "active",
      description: "Limpieza semanal de zonas comunes y portales"
    },
    {
      id: "3",
      title: "Mantenimiento de Jardines",
      provider: "Jardines Verdes",
      startDate: "01/03/2024",
      endDate: "30/11/2024",
      value: "€1,200/temporada",
      status: "pending",
      description: "Mantenimiento estacional de jardines y zonas verdes"
    }
  ];

  // Presupuesto comunitario
  const budgetData = {
    totalBudget: 45000,
    spent: 28500,
    remaining: 16500,
    categories: [
      { name: "Mantenimiento", budget: 15000, spent: 12000, percentage: 80 },
      { name: "Limpieza", budget: 8000, spent: 6500, percentage: 81 },
      { name: "Jardinería", budget: 5000, spent: 3000, percentage: 60 },
      { name: "Reparaciones", budget: 10000, spent: 4000, percentage: 40 },
      { name: "Seguros", budget: 7000, spent: 3000, percentage: 43 }
    ]
  };

  const communityServiceHistory = [
    {
      id: "1",
      serviceName: t("elevatorMaintenance"),
      providerName: "Ascensores Madrid",
      providerImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      category: "maintenance",
      date: "20 Mar 2024",
      cost: 450.00,
      status: "completed" as const,
      rating: 5,
      comment: t("excellentCommunityServiceComment"),
      location: "Edificio Central",
      duration: "4 horas"
    },
    {
      id: "2", 
      serviceName: t("gatesCleaning"),
      providerName: "Limpiezas Comunidad",
      providerImage: "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      category: "cleaning",
      date: "18 Mar 2024",
      cost: 180.00,
      status: "completed" as const,
      rating: 4,
      comment: t("goodWorkStairsComment"),
      location: "Todos los portales", 
      duration: "3 horas"
    },
    {
      id: "3",
      serviceName: t("commonAreasGardening"),
      providerName: "Jardines Verdes",
      providerImage: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      category: "gardening",
      date: "15 Mar 2024",
      cost: 320.00,
      status: "completed" as const,
      location: "Jardín comunitario",
      duration: "1 día"
    },
    {
      id: "4",
      serviceName: t("lightingRepair"),
      providerName: "Electricidad Comunal",
      providerImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      category: "electrical",
      date: "10 Mar 2024",
      cost: 280.00,
      status: "pending" as const,
      location: "Pasillos comunitarios",
      duration: "2 horas"
    }
  ];

  const topRatedCommunityProviders = [
    {
      id: "1",
      name: "Ascensores Madrid", 
      category: t("maintenance"),
      rating: 4.9,
      reviews: 89,
      totalJobs: 156,
      location: "Madrid",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      specialties: [t("preventiveMaintenance"), t("urgentRepairs"), t("modernization")],
      verified: true
    },
    {
      id: "2",
      name: "Jardines Verdes",
      category: t("gardening"), 
      rating: 4.8,
      reviews: 67,
      totalJobs: 134,
      location: "Madrid", 
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      specialties: [t("landscapeDesign"), t("maintenanceSpec"), t("irrigationSystems")],
      verified: true
    },
    {
      id: "3", 
      name: "Limpiezas Comunidad",
      category: t("cleaning"),
      rating: 4.7,
      reviews: 125,
      totalJobs: 289,
      location: "Madrid",
      image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80", 
      specialties: [t("gatesDisinfection"), "Limpieza de portales", t("maintenanceSpec")],
      verified: true
    }
  ];

  const availableServices = [
    {
      id: "1",
      name: "Mantenimiento de Ascensores",
      provider: "Ascensores Madrid",
      category: "maintenance",
      price: "€450-650",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      rating: 4.9,
      availability: "Disponible"
    },
    {
      id: "2",
      name: "Limpieza de Portales",
      provider: "Limpiezas Comunidad",
      category: "cleaning",
      price: "€180-250",
      image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      rating: 4.7,
      availability: "Disponible"
    },
    {
      id: "3",
      name: "Jardinería",
      provider: "Jardines Verdes",
      category: "gardening",
      price: "€320-420",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      rating: 4.8,
      availability: "Disponible"
    }
  ];

  const handleRateService = (serviceId: string) => {
    const service = communityServiceHistory.find(s => s.id === serviceId);
    if (service) {
      setSelectedServiceForRating(service);
      setShowRatingModal(true);
    }
  };

  const handleSubmitRating = (rating: number, comment: string, wouldRecommend: boolean) => {
    console.log("Community rating submitted:", { rating, comment, wouldRecommend });
    setShowRatingModal(false);
    setSelectedServiceForRating(null);
  };

  const filteredCommunityServiceHistory = communityServiceHistory.filter(service => {
    const statusMatch = statusFilter === "all" || service.status === statusFilter;
    const categoryMatch = categoryFilter === "all" || service.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
    console.log("Profile saved:", profileData);
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      console.log("Sending message:", chatMessage);
      setChatMessage("");
    }
  };

  const handleSubmitIssue = () => {
    if (issueDescription.trim()) {
      console.log("Issue submitted:", { type: selectedIssueType, description: issueDescription });
      setIssueDescription("");
    }
  };

  const getActiveTabTitle = () => {
    switch (activeTab) {
      case "perfil": return t("myProfile");
      case "servicios": return t("availableServices");
      case "chat": return t("communityChat");
      case "videoconferencia": return t("scheduleVideoConference");
      case "incidencias": return t("informIssue");
      case "contratos": return t("communityContracts");
      case "presupuesto": return t("communityBudget");
      case "administrador": return t("contactAdministrator");
      case "historial": return t("serviceHistory");
      case "recomendaciones": return t("recommendations");
      case "valoraciones": return t("serviceRatings");
      case "configuracion": return t("configuration");
      default: return t("communityMemberDashboard");
    }
  };

  return (
    <>
      <Head>
        <title>{t("communityMemberDashboard")} | {t("hubit")}</title>
        <meta name="description" content={t("communityMemberDesc")} />
      </Head>
      
      <Header />
      
      <div className="flex h-screen bg-gray-100 pt-16">
        <SidebarCommunityMember activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 overflow-hidden">
          <ZoomableSection className="h-full overflow-auto" enableZoom={true} maxScale={3} minScale={0.5}>
            <div className="p-6 min-h-full">
              <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-gray-200 pb-2">
                {getActiveTabTitle()}
              </h1>
              
              {activeTab === "perfil" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-10 w-10 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">{profileData.name}</h2>
                        <p className="text-gray-600">{profileData.communityRole} - {profileData.apartment}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                      className="flex items-center space-x-2"
                    >
                      {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                      <span>{isEditing ? "Guardar" : "Editar"}</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <User className="h-5 w-5" />
                          <span>Información Personal</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="name">Nombre Completo</Label>
                          {isEditing ? (
                            <Input
                              id="name"
                              value={profileData.name}
                              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                            />
                          ) : (
                            <p className="text-gray-800 font-medium">{profileData.name}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="email">Correo Electrónico</Label>
                          {isEditing ? (
                            <Input
                              id="email"
                              type="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            />
                          ) : (
                            <p className="text-gray-800 font-medium">{profileData.email}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="phone">Teléfono</Label>
                          {isEditing ? (
                            <Input
                              id="phone"
                              value={profileData.phone}
                              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            />
                          ) : (
                            <p className="text-gray-800 font-medium">{profileData.phone}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Building className="h-5 w-5" />
                          <span>Información de la Comunidad y Vivienda</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="communityName">Nombre de la Comunidad</Label>
                          {isEditing ? (
                              <Input id="communityName" value={profileData.communityName} onChange={(e) => setProfileData({ ...profileData, communityName: e.target.value })} />
                          ) : (
                              <p className="text-gray-800 font-medium">{profileData.communityName}</p>
                          )}
                        </div>
                        <div>
                            <Label htmlFor="address">Dirección</Label>
                            {isEditing ? (
                                <Input id="address" value={profileData.address} onChange={(e) => setProfileData({ ...profileData, address: e.target.value })} />
                            ) : (
                                <p className="text-gray-800 font-medium">{profileData.address}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="portalNumber">Número de Portal</Label>
                            {isEditing ? (
                                <Input id="portalNumber" value={profileData.portalNumber} onChange={(e) => setProfileData({ ...profileData, portalNumber: e.target.value })} />
                            ) : (
                                <p className="text-gray-800 font-medium">{profileData.portalNumber}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="city">Ciudad</Label>
                            {isEditing ? (
                                <Input id="city" value={profileData.city} onChange={(e) => setProfileData({ ...profileData, city: e.target.value })} />
                            ) : (
                                <p className="text-gray-800 font-medium">{profileData.city}</p>
                            )}
                        </div>
                        <div>
                          <Label>Apartamento</Label>
                          <p className="text-gray-800 font-medium">{profileData.apartment}</p>
                        </div>
                        <div>
                            <Label htmlFor="communityRole">Rol en la comunidad</Label>
                            {isEditing ? (
                                <select id="communityRole" value={profileData.communityRole} onChange={(e) => setProfileData({ ...profileData, communityRole: e.target.value })} className="w-full px-3 py-2 border rounded-md bg-white">
                                    <option value="Propietario">Propietario</option>
                                    <option value="Presidente">Presidente</option>
                                    <option value="Vicepresidente">Vicepresidente</option>
                                    <option value="Inquilino">Inquilino</option>
                                </select>
                            ) : (
                                <p className="text-gray-800 font-medium">{profileData.communityRole}</p>
                            )}
                        </div>
                        <div>
                          <Label>Miembro desde</Label>
                          <p className="text-gray-800 font-medium">{profileData.memberSince}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === "servicios" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Servicios Disponibles</h2>
                    <p className="text-gray-600">Proveedores recomendados para tu comunidad</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableServices.map((service) => (
                      <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="h-40 overflow-hidden relative">
                          <Image 
                            src={service.image} 
                            alt={service.name} 
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <Badge className="mb-2 bg-blue-100 text-blue-800">{service.category}</Badge>
                          <h3 className="font-bold text-lg text-gray-800">{service.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">{service.provider}</p>
                          
                          <div className="flex items-center mb-3">
                            <div className="flex mr-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-4 w-4 ${star <= Math.floor(service.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">{service.rating}</span>
                          </div>

                          <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold text-green-600">{service.price}</span>
                            <Badge variant="outline" className="text-green-700 border-green-300">
                              {service.availability}
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              Ver Detalles
                            </Button>
                            <Button size="sm" className="flex-1">
                              Solicitar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === "chat" && (
                <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Chat Comunitario</h2>
                    <p className="text-gray-600">Comunícate con tus vecinos y el administrador</p>
                  </div>

                  <div className="flex-1 overflow-auto mb-4 border rounded-lg p-4 bg-gray-50">
                    <div className="space-y-4">
                      {communityMessages.map((message) => (
                        <div key={message.id} className={`flex ${message.isAdmin ? 'justify-start' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.isAdmin 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-white border border-gray-200'
                          }`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-sm font-medium ${
                                message.isAdmin ? 'text-blue-100' : 'text-gray-600'
                              }`}>
                                {message.sender} ({message.apartment})
                              </span>
                              <span className={`text-xs ${
                                message.isAdmin ? 'text-blue-200' : 'text-gray-400'
                              }`}>
                                {message.timestamp}
                              </span>
                            </div>
                            <p className={`text-sm ${
                              message.isAdmin ? 'text-white' : 'text-gray-800'
                            }`}>
                              {message.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Input
                      placeholder="Escribe tu mensaje..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} className="px-4">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {activeTab === "videoconferencia" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="text-center py-12">
                    <Video className="h-16 w-16 mx-auto text-blue-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Videoconferencia Comunitaria</h2>
                    <p className="text-gray-600 mb-6">Programa reuniones virtuales con el administrador y otros vecinos</p>
                    
                    <div className="max-w-md mx-auto space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">Próxima Reunión</h3>
                          <p className="text-sm text-gray-600 mb-2">Junta Ordinaria de Propietarios</p>
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>15 de Agosto, 2024 - 19:00</span>
                          </div>
                          <Button className="w-full">Unirse a la Reunión</Button>
                        </CardContent>
                      </Card>

                      <Button variant="outline" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Programar Nueva Reunión
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "incidencias" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Reportar Incidencia</h2>
                    <p className="text-gray-600">Informa sobre problemas en las zonas comunes</p>
                  </div>

                  <div className="max-w-2xl mx-auto">
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="issue-type">Tipo de Incidencia</Label>
                        <select 
                          id="issue-type"
                          value={selectedIssueType}
                          onChange={(e) => setSelectedIssueType(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="maintenance">Mantenimiento</option>
                          <option value="cleaning">Limpieza</option>
                          <option value="security">Seguridad</option>
                          <option value="noise">Ruidos</option>
                          <option value="lighting">Iluminación</option>
                          <option value="other">Otro</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="description">Descripción de la Incidencia</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe detalladamente el problema..."
                          value={issueDescription}
                          onChange={(e) => setIssueDescription(e.target.value)}
                          rows={6}
                        />
                      </div>

                      <div className="flex space-x-4">
                        <Button variant="outline" className="flex-1">
                          <Camera className="h-4 w-4 mr-2" />
                          Adjuntar Foto
                        </Button>
                        <Button 
                          onClick={handleSubmitIssue}
                          className="flex-1"
                          disabled={!issueDescription.trim()}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Incidencia
                        </Button>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">Incidencias Recientes</h3>
                      <div className="space-y-3">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">Puerta del garaje averiada</h4>
                                <p className="text-sm text-gray-600">Reportado el 2 de Agosto</p>
                              </div>
                              <Badge className="bg-green-100 text-green-800">Resuelto</Badge>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">Iluminación del portal</h4>
                                <p className="text-sm text-gray-600">Reportado el 28 de Julio</p>
                              </div>
                              <Badge className="bg-yellow-100 text-yellow-800">En proceso</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "contratos" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Contratos de la Comunidad</h2>
                    <p className="text-gray-600">Servicios contratados para el mantenimiento comunitario</p>
                  </div>

                  <div className="space-y-4">
                    {communityContracts.map((contract) => (
                      <Card key={contract.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">{contract.title}</h3>
                              <p className="text-gray-600">{contract.provider}</p>
                            </div>
                            <Badge className={
                              contract.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }>
                              {contract.status === 'active' ? 'Activo' : 'Pendiente'}
                            </Badge>
                          </div>

                          <p className="text-gray-700 mb-4">{contract.description}</p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <Label className="text-sm text-gray-500">Fecha de Inicio</Label>
                              <p className="font-medium">{contract.startDate}</p>
                            </div>
                            <div>
                              <Label className="text-sm text-gray-500">Fecha de Fin</Label>
                              <p className="font-medium">{contract.endDate}</p>
                            </div>
                            <div>
                              <Label className="text-sm text-gray-500">Valor</Label>
                              <p className="font-medium text-green-600">{contract.value}</p>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Contrato
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Descargar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === "presupuesto" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Presupuesto Comunitario 2024</h2>
                    <p className="text-gray-600">Estado actual del presupuestoanual</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-blue-50">
                      <CardContent className="p-6 text-center">
                        <Euro className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                        <h3 className="text-lg font-semibold text-gray-800">Presupuesto Total</h3>
                        <p className="text-2xl font-bold text-blue-600">€{budgetData.totalBudget.toLocaleString()}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-red-50">
                      <CardContent className="p-6 text-center">
                        <Activity className="h-8 w-8 mx-auto text-red-600 mb-2" />
                        <h3 className="text-lg font-semibold text-gray-800">Gastado</h3>
                        <p className="text-2xl font-bold text-red-600">€{budgetData.spent.toLocaleString()}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-green-50">
                      <CardContent className="p-6 text-center">
                        <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
                        <h3 className="text-lg font-semibold text-gray-800">Disponible</h3>
                        <p className="text-2xl font-bold text-green-600">€{budgetData.remaining.toLocaleString()}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Desglose por Categorías</h3>
                    <div className="space-y-4">
                      {budgetData.categories.map((category, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-800">{category.name}</h4>
                              <span className="text-sm text-gray-600">
                                €{category.spent.toLocaleString()} / €{category.budget.toLocaleString()}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  category.percentage > 80 ? 'bg-red-500' : 
                                  category.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(category.percentage, 100)}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{category.percentage}% utilizado</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "administrador" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Contactar Administrador</h2>
                    <p className="text-gray-600">Comunícate directamente con la administración</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <User className="h-5 w-5" />
                          <span>Información de Contacto</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">admin@administracionfincas.com</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Teléfono</p>
                            <p className="font-medium">+34 91 123 45 67</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Horario de Atención</p>
                            <p className="font-medium">Lunes a Viernes: 9:00 - 18:00</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Enviar Mensaje</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="subject">Asunto</Label>
                          <Input id="subject" placeholder="Asunto del mensaje" />
                        </div>
                        <div>
                          <Label htmlFor="message">Mensaje</Label>
                          <Textarea 
                            id="message" 
                            placeholder="Escribe tu mensaje aquí..."
                            rows={6}
                          />
                        </div>
                        <Button className="w-full">
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Mensaje
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
              
              {activeTab === "historial" && (
                <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300">
                  <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <Label className="text-sm font-medium">{t("filterByStatus")}:</Label>
                      <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-1 border rounded-md text-sm"
                      >
                        <option value="all">{t("allStatuses")}</option>
                        <option value="completed">{t("completed")}</option>
                        <option value="pending">{t("pending")}</option>
                        <option value="cancelled">{t("cancelled")}</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm font-medium">{t("filterByCategory")}:</Label>
                      <select 
                        value={categoryFilter} 
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-3 py-1 border rounded-md text-sm"
                      >
                        <option value="all">{t("allCategories")}</option>
                        <option value="maintenance">{t("maintenance")}</option>
                        <option value="cleaning">{t("cleaning")}</option>
                        <option value="gardening">{t("gardening")}</option>
                        <option value="electrical">{t("electrical")}</option>
                      </select>
                    </div>
                  </div>

                  {filteredCommunityServiceHistory.length > 0 ? (
                    <div className="space-y-4">
                      {filteredCommunityServiceHistory.map((service) => (
                        <ServiceHistoryCard
                          key={service.id}
                          service={service}
                          onRate={handleRateService}
                          onViewDetails={(id) => console.log("View community service details", id)}
                          onRepeatService={(id) => console.log("Request community service again", id)}
                          onContactProvider={(id) => console.log("Contact community provider", id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">{t("noServiceHistory")}</h3>
                      <p className="text-gray-500 mb-4">{t("noServiceHistory")}</p>
                      <Button 
                        onClick={() => setActiveTab("servicios")}
                        className="transition-all duration-200 hover:scale-105"
                      >
                        {t("findServices")}
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === "recomendaciones" && (
                <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("topRatedProviders")}</h2>
                    <p className="text-gray-600">{t('basedOnCommunityRatings')}</p>
                  </div>

                  {topRatedCommunityProviders.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {topRatedCommunityProviders.map((provider) => (
                        <Card key={provider.id} className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-105">
                          <div className="h-40 overflow-hidden relative">
                            <Image 
                              src={provider.image} 
                              alt={provider.name} 
                              layout="fill"
                              objectFit="cover"
                              className="transition-all duration-200 hover:scale-110"
                            />
                            {provider.verified && (
                              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                ✓ {t("verified")}
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <Badge className="mb-2 bg-purple-100 text-purple-800">{provider.category}</Badge>
                            <h3 className="font-bold text-lg text-gray-800">{provider.name}</h3>
                            
                            <div className="flex items-center mt-1 mb-2">
                              <div className="flex mr-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star} 
                                    className={`h-4 w-4 transition-all duration-200 ${star <= Math.floor(provider.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600 font-medium">
                                {provider.rating} ({provider.reviews} {t("reviews")})
                              </span>
                            </div>

                            <div className="flex items-center text-sm text-gray-500 mb-3">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{provider.location}</span>
                              <span className="ml-2">• {provider.totalJobs} {t('jobs')}</span>
                            </div>

                            <div className="mb-4">
                              <p className="text-xs text-gray-500 mb-1">{t("specializations")}:</p>
                              <div className="flex flex-wrap gap-1">
                                {provider.specialties.map((specialty, index) => (
                                  <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1 transition-all duration-200 hover:scale-105">
                                {t("viewProfile")}
                              </Button>
                              <Button size="sm" className="flex-1 transition-all duration-200 hover:scale-105">
                                {t("request")}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ThumbsUp className="h-12 w-12 mx-auto text-gray-300 mb-4 transition-all duration-200 hover:scale-110" />
                      <p className="text-gray-500">{t("noRecommendations")}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "valoraciones" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Valoraciones de Servicios</h2>
                    <p className="text-gray-600">Tus valoraciones de los servicios comunitarios</p>
                  </div>

                  <div className="space-y-4">
                    {communityServiceHistory.filter(service => service.rating).map((service) => (
                      <Card key={service.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{service.serviceName}</h3>
                              <p className="text-gray-600">{service.providerName}</p>
                              <p className="text-sm text-gray-500">{service.date}</p>
                            </div>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-5 w-5 ${star <= service.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                                />
                              ))}
                              <span className="ml-2 text-lg font-semibold">{service.rating}</span>
                            </div>
                          </div>
                          {service.comment && (
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{service.comment}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "configuracion" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Configuración</h2>
                    <p className="text-gray-600">Ajusta tus preferencias de la aplicación</p>
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Bell className="h-5 w-5" />
                          <span>Notificaciones</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Notificaciones de Email</Label>
                            <p className="text-sm text-gray-500">Recibir actualizaciones por correo</p>
                          </div>
                          <Button variant="outline" size="sm">Activar</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Notificaciones Push</Label>
                            <p className="text-sm text-gray-500">Notificaciones en el navegador</p>
                          </div>
                          <Button variant="outline" size="sm">Activar</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Recordatorios de Reuniones</Label>
                            <p className="text-sm text-gray-500">Avisos de videoconferencias</p>
                          </div>
                          <Button variant="outline" size="sm">Activar</Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Shield className="h-5 w-5" />
                          <span>Privacidad y Seguridad</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full justify-start">
                          Cambiar Contraseña
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          Configurar Autenticación en Dos Pasos
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          Descargar Mis Datos
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
              
            </div>
          </ZoomableSection>
        </div>
      </div>

      {showRatingModal && selectedServiceForRating && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedServiceForRating(null);
          }}
          serviceName={selectedServiceForRating.serviceName}
          providerName={selectedServiceForRating.providerName}
          currentRating={selectedServiceForRating.rating}
          currentComment={selectedServiceForRating.comment}
          onSubmit={handleSubmitRating}
        />
      )}
    </>
  );
}

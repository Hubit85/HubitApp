
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
  FileSpreadsheet
} from "lucide-react";

// Define community contact type
interface CommunityContact {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  timestamp: string;
  isOnline: boolean;
}

// Define community contract type
interface CommunityContract {
  id: string;
  title: string;
  type: string;
  date: string;
  fileType: "pdf" | "word";
}

export default function CommunityMemberDashboard() {
  const [activeTab, setActiveTab] = useState("perfil");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedServiceForRating, setSelectedServiceForRating] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const { t } = useLanguage();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      const validFiles = newFiles.filter(file => {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
        return file.size <= maxSize && allowedTypes.includes(file.type);
      });
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files);
    event.target.value = '';
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    handleFileSelect(event.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Sample community contacts data
  const communityContacts: CommunityContact[] = [
    { id: "1", name: "Ana García", role: t("communityPresident"), lastMessage: t("goodMorningNeighbors"), timestamp: "09:30", isOnline: true },
    { id: "2", name: "Carlos Rodríguez", role: t("treasurer"), lastMessage: t("monthlyFeesReminder"), timestamp: "Yesterday", isOnline: false },
    { id: "3", name: "Marta Sánchez", role: t("secretary"), lastMessage: t("meetingMinutesAvailable"), timestamp: "Yesterday", isOnline: true },
  ];

  // Sample community contracts data
  const communityContracts: CommunityContract[] = [
    { id: "1", title: t("communityBylaws"), type: t("legalDocument"), date: "01/01/2023", fileType: "pdf" },
    { id: "2", title: t("maintenanceContract"), type: t("serviceContract"), date: "15/03/2023", fileType: "pdf" },
    { id: "3", title: t("cleaningServices"), type: t("serviceContract"), date: "10/04/2023", fileType: "word" },
  ];

  // Mock community service history data
  const communityServiceHistory = [
    {
      id: "1",
      serviceName: "Mantenimiento de Ascensor",
      providerName: "Ascensores Madrid",
      providerImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      category: "maintenance",
      date: "20 Mar 2024",
      cost: 450.00,
      status: "completed" as const,
      rating: 5,
      comment: "Servicio excelente para toda la comunidad",
      location: "Edificio Central",
      duration: "4 horas"
    },
    {
      id: "2", 
      serviceName: "Limpieza de Portales",
      providerName: "Limpiezas Comunidad",
      providerImage: "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      category: "cleaning",
      date: "18 Mar 2024",
      cost: 180.00,
      status: "completed" as const,
      rating: 4,
      comment: "Buen trabajo general, podrían mejorar en escaleras",
      location: "Todos los portales", 
      duration: "3 horas"
    },
    {
      id: "3",
      serviceName: "Jardinería Zonas Comunes",
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
      serviceName: "Reparación Iluminación",
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

  // Top rated community service providers
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
      specialties: ["Mantenimiento preventivo", "Reparaciones urgentes", "Modernización"],
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
      specialties: ["Diseño paisajístico", "Mantenimiento jardines", "Sistemas de riego"],
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
      specialties: ["Limpieza portales", "Desinfección", "Mantenimiento"],
      verified: true
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
                  {/* Perfil Content */}
                </div>
              )}
              
              {activeTab === "chat" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                 {/* Chat Content */}
                </div>
              )}
              
              {activeTab === "videoconferencia" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  {/* Video Conference Content */}
                </div>
              )}
              
              {activeTab === "incidencias" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  {/* Report Issue Content */}
                </div>
              )}
              
              {activeTab === "contratos" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  {/* Community Contracts Content */}
                </div>
              )}
              
              {activeTab === "presupuesto" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  {/* Community Budget Content */}
                </div>
              )}
              
              {activeTab === "administrador" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                 {/* Contact Admin Content */}
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
                                {provider.specialties.slice(0, 2).map((specialty, index) => (
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

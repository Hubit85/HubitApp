
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

export default function CommunityMemberDashboard() {
  const [activeTab, setActiveTab] = useState("perfil");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedServiceForRating, setSelectedServiceForRating] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { t } = useLanguage();
  
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

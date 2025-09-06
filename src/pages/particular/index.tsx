
import React, { useState } from "react";
import Head from "next/head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Store, 
  Star, 
  Home, 
  Settings, 
  Bell,
  MapPin,
  Search,
  CreditCard,
  ThumbsUp,
  Award,
  Filter,
  Calendar
} from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/layout/Header";
import { SidebarParticular } from "@/components/layout/SidebarParticular";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import PropertySelector from "@/components/PropertySelector";
import Image from "next/image";
import ZoomableSection from "@/components/ZoomableSection";
import ServiceHistoryCard from "@/components/ratings/ServiceHistoryCard";
import RatingModal from "@/components/ratings/RatingModal";

interface ServiceProvider {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  location: string;
  image: string;
}

interface SelectedPropertyInfo {
  communityName: string;
  unitNumber: string;
}

export default function ParticularDashboard() {
  const [activeTab, setActiveTab] = useState("perfil");
  const [showPropertySelector, setShowPropertySelector] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<SelectedPropertyInfo | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedServiceForRating, setSelectedServiceForRating] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { t } = useLanguage();
  
  const serviceProviders: ServiceProvider[] = [
    { id: "1", name: "Fontanería Express", category: t("plumbing"), rating: 4.8, reviews: 124, location: "Madrid", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" },
    { id: "2", name: "Electricidad Rápida", category: t("electrical"), rating: 4.6, reviews: 98, location: "Barcelona", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80" },
    { id: "3", name: "Pinturas Modernas", category: t("painting"), rating: 4.9, reviews: 156, location: "Valencia", image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" },
  ];

  const favoriteProviders = serviceProviders.slice(0, 3);

  const properties = [
    { id: "1", name: t("apartmentInCenter"), address: "Calle Gran Vía 25, Madrid", type: t("apartment"), size: "85m²", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" },
    { id: "2", name: t("beachHouse"), address: "Avenida Marítima 12, Málaga", type: t("house"), size: "120m²", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" }
  ];

  const serviceHistory = [
    {
      id: "1",
      serviceName: t("plumbingRepair"),
      providerName: "Fontanería Express",
      providerImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      category: "plumbing",
      date: "15 Mar 2024",
      cost: 85.50,
      status: "completed" as const,
      rating: 5,
      comment: t("excellentServiceComment"),
      location: "Madrid Centro",
      duration: "2 horas"
    },
    {
      id: "2", 
      serviceName: t("electricalInstallation"),
      providerName: "Electricidad Rápida",
      providerImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      category: "electrical",
      date: "22 Feb 2024",
      cost: 120.00,
      status: "completed" as const,
      rating: 4,
      comment: t("goodWorkComment"),
      location: "Madrid Centro", 
      duration: "3 horas"
    },
    {
      id: "3",
      serviceName: t("loungePainting"),
      providerName: "Pinturas Modernas",
      providerImage: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      category: "painting",
      date: "10 Jan 2024",
      cost: 300.00,
      status: "completed" as const,
      location: "Madrid Centro",
      duration: "1 día"
    },
    {
      id: "4",
      serviceName: t("generalCleaning"),
      providerName: "Limpiezas Premium",
      providerImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      category: "cleaning",
      date: "5 Dec 2023",
      cost: 60.00,
      status: "pending" as const,
      location: "Madrid Centro",
      duration: "4 horas"
    }
  ];

  const topRatedProviders = [
    {
      id: "1",
      name: "Fontanería Express", 
      category: t("plumbing"),
      rating: 4.9,
      reviews: 156,
      totalJobs: 324,
      location: "Madrid",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      specialties: [t("emergencyRepairs"), t("newInstallations"), t("maintenanceSpec")],
      verified: true
    },
    {
      id: "2",
      name: "Pinturas Modernas",
      category: t("painting"), 
      rating: 4.8,
      reviews: 203,
      totalJobs: 445,
      location: "Madrid", 
      image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      specialties: [t("interiorPaintingSpec"), t("exteriorPaintingSpec"), t("decorativePaintingSpec")],
      verified: true
    },
    {
      id: "3", 
      name: "Electricidad Pro",
      category: t("electrical"),
      rating: 4.7,
      reviews: 189,
      totalJobs: 378,
      location: "Madrid",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80", 
      specialties: [t("installationsSpec"), t("repairsSpec"), t("domoticsSpec")],
      verified: true
    }
  ];

  const handlePropertySelected = (property: any, unit: any) => {
    setSelectedProperty({ communityName: property.communityName, unitNumber: unit.unitNumber });
    setShowPropertySelector(false);
  };

  const getActiveTabTitle = () => {
    switch (activeTab) {
      case "perfil": return t("myProfile");
      case "presupuesto": return t("requestQuote");
      case "proveedores": return t("serviceProviders");
      case "favoritos": return t("myFavorites");
      case "propiedades": return t("myProperties");
      case "historial": return t("serviceHistory");
      case "notificaciones": return t("notifications");
      case "configuracion": return t("configuration");
      case "pagos": return t("myPayments");
      case "recomendaciones": return t("recommendations");
      case "premios": return t("myAwards");
      default: return t("dashboard");
    }
  };

  const handleRateService = (serviceId: string) => {
    const service = serviceHistory.find(s => s.id === serviceId);
    if (service) {
      setSelectedServiceForRating(service);
      setShowRatingModal(true);
    }
  };

  const handleSubmitRating = (rating: number, comment: string, wouldRecommend: boolean) => {
    console.log("Rating submitted:", { rating, comment, wouldRecommend });
    setShowRatingModal(false);
    setSelectedServiceForRating(null);
  };

  const filteredServiceHistory = serviceHistory.filter(service => {
    const statusMatch = statusFilter === "all" || service.status === statusFilter;
    const categoryMatch = categoryFilter === "all" || service.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  return (
    <>
      <Head>
        <title>{t('particular')} | {t('hubit')}</title>
        <meta name='description' content={t('particularDesc')} />
      </Head>
      
      {showPropertySelector && (
        <PropertySelector
          onPropertySelected={handlePropertySelected}
          onCancel={() => setShowPropertySelector(false)}
        />
      )}
      
      <Header />
      
      <div className="flex h-screen bg-gray-100 pt-16">
        <SidebarParticular activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 overflow-hidden">
          <ZoomableSection className="h-full overflow-auto" enableZoom={true} maxScale={3} minScale={0.5}>
            <div className="p-6 min-h-full">
              <Card className="mb-6 shadow-sm border-l-4 border-l-blue-500 transition-all duration-200 hover:shadow-md">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {selectedProperty 
                        ? `${selectedProperty.communityName} - ${t('unit')} ${selectedProperty.unitNumber}` 
                        : t('noPropertySelected')
                      }
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedProperty ? t('propertySelected') : t('selectAPropertyToManage')}
                    </p>
                  </div>
                  <Button 
                    onClick={() => setShowPropertySelector(true)}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    {t('changeProperty')}
                  </Button>
                </CardContent>
              </Card>

              <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-gray-200 pb-2">
                {getActiveTabTitle()}
              </h1>
              
              {activeTab === "perfil" && (
                <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <Card className="transition-all duration-200 hover:shadow-lg">
                        <CardContent className="p-6 flex flex-col items-center">
                          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-4 transition-all duration-200 hover:scale-105">
                            <User className="h-16 w-16 text-blue-600" />
                          </div>
                          <h2 className="text-xl font-bold text-gray-800">Carlos García</h2>
                          <p className="text-gray-500 mb-4">{t("particular")}</p>
                          <Button className="w-full transition-all duration-200 hover:scale-105">
                            {t("editProfile")}
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="md:w-2/3">
                      <Card className="transition-all duration-200 hover:shadow-lg">
                        <CardHeader>
                          <CardTitle className="text-gray-800">{t("personalInformation")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="name" className="text-gray-700">{t("fullNameLabel")}</Label>
                                <Input id="name" value="Carlos García Martínez" readOnly className="bg-gray-50 transition-all duration-200 focus:bg-white" />
                              </div>
                              <div>
                                <Label htmlFor="email" className="text-gray-700">{t("emailLabel")}</Label>
                                <Input id="email" value="carlos.garcia@example.com" readOnly className="bg-gray-50 transition-all duration-200 focus:bg-white" />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="phone" className="text-gray-700">{t("phoneLabel")}</Label>
                                <Input id="phone" value="+34 612 345 678" readOnly className="bg-gray-50 transition-all duration-200 focus:bg-white" />
                              </div>
                              <div>
                                <Label htmlFor="location" className="text-gray-700">{t("locationLabel")}</Label>
                                <Input id="location" value="Madrid, España" readOnly className="bg-gray-50 transition-all duration-200 focus:bg-white" />
                              </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("accountSettings")}</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-gray-700">{t("language")}</Label>
                                  <select className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-blue-500">
                                    <option>{t("languageEs")}</option>
                                    <option>{t("languageEn")}</option>
                                  </select>
                                </div>
                                <div>
                                  <Label className="text-gray-700">{t("notifications")}</Label>
                                  <div className="mt-2 space-y-2">
                                    <div className="flex items-center">
                                      <input type="checkbox" id="email-notifications" defaultChecked className="h-4 w-4 text-blue-600 transition-all duration-200" />
                                      <Label htmlFor="email-notifications" className="ml-2 text-sm text-gray-700">{t("emailNotifications")}</Label>
                                    </div>
                                    <div className="flex items-center">
                                      <input type="checkbox" id="push-notifications" className="h-4 w-4 text-blue-600 transition-all duration-200" />
                                      <Label htmlFor="push-notifications" className="ml-2 text-sm text-gray-700">{t("pushNotifications")}</Label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "presupuesto" && (
                <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300">
                  <Card className="transition-all duration-200 hover:shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-gray-800">{t("requestQuote")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="service-type" className="text-gray-700">{t("serviceType")}</Label>
                            <select id="service-type" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-blue-500">
                              <option value="">{t("selectServiceType")}</option>
                              <option value="plumbing">{t("plumbing")}</option>
                              <option value="electrical">{t("electrical")}</option>
                              <option value="painting">{t("painting")}</option>
                              <option value="carpentry">{t("carpentry")}</option>
                              <option value="other">{t("other")}</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="service-date" className="text-gray-700">{t("preferredDate")}</Label>
                            <Input id="service-date" type="date" className="transition-all duration-200 focus:scale-105" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="service-title" className="text-gray-700">{t("serviceTitle")}</Label>
                          <Input id="service-title" placeholder={t("exampleLeakRepair")} className="transition-all duration-200 focus:scale-105" />
                        </div>
                        <div>
                          <Label htmlFor="service-description" className="text-gray-700">{t("detailedDescription")}</Label>
                          <Textarea id="service-description" rows={4} placeholder={t("describeServiceNeeded")} className="transition-all duration-200 focus:scale-105" />
                        </div>
                        <Button className="w-full transition-all duration-200 hover:scale-105 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                          {t("requestQuotes")}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {activeTab === "proveedores" && (
                <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300">
                  <div className="flex justify-between items-center mb-6">
                    <div className="relative w-64">
                      <Input placeholder={t("searchProviders")} className="pr-10 transition-all duration-200 focus:scale-105" />
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {serviceProviders.map((provider) => (
                      <Card key={provider.id} className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-105">
                        <div className="h-40 overflow-hidden relative">
                          <Image 
                            src={provider.image} 
                            alt={provider.name} 
                            layout="fill"
                            objectFit="cover"
                            className="transition-all duration-200 hover:scale-110"
                          />
                        </div>
                        <CardContent className="p-4">
                          <Badge className="mb-2 bg-blue-100 text-blue-800">{provider.category}</Badge>
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
                            <span className="text-sm text-gray-600">{provider.rating} ({provider.reviews} {t("reviews")})</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{provider.location}</span>
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
                  
                  <div className="mt-6 flex justify-center">
                    <Button variant="outline" className="transition-all duration-200 hover:scale-105">
                      {t("loadMoreProviders")}
                    </Button>
                  </div>
                </div>
              )}
              
              {activeTab === "favoritos" && (
                <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300">
                  {favoriteProviders.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favoriteProviders.map((provider) => (
                        <Card key={provider.id} className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-105">
                          <div className="h-40 overflow-hidden relative">
                            <Image 
                              src={provider.image} 
                              alt={provider.name} 
                              layout="fill"
                              objectFit="cover"
                              className="transition-all duration-200 hover:scale-110"
                            />
                          </div>
                          <CardContent className="p-4">
                            <Badge className="mb-2 bg-green-100 text-green-800">{provider.category}</Badge>
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
                              <span className="text-sm text-gray-600">{provider.rating} ({provider.reviews} {t("reviews")})</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{provider.location}</span>
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
                      <h3 className="text-lg font-medium text-gray-600 mb-2">{t("noFavoriteProviders")}</h3>
                      <p className="text-gray-500 mb-4">{t("addFavoriteProvidersDesc")}</p>
                      <Button 
                        onClick={() => setActiveTab("proveedores")}
                        className="transition-all duration-200 hover:scale-105"
                      >
                        {t("exploreProviders")}
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === "propiedades" && (
                <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300">
                  <div className="flex justify-between items-center mb-6">
                    <Button className="transition-all duration-200 hover:scale-105 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                      {t("addProperty")}
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {properties.map((property) => (
                      <Card key={property.id} className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-105">
                        <div className="h-48 overflow-hidden relative">
                          <Image 
                            src={property.image} 
                            alt={property.name} 
                            layout="fill"
                            objectFit="cover"
                            className="transition-all duration-200 hover:scale-110"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-gray-800">{property.name}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1 mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{property.address}</span>
                          </div>
                          <div className="flex justify-between mb-4">
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              {property.type}
                            </Badge>
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                              {property.size}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 transition-all duration-200 hover:scale-105">
                              {t("viewDetails")}
                            </Button>
                            <Button size="sm" className="flex-1 transition-all duration-200 hover:scale-105">
                              {t("manage")}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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
                        <option value="plumbing">{t("plumbing")}</option>
                        <option value="electrical">{t("electrical")}</option>
                        <option value="painting">{t("painting")}</option>
                        <option value="cleaning">{t("cleaning")}</option>
                      </select>
                    </div>
                  </div>

                  {filteredServiceHistory.length > 0 ? (
                    <div className="space-y-4">
                      {filteredServiceHistory.map((service) => (
                        <ServiceHistoryCard
                          key={service.id}
                          service={service}
                          onRate={handleRateService}
                          onViewDetails={(id) => console.log("View details", id)}
                          onRepeatService={(id) => console.log("Repeat service", id)}
                          onContactProvider={(id) => console.log("Contact provider", id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">{t("noServiceHistory")}</h3>
                      <p className="text-gray-500 mb-4">{t('noServiceHistoryMessage')}</p>
                      <Button 
                        onClick={() => setActiveTab("proveedores")}
                        className="transition-all duration-200 hover:scale-105"
                      >
                        {t("exploreProviders")}
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === "configuracion" && (
                <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300">
                  <Card className="transition-all duration-200 hover:shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-gray-800">{t("accountPreferences")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="language" className="text-gray-700">{t("language")}</Label>
                          <select id="language" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-blue-500">
                            <option>{t("spanish")}</option>
                            <option>{t("english")}</option>
                            <option>{t("catalan")}</option>
                          </select>
                        </div>
                        <div>
                          <Label className="text-gray-700">{t("notifications")}</Label>
                          <div className="mt-2 space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-all duration-200 hover:bg-gray-100">
                              <span className="text-gray-700">{t("emailNotifications")}</span>
                              <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 transition-all duration-200" />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-all duration-200 hover:bg-gray-100">
                              <span className="text-gray-700">{t("pushNotifications")}</span>
                              <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 transition-all duration-200" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "pagos" && (
                <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300">
                  <Card className="transition-all duration-200 hover:shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-gray-800">{t("myPayments")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <CreditCard className="h-12 w-12 mx-auto text-gray-300 mb-4 transition-all duration-200 hover:scale-110" />
                        <p className="text-gray-500">{t("noPaymentHistory")}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {activeTab === "recomendaciones" && (
                <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("topRatedProviders")}</h2>
                    <p className="text-gray-600">{t("basedOnHistory")}</p>
                  </div>

                  {topRatedProviders.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {topRatedProviders.map((provider) => (
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
              
              {activeTab === "premios" && (
                <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300">
                  <Card className="transition-all duration-200 hover:shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-gray-800">{t("myAwards")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Award className="h-12 w-12 mx-auto text-gray-300 mb-4 transition-all duration-200 hover:scale-110" />
                        <p className="text-gray-500">{t("noAwards")}</p>
                      </div>
                    </CardContent>
                  </Card>
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

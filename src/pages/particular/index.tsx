
import React, { useState } from "react";
import Head from "next/head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  FileText, 
  Store, 
  Star, 
  Home, 
  Settings, 
  Bell,
  MapPin,
  Search,
  CreditCard,
  ThumbsUp,
  Award
} from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import PropertySelector from "@/components/PropertySelector";
import Image from "next/image";
import ZoomableSection from "@/components/ZoomableSection";

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
  const { t } = useLanguage();
  
  const serviceProviders: ServiceProvider[] = [
    { id: "1", name: "Fontanería Express", category: "Fontanería", rating: 4.8, reviews: 124, location: "Madrid", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" },
    { id: "2", name: "Electricidad Rápida", category: "Electricidad", rating: 4.6, reviews: 98, location: "Barcelona", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80" },
    { id: "3", name: "Pinturas Modernas", category: "Pintura", rating: 4.9, reviews: 156, location: "Valencia", image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" },
  ];

  const favoriteProviders = serviceProviders.slice(0, 3);

  const properties = [
    { id: "1", name: "Apartamento en Centro", address: "Calle Gran Vía 25, Madrid", type: "Apartamento", size: "85m²", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" },
    { id: "2", name: "Casa en la Playa", address: "Avenida Marítima 12, Málaga", type: "Casa", size: "120m²", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" }
  ];

  const handlePropertySelected = (property: any, unit: any) => {
    setSelectedProperty({ communityName: property.communityName, unitNumber: unit.unitNumber });
    setShowPropertySelector(false);
  };

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
        {/* Sidebar */}
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
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <ZoomableSection className="h-full overflow-auto" enableZoom={true} maxScale={3} minScale={0.5}>
            <div className="p-6 min-h-full">
              {/* Property Selection Card */}
              <Card className="mb-6">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">{selectedProperty ? `${selectedProperty.communityName} - ${t('unit')} ${selectedProperty.unitNumber}` : t('noPropertySelected')}</h3>
                    <p className="text-sm text-gray-500">{selectedProperty ? t('propertySelected') : t('selectAPropertyToManage')}</p>
                  </div>
                  <Button onClick={() => setShowPropertySelector(true)}>{t('changeProperty')}</Button>
                </CardContent>
              </Card>

              <h1 className="text-3xl font-bold mb-6">
                {activeTab === "perfil" ? t("myProfile") : 
                 activeTab === "presupuesto" ? t("requestQuote") :
                 activeTab === "proveedores" ? t("serviceProviders") :
                 activeTab === "favoritos" ? t("myFavorites") :
                 activeTab === "propiedades" ? t("myProperties") :
                 activeTab === "notificaciones" ? t("notifications") :
                 activeTab === "pagos" ? t("myPayments") || "Mis Pagos" :
                 activeTab === "recomendaciones" ? t("recommendations") || "Recomendaciones" :
                 activeTab === "premios" ? t("myAwards") || "Mis Premios" :
                 t("configuration")}
              </h1>
              
              {/* Mi Perfil Tab */}
              {activeTab === "perfil" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <Card>
                        <CardContent className="p-6 flex flex-col items-center">
                          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                            <User className="h-16 w-16 text-gray-500" />
                          </div>
                          <h2 className="text-xl font-bold">Carlos García</h2>
                          <p className="text-gray-500 mb-4">{t("individual")}</p>
                          <Button className="w-full">{t("editProfile")}</Button>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="md:w-2/3">
                      <Card>
                        <CardHeader>
                          <CardTitle>{t("personalInformation")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="name">{t("fullNameLabel")}</Label>
                                <Input id="name" value="Carlos García Martínez" readOnly className="bg-gray-50" />
                              </div>
                              <div>
                                <Label htmlFor="email">{t("emailLabel")}</Label>
                                <Input id="email" value="carlos.garcia@example.com" readOnly className="bg-gray-50" />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="phone">{t("phoneLabel")}</Label>
                                <Input id="phone" value="+34 612 345 678" readOnly className="bg-gray-50" />
                              </div>
                              <div>
                                <Label htmlFor="location">{t("locationLabel")}</Label>
                                <Input id="location" value="Madrid, España" readOnly className="bg-gray-50" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Request Quote Tab */}
              {activeTab === "presupuesto" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <Card>
                    <CardHeader><CardTitle>{t("requestQuote")}</CardTitle></CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="service-type">{t("serviceType")}</Label>
                            <select id="service-type" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                              <option value="">{t("selectServiceType")}</option>
                              <option value="plumbing">{t("plumbing")}</option>
                              <option value="electrical">{t("electrical")}</option>
                              <option value="painting">{t("painting")}</option>
                              <option value="carpentry">{t("carpentry")}</option>
                              <option value="other">{t("other")}</option>
                            </select>
                          </div>
                          <div><Label htmlFor="service-date">{t("preferredDate")}</Label><Input id="service-date" type="date" /></div>
                        </div>
                        <div><Label htmlFor="service-title">{t("serviceTitle")}</Label><Input id="service-title" placeholder={t("exampleLeakRepair")} /></div>
                        <div><Label htmlFor="service-description">{t("detailedDescription")}</Label><Textarea id="service-description" rows={4} placeholder={t("describeServiceNeeded")} /></div>
                        <Button className="w-full">{t("requestQuotes")}</Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* Service Providers Tab */}
              {activeTab === "proveedores" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="relative w-64">
                      <Input placeholder={t("searchProviders")} className="pr-10" />
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {serviceProviders.map((provider) => (
                      <Card key={provider.id} className="overflow-hidden">
                        <div className="h-40 overflow-hidden relative">
                          <Image 
                            src={provider.image} 
                            alt={provider.name} 
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <Badge className="mb-2">{provider.category}</Badge>
                          <h3 className="font-bold text-lg">{provider.name}</h3>
                          <div className="flex items-center mt-1 mb-2">
                            <div className="flex mr-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-4 w-4 ${star <= Math.floor(provider.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">{provider.rating} ({provider.reviews})</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{provider.location}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">{t("viewProfile")}</Button>
                            <Button size="sm" className="flex-1">{t("request")}</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex justify-center">
                    <Button variant="outline">{t("loadMoreProviders")}</Button>
                  </div>
                </div>
              )}
              
              {/* My Favorites Tab */}
              {activeTab === "favoritos" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteProviders.map((provider) => (
                      <Card key={provider.id} className="overflow-hidden">
                        <div className="h-40 overflow-hidden relative">
                          <Image 
                            src={provider.image} 
                            alt={provider.name} 
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <Badge className="mb-2">{provider.category}</Badge>
                          <h3 className="font-bold text-lg">{provider.name}</h3>
                          <div className="flex items-center mt-1 mb-2">
                            <div className="flex mr-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-4 w-4 ${star <= Math.floor(provider.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">{provider.rating} ({provider.reviews})</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{provider.location}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">{t("viewProfile")}</Button>
                            <Button size="sm" className="flex-1">{t("request")}</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {favoriteProviders.length === 0 && (
                    <div className="text-center py-12">
                      <ThumbsUp className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">{t("noFavoriteProviders")}</h3>
                      <p className="text-gray-500 mb-4">{t("addFavoriteProvidersDesc")}</p>
                      <Button onClick={() => setActiveTab("proveedores")}>{t("exploreProviders")}</Button>
                    </div>
                  )}
                </div>
              )}
              
              {/* My Properties Tab */}
              {activeTab === "propiedades" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <Button>{t("addProperty")}</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {properties.map((property) => (
                      <Card key={property.id} className="overflow-hidden">
                        <div className="h-48 overflow-hidden relative">
                          <Image 
                            src={property.image} 
                            alt={property.name} 
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold">{property.name === "Apartamento en Centro" ? t("apartmentInCenter") : property.name === "Casa en la Playa" ? t("beachHouse") : property.name}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1 mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{property.address}</span>
                          </div>
                          <div className="flex justify-between mb-4">
                            <Badge variant="outline">{property.type === "Apartamento" ? t("apartment") : property.type === "Casa" ? t("house") : property.type}</Badge>
                            <Badge variant="outline">{property.size}</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">{t("viewDetails")}</Button>
                            <Button size="sm" className="flex-1">{t("manage")}</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Notifications Tab */}
              {activeTab === "notificaciones" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="space-y-4">
                    <Card className="border-l-4 border-blue-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold">{t("quoteReceived")}</h3>
                            <p className="text-sm text-gray-600 mt-1">{t("quoteReceivedDesc")}</p>
                          </div>
                          <span className="text-xs text-gray-500">{t("hoursAgo")}</span>
                        </div>
                        <div className="mt-2 flex justify-end">
                          <Button size="sm">{t("viewQuote")}</Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-l-4 border-green-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold">{t("serviceCompleted")}</h3>
                            <p className="text-sm text-gray-600 mt-1">{t("serviceCompletedDesc")}</p>
                          </div>
                          <span className="text-xs text-gray-500">{t("yesterday")}</span>
                        </div>
                        <div className="mt-2 flex justify-end">
                          <Button size="sm">{t("rateService")}</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mt-6 flex justify-center">
                    <Button variant="outline">{t("viewAllNotifications")}</Button>
                  </div>
                </div>
              )}
              
              {/* Configuration Tab */}
              {activeTab === "configuracion" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <Card>
                    <CardHeader><CardTitle>{t("accountPreferences")}</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="language">{t("language")}</Label>
                          <select id="language" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                            <option>{t("spanish")}</option>
                            <option>{t("english")}</option>
                            <option>{t("catalan")}</option>
                          </select>
                        </div>
                        <div>
                          <Label>{t("notifications")}</Label>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between">
                              <span>{t("emailNotifications")}</span>
                              <input type="checkbox" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <span>{t("pushNotifications")}</span>
                              <input type="checkbox" defaultChecked />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Additional Tabs */}
              {activeTab === "pagos" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <Card>
                    <CardHeader><CardTitle>{t("myPayments") || "Mis Pagos"}</CardTitle></CardHeader>
                    <CardContent><p className="text-gray-500">{t("noPaymentHistory") || "No hay historial de pagos disponible."}</p></CardContent>
                  </Card>
                </div>
              )}
              
              {activeTab === "recomendaciones" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <Card>
                    <CardHeader><CardTitle>{t("recommendations") || "Recomendaciones"}</CardTitle></CardHeader>
                    <CardContent><p className="text-gray-500">{t("noRecommendations") || "No hay recomendaciones disponibles."}</p></CardContent>
                  </Card>
                </div>
              )}
              
              {activeTab === "premios" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <Card>
                    <CardHeader><CardTitle>{t("myAwards") || "Mis Premios"}</CardTitle></CardHeader>
                    <CardContent><p className="text-gray-500">{t("noAwards") || "No hay premios disponibles."}</p></CardContent>
                  </Card>
                </div>
              )}
            </div>
          </ZoomableSection>
        </div>
      </div>
    </>
  );
}

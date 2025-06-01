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
  Mail,
  Phone,
  MapPin,
  Calendar,
  Upload,
  Droplet,
  Zap,
  Paintbrush,
  Hammer,
  Construction,
  Search,
  CreditCard,
  ThumbsUp,
  Award
} from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/layout/Header";
import { SidebarParticular } from "@/components/layout/SidebarParticular";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Define service provider type
interface ServiceProvider {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  location: string;
  image: string;
}

export default function ParticularDashboard() {
  const [activeTab, setActiveTab] = useState("perfil");
  const { t } = useLanguage();
  
  // Sample service providers data
  const serviceProviders: ServiceProvider[] = [
    { 
      id: "1", 
      name: "Fontanería Express", 
      category: "Fontanería", 
      rating: 4.8, 
      reviews: 124, 
      location: "Madrid", 
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
    },
    { 
      id: "2", 
      name: "Electricidad Rápida", 
      category: "Electricidad", 
      rating: 4.6, 
      reviews: 98, 
      location: "Barcelona", 
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80" 
    },
    { 
      id: "3", 
      name: "Pinturas Modernas", 
      category: "Pintura", 
      rating: 4.9, 
      reviews: 156, 
      location: "Valencia", 
      image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
    },
    { 
      id: "4", 
      name: "Carpintería Artesanal", 
      category: "Carpintería", 
      rating: 4.7, 
      reviews: 87, 
      location: "Sevilla", 
      image: "https://images.unsplash.com/photo-1622150162806-409d3a83a585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
    },
    { 
      id: "5", 
      name: "Albañilería Profesional", 
      category: "Albañilería", 
      rating: 4.5, 
      reviews: 112, 
      location: "Zaragoza", 
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
    },
    { 
      id: "6", 
      name: "Techadores Expertos", 
      category: "Techado", 
      rating: 4.4, 
      reviews: 76, 
      location: "Málaga", 
      image: "https://images.unsplash.com/photo-1598252976330-b8a1461d47c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
    }
  ];

  // Sample favorite providers
  const favoriteProviders = serviceProviders.slice(0, 3);

  // Sample properties
  const properties = [
    {
      id: "1",
      name: "Apartamento en Centro",
      address: "Calle Gran Vía 25, Madrid",
      type: "Apartamento",
      size: "85m²",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: "2",
      name: "Casa en la Playa",
      address: "Avenida Marítima 12, Málaga",
      type: "Casa",
      size: "120m²",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    }
  ];

  return (
    <>
      <Head>
        <title>{t('particular')} | {t('handyman')}</title>
        <meta name='description' content={t('particularDesc')} />
      </Head>
      
      <Header />
      
      <div className='flex h-screen bg-gray-100 pt-16'>
        {/* Sidebar */}
        <SidebarParticular activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">
              {activeTab === "perfil" ? t("myProfile") : 
               activeTab === "presupuesto" ? t("requestQuote") :
               activeTab === "proveedores" ? t("serviceProviders") :
               activeTab === "favoritos" ? t("myFavorites") :
               activeTab === "propiedades" ? t("myProperties") :
               activeTab === "notificaciones" ? t("notifications") :
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
                          
                          <div>
                            <Label htmlFor="address">{t("mainAddress")}</Label>
                            <Input id="address" value="Calle Gran Vía 25, 5B, 28013, Madrid" readOnly className="bg-gray-50" />
                          </div>
                          
                          <div className="pt-4 border-t">
                            <h3 className="font-medium text-lg mb-2">{t("contactPreferences")}</h3>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="contact-email" checked readOnly />
                                <Label htmlFor="contact-email" className="cursor-pointer">{t("email")}</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="contact-phone" checked readOnly />
                                <Label htmlFor="contact-phone" className="cursor-pointer">{t("phoneLabel")}</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="contact-sms" readOnly />
                                <Label htmlFor="contact-sms" className="cursor-pointer">SMS</Label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="mt-4">
                      <CardHeader>
                        <CardTitle>{t("serviceHistory")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="border rounded-lg p-4">
                            <div className="flex justify-between">
                              <div>
                                <Badge className="mb-1">{t("plumbing")}</Badge>
                                <h4 className="font-bold">{t("leakRepair")}</h4>
                                <p className="text-sm text-gray-500">Fontanería Express - 15/04/2025</p>
                              </div>
                              <div className="flex items-center">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      className={`h-4 w-4 ${star <= 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <div className="flex justify-between">
                              <div>
                                <Badge className="mb-1">{t("electrical")}</Badge>
                                <h4 className="font-bold">{t("lightInstallation")}</h4>
                                <p className="text-sm text-gray-500">Electricidad Rápida - 02/03/2025</p>
                              </div>
                              <div className="flex items-center">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      className={`h-4 w-4 ${star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                                    />
                                  ))}
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
            
            {/* Solicitar Presupuesto Tab */}
            {activeTab === "presupuesto" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">{t("requestQuote")}</h2>
                <Card>
                  <CardContent className="p-6">
                    <form className="space-y-6">
                      <div>
                        <Label htmlFor="service-type" className="text-base font-medium">{t("serviceType")}</Label>
                        <select id="service-type" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
                          <option value="">{t("selectServiceType")}</option>
                          <option value="plumbing">{t("plumbing")}</option>
                          <option value="electrical">{t("electrical")}</option>
                          <option value="painting">{t("painting")}</option>
                          <option value="carpentry">{t("carpentry")}</option>
                          <option value="masonry">{t("masonry")}</option>
                          <option value="roofing">{t("roofing")}</option>
                          <option value="cleaning">{t("cleaning")}</option>
                          <option value="gardening">{t("gardening")}</option>
                          <option value="other">{t("other")}</option>
                        </select>
                      </div>
                      
                      <div>
                        <Label htmlFor="service-title" className="text-base font-medium">{t("serviceTitle")}</Label>
                        <Input id="service-title" className="mt-1" placeholder={t("exampleLeakRepair")} />
                      </div>
                      
                      <div>
                        <Label htmlFor="service-description" className="text-base font-medium">{t("detailedDescription")}</Label>
                        <Textarea id="service-description" className="mt-1" rows={5} placeholder={t("describeServiceNeeded")} />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="service-location" className="text-base font-medium">{t("location")}</Label>
                          <Input id="service-location" className="mt-1" placeholder={t("serviceLocationAddress")} />
                        </div>
                        <div>
                          <Label htmlFor="service-date" className="text-base font-medium">{t("preferredDate")}</Label>
                          <Input id="service-date" type="date" className="mt-1" />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="service-budget" className="text-base font-medium">{t("estimatedBudgetOptional")}</Label>
                        <Input id="service-budget" className="mt-1" placeholder="€" />
                      </div>
                      
                      <div>
                        <Label className="text-base font-medium">{t("photosOptional")}</Label>
                        <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">{t("dragDropOrClick")}</p>
                          <Button variant="outline" size="sm" className="mt-2">{t("selectFiles")}</Button>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="service-urgency" className="text-base font-medium">{t("urgencyLevel")}</Label>
                        <select id="service-urgency" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
                          <option>{t("lowNextWeeks")}</option>
                          <option>{t("mediumNextDays")}</option>
                          <option>{t("highAsap")}</option>
                          <option>{t("urgentToday")}</option>
                        </select>
                      </div>
                      
                      <Button className="w-full">{t("requestQuotes")}</Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Proveedores de Servicios Tab */}
            {activeTab === "proveedores" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">{t("serviceProviders")}</h2>
                  <div className="relative w-64">
                    <Input placeholder={t("searchProviders")} className="pr-10" />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {serviceProviders.map((provider) => (
                    <Card key={provider.id} className="overflow-hidden">
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={provider.image} 
                          alt={provider.name} 
                          className="w-full h-full object-cover"
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
                          <span className="text-sm text-gray-600">{provider.rating} ({provider.reviews} {t("reviews")})</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{provider.location}</span>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <Button variant="outline" size="sm">{t("viewProfile")}</Button>
                          <Button size="sm">{t("request")}</Button>
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
            
            {/* Mis Favoritos Tab */}
            {activeTab === "favoritos" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">{t("myFavoriteProviders")}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteProviders.map((provider) => (
                    <Card key={provider.id} className="overflow-hidden">
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={provider.image} 
                          alt={provider.name} 
                          className="w-full h-full object-cover"
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
                          <span className="text-sm text-gray-600">{provider.rating} ({provider.reviews} {t("reviews")})</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{provider.location}</span>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <Button variant="outline" size="sm">{t("viewProfile")}</Button>
                          <Button size="sm">{t("request")}</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {favoriteProviders.length === 0 && (
                  <div className="text-center py-12">
                    <Star className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">{t("noFavoriteProviders")}</h3>
                    <p className="text-gray-500 mb-4">{t("addFavoriteProvidersDesc")}</p>
                    <Button onClick={() => setActiveTab("proveedores")}>{t("exploreProviders")}</Button>
                  </div>
                )}
              </div>
            )}
            
            {/* Mis Propiedades Tab */}
            {activeTab === "propiedades" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">{t("myProperties")}</h2>
                  <Button>{t("addProperty")}</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {properties.map((property) => (
                    <Card key={property.id} className="overflow-hidden">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={property.image} 
                          alt={property.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg">{property.name === "Apartamento en Centro" ? t("apartmentInCenter") : property.name === "Casa en la Playa" ? t("beachHouse") : property.name}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{property.address}</span>
                        </div>
                        <div className="flex justify-between mt-2">
                          <Badge variant="outline">{property.type === "Apartamento" ? t("apartment") : property.type === "Casa" ? t("house") : property.type}</Badge>
                          <Badge variant="outline">{property.size}</Badge>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <Button variant="outline" size="sm">{t("viewDetails")}</Button>
                          <Button size="sm">{t("manage")}</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {properties.length === 0 && (
                  <div className="text-center py-12">
                    <Home className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">{t("noPropertiesRegistered")}</h3>
                    <p className="text-gray-500 mb-4">{t("addPropertiesDesc")}</p>
                    <Button>{t("addProperty")}</Button>
                  </div>
                )}
              </div>
            )}
            
            {/* Notificaciones Tab */}
            {activeTab === "notificaciones" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">{t("notifications")}</h2>
                
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
                  
                  <Card className="border-l-4 border-yellow-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">{t("appointmentReminder")}</h3>
                          <p className="text-sm text-gray-600 mt-1">{t("appointmentReminderDesc")}</p>
                        </div>
                        <span className="text-xs text-gray-500">{t("daysAgo")}</span>
                      </div>
                      <div className="mt-2 flex justify-end">
                        <Button variant="outline" size="sm" className="mr-2">{t("reschedule")}</Button>
                        <Button size="sm">{t("confirm")}</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Button variant="outline">{t("viewAllNotifications")}</Button>
                </div>
              </div>
            )}
            
            {/* Configuración Tab */}
            {activeTab === "configuracion" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">{t("configuration")}</h2>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("accountPreferences")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="language">{t("language")}</Label>
                          <select id="language" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
                            <option>{t("spanish")}</option>
                            <option>{t("english")}</option>
                            <option>{t("catalan")}</option>
                          </select>
                        </div>
                        
                        <div>
                          <Label htmlFor="notifications">{t("notifications")}</Label>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between">
                              <span>{t("emailNotifications")}</span>
                              <input type="checkbox" checked readOnly />
                            </div>
                            <div className="flex items-center justify-between">
                              <span>{t("pushNotifications")}</span>
                              <input type="checkbox" checked readOnly />
                            </div>
                            <div className="flex items-center justify-between">
                              <span>{t("smsNotifications")}</span>
                              <input type="checkbox" readOnly />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="privacy">{t("privacy")}</Label>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between">
                              <span>{t("profileVisibleToProviders")}</span>
                              <input type="checkbox" checked readOnly />
                            </div>
                            <div className="flex items-center justify-between">
                              <span>{t("shareServiceHistory")}</span>
                              <input type="checkbox" readOnly />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("security")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Button variant="outline" className="w-full">{t("changePassword")}</Button>
                        </div>
                        <div>
                          <Button variant="outline" className="w-full">{t("setupTwoFactor")}</Button>
                        </div>
                        <div>
                          <Button variant="outline" className="w-full">{t("manageConnectedDevices")}</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("dataAndPrivacy")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Button variant="outline" className="w-full">{t("downloadMyData")}</Button>
                        </div>
                        <div>
                          <Button variant="outline" className="w-full">{t("deleteMyAccount")}</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

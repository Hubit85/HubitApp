
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
  Search
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
              {activeTab === "perfil" ? "Mi Perfil" : 
               activeTab === "presupuesto" ? "Solicitar Presupuesto" :
               activeTab === "proveedores" ? "Proveedores de Servicios" :
               activeTab === "favoritos" ? "Mis Favoritos" :
               activeTab === "propiedades" ? "Mis Propiedades" :
               activeTab === "notificaciones" ? "Notificaciones" :
               "Configuración"}
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
                        <p className="text-gray-500 mb-4">Particular</p>
                        <Button className="w-full">Editar Perfil</Button>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="md:w-2/3">
                    <Card>
                      <CardHeader>
                        <CardTitle>Información Personal</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="name">Nombre Completo</Label>
                              <Input id="name" value="Carlos García Martínez" readOnly className="bg-gray-50" />
                            </div>
                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input id="email" value="carlos.garcia@example.com" readOnly className="bg-gray-50" />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="phone">Teléfono</Label>
                              <Input id="phone" value="+34 612 345 678" readOnly className="bg-gray-50" />
                            </div>
                            <div>
                              <Label htmlFor="location">Ubicación</Label>
                              <Input id="location" value="Madrid, España" readOnly className="bg-gray-50" />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="address">Dirección Principal</Label>
                            <Input id="address" value="Calle Gran Vía 25, 5B, 28013, Madrid" readOnly className="bg-gray-50" />
                          </div>
                          
                          <div className="pt-4 border-t">
                            <h3 className="font-medium text-lg mb-2">Preferencias de Contacto</h3>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="contact-email" checked readOnly />
                                <Label htmlFor="contact-email" className="cursor-pointer">Email</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="contact-phone" checked readOnly />
                                <Label htmlFor="contact-phone" className="cursor-pointer">Teléfono</Label>
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
                        <CardTitle>Historial de Servicios</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="border rounded-lg p-4">
                            <div className="flex justify-between">
                              <div>
                                <Badge className="mb-1">Fontanería</Badge>
                                <h4 className="font-bold">Reparación de Fuga</h4>
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
                                <Badge className="mb-1">Electricidad</Badge>
                                <h4 className="font-bold">Instalación de Luces</h4>
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
                <h2 className="text-2xl font-bold mb-4">Solicitar Presupuesto</h2>
                <Card>
                  <CardContent className="p-6">
                    <form className="space-y-6">
                      <div>
                        <Label htmlFor="service-type" className="text-base font-medium">Tipo de Servicio</Label>
                        <select id="service-type" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
                          <option value="">Selecciona un tipo de servicio</option>
                          <option value="plumbing">Fontanería</option>
                          <option value="electrical">Electricidad</option>
                          <option value="painting">Pintura</option>
                          <option value="carpentry">Carpintería</option>
                          <option value="masonry">Albañilería</option>
                          <option value="roofing">Techado</option>
                          <option value="cleaning">Limpieza</option>
                          <option value="gardening">Jardinería</option>
                          <option value="other">Otro</option>
                        </select>
                      </div>
                      
                      <div>
                        <Label htmlFor="service-title" className="text-base font-medium">Título del Servicio</Label>
                        <Input id="service-title" className="mt-1" placeholder="Ej: Reparación de fuga en baño" />
                      </div>
                      
                      <div>
                        <Label htmlFor="service-description" className="text-base font-medium">Descripción Detallada</Label>
                        <Textarea id="service-description" className="mt-1" rows={5} placeholder="Describe detalladamente el servicio que necesitas..." />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="service-location" className="text-base font-medium">Ubicación</Label>
                          <Input id="service-location" className="mt-1" placeholder="Dirección donde se realizará el servicio" />
                        </div>
                        <div>
                          <Label htmlFor="service-date" className="text-base font-medium">Fecha Preferida</Label>
                          <Input id="service-date" type="date" className="mt-1" />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="service-budget" className="text-base font-medium">Presupuesto Estimado (Opcional)</Label>
                        <Input id="service-budget" className="mt-1" placeholder="€" />
                      </div>
                      
                      <div>
                        <Label className="text-base font-medium">Fotos (Opcional)</Label>
                        <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">Arrastra y suelta fotos aquí o haz clic para seleccionar</p>
                          <Button variant="outline" size="sm" className="mt-2">Seleccionar Archivos</Button>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="service-urgency" className="text-base font-medium">Nivel de Urgencia</Label>
                        <select id="service-urgency" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
                          <option>Baja - En las próximas semanas</option>
                          <option>Media - En los próximos días</option>
                          <option>Alta - Lo antes posible</option>
                          <option>Urgente - Hoy mismo</option>
                        </select>
                      </div>
                      
                      <Button className="w-full">Solicitar Presupuestos</Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Proveedores de Servicios Tab */}
            {activeTab === "proveedores" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Proveedores de Servicios</h2>
                  <div className="relative w-64">
                    <Input placeholder="Buscar proveedores..." className="pr-10" />
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
                          <span className="text-sm text-gray-600">{provider.rating} ({provider.reviews} reseñas)</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{provider.location}</span>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <Button variant="outline" size="sm">Ver Perfil</Button>
                          <Button size="sm">Solicitar</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Button variant="outline">Cargar Más Proveedores</Button>
                </div>
              </div>
            )}
            
            {/* Mis Favoritos Tab */}
            {activeTab === "favoritos" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Mis Proveedores Favoritos</h2>
                
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
                          <span className="text-sm text-gray-600">{provider.rating} ({provider.reviews} reseñas)</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{provider.location}</span>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <Button variant="outline" size="sm">Ver Perfil</Button>
                          <Button size="sm">Solicitar</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {favoriteProviders.length === 0 && (
                  <div className="text-center py-12">
                    <Star className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No tienes proveedores favoritos</h3>
                    <p className="text-gray-500 mb-4">Añade proveedores a tus favoritos para acceder rápidamente a ellos</p>
                    <Button onClick={() => setActiveTab("proveedores")}>Explorar Proveedores</Button>
                  </div>
                )}
              </div>
            )}
            
            {/* Mis Propiedades Tab */}
            {activeTab === "propiedades" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Mis Propiedades</h2>
                  <Button>Añadir Propiedad</Button>
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
                        <h3 className="font-bold text-lg">{property.name}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{property.address}</span>
                        </div>
                        <div className="flex justify-between mt-2">
                          <Badge variant="outline">{property.type}</Badge>
                          <Badge variant="outline">{property.size}</Badge>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <Button variant="outline" size="sm">Ver Detalles</Button>
                          <Button size="sm">Gestionar</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {properties.length === 0 && (
                  <div className="text-center py-12">
                    <Home className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No tienes propiedades registradas</h3>
                    <p className="text-gray-500 mb-4">Añade tus propiedades para gestionar sus servicios</p>
                    <Button>Añadir Propiedad</Button>
                  </div>
                )}
              </div>
            )}
            
            {/* Notificaciones Tab */}
            {activeTab === "notificaciones" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Notificaciones</h2>
                
                <div className="space-y-4">
                  <Card className="border-l-4 border-blue-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">Presupuesto Recibido</h3>
                          <p className="text-sm text-gray-600 mt-1">Has recibido un nuevo presupuesto para "Reparación de Fuga" de Fontanería Express.</p>
                        </div>
                        <span className="text-xs text-gray-500">Hace 2 horas</span>
                      </div>
                      <div className="mt-2 flex justify-end">
                        <Button size="sm">Ver Presupuesto</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-l-4 border-green-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">Servicio Completado</h3>
                          <p className="text-sm text-gray-600 mt-1">El servicio "Instalación de Luces" ha sido marcado como completado. Por favor, valora tu experiencia.</p>
                        </div>
                        <span className="text-xs text-gray-500">Ayer</span>
                      </div>
                      <div className="mt-2 flex justify-end">
                        <Button size="sm">Valorar Servicio</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-l-4 border-yellow-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">Recordatorio de Cita</h3>
                          <p className="text-sm text-gray-600 mt-1">Recuerda que tienes una cita programada mañana a las 10:00 con Carpintería Artesanal.</p>
                        </div>
                        <span className="text-xs text-gray-500">2 días atrás</span>
                      </div>
                      <div className="mt-2 flex justify-end">
                        <Button variant="outline" size="sm" className="mr-2">Reprogramar</Button>
                        <Button size="sm">Confirmar</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Button variant="outline">Ver Todas las Notificaciones</Button>
                </div>
              </div>
            )}
            
            {/* Configuración Tab */}
            {activeTab === "configuracion" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Configuración</h2>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Preferencias de Cuenta</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="language">Idioma</Label>
                          <select id="language" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
                            <option>Español</option>
                            <option>English</option>
                            <option>Català</option>
                          </select>
                        </div>
                        
                        <div>
                          <Label htmlFor="notifications">Notificaciones</Label>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between">
                              <span>Notificaciones por Email</span>
                              <input type="checkbox" checked readOnly />
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Notificaciones Push</span>
                              <input type="checkbox" checked readOnly />
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Notificaciones SMS</span>
                              <input type="checkbox" readOnly />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="privacy">Privacidad</Label>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between">
                              <span>Perfil Visible para Proveedores</span>
                              <input type="checkbox" checked readOnly />
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Compartir Historial de Servicios</span>
                              <input type="checkbox" readOnly />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Seguridad</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Button variant="outline" className="w-full">Cambiar Contraseña</Button>
                        </div>
                        <div>
                          <Button variant="outline" className="w-full">Configurar Autenticación de Dos Factores</Button>
                        </div>
                        <div>
                          <Button variant="outline" className="w-full">Gestionar Dispositivos Conectados</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Datos y Privacidad</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Button variant="outline" className="w-full">Descargar Mis Datos</Button>
                        </div>
                        <div>
                          <Button variant="outline" className="w-full">Eliminar Mi Cuenta</Button>
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

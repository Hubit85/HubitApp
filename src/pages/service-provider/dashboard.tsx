import React, { useState } from "react";
import Head from "next/head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { SidebarServiceProvider } from "@/components/layout/SidebarServiceProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  TrendingUp, 
  Star, 
  DollarSign, 
  Users, 
  Calendar, 
  Clock,
  Filter,
  Search,
  User,
  Building,
  Globe,
  Phone,
  Mail,
  MapPin,
  Edit,
  Save,
  Briefcase,
  Wrench,
  PaintBucket,
  Zap,
  Droplets,
  TreePine,
  Building2,
  Home,
  Hammer
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ZoomableSection from "@/components/ZoomableSection";
import ProviderServiceHistoryCard from "@/components/ratings/ProviderServiceHistoryCard";

export default function ServiceProviderDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [customerTypeFilter, setCustomerTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useLanguage();

  // Estados para el perfil de la empresa
  const [companyProfile, setCompanyProfile] = useState({
    companyName: "Servicios Integrales Madrid",
    description: "Empresa especializada en servicios de mantenimiento y reformas para comunidades y particulares",
    website: "www.serviciosintegrales-madrid.com",
    email: "info@serviciosintegrales-madrid.com",
    phone: "+34 91 123 45 67",
    address: "Calle Alcalá 123, Madrid",
    cif: "B12345678",
    founded: "2015",
    employees: "15-20",
    serviceAreas: ["Madrid", "Alcalá de Henares", "Getafe", "Leganés"],
    specializations: ["Mantenimiento integral", "Reformas", "Servicios urgentes"],
    certifications: ["ISO 9001", "Certificado instalador autorizado", "Seguro responsabilidad civil"],
    allServices: true,
    workingHours: "Lunes a Viernes: 8:00 - 18:00, Sábados: 9:00 - 14:00"
  });

  // Servicios profesionales con precios
  const professionalServices = [
    {
      id: "albañileria",
      name: "Albañilería",
      icon: Building2,
      description: "Trabajos de construcción y reparación",
      priceType: "hour",
      price: 35,
      currency: "€",
      services: ["Reparación de muros", "Construcción de tabiques", "Alicatado", "Enfoscados"]
    },
    {
      id: "pintura",
      name: "Pintura",
      icon: PaintBucket,
      description: "Pintura interior y exterior",
      priceType: "m2",
      price: 12,
      currency: "€",
      services: ["Pintura de fachadas", "Pintura interior", "Lacados", "Barnizados"]
    },
    {
      id: "electricidad",
      name: "Electricidad",
      icon: Zap,
      description: "Instalaciones y reparaciones eléctricas",
      priceType: "hour",
      price: 45,
      currency: "€",
      services: ["Instalaciones eléctricas", "Reparación de averías", "Cuadros eléctricos", "Iluminación"]
    },
    {
      id: "fontaneria",
      name: "Fontanería",
      icon: Droplets,
      description: "Instalaciones y reparaciones de fontanería",
      priceType: "hour",
      price: 40,
      currency: "€",
      services: ["Reparación de tuberías", "Instalación de sanitarios", "Calefacción", "Desatascos"]
    },
    {
      id: "jardineria",
      name: "Jardinería",
      icon: TreePine,
      description: "Mantenimiento de jardines y zonas verdes",
      priceType: "m2",
      price: 8,
      currency: "€",
      services: ["Poda de árboles", "Plantación", "Sistemas de riego", "Diseño paisajístico"]
    },
    {
      id: "ascensores",
      name: "Mantenimiento de Ascensores",
      icon: Building,
      description: "Mantenimiento y reparación de ascensores",
      priceType: "hour",
      price: 65,
      currency: "€",
      services: ["Mantenimiento preventivo", "Reparaciones", "Modernización", "Revisiones técnicas"]
    },
    {
      id: "fachadas",
      name: "Fachadas",
      icon: Home,
      description: "Rehabilitación y mantenimiento de fachadas",
      priceType: "m2",
      price: 25,
      currency: "€",
      services: ["Rehabilitación de fachadas", "Impermeabilización", "Aislamiento térmico", "Pintura exterior"]
    },
    {
      id: "tejados",
      name: "Tejados",
      icon: Hammer,
      description: "Reparación y mantenimiento de cubiertas",
      priceType: "m2",
      price: 30,
      currency: "€",
      services: ["Reparación de goteras", "Impermeabilización", "Cambio de tejas", "Canalones"]
    }
  ];

  // Mock data para historial de servicios del proveedor
  const providerServiceHistory = [
    {
      id: "1",
      serviceName: t("plumbingRepair"),
      customerName: "Carlos García",
      customerType: "particular" as const,
      customerImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      category: "plumbing",
      date: "15 Mar 2024",
      cost: 85.50,
      status: "completed" as const,
      rating: 5,
      comment: t("excellentServiceComment"),
      location: "Madrid Centro",
      duration: "2 horas",
      clientId: "client_001"
    },
    {
      id: "2",
      serviceName: t("elevatorMaintenance"),
      customerName: "Comunidad Residencial Los Olivos",
      customerType: "community" as const,
      customerImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      category: "maintenance",
      date: "20 Mar 2024",
      cost: 450.00,
      status: "completed" as const,
      rating: 5,
      comment: t("excellentCommunityServiceComment"),
      location: "Edificio Central",
      duration: "4 horas",
      clientId: "community_001"
    },
    {
      id: "3",
      serviceName: t("electricalInstallation"),
      customerName: "María López",
      customerType: "particular" as const,
      customerImage: "https://images.unsplash.com/photo-1494790108755-2616b056ad01?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      category: "electrical",
      date: "22 Feb 2024",
      cost: 120.00,
      status: "completed" as const,
      rating: 4,
      comment: t("goodWorkComment"),
      location: "Madrid Centro",
      duration: "3 horas",
      clientId: "client_002"
    },
    {
      id: "4",
      serviceName: t("gatesCleaning"),
      customerName: "Comunidad Jardines del Sur",
      customerType: "community" as const,
      customerImage: "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      category: "cleaning",
      date: "18 Mar 2024",
      cost: 180.00,
      status: "completed" as const,
      rating: 4,
      comment: t("goodWorkStairsComment"),
      location: "Todos los portales",
      duration: "3 horas",
      clientId: "community_002"
    },
    {
      id: "5",
      serviceName: t("generalCleaning"),
      customerName: "Ana Martínez",
      customerType: "particular" as const,
      customerImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      category: "cleaning",
      date: "5 Dec 2023",
      cost: 60.00,
      status: "pending" as const,
      location: "Madrid Centro",
      duration: "4 horas",
      clientId: "client_003"
    }
  ];

  const getActiveTabTitle = () => {
    switch (activeTab) {
      case "overview": return t("overview");
      case "profile": return "Mi Perfil";
      case "services": return "Servicios Profesionales";
      case "requests": return t("serviceRequests");
      case "bids": return t("activeBids");
      case "historial": return t("serviceHistory");
      case "reviews": return t("reviews");
      case "earnings": return t("earnings");
      case "schedule": return t("schedule");
      case "notifications": return t("notifications");
      case "settings": return t("settings");
      default: return t("serviceProvider");
    }
  };

  const filteredProviderServiceHistory = providerServiceHistory.filter(service => {
    const customerTypeMatch = customerTypeFilter === "all" || service.customerType === customerTypeFilter;
    const statusMatch = statusFilter === "all" || service.status === statusFilter;
    const categoryMatch = categoryFilter === "all" || service.category === categoryFilter;
    return customerTypeMatch && statusMatch && categoryMatch;
  });

  const handleViewDetails = (serviceId: string) => {
    console.log("View service details:", serviceId);
  };

  const handleContactCustomer = (serviceId: string) => {
    console.log("Contact customer:", serviceId);
  };

  const handleViewRating = (serviceId: string) => {
    console.log("View rating details:", serviceId);
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    console.log("Company profile saved:", companyProfile);
  };

  return (
    <>
      <Head>
        <title>{t("serviceProvider")} | {t("hubit")}</title>
        <meta name="description" content={t("serviceProviderDesc")} />
      </Head>
      
      <Header />
      
      <div className="flex h-screen bg-gray-100 pt-16">
        <SidebarServiceProvider activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 overflow-hidden">
          <ZoomableSection className="h-full overflow-auto" enableZoom={true} maxScale={3} minScale={0.5}>
            <div className="p-6 min-h-full">
              <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-gray-200 pb-2">
                {getActiveTabTitle()}
              </h1>
              
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card className="transition-all duration-200 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-medium">{t("totalServicesProvided")}</p>
                          <p className="text-3xl font-bold text-gray-900">47</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                          <TrendingUp className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="transition-all duration-200 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-medium">{t("averageCustomerRating")}</p>
                          <p className="text-3xl font-bold text-gray-900">4.7</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-full">
                          <Star className="h-6 w-6 text-yellow-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="transition-all duration-200 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-medium">{t("monthlyRevenue")}</p>
                          <p className="text-3xl font-bold text-gray-900">€2,847</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                          <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="transition-all duration-200 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-medium">{t("servicesThisMonth")}</p>
                          <p className="text-3xl font-bold text-gray-900">12</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                          <Calendar className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "historial" && (
                <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300">
                  <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <Label className="text-sm font-medium">{t("filterByCustomerType")}:</Label>
                      <select 
                        value={customerTypeFilter} 
                        onChange={(e) => setCustomerTypeFilter(e.target.value)}
                        className="px-3 py-1 border rounded-md text-sm"
                      >
                        <option value="all">{t("allCustomerTypes")}</option>
                        <option value="particular">{t("particularCustomers")}</option>
                        <option value="community">{t("communityCustomers")}</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
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
                        <option value="maintenance">{t("maintenance")}</option>
                        <option value="cleaning">{t("cleaning")}</option>
                      </select>
                    </div>
                  </div>

                  {filteredProviderServiceHistory.length > 0 ? (
                    <div className="space-y-4">
                      {filteredProviderServiceHistory.map((service) => (
                        <ProviderServiceHistoryCard
                          key={service.id}
                          service={service}
                          onViewDetails={handleViewDetails}
                          onContactCustomer={handleContactCustomer}
                          onViewRating={handleViewRating}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">{t("noServiceHistory")}</h3>
                      <p className="text-gray-500 mb-4">{t("noServiceHistory")}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "profile" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">{t("professionalProfile")}</h2>
                  <p className="text-gray-600">{t("manageOfferings")}</p>
                  {isEditing ? (
                    <div className="mt-4">
                      <Input 
                        value={companyProfile.companyName} 
                        onChange={(e) => setCompanyProfile(prev => ({ ...prev, companyName: e.target.value }))}
                        className="mb-2"
                      />
                      <Input 
                        value={companyProfile.description} 
                        onChange={(e) => setCompanyProfile(prev => ({ ...prev, description: e.target.value }))}
                        className="mb-2"
                      />
                      <Input 
                        value={companyProfile.website} 
                        onChange={(e) => setCompanyProfile(prev => ({ ...prev, website: e.target.value }))}
                        className="mb-2"
                      />
                      <Input 
                        value={companyProfile.email} 
                        onChange={(e) => setCompanyProfile(prev => ({ ...prev, email: e.target.value }))}
                        className="mb-2"
                      />
                      <Input 
                        value={companyProfile.phone} 
                        onChange={(e) => setCompanyProfile(prev => ({ ...prev, phone: e.target.value }))}
                        className="mb-2"
                      />
                      <Input 
                        value={companyProfile.address} 
                        onChange={(e) => setCompanyProfile(prev => ({ ...prev, address: e.target.value }))}
                        className="mb-2"
                      />
                      <Input 
                        value={companyProfile.cif} 
                        onChange={(e) => setCompanyProfile(prev => ({ ...prev, cif: e.target.value }))}
                        className="mb-2"
                      />
                      <Input 
                        value={companyProfile.founded} 
                        onChange={(e) => setCompanyProfile(prev => ({ ...prev, founded: e.target.value }))}
                        className="mb-2"
                      />
                      <Input 
                        value={companyProfile.employees} 
                        onChange={(e) => setCompanyProfile(prev => ({ ...prev, employees: e.target.value }))}
                        className="mb-2"
                      />
                      <Input 
                        value={companyProfile.serviceAreas.join(", ")} 
                        onChange={(e) => setCompanyProfile(prev => ({ ...prev, serviceAreas: e.target.value.split(", ") }))}
                        className="mb-2"
                      />
                      <Input 
                        value={companyProfile.specializations.join(", ")} 
                        onChange={(e) => setCompanyProfile(prev => ({ ...prev, specializations: e.target.value.split(", ") }))}
                        className="mb-2"
                      />
                      <Input 
                        value={companyProfile.certifications.join(", ")} 
                        onChange={(e) => setCompanyProfile(prev => ({ ...prev, certifications: e.target.value.split(", ") }))}
                        className="mb-2"
                      />
                      <Input 
                        value={companyProfile.allServices ? "true" : "false"} 
                        onChange={(e) => setCompanyProfile(prev => ({ ...prev, allServices: e.target.value === "true" }))}
                        className="mb-2"
                      />
                      <Input 
                        value={companyProfile.workingHours} 
                        onChange={(e) => setCompanyProfile(prev => ({ ...prev, workingHours: e.target.value }))}
                        className="mb-2"
                      />
                      <Button onClick={handleSaveProfile} className="mt-4">
                        <Save className="h-4 w-4 mr-2" />
                        {t("save")}
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <p className="text-gray-600">{companyProfile.companyName}</p>
                      <p className="text-gray-600">{companyProfile.description}</p>
                      <p className="text-gray-600">{companyProfile.website}</p>
                      <p className="text-gray-600">{companyProfile.email}</p>
                      <p className="text-gray-600">{companyProfile.phone}</p>
                      <p className="text-gray-600">{companyProfile.address}</p>
                      <p className="text-gray-600">{companyProfile.cif}</p>
                      <p className="text-gray-600">{companyProfile.founded}</p>
                      <p className="text-gray-600">{companyProfile.employees}</p>
                      <p className="text-gray-600">{companyProfile.serviceAreas.join(", ")}</p>
                      <p className="text-gray-600">{companyProfile.specializations.join(", ")}</p>
                      <p className="text-gray-600">{companyProfile.certifications.join(", ")}</p>
                      <p className="text-gray-600">{companyProfile.allServices ? "true" : "false"}</p>
                      <p className="text-gray-600">{companyProfile.workingHours}</p>
                      <Button onClick={() => setIsEditing(true)} className="mt-4">
                        <Edit className="h-4 w-4 mr-2" />
                        {t("edit")}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "services" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">{t("professionalServices")}</h2>
                  <p className="text-gray-600">{t("manageOfferings")}</p>
                  <div className="mt-4">
                    {professionalServices.map((service) => (
                      <div key={service.id} className="flex items-center mb-4">
                        <div className="mr-4">
                          <service.icon className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-gray-600">{service.name}</p>
                          <p className="text-gray-600">{service.description}</p>
                          <p className="text-gray-600">{service.priceType}: {service.price} {service.currency}</p>
                          <p className="text-gray-600">{service.services.join(", ")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "requests" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">{t("serviceRequests")}</h2>
                  <p className="text-gray-600">{t("noRequests")}</p>
                </div>
              )}

              {activeTab === "bids" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">{t("activeBids")}</h2>
                  <p className="text-gray-600">{t("noBidsInCategory")}</p>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">{t("reviews")}</h2>
                  <p className="text-gray-600">{t("noRecommendations")}</p>
                </div>
              )}

              {activeTab === "earnings" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">{t("earnings")}</h2>
                  <p className="text-gray-600">{t("monthlyRevenue")}: €2,847</p>
                </div>
              )}

              {activeTab === "schedule" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">{t("schedule")}</h2>
                  <p className="text-gray-600">{t("noUpcomingAppointments")}</p>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">{t("notifications")}</h2>
                  <p className="text-gray-600">{t("noData")}</p>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">{t("settings")}</h2>
                  <p className="text-gray-600">{t("accountPreferences")}</p>
                </div>
              )}
            </div>
          </ZoomableSection>
        </div>
      </div>
    </>
  );
}

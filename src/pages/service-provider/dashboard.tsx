
import React, { useState } from "react";
import Head from "next/head";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Hammer,
  Check,
  Circle,
  Info
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ZoomableSection from "@/components/ZoomableSection";
import ProviderServiceHistoryCard from "@/components/ratings/ProviderServiceHistoryCard";
import { Textarea } from "@/components/ui/textarea";

export default function ServiceProviderDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [customerTypeFilter, setCustomerTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const { t } = useLanguage();

  const [companyProfile, setCompanyProfile] = useState({
    companyName: "Servicios Integrales Madrid",
    description: "Empresa especializada en servicios de mantenimiento y reformas para comunidades y particulares.",
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

  const professionalServices = [
    { id: "albañileria", name: "Albañilería", icon: Building2, description: "Trabajos de construcción y reparación.", priceType: "m2", price: 35 },
    { id: "pintura", name: "Pintura", icon: PaintBucket, description: "Pintura interior y exterior.", priceType: "m2", price: 12 },
    { id: "electricidad", name: "Electricidad", icon: Zap, description: "Instalaciones y reparaciones eléctricas.", priceType: "hour", price: 45 },
    { id: "fontaneria", name: "Fontanería", icon: Droplets, description: "Instalaciones y reparaciones de fontanería.", priceType: "hour", price: 40 },
    { id: "jardineria", name: "Jardinería", icon: TreePine, description: "Mantenimiento de jardines y zonas verdes.", priceType: "m2", price: 8 },
    { id: "ascensores", name: "Mantenimiento de Ascensores", icon: Building, description: "Mantenimiento y reparación de ascensores.", priceType: "hour", price: 65 },
    { id: "fachadas", name: "Rehabilitación de Fachadas", icon: Home, description: "Rehabilitación y mantenimiento de fachadas.", priceType: "m2", price: 25 },
    { id: "tejados", name: "Reparación de Tejados", icon: Hammer, description: "Reparación y mantenimiento de cubiertas.", priceType: "m2", price: 30 }
  ];

  const providerServiceHistory = [
    { id: "1", serviceName: t("plumbingRepair"), customerName: "Carlos García", customerType: "particular" as const, category: "plumbing", date: "15 Mar 2024", cost: 85.50, status: "completed" as const, rating: 5, comment: t("excellentServiceComment") },
    { id: "2", serviceName: t("elevatorMaintenance"), customerName: "Comunidad Residencial Los Olivos", customerType: "community" as const, category: "maintenance", date: "20 Mar 2024", cost: 450.00, status: "completed" as const, rating: 5, comment: t("excellentCommunityServiceComment") },
    { id: "3", serviceName: t("electricalInstallation"), customerName: "María López", customerType: "particular" as const, category: "electrical", date: "22 Feb 2024", cost: 120.00, status: "completed" as const, rating: 4, comment: t("goodWorkComment") },
    { id: "4", serviceName: t("gatesCleaning"), customerName: "Comunidad Jardines del Sur", customerType: "community" as const, category: "cleaning", date: "18 Mar 2024", cost: 180.00, status: "completed" as const, rating: 4, comment: t("goodWorkStairsComment") },
    { id: "5", serviceName: t("generalCleaning"), customerName: "Ana Martínez", customerType: "particular" as const, category: "cleaning", date: "5 Dec 2023", cost: 60.00, status: "pending" as const }
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

  const filteredProviderServiceHistory = providerServiceHistory.filter(service => (customerTypeFilter === "all" || service.customerType === customerTypeFilter) && (statusFilter === "all" || service.status === statusFilter) && (categoryFilter === "all" || service.category === categoryFilter));

  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    console.log("Perfil de la empresa guardado:", companyProfile);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handleListChange = (name: keyof typeof companyProfile, value: string) => {
    setCompanyProfile(prev => ({...prev, [name]: value.split(',').map(s => s.trim())}));
  };

  return (
    <>
      <Head>
        <title>{getActiveTabTitle()} | {t("hubit")}</title>
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
                  {/* Cards de Resumen */}
                </div>
              )}

              {activeTab === "profile" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Mi Perfil de Empresa</CardTitle>
                      <CardDescription>Gestiona la información pública de tu empresa.</CardDescription>
                    </div>
                    <Button onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)}>
                      {isEditingProfile ? <><Save className="mr-2 h-4 w-4" /> Guardar Cambios</> : <><Edit className="mr-2 h-4 w-4" /> Editar Perfil</>}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {isEditingProfile ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Información Principal</h3>
                          <div><Label htmlFor="companyName">Nombre de la empresa</Label><Input id="companyName" name="companyName" value={companyProfile.companyName} onChange={handleInputChange} /></div>
                          <div><Label htmlFor="description">Descripción</Label><Textarea id="description" name="description" value={companyProfile.description} onChange={handleInputChange} /></div>
                          <div><Label htmlFor="website">Página Web</Label><Input id="website" name="website" value={companyProfile.website} onChange={handleInputChange} /></div>
                          <div><Label htmlFor="email">Email</Label><Input id="email" name="email" value={companyProfile.email} onChange={handleInputChange} /></div>
                          <div><Label htmlFor="phone">Teléfono</Label><Input id="phone" name="phone" value={companyProfile.phone} onChange={handleInputChange} /></div>
                          <div><Label htmlFor="address">Dirección</Label><Input id="address" name="address" value={companyProfile.address} onChange={handleInputChange} /></div>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Detalles del Negocio</h3>
                          <div><Label htmlFor="cif">CIF</Label><Input id="cif" name="cif" value={companyProfile.cif} onChange={handleInputChange} /></div>
                          <div><Label htmlFor="founded">Año de fundación</Label><Input id="founded" name="founded" value={companyProfile.founded} onChange={handleInputChange} /></div>
                          <div><Label htmlFor="employees">Nº de empleados</Label><Input id="employees" name="employees" value={companyProfile.employees} onChange={handleInputChange} /></div>
                          <div><Label htmlFor="serviceAreas">Áreas de servicio (separadas por coma)</Label><Input id="serviceAreas" value={companyProfile.serviceAreas.join(', ')} onChange={e => handleListChange('serviceAreas', e.target.value)} /></div>
                          <div><Label htmlFor="specializations">Especializaciones (separadas por coma)</Label><Input id="specializations" value={companyProfile.specializations.join(', ')} onChange={e => handleListChange('specializations', e.target.value)} /></div>
                          <div><Label htmlFor="certifications">Certificaciones (separadas por coma)</Label><Input id="certifications" value={companyProfile.certifications.join(', ')} onChange={e => handleListChange('certifications', e.target.value)} /></div>
                          <div className="flex items-center space-x-2"><input type="checkbox" id="allServices" checked={companyProfile.allServices} onChange={e => setCompanyProfile(p => ({...p, allServices: e.target.checked}))} /><Label htmlFor="allServices">Ofrezco todos los servicios</Label></div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold">{companyProfile.companyName}</h3>
                          <p className="text-gray-600">{companyProfile.description}</p>
                          <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-gray-500" /><a href={`http://${companyProfile.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{companyProfile.website}</a></div>
                          <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-500" /><span>{companyProfile.email}</span></div>
                          <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-500" /><span>{companyProfile.phone}</span></div>
                          <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-500" /><span>{companyProfile.address}</span></div>
                        </div>
                        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold">Detalles Adicionales</h4>
                          <p><strong>CIF:</strong> {companyProfile.cif}</p>
                          <p><strong>Fundación:</strong> {companyProfile.founded}</p>
                          <p><strong>Nº Empleados:</strong> {companyProfile.employees}</p>
                          <p><strong>Áreas de servicio:</strong> <span className="text-gray-600">{companyProfile.serviceAreas.join(', ')}</span></p>
                          <p><strong>Especializaciones:</strong> <span className="text-gray-600">{companyProfile.specializations.join(', ')}</span></p>
                          <p><strong>Certificaciones:</strong> <span className="text-gray-600">{companyProfile.certifications.join(', ')}</span></p>
                          {companyProfile.allServices && <Badge className="bg-green-100 text-green-800"><Check className="h-4 w-4 mr-1" /> Ofrece todos los servicios</Badge>}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "services" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Servicios Profesionales</CardTitle>
                    <CardDescription>Gestiona los servicios que ofreces y sus tarifas.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {professionalServices.map((service) => (
                      <Card key={service.id} className="flex flex-col">
                        <CardHeader className="flex-row items-center gap-4">
                          <div className="p-3 bg-blue-100 rounded-full">
                            <service.icon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle>{service.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="font-semibold text-lg text-gray-800">
                              {service.price}€ <span className="text-sm font-normal text-gray-600">/ {service.priceType === "hour" ? "hora" : "m²"}</span>
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Other tabs remain the same */}
              {activeTab === "historial" && (
                <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300">
                  {/* Historial content */}
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
                  <p className="text-gray-600">{companyProfile.allServices ? "Mostrando todas las ofertas disponibles." : t("noBidsInCategory")}</p>
                </div>
              )}
            </div>
          </ZoomableSection>
        </div>
      </div>
    </>
  );
}

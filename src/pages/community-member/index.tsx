import React, { useState } from "react";
import Head from "next/head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/layout/Header";
import { SidebarCommunityMember } from "@/components/layout/SidebarCommunityMember";
import ZoomableSection from "@/components/ZoomableSection";
import ServiceHistoryCard from "@/components/ratings/ServiceHistoryCard";
import RatingModal from "@/components/ratings/RatingModal";
import Image from "next/image";
import { Property, PropertyFormData } from "@/types/property";
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
  Activity,
  Trash2,
  ExternalLink,
  CheckCheck,
  Bed,
  Bath,
  Ruler,
  Calendar as CalendarIcon,
  ArrowUpDown,
  ChevronDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";

export default function CommunityMemberDashboard() {
  const [activeTab, setActiveTab] = useState("perfil");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedServiceForRating, setSelectedServiceForRating] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "service" | "cost" | "provider" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isEditing, setIsEditing] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [selectedIssueType, setSelectedIssueType] = useState("maintenance");
  const [attachedImages, setAttachedImages] = useState<File[]>([]);
  
  // Estados para propiedades
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [propertyFormData, setPropertyFormData] = useState<PropertyFormData>({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "España",
    type: "apartment",
    status: "owned",
    size: undefined,
    bedrooms: undefined,
    bathrooms: undefined,
    yearBuilt: undefined,
    description: "",
    communityName: "",
    portalNumber: "",
    apartmentNumber: ""
  });
  
  const [userProperties, setUserProperties] = useState<Property[]>([
    {
      id: "1",
      name: "Apartamento Centro Madrid",
      address: "Calle Mayor, 123",
      city: "Madrid",
      postalCode: "28013",
      country: "España",
      type: "apartment",
      status: "owned",
      size: 85,
      bedrooms: 2,
      bathrooms: 1,
      yearBuilt: 2015,
      description: "Luminoso apartamento en el centro histórico",
      communityInfo: {
        communityName: "Residencial Los Pinos",
        portalNumber: "Portal A",
        apartmentNumber: "3º A",
        totalUnits: 45,
        managementCompany: "Gestiones Madrid"
      },
      images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
      isCurrentlySelected: true,
      createdAt: new Date("2023-01-15"),
      updatedAt: new Date("2024-01-15")
    },
    {
      id: "2",
      name: "Casa Familiar Pozuelo",
      address: "Avenida de Europa, 45",
      city: "Pozuelo de Alarcón",
      postalCode: "28224",
      country: "España",
      type: "house",
      status: "owned",
      size: 180,
      bedrooms: 4,
      bathrooms: 3,
      yearBuilt: 2010,
      description: "Casa unifamiliar con jardín y piscina",
      images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
      isCurrentlySelected: false,
      createdAt: new Date("2023-06-20"),
      updatedAt: new Date("2024-01-10")
    }
  ]);

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
      message: t("goodMorningQuestion"),
      timestamp: "10:30",
      isAdmin: false
    },
    {
      id: 2,
      sender: "Administrador",
      apartment: "Admin",
      message: t("adminConfirmation"),
      timestamp: "10:45",
      isAdmin: true
    },
    {
      id: 3,
      sender: "María López",
      apartment: "1º C",
      message: t("checkLightingRequest"),
      timestamp: "11:00",
      isAdmin: false
    }
  ];

  // Contratos de la comunidad
  const communityContracts = [
    {
      id: "1",
      title: t("elevatorMaintenanceContract"),
      provider: "Ascensores Madrid",
      startDate: "01/01/2024",
      endDate: "31/12/2024",
      value: "€5,400/año",
      status: "active",
      description: t("preventiveMaintenanceAndEmergencyRepairs")
    },
    {
      id: "2",
      title: t("cleaningService"),
      provider: "Limpiezas Comunidad",
      startDate: "15/02/2024",
      endDate: "14/02/2025",
      value: "€2,800/año",
      status: "active",
      description: t("weeklyCleaningCommonAreasPortals")
    },
    {
      id: "3",
      title: t("gardenMaintenance"),
      provider: "Jardines Verdes",
      startDate: "01/03/2024",
      endDate: "30/11/2024",
      value: "€1,200/temporada",
      status: "pending",
      description: t("seasonalMaintenanceGardensGreenAreas")
    }
  ];

  // Presupuesto comunitario
  const budgetData = {
    totalBudget: 45000,
    spent: 28500,
    remaining: 16500,
    categories: [
      { name: t("maintenanceCategory"), budget: 15000, spent: 12000, percentage: 80 },
      { name: t("cleaningCategory"), budget: 8000, spent: 6500, percentage: 81 },
      { name: t("gardeningCategory"), budget: 5000, spent: 3000, percentage: 60 },
      { name: t("repairsCategory"), budget: 10000, spent: 4000, percentage: 40 },
      { name: t("insuranceCategory"), budget: 7000, spent: 3000, percentage: 43 }
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
      dateForSorting: new Date("2024-03-20"),
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
      dateForSorting: new Date("2024-03-18"),
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
      dateForSorting: new Date("2024-03-15"),
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
      dateForSorting: new Date("2024-03-10"),
      cost: 280.00,
      status: "pending" as const,
      location: "Pasillos comunitarios",
      duration: "2 horas"
    },
    {
      id: "5",
      serviceName: "Reparación de Fontanería",
      providerName: "Fontanería Express",
      providerImage: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      category: "plumbing",
      date: "25 Feb 2024",
      dateForSorting: new Date("2024-02-25"),
      cost: 195.00,
      status: "completed" as const,
      rating: 4,
      comment: t("efficientAndCleanWork"),
      location: "Portal B - Planta baja",
      duration: "2 horas"
    },
    {
      id: "6",
      serviceName: "Pintura de Fachada",
      providerName: "Pintores Madrid",
      providerImage: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      category: "painting",
      date: "12 Jan 2024",
      dateForSorting: new Date("2024-01-12"),
      cost: 2450.00,
      status: "completed" as const,
      rating: 5,
      comment: t("excellentFinishVeryProfessional"),
      location: "Fachada principal",
      duration: "5 días"
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
      name: t("elevatorMaintenance"),
      provider: "Ascensores Madrid",
      category: "maintenance",
      price: "€450-650",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      rating: 4.9,
      availability: t("availabilityLabel")
    },
    {
      id: "2",
      name: "Limpieza de Portales",
      provider: "Limpiezas Comunidad",
      category: "cleaning",
      price: "€180-250",
      image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      rating: 4.7,
      availability: t("availabilityLabel")
    },
    {
      id: "3",
      name: t("gardening"),
      provider: "Jardines Verdes",
      category: "gardening",
      price: "€320-420",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      rating: 4.8,
      availability: t("availabilityLabel")
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

  // Función para ordenar los servicios
  const sortServices = (services: any[], sortBy: string, sortOrder: string) => {
    return [...services].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "date":
          aValue = a.dateForSorting;
          bValue = b.dateForSorting;
          break;
        case "service":
          aValue = a.serviceName.toLowerCase();
          bValue = b.serviceName.toLowerCase();
          break;
        case "cost":
          aValue = a.cost;
          bValue = b.cost;
          break;
        case "provider":
          aValue = a.providerName.toLowerCase();
          bValue = b.providerName.toLowerCase();
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
      } else {
        if (aValue > bValue) return -1;
        if (aValue < bValue) return 1;
        return 0;
      }
    });
  };

  const handleSort = (newSortBy: "date" | "service" | "cost" | "provider" | "status") => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder(newSortBy === "cost" || newSortBy === "date" ? "desc" : "asc");
    }
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    return sortOrder === "asc" ? 
      <ArrowUp className="h-4 w-4 text-blue-600" /> : 
      <ArrowDown className="h-4 w-4 text-blue-600" />;
  };

  const getSortLabel = (field: string) => {
    const labels = {
      date: t("date"),
      service: t("service"), 
      cost: t("cost"),
      provider: t("provider"),
      status: t("status")
    };
    return labels[field as keyof typeof labels];
  };

  const filteredCommunityServiceHistory = communityServiceHistory.filter(service => {
    const statusMatch = statusFilter === "all" || service.status === statusFilter;
    const categoryMatch = categoryFilter === "all" || service.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  // Aplicar ordenamiento a los servicios filtrados
  const sortedAndFilteredServices = sortServices(filteredCommunityServiceHistory, sortBy, sortOrder);

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
      console.log("Issue submitted:", { 
        type: selectedIssueType, 
        description: issueDescription,
        attachedImages: attachedImages 
      });
      setIssueDescription("");
      setAttachedImages([]);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const imageFiles = Array.from(files).filter(file => 
        file.type.startsWith('image/')
      );
      
      if (imageFiles.length !== files.length) {
        alert(t("imagesOnly"));
      }
      
      setAttachedImages(prev => [...prev, ...imageFiles]);
    }
  };

  const removeImage = (index: number) => {
    setAttachedImages(prev => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const getActiveTabTitle = () => {
    switch (activeTab) {
      case "perfil": return t("myProfile");
      case "mis-propiedades": return t("myProperties");
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

  // Funciones para gestión de propiedades
  const handleAddProperty = () => {
    setEditingProperty(null);
    setPropertyFormData({
      name: "",
      address: "",
      city: "",
      postalCode: "",
      country: "España",
      type: "apartment",
      status: "owned",
      size: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      yearBuilt: undefined,
      description: "",
      communityName: "",
      portalNumber: "",
      apartmentNumber: ""
    });
    setShowPropertyModal(true);
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setPropertyFormData({
      name: property.name,
      address: property.address,
      city: property.city,
      postalCode: property.postalCode,
      country: property.country,
      type: property.type,
      status: property.status,
      size: property.size,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      yearBuilt: property.yearBuilt,
      description: property.description || "",
      communityName: property.communityInfo?.communityName || "",
      portalNumber: property.communityInfo?.portalNumber || "",
      apartmentNumber: property.communityInfo?.apartmentNumber || ""
    });
    setShowPropertyModal(true);
  };

  const handleSaveProperty = () => {
    if (editingProperty) {
      // Actualizar propiedad existente
      setUserProperties(prev => prev.map(prop => 
        prop.id === editingProperty.id 
          ? {
              ...prop,
              ...propertyFormData,
              communityInfo: {
                ...prop.communityInfo,
                communityName: propertyFormData.communityName,
                portalNumber: propertyFormData.portalNumber,
                apartmentNumber: propertyFormData.apartmentNumber
              },
              updatedAt: new Date()
            }
          : prop
      ));
    } else {
      // Crear nueva propiedad
      const newProperty: Property = {
        id: Date.now().toString(),
        ...propertyFormData,
        communityInfo: {
          communityName: propertyFormData.communityName,
          portalNumber: propertyFormData.portalNumber,
          apartmentNumber: propertyFormData.apartmentNumber
        },
        images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        isCurrentlySelected: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setUserProperties(prev => [...prev, newProperty]);
    }
    setShowPropertyModal(false);
  };

  const handleDeleteProperty = (propertyId: string) => {
    if (confirm(t("confirmDeleteProperty"))) {
      setUserProperties(prev => prev.filter(prop => prop.id !== propertyId));
    }
  };

  const handleSelectProperty = (propertyId: string) => {
    setUserProperties(prev => prev.map(prop => ({
      ...prop,
      isCurrentlySelected: prop.id === propertyId
    })));
  };

  const getPropertyTypeIcon = (type: Property["type"]) => {
    switch (type) {
      case "apartment": return <Building className="h-5 w-5" />;
      case "house": return <Home className="h-5 w-5" />;
      case "townhouse": return <Building className="h-5 w-5" />;
      case "condo": return <Building className="h-5 w-5" />;
      case "studio": return <Building className="h-5 w-5" />;
      case "commercial": return <Store className="h-5 w-5" />;
      default: return <Building className="h-5 w-5" />;
    }
  };

  const getPropertyStatusBadges = (status: Property["status"]) => {
    switch (status) {
      case "owned":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{t("owned")}</Badge>;
      case "rented":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{t("rented")}</Badge>;
      case "vacant":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{t("vacant")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCurrentProperty = () => {
    return userProperties.find(prop => prop.isCurrentlySelected) || userProperties[0];
  };

  const getPropertyStats = () => {
    return {
      totalProperties: userProperties.length,
      ownedProperties: userProperties.filter(p => p.status === "owned").length,
      rentedProperties: userProperties.filter(p => p.status === "rented").length,
      vacantProperties: userProperties.filter(p => p.status === "vacant").length
    };
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
              <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-gray-200 pb-1">
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
                      <span>{isEditing ? t("saveLabel") : t("editLabel")}</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <User className="h-5 w-5" />
                          <span>{t("personalInfo")}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="name">{t("fullNameComplete")}</Label>
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
                          <Label htmlFor="email">{t("emailComplete")}</Label>
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
                          <Label htmlFor="phone">{t("phoneComplete")}</Label>
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
                          <span>{t("communityAndHousingInfo")}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="communityName">{t("communityNameComplete")}</Label>
                          {isEditing ? (
                              <Input id="communityName" value={profileData.communityName} onChange={(e) => setProfileData({ ...profileData, communityName: e.target.value })} />
                          ) : (
                              <p className="text-gray-800 font-medium">{profileData.communityName}</p>
                          )}
                        </div>
                        <div>
                            <Label htmlFor="address">{t("addressComplete")}</Label>
                            {isEditing ? (
                                <Input id="address" value={profileData.address} onChange={(e) => setProfileData({ ...profileData, address: e.target.value })} />
                            ) : (
                                <p className="text-gray-800 font-medium">{profileData.address}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="portalNumber">{t("portalNumberComplete")}</Label>
                            {isEditing ? (
                                <Input id="portalNumber" value={profileData.portalNumber} onChange={(e) => setProfileData({ ...profileData, portalNumber: e.target.value })} />
                            ) : (
                                <p className="text-gray-800 font-medium">{profileData.portalNumber}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="city">{t("cityComplete")}</Label>
                            {isEditing ? (
                                <Input id="city" value={profileData.city} onChange={(e) => setProfileData({ ...profileData, city: e.target.value })} />
                            ) : (
                                <p className="text-gray-800 font-medium">{profileData.city}</p>
                            )}
                        </div>
                        <div>
                          <Label>{t("apartmentComplete")}</Label>
                          <p className="text-gray-800 font-medium">{profileData.apartment}</p>
                        </div>
                        <div>
                            <Label htmlFor="communityRole">{t("communityRoleComplete")}</Label>
                            {isEditing ? (
                                <select id="communityRole" value={profileData.communityRole} onChange={(e) => setProfileData({ ...profileData, communityRole: e.target.value })} className="w-full px-3 py-2 border rounded-md bg-white">
                                    <option value="Propietario">{t("ownerRole")}</option>
                                    <option value="Presidente">{t("presidentRole")}</option>
                                    <option value="Vicepresidente">{t("vicePresidentRole")}</option>
                                    <option value="Inquilino">{t("tenantRole")}</option>
                                </select>
                            ) : (
                                <p className="text-gray-800 font-medium">{profileData.communityRole}</p>
                            )}
                        </div>
                        <div>
                          <Label>{t("memberSinceComplete")}</Label>
                          <p className="text-gray-800 font-medium">{profileData.memberSince}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === "mis-propiedades" && (
                <div className="space-y-8">
                  {/* Property Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-600 text-sm font-medium">{t("properties")}</p>
                            <p className="text-3xl font-bold text-blue-900">{getPropertyStats().totalProperties}</p>
                          </div>
                          <div className="p-3 bg-blue-200 rounded-full">
                            <Building className="h-6 w-6 text-blue-700" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-600 text-sm font-medium">{t("owned")}</p>
                            <p className="text-3xl font-bold text-green-900">{getPropertyStats().ownedProperties}</p>
                          </div>
                          <div className="p-3 bg-green-200 rounded-full">
                            <CheckCircle className="h-6 w-6 text-green-700" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-purple-600 text-sm font-medium">{t("rented")}</p>
                            <p className="text-3xl font-bold text-purple-900">{getPropertyStats().rentedProperties}</p>
                          </div>
                          <div className="p-3 bg-purple-200 rounded-full">
                            <Users className="h-6 w-6 text-purple-700" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-orange-600 text-sm font-medium">{t("vacant")}</p>
                            <p className="text-3xl font-bold text-orange-900">{getPropertyStats().vacantProperties}</p>
                          </div>
                          <div className="p-3 bg-orange-200 rounded-full">
                            <AlertCircle className="h-6 w-6 text-orange-700" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Add Property Button */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("myProperties")}</h2>
                      <p className="text-gray-600">{t("manageOrganizePropertiesDesc")}</p>
                    </div>
                    <Button 
                      onClick={handleAddProperty}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      {t("addProperty")}
                    </Button>
                  </div>

                  {/* Properties Grid */}
                  {userProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userProperties.map((property, index) => (
                        <Card 
                          key={property.id} 
                          className={`group overflow-hidden transition-all duration-500 hover:shadow-2xl transform hover:scale-105 ${
                            property.isCurrentlySelected 
                              ? 'ring-2 ring-blue-500 shadow-lg bg-gradient-to-br from-blue-50 to-white' 
                              : 'hover:shadow-lg bg-white'
                          }`}
                          style={{
                            animationDelay: `${index * 0.1}s`,
                            animation: 'fadeInUp 0.6s ease-out forwards'
                          }}
                        >
                          {/* Property Image */}
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={property.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                              alt={property.name}
                              layout="fill"
                              objectFit="cover"
                              className="group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-4 left-4 flex gap-2">
                              {getPropertyStatusBadges(property.status)}
                              {property.isCurrentlySelected && (
                                <Badge className="bg-blue-600 text-white">
                                  <CheckCheck className="h-3 w-3 mr-1" />
                                  {t("selectedLabel")}
                                </Badge>
                              )}
                            </div>
                            <div className="absolute top-4 right-4 p-2 bg-white/90 rounded-full backdrop-blur-sm">
                              {getPropertyTypeIcon(property.type)}
                            </div>
                          </div>

                          <CardContent className="p-6">
                            <div className="mb-4">
                              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {property.name}
                              </h3>
                              <div className="flex items-center text-gray-600 mb-2">
                                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="text-sm">{property.address}, {property.city}</span>
                              </div>
                              {property.communityInfo?.apartmentNumber && (
                                <p className="text-sm text-blue-600 font-medium">
                                  {property.communityInfo.apartmentNumber} - {property.communityInfo.communityName}
                                </p>
                              )}
                            </div>

                            {/* Property Details */}
                            <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                              {property.size && (
                                <div className="flex items-center">
                                  <Ruler className="h-4 w-4 mr-1" />
                                  <span>{property.size}m²</span>
                                </div>
                              )}
                              {property.bedrooms && (
                                <div className="flex items-center">
                                  <Bed className="h-4 w-4 mr-1" />
                                  <span>{property.bedrooms}</span>
                                </div>
                              )}
                              {property.bathrooms && (
                                <div className="flex items-center">
                                  <Bath className="h-4 w-4 mr-1" />
                                  <span>{property.bathrooms}</span>
                                </div>
                              )}
                              {property.yearBuilt && (
                                <div className="flex items-center">
                                  <CalendarIcon className="h-4 w-4 mr-1" />
                                  <span>{property.yearBuilt}</span>
                                </div>
                              )}
                            </div>

                            {property.description && (
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {property.description}
                              </p>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2">
                              {!property.isCurrentlySelected && (
                                <Button 
                                  onClick={() => handleSelectProperty(property.id)}
                                  size="sm"
                                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
                                >
                                  <CheckCheck className="h-4 w-4 mr-1" />
                                  {t("selectBtn")}
                                </Button>
                              )}
                              <Button 
                                onClick={() => handleEditProperty(property)}
                                variant="outline" 
                                size="sm"
                                className="px-3"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                onClick={() => handleDeleteProperty(property.id)}
                                variant="outline" 
                                size="sm"
                                className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="mx-auto mb-6 p-4 bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center">
                        <Building className="h-10 w-10 text-gray-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {t("noPropertiesFound")}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {t("addFirstPropertyDesc")}
                      </p>
                      <Button 
                        onClick={handleAddProperty}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        {t("addFirstProperty")}
                      </Button>
                    </div>
                  )}

                  {/* Property Management Modal */}
                  <Dialog open={showPropertyModal} onOpenChange={setShowPropertyModal}>
                    <DialogContent className="max-w-1xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-gray-900">
                          {editingProperty ? t("editPropertyTitle") : t("addNewPropertyTitle")}
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="property-name" className="text-sm font-medium text-gray-700">
                              {t("propertyNameRequired2")}
                            </Label>
                            <Input
                              id="property-name"
                              value={propertyFormData.name}
                              onChange={(e) => setPropertyFormData({...propertyFormData, name: e.target.value})}
                              placeholder={t("propertyNamePlaceholder")}
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label htmlFor="property-address" className="text-sm font-medium text-gray-700">
                              {t("addressRequired")}
                            </Label>
                            <Input
                              id="property-address"
                              value={propertyFormData.address}
                              onChange={(e) => setPropertyFormData({...propertyFormData, address: e.target.value})}
                              placeholder={t("addressPlaceholder")}
                              className="mt-1"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="property-city" className="text-sm font-medium text-gray-700">
                                {t("cityRequired2")}
                              </Label>
                              <Input
                                id="property-city"
                                value={propertyFormData.city}
                                onChange={(e) => setPropertyFormData({...propertyFormData, city: e.target.value})}
                                placeholder={t("cityPlaceholder")}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="property-postal" className="text-sm font-medium text-gray-700">
                                {t("postalCodeRequired2")}
                              </Label>
                              <Input
                                id="property-postal"
                                value={propertyFormData.postalCode}
                                onChange={(e) => setPropertyFormData({...propertyFormData, postalCode: e.target.value})}
                                placeholder={t("postalCodePlaceholder")}
                                className="mt-1"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="property-type" className="text-sm font-medium text-gray-700">
                                {t("propertyTypeRequired2")}
                              </Label>
                              <select
                                id="property-type"
                                value={propertyFormData.type}
                                onChange={(e) => setPropertyFormData({...propertyFormData, type: e.target.value as Property["type"]})}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="apartment">{t("apartment")}</option>
                                <option value="house">{t("house")}</option>
                                <option value="townhouse">{t("townhouse")}</option>
                                <option value="condo">{t("condo")}</option>
                                <option value="studio">{t("studio")}</option>
                              </select>
                            </div>
                            <div>
                              <Label htmlFor="property-status" className="text-sm font-medium text-gray-700">
                                {t("statusRequired2")}
                              </Label>
                              <select
                                id="property-status"
                                value={propertyFormData.status}
                                onChange={(e) => setPropertyFormData({...propertyFormData, status: e.target.value as Property["status"]})}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="owned">{t("owned")}</option>
                                <option value="rented">{t("rented")}</option>
                                <option value="vacant">{t("vacant")}</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="property-size" className="text-sm font-medium text-gray-700">
                                {t("sizeSqm")}
                              </Label>
                              <Input
                                id="property-size"
                                type="number"
                                value={propertyFormData.size || ""}
                                onChange={(e) => setPropertyFormData({...propertyFormData, size: e.target.value ? parseInt(e.target.value) : undefined})}
                                placeholder={t("sizePlaceholder")}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="property-bedrooms" className="text-sm font-medium text-gray-700">
                                {t("bedroomsLabel")}
                              </Label>
                              <Input
                                id="property-bedrooms"
                                type="number"
                                value={propertyFormData.bedrooms || ""}
                                onChange={(e) => setPropertyFormData({...propertyFormData, bedrooms: e.target.value ? parseInt(e.target.value) : undefined})}
                                placeholder={t("bedroomsPlaceholder")}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="property-bathrooms" className="text-sm font-medium text-gray-700">
                                {t("bathroomsLabel")}
                              </Label>
                              <Input
                                id="property-bathrooms"
                                type="number"
                                value={propertyFormData.bathrooms || ""}
                                onChange={(e) => setPropertyFormData({...propertyFormData, bathrooms: e.target.value ? parseInt(e.target.value) : undefined})}
                                placeholder={t("bathroomsPlaceholder")}
                                className="mt-1"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="property-year" className="text-sm font-medium text-gray-700">
                              {t("yearBuiltLabel")}
                            </Label>
                            <Input
                              id="property-year"
                              type="number"
                              value={propertyFormData.yearBuilt || ""}
                              onChange={(e) => setPropertyFormData({...propertyFormData, yearBuilt: e.target.value ? parseInt(e.target.value) : undefined})}
                              placeholder={t("yearBuiltPlaceholder")}
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label htmlFor="community-name" className="text-sm font-medium text-gray-700">
                              {t("communityNameLabel2")}
                            </Label>
                            <Input
                              id="community-name"
                              value={propertyFormData.communityName || ""}
                              onChange={(e) => setPropertyFormData({...propertyFormData, communityName: e.target.value})}
                              placeholder={t("communityNamePlaceholder")}
                              className="mt-1"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="portal-number" className="text-sm font-medium text-gray-700">
                                {t("portalNumberLabel2")}
                              </Label>
                              <Input
                                id="portal-number"
                                value={propertyFormData.portalNumber || ""}
                                onChange={(e) => setPropertyFormData({...propertyFormData, portalNumber: e.target.value})}
                                placeholder={t("portalNumberPlaceholder")}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="apartment-number" className="text-sm font-medium text-gray-700">
                                {t("apartmentNumberLabel2")}
                              </Label>
                              <Input
                                id="apartment-number"
                                value={propertyFormData.apartmentNumber || ""}
                                onChange={(e) => setPropertyFormData({...propertyFormData, apartmentNumber: e.target.value})}
                                placeholder={t("apartmentNumberPlaceholder")}
                                className="mt-1"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="property-description" className="text-sm font-medium text-gray-700">
                              {t("descriptionLabel")}
                            </Label>
                            <Textarea
                              id="property-description"
                              value={propertyFormData.description || ""}
                              onChange={(e) => setPropertyFormData({...propertyFormData, description: e.target.value})}
                              placeholder={t("descriptionPlaceholder")}
                              rows={3}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-4 pt-4 border-t">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowPropertyModal(false)}
                        >
                          {t("cancel")}
                        </Button>
                        <Button 
                          onClick={handleSaveProperty}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                          disabled={!propertyFormData.name || !propertyFormData.address || !propertyFormData.city}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {editingProperty ? t("updatePropertyBtn") : t("createPropertyBtn")}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              {activeTab === "servicios" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("availableServicesTitle")}</h2>
                    <p className="text-gray-600">{t("availableServicesDesc")}</p>
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
                              {t("seeDetailsBtn")}
                            </Button>
                            <Button size="sm" className="flex-1">
                              {t("requestBtn")}
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("communityChatlabel")}</h2>
                    <p className="text-gray-600">{t("chatDescription")}</p>
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
                      placeholder={t("writeMessagePlaceholder")}
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("communityVideoConferenceTitle")}</h2>
                    <p className="text-gray-600 mb-6">{t("scheduleVirtualMeetingsDesc")}</p>
                    
                    <div className="max-w-md mx-auto space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{t("nextMeetingLabel")}</h3>
                          <p className="text-sm text-gray-600 mb-2">{t("ordinaryAssemblyLabel")}</p>
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{t("meetingDate")}</span>
                          </div>
                          <Button className="w-full">{t("joinMeetingBtn")}</Button>
                        </CardContent>
                      </Card>

                      <Button variant="outline" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        {t("scheduleNewMeetingBtn")}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "incidencias" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("reportIncidentTitle")}</h2>
                    <p className="text-gray-600">{t("reportProblemsDesc")}</p>
                  </div>

                  <div className="max-w-2xl mx-auto">
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="issue-type">{t("incidentTypeLabel")}</Label>
                        <select 
                          id="issue-type"
                          value={selectedIssueType}
                          onChange={(e) => setSelectedIssueType(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="maintenance">{t("maintenance")}</option>
                          <option value="cleaning">{t("cleaning")}</option>
                          <option value="security">{t("security")}</option>
                          <option value="noise">Ruidos</option>
                          <option value="lighting">Iluminación</option>
                          <option value="other">{t("other")}</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="description">{t("incidentDescriptionLabel")}</Label>
                        <Textarea
                          id="description"
                          placeholder={t("describeDetailedProblemPlaceholder")}
                          value={issueDescription}
                          onChange={(e) => setIssueDescription(e.target.value)}
                          rows={6}
                        />
                      </div>

                      {/* Hidden file input */}
                      <input
                        type="file"
                        id="image-upload"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />

                      {/* Image previews */}
                      {attachedImages.length > 0 && (
                        <div>
                          <Label>{t("attachedImages")} ({attachedImages.length})</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                            {attachedImages.map((file, index) => (
                              <div key={index} className="relative">
                                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                  <Image
                                    src={URL.createObjectURL(file)}
                                    alt={`Imagen ${index + 1}`}
                                    layout="fill"
                                    objectFit="cover"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                  onClick={() => removeImage(index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                                <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-4">
                        <Button 
                          type="button"
                          variant="outline" 
                          className="flex-1"
                          onClick={triggerFileInput}
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          {t("attachPhotoBtn")}{attachedImages.length > 0 && ` (${attachedImages.length})`}
                        </Button>
                        <Button 
                          onClick={handleSubmitIssue}
                          className="flex-1"
                          disabled={!issueDescription.trim()}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {t("sendIncidentBtn")}
                        </Button>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">{t("recentIncidentsLabel")}</h3>
                      <div className="space-y-3">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{t("garageDoorBrokenText")}</h4>
                                <p className="text-sm text-gray-600">{t("reportedAugust2Text")}</p>
                              </div>
                              <Badge className="bg-green-100 text-green-800">{t("solvedLabel")}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{t("portalLightingText")}</h4>
                                <p className="text-sm text-gray-600">{t("reportedJuly28Text")}</p>
                              </div>
                              <Badge className="bg-yellow-100 text-yellow-800">{t("inProcessLabel")}</Badge>
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("communityContractsTitleLabel")}</h2>
                    <p className="text-gray-600">{t("servicesContractedDesc")}</p>
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
                              {contract.status === 'active' ? t("activeLabel") : t("pendingLabel")}
                            </Badge>
                          </div>

                          <p className="text-gray-700 mb-4">{contract.description}</p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <Label className="text-sm text-gray-500">{t("startDateLabel")}</Label>
                              <p className="font-medium">{contract.startDate}</p>
                            </div>
                            <div>
                              <Label className="text-sm text-gray-500">{t("endDateLabel")}</Label>
                              <p className="font-medium">{contract.endDate}</p>
                            </div>
                            <div>
                              <Label className="text-sm text-gray-500">{t("valueLabel")}</Label>
                              <p className="font-medium text-green-600">{contract.value}</p>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              {t("viewContractBtn")}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              {t("downloadBtn")}
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("communityBudget2024Title")}</h2>
                    <p className="text-gray-600">{t("currentStateAnnualBudgetDesc")}</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="bg-blue-50">
                      <CardContent className="p-6 text-center">
                        <Euro className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                        <h3 className="text-lg font-semibold text-gray-800">{t("totalBudgetLabel")}</h3>
                        <p className="text-2xl font-bold text-blue-600">€{budgetData.totalBudget.toLocaleString()}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-red-50">
                      <CardContent className="p-6 text-center">
                        <Activity className="h-8 w-8 mx-auto text-red-600 mb-2" />
                        <h3 className="text-lg font-semibold text-gray-800">{t("spentLabel")}</h3>
                        <p className="text-2xl font-bold text-red-600">€{budgetData.spent.toLocaleString()}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-green-50">
                      <CardContent className="p-6 text-center">
                        <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
                        <h3 className="text-lg font-semibold text-gray-800">{t("availableLabel")}</h3>
                        <p className="text-2xl font-bold text-green-600">€{budgetData.remaining.toLocaleString()}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">{t("breakdownByCategoriesTitle")}</h3>
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
                            <p className="text-sm text-gray-600 mt-1">{category.percentage}% {t("utilizedLabel")}</p>
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("contactAdministratorTitleLabel")}</h2>
                    <p className="text-gray-600">{t("communicateDirectlyDesc")}</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <User className="h-5 w-5" />
                          <span>{t("contactInformationLabel")}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">{t("emailLabel2")}</p>
                            <p className="font-medium">admin@administracionfincas.com</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">{t("phoneLabel2")}</p>
                            <p className="font-medium">+34 91 123 45 67</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">{t("attentionScheduleLabel")}</p>
                            <p className="font-medium">{t("mondayToFridaySchedule")}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>{t("sendMessageBtn")}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="subject">{t("subjectLabel")}</Label>
                          <Input id="subject" placeholder={t("messageSubjectPlaceholder")} />
                        </div>
                        <div>
                          <Label htmlFor="message">{t("messageLabel")}</Label>
                          <Textarea 
                            id="message" 
                            placeholder={t("writeMessageHerePlaceholder")}
                            rows={6}
                          />
                        </div>
                        <Button className="w-full">
                          <Send className="h-4 w-4 mr-2" />
                          {t("sendMessageBtn")}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
              
              {activeTab === "historial" && (
                <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300">
                  {/* Enhanced Filters and Sorting Section */}
                  <div className="mb-8 p-6 bg-gradient-to-r from-neutral-50 to-white border border-neutral-200/60 rounded-2xl shadow-sm">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Filters Section */}
                      <div className="flex flex-wrap gap-4 flex-1">
                        <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-xl border border-neutral-200/60 shadow-sm">
                          <Filter className="h-4 w-4 text-neutral-500" />
                          <Label className="text-sm font-medium text-neutral-700">{t("filterByStatus")}:</Label>
                          <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-1 border-0 bg-transparent text-sm font-medium text-neutral-700 focus:ring-0 focus:outline-none cursor-pointer"
                          >
                            <option value="all">{t("allStatuses")}</option>
                            <option value="completed">{t("completed")}</option>
                            <option value="pending">{t("pending")}</option>
                            <option value="cancelled">{t("cancelled")}</option>
                          </select>
                          <ChevronDown className="h-4 w-4 text-neutral-400" />
                        </div>
                        
                        <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-xl border border-neutral-200/60 shadow-sm">
                          <Label className="text-sm font-medium text-neutral-700">{t("filterByCategory")}:</Label>
                          <select 
                            value={categoryFilter} 
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-3 py-1 border-0 bg-transparent text-sm font-medium text-neutral-700 focus:ring-0 focus:outline-none cursor-pointer"
                          >
                            <option value="all">{t("allCategories")}</option>
                            <option value="maintenance">{t("maintenance")}</option>
                            <option value="cleaning">{t("cleaning")}</option>
                            <option value="gardening">{t("gardening")}</option>
                            <option value="electrical">{t("electrical")}</option>
                            <option value="plumbing">{t("plumbing")}</option>
                            <option value="painting">{t("painting")}</option>
                          </select>
                          <ChevronDown className="h-4 w-4 text-neutral-400" />
                        </div>
                      </div>

                      {/* Sorting Section */}
                      <div className="flex flex-wrap gap-2 lg:justify-end">
                        <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-xl">
                          <span className="text-sm font-medium text-blue-700">{t("sortBy")}:</span>
                        </div>
                        {["date", "service", "cost", "provider", "status"].map((field) => (
                          <Button
                            key={field}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSort(field as "date" | "service" | "cost" | "provider" | "status")}
                            className={`flex items-center space-x-2 transition-all duration-200 hover:scale-105 border-neutral-200/60 ${
                              sortBy === field 
                                ? 'bg-blue-100 text-blue-700 border-blue-200 shadow-sm' 
                                : 'bg-white hover:bg-neutral-50'
                            }`}
                          >
                            <span className="text-sm font-medium">{getSortLabel(field)}</span>
                            {getSortIcon(field)}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Results Summary */}
                    <div className="mt-4 pt-4 border-t border-neutral-200/40">
                      <div className="flex items-center justify-between text-sm text-neutral-600">
                        <span>
                          {t("showingServices")} {sortedAndFilteredServices.length} {t("of")} {communityServiceHistory.length} {t("services")}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span>{t("sortedBy")} {getSortLabel(sortBy).toLowerCase()}</span>
                          <span className="text-neutral-400">•</span>
                          <span className="capitalize">{sortOrder === "asc" ? t("ascending") : t("descending")}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Services List */}
                  {sortedAndFilteredServices.length > 0 ? (
                    <div className="space-y-4">
                      {sortedAndFilteredServices.map((service, index) => (
                        <div
                          key={service.id}
                          className="transform transition-all duration-300 hover:scale-[1.02]"
                          style={{
                            animationDelay: `${index * 0.1}s`,
                            animation: 'fadeInUp 0.6s ease-out forwards'
                          }}
                        >
                          <ServiceHistoryCard
                            service={service}
                            onRate={handleRateService}
                            onViewDetails={(id) => console.log("View community service details", id)}
                            onRepeatService={(id) => console.log("Request community service again", id)}
                            onContactProvider={(id) => console.log("Contact community provider", id)}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="mx-auto mb-6 p-6 bg-gradient-to-br from-neutral-100 to-neutral-50 rounded-full w-24 h-24 flex items-center justify-center shadow-lg">
                        <Calendar className="h-12 w-12 text-neutral-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-neutral-700 mb-3">{t("noServiceHistory")}</h3>
                      <p className="text-neutral-500 mb-6 max-w-md mx-auto">
                        {statusFilter !== "all" || categoryFilter !== "all" 
                          ? "No hay servicios que coincidan con los filtros seleccionados. Prueba a ajustar los criterios de búsqueda."
                          : "Cuando contrates servicios para tu comunidad, aparecerán aquí con toda la información detallada."
                        }
                      </p>
                      {statusFilter !== "all" || categoryFilter !== "all" ? (
                        <div className="flex gap-3 justify-center">
                          <Button 
                            variant="outline"
                            onClick={() => {
                              setStatusFilter("all");
                              setCategoryFilter("all");
                            }}
                            className="transition-all duration-200 hover:scale-105"
                          >
                            {t("clearFilters")}
                          </Button>
                          <Button 
                            onClick={() => setActiveTab("servicios")}
                            className="transition-all duration-200 hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            {t("findServices")}
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => setActiveTab("servicios")}
                          className="transition-all duration-200 hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          {t("findServices")}
                        </Button>
                      )}
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("serviceRatingsTitleLabel")}</h2>
                    <p className="text-gray-600">{t("yourRatingsCommunitServicesDesc")}</p>
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
                                  className={`h-5 w-5 ${star <= (service.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("configurationTitle")}</h2>
                    <p className="text-gray-600">{t("adjustPreferencesDesc")}</p>
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Bell className="h-5 w-5" />
                          <span>{t("notificationsLabel")}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">{t("emailNotificationsLabel")}</Label>
                            <p className="text-sm text-gray-500">{t("emailNotificationsDesc")}</p>
                          </div>
                          <Button variant="outline" size="sm">{t("activateBtn")}</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">{t("pushNotificationsLabel")}</Label>
                            <p className="text-sm text-gray-500">{t("pushNotificationsDesc")}</p>
                          </div>
                          <Button variant="outline" size="sm">{t("activateBtn")}</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">{t("meetingRemindersLabel")}</Label>
                            <p className="text-sm text-gray-500">{t("videoconferenceAlertsLabel")}</p>
                          </div>
                          <Button variant="outline" size="sm">{t("activateBtn")}</Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Shield className="h-5 w-5" />
                          <span>{t("privacyAndSecurityLabel")}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full justify-start">
                          {t("changePasswordBtn")}
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          {t("configureTwoFactorAuthBtn")}
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          {t("downloadMyDataBtn")}
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

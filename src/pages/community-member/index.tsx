
import React, { useState } from "react";
import Head from "next/head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Video, 
  AlertTriangle, 
  FileText, 
  Calculator, 
  Mail, 
  ShoppingBag,
  User,
  Calendar,
  Upload,
  Clock,
  FileSpreadsheet,
  Building,
  Droplet,
  Zap,
  Paintbrush,
  Hammer,
  Construction,
  Home,
  ThumbsUp,
  Award,
  CreditCard,
  Bell,
  Settings,
  Store,
  Star,
  Search,
  MapPin
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/layout/Header";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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

export default function CommunityMemberDashboard() {
  const [activeTab, setActiveTab] = useState("perfil");
  const { t } = useLanguage();
  const router = useRouter();
  
  // Sample community contacts data
  const communityContacts: CommunityContact[] = [
    { id: "1", name: "Ana García", role: t("communityPresident"), lastMessage: t("goodMorningNeighbors"), timestamp: "09:30", isOnline: true },
    { id: "2", name: "Carlos Rodríguez", role: t("treasurer"), lastMessage: t("monthlyFeesReminder"), timestamp: "Yesterday", isOnline: false },
    { id: "3", name: "Marta Sánchez", role: t("secretary"), lastMessage: t("meetingMinutesAvailable"), timestamp: "Yesterday", isOnline: true },
    { id: "4", name: "Javier López", role: t("neighbor"), lastMessage: t("parkingIssueResolved"), timestamp: "2 days ago", isOnline: false },
    { id: "5", name: "Elena Martínez", role: t("neighbor"), lastMessage: t("gardenMaintenanceSchedule"), timestamp: "3 days ago", isOnline: true },
    { id: "6", name: "Miguel Fernández", role: t("maintenanceManager"), lastMessage: t("elevatorRepairUpdate"), timestamp: "4 days ago", isOnline: false },
    { id: "7", name: "Laura González", role: t("neighbor"), lastMessage: t("noiseComplaintResolution"), timestamp: "5 days ago", isOnline: true },
    { id: "8", name: "Pedro Díaz", role: t("neighbor"), lastMessage: t("holidayDecorationIdeas"), timestamp: "1 week ago", isOnline: false },
    { id: "9", name: "Sofía Ruiz", role: t("neighbor"), lastMessage: t("communityGardenProposal"), timestamp: "1 week ago", isOnline: true },
    { id: "10", name: "Daniel Moreno", role: t("securityGuard"), lastMessage: t("securityUpdateReport"), timestamp: "1 week ago", isOnline: false },
    { id: "11", name: "Carmen Jiménez", role: t("neighbor"), lastMessage: t("childrenPlaygroundIdea"), timestamp: "2 weeks ago", isOnline: true },
    { id: "12", name: "Antonio Navarro", role: t("neighbor"), lastMessage: t("parkingSpotQuestion"), timestamp: "2 weeks ago", isOnline: false },
    { id: "13", name: "Isabel Torres", role: t("neighbor"), lastMessage: t("recyclingBinRequest"), timestamp: "2 weeks ago", isOnline: true },
    { id: "14", name: "Francisco Vega", role: t("maintenanceStaff"), lastMessage: t("plumbingFixSchedule"), timestamp: "3 weeks ago", isOnline: false },
    { id: "15", name: "Lucía Castro", role: t("neighbor"), lastMessage: t("communityEventIdea"), timestamp: "3 weeks ago", isOnline: true },
    { id: "16", name: "Raúl Ortega", role: t("neighbor"), lastMessage: t("petPolicyQuestion"), timestamp: "3 weeks ago", isOnline: false },
    { id: "17", name: "Pilar Delgado", role: t("neighbor"), lastMessage: t("noiseConcernRaised"), timestamp: "1 month ago", isOnline: true },
    { id: "18", name: "José Serrano", role: t("neighbor"), lastMessage: t("internetProviderSuggestion"), timestamp: "1 month ago", isOnline: false },
    { id: "19", name: "Cristina Herrera", role: t("neighbor"), lastMessage: t("balconyPlantCare"), timestamp: "1 month ago", isOnline: true },
    { id: "20", name: "Alberto Méndez", role: t("estateAdministrator"), lastMessage: t("budgetApprovalNeeded"), timestamp: "1 month ago", isOnline: false }
  ];

  // Sample community contracts data
  const communityContracts: CommunityContract[] = [
    { id: "1", title: t("communityBylaws"), type: t("legalDocument"), date: "01/01/2023", fileType: "pdf" },
    { id: "2", title: t("maintenanceContract"), type: t("serviceContract"), date: "15/03/2023", fileType: "pdf" },
    { id: "3", title: t("cleaningServices"), type: t("serviceContract"), date: "10/04/2023", fileType: "word" },
    { id: "4", title: t("insurancePolicy"), type: t("insurance"), date: "22/05/2023", fileType: "pdf" },
    { id: "5", title: t("elevatorMaintenance"), type: t("serviceContract"), date: "07/06/2023", fileType: "word" },
    { id: "6", title: t("securityServices"), type: t("serviceContract"), date: "18/07/2023", fileType: "pdf" },
    { id: "7", title: t("gardeningContract"), type: t("serviceContract"), date: "29/08/2023", fileType: "word" },
    { id: "8", title: t("communityRules"), type: t("legalDocument"), date: "12/09/2023", fileType: "pdf" },
    { id: "9", title: t("parkingRegulations"), type: t("legalDocument"), date: "05/10/2023", fileType: "pdf" },
    { id: "10", title: t("swimmingPoolMaintenance"), type: t("serviceContract"), date: "20/11/2023", fileType: "word" }
  ];

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

  return (
    <>
      <Head>
        <title>{t("communityMemberDashboard")} | {t("handyman")}</title>
        <meta name="description" content={t("communityMemberDesc")} />
      </Head>
      
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
                variant={activeTab === "chat" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("chat")}
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                {t("communityChat")}
              </Button>
              <Button 
                variant={activeTab === "videoconference" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("videoconference")}
              >
                <Video className="mr-2 h-5 w-5" />
                {t("scheduleVideoConference")}
              </Button>
              <Button 
                variant={activeTab === "issue" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("issue")}
              >
                <AlertTriangle className="mr-2 h-5 w-5" />
                {t("informIssue")}
              </Button>
              <Button 
                variant={activeTab === "contracts" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("contracts")}
              >
                <FileText className="mr-2 h-5 w-5" />
                {t("communityContracts")}
              </Button>
              <Button 
                variant={activeTab === "budget" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("budget")}
              >
                <Calculator className="mr-2 h-5 w-5" />
                {t("communityBudget")}
              </Button>
              <Button 
                variant={activeTab === "contact" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("contact")}
              >
                <Mail className="mr-2 h-5 w-5" />
                {t("contactAdministrator")}
              </Button>
              <Button 
                variant={activeTab === "bid" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("bid")}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                {t("prepareBid")}
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
                variant={activeTab === "notificaciones" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("notificaciones")}
              >
                <Bell className="mr-2 h-5 w-5" />
                {t("notifications")}
              </Button>
              <Button 
                variant={activeTab === "recomendaciones" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("recomendaciones")}
              >
                <ThumbsUp className="mr-2 h-5 w-5" />
                {t("recommendations")}
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
                variant={activeTab === "valoraciones" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("valoraciones")}
              >
                <ThumbsUp className="mr-2 h-5 w-5" />
                {t("serviceRatings")}
              </Button>
              <Button 
                variant={activeTab === "mejores" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("mejores")}
              >
                <Award className="mr-2 h-5 w-5" />
                {t("bestRated")}
              </Button>
              <Button 
                variant={activeTab === "cuenta" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("cuenta")}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                {t("myAccount")}
              </Button>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">
              {activeTab === "perfil" ? t("myProfile") :
               activeTab === "chat" ? t("communityChat") :
               activeTab === "videoconference" ? t("scheduleVideoConference") :
               activeTab === "issue" ? t("informIssue") :
               activeTab === "contracts" ? t("communityContracts") :
               activeTab === "budget" ? t("communityBudget") :
               activeTab === "contact" ? t("contactAdministrator") :
               activeTab === "bid" ? t("prepareBid") :
               activeTab === "proveedores" ? t("serviceProviders") :
               activeTab === "notificaciones" ? t("notifications") :
               activeTab === "recomendaciones" ? t("recommendations") :
               activeTab === "configuracion" ? t("configuration") :
               activeTab === "valoraciones" ? t("serviceRatings") :
               activeTab === "mejores" ? t("bestRated") :
               activeTab === "cuenta" ? t("myAccount") : /* Added missing case for "myAccount" */
               t("communityMemberDashboard")}
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
                        <h2 className="text-xl font-bold">María González</h2>
                        <p className="text-gray-500 mb-4">{t("communityMember")}</p>
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
                              <Input id="name" value="María González López" readOnly className="bg-gray-50" />
                            </div>
                            <div>
                              <Label htmlFor="email">{t("emailLabel")}</Label>
                              <Input id="email" value="maria.gonzalez@example.com" readOnly className="bg-gray-50" />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="phone">{t("phoneLabel")}</Label>
                              <Input id="phone" value="+34 654 321 987" readOnly className="bg-gray-50" />
                            </div>
                            <div>
                              <Label htmlFor="location">{t("locationLabel")}</Label>
                              <Input id="location" value="Barcelona, España" readOnly className="bg-gray-50" />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="address">{t("mainAddress")}</Label>
                            <Input id="address" value="Residencial Las Flores, Bloque A, 3º B, 08001, Barcelona" readOnly className="bg-gray-50" />
                          </div>
                          
                          <div className="pt-4 border-t">
                            <h3 className="font-medium text-lg mb-2">{t("contactPreferences")}</h3>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="contact-email" defaultChecked readOnly />
                                <Label htmlFor="contact-email" className="cursor-pointer">{t("email")}</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="contact-phone" defaultChecked readOnly />
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
                                <Badge className="mb-1">{t("cleaning")}</Badge>
                                <h4 className="font-bold">{t("cleaning")} {t("communityNews")}</h4>
                                <p className="text-sm text-gray-500">Servicios de Limpieza - 20/05/2025</p>
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
                                <Badge className="mb-1">{t("maintenance")}</Badge>
                                <h4 className="font-bold">{t("elevatorMaintenance")}</h4>
                                <p className="text-sm text-gray-500">Mantenimiento Profesional - 10/04/2025</p>
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
            
            {/* Community Chat Tab */}
            {activeTab === "chat" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 gap-4">
                  {communityContacts.map((contact) => (
                    <Card key={contact.id} className="hover:bg-gray-50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-600" />
                            </div>
                            {contact.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold">{contact.name}</h3>
                                <p className="text-sm text-gray-500">{contact.role}</p>
                              </div>
                              <span className="text-xs text-gray-500">{contact.timestamp}</span>
                            </div>
                            <p className="text-gray-600 mt-1 line-clamp-1">{contact.lastMessage}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {/* Video Conference Tab */}
            {activeTab === "videoconference" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>{t("scheduleNewMeeting")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form className="space-y-4">
                          <div>
                            <Label htmlFor="meeting-title">{t("meetingTitle")}</Label>
                            <Input id="meeting-title" placeholder={t("enterMeetingTitle")} />
                          </div>
                          <div>
                            <Label htmlFor="meeting-date">{t("date")}</Label>
                            <Input id="meeting-date" type="date" />
                          </div>
                          <div>
                            <Label htmlFor="meeting-time">{t("time")}</Label>
                            <Input id="meeting-time" type="time" />
                          </div>
                          <div>
                            <Label htmlFor="meeting-participants">{t("participants")}</Label>
                            <Input id="meeting-participants" placeholder={t("enterParticipantsEmails")} />
                          </div>
                          <div>
                            <Label htmlFor="meeting-agenda">{t("agenda")}</Label>
                            <Textarea id="meeting-agenda" placeholder={t("enterMeetingAgenda")} />
                          </div>
                          <Button className="w-full">{t("scheduleMeeting")}</Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>{t("upcomingMeetings")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold">{t("communityBudgetDiscussion")}</h3>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span>May 15, 2025 - 18:00</span>
                                </div>
                              </div>
                              <Badge>{t("scheduled")}</Badge>
                            </div>
                            <div className="mt-2">
                              <Button variant="outline" size="sm" className="mr-2">{t("edit")}</Button>
                              <Button size="sm">{t("joinMeeting")}</Button>
                            </div>
                          </div>
                          <div className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold">{t("maintenanceCoordinationMeeting")}</h3>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span>May 20, 2025 - 19:30</span>
                                </div>
                              </div>
                              <Badge>{t("scheduled")}</Badge>
                            </div>
                            <div className="mt-2">
                              <Button variant="outline" size="sm" className="mr-2">{t("edit")}</Button>
                              <Button size="sm">{t("joinMeeting")}</Button>
                            </div>
                          </div>
                          <div className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold">{t("communityEventPlanning")}</h3>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span>June 5, 2025 - 20:00</span>
                                </div>
                              </div>
                              <Badge>{t("scheduled")}</Badge>
                            </div>
                            <div className="mt-2">
                              <Button variant="outline" size="sm" className="mr-2">{t("edit")}</Button>
                              <Button size="sm">{t("joinMeeting")}</Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
            
            {/* Report Issue Tab */}
            {activeTab === "issue" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <Card>
                  <CardContent className="p-6">
                    <form className="space-y-6">
                      <div>
                        <Label htmlFor="issue-title" className="text-base font-medium">{t("whatHappened")}</Label>
                        <Input id="issue-title" className="mt-1" placeholder={t("briefDescriptionOfIssue")} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="issue-date" className="text-base font-medium">{t("when")}</Label>
                          <div className="flex items-center mt-1">
                            <Input id="issue-date" type="date" className="flex-1" />
                            <Input id="issue-time" type="time" className="flex-1 ml-2" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="issue-location" className="text-base font-medium">{t("where")}</Label>
                          <Input id="issue-location" className="mt-1" placeholder={t("locationOfIssue")} />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="issue-description" className="text-base font-medium">{t("howItHappened")}</Label>
                        <Textarea id="issue-description" className="mt-1" rows={5} placeholder={t("detailedDescriptionOfIssue")} />
                      </div>
                      <div>
                        <Label className="text-base font-medium">{t("uploadPictures")}</Label>
                        <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">{t("dragAndDropOrClick")}</p>
                          <Button variant="outline" size="sm" className="mt-2">{t("browseFiles")}</Button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="issue-urgency" className="text-base font-medium">{t("urgencyLevel")}</Label>
                        <select id="issue-urgency" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
                          <option>{t("low")}</option>
                          <option>{t("medium")}</option>
                          <option>{t("high")}</option>
                          <option>{t("critical")}</option>
                        </select>
                      </div>
                      <Button className="w-full">{t("submitIssue")}</Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Community Contracts Tab */}
            {activeTab === "contracts" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("title")}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("type")}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("date")}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("format")}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("actions")}</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {communityContracts.map((contract) => (
                        <tr key={contract.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">{contract.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{contract.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{contract.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="outline" className={contract.fileType === "pdf" ? "bg-red-100 text-red-800 border-red-300" : "bg-blue-100 text-blue-800 border-blue-300"}>
                              {contract.fileType.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button variant="outline" size="sm" className="mr-2">{t("view")}</Button>
                            <Button size="sm">{t("download")}</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Community Budget Tab */}
            {activeTab === "budget" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-green-800">{t("totalIncome")}</h3>
                        <FileSpreadsheet className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-green-700 mt-2">€45,000.00</p>
                      <p className="text-sm text-green-600 mt-1">{t("annualCommunityFees")}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-red-800">{t("totalExpenses")}</h3>
                        <FileSpreadsheet className="h-5 w-5 text-red-600" />
                      </div>
                      <p className="text-2xl font-bold text-red-700 mt-2">€38,500.00</p>
                      <p className="text-sm text-red-600 mt-1">{t("maintenanceAndServices")}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-blue-800">{t("balance")}</h3>
                        <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-blue-700 mt-2">€6,500.00</p>
                      <p className="text-sm text-blue-600 mt-1">{t("reserveFund")}</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="border rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-medium mb-2">{t("budgetBreakdown")}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">{t("expenses")}</h4>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span>{t("cleaning")}</span>
                          <span className="font-medium">€8,400.00</span>
                        </li>
                        <li className="flex justify-between">
                          <span>{t("maintenance")}</span>
                          <span className="font-medium">€12,000.00</span>
                        </li>
                        <li className="flex justify-between">
                          <span>{t("utilities")}</span>
                          <span className="font-medium">€6,500.00</span>
                        </li>
                        <li className="flex justify-between">
                          <span>{t("insurance")}</span>
                          <span className="font-medium">€3,800.00</span>
                        </li>
                        <li className="flex justify-between">
                          <span>{t("gardening")}</span>
                          <span className="font-medium">€2,400.00</span>
                        </li>
                        <li className="flex justify-between">
                          <span>{t("administration")}</span>
                          <span className="font-medium">€5,400.00</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">{t("income")}</h4>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span>{t("regularFees")}</span>
                          <span className="font-medium">€42,000.00</span>
                        </li>
                        <li className="flex justify-between">
                          <span>{t("extraordianryFees")}</span>
                          <span className="font-medium">€2,500.00</span>
                        </li>
                        <li className="flex justify-between">
                          <span>{t("interestEarned")}</span>
                          <span className="font-medium">€500.00</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline">{t("downloadExcelFile")}</Button>
                  <Button>{t("viewDetailedBudget")}</Button>
                </div>
              </div>
            )}
            
            {/* Contact Administrator Tab */}
            {activeTab === "contact" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <Building className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{t("yourEstateAdministrator")}</h3>
                          <p className="text-gray-600">Alberto Méndez - Administraciones Méndez S.L.</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-5 w-5 text-gray-500" />
                          <span>admin@mendezsl.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-gray-500" />
                          <span>{t("officeHours")}: 9:00 - 17:00</span>
                        </div>
                      </div>
                    </div>
                    
                    <form className="space-y-4">
                      <div>
                        <Label htmlFor="email-subject">{t("subject")}</Label>
                        <Input id="email-subject" placeholder={t("enterEmailSubject")} />
                      </div>
                      <div>
                        <Label htmlFor="email-message">{t("message")}</Label>
                        <Textarea id="email-message" rows={6} placeholder={t("enterYourMessage")} />
                      </div>
                      <div>
                        <Label className="text-base font-medium">{t("attachFiles")}</Label>
                        <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <Upload className="h-6 w-6 mx-auto text-gray-400" />
                          <p className="mt-1 text-sm text-gray-500">{t("dragAndDropOrClick")}</p>
                          <Button variant="outline" size="sm" className="mt-2">{t("browseFiles")}</Button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <Button variant="outline">{t("saveAsDraft")}</Button>
                        <Button>{t("sendEmail")}</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Prepare Bid Tab */}
            {activeTab === "bid" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("selectServiceCategory")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="justify-start">
                          <Droplet className="mr-2 h-4 w-4" />
                          {t("plumbing")}
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Zap className="mr-2 h-4 w-4" />
                          {t("electrical")}
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Paintbrush className="mr-2 h-4 w-4" />
                          {t("painting")}
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Hammer className="mr-2 h-4 w-4" />
                          {t("carpentry")}
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Construction className="mr-2 h-4 w-4" />
                          {t("masonry")}
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Home className="mr-2 h-4 w-4" />
                          {t("roofing")}
                        </Button>
                      </div>
                      <div className="mt-4">
                        <Button className="w-full">{t("viewAllCategories")}</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("bidDetails")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div>
                          <Label htmlFor="bid-title">{t("projectTitle")}</Label>
                          <Input id="bid-title" placeholder={t("enterProjectTitle")} />
                        </div>
                        <div>
                          <Label htmlFor="bid-description">{t("description")}</Label>
                          <Textarea id="bid-description" placeholder={t("describeYourProject")} />
                        </div>
                        <div>
                          <Label htmlFor="bid-budget">{t("estimatedBudget")}</Label>
                          <Input id="bid-budget" placeholder="€" />
                        </div>
                        <div>
                          <Label htmlFor="bid-deadline">{t("projectDeadline")}</Label>
                          <Input id="bid-deadline" type="date" />
                        </div>
                        <Button className="w-full">{t("submitBidRequest")}</Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4">{t("recentCommunityBids")}</h3>
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <Badge className="mb-2">{t("plumbing")}</Badge>
                            <h4 className="font-bold">{t("bathroomRenovation")}</h4>
                            <p className="text-sm text-gray-600 mt-1">{t("communityBathroomUpgrade")}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">€3,500</p>
                            <p className="text-xs text-gray-500">{t("deadline")}: June 15, 2025</p>
                          </div>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button variant="outline" size="sm">{t("viewDetails")}</Button>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <Badge className="mb-2">{t("painting")}</Badge>
                            <h4 className="font-bold">{t("hallwayPainting")}</h4>
                            <p className="text-sm text-gray-600 mt-1">{t("communityHallwayRefresh")}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">€2,200</p>
                            <p className="text-xs text-gray-500">{t("deadline")}: May 30, 2025</p>
                          </div>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button variant="outline" size="sm">{t("viewDetails")}</Button>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <Badge className="mb-2">{t("electrical")}</Badge>
                            <h4 className="font-bold">{t("lightingUpgrade")}</h4>
                            <p className="text-sm text-gray-600 mt-1">{t("energyEfficientLighting")}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">€1,800</p>
                            <p className="text-xs text-gray-500">{t("deadline")}: July 10, 2025</p>
                          </div>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button variant="outline" size="sm">{t("viewDetails")}</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
            
            {/* Proveedores de Servicios Tab */}
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
            
            {/* Notificaciones Tab */}
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
            
            {/* Recomendaciones Tab */}
            {activeTab === "recomendaciones" && (
              <div className="bg-white rounded-lg shadow-md p-6">
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
                    <ThumbsUp className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">{t("noFavoriteProviders")}</h3>
                    <p className="text-gray-500 mb-4">{t("addFavoriteProvidersDesc")}</p>
                    <Button onClick={() => setActiveTab("proveedores")}>{t("exploreProviders")}</Button>
                  </div>
                )}
              </div>
            )}
            
            {/* Configuración Tab */}
            {activeTab === "configuracion" && (
              <div className="bg-white rounded-lg shadow-md p-6">
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
                              <input type="checkbox" defaultChecked readOnly />
                            </div>
                            <div className="flex items-center justify-between">
                              <span>{t("pushNotifications")}</span>
                              <input type="checkbox" defaultChecked readOnly />
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
                              <input type="checkbox" defaultChecked readOnly />
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

            {/* Valoraciones de Servicios Tab */}
            {activeTab === "valoraciones" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("ratePendingServices")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{t("noPendingServicesToRate")}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("myPastRatings")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{t("noPastRatings")}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Mejores Valorados Tab */}
            {activeTab === "mejores" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600">{t("bestRatedProvidersFeatureComingSoon")}</p>
              </div>
            )}

            {/* Mi Cuenta Tab */}
            {activeTab === "cuenta" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600">{t("myAccountFeatureComingSoon")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

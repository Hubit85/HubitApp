
import React, { useState } from "react";
import Head from "next/head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Wrench, 
  Zap, 
  Paintbrush, 
  Grid, 
  Droplet, 
  Thermometer, 
  Home, 
  Hammer, 
  Trees, 
  Truck, 
  Wifi, 
  Key, 
  Star, 
  Camera, 
  CheckCircle, 
  Clock, 
  Briefcase, 
  Building
} from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/layout/Header";
import { SidebarServiceProvider } from "@/components/layout/SidebarServiceProvider";

interface RepairCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export default function ServiceProviderDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { t } = useLanguage();
  
  const repairCategories: RepairCategory[] = [
    { id: 'plumbing', name: t('plumbing'), icon: <Droplet className='h-5 w-5' /> },
    { id: 'electrical', name: t('electrical'), icon: <Zap className='h-5 w-5' /> },
    { id: 'painting', name: t('painting'), icon: <Paintbrush className='h-5 w-5' /> },
    { id: 'flooring', name: t('flooring'), icon: <Grid className='h-5 w-5' /> },
    { id: 'roofing', name: t('roofing'), icon: <Home className='h-5 w-5' /> },
    { id: 'hvac', name: t('hvac'), icon: <Thermometer className='h-5 w-5' /> },
    { id: 'carpentry', name: t('carpentry'), icon: <Hammer className='h-5 w-5' /> },
    { id: 'locksmith', name: t('locksmith'), icon: <Key className='h-5 w-5' /> },
    { id: 'appliance', name: t('applianceRepair'), icon: <Wrench className='h-5 w-5' /> },
    { id: 'landscaping', name: t('landscaping'), icon: <Trees className='h-5 w-5' /> },
    { id: 'moving', name: t('movingServices'), icon: <Truck className='h-5 w-5' /> },
    { id: 'networking', name: t('homeNetworking'), icon: <Wifi className='h-5 w-5' /> },
  ];

  return (
    <>
      <Head>
        <title>{t('serviceProviderDashboard')} | {t('hubit')}</title>
        <meta name='description' content={t('serviceProviderDesc')} />
      </Head>
      
      <Header />
      
      <div className='flex h-screen bg-gray-100 pt-16'>
        <SidebarServiceProvider activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 overflow-auto p-6">
          <h1 className="text-3xl font-bold mb-6">
            {activeTab === "overview" ? t("serviceProviderDashboard") : 
             activeTab === "perfil" ? t("myProfile") :
             (repairCategories.find(c => c.id === activeTab)?.name || "") + " " + t("services")}
          </h1>
          
          {activeTab === "perfil" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4 relative">
                    <Building className="h-12 w-12 text-gray-500" />
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-white hover:bg-gray-100"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <h2 className="text-xl font-bold">Fontanería Express S.L.</h2>
                  <p className="text-gray-500 mb-2">{t("serviceProvider")}</p>
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex mr-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">4.8 (124 {t("reviews")})</span>
                  </div>
                  <Button className="w-full mb-2">{t("editProfile")}</Button>
                  <Button variant="outline" className="w-full">{t("viewPublicProfile")}</Button>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>{t("companyInformation")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>{t("companyName")}</Label>
                      <p className="text-gray-600">Fontanería Express S.L.</p>
                    </div>
                    <div>
                      <Label>{t("taxId")}</Label>
                      <p className="text-gray-600">B-12345678</p>
                    </div>
                    <div>
                      <Label>{t("phoneLabel")}</Label>
                      <p className="text-gray-600">+34 912 345 678</p>
                    </div>
                    <div>
                      <Label>{t("emailLabel")}</Label>
                      <p className="text-gray-600">info@fontaneriaexpress.com</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label>{t("businessAddress")}</Label>
                    <p className="text-gray-600">Calle Mayor 123, 28001 Madrid, España</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("activeBids")}</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+5 {t("vsLastWeek")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("completedJobs")}</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">+20 {t("thisMonth")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("averageRating")}</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.8</div>
                  <p className="text-xs text-muted-foreground">{t("basedOn")} 124 {t("reviews")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("responseTime")}</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2h</div>
                  <p className="text-xs text-muted-foreground">{t("average")}</p>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>{t("recentActivity")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{t("newQuoteRequest")}</h4>
                        <p className="text-sm text-gray-500">{t("bathroomPlumbingOverhaul")} - €450</p>
                      </div>
                      <Button size="sm">{t("respond")}</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{t("jobCompleted")}</h4>
                        <p className="text-sm text-gray-500">{t("kitchenSinkInstallation")} - €280</p>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        {t("completed")}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {repairCategories.some(c => c.id === activeTab) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("availableJobs")} - {repairCategories.find(c => c.id === activeTab)?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold">{t("bathroomPlumbingOverhaul")}</h4>
                          <p className="text-sm text-gray-500">{t("budget")}: €450</p>
                        </div>
                        <Badge variant="secondary">Urgente</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Necesito reparar una fuga en el baño principal y cambiar la grifería.
                      </p>
                      <Button size="sm">{t("submitBid")}</Button>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold">{t("kitchenSinkInstallation")}</h4>
                          <p className="text-sm text-gray-500">{t("budget")}: €280</p>
                        </div>
                        <Badge variant="outline">Normal</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Instalación de nuevo fregadero de cocina con grifería incluida.
                      </p>
                      <Button size="sm">{t("submitBid")}</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("myBids")} - {repairCategories.find(c => c.id === activeTab)?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold">{t("toiletRepair")}</h4>
                          <p className="text-sm text-gray-500">{t("myBid")}: €175</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Reparación de cisterna y cambio de mecanismo interno.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold">{t("leakDetection")}</h4>
                          <p className="text-sm text-gray-500">{t("myBid")}: €320</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Aceptado</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Detección y reparación de fuga en tubería principal.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

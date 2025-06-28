import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users, Building, Wrench, User } from "lucide-react";
import PropertySelector from '@/components/PropertySelector';
import ZoomableSection from "@/components/ZoomableSection";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);
  const [showPropertySelector, setShowPropertySelector] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const { t } = useLanguage();
  const router = useRouter();

  const handleUserTypeSelect = (userType: string) => {
    if (userType === 'particular' || userType === 'communityMember') {
      setSelectedUserType(userType);
      setShowPropertySelector(true);
    } else {
      // Direct navigation for service providers and administrators
      switch (userType) {
        case 'serviceProvider':
          router.push('/service-provider');
          break;
        case 'estateAdministrator':
          router.push('/administrador-fincas');
          break;
        default:
          break;
      }
    }
  };

  const handlePropertySelected = (property: any, unit: any) => {
    setSelectedProperty({ property, unit });
    setShowPropertySelector(false);
    
    // Generate community code for the user
    const communityCode = `ES-MAD-${property.communityName.toUpperCase().replace(/\s+/g, '')}-${property.address.split(' ')[2]}-${unit.unitNumber.padStart(4, '0')}`;
    
    // Store property selection in localStorage or context
    localStorage.setItem('selectedProperty', JSON.stringify({ property, unit, communityCode }));
    
    // Navigate to appropriate dashboard
    if (selectedUserType === 'particular') {
      router.push('/particular');
    } else if (selectedUserType === 'communityMember') {
      router.push('/community-member');
    }
  };

  const handlePropertySelectorCancel = () => {
    setShowPropertySelector(false);
    setSelectedUserType(null);
  };

  // Show property selector if needed
  if (showPropertySelector && selectedUserType) {
    return (
      <PropertySelector
        userType={selectedUserType as 'particular' | 'community_member'}
        onPropertySelected={handlePropertySelected}
        onCancel={handlePropertySelectorCancel}
      />
    );
  }

  return (
    <>
      <Head>
        <title>{t('welcomeToDashboard')} | {t('hubit')}</title>
        <meta name="description" content={t('selectUserTypeDesc')} />
      </Head>
      
      <Header />
      
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-16">
        <ZoomableSection className="min-h-screen" enableZoom={true} maxScale={3} minScale={0.5}>
          <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-blue-900 mb-4">{t('welcomeToDashboard')}</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('selectUserTypeDesc')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {/* Community Member */}
              <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl text-green-800">{t('communityMember')}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {t('communityMemberDesc')}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleUserTypeSelect('communityMember')}
                  >
                    {t('accessDashboard')}
                  </Button>
                </CardFooter>
              </Card>

              {/* Service Provider */}
              <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                    <Wrench className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl text-blue-800">{t('serviceProvider')}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {t('serviceProviderDesc')}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleUserTypeSelect('serviceProvider')}
                  >
                    {t('accessDashboard')}
                  </Button>
                </CardFooter>
              </Card>

              {/* Estate Administrator */}
              <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                    <Building className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl text-purple-800">{t('estateAdministrator')}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {t('estateAdministratorDesc')}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => handleUserTypeSelect('estateAdministrator')}
                  >
                    {t('accessDashboard')}
                  </Button>
                </CardFooter>
              </Card>

              {/* Particular */}
              <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                    <User className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl text-orange-800">{t('particular')}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {t('particularDesc')}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    onClick={() => handleUserTypeSelect('particular')}
                  >
                    {t('accessDashboard')}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </ZoomableSection>
      </main>
    </>
  );
}

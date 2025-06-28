import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users, Building, Wrench, User, ChevronRight, Star, MapPin, Calendar, Clock } from "lucide-react";
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

  const images = [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  ];

  const userTypeImages = {
    communityMember: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    particular: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    serviceProvider: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    estateAdministrator: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleUserTypeSelect = (userType: string) => {
    if (userType === 'particular' || userType === 'communityMember') {
      setSelectedUserType(userType);
      setShowPropertySelector(true);
    } else {
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
    
    const communityCode = `ES-MAD-${property.communityName.toUpperCase().replace(/\s+/g, '')}-${property.address.split(' ')[2]}-${unit.unitNumber.padStart(4, '0')}`;
    localStorage.setItem('selectedProperty', JSON.stringify({ property, unit, communityCode }));
    
    if (selectedUserType === 'particular') {
      router.push('/particular');
    } else if (selectedUserType === 'communityMember') {
      router.push('/community-member');
    }
  };

  const handleCardExpand = (cardType: string) => {
    setExpandedCard(expandedCard === cardType ? null : cardType);
  };

  if (showPropertySelector) {
    return (
      <PropertySelector
        onPropertySelected={handlePropertySelected}
        onCancel={() => setShowPropertySelector(false)}
      />
    );
  }

  return (
    <>
      <Head>
        <title>¿Cuál es tu rol? | {t('hubit')}</title>
        <meta name="description" content={t('selectUserTypeDesc')} />
      </Head>
      
      <Header />
      
      <main className="min-h-screen bg-gray-100 pt-16">
        <ZoomableSection className="min-h-screen" enableZoom={true} maxScale={3} minScale={0.5}>
          <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <motion.h1 
                className="text-4xl font-bold text-gray-800 mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                ¿Cuál es tu rol?
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {t('selectUserTypeDesc')}
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Community Member Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card 
                  className={`shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                    expandedCard === 'communityMember' ? 'md:col-span-2' : ''
                  }`}
                  onClick={() => handleCardExpand('communityMember')}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${userTypeImages.communityMember})` }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50" />
                  <div className="relative z-10">
                    <CardHeader className="text-center">
                      <div 
                        className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-cover bg-center border-4 border-white"
                        style={{ backgroundImage: `url(${userTypeImages.communityMember})` }}
                      >
                        <div className="w-full h-full rounded-full bg-black bg-opacity-40 flex items-center justify-center">
                          <Users className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
                        {t('communityMember')}
                        <ChevronRight className={`h-5 w-5 transition-transform ${expandedCard === 'communityMember' ? 'rotate-90' : ''}`} />
                      </CardTitle>
                      <CardDescription className="text-gray-200">
                        {t('communityMemberDesc')}
                      </CardDescription>
                    </CardHeader>
                    
                    {expandedCard === 'communityMember' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="pt-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-white">{t('features')}</h3>
                              <ul className="space-y-2 text-gray-200">
                                <li className="flex items-center gap-2">
                                  <Star className="h-4 w-4 text-gray-300" />
                                  {t('manageCommonAreas')}
                                </li>
                                <li className="flex items-center gap-2">
                                  <Star className="h-4 w-4 text-gray-300" />
                                  {t('viewCommunityBudget')}
                                </li>
                                <li className="flex items-center gap-2">
                                  <Star className="h-4 w-4 text-gray-300" />
                                  {t('participateInVoting')}
                                </li>
                                <li className="flex items-center gap-2">
                                  <Star className="h-4 w-4 text-gray-300" />
                                  {t('communicateWithNeighbors')}
                                </li>
                              </ul>
                            </div>
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-white">{t('recentActivity')}</h3>
                              <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                                  <Calendar className="h-4 w-4 text-gray-300" />
                                  <div>
                                    <p className="text-sm font-medium text-white">{t('nextMeeting')}</p>
                                    <p className="text-xs text-gray-300">15 {t('january')} 2024</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                                  <Clock className="h-4 w-4 text-gray-300" />
                                  <div>
                                    <p className="text-sm font-medium text-white">{t('pendingPayments')}</p>
                                    <p className="text-xs text-gray-300">€125.50</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                    
                    <CardFooter>
                      <Button 
                        className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-30 backdrop-blur-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserTypeSelect('communityMember');
                        }}
                      >
                        {t('accessDashboard')}
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              </motion.div>

              {/* Service Provider Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card 
                  className={`shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                    expandedCard === 'serviceProvider' ? 'md:col-span-2' : ''
                  }`}
                  onClick={() => handleCardExpand('serviceProvider')}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${userTypeImages.serviceProvider})` }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50" />
                  <div className="relative z-10">
                    <CardHeader className="text-center">
                      <div 
                        className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-cover bg-center border-4 border-white"
                        style={{ backgroundImage: `url(${userTypeImages.serviceProvider})` }}
                      >
                        <div className="w-full h-full rounded-full bg-black bg-opacity-40 flex items-center justify-center">
                          <Wrench className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
                        {t('serviceProvider')}
                        <ChevronRight className={`h-5 w-5 transition-transform ${expandedCard === 'serviceProvider' ? 'rotate-90' : ''}`} />
                      </CardTitle>
                      <CardDescription className="text-gray-200">
                        {t('serviceProviderDesc')}
                      </CardDescription>
                    </CardHeader>
                    
                    {expandedCard === 'serviceProvider' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="pt-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-white">{t('services')}</h3>
                              <ul className="space-y-2 text-gray-200">
                                <li className="flex items-center gap-2">
                                  <Star className="h-4 w-4 text-gray-300" />
                                  {t('receiveServiceRequests')}
                                </li>
                                <li className="flex items-center gap-2">
                                  <Star className="h-4 w-4 text-gray-300" />
                                  {t('manageQuotes')}
                                </li>
                                <li className="flex items-center gap-2">
                                  <Star className="h-4 w-4 text-gray-300" />
                                  {t('trackJobs')}
                                </li>
                                <li className="flex items-center gap-2">
                                  <Star className="h-4 w-4 text-gray-300" />
                                  {t('buildReputation')}
                                </li>
                              </ul>
                            </div>
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-white">{t('statistics')}</h3>
                              <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                                  <Star className="h-4 w-4 text-gray-300" />
                                  <div>
                                    <p className="text-sm font-medium text-white">{t('averageRating')}</p>
                                    <p className="text-xs text-gray-300">4.8/5.0</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                                  <Clock className="h-4 w-4 text-gray-300" />
                                  <div>
                                    <p className="text-sm font-medium text-white">{t('completedJobs')}</p>
                                    <p className="text-xs text-gray-300">156 {t('thisMonth')}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                    
                    <CardFooter>
                      <Button 
                        className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-30 backdrop-blur-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserTypeSelect('serviceProvider');
                        }}
                      >
                        {t('accessDashboard')}
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              </motion.div>

              {/* Estate Administrator Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card 
                  className={`shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                    expandedCard === 'estateAdministrator' ? 'md:col-span-2' : ''
                  }`}
                  onClick={() => handleCardExpand('estateAdministrator')}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${userTypeImages.estateAdministrator})` }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50" />
                  <div className="relative z-10">
                    <CardHeader className="text-center">
                      <div 
                        className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-cover bg-center border-4 border-white"
                        style={{ backgroundImage: `url(${userTypeImages.estateAdministrator})` }}
                      >
                        <div className="w-full h-full rounded-full bg-black bg-opacity-40 flex items-center justify-center">
                          <Building className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
                        {t('estateAdministrator')}
                        <ChevronRight className={`h-5 w-5 transition-transform ${expandedCard === 'estateAdministrator' ? 'rotate-90' : ''}`} />
                      </CardTitle>
                      <CardDescription className="text-gray-200">
                        {t('estateAdministratorDesc')}
                      </CardDescription>
                    </CardHeader>
                    
                    {expandedCard === 'estateAdministrator' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="pt-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-white">{t('management')}</h3>
                              <ul className="space-y-2 text-gray-200">
                                <li className="flex items-center gap-2">
                                  <Star className="h-4 w-4 text-gray-300" />
                                  {t('manageMultipleProperties')}
                                </li>
                                <li className="flex items-center gap-2">
                                  <Star className="h-4 w-4 text-gray-300" />
                                  {t('financialReporting')}
                                </li>
                                <li className="flex items-center gap-2">
                                  <Star className="h-4 w-4 text-gray-300" />
                                  {t('maintenanceCoordination')}
                                </li>
                                <li className="flex items-center gap-2">
                                  <Star className="h-4 w-4 text-gray-300" />
                                  {t('legalCompliance')}
                                </li>
                              </ul>
                            </div>
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-white">{t('portfolio')}</h3>
                              <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                                  <Building className="h-4 w-4 text-gray-300" />
                                  <div>
                                    <p className="text-sm font-medium text-white">{t('managedProperties')}</p>
                                    <p className="text-xs text-gray-300">24 {t('buildings')}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                                  <Users className="h-4 w-4 text-gray-300" />
                                  <div>
                                    <p className="text-sm font-medium text-white">{t('totalUnits')}</p>
                                    <p className="text-xs text-gray-300">1,247 {t('units')}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                    
                    <CardFooter>
                      <Button 
                        className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-30 backdrop-blur-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserTypeSelect('estateAdministrator');
                        }}
                      >
                        {t('accessDashboard')}
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              </motion.div>

              {/* Particular Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card 
                  className={`shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                    expandedCard === 'particular' ? 'md:col-span-2' : ''
                  }`}
                  onClick={() => handleCardExpand('particular')}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${userTypeImages.particular})` }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50" />
                  <div className="relative z-10">
                    <CardHeader className="text-center">
                      <div 
                        className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-cover bg-center border-4 border-white"
                        style={{ backgroundImage: `url(${userTypeImages.particular})` }}
                      >
                        <div className="w-full h-full rounded-full bg-black bg-opacity-40 flex items-center justify-center">
                          <User className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
                        {t('particular')}
                        <ChevronRight className={`h-5 w-5 transition-transform ${expandedCard === 'particular' ? 'rotate-90' : ''}`} />
                      </CardTitle>
                      <CardDescription className="text-gray-200">
                        {t('particularDesc')}
                      </CardDescription>
                    </CardHeader>
                    
                    {expandedCard === 'particular' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="pt-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-white">{t('services')}</h3>
                              <ul className="space-y-2 text-gray-200">
                                <li className="flex items-center gap-2">
                                  <Star className="h-4 w-4 text-gray-300" />
                                  {t('requestQuotes')}
                                </li>
                                <li className="flex items-center gap-2">
                                  <Star className="h-4 w-4 text-gray-300" />
                                  {t('findServiceProviders')}
                                </li>
                                <li className="flex items-center gap-2">
                                  <Star className="h-4 w-4 text-gray-300" />
                                  {t('manageProperties')}
                                </li>
                                <li className="flex items-center gap-2">
                                  <Star className="h-4 w-4 text-gray-300" />
                                  {t('trackProjects')}
                                </li>
                              </ul>
                            </div>
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-white">{t('quickAccess')}</h3>
                              <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                                  <MapPin className="h-4 w-4 text-gray-300" />
                                  <div>
                                    <p className="text-sm font-medium text-white">{t('nearbyProviders')}</p>
                                    <p className="text-xs text-gray-300">15 {t('available')}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                                  <Clock className="h-4 w-4 text-gray-300" />
                                  <div>
                                    <p className="text-sm font-medium text-white">{t('activeRequests')}</p>
                                    <p className="text-xs text-gray-300">3 {t('pending')}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                    
                    <CardFooter>
                      <Button 
                        className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-30 backdrop-blur-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserTypeSelect('particular');
                        }}
                      >
                        {t('accessDashboard')}
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Remove the Hero Section completely */}
          </div>
        </ZoomableSection>
      </main>
    </>
  );
}

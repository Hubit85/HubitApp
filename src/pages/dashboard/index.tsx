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
                  className={`shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group ${
                    expandedCard === 'communityMember' ? 'md:col-span-2 bg-gray-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleCardExpand('communityMember')}
                >
                  <CardHeader className="text-center">
                    <div 
                      className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-cover bg-center"
                      style={{ backgroundImage: `url(${userTypeImages.communityMember})` }}
                    >
                      <div className="w-full h-full rounded-full bg-black bg-opacity-40 flex items-center justify-center">
                        <Users className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-gray-800 flex items-center justify-center gap-2">
                      {t('communityMember')}
                      <ChevronRight className={`h-5 w-5 transition-transform ${expandedCard === 'communityMember' ? 'rotate-90' : ''}`} />
                    </CardTitle>
                    <CardDescription className="text-gray-600">
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
                            <h3 className="text-lg font-semibold text-gray-800">{t('features')}</h3>
                            <ul className="space-y-2 text-gray-600">
                              <li className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-gray-500" />
                                {t('manageCommonAreas')}
                              </li>
                              <li className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-gray-500" />
                                {t('viewCommunityBudget')}
                              </li>
                              <li className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-gray-500" />
                                {t('participateInVoting')}
                              </li>
                              <li className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-gray-500" />
                                {t('communicateWithNeighbors')}
                              </li>
                            </ul>
                          </div>
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">{t('recentActivity')}</h3>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <div>
                                  <p className="text-sm font-medium">{t('nextMeeting')}</p>
                                  <p className="text-xs text-gray-500">15 {t('january')} 2024</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <div>
                                  <p className="text-sm font-medium">{t('pendingPayments')}</p>
                                  <p className="text-xs text-gray-500">€125.50</p>
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
                      className="w-full bg-gray-800 hover:bg-gray-700 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUserTypeSelect('communityMember');
                      }}
                    >
                      {t('accessDashboard')}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>

              {/* Service Provider Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card 
                  className={`shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group ${
                    expandedCard === 'serviceProvider' ? 'md:col-span-2 bg-gray-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleCardExpand('serviceProvider')}
                >
                  <CardHeader className="text-center">
                    <div 
                      className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-cover bg-center"
                      style={{ backgroundImage: `url(${userTypeImages.serviceProvider})` }}
                    >
                      <div className="w-full h-full rounded-full bg-black bg-opacity-40 flex items-center justify-center">
                        <Wrench className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-gray-800 flex items-center justify-center gap-2">
                      {t('serviceProvider')}
                      <ChevronRight className={`h-5 w-5 transition-transform ${expandedCard === 'serviceProvider' ? 'rotate-90' : ''}`} />
                    </CardTitle>
                    <CardDescription className="text-gray-600">
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
                            <h3 className="text-lg font-semibold text-gray-800">{t('services')}</h3>
                            <ul className="space-y-2 text-gray-600">
                              <li className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-gray-500" />
                                {t('receiveServiceRequests')}
                              </li>
                              <li className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-gray-500" />
                                {t('manageQuotes')}
                              </li>
                              <li className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-gray-500" />
                                {t('trackJobs')}
                              </li>
                              <li className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-gray-500" />
                                {t('buildReputation')}
                              </li>
                            </ul>
                          </div>
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">{t('statistics')}</h3>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                                <Star className="h-4 w-4 text-gray-500" />
                                <div>
                                  <p className="text-sm font-medium">{t('averageRating')}</p>
                                  <p className="text-xs text-gray-500">4.8/5.0</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <div>
                                  <p className="text-sm font-medium">{t('completedJobs')}</p>
                                  <p className="text-xs text-gray-500">156 {t('thisMonth')}</p>
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
                      className="w-full bg-gray-800 hover:bg-gray-700 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUserTypeSelect('serviceProvider');
                      }}
                    >
                      {t('accessDashboard')}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>

              {/* Estate Administrator Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card 
                  className={`shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group ${
                    expandedCard === 'estateAdministrator' ? 'md:col-span-2 bg-gray-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleCardExpand('estateAdministrator')}
                >
                  <CardHeader className="text-center">
                    <div 
                      className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-cover bg-center"
                      style={{ backgroundImage: `url(${userTypeImages.estateAdministrator})` }}
                    >
                      <div className="w-full h-full rounded-full bg-black bg-opacity-40 flex items-center justify-center">
                        <Building className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-gray-800 flex items-center justify-center gap-2">
                      {t('estateAdministrator')}
                      <ChevronRight className={`h-5 w-5 transition-transform ${expandedCard === 'estateAdministrator' ? 'rotate-90' : ''}`} />
                    </CardTitle>
                    <CardDescription className="text-gray-600">
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
                            <h3 className="text-lg font-semibold text-gray-800">{t('management')}</h3>
                            <ul className="space-y-2 text-gray-600">
                              <li className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-gray-500" />
                                {t('manageMultipleProperties')}
                              </li>
                              <li className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-gray-500" />
                                {t('financialReporting')}
                              </li>
                              <li className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-gray-500" />
                                {t('maintenanceCoordination')}
                              </li>
                              <li className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-gray-500" />
                                {t('legalCompliance')}
                              </li>
                            </ul>
                          </div>
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">{t('portfolio')}</h3>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                                <Building className="h-4 w-4 text-gray-500" />
                                <div>
                                  <p className="text-sm font-medium">{t('managedProperties')}</p>
                                  <p className="text-xs text-gray-500">24 {t('buildings')}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                                <Users className="h-4 w-4 text-gray-500" />
                                <div>
                                  <p className="text-sm font-medium">{t('totalUnits')}</p>
                                  <p className="text-xs text-gray-500">1,247 {t('units')}</p>
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
                      className="w-full bg-gray-800 hover:bg-gray-700 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUserTypeSelect('estateAdministrator');
                      }}
                    >
                      {t('accessDashboard')}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>

              {/* Particular Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card 
                  className={`shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group ${
                    expandedCard === 'particular' ? 'md:col-span-2 bg-gray-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleCardExpand('particular')}
                >
                  <CardHeader className="text-center">
                    <div 
                      className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-cover bg-center"
                      style={{ backgroundImage: `url(${userTypeImages.particular})` }}
                    >
                      <div className="w-full h-full rounded-full bg-black bg-opacity-40 flex items-center justify-center">
                        <User className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-gray-800 flex items-center justify-center gap-2">
                      {t('particular')}
                      <ChevronRight className={`h-5 w-5 transition-transform ${expandedCard === 'particular' ? 'rotate-90' : ''}`} />
                    </CardTitle>
                    <CardDescription className="text-gray-600">
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
                            <h3 className="text-lg font-semibold text-gray-800">{t('services')}</h3>
                            <ul className="space-y-2 text-gray-600">
                              <li className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-gray-500" />
                                {t('requestQuotes')}
                              </li>
                              <li className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-gray-500" />
                                {t('findServiceProviders')}
                              </li>
                              <li className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-gray-500" />
                                {t('manageProperties')}
                              </li>
                              <li className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-gray-500" />
                                {t('trackProjects')}
                              </li>
                            </ul>
                          </div>
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">{t('quickAccess')}</h3>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <div>
                                  <p className="text-sm font-medium">{t('nearbyProviders')}</p>
                                  <p className="text-xs text-gray-500">15 {t('available')}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <div>
                                  <p className="text-sm font-medium">{t('activeRequests')}</p>
                                  <p className="text-xs text-gray-500">3 {t('pending')}</p>
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
                      className="w-full bg-gray-800 hover:bg-gray-700 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUserTypeSelect('particular');
                      }}
                    >
                      {t('accessDashboard')}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>

            {/* Hero Section with Rotating Images */}
            <motion.div 
              className="mt-16 relative h-96 rounded-lg overflow-hidden shadow-xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="absolute inset-0">
                {images.map((image, index) => (
                  <motion.div
                    key={index}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${image})` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
                    transition={{ duration: 1 }}
                  />
                ))}
                <div className="absolute inset-0 bg-black bg-opacity-40" />
              </div>
              <div className="relative z-10 flex items-center justify-center h-full text-white text-center">
                <div>
                  <h2 className="text-4xl font-bold mb-4">{t('transformYourProperty')}</h2>
                  <p className="text-xl mb-6">{t('connectWithProfessionals')}</p>
                  <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                    {t('getStarted')}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </ZoomableSection>
      </main>
    </>
  );
}

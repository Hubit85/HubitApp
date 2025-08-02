import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/router";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users, Building, Wrench, User, ChevronRight, Star, MapPin, Calendar, Clock, Sparkles, TrendingUp, Shield, Zap, Briefcase } from "lucide-react";
import PropertySelector from "@/components/PropertySelector";
import ZoomableSection from "@/components/ZoomableSection";
import { CheckIcon } from "lucide-react";

export default function Dashboard() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);
  const [showPropertySelector, setShowPropertySelector] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const { t } = useLanguage();
  const router = useRouter();

  const userTypeImages = {
    communityMember: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    particular: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    serviceProvider: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    estateAdministrator: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  };

  const handleUserTypeSelect = (userType: string) => {
    if (userType === 'particular' || userType === 'communityMember') {
      setSelectedUserType(userType);
      setShowPropertySelector(true);
    } else {
      switch (userType) {
        case 'serviceProvider':
          router.push('/service-provider/dashboard');
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

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        type: "spring",
        stiffness: 100
      }
    }),
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 300
      }
    }
  };

  const iconVariants: Variants = {
    initial: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.1, 
      rotate: 5,
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.95 }
  };

  const shimmerVariants: Variants = {
    initial: { x: "-100%" },
    animate: {
      x: "100%",
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: "linear"
      }
    }
  };

  const DashboardPage: React.FC = () => {
    const [expanded, setExpanded] = useState<string | null>(null);
    const { t } = useLanguage();

    const handleExpand = (card: string) => {
      setExpanded(expanded === card ? null : card);
    };

    return (
      <>
        <Head>
          <title>¿Cuál es tu rol? | {t('hubit')}</title>
          <meta name="description" content={t('selectUserTypeDesc')} />
        </Head>
        
        <Header />
        
        <main className="min-h-screen bg-white pt-16 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-20 left-10 w-72 h-72 bg-gray-100 rounded-full mix-blend-multiply filter blur-xl opacity-20"
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.div
              className="absolute top-40 right-10 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
              animate={{
                x: [0, -100, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.div
              className="absolute bottom-20 left-1/2 w-72 h-72 bg-gray-150 rounded-full mix-blend-multiply filter blur-xl opacity-20"
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>

          <ZoomableSection className="min-h-screen relative z-10" enableZoom={true} maxScale={3} minScale={0.5}>
            <div className="container mx-auto px-4 py-12">
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="relative"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                  />
                  <h1 className="text-5xl font-bold text-gray-800 mb-4 relative">
                    {t('whatsYourRole')}
                    <motion.div
                      className="absolute top-0 right-0 transform translate-x-4 -translate-y-2"
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    >
                      <Sparkles className="h-8 w-8 text-amber-600" />
                    </motion.div>
                  </h1>
                </motion.div>
                <motion.p 
                  className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {t('selectUserTypeDesc')}
                </motion.p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Particular Card */}
                <Card className="w-full cursor-pointer" onClick={() => handleExpand("particular")}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <User className="w-8 h-8" />
                      <div>
                        <CardTitle>{t("particular")}</CardTitle>
                        <CardDescription>{t("particularDesc")}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  {expanded === "particular" && (
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold mb-2">{t("features")}</h3>
                          <ul className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                            <li className="flex items-center gap-2">
                              <CheckIcon className="w-4 h-4 text-green-500" />
                              <span>{t("requestQuotes")}</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckIcon className="w-4 h-4 text-green-500" />
                              <span>{t("findServiceProviders")}</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckIcon className="w-4 h-4 text-green-500" />
                              <span>{t("manageProperties")}</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckIcon className="w-4 h-4 text-green-500" />
                              <span>{t("trackProjects")}</span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">{t("quickAccess")}</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span>{t("nearbyProviders")}</span>
                              <span className="font-medium">15 {t("available")}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>{t("activeRequests")}</span>
                              <span className="font-medium">3 {t("pending")}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button className="mt-4 w-full" onClick={() => router.push("/particular")}>{t("accessDashboard")}</Button>
                    </CardContent>
                  )}
                </Card>

                {/* Community Member Card */}
                <Card className="w-full cursor-pointer" onClick={() => handleExpand("miembro")}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Users className="w-8 h-8" />
                      <div>
                        <CardTitle>{t("communityMember")}</CardTitle>
                        <CardDescription>{t("communityMemberDesc")}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  {expanded === "miembro" && (
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold mb-2">{t("features")}</h3>
                          <ul className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                            <li className="flex items-center gap-2">
                              <CheckIcon className="w-4 h-4 text-green-500" />
                              <span>{t("manageCommonAreas")}</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckIcon className="w-4 h-4 text-green-500" />
                              <span>{t("viewCommunityBudget")}</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckIcon className="w-4 h-4 text-green-500" />
                              <span>{t("participateInVoting")}</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckIcon className="w-4 h-4 text-green-500" />
                              <span>{t("communicateWithNeighbors")}</span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">{t("recentActivity")}</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span>{t("nextMeeting")}</span>
                              <span className="font-medium">{t("january")} 15th</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>{t("pendingPayments")}</span>
                              <span className="font-medium">2</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button className="mt-4 w-full" onClick={() => router.push("/community-member")}>{t("accessDashboard")}</Button>
                    </CardContent>
                  )}
                </Card>

                {/* Service Provider Card */}
                <Card className="w-full cursor-pointer" onClick={() => handleExpand("proveedor")}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Briefcase className="w-8 h-8" />
                      <div>
                        <CardTitle>{t("serviceProvider")}</CardTitle>
                        <CardDescription>{t("serviceProviderDesc")}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  {expanded === "proveedor" && (
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold mb-2">{t("features")}</h3>
                          <ul className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                            <li className="flex items-center gap-2">
                              <CheckIcon className="w-4 h-4 text-green-500" />
                              <span>{t("receiveServiceRequests")}</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckIcon className="w-4 h-4 text-green-500" />
                              <span>{t("manageQuotes")}</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckIcon className="w-4 h-4 text-green-500" />
                              <span>{t("trackJobs")}</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckIcon className="w-4 h-4 text-green-500" />
                              <span>{t("buildReputation")}</span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">{t("statistics")}</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span>{t("completedJobs")}</span>
                              <span className="font-medium">125</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>{t("averageRating")}</span>
                              <span className="font-medium">4.8/5</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button className="mt-4 w-full" onClick={() => router.push("/service-provider/dashboard")}>{t("accessProviderPanel")}</Button>
                    </CardContent>
                  )}
                </Card>

                {/* Estate Administrator Card */}
                <Card className="w-full cursor-pointer" onClick={() => handleExpand("administrador")}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Building className="w-8 h-8" />
                      <div>
                        <CardTitle>{t("estateAdministrator")}</CardTitle>
                        <CardDescription>{t("estateAdministratorDesc")}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  {expanded === "administrador" && (
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold mb-2">{t("management")}</h3>
                          <ul className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                            <li className="flex items-center gap-2">
                              <CheckIcon className="w-4 h-4 text-green-500" />
                              <span>{t("manageMultipleProperties")}</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckIcon className="w-4 h-4 text-green-500" />
                              <span>{t("financialReporting")}</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckIcon className="w-4 h-4 text-green-500" />
                              <span>{t("maintenanceCoordination")}</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckIcon className="w-4 h-4 text-green-500" />
                              <span>{t("legalCompliance")}</span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">{t("portfolio")}</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span>{t("managedProperties")}</span>
                              <span className="font-medium">12 {t("buildings")}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>{t("residents")}</span>
                              <span className="font-medium">150 {t("units")}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button className="mt-4 w-full" onClick={() => router.push("/administrador-fincas")}>{t("accessAdministratorPanel")}</Button>
                    </CardContent>
                  )}
                </Card>
              </div>
            </div>
          </ZoomableSection>
        </main>
      </>
    );
  };

  if (showPropertySelector) {
    return (
      <PropertySelector
        onPropertySelected={handlePropertySelected}
        onCancel={() => setShowPropertySelector(false)}
        userType={selectedUserType}
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
      
      <main className="min-h-screen bg-white pt-16 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-gray-100 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute top-40 right-10 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-20 left-1/2 w-72 h-72 bg-gray-150 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <ZoomableSection className="min-h-screen relative z-10" enableZoom={true} maxScale={3} minScale={0.5}>
          <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
                <h1 className="text-5xl font-bold text-gray-800 mb-4 relative">
                  {t('whatsYourRole')}
                  <motion.div
                    className="absolute top-0 right-0 transform translate-x-4 -translate-y-2"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    <Sparkles className="h-8 w-8 text-amber-600" />
                  </motion.div>
                </h1>
              </motion.div>
              <motion.p 
                className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {t('selectUserTypeDesc')}
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Community Member Card */}
              <motion.div
                custom={0}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                whileHover="hover"
                onHoverStart={() => setHoveredCard('communityMember')}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <Card 
                  className={`shadow-2xl transition-all duration-500 cursor-pointer group relative overflow-hidden border-0 ${
                    expandedCard === 'communityMember' ? 'md:col-span-2' : ''
                  }`}
                  onClick={() => handleCardExpand('communityMember')}
                  style={{
                    background: hoveredCard === 'communityMember' 
                      ? 'linear-gradient(135deg, rgba(64, 64, 64, 0.1), rgba(101, 67, 33, 0.1))'
                      : 'rgba(255, 255, 255, 0.95)'
                  }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                      variants={shimmerVariants}
                      initial="initial"
                      animate={hoveredCard === 'communityMember' ? "animate" : "initial"}
                    />
                  </div>

                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${userTypeImages.communityMember})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 via-amber-800/60 to-gray-900/70 transition-opacity duration-500 group-hover:opacity-80" />
                  
                  {/* Floating particles */}
                  <AnimatePresence>
                    {hoveredCard === 'communityMember' && (
                      <>
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-white rounded-full opacity-60"
                            initial={{ 
                              x: Math.random() * 400,
                              y: Math.random() * 300,
                              opacity: 0 
                            }}
                            animate={{ 
                              y: -50,
                              opacity: [0, 1, 0],
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ 
                              duration: 2,
                              delay: i * 0.2,
                              repeat: Infinity
                            }}
                          />
                        ))}
                      </>
                    )}
                  </AnimatePresence>

                  <div className="relative z-10">
                    <CardHeader className="text-center">
                      <motion.div 
                        className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-white/20 backdrop-blur-sm border-4 border-white/30 shadow-2xl"
                        variants={iconVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Users className="h-12 w-12 text-white drop-shadow-lg" />
                      </motion.div>
                      <CardTitle className="text-2xl text-white flex items-center justify-center gap-2 font-bold">
                        {t('communityMember')}
                        <motion.div
                          animate={{ rotate: expandedCard === 'communityMember' ? 90 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </motion.div>
                      </CardTitle>
                      <CardDescription className="text-gray-100 text-lg">
                        {t('communityMemberDesc')}
                      </CardDescription>
                    </CardHeader>
                    
                    <AnimatePresence>
                      {expandedCard === 'communityMember' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                          <CardContent className="pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <motion.div 
                                className="space-y-4"
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                  <TrendingUp className="h-5 w-5" />
                                  {t('features')}
                                </h3>
                                <ul className="space-y-3 text-gray-200">
                                  {[
                                    t('manageCommonAreas'),
                                    t('viewCommunityBudget'),
                                    t('participateInVoting'),
                                    t('communicateWithNeighbors')
                                  ].map((feature, index) => (
                                    <motion.li 
                                      key={index}
                                      className="flex items-center gap-3 p-2 rounded-lg bg-white/10 backdrop-blur-sm"
                                      initial={{ x: -20, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ delay: 0.3 + index * 0.1 }}
                                    >
                                      <Star className="h-4 w-4 text-yellow-400" />
                                      {feature}
                                    </motion.li>
                                  ))}
                                </ul>
                              </motion.div>
                              <motion.div 
                                className="space-y-4"
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                              >
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                  <Clock className="h-5 w-5" />
                                  {t('recentActivity')}
                                </h3>
                                <div className="space-y-3">
                                  <motion.div 
                                    className="flex items-center gap-3 p-4 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20"
                                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.25)" }}
                                  >
                                    <Calendar className="h-5 w-5 text-blue-300" />
                                    <div>
                                      <p className="text-sm font-medium text-white">{t('nextMeeting')}</p>
                                      <p className="text-xs text-gray-300">15 {t('january')} 2024</p>
                                    </div>
                                  </motion.div>
                                  <motion.div 
                                    className="flex items-center gap-3 p-4 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20"
                                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.25)" }}
                                  >
                                    <Clock className="h-5 w-5 text-green-300" />
                                    <div>
                                      <p className="text-sm font-medium text-white">{t('pendingPayments')}</p>
                                      <p className="text-xs text-gray-300">€125.50</p>
                                    </div>
                                  </motion.div>
                                </div>
                              </motion.div>
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <CardFooter>
                      <motion.div className="w-full">
                        <motion.button 
                          className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm font-semibold py-3 text-lg shadow-xl rounded-md transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUserTypeSelect('communityMember');
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.span
                            className="flex items-center justify-center gap-2"
                            whileHover={{ x: 5 }}
                          >
                            {t('accessDashboard')}
                            <Zap className="h-4 w-4" />
                          </motion.span>
                        </motion.button>
                      </motion.div>
                    </CardFooter>
                  </div>
                </Card>
              </motion.div>

              {/* Service Provider Card */}
              <motion.div
                custom={1}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                whileHover="hover"
                onHoverStart={() => setHoveredCard('serviceProvider')}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <Card 
                  className={`shadow-2xl transition-all duration-500 cursor-pointer group relative overflow-hidden border-0 ${
                    expandedCard === 'serviceProvider' ? 'md:col-span-2' : ''
                  }`}
                  onClick={() => handleCardExpand('serviceProvider')}
                  style={{
                    background: hoveredCard === 'serviceProvider' 
                      ? 'linear-gradient(135deg, rgba(64, 64, 64, 0.1), rgba(101, 67, 33, 0.1))'
                      : 'rgba(255, 255, 255, 0.95)'
                  }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                      variants={shimmerVariants}
                      initial="initial"
                      animate={hoveredCard === 'serviceProvider' ? "animate" : "initial"}
                    />
                  </div>

                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${userTypeImages.serviceProvider})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 via-amber-800/60 to-gray-900/70 transition-opacity duration-500 group-hover:opacity-80" />
                  
                  {/* Floating particles */}
                  <AnimatePresence>
                    {hoveredCard === 'serviceProvider' && (
                      <>
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-white rounded-full opacity-60"
                            initial={{ 
                              x: Math.random() * 400,
                              y: Math.random() * 300,
                              opacity: 0 
                            }}
                            animate={{ 
                              y: -50,
                              opacity: [0, 1, 0],
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ 
                              duration: 2,
                              delay: i * 0.2,
                              repeat: Infinity
                            }}
                          />
                        ))}
                      </>
                    )}
                  </AnimatePresence>

                  <div className="relative z-10">
                    <CardHeader className="text-center">
                      <motion.div 
                        className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-white/20 backdrop-blur-sm border-4 border-white/30 shadow-2xl"
                        variants={iconVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Wrench className="h-12 w-12 text-white drop-shadow-lg" />
                      </motion.div>
                      <CardTitle className="text-2xl text-white flex items-center justify-center gap-2 font-bold">
                        {t('serviceProvider')}
                        <motion.div
                          animate={{ rotate: expandedCard === 'serviceProvider' ? 90 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </motion.div>
                      </CardTitle>
                      <CardDescription className="text-gray-100 text-lg">
                        {t('serviceProviderDesc')}
                      </CardDescription>
                    </CardHeader>
                    
                    <AnimatePresence>
                      {expandedCard === 'serviceProvider' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                          <CardContent className="pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <motion.div 
                                className="space-y-4"
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                  <Shield className="h-5 w-5" />
                                  {t('services')}
                                </h3>
                                <ul className="space-y-3 text-gray-200">
                                  {[
                                    t('receiveServiceRequests'),
                                    t('manageQuotes'),
                                    t('trackJobs'),
                                    t('buildReputation')
                                  ].map((service, index) => (
                                    <motion.li 
                                      key={index}
                                      className="flex items-center gap-3 p-2 rounded-lg bg-white/10 backdrop-blur-sm"
                                      initial={{ x: -20, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ delay: 0.3 + index * 0.1 }}
                                    >
                                      <Star className="h-4 w-4 text-yellow-400" />
                                      {service}
                                    </motion.li>
                                  ))}
                                </ul>
                              </motion.div>
                              <motion.div 
                                className="space-y-4"
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                              >
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                  <TrendingUp className="h-5 w-5" />
                                  {t('statistics')}
                                </h3>
                                <div className="space-y-3">
                                  <motion.div 
                                    className="flex items-center gap-3 p-4 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20"
                                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.25)" }}
                                  >
                                    <Star className="h-5 w-5 text-yellow-300" />
                                    <div>
                                      <p className="text-sm font-medium text-white">{t('averageRating')}</p>
                                      <p className="text-xs text-gray-300">4.8/5.0</p>
                                    </div>
                                  </motion.div>
                                  <motion.div 
                                    className="flex items-center gap-3 p-4 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20"
                                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.25)" }}
                                  >
                                    <Clock className="h-5 w-5 text-green-300" />
                                    <div>
                                      <p className="text-sm font-medium text-white">{t('completedJobs')}</p>
                                      <p className="text-xs text-gray-300">156 {t('thisMonth')}</p>
                                    </div>
                                  </motion.div>
                                </div>
                              </motion.div>
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <CardFooter>
                      <motion.div className="w-full">
                        <motion.button 
                          className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm font-semibold py-3 text-lg shadow-xl rounded-md transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUserTypeSelect('serviceProvider');
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.span
                            className="flex items-center justify-center gap-2"
                            whileHover={{ x: 5 }}
                          >
                            {t('accessDashboard')}
                            <Zap className="h-4 w-4" />
                          </motion.span>
                        </motion.button>
                      </motion.div>
                    </CardFooter>
                  </div>
                </Card>
              </motion.div>

              {/* Estate Administrator Card */}
              <motion.div
                custom={2}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                whileHover="hover"
                onHoverStart={() => setHoveredCard('estateAdministrator')}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <Card 
                  className={`shadow-2xl transition-all duration-500 cursor-pointer group relative overflow-hidden border-0 ${
                    expandedCard === 'estateAdministrator' ? 'md:col-span-2' : ''
                  }`}
                  onClick={() => handleCardExpand('estateAdministrator')}
                  style={{
                    background: hoveredCard === 'estateAdministrator' 
                      ? 'linear-gradient(135deg, rgba(64, 64, 64, 0.1), rgba(101, 67, 33, 0.1))'
                      : 'rgba(255, 255, 255, 0.95)'
                  }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                      variants={shimmerVariants}
                      initial="initial"
                      animate={hoveredCard === 'estateAdministrator' ? "animate" : "initial"}
                    />
                  </div>

                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${userTypeImages.estateAdministrator})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-pink-800/60 to-indigo-900/70 transition-opacity duration-500 group-hover:opacity-80" />
                  
                  {/* Floating particles */}
                  <AnimatePresence>
                    {hoveredCard === 'estateAdministrator' && (
                      <>
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-purple-300 rounded-full opacity-60"
                            initial={{ 
                              x: Math.random() * 400,
                              y: Math.random() * 300,
                              opacity: 0 
                            }}
                            animate={{ 
                              y: -50,
                              opacity: [0, 1, 0],
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ 
                              duration: 2,
                              delay: i * 0.2,
                              repeat: Infinity
                            }}
                          />
                        ))}
                      </>
                    )}
                  </AnimatePresence>

                  <div className="relative z-10">
                    <CardHeader className="text-center">
                      <motion.div 
                        className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-white/20 backdrop-blur-sm border-4 border-white/30 shadow-2xl"
                        variants={iconVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Building className="h-12 w-12 text-white drop-shadow-lg" />
                      </motion.div>
                      <CardTitle className="text-2xl text-white flex items-center justify-center gap-2 font-bold">
                        {t('estateAdministrator')}
                        <motion.div
                          animate={{ rotate: expandedCard === 'estateAdministrator' ? 90 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </motion.div>
                      </CardTitle>
                      <CardDescription className="text-gray-100 text-lg">
                        {t('estateAdministratorDesc')}
                      </CardDescription>
                    </CardHeader>
                    
                    <AnimatePresence>
                      {expandedCard === 'estateAdministrator' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                          <CardContent className="pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <motion.div 
                                className="space-y-4"
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                  <Shield className="h-5 w-5" />
                                  {t('management')}
                                </h3>
                                <ul className="space-y-3 text-gray-200">
                                  {[
                                    t('manageMultipleProperties'),
                                    t('financialReporting'),
                                    t('maintenanceCoordination'),
                                    t('legalCompliance')
                                  ].map((management, index) => (
                                    <motion.li 
                                      key={index}
                                      className="flex items-center gap-3 p-2 rounded-lg bg-white/10 backdrop-blur-sm"
                                      initial={{ x: -20, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ delay: 0.3 + index * 0.1 }}
                                    >
                                      <Star className="h-4 w-4 text-yellow-400" />
                                      {management}
                                    </motion.li>
                                  ))}
                                </ul>
                              </motion.div>
                              <motion.div 
                                className="space-y-4"
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                              >
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                  <TrendingUp className="h-5 w-5" />
                                  {t('portfolio')}
                                </h3>
                                <div className="space-y-3">
                                  <motion.div 
                                    className="flex items-center gap-3 p-4 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20"
                                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.25)" }}
                                  >
                                    <Building className="h-5 w-5 text-purple-300" />
                                    <div>
                                      <p className="text-sm font-medium text-white">{t('managedProperties')}</p>
                                      <p className="text-xs text-gray-300">24 {t('buildings')}</p>
                                    </div>
                                  </motion.div>
                                  <motion.div 
                                    className="flex items-center gap-3 p-4 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20"
                                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.25)" }}
                                  >
                                    <Users className="h-5 w-5 text-pink-300" />
                                    <div>
                                      <p className="text-sm font-medium text-white">{t('totalUnits')}</p>
                                      <p className="text-xs text-gray-300">1,247 {t('units')}</p>
                                    </div>
                                  </motion.div>
                                </div>
                              </motion.div>
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <CardFooter>
                      <motion.div className="w-full">
                        <motion.button 
                          className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm font-semibold py-3 text-lg shadow-xl rounded-md transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUserTypeSelect('estateAdministrator');
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.span
                            className="flex items-center justify-center gap-2"
                            whileHover={{ x: 5 }}
                          >
                            {t('accessDashboard')}
                            <Zap className="h-4 w-4" />
                          </motion.span>
                        </motion.button>
                      </motion.div>
                    </CardFooter>
                  </div>
                </Card>
              </motion.div>

              {/* Particular Card */}
              <motion.div
                custom={3}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                whileHover="hover"
                onHoverStart={() => setHoveredCard('particular')}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <Card 
                  className={`shadow-2xl transition-all duration-500 cursor-pointer group relative overflow-hidden border-0 ${
                    expandedCard === 'particular' ? 'md:col-span-2' : ''
                  }`}
                  onClick={() => handleCardExpand('particular')}
                  style={{
                    background: hoveredCard === 'particular' 
                      ? 'linear-gradient(135deg, rgba(64, 64, 64, 0.1), rgba(101, 67, 33, 0.1))'
                      : 'rgba(255, 255, 255, 0.95)'
                  }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                      variants={shimmerVariants}
                      initial="initial"
                      animate={hoveredCard === 'particular' ? "animate" : "initial"}
                    />
                  </div>

                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${userTypeImages.particular})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-900/70 via-gray-800/60 to-gray-900/70 transition-opacity duration-500 group-hover:opacity-80" />
                  
                  {/* Floating particles */}
                  <AnimatePresence>
                    {hoveredCard === 'particular' && (
                      <>
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-orange-300 rounded-full opacity-60"
                            initial={{ 
                              x: Math.random() * 400,
                              y: Math.random() * 300,
                              opacity: 0 
                            }}
                            animate={{ 
                              y: -50,
                              opacity: [0, 1, 0],
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ 
                              duration: 2,
                              delay: i * 0.2,
                              repeat: Infinity
                            }}
                          />
                        ))}
                      </>
                    )}
                  </AnimatePresence>

                  <div className="relative z-10">
                    <CardHeader className="text-center">
                      <motion.div 
                        className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-white/20 backdrop-blur-sm border-4 border-white/30 shadow-2xl"
                        variants={iconVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <User className="h-12 w-12 text-white drop-shadow-lg" />
                      </motion.div>
                      <CardTitle className="text-2xl text-white flex items-center justify-center gap-2 font-bold">
                        {t('particular')}
                        <motion.div
                          animate={{ rotate: expandedCard === 'particular' ? 90 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </motion.div>
                      </CardTitle>
                      <CardDescription className="text-gray-100 text-lg">
                        {t('particularDesc')}
                      </CardDescription>
                    </CardHeader>
                    
                    <AnimatePresence>
                      {expandedCard === 'particular' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                          <CardContent className="pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <motion.div 
                                className="space-y-4"
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                  <Shield className="h-5 w-5" />
                                  {t('services')}
                                </h3>
                                <ul className="space-y-3 text-gray-200">
                                  {[
                                    t('requestQuotes'),
                                    t('findServiceProviders'),
                                    t('manageProperties'),
                                    t('trackProjects')
                                  ].map((service, index) => (
                                    <motion.li 
                                      key={index}
                                      className="flex items-center gap-3 p-2 rounded-lg bg-white/10 backdrop-blur-sm"
                                      initial={{ x: -20, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ delay: 0.3 + index * 0.1 }}
                                    >
                                      <Star className="h-4 w-4 text-yellow-400" />
                                      {service}
                                    </motion.li>
                                  ))}
                                </ul>
                              </motion.div>
                              <motion.div 
                                className="space-y-4"
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                              >
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                  <TrendingUp className="h-5 w-5" />
                                  {t('quickAccess')}
                                </h3>
                                <div className="space-y-3">
                                  <motion.div 
                                    className="flex items-center gap-3 p-4 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20"
                                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.25)" }}
                                  >
                                    <MapPin className="h-5 w-5 text-orange-300" />
                                    <div>
                                      <p className="text-sm font-medium text-white">{t('nearbyProviders')}</p>
                                      <p className="text-xs text-gray-300">15 {t('available')}</p>
                                    </div>
                                  </motion.div>
                                  <motion.div 
                                    className="flex items-center gap-3 p-4 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20"
                                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.25)" }}
                                  >
                                    <Clock className="h-5 w-5 text-red-300" />
                                    <div>
                                      <p className="text-sm font-medium text-white">{t('activeRequests')}</p>
                                      <p className="text-xs text-gray-300">3 {t('pending')}</p>
                                    </div>
                                  </motion.div>
                                </div>
                              </motion.div>
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <CardFooter>
                      <motion.div className="w-full">
                        <motion.button 
                          className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm font-semibold py-3 text-lg shadow-xl rounded-md transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUserTypeSelect('particular');
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.span
                            className="flex items-center justify-center gap-2"
                            whileHover={{ x: 5 }}
                          >
                            {t('accessDashboard')}
                            <Zap className="h-4 w-4" />
                          </motion.span>
                        </motion.button>
                      </motion.div>
                    </CardFooter>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </ZoomableSection>
      </main>
    </>
  );
}

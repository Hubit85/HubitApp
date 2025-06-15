import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft, ChevronRight, Users, Building, Wrench, Star, TrendingUp, HelpCircle } from "lucide-react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const { t } = useLanguage();

  // Luxury home images with translations
  const luxuryHomes = [
    {
      url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1453&q=80",
      title: "Residencial Elite Panorama",
      location: "Comunidad de Lujo Madrid"
    },
    {
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      title: "Complejo Residencial Altavista",
      location: "Urbanización Exclusiva Barcelona"
    },
    {
      url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1475&q=80",
      title: "Residencial Golden Park",
      location: "Comunidad Premium Valencia"
    },
    {
      url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      title: "Residencial Mirador del Mar",
      location: "Comunidad de Lujo Marbella"
    },
    {
      url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      title: "Complejo Torres Platinum",
      location: "Apartamentos Exclusivos Bilbao"
    },
    {
      url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1484&q=80",
      title: "Residencial Costa Esmeralda",
      location: "Comunidad Premium Málaga"
    },
    {
      url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      title: "Residencial Jardines del Prado",
      location: "Urbanización de Lujo Sevilla"
    },
    {
      url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      title: "Residencial Montecarlo",
      location: "Comunidad Exclusiva San Sebastián"
    },
    {
      url: "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      title: "Complejo Elite Skyline",
      location: "Apartamentos de Lujo Zaragoza"
    },
    {
      url: "https://images.unsplash.com/photo-1600047508788-26df7b3d6b93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      title: "Residencial Bahía Exclusiva",
      location: "Comunidad Premium Alicante"
    }
  ];

  // Auto-advance carousel every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % luxuryHomes.length);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [luxuryHomes.length]);

  // Enhanced horizontal animation for the sidebar with wider movement
  useEffect(() => {
    const interval = setInterval(() => {
      if (!sidebarOpen) {
        const sidebar = document.getElementById('granite-sidebar');
        const questionIcon = document.getElementById('question-icon');
        if (sidebar && questionIcon) {
          // Wider movement animation
          sidebar.style.transform = 'translateX(15px)';
          questionIcon.style.opacity = '1';
          questionIcon.style.transform = 'translateX(20px) scale(1.1)';
          
          setTimeout(() => {
            sidebar.style.transform = 'translateX(0px)';
            questionIcon.style.transform = 'translateX(0px) scale(1)';
          }, 600);
          
          setTimeout(() => {
            sidebar.style.transform = 'translateX(-8px)';
            questionIcon.style.transform = 'translateX(-5px) scale(0.95)';
          }, 1200);
          
          setTimeout(() => {
            sidebar.style.transform = 'translateX(0px)';
            questionIcon.style.transform = 'translateX(0px) scale(1)';
            questionIcon.style.opacity = '0.7';
          }, 1800);
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [sidebarOpen]);

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % luxuryHomes.length);
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + luxuryHomes.length) % luxuryHomes.length);
  };

  return (
    <>
      <Head>
        <title>{t('handyman')} | {t('luxuryResidences')}</title>
        <meta name='description' content={t('luxuryResidencesDesc')} />
      </Head>
      
      <Header />
      
      {/* Enhanced Thin Granite Sidebar with Question Icon */}
      <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] z-50">
        <motion.div
          id="granite-sidebar"
          className="relative w-3 h-full bg-stone-500 shadow-lg cursor-pointer"
          style={{ 
            background: 'linear-gradient(180deg, #78716c 0%, #57534e 50%, #44403c 100%)',
            transition: 'transform 0.6s ease-in-out'
          }}
          onMouseEnter={() => setSidebarOpen(true)}
          whileHover={{ width: '12px', boxShadow: '0 0 20px rgba(0,0,0,0.3)' }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Floating Question Icon */}
        <motion.div
          id="question-icon"
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg opacity-70"
          style={{ 
            transition: 'all 0.6s ease-in-out'
          }}
          whileHover={{ scale: 1.2 }}
        >
          <HelpCircle className="h-4 w-4 text-stone-600" />
        </motion.div>
        
        {/* Interactive Text */}
        <motion.div
          className="absolute top-1/2 left-12 transform -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg opacity-0 pointer-events-none"
          animate={{ 
            opacity: sidebarOpen ? 0 : 0.8,
            x: sidebarOpen ? -20 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm font-medium text-stone-700 whitespace-nowrap">
            {t('whatsYourRole')}
          </p>
        </motion.div>
      </div>

      {/* Enhanced Expanded Sidebar on Hover */}
      <motion.div
        className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-2xl z-40 overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: sidebarOpen ? '380px' : 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <HelpCircle className="h-6 w-6 text-stone-600" />
              <h3 className="text-xl font-bold text-gray-800">
                {t('whatsYourRole')}
              </h3>
            </div>
            <p className="text-sm text-gray-500 border-b border-gray-200 pb-3">
              {t('clickToExplore')}
            </p>
          </div>
          
          <div className="space-y-4 flex-1">
            {/* Community Member */}
            <motion.div
              className="group cursor-pointer p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              onClick={() => router.push("/community-member")}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 group-hover:text-blue-700">
                    {t('communityMember')}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {t('accessForResidents')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Service Provider */}
            <motion.div
              className="group cursor-pointer p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200"
              onClick={() => router.push("/service-provider/dashboard")}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Wrench className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 group-hover:text-green-700">
                    {t('serviceProvider')}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {t('portalForCompanies')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Estate Administrator */}
            <motion.div
              className="group cursor-pointer p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
              onClick={() => router.push("/administrador-fincas")}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Building className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 group-hover:text-purple-700">
                    {t('estateAdministrator')}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {t('propertyManagement')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Private Individual */}
            <motion.div
              className="group cursor-pointer p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
              onClick={() => router.push("/particular")}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <Star className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 group-hover:text-orange-700">
                    {t('particular')}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {t('individualServices')}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400 text-center">
              {t('selectYourProfile')}
            </p>
          </div>
        </div>
      </motion.div>
      
      <main className='min-h-screen bg-gray-100 pt-16'>
        <div className='container mx-auto px-4 py-8'>
          {/* Luxury Homes Carousel */}
          <div className='relative w-full h-[600px] rounded-xl overflow-hidden shadow-xl mb-12'>
            {/* Image */}
            <div 
              className='absolute inset-0 bg-cover bg-center transition-opacity duration-1000'
              style={{ 
                backgroundImage: `url(${luxuryHomes[currentImageIndex].url})`,
                opacity: 1
              }}
            />
            
            {/* Gradient Overlay */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30'></div>
            
            {/* Navigation Arrows */}
            <button 
              className='absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors'
              onClick={goToPrevImage}
            >
              <ChevronLeft size={24} />
            </button>
            
            <button 
              className='absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors'
              onClick={goToNextImage}
            >
              <ChevronRight size={24} />
            </button>
            
            {/* Caption */}
            <div className='absolute bottom-0 left-0 right-0 p-8 text-white'>
              <h2 className='text-3xl font-bold mb-2'>{luxuryHomes[currentImageIndex].title}</h2>
              <p className='text-xl'>{luxuryHomes[currentImageIndex].location}</p>
              
              {/* Indicators */}
              <div className='flex mt-4 space-x-2'>
                {luxuryHomes.map((_, index) => (
                  <button 
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <div className='min-h-screen flex flex-col relative overflow-hidden bg-background pt-16'>
        {/* Background Image - Luxury Apartment with overlay */}
        <div 
          className='absolute inset-0 z-0 bg-cover bg-center bg-no-repeat'
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')",
            backgroundSize: 'cover',
            filter: 'brightness(0.9)',
            opacity: 0.1
          }}
        />
        
        <main className='flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8 z-10'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 max-w-6xl mx-auto'>
            {/* Who We Are Card - Always expanded */}
            <Card className='w-full shadow-lg bg-card rounded-lg overflow-hidden'>
              <CardHeader className='bg-white dark:bg-[hsl(0,0%,20%)] border-b'>
                <CardTitle className='text-2xl font-bold text-foreground'>{t('whoWeAre')}</CardTitle>
              </CardHeader>
              <CardContent className='text-foreground space-y-4 p-6'>
                <p className='text-lg leading-relaxed'>
                  {t('whoWeAreIntro')}
                </p>
                
                <div className='space-y-4'>
                  <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700'>
                    <h3 className='font-bold text-xl mb-2'>{t('ourMission')}</h3>
                    <p className='text-lg leading-relaxed'>
                      {t('ourMissionText')}
                    </p>
                  </div>
                  
                  <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700'>
                    <h3 className='font-bold text-xl mb-2'>{t('ourEcosystem')}</h3>
                    <p className='text-lg leading-relaxed'>
                      {t('ourEcosystemText')}
                    </p>
                  </div>
                  
                  <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700'>
                    <h3 className='font-bold text-xl mb-2'>{t('ourFundamentalValue')}</h3>
                    <p className='text-lg leading-relaxed'>
                      {t('ourFundamentalValueText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* How It Works Card - Always expanded */}
            <Card className='w-full shadow-lg bg-card rounded-lg overflow-hidden'>
              <CardHeader className='bg-white dark:bg-[hsl(0,0%,20%)] border-b'>
                <CardTitle className='text-2xl font-bold text-foreground'>{t('howItWorksTitle')}</CardTitle>
              </CardHeader>
              <CardContent className='text-foreground space-y-4 p-6'>
                <p className='text-lg leading-relaxed'>
                  {t('howItWorksIntro')}
                </p>
                
                <div className='space-y-4'>
                  <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700'>
                    <h3 className='font-bold text-xl mb-2'>{t('forAdministrators')}</h3>
                    <p className='text-lg leading-relaxed'>
                      {t('forAdministratorsText')}
                    </p>
                  </div>
                  
                  <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700'>
                    <h3 className='font-bold text-xl mb-2'>{t('forServiceCompanies')}</h3>
                    <p className='text-lg leading-relaxed'>
                      {t('forServiceCompaniesText')}
                    </p>
                  </div>
                  
                  <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700'>
                    <h3 className='font-bold text-xl mb-2'>{t('forNeighbors')}</h3>
                    <p className='text-lg leading-relaxed'>
                      {t('forNeighborsText')}
                    </p>
                  </div>
                  
                  <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700'>
                    <h3 className='font-bold text-xl mb-2'>{t('ratingsSystem')}</h3>
                    <p className='text-lg leading-relaxed'>
                      {t('ratingsSystemText')}
                    </p>
                  </div>
                </div>
                
                <div className='bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700'>
                  <p className='text-lg leading-relaxed font-medium'>
                    {t('virtuousCircle')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        {/* Sidebar hover trigger area */}
        <div 
          className="fixed left-0 top-0 h-full w-8 z-40"
          onMouseEnter={() => setSidebarOpen(true)}
        ></div>
        
        {/* Sliding sidebar overlay */}
        <motion.div 
          className="fixed inset-0 bg-black/50 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: sidebarOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ pointerEvents: sidebarOpen ? "auto" : "none" }}
        >
          <div 
            className="absolute inset-0"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </motion.div>
        
        <motion.div 
          className="fixed top-0 left-0 h-full w-full z-50 flex flex-col md:flex-row"
          initial={{ x: "-100%" }}
          animate={{ x: sidebarOpen ? 0 : "-100%" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onMouseLeave={() => setSidebarOpen(false)}
        >
          {/* Community Member Box */}
          <div 
            className="flex-1 bg-cover bg-center relative cursor-pointer"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')"
            }}
            onClick={() => router.push("/community-member")}
          >
            <div className="absolute inset-0 bg-[hsl(0,0%,0%)]/70 hover:bg-[hsl(0,0%,0%)]/60 transition-colors flex items-center justify-center">
              <h2 className="text-4xl font-serif text-white font-bold text-center px-6">{t("communityMember")}</h2>
            </div>
          </div>
          
          {/* Service Provider Box */}
          <div 
            className="flex-1 bg-cover bg-center relative cursor-pointer"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')"
            }}
            onClick={() => router.push("/service-provider/dashboard")}
          >
            <div className="absolute inset-0 bg-green-900/70 hover:bg-green-900/60 transition-colors flex items-center justify-center">
              <h2 className="text-4xl font-serif text-white font-bold text-center px-6">{t("serviceProvider")}</h2>
            </div>
          </div>
          
          {/* Estate Administrator Box */}
          <div 
            className='flex-1 bg-cover bg-center relative cursor-pointer'
            style={{ 
              backgroundImage: 'url(\'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80\')'
            }}
            onClick={() => router.push('/administrador-fincas')}
          >
            <div className='absolute inset-0 bg-purple-900/70 hover:bg-purple-900/60 transition-colors flex items-center justify-center'>
              <h2 className='text-4xl font-serif text-white font-bold text-center px-6'>{t('estateAdministrator')}</h2>
            </div>
          </div>
          
          {/* Private Individual Box */}
          <div 
            className='flex-1 bg-cover bg-center relative cursor-pointer'
            style={{ 
              backgroundImage: 'url(\'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80\')'
            }}
            onClick={() => router.push('/particular')}
          >
            <div className='absolute inset-0 bg-amber-900/70 hover:bg-amber-900/60 transition-colors flex items-center justify-center'>
              <h2 className='text-4xl font-serif text-white font-bold text-center px-6'>{t('particular')}</h2>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}


import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Luxury home images
const luxuryHomes = [
  {
    url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
    title: "Modern Beachfront Villa",
    location: "Malibu, California"
  },
  {
    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1475&q=80",
    title: "Contemporary Suburban Estate",
    location: "Hamptons, New York"
  },
  {
    url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1453&q=80",
    title: "Elegant Country Mansion",
    location: "Tuscany, Italy"
  },
  {
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    title: "Luxury Lakeside Retreat",
    location: "Lake Como, Italy"
  },
  {
    url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    title: "Modern Architectural Marvel",
    location: "Beverly Hills, California"
  },
  {
    url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1484&q=80",
    title: "Mediterranean Coastal Villa",
    location: "Santorini, Greece"
  },
  {
    url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    title: "Exclusive Hillside Estate",
    location: "Aspen, Colorado"
  },
  {
    url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    title: "Sophisticated Urban Penthouse",
    location: "Manhattan, New York"
  },
  {
    url: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    title: "Luxury Mountain Chalet",
    location: "Swiss Alps, Switzerland"
  },
  {
    url: "https://images.unsplash.com/photo-1600047508788-26df7b3d6b93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    title: "Waterfront Modern Masterpiece",
    location: "Miami Beach, Florida"
  }
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const { t } = useLanguage();

  // Auto-advance carousel every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % luxuryHomes.length);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % luxuryHomes.length);
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + luxuryHomes.length) % luxuryHomes.length);
  };

  return (
    <>
      <Head>
        <title>{t('dashboard')} | {t('handyman')}</title>
        <meta name='description' content={t('dashboardDesc')} />
      </Head>
      
      <Header />
      
      <main className='min-h-screen bg-gray-100 pt-16'>
        <div className='container mx-auto px-4 py-8'>
          <h1 className='text-3xl font-bold mb-8'>{t('dashboard')}</h1>
          
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
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto'>
            {/* Who We Are Card - Expandable on hover */}
            <motion.div
              onMouseEnter={() => setExpandedCard('whoWeAre')}
              onMouseLeave={() => setExpandedCard(null)}
              layout
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className='relative'
            >
              <Card className='w-full shadow-lg bg-card rounded-lg overflow-hidden'>
                <CardHeader className='bg-white dark:bg-[hsl(0,0%,20%)] border-b'>
                  <CardTitle className='text-2xl font-bold text-foreground'>{t('whoWeAre')}</CardTitle>
                </CardHeader>
                <motion.div
                  initial={{ height: '150px' }}
                  animate={{ 
                    height: expandedCard === 'whoWeAre' ? 'auto' : '150px',
                    overflow: expandedCard === 'whoWeAre' ? 'visible' : 'hidden'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className='text-foreground space-y-4 p-6'>
                    <p>
                      {t('whoWeAreDesc1')}
                    </p>
                    <p>
                      {t('whoWeAreDesc2')}
                    </p>
                  </CardContent>
                </motion.div>
                {expandedCard !== 'whoWeAre' && (
                  <div className='absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card/80 to-transparent pointer-events-none' />
                )}
              </Card>
            </motion.div>
            
            {/* How It Works Card - Expandable on hover */}
            <motion.div
              onMouseEnter={() => setExpandedCard('howItWorks')}
              onMouseLeave={() => setExpandedCard(null)}
              layout
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className='relative'
            >
              <Card className='w-full shadow-lg bg-card rounded-lg overflow-hidden'>
                <CardHeader className='bg-white dark:bg-[hsl(0,0%,20%)] border-b'>
                  <CardTitle className='text-2xl font-bold text-foreground'>{t('howItWorks')}</CardTitle>
                </CardHeader>
                <motion.div
                  initial={{ height: '150px' }}
                  animate={{ 
                    height: expandedCard === 'howItWorks' ? 'auto' : '150px',
                    overflow: expandedCard === 'howItWorks' ? 'visible' : 'hidden'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className='text-foreground space-y-4 p-6'>
                    <p>
                      {t('howItWorksDesc')}
                    </p>
                    <ol className='list-decimal pl-5 space-y-2'>
                      <li>{t('step1')}</li>
                      <li>{t('step2')}</li>
                      <li>{t('step3')}</li>
                      <li>{t('step4')}</li>
                      <li>{t('step5')}</li>
                    </ol>
                  </CardContent>
                </motion.div>
                {expandedCard !== 'howItWorks' && (
                  <div className='absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card/80 to-transparent pointer-events-none' />
                )}
              </Card>
            </motion.div>
            
            {/* Our Greatest Achievements Card - Expandable on hover */}
            <motion.div
              onMouseEnter={() => setExpandedCard('achievements')}
              onMouseLeave={() => setExpandedCard(null)}
              layout
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className='relative'
            >
              <Card className='w-full shadow-lg bg-card rounded-lg overflow-hidden'>
                <CardHeader className='bg-white dark:bg-[hsl(0,0%,20%)] border-b'>
                  <CardTitle className='text-2xl font-bold text-foreground'>{t('achievements')}</CardTitle>
                </CardHeader>
                <motion.div
                  initial={{ height: '150px' }}
                  animate={{ 
                    height: expandedCard === 'achievements' ? 'auto' : '150px',
                    overflow: expandedCard === 'achievements' ? 'visible' : 'hidden'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className='text-foreground space-y-4 p-6'>
                    <p>
                      {t('achievementsDesc')}
                    </p>
                    <ul className='list-disc pl-5 space-y-2'>
                      <li>{t('achievement1')}</li>
                      <li>{t('achievement2')}</li>
                      <li>{t('achievement3')}</li>
                      <li>{t('achievement4')}</li>
                      <li>{t('achievement5')}</li>
                    </ul>
                  </CardContent>
                </motion.div>
                {expandedCard !== 'achievements' && (
                  <div className='absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card/80 to-transparent pointer-events-none' />
                )}
              </Card>
            </motion.div>
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
          
          {/* Estate Administrator Box - Updated */}
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
          
          {/* What Do You Need Box - Updated with woman on phone */}
          <div 
            className='flex-1 bg-cover bg-center relative'
            style={{ 
              backgroundImage: 'url(\'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80\')'
            }}
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

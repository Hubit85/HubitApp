import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Sparkles, ArrowRight, Users, Building2, Star } from 'lucide-react';

// Luxury home images - Pisos de lujo comunitarios
const luxuryHomes = [
  {
    url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1453&q=80",
    title: "Residencial Élite Panorama",
    location: "Comunidad de lujo en Madrid"
  },
  {
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    title: "Complejo Residencial Altavista",
    location: "Urbanización exclusiva en Barcelona"
  },
  {
    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1475&q=80",
    title: "Residencial Parque Dorado",
    location: "Comunidad premium en Valencia"
  },
  {
    url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    title: "Residencial Mirador del Mar",
    location: "Comunidad de lujo en Marbella"
  },
  {
    url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    title: "Complejo Platinum Towers",
    location: "Pisos exclusivos en Bilbao"
  },
  {
    url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1484&q=80",
    title: "Residencial Costa Esmeralda",
    location: "Comunidad premium en Málaga"
  },
  {
    url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    title: "Residencial Jardines del Prado",
    location: "Urbanización de lujo en Sevilla"
  },
  {
    url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    title: "Residencial Montecarlo",
    location: "Comunidad exclusiva en San Sebastián"
  },
  {
    url: "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    title: "Complejo Élite Skyline",
    location: "Pisos de lujo en Zaragoza"
  },
  {
    url: "https://images.unsplash.com/photo-1600047508788-26df7b3d6b93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    title: "Residencial Bahía Exclusiva",
    location: "Comunidad premium en Alicante"
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
        <title>{t('handyman')} | {t('luxuryResidences')}</title>
        <meta name='description' content={t('luxuryResidencesDesc')} />
      </Head>
      
      <Header />
      
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
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 max-w-7xl mx-auto'>
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
                    <p className='text-lg leading-relaxed'>
                      Somos una plataforma integral que conecta a administradores de fincas, empresas de servicios y vecinos para brindar transparencia en las necesidades de las comunidades de vecinos.
                    </p>
                    <p className='text-lg leading-relaxed'>
                      Nuestra misión es facilitar la comunicación, valoración y gestión de servicios, ayudando a las empresas a expandir su negocio mientras ofrecemos total transparencia a las comunidades.
                    </p>
                    <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700'>
                      <p className='text-lg leading-relaxed'>
                        Creamos un ecosistema donde todos los participantes se benefician: los administradores pueden gestionar eficientemente las necesidades de sus comunidades, las empresas de servicios pueden mostrar su profesionalidad y obtener nuevos clientes, y los vecinos pueden valorar los servicios recibidos y tener voz en las decisiones comunitarias.
                      </p>
                    </div>
                    <p className='text-lg leading-relaxed'>
                      La transparencia es nuestro valor fundamental, permitiendo que todas las partes involucradas tengan acceso a la información relevante, facilitando la toma de decisiones y mejorando la calidad de vida en las comunidades de vecinos.
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
                    <p className='text-lg leading-relaxed'>
                      Nuestra plataforma funciona como un ecosistema integrado que conecta a los tres pilares fundamentales de las comunidades de vecinos:
                    </p>
                    
                    <div className='space-y-4'>
                      <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700'>
                        <h3 className='font-bold text-xl mb-2'>Para Administradores</h3>
                        <p>Ofrecemos herramientas digitales que simplifican la gestión diaria, permitiendo identificar necesidades, solicitar presupuestos y coordinar servicios desde un único panel de control intuitivo.</p>
                      </div>
                      
                      <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700'>
                        <h3 className='font-bold text-xl mb-2'>Para Empresas de Servicios</h3>
                        <p>Proporcionamos un escaparate digital donde mostrar su profesionalidad, recibir solicitudes de presupuestos y obtener valoraciones verificadas que impulsan su reputación.</p>
                      </div>
                      
                      <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700'>
                        <h3 className='font-bold text-xl mb-2'>Para Vecinos</h3>
                        <p>Facilitamos una plataforma donde pueden reportar incidencias, seguir su resolución en tiempo real y valorar los servicios recibidos con total transparencia.</p>
                      </div>
                      
                      <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700'>
                        <h3 className='font-bold text-xl mb-2'>Sistema de Valoraciones</h3>
                        <p>Implementamos un sistema de evaluación que permite a los vecinos calificar los servicios, generando confianza y ayudando a tomar decisiones informadas.</p>
                      </div>
                    </div>
                    
                    <p className='text-lg leading-relaxed'>
                      Esta integración crea un círculo virtuoso donde todos los participantes se benefician: mejores servicios para las comunidades, más oportunidades de negocio para los proveedores y una gestión más eficiente para los administradores.
                    </p>
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
                    <p className='text-lg leading-relaxed'>
                      Desde el lanzamiento de nuestra plataforma, hemos logrado importantes avances que demuestran el impacto positivo de nuestro enfoque en la gestión de comunidades:
                    </p>
                    
                    <div className='space-y-4'>
                      <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700 flex items-center gap-4'>
                        <div className='text-3xl font-bold text-primary'>500+</div>
                        <div>
                          <h3 className='font-bold text-lg'>Comunidades conectadas</h3>
                          <p>Nuestra plataforma ya está siendo utilizada por cientos de comunidades de vecinos en todo el país.</p>
                        </div>
                      </div>
                      
                      <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700 flex items-center gap-4'>
                        <div className='text-3xl font-bold text-primary'>300+</div>
                        <div>
                          <h3 className='font-bold text-lg'>Empresas verificadas</h3>
                          <p>Contamos con una amplia red de proveedores de servicios de calidad que han pasado por nuestro proceso de verificación.</p>
                        </div>
                      </div>
                      
                      <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700 flex items-center gap-4'>
                        <div className='text-3xl font-bold text-primary'>95%</div>
                        <div>
                          <h3 className='font-bold text-lg'>Índice de satisfacción</h3>
                          <p>Las valoraciones de los usuarios muestran un alto nivel de satisfacción con la plataforma y los servicios.</p>
                        </div>
                      </div>
                      
                      <div className='bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700 flex items-center gap-4'>
                        <div className='text-3xl font-bold text-primary'>10,000+</div>
                        <div>
                          <h3 className='font-bold text-lg'>Incidencias resueltas</h3>
                          <p>Hemos facilitado la resolución eficiente de miles de incidencias en comunidades, mejorando la calidad de vida.</p>
                        </div>
                      </div>
                    </div>
                    
                    <p className='text-lg leading-relaxed'>
                      Estos logros reflejan nuestro compromiso con la creación de un ecosistema transparente y eficiente que beneficia a todos los participantes: administradores, empresas de servicios y vecinos.
                    </p>
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
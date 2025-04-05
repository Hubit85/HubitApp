import React, { useState } from "react";
import Head from "next/head";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <>
      <Head>
        <title>{t("dashboard")} - {t("handyman")}</title>
        <meta name="description" content={t("professionalServices")} />
      </Head>
      
      <div className='min-h-screen flex flex-col relative overflow-hidden bg-background'>
        {/* Background Image - Luxury Apartment with overlay */}
        <div 
          className='absolute inset-0 z-0 bg-cover bg-center bg-no-repeat'
          style={{
            backgroundImage: 'url(\\'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80\\')',
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
            className="flex-1 bg-cover bg-center relative"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')"
            }}
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
            onClick={() => router.push("/service-provider")}
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
import React from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/layout/Header";

export default function Home() {
  const { t } = useLanguage();
  
  return (
    <>
      <Head>
        <title>{t("handyman")} - {t("professionalServices")}</title>
        <meta name="description" content={t("professionalServices")} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />
      
      <main className='flex flex-col items-center justify-center relative'>
        {/* Hero Section with Background Image */}
        <section className='min-h-screen w-full flex flex-col items-center justify-center relative'>
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
              backgroundSize: "cover",
              filter: "brightness(0.7)"
            }}
          />
          
          {/* Hero Content */}
          <div className='z-10 text-center space-y-8 px-4 sm:px-6 max-w-4xl'>
            <h1 className='text-6xl md:text-7xl font-bold text-white drop-shadow-lg'>
              {t('handyman')}
            </h1>
            <p className='text-xl md:text-2xl text-white drop-shadow-md'>
              {t('professionalServices')}
            </p>
            
            <div className='flex flex-col sm:flex-row gap-4 justify-center mt-8'>
              <Link href='/auth/register' passHref>
                <Button 
                  size='lg' 
                  className='text-lg px-8 py-6 bg-black text-white hover:bg-black/80'
                >
                  {t('register')}
                </Button>
              </Link>
              <Link href='/auth/login' passHref>
                <Button 
                  size='lg' 
                  variant='outline' 
                  className='text-lg px-8 py-6 bg-white text-black border-black hover:bg-white/90'
                >
                  {t('login')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Who We Are Section */}
        <section className='w-full py-20 bg-white'>
          <div className='container mx-auto px-4 sm:px-6 max-w-6xl'>
            <div className='text-center mb-12'>
              <h2 className='text-4xl font-bold text-gray-900 mb-4'>{t('whoWeAre')}</h2>
              <div className='w-20 h-1 bg-black mx-auto'></div>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
              <div className='space-y-6'>
                <p className='text-lg text-gray-700 leading-relaxed'>
                  {t('whoWeAreDesc1')}
                </p>
                <p className='text-lg text-gray-700 leading-relaxed'>
                  {t('whoWeAreDesc2')}
                </p>
                
                <div className='pt-4 flex flex-wrap gap-4'>
                  <div className='bg-gray-100 p-4 rounded-lg flex items-center gap-3 flex-1 min-w-[200px]'>
                    <div className='bg-black text-white p-2 rounded-full'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
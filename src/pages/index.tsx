import React from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  
  return (
    <>
      <Head>
        <title>{t("handyman")} - {t("professionalServices")}</title>
        <meta name="description" content={t("professionalServices")} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="min-h-screen flex flex-col items-center justify-center relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
            backgroundSize: "cover",
            filter: "brightness(0.7)"
          }}
        />
        
        {/* Content */}
        <div className="z-10 text-center space-y-8 px-4 sm:px-6 max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-bold text-white drop-shadow-lg">
            {t("handyman")}
          </h1>
          <p className="text-xl md:text-2xl text-white drop-shadow-md">
            {t("professionalServices")}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/auth/register" passHref>
              <Button size="lg" className="text-lg px-8 py-6">
                {t("register")}
              </Button>
            </Link>
            <Link href="/auth/login" passHref>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20"
              >
                {t("login")}
              </Button>
            </Link>
            <Link href="/administrador-fincas" passHref>
              <Button 
                size="lg"
                className="text-lg px-8 py-6"
              >
                Administrador de Fincas
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
import React from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <Head>
        <title>{t("homeTitle")}</title>
        <meta name="description" content={t("homeDescription")} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />
      
      <main className="flex flex-col items-center justify-center relative">
        <section className="min-h-screen w-full flex flex-col items-center justify-center relative">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
              backgroundSize: "cover",
              filter: "brightness(0.7)"
            }}
          />
          
          <div className="z-10 text-center space-y-8 px-4 sm:px-6 max-w-4xl">
            <h1 className="text-6xl md:text-7xl font-bold text-white drop-shadow-lg">
              {t("handyman")}
            </h1>
            <p className="text-xl md:text-2xl text-white drop-shadow-md">
              {t("professionalServicesForHome")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-black text-white hover:bg-black/80"
                asChild
              >
                <Link href="/auth/register">{t("register")}</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 bg-white text-black border-black hover:bg-white/90"
                asChild
              >
                <Link href="/auth/login">{t("login")}</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

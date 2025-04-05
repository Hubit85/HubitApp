
import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, ArrowRight, Zap, Paintbrush, Grid, Droplet, Thermometer } from "lucide-react";
import Link from 'next/link';
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/layout/Header";

export default function ServiceProviderHome() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <>
      <Head>
        <title>{t("serviceProviderPortal")} | {t("handyman")}</title>
        <meta name="description" content={t("serviceProviderDesc")} />
      </Head>
      
      <Header />
      
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">{t("serviceProviderPortal")}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("serviceProviderDesc")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-800">{t("dashboardTitle")}</CardTitle>
                <CardDescription>{t("dashboardDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-6">
                  <Wrench className="h-20 w-20 text-blue-500" />
                </div>
                <p className="text-gray-600">
                  {t("dashboardText")}
                </p>
              </CardContent>
              <CardFooter>
                <Link href='/service-provider/dashboard' passHref>
                  <Button 
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {t("openDashboard")} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-800">{t("serviceProfile")}</CardTitle>
                <CardDescription>{t("manageOfferings")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-6">
                  <Wrench className="h-20 w-20 text-blue-500" />
                </div>
                <p className="text-gray-600">
                  {t("serviceProfileText")}
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  {t("editProfile")} <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("popularCategories")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: t("plumbing"), icon: <Droplet className="h-8 w-8" /> },
                { name: t("electrical"), icon: <Zap className="h-8 w-8" /> },
                { name: t("painting"), icon: <Paintbrush className="h-8 w-8" /> },
                { name: t("flooring"), icon: <Grid className="h-8 w-8" /> },
                { name: t("hvac"), icon: <Thermometer className="h-8 w-8" /> },
                { name: t("generalRepairs"), icon: <Wrench className="h-8 w-8" /> },
              ].map((category, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <div className="text-blue-600 mb-2">{category.icon}</div>
                  <span className="text-gray-800 font-medium">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

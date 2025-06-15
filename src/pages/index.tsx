import React from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, Wrench, Star, TrendingUp, Heart } from "lucide-react";

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

        {/* Quiénes Somos Section */}
        <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {t("whoWeAreTitle")}
              </h2>
            </div>

            <div className="max-w-5xl mx-auto space-y-8">
              <div className="text-center">
                <p className="text-xl text-gray-700 leading-relaxed">
                  {t("whoWeAreIntro")}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-8">
                <div className="text-center mb-6">
                  <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                    <Heart className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("ourMission")}</h3>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed text-center">
                  {t("ourMissionText")}
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("ourEcosystem")}</h3>
                <p className="text-lg text-gray-700 leading-relaxed text-center mb-6">
                  {t("ourEcosystemText")}
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-8">
                <div className="text-center mb-6">
                  <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
                    <Star className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("ourFundamentalValue")}</h3>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed text-center">
                  {t("ourFundamentalValueText")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cómo Funciona Section */}
        <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {t("howItWorksTitle")}
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                {t("howItWorksIntro")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {/* Para Administradores */}
              <Card className="h-full">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                    <Building className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {t("forAdministrators")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    {t("forAdministratorsText")}
                  </p>
                </CardContent>
              </Card>

              {/* Para Empresas de Servicios */}
              <Card className="h-full">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
                    <Wrench className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {t("forServiceCompanies")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    {t("forServiceCompaniesText")}
                  </p>
                </CardContent>
              </Card>

              {/* Para Vecinos */}
              <Card className="h-full">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {t("forNeighbors")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    {t("forNeighborsText")}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sistema de Valoraciones */}
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="text-center mb-8">
                <div className="mx-auto mb-4 p-3 bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center">
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {t("ratingsSystem")}
                </h3>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  {t("ratingsSystemText")}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-xl text-gray-700 font-medium max-w-4xl mx-auto">
                  {t("virtuousCircle")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Nuestros Logros Section */}
        <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {t("ourAchievementsTitle")}
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                {t("ourAchievementsIntro")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {/* 500+ Comunidades conectadas */}
              <Card className="text-center h-full">
                <CardContent className="pt-8">
                  <div className="text-5xl font-bold text-blue-600 mb-2">500+</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {t("connectedCommunities")}
                  </h3>
                  <p className="text-gray-600">
                    {t("connectedCommunitiesText")}
                  </p>
                </CardContent>
              </Card>

              {/* 300+ Empresas verificadas */}
              <Card className="text-center h-full">
                <CardContent className="pt-8">
                  <div className="text-5xl font-bold text-green-600 mb-2">300+</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {t("verifiedCompanies")}
                  </h3>
                  <p className="text-gray-600">
                    {t("verifiedCompaniesText")}
                  </p>
                </CardContent>
              </Card>

              {/* 95% Índice de satisfacción */}
              <Card className="text-center h-full">
                <CardContent className="pt-8">
                  <div className="text-5xl font-bold text-purple-600 mb-2">95%</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {t("satisfactionIndex")}
                  </h3>
                  <p className="text-gray-600">
                    {t("satisfactionIndexText")}
                  </p>
                </CardContent>
              </Card>

              {/* 10,000+ Incidencias resueltas */}
              <Card className="text-center h-full">
                <CardContent className="pt-8">
                  <div className="text-5xl font-bold text-orange-600 mb-2">10,000+</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {t("resolvedIncidents")}
                  </h3>
                  <p className="text-gray-600">
                    {t("resolvedIncidentsText")}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Conclusión */}
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="mx-auto mb-4 p-3 bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-indigo-600" />
              </div>
              <p className="text-xl text-gray-700 font-medium max-w-4xl mx-auto">
                {t("achievementsConclusion")}
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

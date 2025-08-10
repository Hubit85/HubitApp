import React from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Users, 
  Building, 
  Shield, 
  Globe, 
  Zap,
  Coins,
  TrendingUp,
  CheckCircle,
  Star,
  Target,
  Lightbulb,
  ArrowUp,
  Gift,
  Megaphone,
  PieChart,
  Heart,
  MessageSquare,
  BarChart3,
  Rocket,
  Banknote,
  TrendingDown,
  Twitter,
  Calendar,
  Clock,
  Unlock,
  Activity,
  LineChart
} from "lucide-react";

export default function WhitepaperPage() {
  const { t, language } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Head>
        <title>{t("whitepaper")} - {t("hubit")}</title>
        <meta name="description" content={t("whitepaperDescription")} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-neutral-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Hero Section */}
          <div className="text-center space-y-8 mb-16">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm px-8 py-6 rounded-3xl border border-neutral-200/60 shadow-lg shadow-neutral-900/5">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
                  {t("whitepaper")}
                </h1>
              </div>
            </div>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              {t("whitepaperIntro")}
            </p>
          </div>

          {/* Introduction Section */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl">
                <Lightbulb className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-4xl font-bold text-neutral-900">{t("introduction")}</h2>
            </div>
            
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <p className="text-lg text-neutral-700 leading-relaxed">
                    {language === "es" ? (
                      <>
                        HuBiT representa una revolución en la gestión inmobiliaria, creando el primer ecosistema digital que funciona como un <strong>hub de servicios profesionales especializado</strong> donde la transparencia es el pilar fundamental.
                      </>
                    ) : (
                      <>
                        HuBiT represents a revolution in real estate management, creating the first digital ecosystem that functions as a <strong>specialized professional services hub</strong> where transparency is the fundamental pillar.
                      </>
                    )}
                  </p>
                  <p className="text-lg text-neutral-700 leading-relaxed">
                    {language === "es" ? (
                      "Nuestra plataforma permite que los propietarios e inquilinos valoren y compartan experiencias sobre servicios recibidos, generando un ambiente de confianza y mejora continua en el sector inmobiliario."
                    ) : (
                      "Our platform allows owners and tenants to rate and share experiences about services received, creating an environment of trust and continuous improvement in the real estate sector."
                    )}
                  </p>
                </div>
                <Card className="bg-gradient-to-br from-emerald-50/60 to-green-50/60 border-emerald-200/60 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Heart className="h-6 w-6 text-emerald-600" />
                      <h3 className="text-lg font-semibold text-emerald-800">
                        {t("socialNetworkOfTrust")}
                      </h3>
                    </div>
                    <p className="text-emerald-700 leading-relaxed">
                      {t("socialNetworkDescription")}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-gradient-to-br from-blue-50/60 to-indigo-50/60 border-blue-200/60 shadow-lg shadow-blue-900/5">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <Target className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-neutral-900 mb-4">{t("visionStatement")}</h3>
                      <p className="text-neutral-700 text-lg leading-relaxed">
                        {t("visionText")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Problem Statement Section */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-red-100 to-red-50 rounded-2xl">
                <Target className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-4xl font-bold text-neutral-900">{t("problemStatement")}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-red-200/60 hover:border-red-300/60 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-gradient-to-br from-red-50/40 to-rose-50/40">
                <CardHeader className="pb-4">
                  <CardTitle className="text-red-700 flex items-center gap-3 text-lg">
                    <Shield className="h-6 w-6" />
                    {t("lackOfTransparency")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 leading-relaxed">
                    {t("transparencyProblem")}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-orange-200/60 hover:border-orange-300/60 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-gradient-to-br from-orange-50/40 to-amber-50/40">
                <CardHeader className="pb-4">
                  <CardTitle className="text-orange-700 flex items-center gap-3 text-lg">
                    <MessageSquare className="h-6 w-6" />
                    {language === "es" ? "Ausencia de Valoración" : "Absence of Rating"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 leading-relaxed">
                    {language === "es" ? (
                      "No existe un sistema estructurado donde los clientes puedan valorar servicios y compartir experiencias de forma verificable y útil."
                    ) : (
                      "There is no structured system where customers can rate services and share experiences in a verifiable and useful way."
                    )}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-yellow-200/60 hover:border-yellow-300/60 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-gradient-to-br from-yellow-50/40 to-amber-50/40">
                <CardHeader className="pb-4">
                  <CardTitle className="text-yellow-700 flex items-center gap-3 text-lg">
                    <TrendingDown className="h-6 w-6" />
                    {t("inefficientProcesses")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 leading-relaxed">
                    {t("efficiencyProblem")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Solution Section */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-50 rounded-2xl">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-4xl font-bold text-neutral-900">{t("ourSolution")}</h2>
            </div>
            
            <Card className="bg-gradient-to-br from-emerald-50/60 to-green-50/60 border-emerald-200/60 shadow-xl shadow-emerald-900/5 mb-8">
              <CardHeader className="pb-6">
                <CardTitle className="text-emerald-800 text-3xl flex items-center gap-3">
                  <Users className="h-8 w-8" />
                  {language === "es" ? "Hub de Servicios Profesionales Transparente" : "Transparent Professional Services Hub"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-emerald-700 text-lg leading-relaxed">
                  {t("platformDescription")}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl">
                    <Star className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                    <span className="text-emerald-700 font-medium">
                      {t("verifiedRatingSystem")}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl">
                    <MessageSquare className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                    <span className="text-emerald-700 font-medium">
                      {t("transparentCommunication")}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl">
                    <Zap className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                    <span className="text-emerald-700 font-medium">
                      {t("smartAutomation")}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl">
                    <Shield className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                    <span className="text-emerald-700 font-medium">
                      {t("blockchainSecurity")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-gradient-to-br from-blue-50/40 to-indigo-50/40 border-blue-200/60">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                    {t("serviceRating")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-neutral-600 leading-relaxed">
                    {t("serviceRatingDescription")}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-700 font-medium">
                        {t("verifiedReviews")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-700 font-medium">
                        {t("providerRanking")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-700 font-medium">
                        {t("transparentHistory")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-gradient-to-br from-purple-50/40 to-violet-50/40 border-purple-200/60">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Globe className="h-6 w-6 text-purple-600" />
                    {t("globalCommunity")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-neutral-600 leading-relaxed">
                    {t("globalCommunityDescription")}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-purple-700 font-medium">
                        {t("verifiedProfiles")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-purple-700 font-medium">
                        {t("trustNetwork")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-purple-700 font-medium">
                        {t("socialInteraction")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Tokenomics Section */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-amber-100 to-yellow-50 rounded-2xl">
                <Coins className="h-8 w-8 text-amber-600" />
              </div>
              <h2 className="text-4xl font-bold text-neutral-900">{t("tokenomics")}</h2>
            </div>
            
            <Card className="bg-gradient-to-br from-amber-50/60 to-orange-50/60 border-amber-200/60 shadow-xl shadow-amber-900/5">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm px-8 py-4 rounded-full shadow-lg">
                    <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                      <Coins className="h-8 w-8 text-white" />
                    </div>
                    <span className="text-3xl font-bold text-neutral-900">HBIT Token</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                  <Card className="bg-white/80 backdrop-blur-sm border-neutral-200/60 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <PieChart className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-purple-600 mb-2">1B</div>
                      <div className="text-sm text-neutral-600 font-medium">{t("totalSupply")}</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/80 backdrop-blur-sm border-neutral-200/60 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-blue-600 mb-2">60%</div>
                      <div className="text-sm text-neutral-600 font-medium">
                        {t("publicPool")}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/80 backdrop-blur-sm border-neutral-200/60 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <Building className="h-8 w-8 text-green-600 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-green-600 mb-2">20%</div>
                      <div className="text-sm text-neutral-600 font-medium">{t("team")}</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/80 backdrop-blur-sm border-neutral-200/60 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <Gift className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-emerald-600 mb-2">10%</div>
                      <div className="text-sm text-neutral-600 font-medium">
                        {t("airdropsRewards")}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/80 backdrop-blur-sm border-neutral-200/60 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <Megaphone className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-orange-600 mb-2">10%</div>
                      <div className="text-sm text-neutral-600 font-medium">Marketing</div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Token Distribution Details */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                    {t("distributionDetails")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-4 bg-white/60 rounded-2xl">
                        <Users className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-neutral-900">
                            {language === "es" ? "Pool Público (60%)" : "Public Pool (60%)"}
                          </div>
                          <div className="text-sm text-neutral-600">
                            {t("publicPoolDescription")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-white/60 rounded-2xl">
                        <Building className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-neutral-900">
                            {language === "es" ? "Equipo (20%)" : "Team (20%)"}
                          </div>
                          <div className="text-sm text-neutral-600">
                            {t("teamDescription2")}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-4 bg-white/60 rounded-2xl">
                        <Gift className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-neutral-900">
                            {language === "es" ? "Airdrops & Recompensas (10%)" : "Airdrops & Rewards (10%)"}
                          </div>
                          <div className="text-sm text-neutral-600">
                            {t("airdropsRewardsDescription")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-white/60 rounded-2xl">
                        <Megaphone className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-neutral-900">Marketing (10%)</div>
                          <div className="text-sm text-neutral-600">
                            {t("marketingDescription")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Token Dilution Analysis Section */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-violet-100 to-purple-50 rounded-2xl">
                <LineChart className="h-8 w-8 text-violet-600" />
              </div>
              <h2 className="text-4xl font-bold text-neutral-900">
                {language === "es" ? "Análisis de Dilución de Tokens" : "Token Dilution Analysis"}
              </h2>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-50/60 to-indigo-50/60 border-blue-200/60 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Activity className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-blue-600 mb-2">600M</div>
                  <div className="text-sm text-neutral-600 font-medium">
                    {language === "es" ? "Circulación Inicial" : "Initial Circulation"}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">60% - {language === "es" ? "Disponible Ya" : "Available Now"}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-50/60 to-green-50/60 border-emerald-200/60 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Gift className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-emerald-600 mb-2">100M</div>
                  <div className="text-sm text-neutral-600 font-medium">
                    {language === "es" ? "Airdrops (1 año)" : "Airdrops (1 year)"}
                  </div>
                  <div className="text-xs text-emerald-600 mt-1">10% - {language === "es" ? "Desbloqueo Gradual" : "Gradual Unlock"}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50/60 to-amber-50/60 border-orange-200/60 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Megaphone className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-orange-600 mb-2">100M</div>
                  <div className="text-sm text-neutral-600 font-medium">
                    {language === "es" ? "Marketing (1 año)" : "Marketing (1 year)"}
                  </div>
                  <div className="text-xs text-orange-600 mt-1">10% - {language === "es" ? "Desbloqueo Gradual" : "Gradual Unlock"}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50/60 to-violet-50/60 border-purple-200/60 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Building className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-purple-600 mb-2">200M</div>
                  <div className="text-sm text-neutral-600 font-medium">
                    {language === "es" ? "Equipo (4 años)" : "Team (4 years)"}
                  </div>
                  <div className="text-xs text-purple-600 mt-1">20% - {language === "es" ? "Cliff 4 años" : "4-year Cliff"}</div>
                </CardContent>
              </Card>
            </div>

            {/* Main Dilution Chart */}
            <Card className="bg-gradient-to-br from-neutral-50/60 to-white border-neutral-200/60 shadow-xl mb-8">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
                  <BarChart3 className="h-7 w-7 text-neutral-700" />
                  {language === "es" ? "Suministro Circulante Proyectado (4 Años)" : "Projected Circulating Supply (4 Years)"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Year Labels */}
                <div className="grid grid-cols-4 gap-4 text-center text-sm font-semibold text-neutral-600 mb-4">
                  <div>Año 1</div>
                  <div>Año 2</div>
                  <div>Año 3</div>
                  <div>Año 4</div>
                </div>

                {/* Visual Chart Bars */}
                <div className="space-y-6">
                  {/* Liquidity Bar - Always at 60% */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-neutral-700">
                        {language === "es" ? "Pool Público (Liquidity)" : "Public Pool (Liquidity)"}
                      </span>
                      <span className="text-xs text-blue-600 font-semibold">600M Tokens</span>
                    </div>
                    <div className="relative">
                      <div className="w-full h-8 bg-neutral-100 rounded-xl overflow-hidden">
                        <div className="h-full w-[60%] bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl shadow-sm"></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-semibold">
                        60% - {language === "es" ? "Disponible desde el inicio" : "Available from start"}
                      </div>
                    </div>
                  </div>

                  {/* Airdrops Bar - Gradual unlock over 1 year */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm font-medium text-neutral-700">
                        {language === "es" ? "Airdrops & Recompensas" : "Airdrops & Rewards"}
                      </span>
                      <span className="text-xs text-emerald-600 font-semibold">100M Tokens</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 h-8">
                      <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">10%</span>
                      </div>
                      <div className="bg-neutral-100 rounded-lg flex items-center justify-center">
                        <span className="text-neutral-400 text-xs">0%</span>
                      </div>
                      <div className="bg-neutral-100 rounded-lg flex items-center justify-center">
                        <span className="text-neutral-400 text-xs">0%</span>
                      </div>
                      <div className="bg-neutral-100 rounded-lg flex items-center justify-center">
                        <span className="text-neutral-400 text-xs">0%</span>
                      </div>
                    </div>
                  </div>

                  {/* Marketing Bar - Gradual unlock over 1 year */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                      <span className="text-sm font-medium text-neutral-700">Marketing</span>
                      <span className="text-xs text-orange-600 font-semibold">100M Tokens</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 h-8">
                      <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">10%</span>
                      </div>
                      <div className="bg-neutral-100 rounded-lg flex items-center justify-center">
                        <span className="text-neutral-400 text-xs">0%</span>
                      </div>
                      <div className="bg-neutral-100 rounded-lg flex items-center justify-center">
                        <span className="text-neutral-400 text-xs">0%</span>
                      </div>
                      <div className="bg-neutral-100 rounded-lg flex items-center justify-center">
                        <span className="text-neutral-400 text-xs">0%</span>
                      </div>
                    </div>
                  </div>

                  {/* Team Bar - Unlock starts in year 4 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium text-neutral-700">
                        {language === "es" ? "Equipo" : "Team"}
                      </span>
                      <span className="text-xs text-purple-600 font-semibold">200M Tokens</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 h-8">
                      <div className="bg-neutral-100 rounded-lg flex items-center justify-center">
                        <span className="text-neutral-400 text-xs">0%</span>
                      </div>
                      <div className="bg-neutral-100 rounded-lg flex items-center justify-center">
                        <span className="text-neutral-400 text-xs">0%</span>
                      </div>
                      <div className="bg-neutral-100 rounded-lg flex items-center justify-center">
                        <span className="text-neutral-400 text-xs">0%</span>
                      </div>
                      <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">20%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Supply Timeline */}
                <div className="mt-8 pt-6 border-t border-neutral-200">
                  <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-violet-600" />
                    {language === "es" ? "Suministro Total en Circulación" : "Total Circulating Supply"}
                  </h4>
                  <div className="grid grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/60 p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">800M</div>
                      <div className="text-sm text-blue-700 font-medium">Año 1</div>
                      <div className="text-xs text-neutral-600 mt-1">80% del supply</div>
                    </Card>
                    <Card className="bg-gradient-to-br from-neutral-50 to-gray-50 border-neutral-200/60 p-4 text-center">
                      <div className="text-2xl font-bold text-neutral-600">800M</div>
                      <div className="text-sm text-neutral-700 font-medium">Año 2</div>
                      <div className="text-xs text-neutral-600 mt-1">80% del supply</div>
                    </Card>
                    <Card className="bg-gradient-to-br from-neutral-50 to-gray-50 border-neutral-200/60 p-4 text-center">
                      <div className="text-2xl font-bold text-neutral-600">800M</div>
                      <div className="text-sm text-neutral-700 font-medium">Año 3</div>
                      <div className="text-xs text-neutral-600 mt-1">80% del supply</div>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200/60 p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">1B</div>
                      <div className="text-sm text-purple-700 font-medium">Año 4</div>
                      <div className="text-xs text-neutral-600 mt-1">100% del supply</div>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Unlock Schedule Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-rose-50/60 to-pink-50/60 border-rose-200/60 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl text-rose-800">
                    <Calendar className="h-6 w-6" />
                    {language === "es" ? "Cronograma de Desbloqueo" : "Unlock Schedule"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-white/60 rounded-xl">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-neutral-900">
                        {language === "es" ? "Inmediato (T0)" : "Immediate (T0)"}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {language === "es" ? "600M tokens disponibles para trading" : "600M tokens available for trading"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/60 rounded-xl">
                    <Unlock className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-neutral-900">
                        {language === "es" ? "Año 1: +200M tokens" : "Year 1: +200M tokens"}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {language === "es" ? "Airdrops y Marketing se desbloquean gradualmente" : "Airdrops and Marketing unlock gradually"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/60 rounded-xl">
                    <Target className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-neutral-900">
                        {language === "es" ? "Año 4: +200M tokens" : "Year 4: +200M tokens"}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {language === "es" ? "Tokens del equipo inician desbloqueo después de cliff" : "Team tokens begin unlock after cliff period"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50/60 to-yellow-50/60 border-amber-200/60 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl text-amber-800">
                    <Shield className="h-6 w-6" />
                    {language === "es" ? "Protección Contra Dilución" : "Dilution Protection"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-white/60 rounded-xl">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-neutral-900">
                        {language === "es" ? "80% circulando en 3 años" : "80% circulating in 3 years"}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {language === "es" ? "Minimiza impacto por nuevas emisiones" : "Minimizes impact from new emissions"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/60 rounded-xl">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-neutral-900">
                        {language === "es" ? "Cliff de 4 años para el equipo" : "4-year cliff for team"}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {language === "es" ? "Garantiza compromiso a largo plazo" : "Ensures long-term commitment"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/60 rounded-xl">
                    <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-neutral-900">
                        {language === "es" ? "Desbloqueo gradual y predecible" : "Gradual and predictable unlock"}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {language === "es" ? "Evita shocks de supply en el mercado" : "Prevents market supply shocks"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Roadmap Section */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-50 rounded-2xl">
                <TrendingUp className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-4xl font-bold text-neutral-900">
                {t("roadmap2025")}
              </h2>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-50 rounded-2xl flex items-center justify-center shadow-lg">
                  <Rocket className="h-8 w-8 text-blue-600" />
                </div>
                <Card className="flex-1 bg-gradient-to-br from-blue-50/40 to-indigo-50/40 border-blue-200/60">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-semibold text-neutral-900 mb-3">
                      {t("q3TokenLaunch")}
                    </h3>
                    <p className="text-neutral-600 leading-relaxed mb-4">
                      {t("q3Description")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{t("tokenLaunchTag")}</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {t("demoReady")}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {t("ratingSystem")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-50 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <Card className="flex-1 bg-gradient-to-br from-green-50/40 to-emerald-50/40 border-green-200/60">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-semibold text-neutral-900 mb-3">
                      {t("q4AppComplete")}
                    </h3>
                    <p className="text-neutral-600 leading-relaxed mb-4">
                      {t("q4Description")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        {t("completeApp")}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        {t("completeHub")}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        {t("hybridPayments")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-amber-100 to-yellow-50 rounded-2xl flex items-center justify-center shadow-lg">
                  <Banknote className="h-8 w-8 text-amber-600" />
                </div>
                <Card className="flex-1 bg-gradient-to-br from-amber-50/40 to-yellow-50/40 border-amber-200/60">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-semibold text-neutral-900 mb-3">
                      {t("q1CEXListing")}
                    </h3>
                    <p className="text-neutral-600 leading-relaxed mb-4">
                      {t("q1Description")}
                    </p>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="text-amber-700 font-medium text-sm">
                          {t("topTierExchanges")}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="text-amber-700 font-medium text-sm">
                          {t("institutionalPlatforms")}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="text-amber-700 font-medium text-sm">
                          {t("regulatedMarkets")}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                        {t("professionalListing")}
                      </span>
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                        {t("globalLiquidity")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-100 to-violet-50 rounded-2xl flex items-center justify-center shadow-lg">
                  <Globe className="h-8 w-8 text-purple-600" />
                </div>
                <Card className="flex-1 bg-gradient-to-br from-purple-50/40 to-violet-50/40 border-purple-200/60">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-semibold text-neutral-900 mb-3">
                      {t("q2GlobalExpansion")}
                    </h3>
                    <p className="text-neutral-600 leading-relaxed mb-4">
                      {t("q2Description")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {t("globalMarket")}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {t("multipleLanguages")}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">{t("partnerships")}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-rose-100 to-pink-50 rounded-2xl">
                <Users className="h-8 w-8 text-rose-600" />
              </div>
              <h2 className="text-4xl font-bold text-neutral-900">{t("team")}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-gradient-to-br from-blue-50/40 to-indigo-50/40 border-blue-200/60 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">{t("foundingTeam")}</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {t("teamDescription")}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-emerald-50/40 to-green-50/40 border-emerald-200/60 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <Zap className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">{t("techTeam")}</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {t("techDescription")}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50/40 to-violet-50/40 border-purple-200/60 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-violet-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <Building className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">{t("advisors")}</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {t("advisorsDescription")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Team Vesting Schedule - Exponential Decay */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-violet-50/60 to-purple-50 rounded-2xl">
                <Building className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-4xl font-bold text-neutral-900">
                {language === "es" ? "Cronograma de Vesting del Equipo (2026-2030)" : "Team Vesting Schedule (2026-2030)"}
              </h2>
            </div>
            
            <div className="space-y-8">
              <p className="text-neutral-600 mt-2">
                {language === "es" 
                  ? "Sistema de dilución exponencial: cada cuatrimestre se libera la mitad de los tokens restantes" 
                  : "Exponential dilution system: half of remaining tokens released each quarter"
                }
              </p>
              
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-neutral-900 flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-violet-600" />
                  {language === "es" ? "Año 2026 - Primeros Desbloqueos" : "Year 2026 - Initial Unlocks"}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Q1 2026 */}
                  <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200/60">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                          <span className="font-semibold text-purple-900">
                            {language === "es" ? "Q1 2026" : "Q1 2026"}
                          </span>
                        </div>
                        <span className="text-2xl font-bold text-purple-600">100M</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">{language === "es" ? "Porcentaje:" : "Percentage:"}</span>
                          <span className="font-medium text-purple-700">50% del total</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-3">
                          <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full" style={{width: '50%'}}></div>
                        </div>
                        <p className="text-xs text-neutral-600 mt-2">
                          {language === "es" ? "Primera liberación masiva" : "First major release"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Q2 2026 */}
                  <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200/60">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                          <span className="font-semibold text-indigo-900">
                            {language === "es" ? "Abril 2026" : "April 2026"}
                          </span>
                        </div>
                        <span className="text-2xl font-bold text-indigo-600">50M</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">{language === "es" ? "Porcentaje:" : "Percentage:"}</span>
                          <span className="font-medium text-indigo-700">25% del total</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-3">
                          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full" style={{width: '25%'}}></div>
                        </div>
                        <p className="text-xs text-neutral-600 mt-2">
                          {language === "es" ? "Mitad de lo restante" : "Half of remaining"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Q3 2026 */}
                  <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200/60">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                          <span className="font-semibold text-emerald-900">
                            {language === "es" ? "Julio 2026" : "July 2026"}
                          </span>
                        </div>
                        <span className="text-2xl font-bold text-emerald-600">25M</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">{language === "es" ? "Porcentaje:" : "Percentage:"}</span>
                          <span className="font-medium text-emerald-700">12.5% del total</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-3">
                          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full" style={{width: '12.5%'}}></div>
                        </div>
                        <p className="text-xs text-neutral-600 mt-2">
                          {language === "es" ? "Patrón continúa" : "Pattern continues"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Q4 2026 */}
                  <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200/60">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-amber-600 rounded-full"></div>
                          <span className="font-semibold text-amber-900">
                            {language === "es" ? "Octubre 2026" : "October 2026"}
                          </span>
                        </div>
                        <span className="text-2xl font-bold text-amber-600">12.5M</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">{language === "es" ? "Porcentaje:" : "Percentage:"}</span>
                          <span className="font-medium text-amber-700">6.25% del total</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-3">
                          <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-3 rounded-full" style={{width: '6.25%'}}></div>
                        </div>
                        <p className="text-xs text-neutral-600 mt-2">
                          {language === "es" ? "Dilución exponencial" : "Exponential dilution"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Exponential Decay Visualization */}
              <div className="mt-8 pt-6 border-t border-neutral-200">
                <h4 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center gap-3">
                  <TrendingDown className="h-5 w-5 text-rose-600" />
                  {language === "es" ? "Patrón de Dilución Exponencial (4 Años)" : "Exponential Dilution Pattern (4 Years)"}
                </h4>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200/60">
                    <div className="text-3xl font-bold text-purple-600 mb-1">2026</div>
                    <div className="text-sm text-neutral-600">187.5M tokens</div>
                    <div className="text-xs text-purple-700 font-medium">93.75% liberado</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-neutral-50 to-gray-50 rounded-xl border border-neutral-200/60">
                    <div className="text-3xl font-bold text-neutral-600 mb-1">2027</div>
                    <div className="text-sm text-neutral-600">~9.4M tokens</div>
                    <div className="text-xs text-neutral-700 font-medium">4.7% restante</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-neutral-50 to-gray-50 rounded-xl border border-neutral-200/60">
                    <div className="text-3xl font-bold text-neutral-600 mb-1">2028</div>
                    <div className="text-sm text-neutral-600">~2.3M tokens</div>
                    <div className="text-xs text-neutral-700 font-medium">1.2% restante</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-neutral-50 to-gray-50 rounded-xl border border-neutral-200/60">
                    <div className="text-3xl font-bold text-neutral-600 mb-1">2029+</div>
                    <div className="text-sm text-neutral-600">&lt;1M tokens</div>
                    <div className="text-xs text-neutral-700 font-medium">Residual</div>
                  </div>
                </div>

                <Card className="bg-gradient-to-r from-rose-50/50 to-orange-50/50 border-rose-200/60">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-rose-100 rounded-xl">
                        <Activity className="h-6 w-6 text-rose-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-neutral-900 mb-2">
                          {language === "es" ? "Impacto en la Dilución" : "Dilution Impact"}
                        </h5>
                        <p className="text-neutral-600 leading-relaxed text-sm">
                          {language === "es" ? (
                            "Este modelo exponencial garantiza que el 93.75% de los tokens del equipo se liberen en el primer año (2026), con cantidades decrecientes en los años siguientes. La dilución más significativa ocurre temprano, proporcionando claridad y predictibilidad al mercado."
                          ) : (
                            "This exponential model ensures that 93.75% of team tokens are released in the first year (2026), with decreasing amounts in subsequent years. The most significant dilution occurs early, providing market clarity and predictability."
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Token Growth Timeline Chart - Interactive */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-violet-100 to-purple-50 rounded-2xl">
                <LineChart className="h-8 w-8 text-violet-600" />
              </div>
              <h2 className="text-4xl font-bold text-neutral-900">
                {language === "es" ? "Crecimiento de Tokens en Circulación (2025-2029)" : "Circulating Tokens Growth (2025-2029)"}
              </h2>
            </div>
            
            <Card className="bg-gradient-to-br from-neutral-50/60 to-white border-neutral-200/60 shadow-xl mb-8">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
                  <Activity className="h-7 w-7 text-violet-600" />
                  {language === "es" ? "Evolución Temporal del Suministro Circulante" : "Temporal Evolution of Circulating Supply"}
                </CardTitle>
                <p className="text-neutral-600 mt-3">
                  {language === "es" ? (
                    "Visualización del crecimiento progresivo desde 800M tokens iniciales hasta 1,000M tokens completamente circulantes"
                  ) : (
                    "Visualization of progressive growth from 800M initial tokens to 1,000M fully circulating tokens"
                  )}
                </p>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Timeline Chart Visual */}
                <div className="relative">
                  {/* Year Labels */}
                  <div className="flex justify-between mb-6 text-sm font-semibold text-neutral-600">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">2025</div>
                      <div className="text-xs">{language === "es" ? "Inicio" : "Start"}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-emerald-600">2026</div>
                      <div className="text-xs">{language === "es" ? "Vesting Equipo" : "Team Vesting"}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-amber-600">2027</div>
                      <div className="text-xs">{language === "es" ? "Estabilidad" : "Stability"}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">2028</div>
                      <div className="text-xs">{language === "es" ? "Consolidación" : "Consolidation"}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-rose-600">2029</div>
                      <div className="text-xs">{language === "es" ? "Máximo" : "Maximum"}</div>
                    </div>
                  </div>

                  {/* Chart Area */}
                  <div className="relative bg-gradient-to-t from-neutral-50/40 to-white border border-neutral-200/60 rounded-2xl p-8 h-96">
                    {/* Y-Axis Labels */}
                    <div className="absolute left-2 top-4 bottom-8 flex flex-col justify-between text-xs text-neutral-500 font-medium">
                      <div>1.0B</div>
                      <div>900M</div>
                      <div>800M</div>
                      <div>700M</div>
                      <div>600M</div>
                    </div>

                    {/* Chart Lines and Dots */}
                    <div className="ml-8 h-full relative">
                      {/* Background Grid */}
                      <div className="absolute inset-0">
                        <div className="h-full w-full opacity-20">
                          <div className="h-1/5 border-b border-neutral-200"></div>
                          <div className="h-1/5 border-b border-neutral-200"></div>
                          <div className="h-1/5 border-b border-neutral-200"></div>
                          <div className="h-1/5 border-b border-neutral-200"></div>
                          <div className="h-1/5"></div>
                        </div>
                        <div className="absolute inset-0 grid grid-cols-5">
                          <div className="border-r border-neutral-200 opacity-20"></div>
                          <div className="border-r border-neutral-200 opacity-20"></div>
                          <div className="border-r border-neutral-200 opacity-20"></div>
                          <div className="border-r border-neutral-200 opacity-20"></div>
                          <div></div>
                        </div>
                      </div>

                      {/* Progressive Line Chart */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 320" preserveAspectRatio="none">
                        {/* Chart Path */}
                        <defs>
                          <linearGradient id="tokenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="25%" stopColor="#10b981" />
                            <stop offset="50%" stopColor="#f59e0b" />
                            <stop offset="75%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="url(#tokenGradient)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="url(#tokenGradient)" stopOpacity="0.05" />
                          </linearGradient>
                        </defs>
                        
                        {/* Area Fill */}
                        <path
                          d="M 0 160 L 80 160 L 100 80 L 200 72 L 300 68 L 400 64 L 400 320 L 0 320 Z"
                          fill="url(#areaGradient)"
                        />
                        
                        {/* Main Line */}
                        <path
                          d="M 0 160 L 80 160 L 100 80 L 200 72 L 300 68 L 400 64"
                          stroke="url(#tokenGradient)"
                          strokeWidth="4"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="drop-shadow-sm"
                        />
                      </svg>

                      {/* Data Points */}
                      <div className="absolute inset-0">
                        {/* 2025: 800M */}
                        <div className="absolute" style={{ left: '0%', bottom: '50%', transform: 'translate(-50%, 50%)' }}>
                          <div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg border-2 border-white"></div>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600 bg-white/90 px-2 py-1 rounded shadow">
                            800M
                          </div>
                        </div>

                        {/* Early 2026: ~880M */}
                        <div className="absolute" style={{ left: '20%', bottom: '50%', transform: 'translate(-50%, 50%)' }}>
                          <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-lg border-2 border-white"></div>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-emerald-600 bg-white/90 px-2 py-1 rounded shadow">
                            880M
                          </div>
                        </div>

                        {/* Mid 2026: ~980M */}
                        <div className="absolute" style={{ left: '25%', bottom: '75%', transform: 'translate(-50%, 50%)' }}>
                          <div className="w-5 h-5 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full shadow-lg border-2 border-white animate-pulse"></div>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-emerald-600 bg-white/90 px-2 py-1 rounded shadow">
                            980M
                          </div>
                        </div>

                        {/* 2027: ~990M */}
                        <div className="absolute" style={{ left: '50%', bottom: '77.5%', transform: 'translate(-50%, 50%)' }}>
                          <div className="w-4 h-4 bg-amber-500 rounded-full shadow-lg border-2 border-white"></div>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-amber-600 bg-white/90 px-2 py-1 rounded shadow">
                            990M
                          </div>
                        </div>

                        {/* 2028: ~997M */}
                        <div className="absolute" style={{ left: '75%', bottom: '78.5%', transform: 'translate(-50%, 50%)' }}>
                          <div className="w-4 h-4 bg-purple-500 rounded-full shadow-lg border-2 border-white"></div>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-purple-600 bg-white/90 px-2 py-1 rounded shadow">
                            997M
                          </div>
                        </div>

                        {/* 2029: 1000M */}
                        <div className="absolute" style={{ left: '100%', bottom: '80%', transform: 'translate(-50%, 50%)' }}>
                          <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-rose-500 rounded-full shadow-xl border-2 border-white animate-pulse"></div>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-rose-600 bg-white/90 px-2 py-1 rounded shadow">
                            1B
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Milestone Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <Card className="bg-gradient-to-br from-blue-50/60 to-indigo-50/60 border-blue-200/60">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Clock className="h-6 w-6 text-blue-600" />
                        <h4 className="font-semibold text-blue-900">
                          {language === "es" ? "Inicio (2025)" : "Start (2025)"}
                        </h4>
                      </div>
                      <div className="text-3xl font-bold text-blue-600 mb-2">800M</div>
                      <p className="text-blue-700 text-sm leading-relaxed">
                        {language === "es" ? (
                          "Pool público (60%) + Airdrops y Marketing (20%) completamente disponibles"
                        ) : (
                          "Public pool (60%) + Airdrops and Marketing (20%) fully available"
                        )}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-emerald-50/60 to-green-50/60 border-emerald-200/60">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="h-6 w-6 text-emerald-600" />
                        <h4 className="font-semibold text-emerald-900">
                          {language === "es" ? "Crecimiento (2026)" : "Growth (2026)"}
                        </h4>
                      </div>
                      <div className="text-3xl font-bold text-emerald-600 mb-2">+187.5M</div>
                      <p className="text-emerald-700 text-sm leading-relaxed">
                        {language === "es" ? (
                          "93.75% de tokens del equipo liberados exponencialmente durante el año"
                        ) : (
                          "93.75% of team tokens released exponentially throughout the year"
                        )}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50/60 to-violet-50/60 border-purple-200/60">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Target className="h-6 w-6 text-purple-600" />
                        <h4 className="font-semibold text-purple-900">
                          {language === "es" ? "Máximo (2029)" : "Maximum (2029)"}
                        </h4>
                      </div>
                      <div className="text-3xl font-bold text-purple-600 mb-2">1B</div>
                      <p className="text-purple-700 text-sm leading-relaxed">
                        {language === "es" ? (
                          "100% del suministro total en circulación, ecosistema completamente maduro"
                        ) : (
                          "100% of total supply in circulation, fully mature ecosystem"
                        )}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Exponential Release Pattern Details */}
            <Card className="bg-gradient-to-br from-rose-50/60 to-orange-50/60 border-rose-200/60 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl text-rose-800">
                  <Building className="h-6 w-6" />
                  {language === "es" ? "Detalle del Patrón Exponencial del Equipo" : "Team Exponential Pattern Details"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white/80 rounded-xl border border-rose-200/40">
                    <div className="text-2xl font-bold text-purple-600 mb-1">Q1 2026</div>
                    <div className="text-sm text-neutral-600">100M tokens</div>
                    <div className="text-xs text-purple-700 font-medium">50% del total</div>
                  </div>
                  <div className="text-center p-4 bg-white/80 rounded-xl border border-rose-200/40">
                    <div className="text-2xl font-bold text-indigo-600 mb-1">Abril 2026</div>
                    <div className="text-sm text-neutral-600">50M tokens</div>
                    <div className="text-xs text-indigo-700 font-medium">25% del total</div>
                  </div>
                  <div className="text-center p-4 bg-white/80 rounded-xl border border-rose-200/40">
                    <div className="text-2xl font-bold text-emerald-600 mb-1">Julio 2026</div>
                    <div className="text-sm text-neutral-600">25M tokens</div>
                    <div className="text-xs text-emerald-700 font-medium">12.5% del total</div>
                  </div>
                  <div className="text-center p-4 bg-white/80 rounded-xl border border-rose-200/40">
                    <div className="text-2xl font-bold text-amber-600 mb-1">Oct 2026</div>
                    <div className="text-sm text-neutral-600">12.5M tokens</div>
                    <div className="text-xs text-amber-700 font-medium">6.25% del total</div>
                  </div>
                </div>

                <Card className="bg-white/60 border-neutral-200/40">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-rose-100 rounded-xl">
                        <Activity className="h-6 w-6 text-rose-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-neutral-900 mb-2">
                          {language === "es" ? "Ventaja del Patrón Exponencial" : "Exponential Pattern Advantage"}
                        </h5>
                        <p className="text-neutral-600 leading-relaxed text-sm">
                          {language === "es" ? (
                            "El 93.75% de la dilución del equipo ocurre en 2026, creando máxima transparencia y predictibilidad. Los siguientes años muestran incrementos mínimos, permitiendo al ecosistema crecer sin presión de dilución significativa."
                          ) : (
                            "93.75% of team dilution occurs in 2026, creating maximum transparency and predictability. Following years show minimal increments, allowing the ecosystem to grow without significant dilution pressure."
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </section>

          {/* Conclusion Section */}
          <section className="mb-12">
            <Card className="bg-gradient-to-br from-neutral-50/60 to-gray-50/60 border-neutral-200/60 shadow-xl">
              <CardContent className="p-8 text-center">
                <h2 className="text-3xl font-bold text-neutral-900 mb-6">
                  {t("hubFuture")}
                </h2>
                <p className="text-lg text-neutral-600 leading-relaxed max-w-3xl mx-auto mb-8">
                  {t("hubFutureDescription")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    onClick={() => window.open("https://x.com/HuBiTapp_", "_blank")}
                    className="flex items-center gap-3 bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-neutral-800 hover:to-neutral-700 px-8 py-4 text-base shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <Twitter className="h-5 w-5" />
                    {language === "es" ? "Síguenos en X" : "Follow us on X"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={scrollToTop}
                    size="lg"
                    className="flex items-center gap-3 bg-white/80 backdrop-blur-sm hover:bg-white border-neutral-200 hover:border-neutral-300 px-8 py-4 text-base shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <ArrowUp className="h-5 w-5" />
                    {t("backToTop")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </>
  );
}

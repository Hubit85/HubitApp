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
                {language === "es" ? "Gráfica de Dilución de Tokens (Tiempo vs Oferta Circulante)" : "Token Dilution Chart (Time vs Circulating Supply)"}
              </h2>
            </div>

            {/* Coordinate System Chart */}
            <Card className="bg-gradient-to-br from-neutral-50/60 to-white border-neutral-200/60 shadow-xl mb-8">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
                  <BarChart3 className="h-7 w-7 text-violet-600" />
                  {language === "es" ? "Evolución de Tokens en Circulación por Categorías (2025-2029)" : "Circulating Token Evolution by Categories (2025-2029)"}
                </CardTitle>
                <p className="text-neutral-600 mt-3">
                  {language === "es" ? (
                    "Gráfica de barras apiladas: Tiempo (eje X) vs Número de tokens (eje Y de 0 a 1,000M). Cada color representa un tipo de token."
                  ) : (
                    "Stacked bar chart: Time (X-axis) vs Number of tokens (Y-axis 0 to 1,000M). Each color represents a token type."
                  )}
                </p>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Color Legend */}
                <div className="flex flex-wrap justify-center gap-6 p-4 bg-gradient-to-r from-neutral-50 to-white rounded-2xl border border-neutral-200/60">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-sm font-medium text-neutral-700">Pool Público (600M)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-sm font-medium text-neutral-700">Equipo (200M)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-sm font-medium text-neutral-700">Marketing (100M)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                    <span className="text-sm font-medium text-neutral-700">Airdrops (100M)</span>
                  </div>
                </div>

                {/* Main Chart Container */}
                <div className="relative bg-white border-2 border-neutral-200/80 rounded-2xl p-8">
                  {/* Y-Axis Title */}
                  <div className="absolute -left-4 top-1/2 transform -rotate-90 origin-center">
                    <span className="text-sm font-bold text-neutral-700">
                      {language === "es" ? "Tokens en Circulación" : "Circulating Tokens"}
                    </span>
                  </div>

                  {/* Chart Area - RESPONSIVE WIDTH que se ajusta al contenedor */}
                  <div className="ml-16 mr-8 pt-8">
                    
                    {/* Chart Grid and Content */}
                    <div className="relative h-80 bg-gradient-to-t from-neutral-50/30 to-transparent">
                      {/* Grid Lines */}
                      <div className="absolute inset-0">
                        {/* Horizontal Grid Lines */}
                        <div className="h-full flex flex-col justify-between">
                          {Array.from({length: 11}).map((_, i) => (
                            <div key={i} className="w-full h-px bg-neutral-200/60"></div>
                          ))}
                        </div>
                        {/* Vertical Grid Lines para 11 barras (9 trimestres + 2 años) */}
                        <div className="absolute inset-0 flex justify-between">
                          {Array.from({length: 11}).map((_, i) => (
                            <div key={i} className="w-px h-full bg-neutral-200/60"></div>
                          ))}
                        </div>
                      </div>

                      {/* Stacked Bar Chart - BARRAS MOVIDAS HACIA ABAJO DENTRO DEL GRID */}
                      <div className="absolute inset-0 flex items-end justify-between px-2" style={{ paddingBottom: '32px' }}>
                        
                        {/* Q4 2025: 850M (600M Pool + 100M Equipo + 50M Marketing + 50M Airdrops) */}
                        <div className="group flex flex-col items-center flex-1 relative">
                          <div className="relative w-6 bg-neutral-100 rounded-t-lg shadow-lg border border-neutral-200/60" style={{ height: '240px' }}>
                            {/* Pool Público: 600M = 144px */}
                            <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400" style={{ height: '144px' }}></div>
                            {/* Equipo: 100M = 24px */}
                            <div className="absolute w-full bg-gradient-to-t from-red-500 to-red-400" style={{ bottom: '144px', height: '24px' }}></div>
                            {/* Marketing: 50M = 12px */}
                            <div className="absolute w-full bg-gradient-to-t from-yellow-500 to-yellow-400" style={{ bottom: '168px', height: '12px' }}></div>
                            {/* Airdrops: 50M = 12px */}
                            <div className="absolute w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg" style={{ bottom: '180px', height: '12px' }}>
                            </div>
                            {/* Valor siempre visible encima de la barra */}
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-neutral-700">850M</div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 text-xs font-semibold text-neutral-600 bg-blue-50 px-2 py-1 rounded-md whitespace-nowrap">Q4 2025</div>
                        </div>

                        {/* Q1 2026: 925M (600M Pool + 150M Equipo + 75M Marketing + 75M Airdrops) */}
                        <div className="group flex flex-col items-center flex-1 relative">
                          <div className="relative w-6 bg-neutral-100 rounded-t-lg shadow-lg border border-neutral-200/60" style={{ height: '259px' }}>
                            <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400" style={{ height: '144px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-red-500 to-red-400" style={{ bottom: '144px', height: '36px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-yellow-500 to-yellow-400" style={{ bottom: '180px', height: '18px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg" style={{ bottom: '198px', height: '18px' }}>
                            </div>
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-neutral-700">925M</div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 text-xs font-semibold text-neutral-600 bg-emerald-50 px-2 py-1 rounded-md whitespace-nowrap">Q1 2026</div>
                        </div>

                        {/* Q2 2026: 962.5M (600M Pool + 175M Equipo + 87.5M Marketing + 87.5M Airdrops) */}
                        <div className="group flex flex-col items-center flex-1 relative">
                          <div className="relative w-6 bg-neutral-100 rounded-t-lg shadow-lg border border-neutral-200/60" style={{ height: '269px' }}>
                            <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400" style={{ height: '144px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-red-500 to-red-400" style={{ bottom: '144px', height: '42px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-yellow-500 to-yellow-400" style={{ bottom: '186px', height: '21px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg" style={{ bottom: '207px', height: '21px' }}>
                            </div>
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-neutral-700">962M</div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 text-xs font-semibold text-neutral-600 bg-emerald-50 px-2 py-1 rounded-md whitespace-nowrap">Q2 2026</div>
                        </div>

                        {/* Q3 2026: 981.25M (600M Pool + 187.5M Equipo + 93.75M Marketing + 93.75M Airdrops) */}
                        <div className="group flex flex-col items-center flex-1 relative">
                          <div className="relative w-6 bg-neutral-100 rounded-t-lg shadow-lg border border-neutral-200/60" style={{ height: '275px' }}>
                            <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400" style={{ height: '144px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-red-500 to-red-400" style={{ bottom: '144px', height: '45px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-yellow-500 to-yellow-400" style={{ bottom: '189px', height: '22px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg" style={{ bottom: '211px', height: '22px' }}>
                            </div>
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-neutral-700">981M</div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 text-xs font-semibold text-neutral-600 bg-emerald-50 px-2 py-1 rounded-md whitespace-nowrap">Q3 2026</div>
                        </div>

                        {/* Q4 2026: 990.625M (600M Pool + 193.75M Equipo + 96.875M Marketing + 96.875M Airdrops) */}
                        <div className="group flex flex-col items-center flex-1 relative">
                          <div className="relative w-6 bg-neutral-100 rounded-t-lg shadow-lg border border-neutral-200/60" style={{ height: '278px' }}>
                            <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400" style={{ height: '144px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-red-500 to-red-400" style={{ bottom: '144px', height: '46px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-yellow-500 to-yellow-400" style={{ bottom: '190px', height: '23px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg" style={{ bottom: '213px', height: '23px' }}>
                            </div>
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-neutral-700">990M</div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 text-xs font-semibold text-neutral-600 bg-emerald-50 px-2 py-1 rounded-md whitespace-nowrap">Q4 2026</div>
                        </div>

                        {/* Q1 2027: 995.31M (600M Pool + 196.875M Equipo + 98.44M Marketing + 98.44M Airdrops) */}
                        <div className="group flex flex-col items-center flex-1 relative">
                          <div className="relative w-6 bg-neutral-100 rounded-t-lg shadow-lg border border-neutral-200/60" style={{ height: '279px' }}>
                            <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400" style={{ height: '144px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-red-500 to-red-400" style={{ bottom: '144px', height: '47px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-yellow-500 to-yellow-400" style={{ bottom: '191px', height: '24px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg" style={{ bottom: '215px', height: '24px' }}>
                            </div>
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-neutral-700">995M</div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 text-xs font-semibold text-neutral-600 bg-emerald-50 px-2 py-1 rounded-md whitespace-nowrap">Q1 2027</div>
                        </div>

                        {/* Q2 2027: 997.66M (600M Pool + 198.44M Equipo + 99.22M Marketing + 99.22M Airdrops) */}
                        <div className="group flex flex-col items-center flex-1 relative">
                          <div className="relative w-6 bg-neutral-100 rounded-t-lg shadow-lg border border-neutral-200/60" style={{ height: '280px' }}>
                            <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400" style={{ height: '144px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-red-500 to-red-400" style={{ bottom: '144px', height: '48px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-yellow-500 to-yellow-400" style={{ bottom: '192px', height: '24px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg" style={{ bottom: '216px', height: '24px' }}>
                            </div>
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-neutral-700">997M</div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 text-xs font-semibold text-neutral-600 bg-emerald-50 px-2 py-1 rounded-md whitespace-nowrap">Q2 2027</div>
                        </div>

                        {/* Q3 2027: 998.83M (600M Pool + 199.22M Equipo + 99.61M Marketing + 99.61M Airdrops) */}
                        <div className="group flex flex-col items-center flex-1 relative">
                          <div className="relative w-6 bg-neutral-100 rounded-t-lg shadow-lg border border-neutral-200/60" style={{ height: '280px' }}>
                            <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400" style={{ height: '144px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-red-500 to-red-400" style={{ bottom: '144px', height: '48px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-yellow-500 to-yellow-400" style={{ bottom: '192px', height: '24px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg" style={{ bottom: '216px', height: '24px' }}>
                            </div>
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-neutral-700">998M</div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 text-xs font-semibold text-neutral-600 bg-emerald-50 px-2 py-1 rounded-md whitespace-nowrap">Q3 2027</div>
                        </div>

                        {/* Q4 2027: 999.41M (600M Pool + 199.61M Equipo + 99.805M Marketing + 99.805M Airdrops) */}
                        <div className="group flex flex-col items-center flex-1 relative">
                          <div className="relative w-6 bg-neutral-100 rounded-t-lg shadow-lg border border-neutral-200/60" style={{ height: '281px' }}>
                            <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400" style={{ height: '144px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-red-500 to-red-400" style={{ bottom: '144px', height: '48px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-yellow-500 to-yellow-400" style={{ bottom: '192px', height: '24px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg" style={{ bottom: '216px', height: '24px' }}>
                            </div>
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-neutral-700">999M</div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 text-xs font-semibold text-neutral-600 bg-emerald-50 px-2 py-1 rounded-md whitespace-nowrap">Q4 2027</div>
                        </div>

                        {/* 2028: 999.9M PROMEDIO (600M Pool + 199.9M Equipo + 99.95M Marketing + 99.95M Airdrops) */}
                        <div className="group flex flex-col items-center flex-1 relative">
                          <div className="relative w-6 bg-neutral-100 rounded-t-lg shadow-lg border border-neutral-200/60" style={{ height: '281px' }}>
                            <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400" style={{ height: '144px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-red-500 to-red-400" style={{ bottom: '144px', height: '48px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-yellow-500 to-yellow-400" style={{ bottom: '192px', height: '24px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg" style={{ bottom: '216px', height: '24px' }}>
                            </div>
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-neutral-700">999.9M</div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 text-xs font-semibold text-neutral-600 bg-violet-50 px-2 py-1 rounded-md whitespace-nowrap">2028</div>
                        </div>

                        {/* 2029: 1000M COMPLETO (600M Pool + 200M Equipo + 100M Marketing + 100M Airdrops) */}
                        <div className="group flex flex-col items-center flex-1 relative">
                          <div className="relative w-6 bg-neutral-100 rounded-t-lg shadow-lg border border-neutral-200/60" style={{ height: '282px' }}>
                            <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400" style={{ height: '144px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-red-500 to-red-400" style={{ bottom: '144px', height: '48px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-yellow-500 to-yellow-400" style={{ bottom: '192px', height: '24px' }}></div>
                            <div className="absolute w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg" style={{ bottom: '216px', height: '24px' }}>
                            </div>
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-emerald-600">1,000M</div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 text-xs font-semibold text-neutral-600 bg-emerald-50 px-2 py-1 rounded-md whitespace-nowrap">2029</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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

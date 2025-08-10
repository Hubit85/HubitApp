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
                  {language === "es" ? "Evolución de Tokens en Circulación (2025-2029)" : "Circulating Token Evolution (2025-2029)"}
                </CardTitle>
                <p className="text-neutral-600 mt-3">
                  {language === "es" ? (
                    "Gráfica de coordenadas: Tiempo (ascisas) vs Número de tokens (ordenadas)"
                  ) : (
                    "Coordinate chart: Time (x-axis) vs Number of tokens (y-axis)"
                  )}
                </p>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Main Chart Container */}
                <div className="relative bg-white border-2 border-neutral-200/80 rounded-2xl p-8">
                  {/* Y-Axis Title */}
                  <div className="absolute -left-4 top-1/2 transform -rotate-90 origin-center">
                    <span className="text-sm font-bold text-neutral-700">
                      {language === "es" ? "Tokens en Circulación (Millones)" : "Circulating Tokens (Millions)"}
                    </span>
                  </div>

                  {/* Chart Area */}
                  <div className="ml-16 mr-8">
                    {/* Y-Axis Labels */}
                    <div className="absolute left-8 top-12 bottom-16 flex flex-col justify-between text-sm font-medium text-neutral-600">
                      <div className="flex items-center">
                        <div className="w-3 h-px bg-neutral-300 mr-2"></div>
                        1,000M
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-px bg-neutral-300 mr-2"></div>
                        950M
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-px bg-neutral-300 mr-2"></div>
                        900M
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-px bg-neutral-300 mr-2"></div>
                        850M
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-px bg-neutral-300 mr-2"></div>
                        800M
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-px bg-neutral-300 mr-2"></div>
                        750M
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-px bg-neutral-300 mr-2"></div>
                        700M
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-px bg-neutral-300 mr-2"></div>
                        650M
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-px bg-neutral-300 mr-2"></div>
                        600M
                      </div>
                    </div>

                    {/* Chart Grid and Content */}
                    <div className="relative h-96 bg-gradient-to-t from-neutral-50/30 to-transparent">
                      {/* Grid Lines */}
                      <div className="absolute inset-0">
                        {/* Horizontal Grid Lines */}
                        <div className="h-full flex flex-col justify-between">
                          {Array.from({length: 9}).map((_, i) => (
                            <div key={i} className="w-full h-px bg-neutral-200/60"></div>
                          ))}
                        </div>
                        {/* Vertical Grid Lines */}
                        <div className="absolute inset-0 flex justify-between">
                          {Array.from({length: 17}).map((_, i) => (
                            <div key={i} className="w-px h-full bg-neutral-200/60"></div>
                          ))}
                        </div>
                      </div>

                      {/* Chart Line and Data Points */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 384" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="20%" stopColor="#10b981" />
                            <stop offset="30%" stopColor="#f59e0b" />
                            <stop offset="70%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                          <linearGradient id="chartArea" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="url(#chartGradient)" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="url(#chartGradient)" stopOpacity="0.05" />
                          </linearGradient>
                        </defs>
                        
                        {/* Area under curve */}
                        <path
                          d="M 0 192 L 50 192 L 100 192 L 150 192 L 200 192 L 250 96 L 300 64 L 350 48 L 400 38 L 450 38 L 500 38 L 550 38 L 600 38 L 650 38 L 700 38 L 750 32 L 800 24 L 800 384 L 0 384 Z"
                          fill="url(#chartArea)"
                        />
                        
                        {/* Main trend line */}
                        <path
                          d="M 0 192 L 50 192 L 100 192 L 150 192 L 200 192 L 250 96 L 300 64 L 350 48 L 400 38 L 450 38 L 500 38 L 550 38 L 600 38 L 650 38 L 700 38 L 750 32 L 800 24"
                          stroke="url(#chartGradient)"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="drop-shadow-sm"
                        />
                      </svg>

                      {/* Data Points with Labels */}
                      <div className="absolute inset-0">
                        {/* T0 - 2025: 600M (Public Pool) */}
                        <div className="absolute" style={{ left: '0%', bottom: '50%', transform: 'translate(-50%, 50%)' }}>
                          <div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg border-2 border-white"></div>
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded shadow border">
                            600M<br/>
                            <span className="text-neutral-600 font-normal">T0 2025</span>
                          </div>
                        </div>

                        {/* Q1 2026: 725M (600M + 25M Airdrops + 25M Marketing) */}
                        <div className="absolute" style={{ left: '12.5%', bottom: '40%', transform: 'translate(-50%, 50%)' }}>
                          <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-lg border-2 border-white"></div>
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded shadow border">
                            725M<br/>
                            <span className="text-neutral-600 font-normal">Q1 2026</span>
                          </div>
                        </div>

                        {/* Q2 2026: 850M (+ 25M + 25M + 100M Team) */}
                        <div className="absolute" style={{ left: '25%', bottom: '25%', transform: 'translate(-50%, 50%)' }}>
                          <div className="w-5 h-5 bg-amber-500 rounded-full shadow-lg border-2 border-white animate-pulse"></div>
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded shadow border">
                            850M<br/>
                            <span className="text-neutral-600 font-normal">Q2 2026</span>
                          </div>
                        </div>

                        {/* Q3 2026: 925M (+ 25M + 25M + 50M Team) */}
                        <div className="absolute" style={{ left: '31.25%', bottom: '18.75%', transform: 'translate(-50%, 50%)' }}>
                          <div className="w-4 h-4 bg-orange-500 rounded-full shadow-lg border-2 border-white"></div>
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded shadow border">
                            925M<br/>
                            <span className="text-neutral-600 font-normal">Q3 2026</span>
                          </div>
                        </div>

                        {/* Q4 2026: 962.5M (+ 25M + 25M + 12.5M Team) */}
                        <div className="absolute" style={{ left: '37.5%', bottom: '15%', transform: 'translate(-50%, 50%)' }}>
                          <div className="w-4 h-4 bg-purple-500 rounded-full shadow-lg border-2 border-white"></div>
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded shadow border">
                            962.5M<br/>
                            <span className="text-neutral-600 font-normal">Q4 2026</span>
                          </div>
                        </div>

                        {/* 2027-2029: Gradual approach to 1B */}
                        <div className="absolute" style={{ left: '62.5%', bottom: '10%', transform: 'translate(-50%, 50%)' }}>
                          <div className="w-4 h-4 bg-indigo-500 rounded-full shadow-lg border-2 border-white"></div>
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded shadow border">
                            990M<br/>
                            <span className="text-neutral-600 font-normal">2027</span>
                          </div>
                        </div>

                        {/* 2029: 1B */}
                        <div className="absolute" style={{ left: '100%', bottom: '6%', transform: 'translate(-50%, 50%)' }}>
                          <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-rose-500 rounded-full shadow-xl border-2 border-white animate-pulse"></div>
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded shadow border">
                            1,000M<br/>
                            <span className="text-neutral-600 font-normal">2029</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* X-Axis Labels */}
                    <div className="flex justify-between mt-4 text-sm font-medium text-neutral-600">
                      <span>2025</span>
                      <span>Q1<br/>2026</span>
                      <span>Q2<br/>2026</span>
                      <span>Q3<br/>2026</span>
                      <span>Q4<br/>2026</span>
                      <span>2027</span>
                      <span>2028</span>
                      <span>2029</span>
                    </div>

                    {/* X-Axis Title */}
                    <div className="text-center mt-4">
                      <span className="text-sm font-bold text-neutral-700">
                        {language === "es" ? "Tiempo (Trimestres)" : "Time (Quarters)"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Token Release Schedule Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Release Schedule */}
                  <Card className="bg-gradient-to-br from-blue-50/60 to-indigo-50/60 border-blue-200/60">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-xl text-blue-800">
                        <Calendar className="h-6 w-6" />
                        {language === "es" ? "Cronograma de Liberación" : "Release Schedule"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-white/60 rounded-xl">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
                          <div>
                            <div className="font-semibold text-neutral-900">
                              {language === "es" ? "2025: 600M tokens" : "2025: 600M tokens"}
                            </div>
                            <div className="text-sm text-neutral-600">
                              {language === "es" ? "Pool público disponible inmediatamente" : "Public pool available immediately"}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-3 bg-white/60 rounded-xl">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full mt-1"></div>
                          <div>
                            <div className="font-semibold text-neutral-900">
                              {language === "es" ? "2026: +362.5M tokens" : "2026: +362.5M tokens"}
                            </div>
                            <div className="text-sm text-neutral-600">
                              {language === "es" ? "Airdrops (100M) + Marketing (100M) + Equipo (162.5M)" : "Airdrops (100M) + Marketing (100M) + Team (162.5M)"}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-3 bg-white/60 rounded-xl">
                          <div className="w-3 h-3 bg-purple-500 rounded-full mt-1"></div>
                          <div>
                            <div className="font-semibold text-neutral-900">
                              {language === "es" ? "2027-2029: +37.5M tokens" : "2027-2029: +37.5M tokens"}
                            </div>
                            <div className="text-sm text-neutral-600">
                              {language === "es" ? "Tokens restantes del equipo gradualmente" : "Remaining team tokens gradually"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Distribution Breakdown */}
                  <Card className="bg-gradient-to-br from-emerald-50/60 to-green-50/60 border-emerald-200/60">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-xl text-emerald-800">
                        <PieChart className="h-6 w-6" />
                        {language === "es" ? "Distribución por Categoría" : "Distribution by Category"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                            <span className="font-medium text-neutral-700">Pool Público</span>
                          </div>
                          <span className="font-bold text-blue-600">600M (60%)</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                            <span className="font-medium text-neutral-700">Airdrops</span>
                          </div>
                          <span className="font-bold text-emerald-600">100M (10%)</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                            <span className="font-medium text-neutral-700">Marketing</span>
                          </div>
                          <span className="font-bold text-orange-600">100M (10%)</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                            <span className="font-medium text-neutral-700">Equipo</span>
                          </div>
                          <span className="font-bold text-purple-600">200M (20%)</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quarterly Breakdown Table */}
                <Card className="bg-gradient-to-br from-amber-50/60 to-yellow-50/60 border-amber-200/60">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl text-amber-800">
                      <BarChart3 className="h-6 w-6" />
                      {language === "es" ? "Liberación Trimestral Detallada" : "Detailed Quarterly Release"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-amber-200/60">
                            <th className="text-left py-3 font-semibold text-amber-900">
                              {language === "es" ? "Período" : "Period"}
                            </th>
                            <th className="text-center py-3 font-semibold text-amber-900">Airdrops</th>
                            <th className="text-center py-3 font-semibold text-amber-900">Marketing</th>
                            <th className="text-center py-3 font-semibold text-amber-900">{language === "es" ? "Equipo" : "Team"}</th>
                            <th className="text-center py-3 font-semibold text-amber-900">{language === "es" ? "Total Acum." : "Cum. Total"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-200/40">
                          <tr>
                            <td className="py-3 font-medium">2025 T0</td>
                            <td className="text-center py-3">0M</td>
                            <td className="text-center py-3">0M</td>
                            <td className="text-center py-3">0M</td>
                            <td className="text-center py-3 font-bold text-blue-600">600M</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-medium">Q1 2026</td>
                            <td className="text-center py-3">25M</td>
                            <td className="text-center py-3">25M</td>
                            <td className="text-center py-3">100M</td>
                            <td className="text-center py-3 font-bold text-emerald-600">750M</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-medium">Q2 2026</td>
                            <td className="text-center py-3">25M</td>
                            <td className="text-center py-3">25M</td>
                            <td className="text-center py-3">50M</td>
                            <td className="text-center py-3 font-bold text-amber-600">850M</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-medium">Q3 2026</td>
                            <td className="text-center py-3">25M</td>
                            <td className="text-center py-3">25M</td>
                            <td className="text-center py-3">25M</td>
                            <td className="text-center py-3 font-bold text-orange-600">925M</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-medium">Q4 2026</td>
                            <td className="text-center py-3">25M</td>
                            <td className="text-center py-3">25M</td>
                            <td className="text-center py-3">12.5M</td>
                            <td className="text-center py-3 font-bold text-purple-600">987.5M</td>
                          </tr>
                          <tr>
                            <td className="py-3 font-medium">2027-2029</td>
                            <td className="text-center py-3">0M</td>
                            <td className="text-center py-3">0M</td>
                            <td className="text-center py-3">12.5M</td>
                            <td className="text-center py-3 font-bold text-rose-600">1,000M</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
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

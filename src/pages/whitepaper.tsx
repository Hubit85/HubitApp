
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
  Download,
  Eye,
  Star,
  Target,
  Lightbulb,
  BookOpen,
  ArrowUp,
  Gift,
  Megaphone,
  PieChart,
  Heart,
  MessageSquare,
  BarChart3,
  Rocket,
  Banknote,
  TrendingDown
} from "lucide-react";

export default function WhitepaperPage() {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Head>
        <title>{t("whitepaper")} - {t("hubit")}</title>
        <meta name="description" content={`${t("hubit")} ${t("whitepaper")} - Documentación técnica y hoja de ruta`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-neutral-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Hero Section */}
          <div className="text-center space-y-8 mb-16">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm px-8 py-6 rounded-3xl border border-neutral-200/60 shadow-lg shadow-neutral-900/5">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
                  Whitepaper
                </h1>
                <p className="text-lg text-neutral-600 mt-1">HuBiT v8.0</p>
              </div>
            </div>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Un hub revolucionario de servicios profesionales para la gestión inmobiliaria que combina transparencia, valoración de servicios y tecnología blockchain para transformar la experiencia de propietarios y administradores.
            </p>
            
            {/* Download and View Options */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button 
                size="lg"
                className="flex items-center gap-3 bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-neutral-800 hover:to-neutral-700 px-8 py-4 text-base shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <Download className="h-5 w-5" />
                Descargar PDF
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="flex items-center gap-3 bg-white/80 backdrop-blur-sm hover:bg-white border-neutral-200 hover:border-neutral-300 px-8 py-4 text-base shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <Eye className="h-5 w-5" />
                Ver Online
              </Button>
            </div>
          </div>

          {/* Introduction Section */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl">
                <Lightbulb className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-4xl font-bold text-neutral-900">Introducción</h2>
            </div>
            
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <p className="text-lg text-neutral-700 leading-relaxed">
                    HuBiT v8.0 representa una revolución en la gestión inmobiliaria, creando el primer ecosistema digital que funciona como un <strong>hub de servicios profesionales especializado</strong> donde la transparencia es el pilar fundamental.
                  </p>
                  <p className="text-lg text-neutral-700 leading-relaxed">
                    Nuestra plataforma permite que los propietarios e inquilinos valoren y compartan experiencias sobre servicios recibidos, generando un ambiente de confianza y mejora continua en el sector inmobiliario.
                  </p>
                </div>
                <Card className="bg-gradient-to-br from-emerald-50/60 to-green-50/60 border-emerald-200/60 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Heart className="h-6 w-6 text-emerald-600" />
                      <h3 className="text-lg font-semibold text-emerald-800">Red Social de Confianza</h3>
                    </div>
                    <p className="text-emerald-700 leading-relaxed">
                      Los usuarios pueden valorar servicios, compartir experiencias y construir una comunidad basada en la transparencia y calidad del servicio.
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
                      <h3 className="text-2xl font-semibold text-neutral-900 mb-4">Nuestra Visión</h3>
                      <p className="text-neutral-700 text-lg leading-relaxed">
                        Crear el primer hub de servicios profesionales inmobiliarios donde la transparencia, valoración de servicios y gestión eficiente converjan en un ecosistema digital descentralizado, empoderando a propietarios, administradores y proveedores de servicios.
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
              <h2 className="text-4xl font-bold text-neutral-900">Problemática Actual</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-red-200/60 hover:border-red-300/60 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-gradient-to-br from-red-50/40 to-rose-50/40">
                <CardHeader className="pb-4">
                  <CardTitle className="text-red-700 flex items-center gap-3 text-lg">
                    <Shield className="h-6 w-6" />
                    Falta de Transparencia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 leading-relaxed">
                    Los propietarios no tienen visibilidad sobre la calidad real de los servicios contratados, generando desconfianza y decisiones mal informadas.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-orange-200/60 hover:border-orange-300/60 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-gradient-to-br from-orange-50/40 to-amber-50/40">
                <CardHeader className="pb-4">
                  <CardTitle className="text-orange-700 flex items-center gap-3 text-lg">
                    <MessageSquare className="h-6 w-6" />
                    Ausencia de Valoración
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 leading-relaxed">
                    No existe un sistema estructurado donde los clientes puedan valorar servicios y compartir experiencias de forma verificable y útil.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-yellow-200/60 hover:border-yellow-300/60 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-gradient-to-br from-yellow-50/40 to-amber-50/40">
                <CardHeader className="pb-4">
                  <CardTitle className="text-yellow-700 flex items-center gap-3 text-lg">
                    <TrendingDown className="h-6 w-6" />
                    Procesos Ineficientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 leading-relaxed">
                    Gestión manual de pagos, seguimiento de servicios y comunicación fragmentada que reduce la eficiencia operativa.
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
              <h2 className="text-4xl font-bold text-neutral-900">Nuestra Solución</h2>
            </div>
            
            <Card className="bg-gradient-to-br from-emerald-50/60 to-green-50/60 border-emerald-200/60 shadow-xl shadow-emerald-900/5 mb-8">
              <CardHeader className="pb-6">
                <CardTitle className="text-emerald-800 text-3xl flex items-center gap-3">
                  <Users className="h-8 w-8" />
                  Hub de Servicios Profesionales Transparente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-emerald-700 text-lg leading-relaxed">
                  HuBiT combina un hub de servicios profesionales especializados con herramientas de gestión inmobiliaria, permitiendo que los usuarios valoren servicios, compartan experiencias y construyan confianza a través de la transparencia y verificación blockchain.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl">
                    <Star className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                    <span className="text-emerald-700 font-medium">Sistema de Valoración Verificado</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl">
                    <MessageSquare className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                    <span className="text-emerald-700 font-medium">Comunicación Transparente</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl">
                    <Zap className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                    <span className="text-emerald-700 font-medium">Automatización Inteligente</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl">
                    <Shield className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                    <span className="text-emerald-700 font-medium">Seguridad Blockchain</span>
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
                    Valoración de Servicios
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-neutral-600 leading-relaxed">
                    Los usuarios pueden valorar servicios recibidos, crear reseñas detalladas y ayudar a otros propietarios a tomar decisiones informadas.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-700 font-medium">Reseñas Verificadas</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-700 font-medium">Ranking de Proveedores</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-700 font-medium">Historial Transparente</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-gradient-to-br from-purple-50/40 to-violet-50/40 border-purple-200/60">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Globe className="h-6 w-6 text-purple-600" />
                    Comunidad Global
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-neutral-600 leading-relaxed">
                    Un hub de servicios profesionales donde propietarios, administradores y proveedores interactúan de forma transparente y colaborativa.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-purple-700 font-medium">Perfiles Verificados</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-purple-700 font-medium">Red de Confianza</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-purple-700 font-medium">Interacción Social</span>
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
              <h2 className="text-4xl font-bold text-neutral-900">Tokenomía</h2>
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
                      <div className="text-sm text-neutral-600 font-medium">Suministro Total</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/80 backdrop-blur-sm border-neutral-200/60 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-blue-600 mb-2">60%</div>
                      <div className="text-sm text-neutral-600 font-medium">Pool Público</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/80 backdrop-blur-sm border-neutral-200/60 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <Building className="h-8 w-8 text-green-600 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-green-600 mb-2">20%</div>
                      <div className="text-sm text-neutral-600 font-medium">Equipo</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/80 backdrop-blur-sm border-neutral-200/60 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <Gift className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-emerald-600 mb-2">10%</div>
                      <div className="text-sm text-neutral-600 font-medium">Airdrops & Recompensas</div>
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
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">Detalles de Distribución</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-4 bg-white/60 rounded-2xl">
                        <Users className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-neutral-900">Pool Público (60%)</div>
                          <div className="text-sm text-neutral-600">Disponible para el público general a través de ventas y distribución</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-white/60 rounded-2xl">
                        <Building className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-neutral-900">Equipo (20%)</div>
                          <div className="text-sm text-neutral-600">Vesting de 4 años con cliff de 1 año para el equipo fundador</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-4 bg-white/60 rounded-2xl">
                        <Gift className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-neutral-900">Airdrops & Recompensas (10%)</div>
                          <div className="text-sm text-neutral-600">Para usuarios fieles, early adopters y recompensas de la comunidad</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-white/60 rounded-2xl">
                        <Megaphone className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-neutral-900">Marketing (10%)</div>
                          <div className="text-sm text-neutral-600">Campañas de marketing, promoción y desarrollo de la comunidad</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Updated Roadmap Section */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-50 rounded-2xl">
                <TrendingUp className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-4xl font-bold text-neutral-900">Hoja de Ruta 2025-2026</h2>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-50 rounded-2xl flex items-center justify-center shadow-lg">
                  <Rocket className="h-8 w-8 text-blue-600" />
                </div>
                <Card className="flex-1 bg-gradient-to-br from-blue-50/40 to-indigo-50/40 border-blue-200/60">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-semibold text-neutral-900 mb-3">Q3 2025 - Lanzamiento del Token HBIT</h3>
                    <p className="text-neutral-600 leading-relaxed mb-4">
                      Lanzamiento oficial de la criptomoneda HBIT con la demostración lista del hub de servicios profesionales, incluyendo sistema de valoración de servicios y recompensas para usuarios.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Token Launch</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Demo Preparada</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Sistema de Valoración</span>
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
                    <h3 className="text-2xl font-semibold text-neutral-900 mb-3">Q4 2025 - Aplicación Completada</h3>
                    <p className="text-neutral-600 leading-relaxed mb-4">
                      Finalización completa de la aplicación con todas las funcionalidades del hub de servicios profesionales, incluyendo gestión avanzada, sistema de pagos híbrido (cripto para funciones de la app, EUR para servicios) y sistema completo de transparencia y valoración.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">App Completa</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Hub Completo</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Pagos Híbridos</span>
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
                    <h3 className="text-2xl font-semibold text-neutral-900 mb-3">Q1 2026 - Cotización en Mercados Centrales</h3>
                    <p className="text-neutral-600 leading-relaxed mb-4">
                      Listado del token HBIT en los principales exchanges centralizados para aumentar liquidez y accesibilidad global.
                    </p>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3 p-2 bg-white/60 rounded-lg">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="text-amber-700 font-medium text-sm">Binance - Exchange líder mundial</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-white/60 rounded-lg">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="text-amber-700 font-medium text-sm">Coinbase - Mercado institucional</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-white/60 rounded-lg">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="text-amber-700 font-medium text-sm">Kraken - Mercado europeo</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-white/60 rounded-lg">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="text-amber-700 font-medium text-sm">KuCoin - Expansión asiática</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">CEX Listing</span>
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">Liquidez Global</span>
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">Adopción Masiva</span>
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
                    <h3 className="text-2xl font-semibold text-neutral-900 mb-3">Q2 2026 - Expansión Global</h3>
                    <p className="text-neutral-600 leading-relaxed mb-4">
                      Expansión internacional del hub de servicios profesionales a mercados clave en América, Europa, Asia y Oceanía, estableciendo HuBiT como el estándar global de transparencia inmobiliaria.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Mercado Global</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Múltiples Idiomas</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Partnerships</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Regulación</span>
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
              <h2 className="text-4xl font-bold text-neutral-900">Equipo</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-gradient-to-br from-blue-50/40 to-indigo-50/40 border-blue-200/60 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">Equipo Fundador</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Expertos en tecnología blockchain, gestión inmobiliaria y desarrollo de productos con más de 10 años de experiencia combinada en el sector.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-emerald-50/40 to-green-50/40 border-emerald-200/60 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <Zap className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">Equipo Técnico</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Desarrolladores especializados en blockchain, ingenieros de software y diseñadores UX/UI enfocados en crear la mejor experiencia de usuario.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50/40 to-violet-50/40 border-purple-200/60 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-violet-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <Building className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">Asesores</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Profesionales del sector inmobiliario, expertos en fintech y asesores legales que guían el desarrollo estratégico y la expansión global.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Conclusion Section */}
          <section className="mb-12">
            <Card className="bg-gradient-to-br from-neutral-50/60 to-gray-50/60 border-neutral-200/60 shadow-xl">
              <CardContent className="p-8 text-center">
                <h2 className="text-3xl font-bold text-neutral-900 mb-6">El Futuro de HuBiT</h2>
                <p className="text-lg text-neutral-600 leading-relaxed max-w-3xl mx-auto mb-8">
                  HuBiT representa la evolución natural de la gestión inmobiliaria, combinando un hub de servicios profesionales transparente con tecnología blockchain avanzada para crear un ecosistema donde la confianza, valoración de servicios y eficiencia operativa transforman la experiencia de toda la comunidad inmobiliaria.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    className="flex items-center gap-3 bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-neutral-800 hover:to-neutral-700 px-8 py-4 text-base shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <Users className="h-5 w-5" />
                    Únete a la Comunidad
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={scrollToTop}
                    size="lg"
                    className="flex items-center gap-3 bg-white/80 backdrop-blur-sm hover:bg-white border-neutral-200 hover:border-neutral-300 px-8 py-4 text-base shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <ArrowUp className="h-5 w-5" />
                    Volver al Inicio
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
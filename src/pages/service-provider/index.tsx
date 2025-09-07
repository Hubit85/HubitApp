import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, ArrowRight, Zap, Paintbrush, Grid, Droplet, Thermometer } from "lucide-react";
import Link from 'next/link';
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/layout/Header";
import ZoomableSection from "@/components/ZoomableSection";

export default function ServiceProviderHome() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleDashboardClick = () => {
    router.push('/service-provider/dashboard');
  };
  
  return (
    <>
      <Head>
        <title>{t("serviceProviderPortal")} | {t("hubit")}</title>
        <meta name="description" content={t("serviceProviderDesc")} />
      </Head>
      
      <Header />
      
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-16">
        <ZoomableSection className="min-h-screen" enableZoom={true} maxScale={3} minScale={0.5}>
          <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-blue-900 mb-4">{t("serviceProviderPortal")}</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Encuentra nuevas oportunidades de negocio y gestiona tus cotizaciones de manera eficiente
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50">
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-800 flex items-center gap-2">
                    <Wrench className="h-6 w-6" />
                    Panel de Control Inteligente
                  </CardTitle>
                  <CardDescription>
                    Gestión completa de solicitudes de presupuesto y cotizaciones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-800 font-medium">Notificaciones automáticas de nuevas solicitudes</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-blue-800 font-medium">Filtrado inteligente por categorías de servicio</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <span className="text-purple-800 font-medium">Gestión avanzada de cotizaciones y seguimiento</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href='/service-provider/dashboard' passHref>
                    <Button 
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3"
                      onClick={handleDashboardClick}
                    >
                      Abrir Dashboard Inteligente <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-amber-200 bg-gradient-to-br from-white to-amber-50">
                <CardHeader>
                  <CardTitle className="text-2xl text-amber-800 flex items-center gap-2">
                    <Wrench className="h-6 w-6" />
                    Perfil de Servicios
                  </CardTitle>
                  <CardDescription>
                    Configura tus especialidades y áreas de cobertura
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-amber-800 font-medium">Define tus categorías de servicios especializados</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-orange-800 font-medium">Establece tu área de cobertura geográfica</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-yellow-800 font-medium">Configura tarifas y tiempos de respuesta</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 border-2 border-amber-300 text-amber-700 hover:bg-amber-50 font-semibold py-3"
                  >
                    Configurar Perfil <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border border-neutral-200">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Categorías de Servicios Populares</h2>
              <p className="text-center text-gray-600 mb-8">
                Estas son las categorías más demandadas por los clientes en la plataforma
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {[
                  { name: "Fontanería", icon: <Droplet className="h-8 w-8" />, color: "from-blue-500 to-cyan-500" },
                  { name: "Electricidad", icon: <Zap className="h-8 w-8" />, color: "from-yellow-500 to-amber-500" },
                  { name: "Pintura", icon: <Paintbrush className="h-8 w-8" />, color: "from-purple-500 to-pink-500" },
                  { name: "Suelos", icon: <Grid className="h-8 w-8" />, color: "from-green-500 to-emerald-500" },
                  { name: "Climatización", icon: <Thermometer className="h-8 w-8" />, color: "from-red-500 to-orange-500" },
                  { name: "Reparaciones", icon: <Wrench className="h-8 w-8" />, color: "from-gray-500 to-neutral-500" },
                ].map((category, index) => (
                  <div 
                    key={index}
                    className="group flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-neutral-50 to-white hover:from-white hover:to-neutral-50 border border-neutral-200 hover:border-neutral-300 transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${category.color} text-white mb-3 group-hover:scale-110 transition-transform duration-200`}>
                      {category.icon}
                    </div>
                    <span className="text-gray-800 font-semibold text-center">{category.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* New Features Highlight */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg p-8 text-white">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">🚀 Sistema de Notificaciones Inteligentes</h2>
                <p className="text-lg mb-6 text-green-100">
                  Recibe automáticamente las solicitudes de presupuesto que mejor se adapten a tus servicios
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <div className="text-2xl mb-2">🎯</div>
                    <h3 className="font-semibold mb-2">Filtrado Inteligente</h3>
                    <p className="text-sm text-green-100">Solo recibes solicitudes que coinciden con tus especialidades y área de cobertura</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <div className="text-2xl mb-2">⚡</div>
                    <h3 className="font-semibold mb-2">Respuesta Rápida</h3>
                    <p className="text-sm text-green-100">Interfaz optimizada para crear y enviar cotizaciones en minutos</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <div className="text-2xl mb-2">📊</div>
                    <h3 className="font-semibold mb-2">Seguimiento Completo</h3>
                    <p className="text-sm text-green-100">Monitorea el estado de todas tus cotizaciones desde un panel unificado</p>
                  </div>
                </div>
                <Link href='/service-provider/dashboard' passHref>
                  <Button 
                    size="lg"
                    className="bg-white text-green-600 hover:bg-green-50 font-semibold px-8 py-3"
                  >
                    ¡Empezar Ahora! <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </ZoomableSection>
      </main>
    </>
  );
}
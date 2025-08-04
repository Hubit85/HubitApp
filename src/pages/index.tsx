import React from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, Wrench, Star, Heart, CreditCard, Coins, Wallet, ArrowRight, CheckCircle, Zap, Gift } from "lucide-react";
import ZoomableSection from "@/components/ZoomableSection";
import Image from "next/image";

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
        <ZoomableSection className="w-full" enableZoom={true} maxScale={3} minScale={0.5}>
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
              <div className="flex items-center justify-center gap-4">
                <svg 
                  width="64" 
                  height="64" 
                  viewBox="0 0 100 100" 
                  className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0"
                  fill="white"
                >
                  {/* Casa principal */}
                  <path d="M20 45 L50 20 L80 45 L80 75 L20 75 Z" fill="white" />
                  
                  {/* Techo triangular */}
                  <path d="M15 45 L50 15 L85 45 L80 45 L50 20 L20 45 Z" fill="white" />
                  
                  {/* Puerta */}
                  <rect x="42" y="60" width="16" height="15" fill="black" />
                  
                  {/* Ventanas */}
                  <rect x="28" y="35" width="8" height="8" fill="black" />
                  <rect x="64" y="35" width="8" height="8" fill="black" />
                  <rect x="28" y="50" width="8" height="8" fill="black" />
                  <rect x="64" y="50" width="8" height="8" fill="black" />
                  
                  {/* Dientes de llave (parte inferior) */}
                  <rect x="25" y="75" width="4" height="6" fill="white" />
                  <rect x="32" y="75" width="4" height="10" fill="white" />
                  <rect x="39" y="75" width="4" height="4" fill="white" />
                  <rect x="61" y="75" width="4" height="8" fill="white" />
                  <rect x="68" y="75" width="4" height="5" fill="white" />
                  <rect x="75" y="75" width="4" height="12" fill="white" />
                </svg>
                <h1 className="text-6xl md:text-7xl font-bold text-white drop-shadow-lg">
                  {t("hubit")}
                </h1>
              </div>
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
                    <p className="text-gray-600 text-center mb-4">
                      {t("forAdministratorsText")}
                    </p>
                    <div className="text-center">
                      <Button asChild className="w-full">
                        <Link href="/administrador-fincas">{t("accessAdministratorPanel")}</Link>
                      </Button>
                    </div>
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
                    <p className="text-gray-600 text-center mb-4">
                      {t("forServiceCompaniesText")}
                    </p>
                    <div className="text-center">
                      <Button asChild className="w-full">
                        <Link href="/service-provider">{t("accessProviderPanel")}</Link>
                      </Button>
                    </div>
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
                    <p className="text-gray-600 text-center mb-4">
                      {t("forNeighborsText")}
                    </p>
                    <div className="space-y-2">
                      <Button asChild className="w-full">
                        <Link href="/property-selection?userType=community">Miembro de la Comunidad</Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/property-selection?userType=particular">Particular</Link>
                      </Button>
                    </div>
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

          {/* Sistema de Pagos Híbrido Section */}
          <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {t("paymentSystemTitle")}
                </h2>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                  {t("paymentSystemIntro")}
                </p>
              </div>

              {/* Métodos de Pago */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {/* FIAT */}
                <Card className="h-full border-2 border-blue-200 hover:border-blue-400 transition-colors">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                      <CreditCard className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {t("fiatCurrencies")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center mb-4">
                      {t("fiatDescription")}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Tarjetas de Crédito/Débito</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Transferencias Bancarias</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Efectivo</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Criptomonedas */}
                <Card className="h-full border-2 border-purple-200 hover:border-purple-400 transition-colors">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center">
                      <Coins className="h-8 w-8 text-purple-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {t("cryptocurrencies")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center mb-4">
                      {t("cryptoDescription")}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <CheckCircle className="h-4 w-4 text-orange-500" />
                        <span>{t("bitcoin")}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                        <span>{t("ethereum")}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <CheckCircle className="h-4 w-4 text-yellow-500" />
                        <span>{t("binanceCoin")}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <CheckCircle className="h-4 w-4 text-purple-500" />
                        <span>{t("solana")}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* HBIT Token */}
                <Card className="h-full border-2 border-green-200 hover:border-green-400 transition-colors bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
                      <Star className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {t("hubitToken")}
                    </CardTitle>
                    <div className="text-sm font-mono bg-green-200 text-green-800 px-3 py-1 rounded-full inline-block mt-2">
                      HBIT
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center mb-4">
                      {t("hbitDescription")}
                    </p>
                    <div className="text-center">
                      <div className="text-sm text-green-600 font-semibold">
                        Red Solana
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tipos de Pagos Soportados */}
              <div className="bg-white rounded-lg p-8 shadow-lg mb-16">
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                  {t("acceptedPayments")}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-lg font-semibold text-blue-600 mb-2">P2P</div>
                    <div className="text-sm text-gray-600">{t("p2pPayments")}</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-lg font-semibold text-green-600 mb-2">P2B</div>
                    <div className="text-sm text-gray-600">{t("p2bPayments")}</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-lg font-semibold text-purple-600 mb-2">B2P</div>
                    <div className="text-sm text-gray-600">{t("b2pPayments")}</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-lg font-semibold text-orange-600 mb-2">B2B</div>
                    <div className="text-sm text-gray-600">{t("b2bPayments")}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cómo Comprar HBIT Section */}
          <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {t("howToBuyHbitTitle")}
                </h2>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                  {t("howToBuyHbitIntro")}
                </p>
              </div>

              {/* Pasos para comprar HBIT */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {/* Paso 1 - Configura billetera Solana */}
                <div className="relative">
                  <Card 
                    className="h-full border-2 border-blue-200 hover:border-blue-400 transition-colors cursor-pointer transform hover:scale-105 transition-transform"
                    onClick={() => window.open("https://phantom.com", "_blank")}
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 relative">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                          <Wallet className="h-10 w-10 text-blue-600" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          1
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        Configura una billetera Solana
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-center mb-4">
                        Descarga e instala Phantom Wallet para gestionar tus tokens SOL y HBIT de forma segura.
                      </p>
                      <div className="text-center relative w-full h-32">
                        <Image 
                          src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                          alt="Wallet Setup" 
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                        />
                      </div>
                      <div className="text-center mt-4">
                        <span className="text-sm text-blue-600 font-medium">Haz clic para ir a Phantom →</span>
                      </div>
                    </CardContent>
                  </Card>
                  {/* Arrow */}
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-8 w-8 text-gray-400" />
                  </div>
                </div>

                {/* Paso 2 - Adquiere SOL */}
                <div className="relative">
                  <Card 
                    className="h-full border-2 border-green-200 hover:border-green-400 transition-colors cursor-pointer transform hover:scale-105 transition-transform"
                    onClick={() => window.open("https://phantom.com/learn/crypto-101/where-and-how-to-buy-solana-SOL", "_blank")}
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 relative">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                          <CreditCard className="h-10 w-10 text-green-600" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          2
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        Adquiere SOL
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-center mb-4">
                        Compra tokens SOL a través de exchanges o directamente en tu billetera Phantom.
                      </p>
                      <div className="text-center relative w-full h-32">
                        <Image 
                          src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                          alt="Buy SOL" 
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                        />
                      </div>
                      <div className="text-center mt-4">
                        <span className="text-sm text-green-600 font-medium">Haz clic para aprender a comprar SOL →</span>
                      </div>
                    </CardContent>
                  </Card>
                  {/* Arrow */}
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-8 w-8 text-gray-400" />
                  </div>
                </div>

                {/* Paso 3 - Intercambia SOL por HBIT */}
                <div className="relative">
                  <Card 
                    className="h-full border-2 border-purple-200 hover:border-purple-400 transition-colors cursor-pointer transform hover:scale-105 transition-transform"
                    onClick={() => window.open("https://gmgn.ai/trend?chain=sol", "_blank")}
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 relative">
                        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                          <Coins className="h-10 w-10 text-purple-600" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          3
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        Intercambia SOL por HBIT
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-center mb-4">
                        Utiliza un DEX como GMGN para intercambiar tus tokens SOL por HBIT de forma descentralizada.
                      </p>
                      <div className="text-center relative w-full h-32">
                        <Image 
                          src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                          alt="DEX Trading" 
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                        />
                      </div>
                      <div className="text-center mt-4">
                        <span className="text-sm text-purple-600 font-medium">Haz clic para intercambiar →</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Beneficios de HBIT */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-8">
                <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">
                  {t("hbitBenefits")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
                      <Gift className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t("benefit1")}</h4>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                      <Zap className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t("benefit2")}</h4>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center">
                      <Star className="h-8 w-8 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t("benefit3")}</h4>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center">
                      <Heart className="h-8 w-8 text-orange-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t("benefit4")}</h4>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-12">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      size="lg" 
                      className="text-lg px-8 py-6 bg-green-600 text-white hover:bg-green-700"
                    >
                      {t("startUsingHbit")}
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="text-lg px-8 py-6 border-green-600 text-green-600 hover:bg-green-50"
                    >
                      {t("learnMore")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ZoomableSection>
      </main>
    </>
  );
}

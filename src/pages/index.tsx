import React from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, Wrench, Star, CreditCard, Coins, Wallet, ArrowRight, CheckCircle, Zap, Gift, Crown } from "lucide-react";
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
                <h1 className="text-6xl md:text-7xl font-bold text-white drop-shadow-lg">
                  {t("hubit")}
                </h1>
              </div>
              <p className="text-xl md:text-2xl text-white drop-shadow-md">
                {t("professionalServices")}
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
                      <Star className="h-8 w-8 text-blue-600" />
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

          {/* Sistema de Pagos Híbrido Section */}
          <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {t("paymentSystemTitle")}
                </h2>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-4">
                  {t("paymentSystemIntro")}
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-4xl mx-auto">
                  <p className="text-amber-800 font-medium text-lg">
                    📋 <strong>Importante:</strong> Los pagos con criptomonedas son exclusivamente para suscripciones y funciones premium de la aplicación. Los servicios profesionales se pagan con métodos tradicionales (EUR) según la normativa española.
                  </p>
                </div>
              </div>

              {/* Métodos de Pago */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {/* FIAT - Para servicios */}
                <Card className="h-full border-2 border-blue-200 hover:border-blue-400 transition-colors">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                      <CreditCard className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {t("fiatCurrencies")}
                    </CardTitle>
                    <div className="text-sm font-mono bg-blue-200 text-blue-800 px-3 py-1 rounded-full inline-block mt-2">
                      Para servicios profesionales
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center mb-4">
                      Todos los servicios profesionales (limpieza, mantenimiento, reparaciones) se pagan exclusivamente en euros según la normativa española.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{t("creditDebitCards")}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{t("bankTransfers")}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{t("cash")}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Criptomonedas - Solo para app */}
                <Card className="h-full border-2 border-purple-200 hover:border-purple-400 transition-colors">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center">
                      <Coins className="h-8 w-8 text-purple-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {t("cryptocurrencies")}
                    </CardTitle>
                    <div className="text-sm font-mono bg-purple-200 text-purple-800 px-3 py-1 rounded-full inline-block mt-2">
                      Solo para usar la app
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center mb-4">
                      Las criptomonedas se utilizan únicamente para suscripciones premium, funciones avanzadas y tokens de recompensa de la plataforma.
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

                {/* HBIT Token - Recompensas y suscripciones */}
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
                      Token nativo para suscripciones premium, recompensas por valoraciones y acceso a funciones exclusivas de la plataforma.
                    </p>
                    <div className="text-center">
                      <div className="text-sm text-green-600 font-semibold">
                        {t("solanaNetwork")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tipos de Pagos Soportados */}
              <div className="bg-white rounded-lg p-8 shadow-lg mb-16">
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                  Separación de Pagos por Uso
                </h3>
                <p className="text-gray-600 text-center mb-8">
                  HuBiT mantiene una clara separación entre pagos para servicios profesionales (EUR) y funciones de la aplicación (cripto)
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Servicios Profesionales (EUR)
                    </h4>
                    <ul className="space-y-2 text-blue-700">
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-blue-600" />Limpieza y mantenimiento</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-blue-600" />Reparaciones y obras</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-blue-600" />Servicios de jardinería</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-blue-600" />Administración de fincas</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                      <Coins className="h-5 w-5 mr-2" />
                      Funciones de la App (Cripto)
                    </h4>
                    <ul className="space-y-2 text-purple-700">
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-purple-600" />Suscripciones premium</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-purple-600" />Tokens de recompensa</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-purple-600" />Funciones avanzadas</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-purple-600" />Acceso a valoraciones premium</li>
                    </ul>
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
                        {t("setupSolanaWallet")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-center mb-4">
                        {t("downloadPhantomWallet")}
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
                        <span className="text-sm text-blue-600 font-medium">{t("clickToPhantom")}</span>
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
                        {t("acquireSOL")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-center mb-4">
                        {t("buySOLTokens")}
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
                        <span className="text-sm text-green-600 font-medium">{t("clickToLearnBuySOL")}</span>
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
                        {t("swapSOLForHBIT")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-center mb-4">
                        {t("useDecentralizedExchange")}
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
                        <span className="text-sm text-purple-600 font-medium">{t("clickToSwap")}</span>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
                      <Gift className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t("benefit1")}</h4>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                      <Crown className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t("benefit2")}</h4>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center">
                      <Star className="h-8 w-8 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t("benefit3")}</h4>
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
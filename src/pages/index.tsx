
import React from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, Wrench, Star, CreditCard, Coins, Wallet, ArrowRight, CheckCircle, Zap, Gift, Crown, Sparkles, TrendingUp, Shield, Globe } from "lucide-react";
import ZoomableSection from "@/components/ZoomableSection";
import Image from "next/image";
import SupabaseStatus from "@/components/SupabaseStatus";

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
      
      <main className="flex flex-col items-center justify-center relative overflow-hidden">
        <ZoomableSection className="w-full" enableZoom={true} maxScale={3} minScale={0.5}>
          {/* Hero Section with Enhanced Visual Design */}
          <section className="min-h-screen w-full flex flex-col items-center justify-center relative">
            {/* Background with animated gradient overlay */}
            <div className="absolute inset-0 z-0">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
                  backgroundSize: "cover",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/70" />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-purple-900/20" />
            </div>
            
            {/* Floating orbs for visual interest */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-32 right-16 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl animate-pulse delay-500" />
            
            <div className="z-10 text-center space-y-8 px-4 sm:px-6 max-w-5xl relative">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="relative">
                  <h1 className="text-6xl md:text-8xl font-black text-white drop-shadow-2xl tracking-tight">
                    {t("hubit")}
                  </h1>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce delay-300" />
                </div>
              </div>
              
              <div className="space-y-6">
                <p className="text-2xl md:text-3xl text-white/95 drop-shadow-lg font-light leading-relaxed">
                  {t("professionalServices")}
                </p>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400 mx-auto rounded-full" />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
                <Button 
                  size="lg" 
                  className="group relative text-lg px-10 py-6 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 text-white border-0 rounded-xl shadow-2xl shadow-blue-900/50 hover:shadow-blue-800/60 transition-all duration-500 hover:-translate-y-1 hover:scale-105 overflow-hidden"
                  asChild
                >
                  <Link href="/auth/register">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    {t("register")}
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="group text-lg px-10 py-6 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 rounded-xl backdrop-blur-sm shadow-2xl hover:shadow-white/20 transition-all duration-500 hover:-translate-y-1 hover:scale-105"
                  asChild
                >
                  <Link href="/auth/login">
                    <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    {t("login")}
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Supabase Status Section */}
          <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900 relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
            </div>
            
            <div className="max-w-7xl mx-auto relative">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-emerald-400 font-semibold tracking-wider uppercase text-sm">Estado del Sistema</span>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-300" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Integración con Supabase
                </h2>
                <p className="text-neutral-300 text-lg max-w-2xl mx-auto">
                  Monitoreo en tiempo real del estado de la base de datos y servicios backend
                </p>
              </div>
              
              <div className="flex justify-center">
                <SupabaseStatus />
              </div>
            </div>
          </section>

          {/* Enhanced Who We Are Section */}
          <section className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-neutral-50 to-white relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100 via-transparent to-purple-100" />
            </div>
            
            <div className="max-w-7xl mx-auto relative">
              <div className="text-center mb-20">
                <div className="inline-flex items-center gap-3 mb-8">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">{t("knowHubit")}</span>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300" />
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-neutral-900 mb-8 leading-tight">
                  {t("whoWeAreTitle")}
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
              </div>

              <div className="max-w-6xl mx-auto space-y-12">
                <div className="text-center">
                  <p className="text-2xl text-neutral-700 leading-relaxed font-light">
                    {t("whoWeAreIntro")}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Mission Card */}
                  <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-indigo-50">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="text-center pb-4">
                      <div className="mx-auto mb-6 relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 rotate-3 group-hover:rotate-0">
                          <Star className="h-10 w-10 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-neutral-900 mb-4">{t("ourMission")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-neutral-700 leading-relaxed text-center">
                        {t("ourMissionText")}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Ecosystem Card */}
                  <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 bg-gradient-to-br from-emerald-50 to-green-50">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="text-center pb-4">
                      <div className="mx-auto mb-6 relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 -rotate-3 group-hover:rotate-0">
                          <Globe className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-2xl font-bold text-neutral-900 mb-4">{t("ourEcosystem")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-neutral-700 leading-relaxed text-center">
                        {t("ourEcosystemText")}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Values Card */}
                  <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 bg-gradient-to-br from-amber-50 to-orange-50">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="text-center pb-4">
                      <div className="mx-auto mb-6 relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 rotate-3 group-hover:rotate-0">
                          <Shield className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-2xl font-bold text-neutral-900 mb-4">{t("ourFundamentalValue")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-neutral-700 leading-relaxed text-center">
                        {t("ourFundamentalValueText")}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced How It Works Section */}
          <section className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-neutral-100 to-neutral-50 relative">
            <div className="absolute inset-0">
              <div className="absolute top-20 left-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-20 right-10 w-60 h-60 bg-purple-500/5 rounded-full blur-3xl" />
            </div>
            
            <div className="max-w-7xl mx-auto relative">
              <div className="text-center mb-20">
                <div className="inline-flex items-center gap-3 mb-8">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-emerald-600 font-semibold tracking-wider uppercase text-sm">{t("discoverTheProcess")}</span>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-300" />
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-neutral-900 mb-8">
                  {t("howItWorksTitle")}
                </h2>
                <p className="text-xl text-neutral-600 max-w-4xl mx-auto leading-relaxed">
                  {t("howItWorksIntro")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                {/* Administrators Card */}
                <Card className="group h-full relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 bg-gradient-to-br from-white to-blue-50/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="text-center pb-6 relative">
                    <div className="mx-auto mb-6 relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <Building className="h-12 w-12 text-white" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">1</span>
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-neutral-900">
                      {t("forAdministrators")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-700 text-center leading-relaxed">
                      {t("forAdministratorsText")}
                    </p>
                  </CardContent>
                </Card>

                {/* Service Companies Card */}
                <Card className="group h-full relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 bg-gradient-to-br from-white to-emerald-50/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="text-center pb-6 relative">
                    <div className="mx-auto mb-6 relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                        <Wrench className="h-12 w-12 text-white" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">2</span>
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-neutral-900">
                      {t("forServiceCompanies")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-700 text-center leading-relaxed">
                      {t("forServiceCompaniesText")}
                    </p>
                  </CardContent>
                </Card>

                {/* Neighbors Card */}
                <Card className="group h-full relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 bg-gradient-to-br from-white to-purple-50/30 md:col-span-2 lg:col-span-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="text-center pb-6 relative">
                    <div className="mx-auto mb-6 relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <Users className="h-12 w-12 text-white" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">3</span>
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-neutral-900">
                      {t("forNeighbors")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-700 text-center leading-relaxed">
                      {t("forNeighborsText")}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Rating System Highlight */}
              <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-yellow-50/50 to-orange-50/50">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5" />
                <CardContent className="p-12 text-center relative">
                  <div className="mx-auto mb-8 relative inline-block">
                    <div className="w-28 h-28 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl">
                      <Star className="h-14 w-14 text-white" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-4xl font-black text-neutral-900 mb-6">
                    {t("ratingsSystem")}
                  </h3>
                  <p className="text-xl text-neutral-700 max-w-4xl mx-auto leading-relaxed mb-8">
                    {t("ratingsSystemText")}
                  </p>
                  <div className="bg-gradient-to-r from-yellow-100 via-orange-100 to-yellow-100 rounded-2xl p-6">
                    <p className="text-xl text-neutral-800 font-medium max-w-5xl mx-auto leading-relaxed">
                      {t("virtuousCircle")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Continue with rest of sections... */}
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
                    📋 <strong>{t("importantNote")}:</strong> {t("cryptoExclusiveNote")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <Card className="h-full border-2 border-blue-200 hover:border-blue-400 transition-colors">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                      <CreditCard className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {t("fiatCurrencies")}
                    </CardTitle>
                    <div className="text-sm font-mono bg-blue-200 text-blue-800 px-3 py-1 rounded-full inline-block mt-2">
                      {t("forProfessionalServices")}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center mb-4">
                      {t("professionalServicesNote")}
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

                <Card className="h-full border-2 border-purple-200 hover:border-purple-400 transition-colors">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center">
                      <Coins className="h-8 w-8 text-purple-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {t("cryptocurrencies")}
                    </CardTitle>
                    <div className="text-sm font-mono bg-purple-200 text-purple-800 px-3 py-1 rounded-full inline-block mt-2">
                      {t("onlyForApp")}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center mb-4">
                      {t("appOnlyNote")}
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
                      {t("nativeToken")}
                    </p>
                    <div className="text-center">
                      <div className="text-sm text-green-600 font-semibold">
                        {t("solanaNetwork")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-lg mb-16">
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                  {t("paymentSeparationByUse")}
                </h3>
                <p className="text-gray-600 text-center mb-8">
                  {t("paymentSeparationDescription")}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      {t("professionalServicesEur")}
                    </h4>
                    <ul className="space-y-2 text-blue-700">
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-blue-600" />{t("cleaningAndMaintenance")}</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-blue-600" />{t("repairsAndWorks")}</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-blue-600" />{t("gardeningServices")}</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-blue-600" />{t("propertyAdministration")}</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                      <Coins className="h-5 w-5 mr-2" />
                      {t("appFunctionsCrypto")}
                    </h4>
                    <ul className="space-y-2 text-purple-700">
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-purple-600" />{t("premiumSubscriptions")}</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-purple-600" />{t("rewardTokens")}</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-purple-600" />{t("advancedFeatures")}</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-purple-600" />{t("premiumRatingsAccess")}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced HBIT Purchase Section */}
          <section className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-neutral-50 relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-100 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-100 to-transparent rounded-full blur-3xl" />
            </div>
            
            <div className="max-w-7xl mx-auto relative">
              <div className="text-center mb-20">
                <div className="inline-flex items-center gap-3 mb-8">
                  <Coins className="w-6 h-6 text-purple-600" />
                  <span className="text-purple-600 font-semibold tracking-wider uppercase text-sm">{t("acquireHbit")}</span>
                  <Coins className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-neutral-900 mb-8">
                  {t("howToBuyHbitTitle")}
                </h2>
                <p className="text-xl text-neutral-600 max-w-4xl mx-auto leading-relaxed">
                  {t("howToBuyHbitIntro")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                {[
                  {
                    step: 1,
                    icon: Wallet,
                    title: t("setupSolanaWallet"),
                    description: t("downloadPhantomWallet"),
                    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                    action: t("clickToPhantom"),
                    color: "blue" as "blue" | "green" | "purple",
                    url: "https://phantom.com"
                  },
                  {
                    step: 2,
                    icon: CreditCard,
                    title: t("acquireSOL"),
                    description: t("buySOLTokens"),
                    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                    action: t("clickToLearnBuySOL"),
                    color: "green" as "blue" | "green" | "purple",
                    url: "https://phantom.com/learn/crypto-101/where-and-how-to-buy-solana-SOL"
                  },
                  {
                    step: 3,
                    icon: Coins,
                    title: t("swapSOLForHBIT"),
                    description: t("useDecentralizedExchange"),
                    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                    action: t("clickToSwap"),
                    color: "purple" as "blue" | "green" | "purple",
                    url: "https://gmgn.ai/trend?chain=sol"
                  }
                ].map((step, index) => {
                  const colorClasses = {
                    blue: {
                      border: "border-blue-200 hover:border-blue-400",
                      bg: "from-blue-500 to-blue-700",
                      accent: "bg-blue-600",
                      text: "text-blue-600"
                    },
                    green: {
                      border: "border-emerald-200 hover:border-emerald-400",
                      bg: "from-emerald-500 to-emerald-700",
                      accent: "bg-emerald-600",
                      text: "text-emerald-600"
                    },
                    purple: {
                      border: "border-purple-200 hover:border-purple-400",
                      bg: "from-purple-500 to-purple-700",
                      accent: "bg-purple-600",
                      text: "text-purple-600"
                    }
                  }[step.color];

                  return (
                    <div key={index} className="relative">
                      <Card 
                        className={`group h-full ${colorClasses.border} transition-all duration-700 cursor-pointer hover:-translate-y-4 hover:shadow-2xl bg-gradient-to-br from-white to-neutral-50/50 overflow-hidden`}
                        onClick={() => window.open(step.url, "_blank")}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/0 to-neutral-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <CardHeader className="text-center pb-6 relative">
                          <div className="mx-auto mb-6 relative">
                            <div className={`w-24 h-24 bg-gradient-to-br ${colorClasses.bg} rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500`}>
                              <step.icon className="h-12 w-12 text-white" />
                            </div>
                            <div className={`absolute -top-3 -right-3 w-10 h-10 ${colorClasses.accent} text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg`}>
                              {step.step}
                            </div>
                          </div>
                          <CardTitle className="text-xl font-bold text-neutral-900 mb-4">
                            {step.title}
                          </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <p className="text-neutral-700 text-center leading-relaxed">
                            {step.description}
                          </p>
                          
                          <div className="relative h-32 overflow-hidden rounded-xl">
                            <Image 
                              src={step.image}
                              alt={step.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          </div>
                          
                          <div className="text-center pt-2">
                            <span className={`${colorClasses.text} font-semibold text-sm group-hover:text-neutral-800 transition-colors duration-300`}>
                              {step.action}
                            </span>
                            <ArrowRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Connection arrows */}
                      {index < 2 && (
                        <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                          <div className="w-8 h-0.5 bg-gradient-to-r from-neutral-300 to-neutral-400" />
                          <ArrowRight className="h-6 w-6 text-neutral-400 -mt-3 ml-1" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Benefits Section */}
              <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/10" />
                <CardContent className="p-12 relative">
                  <div className="text-center mb-12">
                    <h3 className="text-4xl font-black text-neutral-900 mb-6 flex items-center justify-center gap-4">
                      <TrendingUp className="w-10 h-10 text-emerald-600" />
                      {t("hbitBenefits")}
                      <Sparkles className="w-10 h-10 text-emerald-600" />
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { icon: Gift, title: t("benefit1"), color: "emerald" },
                      { icon: Crown, title: t("benefit2"), color: "blue" },
                      { icon: Star, title: t("benefit3"), color: "purple" }
                    ].map((benefit, index) => (
                      <div key={index} className="text-center group">
                        <div className="mx-auto mb-6 relative">
                          <div className={`w-20 h-20 bg-gradient-to-br from-${benefit.color}-500 to-${benefit.color}-700 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500`}>
                            <benefit.icon className="h-10 w-10 text-white" />
                          </div>
                        </div>
                        <h4 className="font-bold text-neutral-900 text-lg leading-relaxed">
                          {benefit.title}
                        </h4>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </ZoomableSection>
      </main>
    </>
  );
}
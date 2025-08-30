import { useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { Header } from "@/components/layout/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import EmailTemplateManager from "@/components/EmailTemplateManager";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Mail, Shield, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function EmailTemplatesPage() {
  const { t } = useLanguage();
  const { user, loading } = useSupabaseAuth();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-neutral-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <main className="container mx-auto px-4 md:px-6 lg:px-8 py-16 max-w-4xl">
          <Card className="bg-gradient-to-br from-white to-blue-50/30 border-blue-200/60 shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl flex items-center justify-center">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-neutral-900">
                Acceso Restringido
              </CardTitle>
              <CardDescription className="text-lg">
                Debes iniciar sesión para acceder a la gestión de plantillas de email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  Esta función está disponible solo para usuarios autenticados
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/auth/login">
                    <Shield className="h-4 w-4 mr-2" />
                    Iniciar Sesión
                  </Link>
                </Button>
                <Button variant="outline" asChild className="bg-transparent hover:bg-blue-50">
                  <Link href="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver al Inicio
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Head>
        <title>Gestión de Email Templates - HuBiT</title>
        <meta name="description" content="Gestiona y configura las plantillas de email para el sistema de autenticación de HuBiT" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        
        {/* Navigation */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4 text-neutral-600 hover:text-neutral-900">
            <Link href="/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al Dashboard
            </Link>
          </Button>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">
                Email Templates
              </h1>
              <p className="text-neutral-600">
                Gestiona las plantillas de email para el sistema de autenticación
              </p>
            </div>
          </div>
          
          {/* Info Banner */}
          <Alert className="border-blue-200 bg-blue-50">
            <Mail className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Información:</strong> Estas plantillas están diseñadas para ser usadas en Supabase Auth. 
              Copia el código HTML y pégalo en tu dashboard de Supabase para aplicar el diseño personalizado.
            </AlertDescription>
          </Alert>
        </div>

        {/* Main Content */}
        <EmailTemplateManager />
        
        {/* Footer Note */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-br from-neutral-50 to-white border-neutral-200/60">
            <CardContent className="py-6">
              <p className="text-sm text-neutral-600">
                <strong>Nota:</strong> Los cambios realizados aquí son solo para previsualización. 
                Para aplicar las plantillas, debes configurarlas directamente en tu proyecto de Supabase.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

// Server-side authentication check (optional enhancement)
export const getServerSideProps: GetServerSideProps = async (context) => {
  // You could add server-side auth checks here if needed
  return {
    props: {}
  };
};

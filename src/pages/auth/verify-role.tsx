
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { SupabaseUserRoleService } from "@/services/SupabaseUserRoleService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, UserCheck, ArrowRight, Home } from "lucide-react";

export default function VerifyRolePage() {
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    role?: any;
  } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const { user, loading } = useSupabaseAuth();
  const router = useRouter();

  useEffect(() => {
    // Obtener token de la URL
    const urlToken = router.query.token as string;
    if (urlToken) {
      setToken(urlToken);
    }
  }, [router.query]);

  useEffect(() => {
    // Auto-verificar cuando tenemos el token y el usuario está autenticado
    if (token && user && !verifying && !result) {
      handleVerifyRole();
    }
  }, [token, user, verifying, result]);

  const handleVerifyRole = async () => {
    if (!token) {
      setResult({
        success: false,
        message: "No se encontró el token de verificación en la URL"
      });
      return;
    }

    setVerifying(true);

    try {
      const response = await SupabaseUserRoleService.verifyRole(token);
      setResult(response);

      // Si fue exitoso, redirigir después de un momento
      if (response.success) {
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      }

    } catch (error) {
      console.error("Error verifying role:", error);
      setResult({
        success: false,
        message: "Error inesperado al verificar el rol"
      });
    } finally {
      setVerifying(false);
    }
  };

  // Pantalla de carga durante verificación auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-neutral-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Redirigir si no hay usuario autenticado
  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/70 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <XCircle className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-neutral-900">
              Sesión Requerida
            </CardTitle>
            <CardDescription>
              Debes iniciar sesión para verificar tu rol
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3">
              <Link href="/auth/login">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600">
                  Iniciar Sesión
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Volver al Inicio
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Verificar Rol - HuBiT</title>
        <meta name="description" content="Verifica tu nuevo rol en HuBiT" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute top-10 right-10 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-cyan-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-purple-200/20 rounded-full blur-2xl animate-pulse delay-500" />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 tracking-tight">
                HuBiT
              </h1>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce" />
            </div>
          </div>

          {/* Verification Card */}
          <Card className="w-full max-w-lg bg-white/70 backdrop-blur-lg border-white/20 shadow-2xl shadow-neutral-900/10">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                verifying 
                  ? "bg-gradient-to-br from-blue-500 to-cyan-600" 
                  : result?.success 
                    ? "bg-gradient-to-br from-green-500 to-emerald-600" 
                    : result
                      ? "bg-gradient-to-br from-red-500 to-orange-600"
                      : "bg-gradient-to-br from-blue-500 to-cyan-600"
              }`}>
                {verifying ? (
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                ) : result?.success ? (
                  <CheckCircle className="h-8 w-8 text-white" />
                ) : result ? (
                  <XCircle className="h-8 w-8 text-white" />
                ) : (
                  <UserCheck className="h-8 w-8 text-white" />
                )}
              </div>
              
              <div>
                <CardTitle className="text-2xl font-bold text-neutral-900">
                  {verifying 
                    ? "Verificando Rol..." 
                    : result?.success 
                      ? "¡Rol Verificado!" 
                      : result 
                        ? "Error en Verificación"
                        : "Verificar Rol"
                  }
                </CardTitle>
                <CardDescription className="text-neutral-600">
                  {verifying 
                    ? "Por favor espera mientras procesamos tu solicitud" 
                    : result?.success 
                      ? "Tu nuevo rol ha sido activado correctamente" 
                      : result 
                        ? "Hubo un problema con la verificación"
                        : "Verificando tu nuevo rol de usuario"
                  }
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {result && (
                <Alert className={`border-2 ${
                  result.success 
                    ? "border-green-200 bg-green-50" 
                    : "border-red-200 bg-red-50"
                }`}>
                  <AlertDescription className={`font-medium ${
                    result.success ? "text-green-800" : "text-red-800"
                  }`}>
                    {result.message}
                  </AlertDescription>
                </Alert>
              )}

              {verifying && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200" />
                  </div>
                  <p className="text-center text-sm text-neutral-600">
                    Procesando verificación de rol...
                  </p>
                </div>
              )}

              {result?.success && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-800">¡Éxito!</p>
                        <p className="text-sm text-green-700">
                          Serás redirigido automáticamente en unos segundos...
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Link href="/dashboard">
                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600">
                      Ir al Dashboard
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}

              {result && !result.success && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-3">
                      <XCircle className="h-6 w-6 text-red-600" />
                      <div>
                        <p className="font-semibold text-red-800">Error de Verificación</p>
                        <p className="text-sm text-red-700">
                          El enlace puede haber expirado o ser inválido
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <Link href="/dashboard">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600">
                        Ir al Dashboard
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <Link href="/">
                      <Button variant="outline" className="w-full">
                        <Home className="w-4 h-4 mr-2" />
                        Volver al Inicio
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {!token && !verifying && !result && (
                <div className="space-y-4">
                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertDescription className="text-orange-800">
                      No se encontró un token de verificación válido en la URL. Por favor, utiliza el enlace completo de tu email de verificación.
                    </AlertDescription>
                  </Alert>
                  
                  <Link href="/dashboard">
                    <Button className="w-full" variant="outline">
                      <Home className="w-4 h-4 mr-2" />
                      Volver al Dashboard
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500 max-w-md">
              ¿Necesitas ayuda?{" "}
              <Link href="/help" className="text-blue-600 hover:underline">
                Contacta con soporte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}


import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Sparkles, AlertTriangle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn, user, session, loading, isConnected } = useSupabaseAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user && session) {
      console.log("🔄 User detected in login page, redirecting to dashboard...", {
        userId: user.id,
        email: user.email,
        hasSession: !!session
      });
      router.push("/dashboard");
    }
  }, [user, session, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("🔑 Starting login attempt...");
      const result = await signIn(email, password);
      
      if (result.error) {
        console.error("❌ Login failed:", result.error);
        setError(result.error);
      } else {
        console.log("✅ Login successful, redirecting...");
        // Successful login - redirect will happen via useEffect
        await router.push("/dashboard");
      }
    } catch (err) {
      console.error("❌ Login exception:", err);
      
      let errorMessage = "Error inesperado durante el inicio de sesión";
      
      if (err instanceof Error) {
        if (err.message.includes('fetch') || err.message.includes('network')) {
          errorMessage = "Error de conexión. Verifica tu internet e intenta nuevamente.";
        } else if (err.message.includes('timeout')) {
          errorMessage = "La conexión tardó demasiado tiempo. Intenta nuevamente.";
        } else {
          errorMessage = `Error: ${err.message}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-stone-600 mx-auto mb-4" />
          <p className="text-stone-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Iniciar Sesión - HuBiT</title>
        <meta name="description" content="Inicia sesión en HuBiT para acceder a tu cuenta" />
      </Head>

      <div className="min-h-screen bg-gray-50 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 py-12">
          {/* Header with HuBiT Logo matching register page */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative w-16 h-16 transition-transform duration-200 hover:scale-105 overflow-hidden">
                <Image
                  src="/HuBiT logo.png"
                  alt="HuBiT Logo"
                  fill
                  className="object-cover object-left"
                  priority
                />
              </div>
              <div className="flex flex-col items-start">
                <h1 className="text-4xl md:text-5xl font-bold text-black tracking-wide">
                  HuBiT
                </h1>
                <p className="text-lg text-stone-600 font-medium">
                  Hub de servicios comunitarios
                </p>
              </div>
            </div>
            <p className="text-xl text-stone-600 font-light">
              Bienvenido de vuelta
            </p>
          </div>

          {/* Connection Status Indicator - Only show if there are connection issues */}
          {!isConnected && (
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                <AlertTriangle className="h-4 w-4" />
                Conectividad limitada
              </div>
            </div>
          )}

          {/* Login Card - matching register design exactly */}
          <Card className="w-full max-w-2xl bg-white border-stone-200 shadow-2xl shadow-stone-900/10">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="mx-auto w-16 h-16 bg-stone-800 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-black">
                  Iniciar Sesión
                </CardTitle>
                <CardDescription className="text-stone-600">
                  Accede a tu cuenta de HuBiT
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Login Error Alert */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-stone-700">
                    Correo electrónico *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="pl-10 h-12 bg-white border-stone-200 focus:border-stone-800 focus:ring-stone-800/20"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-stone-700">
                    Contraseña *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-12 bg-white border-stone-200 focus:border-stone-800 focus:ring-stone-800/20"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-stone-800 hover:bg-stone-900 text-white border-0 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none h-12"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Iniciar Sesión
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Connection notice for offline mode */}
              {!isConnected && (
                <div className="text-center">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Modo de conectividad limitada</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>• La aplicación funciona con datos locales</p>
                      <p>• Algunas funciones pueden estar limitadas</p>
                      <p>• La conectividad se restaurará automáticamente</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Register Link - matching register page format */}
          <div className="mt-8 text-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-stone-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-50 px-2 text-stone-500">¿Nuevo en HuBiT?</span>
              </div>
            </div>
            <Link 
              href="/auth/register"
              className="group inline-flex items-center text-stone-800 hover:text-black font-medium transition-colors"
            >
              Crear una cuenta
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Footer - exactly matching register page */}
          <div className="mt-6 text-center">
            <p className="text-sm text-stone-500 max-w-md">
              Al iniciar sesión, aceptas nuestros{" "}
              <Link href="/terms" className="text-stone-800 hover:underline">
                Términos de Servicio
              </Link>{" "}
              y{" "}
              <Link href="/privacy" className="text-stone-800 hover:underline">
                Política de Privacidad
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn, user, loading } = useSupabaseAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn(email, password);
      
      if (result.error) {
        setError(result.error);
      } else {
        // Successful login - redirect will happen via useEffect
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Error inesperado durante el inicio de sesión");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-neutral-600">Verificando sesión...</p>
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

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-emerald-200/20 rounded-full blur-2xl animate-pulse delay-500" />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 tracking-tight">
                HuBiT
              </h1>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce" />
            </div>
            <p className="text-xl text-neutral-600 font-light">
              Bienvenido de vuelta
            </p>
          </div>

          {/* Login Card */}
          <Card className="w-full max-w-md bg-white/70 backdrop-blur-lg border-white/20 shadow-2xl shadow-neutral-900/10">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-neutral-900">
                  Iniciar Sesión
                </CardTitle>
                <CardDescription className="text-neutral-600">
                  Accede a tu cuenta de HuBiT
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-neutral-700">
                    Correo electrónico
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="pl-10 h-12 bg-white/50 border-neutral-200 focus:border-blue-500 focus:ring-blue-500/20"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-neutral-700">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-12 bg-white/50 border-neutral-200 focus:border-blue-500 focus:ring-blue-500/20"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 text-white border-0 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
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

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-neutral-500">¿Nuevo en HuBiT?</span>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <Link 
                  href="/auth/register"
                  className="group inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Crear una cuenta
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500">
              Al iniciar sesión, aceptas nuestros{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Términos de Servicio
              </Link>{" "}
              y{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Política de Privacidad
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

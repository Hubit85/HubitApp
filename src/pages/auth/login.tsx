
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
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Sparkles, AlertTriangle, RefreshCw, Wifi, WifiOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error' | 'offline'>('checking');
  const [retryAttempt, setRetryAttempt] = useState(0);

  const { signIn, user, loading } = useSupabaseAuth();
  const router = useRouter();

  // Check connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setConnectionStatus('checking');
        
        // Simple connectivity test
        const response = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/', {
          method: 'GET',
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok || response.status === 404) {
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('error');
        }
      } catch (error) {
        console.warn('Connection check failed:', error);
        setConnectionStatus('offline');
      }
    };

    checkConnection();
    
    // Recheck every 30 seconds if there's a connection issue
    const interval = setInterval(() => {
      if (connectionStatus === 'error' || connectionStatus === 'offline') {
        checkConnection();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [connectionStatus, retryAttempt]);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleRetryConnection = () => {
    setRetryAttempt(prev => prev + 1);
    setError("");
    setConnectionStatus('checking');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Check if we have basic connectivity
    if (connectionStatus === 'offline' || connectionStatus === 'error') {
      setError("Sin conexión a internet o problemas con el servidor. Verifica tu conexión e intenta nuevamente.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("🔑 Starting login attempt...");
      const result = await signIn(email, password);
      
      if (result.error) {
        console.error("❌ Login failed:", result.error);
        setError(result.error);
        
        // Specific error handling
        if (result.error.includes("conexión") || result.error.includes("internet")) {
          setConnectionStatus('error');
        }
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
          setConnectionStatus('error');
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

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'checking':
        return <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />;
      case 'connected':
        return <Wifi className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'offline':
        return <WifiOff className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'checking':
        return "Verificando conexión...";
      case 'connected':
        return "Conectado";
      case 'error':
        return "Error de servidor";
      case 'offline':
        return "Sin conexión";
      default:
        return "";
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

          {/* Connection Status */}
          <div className="mb-4">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
              connectionStatus === 'connected' 
                ? 'bg-green-100 text-green-800' 
                : connectionStatus === 'checking'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {getConnectionStatusIcon()}
              {getConnectionStatusText()}
            </div>
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
              {/* Connection Error Alert */}
              {(connectionStatus === 'error' || connectionStatus === 'offline') && (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-amber-800">
                    <div className="flex items-center justify-between">
                      <span>
                        {connectionStatus === 'offline' 
                          ? "Sin conexión a internet. Verifica tu conexión." 
                          : "Problemas de conectividad con el servidor."
                        }
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRetryConnection}
                        className="text-amber-700 hover:text-amber-800"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Reintentar
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Login Error Alert */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                    {error.includes("conexión") && (
                      <div className="mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRetryConnection}
                          className="text-red-700 hover:text-red-800"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Verificar conexión
                        </Button>
                      </div>
                    )}
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
                  disabled={isLoading || connectionStatus === 'offline' || connectionStatus === 'error'}
                  className={`w-full h-12 text-white border-0 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 ${
                    connectionStatus === 'connected'
                      ? "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : connectionStatus !== 'connected' ? (
                    <>
                      <WifiOff className="w-5 h-5 mr-2" />
                      Sin conexión
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

              {/* Diagnostic Info for Connection Issues */}
              {(connectionStatus === 'error' || connectionStatus === 'offline') && (
                <div className="text-center">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">¿Problemas para conectarte?</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>• Verifica tu conexión a internet</p>
                      <p>• Intenta recargar la página</p>
                      <p>• Si el problema persiste, contacta al soporte</p>
                    </div>
                  </div>
                </div>
              )}

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
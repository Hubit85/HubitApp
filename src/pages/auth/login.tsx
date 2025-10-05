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
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Sparkles, AlertTriangle, AlertCircle, LogIn } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn, user, session, loading, isConnected } = useSupabaseAuth();
  const router = useRouter();
  const { t } = useLanguage();

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center pb-8">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("welcomeBack")}
              </CardTitle>
              <p className="text-neutral-600">
                {t("loginToAccess")}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-neutral-700">
                    {t("email")}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("enterEmail")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 h-12 border-neutral-300 focus:border-blue-500 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-neutral-700">
                    {t("password")}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder={t("enterPassword")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 h-12 border-neutral-300 focus:border-blue-500 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="animate-in fade-in-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t("loading")}
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" />
                      {t("login")}
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-4">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                  onClick={() => {
                    toast({
                      title: t("info"),
                      description: t("contactSupport"),
                    });
                  }}
                >
                  {t("forgotPassword")}
                </button>

                <div className="pt-4 border-t border-neutral-200">
                  <p className="text-sm text-neutral-600 mb-3">
                    {t("dontHaveAccount")}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold transition-colors"
                    onClick={() => router.push("/auth/register")}
                  >
                    {t("register")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

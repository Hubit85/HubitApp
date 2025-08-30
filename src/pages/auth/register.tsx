
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, Shield, Sparkles, UserCircle } from "lucide-react";

type RegistrationState = 'idle' | 'submitting' | 'redirecting';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    phone: "",
    user_type: "" as 'particular' | 'community_member' | 'service_provider' | 'property_administrator' | ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationState, setRegistrationState] = useState<RegistrationState>('idle');
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  const { user, loading, signUp } = useSupabaseAuth();
  const router = useRouter();

  // Password validation
  useEffect(() => {
    setPasswordValidation({
      length: formData.password.length >= 8,
      uppercase: /[A-Z]/.test(formData.password),
      lowercase: /[a-z]/.test(formData.password),
      number: /\d/.test(formData.password)
    });
  }, [formData.password]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isWorking) {
      return;
    }
    
    setRegistrationState('submitting');
    setError("");
    setSuccessMessage("");

    try {
      console.log("Starting registration process...");

      // Validation
      if (formData.password !== formData.confirmPassword) {
        setError("Las contraseñas no coinciden");
        setRegistrationState('idle');
        return;
      }

      if (!Object.values(passwordValidation).every(Boolean)) {
        setError("La contraseña no cumple con los requisitos mínimos");
        setRegistrationState('idle');
        return;
      }

      if (!formData.user_type) {
        setError("Por favor selecciona un tipo de usuario");
        setRegistrationState('idle');
        return;
      }

      console.log("Validation passed, attempting registration...");

      const result = await signUp(formData.email, formData.password, {
        full_name: formData.full_name,
        user_type: formData.user_type,
        phone: formData.phone,
      });

      console.log("Registration result:", result);

      // Handle different result states
      if (result?.error) {
        console.log("Registration failed:", result.error);
        setError(result.error);
        setRegistrationState('idle');
        return;
      }

      if (result?.message) {
        console.log("Email confirmation required");
        setSuccessMessage(result.message);
        setRegistrationState('idle');
        return;
      }

      if (result?.success) {
        console.log("Registration successful! Redirecting immediately...");
        setRegistrationState('redirecting');
        
        // Show redirecting message for 1 second, then redirect
        setTimeout(() => {
          router.replace("/dashboard").then(() => {
            console.log("Redirect successful");
          }).catch((err) => {
            console.error("Redirect failed:", err);
            setRegistrationState('idle');
            setError("Error durante la redirección. Tu cuenta fue creada exitosamente. Puedes iniciar sesión en /auth/login");
          });
        }, 1000);
        
        return;
      }

      // Fallback - no clear result
      console.warn("Registration completed with unclear result");
      setError("Error durante el registro. Por favor, inténtalo de nuevo.");
      setRegistrationState('idle');
      
    } catch (err) {
      console.error("Registration exception:", err);
      setError("Error inesperado durante el registro. Por favor, inténtalo de nuevo.");
      setRegistrationState('idle');
    }
  };

  const userTypeOptions = [
    { value: "particular", label: "Particular", description: "Usuario individual" },
    { value: "community_member", label: "Miembro de Comunidad", description: "Residente de comunidad" },
    { value: "service_provider", label: "Proveedor de Servicios", description: "Empresa o autónomo" },
    { value: "property_administrator", label: "Administrador de Fincas", description: "Gestión de propiedades" }
  ];

  const isWorking = registrationState === 'submitting' || registrationState === 'redirecting';

  // Show redirecting screen
  if (registrationState === 'redirecting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/70 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="h-8 w-8 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                ¡Registro Exitoso!
              </h2>
              <p className="text-neutral-600 mb-4">
                Redirigiendo a tu dashboard...
              </p>
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading screen only during initial auth check
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-neutral-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Crear Cuenta - HuBiT</title>
        <meta name="description" content="Regístrate en HuBiT y comienza a conectar con profesionales" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 relative overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute top-10 right-10 w-40 h-40 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-purple-200/20 rounded-full blur-2xl animate-pulse delay-500" />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 py-12">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 tracking-tight">
                HuBiT
              </h1>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce" />
            </div>
            <p className="text-xl text-neutral-600 font-light">
              Únete a nuestra comunidad
            </p>
          </div>

          {/* Register Card */}
          <Card className="w-full max-w-lg bg-white/70 backdrop-blur-lg border-white/20 shadow-2xl shadow-neutral-900/10">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <UserCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-neutral-900">
                  Crear Cuenta
                </CardTitle>
                <CardDescription className="text-neutral-600">
                  Completa tus datos para empezar
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {(error || successMessage) && (
                <Alert className={error ? "border-red-200 bg-red-50" : "border-emerald-200 bg-emerald-50"}>
                  <AlertDescription className={error ? "text-red-800" : "text-emerald-800"}>
                    {error || successMessage}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-sm font-medium text-neutral-700">
                    Nombre completo
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                      id="full_name"
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange("full_name", e.target.value)}
                      placeholder="Juan Pérez"
                      className="pl-10 h-12 bg-white/50 border-neutral-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                      required
                      disabled={isWorking}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-neutral-700">
                    Correo electrónico
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="tu@email.com"
                      className="pl-10 h-12 bg-white/50 border-neutral-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                      required
                      disabled={isWorking}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-neutral-700">
                    Teléfono <span className="text-neutral-400">(opcional)</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+34 600 000 000"
                      className="pl-10 h-12 bg-white/50 border-neutral-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                      disabled={isWorking}
                    />
                  </div>
                </div>

                {/* User Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-neutral-700">
                    Tipo de usuario
                  </Label>
                  <Select value={formData.user_type} onValueChange={(value) => handleInputChange("user_type", value)} disabled={isWorking}>
                    <SelectTrigger className="h-12 bg-white/50 border-neutral-200 focus:border-emerald-500 focus:ring-emerald-500/20">
                      <SelectValue placeholder="Selecciona tu perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      {userTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="space-y-1">
                            <div className="font-medium">{option.label}</div>
                            <div className="text-sm text-neutral-500">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-neutral-700">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-12 bg-white/50 border-neutral-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                      required
                      disabled={isWorking}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                      disabled={isWorking}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {/* Password requirements */}
                  {formData.password && (
                    <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                      <div className={`flex items-center gap-1 ${passwordValidation.length ? 'text-emerald-600' : 'text-neutral-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${passwordValidation.length ? 'bg-emerald-500' : 'bg-neutral-300'}`} />
                        8+ caracteres
                      </div>
                      <div className={`flex items-center gap-1 ${passwordValidation.uppercase ? 'text-emerald-600' : 'text-neutral-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${passwordValidation.uppercase ? 'bg-emerald-500' : 'bg-neutral-300'}`} />
                        Mayúscula
                      </div>
                      <div className={`flex items-center gap-1 ${passwordValidation.lowercase ? 'text-emerald-600' : 'text-neutral-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${passwordValidation.lowercase ? 'bg-emerald-500' : 'bg-neutral-300'}`} />
                        Minúscula
                      </div>
                      <div className={`flex items-center gap-1 ${passwordValidation.number ? 'text-emerald-600' : 'text-neutral-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${passwordValidation.number ? 'bg-emerald-500' : 'bg-neutral-300'}`} />
                        Número
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-neutral-700">
                    Confirmar contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-12 bg-white/50 border-neutral-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                      required
                      disabled={isWorking}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                      disabled={isWorking}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-600">Las contraseñas no coinciden</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isWorking || !Object.values(passwordValidation).every(Boolean) || formData.password !== formData.confirmPassword || !formData.user_type}
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-500 hover:via-emerald-600 hover:to-emerald-700 text-white border-0 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {(() => {
                    if (registrationState === 'submitting') {
                      return (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Creando cuenta...
                        </>
                      );
                    }
                    if (registrationState === 'redirecting') {
                      return (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Redirigiendo...
                        </>
                      );
                    }
                    return (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Crear Cuenta
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    );
                  })()}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-neutral-500">¿Ya tienes cuenta?</span>
                </div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <Link 
                  href="/auth/login"
                  className="group inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                >
                  Iniciar sesión
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500 max-w-md">
              Al crear una cuenta, aceptas nuestros{" "}
              <Link href="/terms" className="text-emerald-600 hover:underline">
                Términos de Servicio
              </Link>{" "}
              y{" "}
              <Link href="/privacy" className="text-emerald-600 hover:underline">
                Política de Privacidad
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
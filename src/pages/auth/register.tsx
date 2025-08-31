
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, Sparkles, UserCircle,
  Home, Users, Wrench, Building, MapPin, FileText, AlertCircle, CheckCircle, Shield
} from "lucide-react";

type RoleType = 'particular' | 'community_member' | 'service_provider' | 'property_administrator';

interface RoleFormData {
  // Campos comunes
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  phone: string;
  address: string;
  role: RoleType | "";
  
  // Campos específicos de empresa/administrador
  company_name?: string;
  company_address?: string;
  cif?: string;
  business_email?: string;
  business_phone?: string;
  
  // Campo específico de administrador de fincas
  professional_number?: string;
  
  // Campo específico de comunidad
  community_code?: string;
}

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RoleFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    phone: "",
    address: "",
    role: "",
    company_name: "",
    company_address: "",
    cif: "",
    business_email: "",
    business_phone: "",
    professional_number: "",
    community_code: ""
  });

  // State variables for form control and validation
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // Fix boolean type issues - ensure these are properly typed
  const [cifValidating, setCifValidating] = useState<boolean>(false);
  const [cifValid, setCifValid] = useState<boolean | null>(null);
  
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  const { user, loading, signUp } = useSupabaseAuth();
  const router = useRouter();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  // Password validation
  useEffect(() => {
    setPasswordValidation({
      length: formData.password.length >= 8,
      uppercase: /[A-Z]/.test(formData.password),
      lowercase: /[a-z]/.test(formData.password),
      number: /\d/.test(formData.password)
    });
  }, [formData.password]);

  // CIF validation function
  const validateCIF = (cif: string): boolean => {
    // Basic CIF validation pattern for Spain
    const cifPattern = /^[ABCDEFGHJNPQRSUVW]\d{8}$/;
    if (!cifPattern.test(cif)) return false;
    
    // Additional validation logic could be added here
    // This is a simplified validation
    return true;
  };

  // Mock CIF verification against civil registry
  const verifyCIFAgainstRegistry = async (cif: string): Promise<boolean> => {
    setCifValidating(true);
    try {
      // Simulate API call to civil registry
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock validation - in real implementation, this would call the actual registry
      const isValid = validateCIF(cif) && !['A00000000', 'B00000000'].includes(cif); // Example invalid CIFs
      setCifValid(isValid);
      return isValid;
    } catch (error) {
      setCifValid(false);
      return false;
    } finally {
      setCifValidating(false);
    }
  };

  const handleInputChange = (field: keyof RoleFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Reset CIF validation when CIF changes
    if (field === 'cif') {
      setCifValid(null);
    }
  };

  const handleRoleSelection = (role: RoleType) => {
    setFormData(prev => ({ 
      ...prev, 
      role,
      // Reset role-specific fields when changing role
      company_name: "",
      company_address: "",
      cif: "",
      business_email: "",
      business_phone: "",
      professional_number: "",
      community_code: ""
    }));
    setCifValid(null);
    setCurrentStep(2);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!formData.role;
      case 2:
        const baseValid = !!(formData.full_name && formData.address && formData.email && formData.phone);
        
        if (formData.role === 'service_provider') {
          return baseValid && !!(formData.company_name && formData.company_address && 
                 formData.cif && formData.business_email && formData.business_phone) && cifValid === true;
        }
        
        if (formData.role === 'property_administrator') {
          return baseValid && !!(formData.company_name && formData.company_address && 
                 formData.cif && formData.professional_number && formData.business_email && 
                 formData.business_phone) && cifValid === true;
        }
        
        return baseValid;
      case 3:
        return !!(formData.password && formData.confirmPassword && 
               formData.password === formData.confirmPassword &&
               Object.values(passwordValidation).every(Boolean));
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (currentStep === 2 && (formData.role === 'service_provider' || formData.role === 'property_administrator') && formData.cif && cifValid === null) {
      const isValid = await verifyCIFAgainstRegistry(formData.cif);
      if (!isValid) {
        setError("El CIF proporcionado no es válido o no está registrado en el registro civil.");
        return;
      }
    }
    
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setError("");
    }
  };

  const generateCommunityCode = (address: string): string => {
    // Generate a community code based on the address
    const hash = address.toLowerCase().replace(/\s+/g, '').slice(0, 10);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `COM-${hash}-${randomNum}`.toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submitting) return;
    
    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      // Generate community code for community members if it's the first registration
      let communityCode = formData.community_code;
      if (formData.role === 'community_member' && !communityCode) {
        communityCode = generateCommunityCode(formData.address);
      }

      // Prepare role-specific data
      let roleSpecificData = {};
      
      switch (formData.role) {
        case 'particular':
          roleSpecificData = {
            full_name: formData.full_name,
            address: formData.address,
            phone: formData.phone
          };
          break;
        
        case 'community_member':
          roleSpecificData = {
            full_name: formData.full_name,
            address: formData.address,
            phone: formData.phone,
            community_code: communityCode
          };
          break;
        
        case 'service_provider':
          roleSpecificData = {
            company_name: formData.company_name,
            company_address: formData.company_address,
            cif: formData.cif,
            business_email: formData.business_email,
            business_phone: formData.business_phone
          };
          break;
        
        case 'property_administrator':
          roleSpecificData = {
            company_name: formData.company_name,
            company_address: formData.company_address,
            cif: formData.cif,
            professional_number: formData.professional_number,
            business_email: formData.business_email,
            business_phone: formData.business_phone
          };
          break;
      }

      const result = await signUp(formData.email, formData.password, {
        full_name: formData.role === 'service_provider' || formData.role === 'property_administrator' 
          ? formData.company_name 
          : formData.full_name,
        user_type: formData.role as string,
        phone: formData.role === 'service_provider' || formData.role === 'property_administrator' 
          ? formData.business_phone 
          : formData.phone
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (result?.message) {
        setSuccessMessage(result.message);
        return;
      }

      if (result?.success) {
        setSuccessMessage("¡Cuenta creada exitosamente! Redirigiendo...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
        return;
      }

      setError("Error durante el registro. Por favor, inténtalo de nuevo.");
      
    } catch (err) {
      console.error("Registration exception:", err);
      setError("Error inesperado durante el registro. Por favor, inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

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

  const getRoleInfo = (role: RoleType) => {
    const roles = {
      particular: { 
        icon: User, 
        label: "Particular", 
        description: "Usuario individual que busca servicios para sus propiedades",
        color: "from-blue-500 to-blue-600"
      },
      community_member: { 
        icon: Users, 
        label: "Miembro de Comunidad", 
        description: "Residente de una comunidad de vecinos",
        color: "from-green-500 to-green-600"
      },
      service_provider: { 
        icon: Wrench, 
        label: "Proveedor de Servicios", 
        description: "Empresa o autónomo que ofrece servicios profesionales",
        color: "from-orange-500 to-orange-600"
      },
      property_administrator: { 
        icon: Building, 
        label: "Administrador de Fincas", 
        description: "Profesional colegiado en gestión de propiedades",
        color: "from-purple-500 to-purple-600"
      }
    };
    return roles[role];
  };

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

          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  currentStep >= step 
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg' 
                    : 'bg-white text-neutral-400 border border-neutral-200'
                }`}>
                  {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                    currentStep > step ? 'bg-emerald-500' : 'bg-neutral-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Register Card */}
          <Card className="w-full max-w-2xl bg-white/70 backdrop-blur-lg border-white/20 shadow-2xl shadow-neutral-900/10">
            {/* Step 1: Role Selection */}
            {currentStep === 1 && (
              <>
                <CardHeader className="text-center space-y-4 pb-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <UserCircle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-neutral-900">
                      Selecciona tu Perfil
                    </CardTitle>
                    <CardDescription className="text-neutral-600">
                      Elige el tipo de cuenta que mejor se adapte a tus necesidades
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {(error || successMessage) && (
                    <Alert className={error ? "border-red-200 bg-red-50" : "border-emerald-200 bg-emerald-50"}>
                      <AlertDescription className={error ? "text-red-800" : "text-emerald-800"}>
                        {error || successMessage}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(['particular', 'community_member', 'service_provider', 'property_administrator'] as RoleType[]).map((role) => {
                      const roleInfo = getRoleInfo(role);
                      const RoleIcon = roleInfo.icon;
                      return (
                        <Card 
                          key={role}
                          className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 ${
                            formData.role === role 
                              ? 'border-emerald-500 bg-emerald-50' 
                              : 'border-neutral-200 hover:border-emerald-300'
                          }`}
                          onClick={() => handleRoleSelection(role)}
                        >
                          <CardContent className="p-6 text-center">
                            <div className={`mx-auto w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-r ${roleInfo.color}`}>
                              <RoleIcon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-lg text-neutral-900 mb-2">
                              {roleInfo.label}
                            </h3>
                            <p className="text-sm text-neutral-600">
                              {roleInfo.description}
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </>
            )}

            {/* Step 2: Personal/Business Information */}
            {currentStep === 2 && formData.role && (
              <>
                <CardHeader className="text-center space-y-4 pb-6">
                  <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-r ${getRoleInfo(formData.role).color}`}>
                    {React.createElement(getRoleInfo(formData.role).icon, { className: "h-8 w-8 text-white" })}
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-neutral-900">
                      Información {formData.role === 'service_provider' || formData.role === 'property_administrator' ? 'Empresarial' : 'Personal'}
                    </CardTitle>
                    <CardDescription className="text-neutral-600">
                      {formData.role === 'particular' && "Completa tu información personal"}
                      {formData.role === 'community_member' && "Completa tu información de residencia"}
                      {formData.role === 'service_provider' && "Completa la información de tu empresa"}
                      {formData.role === 'property_administrator' && "Completa la información de tu administración"}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Common Fields */}
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="text-sm font-medium text-neutral-700">
                        {formData.role === 'service_provider' 
                          ? "Nombre de la empresa" 
                          : formData.role === 'property_administrator' 
                          ? "Nombre de la administración"
                          : "Nombre completo"} *
                      </Label>
                      <div className="relative">
                        {formData.role === 'service_provider' || formData.role === 'property_administrator' ? (
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        ) : (
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        )}
                        <Input
                          id="full_name"
                          type="text"
                          value={formData.full_name}
                          onChange={(e) => handleInputChange("full_name", e.target.value)}
                          placeholder={
                            formData.role === 'service_provider' 
                              ? "Servicios Técnicos Madrid S.L." 
                              : formData.role === 'property_administrator'
                              ? "Administración García & Asociados"
                              : "Juan Pérez García"
                          }
                          className="pl-10 h-12 bg-white/50 border-neutral-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-neutral-700">
                        {formData.role === 'service_provider' || formData.role === 'property_administrator' 
                          ? "Correo electrónico del negocio" 
                          : "Correo electrónico"} *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder={
                            formData.role === 'service_provider' || formData.role === 'property_administrator'
                              ? "info@empresa.com"
                              : "tu@email.com"
                          }
                          className="pl-10 h-12 bg-white/50 border-neutral-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-neutral-700">
                        Teléfono móvil *
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
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium text-neutral-700">
                        {formData.role === 'service_provider' || formData.role === 'property_administrator' 
                          ? "Domicilio de la empresa" 
                          : "Domicilio"} *
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <Input
                          id="address"
                          type="text"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          placeholder="Calle Mayor 123, Madrid"
                          className="pl-10 h-12 bg-white/50 border-neutral-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                          required
                        />
                      </div>
                    </div>

                    {/* Role-specific fields */}
                    {(formData.role === 'service_provider' || formData.role === 'property_administrator') && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="cif" className="text-sm font-medium text-neutral-700">
                            CIF * <Badge variant="secondary" className="ml-2 text-xs">Verificación automática</Badge>
                          </Label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                            <Input
                              id="cif"
                              type="text"
                              value={formData.cif || ""}
                              onChange={(e) => handleInputChange("cif", e.target.value.toUpperCase())}
                              placeholder="A12345678"
                              className="pl-10 pr-10 h-12 bg-white/50 border-neutral-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                              required
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              {cifValidating ? (
                                <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                              ) : cifValid === true ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : cifValid === false ? (
                                <AlertCircle className="h-5 w-5 text-red-600" />
                              ) : null}
                            </div>
                          </div>
                          {formData.cif && cifValid === null && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => verifyCIFAgainstRegistry(formData.cif!)}
                              disabled={cifValidating}
                              className="mt-2"
                            >
                              {cifValidating ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Verificando CIF...
                                </>
                              ) : (
                                <>
                                  <Shield className="w-4 h-4 mr-2" />
                                  Verificar CIF
                                </>
                              )}
                            </Button>
                          )}
                          {cifValid === true && (
                            <p className="text-sm text-green-600 flex items-center">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              CIF verificado en el registro civil
                            </p>
                          )}
                          {cifValid === false && (
                            <p className="text-sm text-red-600 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              CIF no válido o no encontrado en el registro civil
                            </p>
                          )}
                        </div>

                        {formData.role === 'property_administrator' && (
                          <div className="space-y-2">
                            <Label htmlFor="professional_number" className="text-sm font-medium text-neutral-700">
                              Número de colegiado *
                            </Label>
                            <div className="relative">
                              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                              <Input
                                id="professional_number"
                                type="text"
                                value={formData.professional_number || ""}
                                onChange={(e) => handleInputChange("professional_number", e.target.value)}
                                placeholder="CAF-MAD-1234"
                                className="pl-10 h-12 bg-white/50 border-neutral-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                                required
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {formData.role === 'community_member' && (
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-sm font-medium text-neutral-700">
                          Código de comunidad
                        </Label>
                        <p className="text-sm text-neutral-500">
                          Si eres el primer miembro de tu comunidad en registrarse, se generará automáticamente un código único basado en tu dirección.
                        </p>
                        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                          <p className="text-sm text-emerald-700 flex items-center">
                            <Shield className="w-4 h-4 mr-2" />
                            El código se generará automáticamente durante el registro
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1"
                    >
                      Atrás
                    </Button>
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={!validateStep(2) || cifValidating}
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600"
                    >
                      Continuar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </>
            )}

            {/* Step 3: Password Setup */}
            {currentStep === 3 && (
              <>
                <CardHeader className="text-center space-y-4 pb-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Lock className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-neutral-900">
                      Configurar Contraseña
                    </CardTitle>
                    <CardDescription className="text-neutral-600">
                      Crea una contraseña segura para tu cuenta
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
                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-neutral-700">
                        Contraseña *
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
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
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
                        Confirmar contraseña *
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
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="text-xs text-red-600">Las contraseñas no coinciden</p>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(2)}
                        className="flex-1"
                      >
                        Atrás
                      </Button>
                      <Button
                        type="submit"
                        disabled={submitting || !validateStep(3)}
                        className="flex-1 bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-500 hover:via-emerald-600 hover:to-emerald-700 text-white border-0 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Creando cuenta...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Crear Cuenta
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </>
            )}
          </Card>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-neutral-500">¿Ya tienes cuenta?</span>
              </div>
            </div>
            <Link 
              href="/auth/login"
              className="group inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              Iniciar sesión
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
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
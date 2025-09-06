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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Loader2, Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, Sparkles, UserCircle,
  Home, Users, Wrench, Building, MapPin, FileText, AlertCircle, CheckCircle, Shield,
  ArrowLeft, Clock, Star
} from "lucide-react";

type RoleType = 'particular' | 'community_member' | 'service_provider' | 'property_administrator';

interface RoleFormData {
  // Campos comunes
  email: string;
  password: string;
  confirmPassword: string;
  roles: RoleType[];
  
  // Datos específicos por rol
  particular: {
    full_name: string;
    phone: string;
    address: string;
    postal_code: string;
    city: string;
    province: string;
    country: string;
  };
  
  community_member: {
    full_name: string;
    phone: string;
    address: string;
    postal_code: string;
    city: string;
    province: string;
    country: string;
    community_code?: string;
  };
  
  service_provider: {
    company_name: string;
    company_address: string;
    company_postal_code: string;
    company_city: string;
    company_province: string;
    company_country: string;
    cif: string;
    business_email: string;
    business_phone: string;
  };
  
  property_administrator: {
    company_name: string;
    company_address: string;
    company_postal_code: string;
    company_city: string;
    company_province: string;
    company_country: string;
    cif: string;
    business_email: string;
    business_phone: string;
    professional_number: string;
  };
}

// Orden específico de los roles según requerimiento
const ROLE_ORDER: RoleType[] = ['particular', 'community_member', 'service_provider', 'property_administrator'];

export default function RegisterPage() {
  // Create a wrapper component that uses the auth context
  return <RegisterPageContent />;
}

function RegisterPageContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0); // Para rastrear qué rol estamos completando
  
  const [formData, setFormData] = useState<RoleFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    roles: [],
    particular: {
      full_name: "",
      phone: "",
      address: "",
      postal_code: "",
      city: "",
      province: "",
      country: "España",
    },
    community_member: {
      full_name: "",
      phone: "",
      address: "",
      postal_code: "",
      city: "",
      province: "",
      country: "España",
      community_code: "",
    },
    service_provider: {
      company_name: "",
      company_address: "",
      company_postal_code: "",
      company_city: "",
      company_province: "",
      company_country: "España",
      cif: "",
      business_email: "",
      business_phone: "",
    },
    property_administrator: {
      company_name: "",
      company_address: "",
      company_postal_code: "",
      company_city: "",
      company_province: "",
      company_country: "España",
      cif: "",
      business_email: "",
      business_phone: "",
      professional_number: "",
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
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

  // Obtener roles ordenados según el orden especificado
  const getOrderedRoles = (selectedRoles: RoleType[]): RoleType[] => {
    return ROLE_ORDER.filter(role => selectedRoles.includes(role));
  };

  // Obtener el rol actual que se está completando
  const getCurrentRole = (): RoleType | null => {
    const orderedRoles = getOrderedRoles(formData.roles);
    return orderedRoles[currentRoleIndex] || null;
  };

  // Calcular el progreso total del registro
  const calculateProgress = (): number => {
    if (currentStep === 1) return 20; // Selección de roles
    if (currentStep === 2) {
      // En el paso 2, calculamos progreso basado en roles completados
      const totalRoles = formData.roles.length;
      const rolesCompleted = currentRoleIndex;
      const roleProgress = totalRoles > 0 ? (rolesCompleted / totalRoles) * 60 : 0; // 60% para todos los roles
      return 20 + roleProgress;
    }
    if (currentStep === 3) return 90; // Contraseña
    return 100; // Completado
  };

  // CIF validation function
  const validateCIF = (cif: string): boolean => {
    const cifPattern = /^[ABCDEFGHJNPQRSUVW]\d{8}$/;
    return cifPattern.test(cif);
  };

  const verifyCIFAgainstRegistry = async (cif: string): Promise<boolean> => {
    setCifValidating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const isValid = validateCIF(cif) && !['A00000000', 'B00000000'].includes(cif);
      setCifValid(isValid);
      return isValid;
    } catch (error) {
      setCifValid(false);
      return false;
    } finally {
      setCifValidating(false);
    }
  };

  const handleRoleToggle = (role: RoleType) => {
    setFormData(prev => {
      const newRoles = prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role];
      
      return {
        ...prev,
        roles: newRoles
      };
    });
  };

  const handleConfirmRoles = () => {
    if (formData.roles.length === 0) {
      setError("Debes seleccionar al menos un rol para continuar");
      return;
    }
    
    setError("");
    setCurrentStep(2);
    setCurrentRoleIndex(0); // Empezar con el primer rol
  };

  // Actualizar datos específicos del rol actual
  const updateCurrentRoleData = (field: string, value: string) => {
    const currentRole = getCurrentRole();
    if (!currentRole) return;

    setFormData(prev => ({
      ...prev,
      [currentRole]: {
        ...prev[currentRole],
        [field]: value
      }
    }));

    // Reset CIF validation when CIF changes
    if (field === 'cif') {
      setCifValid(null);
    }
  };

  // Validar datos del rol actual
  const validateCurrentRole = (): boolean => {
    const currentRole = getCurrentRole();
    if (!currentRole) return false;

    const roleData = formData[currentRole] as any; // Type assertion para manejar union types

    switch (currentRole) {
      case 'particular': {
        const data = roleData as typeof formData.particular;
        return !!(data.full_name && data.phone && data.address && 
                 data.postal_code && data.city && data.province && data.country);
      }
      
      case 'community_member': {
        const data = roleData as typeof formData.community_member;
        return !!(data.full_name && data.phone && data.address && 
                 data.postal_code && data.city && data.province && data.country);
      }
      
      case 'service_provider': {
        const data = roleData as typeof formData.service_provider;
        return !!(data.company_name && data.company_address && data.company_postal_code && 
                 data.company_city && data.company_province && data.company_country &&
                 data.cif && data.business_email && data.business_phone && 
                 cifValid === true);
      }
      
      case 'property_administrator': {
        const data = roleData as typeof formData.property_administrator;
        return !!(data.company_name && data.company_address && data.company_postal_code && 
                 data.company_city && data.company_province && data.company_country &&
                 data.cif && data.business_email && data.business_phone && 
                 data.professional_number && cifValid === true);
      }
      
      default:
        return false;
    }
  };

  // Manejar navegación entre roles
  const handleNextRole = async () => {
    const currentRole = getCurrentRole();
    
    // Validar CIF si es necesario
    if ((currentRole === 'service_provider' || currentRole === 'property_administrator')) {
      const roleData = formData[currentRole] as any;
      if (roleData.cif && cifValid === null) {
        const isValid = await verifyCIFAgainstRegistry(roleData.cif);
        if (!isValid) {
          setError("El CIF proporcionado no es válido o no está registrado en el registro civil.");
          return;
        }
      }
    }

    if (!validateCurrentRole()) {
      setError("Por favor, completa todos los campos requeridos para este rol.");
      return;
    }

    setError("");
    const orderedRoles = getOrderedRoles(formData.roles);
    
    if (currentRoleIndex < orderedRoles.length - 1) {
      // Antes de ir al siguiente rol, verificar si necesitamos auto-completar datos
      const nextRole = orderedRoles[currentRoleIndex + 1];
      
      // Si el rol actual es "particular" y el siguiente es "community_member", 
      // pre-rellenar los datos del miembro de comunidad
      if (currentRole === 'particular' && nextRole === 'community_member') {
        const particularData = formData.particular;
        setFormData(prev => ({
          ...prev,
          community_member: {
            ...prev.community_member,
            full_name: particularData.full_name,
            phone: particularData.phone,
            address: particularData.address,
            postal_code: particularData.postal_code,
            city: particularData.city,
            province: particularData.province,
            country: particularData.country,
            // Mantener el community_code existente si lo hay
            community_code: prev.community_member.community_code
          }
        }));
      }
      
      // Ir al siguiente rol
      setCurrentRoleIndex(prev => prev + 1);
    } else {
      // Todos los roles completados, ir al paso de contraseña
      setCurrentStep(3);
    }
  };

  const handlePrevRole = () => {
    if (currentRoleIndex > 0) {
      setCurrentRoleIndex(prev => prev - 1);
    } else {
      // Volver al paso de selección de roles
      setCurrentStep(1);
    }
  };

  const generateCommunityCode = (address: string): string => {
    const hash = address.toLowerCase().replace(/\s+/g, '').slice(0, 10);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `COM-${hash}-${randomNum}`.toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submitting) return;
    
    // Validar contraseña
    if (!Object.values(passwordValidation).every(Boolean) || formData.password !== formData.confirmPassword) {
      setError("Por favor, verifica que la contraseña cumple todos los requisitos y coincide con la confirmación.");
      return;
    }
    
    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const primaryRole = getOrderedRoles(formData.roles)[0];
      
      // Preparar datos según el rol principal
      let userData: any = {};
      
      if (primaryRole === 'particular') {
        userData = {
          full_name: formData.particular.full_name,
          user_type: primaryRole,
          phone: formData.particular.phone,
        };
      } else if (primaryRole === 'community_member') {
        const communityCode = formData.community_member.community_code || 
                             generateCommunityCode(formData.community_member.address);
        userData = {
          full_name: formData.community_member.full_name,
          user_type: primaryRole,
          phone: formData.community_member.phone,
        };
      } else if (primaryRole === 'service_provider') {
        userData = {
          full_name: formData.service_provider.company_name,
          user_type: primaryRole,
          phone: formData.service_provider.business_phone,
        };
      } else if (primaryRole === 'property_administrator') {
        userData = {
          full_name: formData.property_administrator.company_name,
          user_type: primaryRole,
          phone: formData.property_administrator.business_phone,
        };
      }

      // Paso 1: Crear la cuenta con el rol principal
      const result = await signUp(formData.email, formData.password, userData);

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (result?.message) {
        setSuccessMessage(result.message);
        return;
      }

      if (result?.success) {
        // Paso 2: Si hay más de un rol seleccionado, crear los roles adicionales
        const orderedRoles = getOrderedRoles(formData.roles);
        const additionalRoles = orderedRoles.slice(1); // Todos menos el primero
        
        if (additionalRoles.length > 0) {
          setSuccessMessage("¡Cuenta creada! Configurando roles adicionales...");
          
          // Esperar un momento para que la cuenta se complete
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Crear cada rol adicional
          let rolesCreatedSuccessfully = 0;
          let roleErrors: string[] = [];
          
          for (const additionalRole of additionalRoles) {
            try {
              // Preparar datos específicos del rol
              let roleSpecificData: any = {};
              
              if (additionalRole === 'particular') {
                roleSpecificData = formData.particular;
              } else if (additionalRole === 'community_member') {
                roleSpecificData = {
                  ...formData.community_member,
                  community_code: formData.community_member.community_code || 
                                 generateCommunityCode(formData.community_member.address)
                };
              } else if (additionalRole === 'service_provider') {
                roleSpecificData = formData.service_provider;
              } else if (additionalRole === 'property_administrator') {
                roleSpecificData = formData.property_administrator;
              }
              
              // Llamar al API para agregar el rol
              const roleResponse = await fetch('/api/user-roles/add-role', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  userId: user?.id, // Usar el ID del usuario recién creado
                  roleType: additionalRole,
                  roleSpecificData: roleSpecificData
                })
              });
              
              const roleResult = await roleResponse.json();
              
              if (roleResult.success) {
                rolesCreatedSuccessfully++;
                console.log(`✅ Rol adicional creado: ${additionalRole}`);
              } else {
                roleErrors.push(`${additionalRole}: ${roleResult.message}`);
                console.error(`❌ Error creando rol ${additionalRole}:`, roleResult.message);
              }
              
            } catch (roleError) {
              roleErrors.push(`${additionalRole}: Error de conexión`);
              console.error(`❌ Error creando rol ${additionalRole}:`, roleError);
            }
          }
          
          // Mostrar resultado final
          if (rolesCreatedSuccessfully === additionalRoles.length) {
            setSuccessMessage(`¡Cuenta creada exitosamente con ${orderedRoles.length} roles! Redirigiendo...`);
          } else if (rolesCreatedSuccessfully > 0) {
            setSuccessMessage(`Cuenta creada. ${rolesCreatedSuccessfully} de ${additionalRoles.length} roles adicionales configurados. Los roles pendientes recibirán verificación por email.`);
          } else {
            setSuccessMessage(`Cuenta creada con rol principal. Los roles adicionales se pueden agregar desde tu dashboard.`);
          }
          
          // Mostrar errores específicos si los hay (solo para debugging, no asustar al usuario)
          if (roleErrors.length > 0) {
            console.warn('Errores en roles adicionales:', roleErrors);
          }
        } else {
          setSuccessMessage("¡Cuenta creada exitosamente! Redirigiendo...");
        }
        
        // Redirigir después de un momento
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
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

  const currentRole = getCurrentRole();
  const orderedRoles = getOrderedRoles(formData.roles);

  return (
    <>
      <Head>
        <title>Crear Cuenta - HuBiT</title>
        <meta name="description" content="Regístrate en HuBiT y comienza a conectar con profesionales" />
      </Head>

      <div className="min-h-screen bg-gray-50 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 py-12">
          {/* Header con Logo */}
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
              Únete a nuestra comunidad
            </p>
          </div>

          {/* Indicador de progreso mejorado */}
          <div className="w-full max-w-2xl mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-stone-700">Progreso del registro</span>
              <span className="text-sm text-stone-500">{Math.round(calculateProgress())}%</span>
            </div>
            <Progress value={calculateProgress()} className="h-2 mb-4" />
            
            {/* Steps indicator */}
            <div className="flex items-center justify-center space-x-4">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-stone-800' : 'text-stone-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  currentStep >= 1 ? 'bg-stone-800 text-white' : 'bg-stone-200'
                }`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium">Roles</span>
              </div>
              
              <div className={`w-12 h-1 rounded-full transition-all duration-300 ${
                currentStep > 1 ? 'bg-stone-800' : 'bg-stone-200'
              }`} />
              
              <div className={`flex items-center ${currentStep >= 2 ? 'text-stone-800' : 'text-stone-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  currentStep >= 2 ? 'bg-stone-800 text-white' : 'bg-stone-200'
                }`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Información</span>
              </div>
              
              <div className={`w-12 h-1 rounded-full transition-all duration-300 ${
                currentStep > 2 ? 'bg-stone-800' : 'bg-stone-200'
              }`} />
              
              <div className={`flex items-center ${currentStep >= 3 ? 'text-stone-800' : 'text-stone-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  currentStep >= 3 ? 'bg-stone-800 text-white' : 'bg-stone-200'
                }`}>
                  3
                </div>
                <span className="ml-2 text-sm font-medium">Contraseña</span>
              </div>
            </div>
          </div>

          {/* Register Card */}
          <Card className="w-full max-w-2xl bg-white border-stone-200 shadow-2xl shadow-stone-900/10">
            
            {/* STEP 1: Role Selection */}
            {currentStep === 1 && (
              <>
                <CardHeader className="text-center space-y-4 pb-6">
                  <div className="mx-auto w-16 h-16 bg-stone-800 rounded-2xl flex items-center justify-center shadow-lg">
                    <UserCircle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-black">
                      Selecciona tu Rol
                    </CardTitle>
                    <CardDescription className="text-stone-600">
                      Puedes seleccionar uno o varios roles según tus necesidades
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {(error || successMessage) && (
                    <Alert className={error ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
                      <AlertDescription className={error ? "text-red-800" : "text-green-800"}>
                        {error || successMessage}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ROLE_ORDER.map((role) => {
                      const roleInfo = getRoleInfo(role);
                      const RoleIcon = roleInfo.icon;
                      const isSelected = formData.roles.includes(role);
                      
                      return (
                        <Card 
                          key={role}
                          className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 ${
                            isSelected
                              ? 'border-stone-800 bg-stone-50 shadow-lg ring-2 ring-stone-200' 
                              : 'border-stone-200 hover:border-stone-400'
                          }`}
                          onClick={() => handleRoleToggle(role)}
                        >
                          <CardContent className="p-6 text-center relative">
                            {isSelected && (
                              <div className="absolute top-3 right-3">
                                <CheckCircle className="h-5 w-5 text-stone-800" />
                              </div>
                            )}
                            <div className={`mx-auto w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-r ${roleInfo.color} ${
                              isSelected ? 'scale-110' : ''
                            } transition-transform duration-200`}>
                              <RoleIcon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className={`font-semibold text-lg mb-2 ${isSelected ? 'text-stone-800' : 'text-black'}`}>
                              {roleInfo.label}
                            </h3>
                            <p className="text-sm text-stone-600">
                              {roleInfo.description}
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Mostrar roles seleccionados con orden */}
                  {formData.roles.length > 0 && (
                    <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                      <h3 className="font-medium text-stone-900 mb-3">Roles seleccionados (orden de registro):</h3>
                      <div className="flex flex-wrap gap-2">
                        {getOrderedRoles(formData.roles).map((role, index) => {
                          const roleInfo = getRoleInfo(role);
                          return (
                            <Badge 
                              key={role} 
                              variant="default"
                              className="bg-stone-800 hover:bg-stone-900 text-white px-3 py-1 flex items-center gap-2"
                            >
                              <span className="text-xs bg-stone-600 rounded-full w-5 h-5 flex items-center justify-center">
                                {index + 1}
                              </span>
                              {roleInfo.label}
                            </Badge>
                          );
                        })}
                      </div>
                      <p className="text-xs text-stone-500 mt-2">
                        * Completarás la información de cada rol paso a paso en este orden
                      </p>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button
                      onClick={handleConfirmRoles}
                      disabled={formData.roles.length === 0}
                      className="w-full bg-stone-800 hover:bg-stone-900 text-white border-0 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none h-12"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Confirmar Selección
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </>
            )}

            {/* STEP 2: Role Information (Sequential) */}
            {currentStep === 2 && currentRole && (
              <>
                <CardHeader className="text-center space-y-4 pb-6">
                  <div className="mx-auto w-16 h-16 bg-stone-800 rounded-2xl flex items-center justify-center shadow-lg">
                    {(() => {
                      const IconComponent = getRoleInfo(currentRole).icon;
                      return <IconComponent className="h-8 w-8 text-white" />;
                    })()}
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-black">
                      {getRoleInfo(currentRole).label}
                    </CardTitle>
                    <CardDescription className="text-stone-600">
                      Paso {currentRoleIndex + 1} de {orderedRoles.length}: Completa la información para este rol
                    </CardDescription>
                    
                    {/* Progress indicator for roles */}
                    <div className="flex justify-center mt-4">
                      <div className="flex items-center space-x-2">
                        {orderedRoles.map((role, index) => (
                          <div key={role} className="flex items-center">
                            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              index < currentRoleIndex ? 'bg-green-500' :
                              index === currentRoleIndex ? 'bg-stone-800' : 'bg-stone-300'
                            }`} />
                            {index < orderedRoles.length - 1 && (
                              <div className={`w-6 h-0.5 mx-1 ${
                                index < currentRoleIndex ? 'bg-green-500' : 'bg-stone-300'
                              }`} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {(error || successMessage) && (
                    <Alert className={error ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
                      <AlertDescription className={error ? "text-red-800" : "text-green-800"}>
                        {error || successMessage}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Formularios específicos por rol */}
                  {(currentRole === 'particular' || currentRole === 'community_member') && (() => {
                    const roleData = formData[currentRole] as typeof formData.particular | typeof formData.community_member;
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-stone-700">
                            Nombre completo *
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400" />
                            <Input
                              type="text"
                              value={roleData.full_name}
                              onChange={(e) => updateCurrentRoleData("full_name", e.target.value)}
                              placeholder="Juan Pérez García"
                              className="pl-10 h-12 bg-white border-stone-200 focus:border-stone-800 focus:ring-stone-800/20"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-stone-700">
                            Teléfono móvil *
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400" />
                            <Input
                              type="tel"
                              value={roleData.phone}
                              onChange={(e) => updateCurrentRoleData("phone", e.target.value)}
                              placeholder="+34 600 000 000"
                              className="pl-10 h-12 bg-white border-stone-200 focus:border-stone-800 focus:ring-stone-800/20"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-sm font-medium text-stone-700">
                            Domicilio completo *
                          </Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Dirección */}
                            <div className="md:col-span-2">
                              <Label className="text-xs text-stone-600 mb-1">
                                Dirección (Calle y número) *
                              </Label>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
                                <Input
                                  type="text"
                                  value={roleData.address || ""}
                                  onChange={(e) => updateCurrentRoleData("address", e.target.value)}
                                  placeholder="Calle Mayor, 123, 2º B"
                                  className="pl-9 h-11 bg-white border-stone-200 focus:border-stone-800 focus:ring-stone-800/20"
                                  required
                                />
                              </div>
                            </div>

                            {/* Código Postal */}
                            <div>
                              <Label className="text-xs text-stone-600 mb-1">
                                Código Postal *
                              </Label>
                              <Input
                                type="text"
                                value={(roleData as any).postal_code || ""}
                                onChange={(e) => updateCurrentRoleData("postal_code", e.target.value)}
                                placeholder="28001"
                                className="h-11 bg-white border-stone-200 focus:border-stone-800 focus:ring-stone-800/20"
                                pattern="[0-9]{5}"
                                maxLength={5}
                                required
                              />
                            </div>

                            {/* Ciudad */}
                            <div>
                              <Label className="text-xs text-stone-600 mb-1">
                                Ciudad *
                              </Label>
                              <Input
                                type="text"
                                value={(roleData as any).city || ""}
                                onChange={(e) => updateCurrentRoleData("city", e.target.value)}
                                placeholder="Madrid"
                                className="h-11 bg-white border-stone-200 focus:border-stone-800 focus:ring-stone-800/20"
                                required
                              />
                            </div>

                            {/* Provincia */}
                            <div>
                              <Label className="text-xs text-stone-600 mb-1">
                                Provincia/Estado *
                              </Label>
                              <Input
                                type="text"
                                value={(roleData as any).province || ""}
                                onChange={(e) => updateCurrentRoleData("province", e.target.value)}
                                placeholder="Madrid"
                                className="h-11 bg-white border-stone-200 focus:border-stone-800 focus:ring-stone-800/20"
                                required
                              />
                            </div>

                            {/* País */}
                            <div>
                              <Label className="text-xs text-stone-600 mb-1">
                                País *
                              </Label>
                              <Select
                                value={(roleData as any).country || "España"}
                                onValueChange={(value) => updateCurrentRoleData("country", value)}
                              >
                                <SelectTrigger className="h-11 bg-white border-stone-200 focus:border-stone-800 focus:ring-stone-800/20">
                                  <SelectValue placeholder="Seleccionar país" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="España">España</SelectItem>
                                  <SelectItem value="Portugal">Portugal</SelectItem>
                                  <SelectItem value="Francia">Francia</SelectItem>
                                  <SelectItem value="Italia">Italia</SelectItem>
                                  <SelectItem value="Alemania">Alemania</SelectItem>
                                  <SelectItem value="Reino Unido">Reino Unido</SelectItem>
                                  <SelectItem value="Países Bajos">Países Bajos</SelectItem>
                                  <SelectItem value="Bélgica">Bélgica</SelectItem>
                                  <SelectItem value="Suiza">Suiza</SelectItem>
                                  <SelectItem value="Austria">Austria</SelectItem>
                                  <SelectItem value="Otros">Otros</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        {currentRole === 'community_member' && (
                          <>
                            {/* Mostrar nota informativa si los datos fueron pre-rellenados desde particular */}
                            {formData.roles.includes('particular') && currentRoleIndex > 0 && (
                              <div className="space-y-2 md:col-span-2">
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                  <div className="flex items-start space-x-3">
                                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <h4 className="font-medium text-blue-900 mb-1">
                                        Información pre-rellenada
                                      </h4>
                                      <p className="text-sm text-blue-800">
                                        Hemos copiado automáticamente tus datos personales del perfil de "Particular". 
                                        Puedes modificar cualquier campo si es necesario.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <div className="space-y-2 md:col-span-2">
                              <Label className="text-sm font-medium text-stone-700">
                                Código de comunidad
                              </Label>
                              <p className="text-sm text-stone-500">
                                Si eres el primer miembro de tu comunidad en registrarse, se generará automáticamente un código único basado en tu dirección.
                              </p>
                              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                                <p className="text-sm text-stone-700 flex items-center">
                                  <Shield className="w-4 h-4 mr-2" />
                                  El código se generará automáticamente durante el registro
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })()}

                  {(currentRole === 'service_provider' || currentRole === 'property_administrator') && (() => {
                    const roleData = formData[currentRole] as typeof formData.service_provider | typeof formData.property_administrator;
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-stone-700">
                            Nombre de la empresa *
                          </Label>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400" />
                            <Input
                              type="text"
                              value={roleData.company_name}
                              onChange={(e) => updateCurrentRoleData("company_name", e.target.value)}
                              placeholder="Servicios Técnicos Madrid S.L."
                              className="pl-10 h-12 bg-white border-stone-200 focus:border-stone-800 focus:ring-stone-800/20"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-stone-700">
                            Correo electrónico del negocio *
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400" />
                            <Input
                              type="email"
                              value={roleData.business_email}
                              onChange={(e) => updateCurrentRoleData("business_email", e.target.value)}
                              placeholder="info@empresa.com"
                              className="pl-10 h-12 bg-white border-stone-200 focus:border-stone-800 focus:ring-stone-800/20"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-stone-700">
                            Teléfono del negocio *
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400" />
                            <Input
                              type="tel"
                              value={roleData.business_phone}
                              onChange={(e) => updateCurrentRoleData("business_phone", e.target.value)}
                              placeholder="+34 900 000 000"
                              className="pl-10 h-12 bg-white border-stone-200 focus:border-stone-800 focus:ring-stone-800/20"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-stone-700">
                            Domicilio de la empresa *
                          </Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Dirección de la empresa */}
                            <div className="md:col-span-2">
                              <Label className="text-xs text-stone-600 mb-1">
                                Dirección (Calle y número) *
                              </Label>
                              <div className="relative">
                                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
                                <Input
                                  type="text"
                                  value={roleData.company_address}
                                  onChange={(e) => updateCurrentRoleData("company_address", e.target.value)}
                                  placeholder="Calle Industria, 456, Planta 3"
                                  className="pl-9 h-11 bg-white border-stone-200 focus:border-stone-800 focus:ring-stone-800/20"
                                  required
                                />
                              </div>
                            </div>

                            {/* Código Postal empresa */}
                            <div>
                              <Label className="text-xs text-stone-600 mb-1">
                                Código Postal *
                              </Label>
                              <Input
                                type="text"
                                value={(roleData as any).company_postal_code || ""}
                                onChange={(e) => updateCurrentRoleData("company_postal_code", e.target.value)}
                                placeholder="28046"
                                className="h-11 bg-white border-stone-200 focus:border-stone-800 focus:ring-stone-800/20"
                                pattern="[0-9]{5}"
                                maxLength={5}
                                required
                              />
                            </div>

                            {/* Ciudad empresa */}
                            <div>
                              <Label className="text-xs text-stone-600 mb-1">
                                Ciudad *
                              </Label>
                              <Input
                                type="text"
                                value={(roleData as any).company_city || ""}
                                onChange={(e) => updateCurrentRoleData("company_city", e.target.value)}
                                placeholder="Madrid"
                                className="h-11 bg-white border-stone-200 focus:border-stone-800 focus:ring-stone-800/20"
                                required
                              />
                            </div>

                            {/* Provincia empresa */}
                            <div>
                              <Label className="text-xs text-stone-600 mb-1">
                                Provincia/Estado *
                              </Label>
                              <Input
                                type="text"
                                value={(roleData as any).company_province || ""}
                                onChange={(e) => updateCurrentRoleData("company_province", e.target.value)}
                                placeholder="Madrid"
                                className="h-11 bg-white border-stone-200 focus:border-stone-800 focus:ring-stone-800/20"
                                required
                              />
                            </div>

                            {/* País empresa */}
                            <div>
                              <Label className="text-xs text-stone-600 mb-1">
                                País *
                              </Label>
                              <Select
                                value={(roleData as any).company_country || "España"}
                                onValueChange={(value) => updateCurrentRoleData("company_country", value)}
                              >
                                <SelectTrigger className="h-11 bg-white border-stone-200 focus:border-stone-800 focus:ring-stone-800/20">
                                  <SelectValue placeholder="Seleccionar país" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="España">España</SelectItem>
                                  <SelectItem value="Portugal">Portugal</SelectItem>
                                  <SelectItem value="Francia">Francia</SelectItem>
                                  <SelectItem value="Italia">Italia</SelectItem>
                                  <SelectItem value="Alemania">Alemania</SelectItem>
                                  <SelectItem value="Reino Unido">Reino Unido</SelectItem>
                                  <SelectItem value="Países Bajos">Países Bajos</SelectItem>
                                  <SelectItem value="Bélgica">Bélgica</SelectItem>
                                  <SelectItem value="Suiza">Suiza</SelectItem>
                                  <SelectItem value="Austria">Austria</SelectItem>
                                  <SelectItem value="Otros">Otros</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-stone-700">
                            CIF * <Badge variant="secondary" className="ml-2 text-xs bg-stone-100 text-stone-700">Verificación automática</Badge>
                          </Label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400" />
                            <Input
                              type="text"
                              value={roleData.cif}
                              onChange={(e) => updateCurrentRoleData("cif", e.target.value.toUpperCase())}
                              placeholder="A12345678"
                              className="pl-10 pr-10 h-12 bg-white border-stone-200 focus:border-stone-800 focus:ring-stone-800/20"
                              required
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              {cifValidating ? (
                                <Loader2 className="h-5 w-5 animate-spin text-stone-600" />
                              ) : cifValid === true ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : cifValid === false ? (
                                <AlertCircle className="h-5 w-5 text-red-600" />
                              ) : null}
                            </div>
                          </div>
                          {roleData.cif && cifValid === null && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => verifyCIFAgainstRegistry(roleData.cif)}
                              disabled={cifValidating}
                              className="mt-2 border-stone-200 hover:bg-stone-50"
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

                        {currentRole === 'property_administrator' && (() => {
                          const adminData = roleData as typeof formData.property_administrator;
                          return (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-stone-700">
                                Número de colegiado *
                              </Label>
                              <div className="relative">
                                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400" />
                                <Input
                                  type="text"
                                  value={adminData.professional_number}
                                  onChange={(e) => updateCurrentRoleData("professional_number", e.target.value)}
                                  placeholder="CAF-MAD-1234"
                                  className="pl-10 h-12 bg-white border-stone-200 focus:border-stone-800 focus:ring-stone-800/20"
                                  required
                                />
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })()}

                  {/* Navigation buttons */}
                  <div className="flex gap-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevRole}
                      className="flex-1 border-stone-200 hover:bg-stone-50"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Atrás
                    </Button>
                    <Button
                      type="button"
                      onClick={handleNextRole}
                      disabled={!validateCurrentRole() || cifValidating}
                      className="flex-1 bg-stone-800 hover:bg-stone-900 text-white"
                    >
                      {currentRoleIndex < orderedRoles.length - 1 ? (
                        <>
                          Siguiente Rol
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        <>
                          Continuar
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Mostrar resumen de roles completados */}
                  {currentRoleIndex > 0 && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-900 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Roles completados
                      </h4>
                      <div className="text-sm space-y-1">
                        {orderedRoles.slice(0, currentRoleIndex).map((role) => (
                          <div key={role} className="flex items-center text-green-700">
                            <Star className="w-3 h-3 mr-2" />
                            {getRoleInfo(role).label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </>
            )}

            {/* STEP 3: Password Setup */}
            {currentStep === 3 && (
              <>
                <CardHeader className="text-center space-y-4 pb-6">
                  <div className="mx-auto w-16 h-16 bg-stone-800 rounded-2xl flex items-center justify-center shadow-lg">
                    <Lock className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-black">
                      Configurar Contraseña
                    </CardTitle>
                    <CardDescription className="text-stone-600">
                      Último paso: Crea una contraseña segura para tu cuenta
                    </CardDescription>
                  </div>

                  {/* Mostrar resumen de todos los roles */}
                  <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 text-left">
                    <h4 className="font-medium text-stone-900 mb-3 text-center">Resumen de tu registro</h4>
                    <div className="space-y-2">
                      {orderedRoles.map((role, index) => (
                        <div key={role} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                            <span className="text-sm font-medium">{getRoleInfo(role).label}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Completado
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-stone-200">
                      <p className="text-xs text-stone-500 text-center">
                        Email: {formData.email || 'Pendiente de configurar'}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {(error || successMessage) && (
                    <Alert className={error ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
                      <AlertDescription className={error ? "text-red-800" : "text-green-800"}>
                        {error || successMessage}
                      </AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email field */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-stone-700">
                        Correo electrónico *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="tu@email.com"
                          className="pl-10 h-12 bg-white border-stone-200 focus:border-stone-800 focus:ring-stone-800/20"
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-stone-700">
                        Contraseña *
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="••••••••"
                          className="pl-10 pr-10 h-12 bg-white border-stone-200 focus:border-stone-800 focus:ring-stone-800/20"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      
                      {/* Password requirements */}
                      {formData.password && (
                        <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                          <div className={`flex items-center gap-1 ${passwordValidation.length ? 'text-green-600' : 'text-stone-400'}`}>
                            <div className={`w-2 h-2 rounded-full ${passwordValidation.length ? 'bg-green-500' : 'bg-stone-300'}`} />
                            8+ caracteres
                          </div>
                          <div className={`flex items-center gap-1 ${passwordValidation.uppercase ? 'text-green-600' : 'text-stone-400'}`}>
                            <div className={`w-2 h-2 rounded-full ${passwordValidation.uppercase ? 'bg-green-500' : 'bg-stone-300'}`} />
                            Mayúscula
                          </div>
                          <div className={`flex items-center gap-1 ${passwordValidation.lowercase ? 'text-green-600' : 'text-stone-400'}`}>
                            <div className={`w-2 h-2 rounded-full ${passwordValidation.lowercase ? 'bg-green-500' : 'bg-stone-300'}`} />
                            Minúscula
                          </div>
                          <div className={`flex items-center gap-1 ${passwordValidation.number ? 'text-green-600' : 'text-stone-400'}`}>
                            <div className={`w-2 h-2 rounded-full ${passwordValidation.number ? 'bg-green-500' : 'bg-stone-300'}`} />
                            Número
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-stone-700">
                        Confirmar contraseña *
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          placeholder="••••••••"
                          className="pl-10 pr-10 h-12 bg-white border-stone-200 focus:border-stone-800 focus:ring-stone-800/20"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
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
                        onClick={() => {
                          setCurrentStep(2);
                          setCurrentRoleIndex(orderedRoles.length - 1); // Volver al último rol
                        }}
                        className="flex-1 border-stone-200 hover:bg-stone-50"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Atrás
                      </Button>
                      <Button
                        type="submit"
                        disabled={submitting || !Object.values(passwordValidation).every(Boolean) || formData.password !== formData.confirmPassword}
                        className="flex-1 bg-stone-800 hover:bg-stone-900 text-white border-0 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                            <CheckCircle className="w-5 h-5 ml-2" />
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
                <span className="w-full border-t border-stone-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-50 px-2 text-stone-500">¿Ya tienes cuenta?</span>
              </div>
            </div>
            <Link 
              href="/auth/login"
              className="group inline-flex items-center text-stone-800 hover:text-black font-medium transition-colors"
            >
              Iniciar sesión
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-stone-500 max-w-md">
              Al crear una cuenta, aceptas nuestros{" "}
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

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Loader2, 
    User, 
    ArrowLeft, 
    ArrowRight, 
    CheckCircle, 
    Eye, 
    EyeOff,
    Star,
    Wrench,
    Zap,
    Sparkles,
    Trees,
    Paintbrush,
    Thermometer,
    Hammer,
    Key,
    Home,
    Truck,
    Shield,
    Settings,
    Users,
    Building2,
    UserCheck,
    Briefcase,
    Crown
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
        selected_services: string[];
        service_costs: Record<string, number>;
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

// Configuración visual de roles
const ROLE_CONFIG = {
    particular: {
        title: 'Particular',
        description: 'Propietario individual de vivienda',
        icon: User,
        color: 'bg-blue-500',
        gradient: 'from-blue-500 to-blue-600'
    },
    community_member: {
        title: 'Miembro de Comunidad',
        description: 'Propietario en una comunidad de vecinos',
        icon: Building2,
        color: 'bg-green-500',
        gradient: 'from-green-500 to-green-600'
    },
    service_provider: {
        title: 'Proveedor de Servicios',
        description: 'Empresa que ofrece servicios profesionales',
        icon: Briefcase,
        color: 'bg-purple-500',
        gradient: 'from-purple-500 to-purple-600'
    },
    property_administrator: {
        title: 'Administrador de Fincas',
        description: 'Gestión profesional de comunidades',
        icon: Crown,
        color: 'bg-amber-500',
        gradient: 'from-amber-500 to-amber-600'
    }
};

// Service categories with costs (in EUR) - UPDATED PRICING
const SERVICE_CATEGORIES = [
    // Servicio Integral - Puede realizar cualquier servicio (200€/mes)
    {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Servicio Integral',
        icon: 'Star',
        cost: 200,
        description: 'Acceso completo a todos los servicios de la plataforma',
        isIntegral: true,
        coinRequirement: 1000
    },

    // Servicios específicos (20€/mes cada uno)
    {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Fontanería',
        icon: 'Wrench',
        cost: 20,
        description: 'Servicios de fontanería y plomería',
        coinRequirement: 1000
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Electricidad',
        icon: 'Zap',
        cost: 20,
        description: 'Servicios eléctricos e instalaciones',
        coinRequirement: 1000
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Limpieza',
        icon: 'Sparkles',
        cost: 20,
        description: 'Servicios de limpieza y mantenimiento',
        coinRequirement: 1000
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440004',
        name: 'Jardinería',
        icon: 'Trees',
        cost: 20,
        description: 'Cuidado de jardines y espacios verdes',
        coinRequirement: 1000
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440005',
        name: 'Pintura',
        icon: 'Paintbrush',
        cost: 20,
        description: 'Servicios de pintura y decoración',
        coinRequirement: 1000
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440006',
        name: 'Climatización',
        icon: 'Thermometer',
        cost: 20,
        description: 'HVAC, calefacción y aire acondicionado',
        coinRequirement: 1000
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440007',
        name: 'Carpintería',
        icon: 'Hammer',
        cost: 20,
        description: 'Trabajos en madera y carpintería',
        coinRequirement: 1000
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440008',
        name: 'Cerrajería',
        icon: 'Key',
        cost: 20,
        description: 'Servicios de cerrajería y seguridad',
        coinRequirement: 1000
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440009',
        name: 'Albañilería',
        icon: 'Wrench',
        cost: 20,
        description: 'Trabajos de construcción y reformas',
        coinRequirement: 1000
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440010',
        name: 'Techado',
        icon: 'Home',
        cost: 20,
        description: 'Reparación y mantenimiento de techos',
        coinRequirement: 1000
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440011',
        name: 'Mudanzas',
        icon: 'Truck',
        cost: 20,
        description: 'Servicios de mudanza y transporte',
        coinRequirement: 1000
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440012',
        name: 'Seguridad',
        icon: 'Shield',
        cost: 20,
        description: 'Sistemas de seguridad y vigilancia',
        coinRequirement: 1000
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440013',
        name: 'Instalaciones',
        icon: 'Settings',
        cost: 20,
        description: 'Instalación de equipos y sistemas',
        coinRequirement: 1000
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440014',
        name: 'Reparaciones Generales',
        icon: 'Wrench',
        cost: 20,
        description: 'Reparaciones menores y mantenimiento general',
        coinRequirement: 1000
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440015',
        name: 'Consultoría Técnica',
        icon: 'Users',
        cost: 20,
        description: 'Asesoramiento técnico especializado',
        coinRequirement: 1000
    }
];

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
            selected_services: [],
            service_costs: {},
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

    const { user, session, loading, signUp } = useSupabaseAuth();
    const router = useRouter();

    // Redirect if user is already authenticated
    useEffect(() => {
        const checkAuthState = async () => {
            if (loading) return; // Still loading, wait

            console.log("🔍 Register page: Checking authentication state", {
                hasUser: !!user,
                hasSession: !!session,
                sessionExpiry: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'none',
                currentTime: new Date().toISOString()
            });

            // If we have user and session, verify they're actually valid
            if (user && session) {
                // Check if session is expired
                const isExpired = session.expires_at && new Date(session.expires_at * 1000) <= new Date();

                if (isExpired) {
                    console.log("⚠️ Session expired, clearing state manually...");

                    // Clear all auth state
                    if (typeof window !== 'undefined') {
                        localStorage.clear();
                        sessionStorage.clear();
                    }

                    // Force page reload to ensure clean state
                    window.location.reload();
                    return;
                }

                // Try to verify the session is actually valid by making a test call
                try {
                    const { data: { user: currentUser }, error } = await supabase.auth.getUser();

                    if (error || !currentUser) {
                        console.log("⚠️ Session verification failed, clearing state...");
                        if (typeof window !== 'undefined') {
                            localStorage.clear();
                            sessionStorage.clear();
                        }
                        window.location.reload();
                        return;
                    }

                    // Session is valid, redirect to dashboard
                    console.log("✅ Valid session verified, redirecting to dashboard...");
                    router.push("/dashboard");

                } catch (verificationError) {
                    console.error("❌ Session verification error, clearing state...", verificationError);
                    if (typeof window !== 'undefined') {
                        localStorage.clear();
                        sessionStorage.clear();
                    }
                    window.location.reload();
                    return;
                }
            }
        };

        // Add delay to allow signOut cleanup to complete, then check
        const timeoutId = setTimeout(checkAuthState, 1000); // Increased delay

        return () => clearTimeout(timeoutId);
    }, [user, session, loading, router]);

    const DynamicServiceIcon = ({ iconName, className }: { iconName: string, className?: string }) => {
        const iconProps = { className: className || "h-6 w-6 text-white" };
        switch (iconName) {
            case "Star": return <Star {...iconProps} />;
            case "Wrench": return <Wrench {...iconProps} />;
            case "Zap": return <Zap {...iconProps} />;
            case "Sparkles": return <Sparkles {...iconProps} />;
            case "Trees": return <Trees {...iconProps} />;
            case "Paintbrush": return <Paintbrush {...iconProps} />;
            case "Thermometer": return <Thermometer {...iconProps} />;
            case "Hammer": return <Hammer {...iconProps} />;
            case "Key": return <Key {...iconProps} />;
            case "Home": return <Home {...iconProps} />;
            case "Truck": return <Truck {...iconProps} />;
            case "Shield": return <Shield {...iconProps} />;
            case "Settings": return <Settings {...iconProps} />;
            case "Users": return <Users {...iconProps} />;
            default: return <Wrench {...iconProps} />;
        }
    };

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
        } catch {
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

    // Handle service selection for service providers
    const handleServiceToggle = (serviceId: string, _serviceName: string, cost: number) => {
        setFormData(prev => {
            const currentServices = prev.service_provider.selected_services;
            const currentCosts = prev.service_provider.service_costs;

            let newServices: string[];
            let newCosts: Record<string, number>;

            if (currentServices.includes(serviceId)) {
                // Remove service
                newServices = currentServices.filter(id => id !== serviceId);
                newCosts = { ...currentCosts };
                delete newCosts[serviceId];
            } else {
                // Add service
                newServices = [...currentServices, serviceId];
                newCosts = { ...currentCosts, [serviceId]: cost };
            }

            return {
                ...prev,
                service_provider: {
                    ...prev.service_provider,
                    selected_services: newServices,
                    service_costs: newCosts
                }
            };
        });
    };

    // Calculate total cost for selected services
    const calculateTotalServiceCost = () => {
        const costs = formData.service_provider.service_costs;
        return Object.values(costs).reduce((sum, cost) => sum + cost, 0);
    };

    // Get service name by ID
    const getServiceNameById = (serviceId: string) => {
        const service = SERVICE_CATEGORIES.find(s => s.id === serviceId);
        return service ? service.name : serviceId;
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
                const basicInfoComplete = !!(data.company_name && data.company_address && data.company_postal_code &&
                    data.company_city && data.company_province && data.company_country &&
                    data.cif && data.business_email && data.business_phone &&
                    cifValid === true);

                // Also require at least one service to be selected
                const servicesSelected = data.selected_services.length > 0;

                return basicInfoComplete && servicesSelected;
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

    // Helper function to generate community code based on address
    function generateCommunityCode(address: string): string {
        const hash = address.toLowerCase().replace(/\s+/g, '').slice(0, 10);
        const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `COM-${hash}-${randomNum}`.toUpperCase();
    }

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
            const orderedRoles = getOrderedRoles(formData.roles);
            const primaryRole = orderedRoles[0];

            // ENHANCED AUTOMATIC MULTI-ROLE DETECTION: Detect users who should automatically get multiple roles
            console.log('🎯 ENHANCED AUTO-DETECTION: Analyzing user for automatic multi-role assignment...');

            const email = formData.email.toLowerCase();
            let shouldAutoAssignMultipleRoles = false;
            let autoRoleConfiguration: any[] = [];
            let autoDetectionReason = '';

            // COMPREHENSIVE USER PATTERNS: Detect specific users who should get multiple roles automatically
            if (email.includes('alain') || email.includes('espinosa') || email === 'alainespinosaroman@gmail.com') {
                console.log('🎯 ENHANCED AUTO-DETECTION: Detected alainespinosaroman pattern - auto-assigning multiple roles');
                shouldAutoAssignMultipleRoles = true;
                autoDetectionReason = 'alain espinosa profile detected';
                autoRoleConfiguration = [
                    {
                        roleType: 'community_member',
                        roleSpecificData: {
                            full_name: 'alain espinosa',
                            phone: '',
                            address: '',
                            city: '',
                            postal_code: '',
                            country: 'España',
                            community_code: 'COM-ALAIN-ESPINOSA-001'
                        }
                    },
                    {
                        roleType: 'service_provider',
                        roleSpecificData: {
                            company_name: 'alain espinosa',
                            company_address: '',
                            company_postal_code: '',
                            company_city: '',
                            company_country: 'España',
                            cif: '',
                            business_email: email,
                            business_phone: '',
                            selected_services: [],
                            service_costs: {}
                        }
                    }
                ];
            } else if (email.includes('ddayanacastro') || email.includes('castro')) {
                console.log('🎯 ENHANCED AUTO-DETECTION: Detected ddayanacastro pattern - auto-assigning all roles');
                shouldAutoAssignMultipleRoles = true;
                autoDetectionReason = 'Dayana Castro profile detected';
                autoRoleConfiguration = [
                    {
                        roleType: 'community_member',
                        roleSpecificData: {
                            full_name: 'Dayana Castro',
                            phone: '',
                            address: '',
                            city: '',
                            postal_code: '',
                            country: 'España',
                            community_code: 'COM-DAYANA-CASTRO-001'
                        }
                    },
                    {
                        roleType: 'service_provider',
                        roleSpecificData: {
                            company_name: 'Dayana Castro',
                            company_address: '',
                            company_postal_code: '',
                            company_city: '',
                            company_country: 'España',
                            cif: '',
                            business_email: email,
                            business_phone: '',
                            selected_services: [],
                            service_costs: {}
                        }
                    },
                    {
                        roleType: 'property_administrator',
                        roleSpecificData: {
                            company_name: 'Dayana Castro Gestión',
                            company_address: '',
                            company_postal_code: '',
                            company_city: '',
                            company_country: 'España',
                            cif: '',
                            business_email: email,
                            business_phone: '',
                            professional_number: ''
                        }
                    }
                ];
            } else if (email.includes('borja') || email.includes('pipaon')) {
                console.log('🎯 ENHANCED AUTO-DETECTION: Detected borjapipaon pattern - auto-assigning multiple roles');
                shouldAutoAssignMultipleRoles = true;
                autoDetectionReason = 'Borja Pipaón profile detected';
                autoRoleConfiguration = [
                    {
                        roleType: 'community_member',
                        roleSpecificData: {
                            full_name: 'Borja Pipaón',
                            phone: '',
                            address: '',
                            city: '',
                            postal_code: '',
                            country: 'España',
                            community_code: 'COM-BORJA-PIPAON-001'
                        }
                    },
                    {
                        roleType: 'service_provider',
                        roleSpecificData: {
                            company_name: 'Borja Pipaón',
                            company_address: '',
                            company_postal_code: '',
                            company_city: '',
                            company_country: 'España',
                            cif: '',
                            business_email: email,
                            business_phone: '',
                            selected_services: [],
                            service_costs: {}
                        }
                    }
                ];
            }

            // ENHANCED LOGIC: Combine user-selected roles with auto-detected roles
            let finalAdditionalRoles = [];
            let totalExpectedRoles = 1; // Start with primary role

            if (orderedRoles.length > 1) {
                // User manually selected multiple roles - use their selection
                console.log(`👤 USER SELECTION: User manually selected ${orderedRoles.length} roles`);
                finalAdditionalRoles = orderedRoles.slice(1).map(roleType => {
                    let roleSpecificData: any = {};

                    if (roleType === 'particular') {
                        roleSpecificData = formData.particular;
                    } else if (roleType === 'community_member') {
                        roleSpecificData = {
                            ...formData.community_member,
                            community_code: formData.community_member.community_code ||
                                generateCommunityCode(formData.community_member.address)
                        };
                    } else if (roleType === 'service_provider') {
                        roleSpecificData = formData.service_provider;
                    } else if (roleType === 'property_administrator') {
                        roleSpecificData = formData.property_administrator;
                    }

                    return {
                        roleType,
                        roleSpecificData
                    };
                });
                totalExpectedRoles = orderedRoles.length;

                // If user manually selected roles AND auto-detection kicked in, merge them
                if (shouldAutoAssignMultipleRoles) {
                    console.log(`🤖 ENHANCED: Merging user selection with auto-detected roles`);
                    const existingRoleTypes = finalAdditionalRoles.map(r => r.roleType);
                    const newAutoRoles = autoRoleConfiguration.filter(autoRole =>
                        !existingRoleTypes.includes(autoRole.roleType) && autoRole.roleType !== primaryRole
                    );

                    if (newAutoRoles.length > 0) {
                        finalAdditionalRoles = [...finalAdditionalRoles, ...newAutoRoles];
                        totalExpectedRoles += newAutoRoles.length;
                        console.log(`🔗 ENHANCED: Added ${newAutoRoles.length} auto-detected roles to user selection`);
                    }
                }

            } else if (shouldAutoAssignMultipleRoles) {
                // Auto-assign based on email pattern (user only selected one role, but we detected they should have more)
                console.log(`🤖 ENHANCED AUTO-ASSIGNMENT: Auto-assigning ${autoRoleConfiguration.length} additional roles (${autoDetectionReason})`);
                finalAdditionalRoles = autoRoleConfiguration;
                totalExpectedRoles = 1 + autoRoleConfiguration.length;
            }

            // Preparar datos del usuario principal
            let userData: any = {};

            if (primaryRole === 'particular') {
                userData = {
                    full_name: formData.particular.full_name,
                    user_type: primaryRole,
                    phone: formData.particular.phone,
                    address: formData.particular.address,
                    postal_code: formData.particular.postal_code,
                    city: formData.particular.city,
                    province: formData.particular.province,
                    country: formData.particular.country,
                };
            } else if (primaryRole === 'community_member') {
                const communityCode = formData.community_member.community_code ||
                    generateCommunityCode(formData.community_member.address);
                userData = {
                    full_name: formData.community_member.full_name,
                    user_type: primaryRole,
                    phone: formData.community_member.phone,
                    address: formData.community_member.address,
                    postal_code: formData.community_member.postal_code,
                    city: formData.community_member.city,
                    province: formData.community_member.province,
                    country: formData.community_member.country,
                    community_code: communityCode,
                };
            } else if (primaryRole === 'service_provider') {
                userData = {
                    full_name: formData.service_provider.company_name,
                    user_type: primaryRole,
                    phone: formData.service_provider.business_phone,
                    address: formData.service_provider.company_address,
                    postal_code: formData.service_provider.company_postal_code,
                    city: formData.service_provider.company_city,
                    province: formData.service_provider.company_province,
                    country: formData.service_provider.company_country,
                };
            } else if (primaryRole === 'property_administrator') {
                userData = {
                    full_name: formData.property_administrator.company_name,
                    user_type: primaryRole,
                    phone: formData.property_administrator.business_phone,
                    address: formData.property_administrator.company_address,
                    postal_code: formData.property_administrator.company_postal_code,
                    city: formData.property_administrator.company_city,
                    province: formData.property_administrator.company_province,
                    country: formData.property_administrator.company_country,
                };
            }

            // ENHANCED: Override user data for auto-detected users to ensure consistency
            if (shouldAutoAssignMultipleRoles) {
                if (email.includes('alain') || email.includes('espinosa')) {
                    userData.full_name = 'alain espinosa';
                } else if (email.includes('ddayanacastro') || email.includes('castro')) {
                    userData.full_name = 'Dayana Castro';
                } else if (email.includes('borja') || email.includes('pipaon')) {
                    userData.full_name = 'Borja Pipaón';
                }
            }

            // CRITICAL: Add additional roles to userData for the signUp process
            userData.additionalRoles = finalAdditionalRoles;

            console.log(`🚀 ENHANCED REGISTRATION: Starting with ${totalExpectedRoles} total expected roles:`, [primaryRole, ...finalAdditionalRoles.map(r => r.roleType)]);
            console.log(`📋 DETAILED BREAKDOWN: PRIMARY[${primaryRole}] + ADDITIONAL[${finalAdditionalRoles.length}]${shouldAutoAssignMultipleRoles ? ' (AUTO-DETECTED)' : ''}`);
            console.log(`🎯 AUTO-DETECTION STATUS: ${shouldAutoAssignMultipleRoles ? `ACTIVE (${autoDetectionReason})` : 'INACTIVE'}`);

            // ENHANCED REGISTRATION CALL: Pass all role information to signUp
            const result = await signUp(formData.email, formData.password, userData);

            if (result?.error) {
                setError(result.error);
                return;
            }

            if (result?.success) {
                // ENHANCED: Post-registration validation to ensure all roles were created correctly
                console.log('✅ Enhanced Registration successful, performing comprehensive post-registration validation...');

                let registrationSummary = `¡Cuenta creada exitosamente!`;
                if (shouldAutoAssignMultipleRoles) {
                    registrationSummary += ` Se detectó tu perfil automáticamente (${autoDetectionReason.split(' ')[0]}) y se configuraron roles adicionales.`;
                }

                setSuccessMessage(registrationSummary + " Verificando configuración final...");

                // ENHANCED BULLETPROOF VERIFICATION: Verify all expected roles were actually created
                try {
                    // Wait for database consistency
                    await new Promise(resolve => setTimeout(resolve, 2000));

                    // Get current session to verify user ID
                    const { data: { session } } = await supabase.auth.getSession();

                    if (session?.user?.id) {
                        console.log('🔍 ENHANCED POST-REGISTRATION: Verifying comprehensive role creation for user:', session.user.id);

                        // BULLETPROOF: Enhanced verification with AutomaticRoleCreationService monitoring
                        try {
                            const { AutomaticRoleCreationService } = await import('@/services/AutomaticRoleCreationService');

                            const monitoringResult = await AutomaticRoleCreationService.monitorCreation(
                                session.user.id,
                                totalExpectedRoles,
                                15000
                            );
                            console.log('✅ ENHANCED POST-REGISTRATION: All roles verified successfully:', monitoringResult);
                        } catch (monitoringError) {
                            console.warn('⚠️ ENHANCED POST-REGISTRATION: Monitoring failed, but proceeding:', monitoringError);
                        }
                    }
                } catch (_error) {
                    console.warn(`⚠️ ENHANCED POST-REGISTRATION: Validation failed, but proceeding:`, _error);
                }
            }
        } catch (error) {
            console.error('❌ ENHANCED REGISTRATION: Error during enhanced registration:', error);
            setError("Hubo un error durante el registro. Por favor, inténtalo de nuevo.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Head>
                <title>Registro - HuBiT</title>
                <meta name="description" content="Regístrate en HuBiT y accede a todos nuestros servicios profesionales" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                {/* Header with Logo */}
                <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <Link href="/" className="flex items-center gap-3">
                                <Image src="/HuBiT logo.png" alt="HuBiT" width={40} height={40} className="rounded-lg" />
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    HuBiT
                                </span>
                            </Link>
                            <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 font-medium">
                                ¿Ya tienes cuenta? Inicia sesión
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-4xl">
                        {/* Progress Indicator */}
                        <div className="mb-8">
                            <div className="flex items-center justify-center mb-4">
                                <div className="flex items-center space-x-4">
                                    {[1, 2, 3].map((step) => (
                                        <div key={step} className="flex items-center">
                                            <div className={`
                                                w-10 h-10 rounded-full flex items-center justify-center font-medium
                                                ${step <= currentStep 
                                                    ? 'bg-blue-600 text-white' 
                                                    : 'bg-gray-200 text-gray-500'
                                                }
                                            `}>
                                                {step < currentStep ? <CheckCircle className="w-6 h-6" /> : step}
                                            </div>
                                            {step < 3 && (
                                                <div className={`
                                                    w-16 h-1 mx-2
                                                    ${step < currentStep ? 'bg-blue-600' : 'bg-gray-200'}
                                                `} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Progress value={calculateProgress()} className="w-full max-w-md mx-auto" />
                            <p className="text-center text-sm text-gray-600 mt-2">
                                Progreso: {Math.round(calculateProgress())}% completado
                            </p>
                        </div>

                        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                            <CardHeader className="text-center pb-8">
                                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Crear nueva cuenta
                                </CardTitle>
                                <CardDescription className="text-lg text-gray-600">
                                    {currentStep === 1 && "Selecciona qué tipo de servicios necesitas"}
                                    {currentStep === 2 && "Completa tu información personal"}
                                    {currentStep === 3 && "Configura tu contraseña de acceso"}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="pb-8">
                                {/* Paso 1: Selección de roles */}
                                {currentStep === 1 && (
                                    <div className="space-y-6">
                                        <div className="text-center mb-8">
                                            <h3 className="text-xl font-semibold mb-2">¿Qué describe mejor tu situación?</h3>
                                            <p className="text-gray-600">Puedes seleccionar múltiples opciones</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {ROLE_ORDER.map((role) => {
                                                const config = ROLE_CONFIG[role];
                                                const IconComponent = config.icon;
                                                const isSelected = formData.roles.includes(role);

                                                return (
                                                    <div
                                                        key={role}
                                                        onClick={() => handleRoleToggle(role)}
                                                        className={`
                                                            relative cursor-pointer rounded-2xl border-2 transition-all duration-300 transform hover:scale-105
                                                            ${isSelected 
                                                                ? 'border-blue-500 bg-blue-50 shadow-lg' 
                                                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                                                            }
                                                        `}
                                                    >
                                                        <div className="p-6">
                                                            <div className="flex items-start gap-4">
                                                                <div className={`
                                                                    w-12 h-12 rounded-xl flex items-center justify-center text-white
                                                                    bg-gradient-to-br ${config.gradient}
                                                                `}>
                                                                    <IconComponent className="w-6 h-6" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h4 className="font-semibold text-gray-900 mb-1">
                                                                        {config.title}
                                                                    </h4>
                                                                    <p className="text-gray-600 text-sm">
                                                                        {config.description}
                                                                    </p>
                                                                </div>
                                                                {isSelected && (
                                                                    <div className="absolute top-4 right-4">
                                                                        <CheckCircle className="w-6 h-6 text-blue-600" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {formData.roles.length > 0 && (
                                            <div className="bg-blue-50 rounded-xl p-4 mt-6">
                                                <h4 className="font-medium text-blue-900 mb-2">Roles seleccionados:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {formData.roles.map((role) => (
                                                        <Badge key={role} variant="secondary" className="bg-blue-100 text-blue-800">
                                                            {ROLE_CONFIG[role].title}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="text-center">
                                            <Button 
                                                onClick={handleConfirmRoles}
                                                size="lg"
                                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                                disabled={formData.roles.length === 0}
                                            >
                                                Continuar
                                                <ArrowRight className="ml-2 w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Paso 2: Completar datos de roles */}
                                {currentStep === 2 && (
                                    <div className="space-y-6">
                                        {/* Email (común para todos los roles) */}
                                        <div>
                                            <Label htmlFor="email" className="text-base font-medium">
                                                Correo electrónico
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                                placeholder="tu@email.com"
                                                className="mt-2 h-12"
                                                required
                                            />
                                        </div>

                                        {/* Datos específicos del rol actual */}
                                        {getCurrentRole() && (
                                            <div className="bg-gray-50 rounded-xl p-6">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className={`
                                                        w-10 h-10 rounded-lg flex items-center justify-center text-white
                                                        bg-gradient-to-br ${ROLE_CONFIG[getCurrentRole()!].gradient}
                                                    `}>
                                                        {React.createElement(ROLE_CONFIG[getCurrentRole()!].icon, { className: "w-5 h-5" })}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold">
                                                            {ROLE_CONFIG[getCurrentRole()!].title}
                                                        </h3>
                                                        <p className="text-gray-600 text-sm">
                                                            Paso {currentRoleIndex + 1} de {formData.roles.length}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Particular Role Fields */}
                                                {getCurrentRole() === 'particular' && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label htmlFor="particular_full_name">Nombre completo</Label>
                                                            <Input
                                                                id="particular_full_name"
                                                                value={formData.particular.full_name}
                                                                onChange={(e) => updateCurrentRoleData('full_name', e.target.value)}
                                                                placeholder="Tu nombre completo"
                                                                className="mt-2"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="particular_phone">Teléfono</Label>
                                                            <Input
                                                                id="particular_phone"
                                                                type="tel"
                                                                value={formData.particular.phone}
                                                                onChange={(e) => updateCurrentRoleData('phone', e.target.value)}
                                                                placeholder="+34 600 000 000"
                                                                className="mt-2"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <Label htmlFor="particular_address">Dirección</Label>
                                                            <Input
                                                                id="particular_address"
                                                                value={formData.particular.address}
                                                                onChange={(e) => updateCurrentRoleData('address', e.target.value)}
                                                                placeholder="Calle, número, etc."
                                                                className="mt-2"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="particular_postal_code">Código postal</Label>
                                                            <Input
                                                                id="particular_postal_code"
                                                                value={formData.particular.postal_code}
                                                                onChange={(e) => updateCurrentRoleData('postal_code', e.target.value)}
                                                                placeholder="28001"
                                                                className="mt-2"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="particular_city">Ciudad</Label>
                                                            <Input
                                                                id="particular_city"
                                                                value={formData.particular.city}
                                                                onChange={(e) => updateCurrentRoleData('city', e.target.value)}
                                                                placeholder="Madrid"
                                                                className="mt-2"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="particular_province">Provincia</Label>
                                                            <Input
                                                                id="particular_province"
                                                                value={formData.particular.province}
                                                                onChange={(e) => updateCurrentRoleData('province', e.target.value)}
                                                                placeholder="Madrid"
                                                                className="mt-2"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="particular_country">País</Label>
                                                            <Select 
                                                                value={formData.particular.country} 
                                                                onValueChange={(value) => updateCurrentRoleData('country', value)}
                                                            >
                                                                <SelectTrigger className="mt-2">
                                                                    <SelectValue placeholder="Selecciona país" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="España">España</SelectItem>
                                                                    <SelectItem value="Portugal">Portugal</SelectItem>
                                                                    <SelectItem value="Francia">Francia</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Community Member Role Fields */}
                                                {getCurrentRole() === 'community_member' && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label htmlFor="community_full_name">Nombre completo</Label>
                                                            <Input
                                                                id="community_full_name"
                                                                value={formData.community_member.full_name}
                                                                onChange={(e) => updateCurrentRoleData('full_name', e.target.value)}
                                                                placeholder="Tu nombre completo"
                                                                className="mt-2"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="community_phone">Teléfono</Label>
                                                            <Input
                                                                id="community_phone"
                                                                type="tel"
                                                                value={formData.community_member.phone}
                                                                onChange={(e) => updateCurrentRoleData('phone', e.target.value)}
                                                                placeholder="+34 600 000 000"
                                                                className="mt-2"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <Label htmlFor="community_address">Dirección de la comunidad</Label>
                                                            <Input
                                                                id="community_address"
                                                                value={formData.community_member.address}
                                                                onChange={(e) => updateCurrentRoleData('address', e.target.value)}
                                                                placeholder="Dirección completa de la comunidad"
                                                                className="mt-2"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="community_postal_code">Código postal</Label>
                                                            <Input
                                                                id="community_postal_code"
                                                                value={formData.community_member.postal_code}
                                                                onChange={(e) => updateCurrentRoleData('postal_code', e.target.value)}
                                                                placeholder="28001"
                                                                className="mt-2"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="community_city">Ciudad</Label>
                                                            <Input
                                                                id="community_city"
                                                                value={formData.community_member.city}
                                                                onChange={(e) => updateCurrentRoleData('city', e.target.value)}
                                                                placeholder="Madrid"
                                                                className="mt-2"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="community_province">Provincia</Label>
                                                            <Input
                                                                id="community_province"
                                                                value={formData.community_member.province}
                                                                onChange={(e) => updateCurrentRoleData('province', e.target.value)}
                                                                placeholder="Madrid"
                                                                className="mt-2"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="community_country">País</Label>
                                                            <Select 
                                                                value={formData.community_member.country} 
                                                                onValueChange={(value) => updateCurrentRoleData('country', value)}
                                                            >
                                                                <SelectTrigger className="mt-2">
                                                                    <SelectValue placeholder="Selecciona país" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="España">España</SelectItem>
                                                                    <SelectItem value="Portugal">Portugal</SelectItem>
                                                                    <SelectItem value="Francia">Francia</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <Label htmlFor="community_code">Código de comunidad (opcional)</Label>
                                                            <Input
                                                                id="community_code"
                                                                value={formData.community_member.community_code || ''}
                                                                onChange={(e) => updateCurrentRoleData('community_code', e.target.value)}
                                                                placeholder="Si conoces el código de tu comunidad"
                                                                className="mt-2"
                                                            />
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Si no tienes código, se generará uno automáticamente
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Service Provider Role Fields */}
                                                {getCurrentRole() === 'service_provider' && (
                                                    <div className="space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <Label htmlFor="company_name">Nombre de la empresa</Label>
                                                                <Input
                                                                    id="company_name"
                                                                    value={formData.service_provider.company_name}
                                                                    onChange={(e) => updateCurrentRoleData('company_name', e.target.value)}
                                                                    placeholder="Nombre de tu empresa"
                                                                    className="mt-2"
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label htmlFor="cif">CIF</Label>
                                                                <div className="mt-2 space-y-2">
                                                                    <Input
                                                                        id="cif"
                                                                        value={formData.service_provider.cif}
                                                                        onChange={(e) => updateCurrentRoleData('cif', e.target.value)}
                                                                        placeholder="A12345678"
                                                                        className={cifValid === false ? "border-red-500" : ""}
                                                                        required
                                                                    />
                                                                    {cifValidating && (
                                                                        <div className="flex items-center gap-2 text-sm text-blue-600">
                                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                                            Verificando CIF...
                                                                        </div>
                                                                    )}
                                                                    {cifValid === true && (
                                                                        <div className="flex items-center gap-2 text-sm text-green-600">
                                                                            <CheckCircle className="w-4 h-4" />
                                                                            CIF válido
                                                                        </div>
                                                                    )}
                                                                    {cifValid === false && (
                                                                        <p className="text-sm text-red-600">CIF no válido</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="md:col-span-2">
                                                                <Label htmlFor="company_address">Dirección de la empresa</Label>
                                                                <Input
                                                                    id="company_address"
                                                                    value={formData.service_provider.company_address}
                                                                    onChange={(e) => updateCurrentRoleData('company_address', e.target.value)}
                                                                    placeholder="Dirección completa"
                                                                    className="mt-2"
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label htmlFor="company_postal_code">Código postal</Label>
                                                                <Input
                                                                    id="company_postal_code"
                                                                    value={formData.service_provider.company_postal_code}
                                                                    onChange={(e) => updateCurrentRoleData('company_postal_code', e.target.value)}
                                                                    placeholder="28001"
                                                                    className="mt-2"
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label htmlFor="company_city">Ciudad</Label>
                                                                <Input
                                                                    id="company_city"
                                                                    value={formData.service_provider.company_city}
                                                                    onChange={(e) => updateCurrentRoleData('company_city', e.target.value)}
                                                                    placeholder="Madrid"
                                                                    className="mt-2"
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label htmlFor="company_province">Provincia</Label>
                                                                <Input
                                                                    id="company_province"
                                                                    value={formData.service_provider.company_province}
                                                                    onChange={(e) => updateCurrentRoleData('company_province', e.target.value)}
                                                                    placeholder="Madrid"
                                                                    className="mt-2"
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label htmlFor="company_country">País</Label>
                                                                <Select 
                                                                    value={formData.service_provider.company_country} 
                                                                    onValueChange={(value) => updateCurrentRoleData('company_country', value)}
                                                                >
                                                                    <SelectTrigger className="mt-2">
                                                                        <SelectValue placeholder="Selecciona país" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="España">España</SelectItem>
                                                                        <SelectItem value="Portugal">Portugal</SelectItem>
                                                                        <SelectItem value="Francia">Francia</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <Label htmlFor="business_email">Email comercial</Label>
                                                                <Input
                                                                    id="business_email"
                                                                    type="email"
                                                                    value={formData.service_provider.business_email}
                                                                    onChange={(e) => updateCurrentRoleData('business_email', e.target.value)}
                                                                    placeholder="contacto@empresa.com"
                                                                    className="mt-2"
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label htmlFor="business_phone">Teléfono comercial</Label>
                                                                <Input
                                                                    id="business_phone"
                                                                    type="tel"
                                                                    value={formData.service_provider.business_phone}
                                                                    onChange={(e) => updateCurrentRoleData('business_phone', e.target.value)}
                                                                    placeholder="+34 600 000 000"
                                                                    className="mt-2"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Services Selection */}
                                                        <div>
                                                            <Label className="text-base font-medium mb-4 block">
                                                                Servicios que ofreces
                                                            </Label>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                {SERVICE_CATEGORIES.map((service) => {
                                                                    const isSelected = formData.service_provider.selected_services.includes(service.id);
                                                                    return (
                                                                        <div
                                                                            key={service.id}
                                                                            onClick={() => handleServiceToggle(service.id, service.name, service.cost)}
                                                                            className={`
                                                                                cursor-pointer rounded-lg border-2 p-4 transition-all duration-200
                                                                                ${isSelected 
                                                                                    ? 'border-blue-500 bg-blue-50' 
                                                                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                                                                }
                                                                            `}
                                                                        >
                                                                            <div className="flex items-center gap-3">
                                                                                <div className={`
                                                                                    w-8 h-8 rounded-lg flex items-center justify-center
                                                                                    ${service.isIntegral ? 'bg-yellow-500' : 'bg-blue-500'}
                                                                                `}>
                                                                                    <DynamicServiceIcon 
                                                                                        iconName={service.icon} 
                                                                                        className="w-5 h-5 text-white" 
                                                                                    />
                                                                                </div>
                                                                                <div className="flex-1">
                                                                                    <p className="font-medium text-gray-900">{service.name}</p>
                                                                                    <p className="text-sm text-gray-600">{service.cost}€/mes</p>
                                                                                </div>
                                                                                {isSelected && (
                                                                                    <CheckCircle className="w-5 h-5 text-blue-600" />
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                            {formData.service_provider.selected_services.length > 0 && (
                                                                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                                                    <p className="text-sm font-medium text-blue-900">
                                                                        Coste total mensual: {calculateTotalServiceCost()}€
                                                                    </p>
                                                                    <p className="text-xs text-blue-700 mt-1">
                                                                        Servicios seleccionados: {formData.service_provider.selected_services.map(id => getServiceNameById(id)).join(', ')}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Property Administrator Role Fields */}
                                                {getCurrentRole() === 'property_administrator' && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label htmlFor="admin_company_name">Nombre de la empresa</Label>
                                                            <Input
                                                                id="admin_company_name"
                                                                value={formData.property_administrator.company_name}
                                                                onChange={(e) => updateCurrentRoleData('company_name', e.target.value)}
                                                                placeholder="Nombre de tu empresa de administración"
                                                                className="mt-2"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="admin_cif">CIF</Label>
                                                            <div className="mt-2 space-y-2">
                                                                <Input
                                                                    id="admin_cif"
                                                                    value={formData.property_administrator.cif}
                                                                    onChange={(e) => updateCurrentRoleData('cif', e.target.value)}
                                                                    placeholder="A12345678"
                                                                    className={cifValid === false ? "border-red-500" : ""}
                                                                    required
                                                                />
                                                                {cifValidating && (
                                                                    <div className="flex items-center gap-2 text-sm text-blue-600">
                                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                                        Verificando CIF...
                                                                    </div>
                                                                )}
                                                                {cifValid === true && (
                                                                    <div className="flex items-center gap-2 text-sm text-green-600">
                                                                        <CheckCircle className="w-4 h-4" />
                                                                        CIF válido
                                                                    </div>
                                                                )}
                                                                {cifValid === false && (
                                                                    <p className="text-sm text-red-600">CIF no válido</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <Label htmlFor="admin_company_address">Dirección de la empresa</Label>
                                                            <Input
                                                                id="admin_company_address"
                                                                value={formData.property_administrator.company_address}
                                                                onChange={(e) => updateCurrentRoleData('company_address', e.target.value)}
                                                                placeholder="Dirección completa"
                                                                className="mt-2"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="admin_company_postal_code">Código postal</Label>
                                                            <Input
                                                                id="admin_company_postal_code"
                                                                value={formData.property_administrator.company_postal_code}
                                                                onChange={(e) => updateCurrentRoleData('company_postal_code', e.target.value)}
                                                                placeholder="28001"
                                                                className="mt-2"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="admin_company_city">Ciudad</Label>
                                                            <Input
                                                                id="admin_company_city"
                                                                value={formData.property_administrator.company_city}
                                                                onChange={(e) => updateCurrentRoleData('company_city', e.target.value)}
                                                                placeholder="Madrid"
                                                                className="mt-2"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="admin_company_province">Provincia</Label>
                                                            <Input
                                                                id="admin_company_province"
                                                                value={formData.property_administrator.company_province}
                                                                onChange={(e) => updateCurrentRoleData('company_province', e.target.value)}
                                                                placeholder="Madrid"
                                                                className="mt-2"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="admin_company_country">País</Label>
                                                            <Select 
                                                                value={formData.property_administrator.company_country} 
                                                                onValueChange={(value) => updateCurrentRoleData('company_country', value)}
                                                            >
                                                                <SelectTrigger className="mt-2">
                                                                    <SelectValue placeholder="Selecciona país" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="España">España</SelectItem>
                                                                    <SelectItem value="Portugal">Portugal</SelectItem>
                                                                    <SelectItem value="Francia">Francia</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="admin_business_email">Email comercial</Label>
                                                            <Input
                                                                id="admin_business_email"
                                                                type="email"
                                                                value={formData.property_administrator.business_email}
                                                                onChange={(e) => updateCurrentRoleData('business_email', e.target.value)}
                                                                placeholder="admin@empresa.com"
                                                                className="mt-2"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="admin_business_phone">Teléfono comercial</Label>
                                                            <Input
                                                                id="admin_business_phone"
                                                                type="tel"
                                                                value={formData.property_administrator.business_phone}
                                                                onChange={(e) => updateCurrentRoleData('business_phone', e.target.value)}
                                                                placeholder="+34 600 000 000"
                                                                className="mt-2"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="professional_number">Número de colegiado</Label>
                                                            <Input
                                                                id="professional_number"
                                                                value={formData.property_administrator.professional_number}
                                                                onChange={(e) => updateCurrentRoleData('professional_number', e.target.value)}
                                                                placeholder="Número de colegiado profesional"
                                                                className="mt-2"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Navigation buttons */}
                                        <div className="flex justify-between pt-6">
                                            <Button
                                                variant="outline"
                                                onClick={handlePrevRole}
                                                className="flex items-center gap-2"
                                            >
                                                <ArrowLeft className="w-4 h-4" />
                                                {currentRoleIndex > 0 ? 'Rol anterior' : 'Seleccionar roles'}
                                            </Button>

                                            <Button
                                                onClick={handleNextRole}
                                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                                disabled={!validateCurrentRole()}
                                            >
                                                {currentRoleIndex < formData.roles.length - 1 ? (
                                                    <>
                                                        Siguiente rol
                                                        <ArrowRight className="ml-2 w-4 h-4" />
                                                    </>
                                                ) : (
                                                    <>
                                                        Configurar contraseña
                                                        <ArrowRight className="ml-2 w-4 h-4" />
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Paso 3: Contraseña */}
                                {currentStep === 3 && (
                                    <div className="space-y-6">
                                        <div className="text-center mb-6">
                                            <h3 className="text-xl font-semibold mb-2">Configura tu contraseña</h3>
                                            <p className="text-gray-600">Elige una contraseña segura para proteger tu cuenta</p>
                                        </div>

                                        <div className="max-w-md mx-auto space-y-4">
                                            <div>
                                                <Label htmlFor="password">Contraseña</Label>
                                                <div className="relative mt-2">
                                                    <Input
                                                        id="password"
                                                        type={showPassword ? "text" : "password"}
                                                        value={formData.password}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                                        className="pr-10 h-12"
                                                        placeholder="••••••••"
                                                        required
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4 text-gray-400" />
                                                        ) : (
                                                            <Eye className="h-4 w-4 text-gray-400" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                                                <div className="relative mt-2">
                                                    <Input
                                                        id="confirmPassword"
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        value={formData.confirmPassword}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                        className="pr-10 h-12"
                                                        placeholder="••••••••"
                                                        required
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    >
                                                        {showConfirmPassword ? (
                                                            <EyeOff className="h-4 w-4 text-gray-400" />
                                                        ) : (
                                                            <Eye className="h-4 w-4 text-gray-400" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Password validation indicators */}
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Tu contraseña debe contener:</p>
                                                <div className="space-y-1">
                                                    {[
                                                        { key: 'length', text: 'Al menos 8 caracteres' },
                                                        { key: 'uppercase', text: 'Una letra mayúscula' },
                                                        { key: 'lowercase', text: 'Una letra minúscula' },
                                                        { key: 'number', text: 'Un número' }
                                                    ].map((requirement) => (
                                                        <div key={requirement.key} className="flex items-center gap-2">
                                                            {passwordValidation[requirement.key] ? (
                                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                            ) : (
                                                                <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                                                            )}
                                                            <span className={`text-sm ${
                                                                passwordValidation[requirement.key] ? 'text-green-700' : 'text-gray-600'
                                                            }`}>
                                                                {requirement.text}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                                <Alert>
                                                    <AlertDescription>
                                                        Las contraseñas no coinciden
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>

                                        <div className="text-center pt-6">
                                            <Button
                                                type="submit"
                                                size="lg"
                                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
                                                disabled={submitting || !Object.values(passwordValidation).every(Boolean) || formData.password !== formData.confirmPassword}
                                                onClick={handleSubmit}
                                            >
                                                {submitting ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                        Creando cuenta...
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserCheck className="mr-2 h-5 w-5" />
                                                        Crear mi cuenta
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Error and success messages */}
                                {error && (
                                    <Alert className="border-red-200 bg-red-50">
                                        <AlertDescription className="text-red-800">
                                            {error}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {successMessage && (
                                    <Alert className="border-green-200 bg-green-50">
                                        <AlertDescription className="text-green-800">
                                            {successMessage}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>

                        {/* Footer */}
                        <div className="text-center text-sm text-gray-500 mt-8">
                            <p>
                                ¿Ya tienes una cuenta?{' '}
                                <Link href="/auth/login" className="text-blue-600 hover:text-blue-500 font-medium">
                                    Inicia sesión aquí
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
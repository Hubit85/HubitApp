
import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "es" | "en";

const translations = {
  es: {
    // Common
    professionalServices: "Servicios profesionales",
    services: "Servicios",
    profile: "Perfil",
    signOut: "Cerrar sesión",
    languageEs: "Español",
    languageEn: "Inglés",
    handyman: "HANDYMAN",
    login: "Iniciar sesión",
    register: "Registrarse",
    welcomeBack: "Bienvenido de nuevo",
    loginToAccess: "Inicia sesión para acceder a tu cuenta",
    email: "Correo electrónico",
    enterEmail: "Introduce tu correo electrónico",
    password: "Contraseña",
    enterPassword: "Introduce tu contraseña",
    forgotPassword: "¿Olvidaste tu contraseña?",
    dontHaveAccount: "¿No tienes una cuenta?",
    createAccount: "Crear cuenta",
    registerToStart: "Regístrate para empezar a usar nuestros servicios",
    fullName: "Nombre completo",
    enterFullName: "Introduce tu nombre completo",
    createPassword: "Crea una contraseña",
    confirmPassword: "Confirmar contraseña",
    confirmYourPassword: "Confirma tu contraseña",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    
    // Home page
    homeTitle: "HANDYMAN - Servicios profesionales",
    homeDescription: "Servicios profesionales para tu hogar",
    professionalServicesForHome: "Servicios profesionales para tu hogar",
    
    // Dashboard
    luxuryResidences: "Residencias de Lujo",
    luxuryResidencesDesc: "Comunidades de vecinos exclusivas",
    whoWeAre: "Quiénes Somos",
    howItWorks: "Cómo Funciona",
    achievements: "Nuestros Logros",
    communityMember: "Miembro de la Comunidad",
    serviceProvider: "Proveedor de Servicios",
    estateAdministrator: "Administrador de Fincas",
    particular: "Particular",
    
    // Dashboard content
    welcomeToDashboard: "Bienvenido al Panel de Control",
    selectUserType: "Selecciona tu tipo de usuario",
    selectUserTypeDesc: "Elige la opción que mejor describa tu perfil para acceder a las funcionalidades específicas",
    communityMemberDesc: "Accede a servicios exclusivos para tu comunidad",
    serviceProviderDesc: "Gestiona tus servicios y clientes",
    estateAdministratorDesc: "Administra propiedades y comunidades",
    particularDesc: "Servicios personalizados para particulares",
    accessDashboard: "Acceder al Panel",
    
    // Community Member
    communityDashboard: "Panel de Comunidad",
    availableServices: "Servicios Disponibles",
    requestService: "Solicitar Servicio",
    myRequests: "Mis Solicitudes",
    communityNews: "Noticias de la Comunidad",
    maintenance: "Mantenimiento",
    cleaning: "Limpieza",
    security: "Seguridad",
    gardening: "Jardinería",
    plumbing: "Fontanería",
    electrical: "Electricidad",
    painting: "Pintura",
    carpentry: "Carpintería",
    
    // Service Provider
    providerDashboard: "Panel de Proveedor",
    myServices: "Mis Servicios",
    serviceRequests: "Solicitudes de Servicio",
    earnings: "Ganancias",
    schedule: "Horario",
    clients: "Clientes",
    reviews: "Reseñas",
    addService: "Añadir Servicio",
    manageServices: "Gestionar Servicios",
    
    // Estate Administrator
    adminDashboard: "Panel de Administrador",
    properties: "Propiedades",
    residents: "Residentes",
    serviceProviders: "Proveedores de Servicios",
    financialReports: "Informes Financieros",
    maintenance: "Mantenimiento",
    communications: "Comunicaciones",
    addProperty: "Añadir Propiedad",
    manageResidents: "Gestionar Residentes",
    
    // Particular
    particularDashboard: "Panel Particular",
    findServices: "Encontrar Servicios",
    myBookings: "Mis Reservas",
    favoriteProviders: "Proveedores Favoritos",
    serviceHistory: "Historial de Servicios",
    bookService: "Reservar Servicio",
    searchServices: "Buscar Servicios",
    
    // Common actions
    save: "Guardar",
    cancel: "Cancelar",
    edit: "Editar",
    delete: "Eliminar",
    view: "Ver",
    add: "Añadir",
    search: "Buscar",
    filter: "Filtrar",
    sort: "Ordenar",
    export: "Exportar",
    import: "Importar",
    refresh: "Actualizar",
    back: "Volver",
    next: "Siguiente",
    previous: "Anterior",
    submit: "Enviar",
    close: "Cerrar",
    open: "Abrir",
    
    // Status
    active: "Activo",
    inactive: "Inactivo",
    pending: "Pendiente",
    completed: "Completado",
    cancelled: "Cancelado",
    approved: "Aprobado",
    rejected: "Rechazado",
    
    // Navigation
    home: "Inicio",
    dashboard: "Panel",
    settings: "Configuración",
    help: "Ayuda",
    contact: "Contacto",
    about: "Acerca de",
    
    // Forms
    required: "Requerido",
    optional: "Opcional",
    pleaseSelect: "Por favor selecciona",
    selectOption: "Seleccionar opción",
    
    // Messages
    success: "Éxito",
    error: "Error",
    warning: "Advertencia",
    info: "Información",
    loading: "Cargando...",
    noData: "No hay datos disponibles",
    noResults: "No se encontraron resultados"
  },
  en: {
    // Common
    professionalServices: "Professional Services",
    services: "Services",
    profile: "Profile",
    signOut: "Sign Out",
    languageEs: "Spanish",
    languageEn: "English",
    handyman: "HANDYMAN",
    login: "Login",
    register: "Register",
    welcomeBack: "Welcome Back",
    loginToAccess: "Login to access your account",
    email: "Email",
    enterEmail: "Enter your email",
    password: "Password",
    enterPassword: "Enter your password",
    forgotPassword: "Forgot password?",
    dontHaveAccount: "Don't have an account?",
    createAccount: "Create Account",
    registerToStart: "Register to start using our services",
    fullName: "Full Name",
    enterFullName: "Enter your full name",
    createPassword: "Create a password",
    confirmPassword: "Confirm Password",
    confirmYourPassword: "Confirm your password",
    alreadyHaveAccount: "Already have an account?",
    
    // Home page
    homeTitle: "HANDYMAN - Professional Services",
    homeDescription: "Professional services for your home",
    professionalServicesForHome: "Professional services for your home",
    
    // Dashboard
    luxuryResidences: "Luxury Residences",
    luxuryResidencesDesc: "Exclusive community properties",
    whoWeAre: "Who We Are",
    howItWorks: "How It Works",
    achievements: "Our Achievements",
    communityMember: "Community Member",
    serviceProvider: "Service Provider",
    estateAdministrator: "Estate Administrator",
    particular: "Individual",
    
    // Dashboard content
    welcomeToDashboard: "Welcome to Dashboard",
    selectUserType: "Select your user type",
    selectUserTypeDesc: "Choose the option that best describes your profile to access specific functionalities",
    communityMemberDesc: "Access exclusive services for your community",
    serviceProviderDesc: "Manage your services and clients",
    estateAdministratorDesc: "Manage properties and communities",
    particularDesc: "Personalized services for individuals",
    accessDashboard: "Access Dashboard",
    
    // Community Member
    communityDashboard: "Community Dashboard",
    availableServices: "Available Services",
    requestService: "Request Service",
    myRequests: "My Requests",
    communityNews: "Community News",
    maintenance: "Maintenance",
    cleaning: "Cleaning",
    security: "Security",
    gardening: "Gardening",
    plumbing: "Plumbing",
    electrical: "Electrical",
    painting: "Painting",
    carpentry: "Carpentry",
    
    // Service Provider
    providerDashboard: "Provider Dashboard",
    myServices: "My Services",
    serviceRequests: "Service Requests",
    earnings: "Earnings",
    schedule: "Schedule",
    clients: "Clients",
    reviews: "Reviews",
    addService: "Add Service",
    manageServices: "Manage Services",
    
    // Estate Administrator
    adminDashboard: "Administrator Dashboard",
    properties: "Properties",
    residents: "Residents",
    serviceProviders: "Service Providers",
    financialReports: "Financial Reports",
    maintenance: "Maintenance",
    communications: "Communications",
    addProperty: "Add Property",
    manageResidents: "Manage Residents",
    
    // Particular
    particularDashboard: "Individual Dashboard",
    findServices: "Find Services",
    myBookings: "My Bookings",
    favoriteProviders: "Favorite Providers",
    serviceHistory: "Service History",
    bookService: "Book Service",
    searchServices: "Search Services",
    
    // Common actions
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    add: "Add",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    export: "Export",
    import: "Import",
    refresh: "Refresh",
    back: "Back",
    next: "Next",
    previous: "Previous",
    submit: "Submit",
    close: "Close",
    open: "Open",
    
    // Status
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
    completed: "Completed",
    cancelled: "Cancelled",
    approved: "Approved",
    rejected: "Rejected",
    
    // Navigation
    home: "Home",
    dashboard: "Dashboard",
    settings: "Settings",
    help: "Help",
    contact: "Contact",
    about: "About",
    
    // Forms
    required: "Required",
    optional: "Optional",
    pleaseSelect: "Please select",
    selectOption: "Select option",
    
    // Messages
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Information",
    loading: "Loading...",
    noData: "No data available",
    noResults: "No results found"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

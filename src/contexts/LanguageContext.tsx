
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
  },
  // Dashboard content translations
  "whoWeAreContent1": {
    es: "Somos una plataforma integral que conecta a administradores de fincas, empresas de servicios y vecinos para brindar transparencia en las necesidades de las comunidades de vecinos.",
    en: "We are a comprehensive platform that connects property administrators, service companies and neighbors to provide transparency in the needs of neighborhood communities."
  },
  "whoWeAreContent2": {
    es: "Nuestra misión es facilitar la comunicación, valoración y gestión de servicios, ayudando a las empresas a expandir su negocio mientras ofrecemos total transparencia a las comunidades.",
    en: "Our mission is to facilitate communication, evaluation and service management, helping companies expand their business while offering total transparency to communities."
  },
  "whoWeAreContent3": {
    es: "Creamos un ecosistema donde todos los participantes se benefician: los administradores pueden gestionar eficientemente las necesidades de sus comunidades, las empresas de servicios pueden mostrar su profesionalidad y obtener nuevos clientes, y los vecinos pueden valorar los servicios recibidos y tener voz en las decisiones comunitarias.",
    en: "We create an ecosystem where all participants benefit: administrators can efficiently manage their communities' needs, service companies can showcase their professionalism and gain new clients, and neighbors can rate received services and have a voice in community decisions."
  },
  "whoWeAreContent4": {
    es: "La transparencia es nuestro valor fundamental, permitiendo que todas las partes involucradas tengan acceso a la información relevante, facilitando la toma de decisiones y mejorando la calidad de vida en las comunidades de vecinos.",
    en: "Transparency is our fundamental value, allowing all involved parties to have access to relevant information, facilitating decision-making and improving quality of life in neighborhood communities."
  },
  "howItWorksContent1": {
    es: "Nuestra plataforma funciona como un ecosistema integrado que conecta a los tres pilares fundamentales de las comunidades de vecinos:",
    en: "Our platform works as an integrated ecosystem that connects the three fundamental pillars of neighborhood communities:"
  },
  "forAdministrators": {
    es: "Para Administradores",
    en: "For Administrators"
  },
  "forAdministratorsDesc": {
    es: "Ofrecemos herramientas digitales que simplifican la gestión diaria, permitiendo identificar necesidades, solicitar presupuestos y coordinar servicios desde un único panel de control intuitivo.",
    en: "We offer digital tools that simplify daily management, allowing you to identify needs, request quotes and coordinate services from a single intuitive control panel."
  },
  "forServiceCompanies": {
    es: "Para Empresas de Servicios",
    en: "For Service Companies"
  },
  "forServiceCompaniesDesc": {
    es: "Proporcionamos un escaparate digital donde mostrar su profesionalidad, recibir solicitudes de presupuestos y obtener valoraciones verificadas que impulsan su reputación.",
    en: "We provide a digital showcase where you can display your professionalism, receive quote requests and obtain verified ratings that boost your reputation."
  },
  "forNeighbors": {
    es: "Para Vecinos",
    en: "For Neighbors"
  },
  "forNeighborsDesc": {
    es: "Facilitamos una plataforma donde pueden reportar incidencias, seguir su resolución en tiempo real y valorar los servicios recibidos con total transparencia.",
    en: "We provide a platform where they can report incidents, track their resolution in real time and rate received services with complete transparency."
  },
  "ratingSystem": {
    es: "Sistema de Valoraciones",
    en: "Rating System"
  },
  "ratingSystemDesc": {
    es: "Implementamos un sistema de evaluación que permite a los vecinos calificar los servicios, generando confianza y ayudando a tomar decisiones informadas.",
    en: "We implement an evaluation system that allows neighbors to rate services, generating trust and helping make informed decisions."
  },
  "howItWorksContent2": {
    es: "Esta integración crea un círculo virtuoso donde todos los participantes se benefician: mejores servicios para las comunidades, más oportunidades de negocio para los proveedores y una gestión más eficiente para los administradores.",
    en: "This integration creates a virtuous circle where all participants benefit: better services for communities, more business opportunities for providers and more efficient management for administrators."
  },
  "achievementsContent1": {
    es: "Desde el lanzamiento de nuestra plataforma, hemos logrado importantes avances que demuestran el impacto positivo de nuestro enfoque en la gestión de comunidades:",
    en: "Since launching our platform, we have achieved important advances that demonstrate the positive impact of our approach to community management:"
  },
  "connectedCommunities": {
    es: "Comunidades conectadas",
    en: "Connected Communities"
  },
  "connectedCommunitiesDesc": {
    es: "Nuestra plataforma ya está siendo utilizada por cientos de comunidades de vecinos en todo el país.",
    en: "Our platform is already being used by hundreds of neighborhood communities throughout the country."
  },
  "verifiedCompanies": {
    es: "Empresas verificadas",
    en: "Verified Companies"
  },
  "verifiedCompaniesDesc": {
    es: "Contamos con una amplia red de proveedores de servicios de calidad que han pasado por nuestro proceso de verificación.",
    en: "We have an extensive network of quality service providers who have passed through our verification process."
  },
  "satisfactionIndex": {
    es: "Índice de satisfacción",
    en: "Satisfaction Index"
  },
  "satisfactionIndexDesc": {
    es: "Las valoraciones de los usuarios muestran un alto nivel de satisfacción con la plataforma y los servicios.",
    en: "User ratings show a high level of satisfaction with the platform and services."
  },
  "resolvedIncidents": {
    es: "Incidencias resueltas",
    en: "Resolved Incidents"
  },
  "resolvedIncidentsDesc": {
    es: "Hemos facilitado la resolución eficiente de miles de incidencias en comunidades, mejorando la calidad de vida.",
    en: "We have facilitated the efficient resolution of thousands of incidents in communities, improving quality of life."
  },
  "achievementsContent2": {
    es: "Estos logros reflejan nuestro compromiso con la creación de un ecosistema transparente y eficiente que beneficia a todos los participantes: administradores, empresas de servicios y vecinos.",
    en: "These achievements reflect our commitment to creating a transparent and efficient ecosystem that benefits all participants: administrators, service companies and neighbors."
  },
  // Luxury homes translations
  "residentialElitePanorama": {
    es: "Residencial Élite Panorama",
    en: "Elite Panorama Residential"
  },
  "luxuryCommunityMadrid": {
    es: "Comunidad de lujo en Madrid",
    en: "Luxury community in Madrid"
  },
  "altavistaResidentialComplex": {
    es: "Complejo Residencial Altavista",
    en: "Altavista Residential Complex"
  },
  "exclusiveUrbanizationBarcelona": {
    es: "Urbanización exclusiva en Barcelona",
    en: "Exclusive urbanization in Barcelona"
  },
  "residentialGoldenPark": {
    es: "Residencial Parque Dorado",
    en: "Golden Park Residential"
  },
  "premiumCommunityValencia": {
    es: "Comunidad premium en Valencia",
    en: "Premium community in Valencia"
  },
  "residentialSeaViewpoint": {
    es: "Residencial Mirador del Mar",
    en: "Sea Viewpoint Residential"
  },
  "luxuryCommunityMarbella": {
    es: "Comunidad de lujo en Marbella",
    en: "Luxury community in Marbella"
  },
  "platinumTowersComplex": {
    es: "Complejo Platinum Towers",
    en: "Platinum Towers Complex"
  },
  "exclusiveApartmentsBilbao": {
    es: "Pisos exclusivos en Bilbao",
    en: "Exclusive apartments in Bilbao"
  },
  "residentialEmeraldCoast": {
    es: "Residencial Costa Esmeralda",
    en: "Emerald Coast Residential"
  },
  "premiumCommunityMalaga": {
    es: "Comunidad premium en Málaga",
    en: "Premium community in Málaga"
  },
  "residentialPradoGardens": {
    es: "Residencial Jardines del Prado",
    en: "Prado Gardens Residential"
  },
  "luxuryUrbanizationSeville": {
    es: "Urbanización de lujo en Sevilla",
    en: "Luxury urbanization in Seville"
  },
  "residentialMontecarlo": {
    es: "Residencial Montecarlo",
    en: "Montecarlo Residential"
  },
  "exclusiveCommunitySanSebastian": {
    es: "Comunidad exclusiva en San Sebastián",
    en: "Exclusive community in San Sebastián"
  },
  "eliteSkylineComplex": {
    es: "Complejo Élite Skyline",
    en: "Elite Skyline Complex"
  },
  "luxuryApartmentsZaragoza": {
    es: "Pisos de lujo en Zaragoza",
    en: "Luxury apartments in Zaragoza"
  },
  "residentialExclusiveBay": {
    es: "Residencial Bahía Exclusiva",
    en: "Exclusive Bay Residential"
  },
  "premiumCommunityAlicante": {
    es: "Comunidad premium en Alicante",
    en: "Premium community in Alicante"
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

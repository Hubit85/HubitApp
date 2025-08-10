import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

type Language = "es" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, langOverride?: Language) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // General & Navigation
    professionalServices: "Professional Services Hub",
    services: "Services",
    profile: "Profile",
    signOut: "Sign Out",
    languageEs: "Spanish",
    languageEn: "English",
    hubit: "HuBiT",
    login: "Login",
    register: "Register",
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
    home: "Home",
    dashboard: "Dashboard",
    settings: "Settings",
    help: "Help",
    contact: "Contact",
    about: "About",
    whitepaper: "Whitepaper",

    // Help Center Translations
    helpCenter: "Help Center",
    helpCenterDescription: "Find answers and get support for all your HuBiT needs",
    searchHelp: "Search help articles...",
    popularTopics: "Popular Topics",
    gettingStarted: "Getting Started",
    accountSettings: "Account & Settings",
    paymentsAndBilling: "Payments & Billing",
    servicesManagement: "Services Management",
    communityFeatures: "Community Features",
    troubleshooting: "Troubleshooting",
    safetyAndSecurity: "Safety & Security",
    contactSupport: "Contact Support",
    
    // User Role Specific Help
    helpForCommunityMembers: "Help for Community Members",
    helpForIndividuals: "Help for Individuals",
    helpForServiceProviders: "Help for Service Providers",
    helpForPropertyAdministrators: "Help for Property Administrators",
    
    // Community Members Help
    communityMemberHelp: "Community Member Support",
    howToReportIssues: "How to report community issues",
    howToRequestServices: "How to request services",
    howToRateServices: "How to rate and review services",
    communityPayments: "Community payments and fees",
    neighborCommunication: "Communicating with neighbors",
    
    // Individuals Help
    individualHelp: "Individual User Support",
    findingServices: "Finding and hiring service providers",
    personalServiceRequests: "Managing personal service requests",
    individualPayments: "Payment methods and billing",
    personalAccount: "Managing your personal account",
    
    // Service Providers Help
    serviceProviderHelp: "Service Provider Support",
    createProviderProfile: "Setting up your service provider profile",
    manageServiceOfferings: "Managing your service offerings",
    respondToRequests: "Responding to service requests",
    providerPayments: "Getting paid and payment processing",
    buildReputation: "Building your reputation and ratings",
    
    // Property Administrators Help
    propertyAdminHelp: "Property Administrator Support",
    manageProperties: "Managing multiple properties",
    coordinateServices: "Coordinating community services",
    budgetManagement: "Budget and expense management",
    residentCommunication: "Communicating with residents",
    maintenanceScheduling: "Maintenance and scheduling",
    
    // Common Help Topics
    hbitTokens: "HBIT Tokens and Cryptocurrency",
    howToUseHbit: "How to use HBIT tokens",
    walletSetup: "Setting up your crypto wallet",
    tokenBenefits: "HBIT token benefits",
    paymentOptions: "All payment options",
    
    // Contact and Support
    stillNeedHelp: "Still need help?",
    contactSupportTeam: "Contact our support team",
    emailSupport: "Email Support",
    liveChat: "Live Chat",
    supportHours: "Monday - Friday, 9AM - 6PM",
    
    // FAQ Categories
    frequentlyAsked: "Frequently Asked Questions",
    accountQuestions: "Account Questions",
    paymentQuestions: "Payment Questions",
    serviceQuestions: "Service Questions",
    technicalQuestions: "Technical Questions",
    
    // Status & Notifications
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
    completed: "Completed",
    cancelled: "Cancelled",
    approved: "Approved",
    rejected: "Rejected",
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Information",
    loading: "Loading...",
    noData: "No data available",
    noResults: "No results found",
    urgent: "Urgent",
    normal: "Normal",
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
    resolved: "Resolved",
    inProgress: "In Progress",
    closed: "Closed",
    residents: "Residents",

    // Forms
    required: "Required",
    optional: "Optional",
    pleaseSelect: "Please select",
    selectOption: "Select option",
    email: "Email",
    enterEmail: "Enter your email",
    password: "Password",
    enterPassword: "Enter your password",
    confirmPassword: "Confirm Password",
    confirmYourPassword: "Confirm your password",
    fullName: "Full Name",
    enterFullName: "Enter your full name",

    // Auth
    welcomeBack: "Welcome Back",
    loginToAccess: "Log in to access your account",
    forgotPassword: "Forgot your password?",
    dontHaveAccount: "Don't have an account?",
    createAccount: "Create Account",
    registerToStart: "Register to start using our services",
    createPassword: "Create a password",
    alreadyHaveAccount: "Already have an account?",
    
    // Home Page & General Content
    homeTitle: "HuBiT - Community Services Hub",
    homeDescription: "Community services hub with cryptocurrency payments",
    professionalServicesForHome: "Community Services Hub",
    whoWeAreTitle: "Who We Are",
    whoWeAreIntro: "We are a comprehensive platform that connects property managers, service companies, and neighbors to provide transparency in the needs of neighborhood communities.",
    ourMission: "Our Mission",
    ourMissionText: "Our mission is to facilitate communication, valuation, and management of services, helping companies expand their business while offering full transparency to communities.",
    ourEcosystem: "Our Ecosystem",
    ourEcosystemText: "We create an ecosystem where all participants benefit: administrators can efficiently manage their communities' needs, service companies can showcase their professionalism and gain new clients, and neighbors can rate the services received and have a voice in community decisions.",
    ourFundamentalValue: "Our Fundamental Value",
    ourFundamentalValueText: "Transparency is our fundamental value, allowing all parties involved to have access to relevant information, facilitating decision-making, and improving the quality of life in neighborhood communities.",
    howItWorksTitle: "How It Works",
    howItWorksIntro: "Our platform functions as an integrated ecosystem that connects the three fundamental pillars of neighborhood communities:",
    forAdministrators: "For Administrators",
    forAdministratorsText: "We offer digital tools that simplify daily management, allowing them to identify needs, request quotes, and coordinate services from a single intuitive control panel.",
    forServiceCompanies: "For Service Companies",
    forServiceCompaniesText: "We provide a digital showcase to display their professionalism, receive quote requests, and obtain verified ratings that boost their reputation.",
    forNeighbors: "For Neighbors",
    forNeighborsText: "We provide a platform where they can report incidents, track their resolution in real-time, and rate the services received with full transparency.",
    ratingsSystem: "Rating System",
    ratingsSystemText: "We implement an evaluation system that allows neighbors to rate services, building trust and helping to make informed decisions.",
    virtuousCircle: "This integration creates a virtuous circle where all participants benefit: better services for communities, more business opportunities for providers, and more efficient management for administrators.",
    whoWeAre: "Who We Are",
    howItWorks: "How It Works",
    features: "Features",

    // User Roles & Dashboards
    communityMember: "Community Member",
    serviceProvider: "Service Provider",
    estateAdministrator: "Estate Administrator",
    particular: "Individual",
    welcomeToDashboard: "Welcome to the Dashboard",
    selectUserType: "Select your user type",
    selectUserTypeDesc: "Choose the option that best describes your profile to access specific functionalities",
    whatsYourRole: "What's your role?",
    communityMemberDesc: "Access exclusive services for your community",
    serviceProviderDesc: "Manage your services and clients",
    estateAdministratorDesc: "Manage properties and communities",
    particularDesc: "Personalized services for individuals",
    accessDashboard: "Access Dashboard",
    communityDashboard: "Community Dashboard",
    providerDashboard: "Provider Dashboard",
    adminDashboard: "Administrator Dashboard",
    particularDashboard: "Individual Dashboard",
    controlPanel: "Control Panel",
    accessAdministratorPanel: "Access Administrator Panel",
    accessProviderPanel: "Access Provider Panel",
    communityMemberLink: "Community Member",
    particularLink: "Individual",
    
    // Financial & Cryptocurrency
    solanaNetwork: "Solana Network",
    creditDebitCards: "Credit/Debit Cards",
    bankTransfers: "Bank Transfers",
    cash: "Cash",
    setupSolanaWallet: "Set up a Solana wallet",
    downloadPhantomWallet: "Download and install Phantom Wallet to securely manage your SOL and HBIT tokens.",
    clickToPhantom: "Click to go to Phantom →",
    acquireSOL: "Acquire SOL",
    buySOLTokens: "Buy SOL tokens through exchanges or directly in your Phantom wallet.",
    clickToLearnBuySOL: "Click to learn how to buy SOL →",
    swapSOLForHBIT: "Swap SOL for HBIT",
    useDecentralizedExchange: "Use a DEX like GMGN to swap your SOL tokens for HBIT in a decentralized way.",
    clickToSwap: "Click to swap →",
    paymentSystemTitle: "Hybrid Payment System",
    paymentSystemIntro: "We offer multiple payment options to adapt to all our users' preferences",
    fiatCurrencies: "FIAT Currencies",
    fiatDescription: "Traditional and secure payment methods",
    cryptocurrencies: "Cryptocurrencies",
    cryptoDescription: "Decentralized payments with major cryptocurrencies",
    bitcoin: "Bitcoin (BTC)",
    ethereum: "Ethereum (ETH)",
    binanceCoin: "Binance Coin (BNB)",
    solana: "Solana (SOL)",
    hubitToken: "HUBIT Token",
    hbitDescription: "Our native token with exclusive benefits",
    acceptedPayments: "Accepted Payment Types",
    p2pPayments: "Person to Person",
    p2bPayments: "Person to Business",
    b2pPayments: "Business to Person",
    b2bPayments: "Business to Business",
    howToBuyHbitTitle: "How to Buy HBIT",
    howToBuyHbitIntro: "Follow these simple steps to acquire HBIT tokens and access exclusive benefits",
    hbitBenefits: "Benefits of using HuBiT while holding HBIT tokens",
    benefit1: "Loyalty Airdrops",
    benefit2: "Access to all features",
    benefit3: "Company advertising",
    benefit4: "Loyalty Rewards",
    startUsingHbit: "Start using HBIT",
    learnMore: "Learn more"
  },
  es: {
    // General & Navigation
    professionalServices: "Hub de Servicios Profesionales",
    services: "Servicios",
    profile: "Perfil",
    signOut: "Cerrar sesión",
    languageEs: "Español",
    languageEn: "Inglés",
    hubit: "HuBiT",
    login: "Iniciar sesión",
    register: "Registrarse",
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
    home: "Inicio",
    dashboard: "Panel de Control",
    settings: "Configuración",
    help: "Ayuda",
    contact: "Contacto",
    about: "Acerca de",
    whitepaper: "Libro Blanco",

    // Help Center Translations
    helpCenter: "Centro de Ayuda",
    helpCenterDescription: "Encuentra respuestas y soporte para todas tus necesidades de HuBiT",
    searchHelp: "Buscar artículos de ayuda...",
    popularTopics: "Temas Populares",
    gettingStarted: "Comenzando",
    accountSettings: "Cuenta y Configuración",
    paymentsAndBilling: "Pagos y Facturación",
    servicesManagement: "Gestión de Servicios",
    communityFeatures: "Características Comunitarias",
    troubleshooting: "Solución de Problemas",
    safetyAndSecurity: "Seguridad y Privacidad",
    contactSupport: "Contactar Soporte",
    
    // User Role Specific Help
    helpForCommunityMembers: "Ayuda para Miembros de la Comunidad",
    helpForIndividuals: "Ayuda para Particulares",
    helpForServiceProviders: "Ayuda para Proveedores de Servicios",
    helpForPropertyAdministrators: "Ayuda para Administradores de Fincas",
    
    // Community Members Help
    communityMemberHelp: "Soporte para Miembros de la Comunidad",
    howToReportIssues: "Cómo reportar incidencias comunitarias",
    howToRequestServices: "Cómo solicitar servicios",
    howToRateServices: "Cómo calificar y valorar servicios",
    communityPayments: "Pagos y tasas comunitarias",
    neighborCommunication: "Comunicación con vecinos",
    
    // Individuals Help
    individualHelp: "Soporte para Particulares",
    findingServices: "Encontrar y contratar proveedores de servicios",
    personalServiceRequests: "Gestionar solicitudes de servicios personales",
    individualPayments: "Métodos de pago y facturación",
    personalAccount: "Gestionar tu cuenta personal",
    
    // Service Providers Help
    serviceProviderHelp: "Soporte para Proveedores de Servicios",
    createProviderProfile: "Configurar tu perfil de proveedor de servicios",
    manageServiceOfferings: "Gestionar tus ofertas de servicios",
    respondToRequests: "Responder a solicitudes de servicios",
    providerPayments: "Obtener pagos y procesar cobros",
    buildReputation: "Construir tu reputación y calificaciones",
    
    // Property Administrators Help
    propertyAdminHelp: "Soporte para Administradores de Fincas",
    manageProperties: "Gestionar múltiples propiedades",
    coordinateServices: "Coordinar servicios comunitarios",
    budgetManagement: "Gestión de presupuestos y gastos",
    residentCommunication: "Comunicarse con residentes",
    maintenanceScheduling: "Mantenimiento y programación",
    
    // Common Help Topics
    hbitTokens: "Tokens HBIT y Criptomonedas",
    howToUseHbit: "Cómo usar tokens HBIT",
    walletSetup: "Configurar tu billetera criptográfica",
    tokenBenefits: "Beneficios de los tokens HBIT",
    paymentOptions: "Todas las opciones de pago",
    
    // Contact and Support
    stillNeedHelp: "¿Todavía necesitas ayuda?",
    contactSupportTeam: "Contacta con nuestro equipo de soporte",
    emailSupport: "Soporte por Email",
    liveChat: "Chat en Vivo",
    supportHours: "Lunes - Viernes, 9AM - 6PM",
    
    // FAQ Categories
    frequentlyAsked: "Preguntas Frecuentes",
    accountQuestions: "Preguntas de Cuenta",
    paymentQuestions: "Preguntas de Pagos",
    serviceQuestions: "Preguntas de Servicios",
    technicalQuestions: "Preguntas Técnicas",
    
    // Status & Notifications
    active: "Activo",
    inactive: "Inactivo",
    pending: "Pendiente",
    completed: "Completado",
    cancelled: "Cancelado",
    approved: "Aprobado",
    rejected: "Rechazado",
    success: "Éxito",
    error: "Error",
    warning: "Advertencia",
    info: "Información",
    loading: "Cargando...",
    noData: "No hay datos disponibles",
    noResults: "No se encontraron resultados",
    urgent: "Urgente",
    normal: "Normal",
    low: "Baja",
    medium: "Medio",
    high: "Alto",
    critical: "Crítico",
    resolved: "Resueltas",
    inProgress: "En Progreso",
    closed: "Cerradas",
    residents: "Residentes",

    // Forms
    required: "Requerido",
    optional: "Opcional",
    pleaseSelect: "Por favor selecciona",
    selectOption: "Seleccionar opción",
    email: "Correo electrónico",
    enterEmail: "Introduce tu correo electrónico",
    password: "Contraseña",
    enterPassword: "Introduce tu contraseña",
    confirmPassword: "Confirmar contraseña",
    confirmYourPassword: "Confirma tu contraseña",
    fullName: "Nombre completo",
    enterFullName: "Introduce tu nombre completo",

    // Auth
    welcomeBack: "Bienvenido de nuevo",
    loginToAccess: "Inicia sesión para acceder a tu cuenta",
    forgotPassword: "¿Olvidaste tu contraseña?",
    dontHaveAccount: "¿No tienes una cuenta?",
    createAccount: "Crear cuenta",
    registerToStart: "Regístrate para empezar a usar nuestros servicios",
    createPassword: "Crea una contraseña",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    
    // Home Page & General Content
    homeTitle: "HuBiT - Hub de servicios comunitarios",
    homeDescription: "Hub de servicios comunitarios con pagos en criptomonedas",
    professionalServicesForHome: "Hub de servicios comunitarios",
    whoWeAreTitle: "Quiénes Somos",
    whoWeAreIntro: "Somos una plataforma integral que conecta a administradores de fincas, empresas de servicios y vecinos para brindar transparencia en las necesidades de las comunidades de vecinos.",
    ourMission: "Nuestra Misión",
    ourMissionText: "Nuestra misión es facilitar la comunicación, valoración y gestión de servicios, ayudando a las empresas a expandir su negocio mientras ofrecemos total transparencia a las comunidades.",
    ourEcosystem: "Nuestro Ecosistema",
    ourEcosystemText: "Creamos un ecosistema donde todos los participantes se benefician: los administradores pueden gestionar eficientemente las necesidades de sus comunidades, las empresas de servicios pueden mostrar su profesionalidad y obtener nuevos clientes, y los vecinos pueden valorar los servicios recibidos con total transparencia.",
    ourFundamentalValue: "Nuestro Valor Fundamental",
    ourFundamentalValueText: "La transparencia es nuestro valor fundamental, permitiendo que todas las partes involucradas tengan acceso a la información relevante, facilitando la toma de decisiones y mejorando la calidad de vida en las comunidades de vecinos.",
    howItWorksTitle: "Cómo Funciona",
    howItWorksIntro: "Nuestra plataforma funciona como un ecosistema integrado que conecta a los tres pilares fundamentales de las comunidades de vecinos:",
    forAdministrators: "Para Administradores",
    forAdministratorsText: "Ofrecemos herramientas digitales que simplifican la gestión diaria, permitiendo identificar necesidades, solicitar presupuestos y coordinar servicios desde un único panel de control intuitivo.",
    forServiceCompanies: "Para Empresas de Servicios",
    forServiceCompaniesText: "Proporcionamos un escaparate digital donde mostrar su profesionalidad, recibir solicitudes de presupuestos y obtener valoraciones verificadas que impulsan su reputación.",
    forNeighbors: "Para Vecinos",
    forNeighborsText: "Facilitamos una plataforma donde pueden reportar incidencias, seguir su resolución en tiempo real y valorar los servicios recibidos con total transparencia.",
    ratingsSystem: "Sistema de Valoraciones",
    ratingsSystemText: "Implementamos un sistema de evaluación que permite a los vecinos calificar los servicios, generando confianza y ayudando a tomar decisiones informadas.",
    virtuousCircle: "Esta integración crea un círculo virtuoso donde todos los participantes se benefician: mejores servicios para las comunidades, más oportunidades de negocio para los proveedores y una gestión más eficiente para los administradores.",
    whoWeAre: "Quiénes Somos",
    howItWorks: "Cómo Funciona",
    features: "Características",

    // User Roles & Dashboards
    communityMember: "Miembro de la Comunidad",
    serviceProvider: "Proveedor de Servicios",
    estateAdministrator: "Administrador de Fincas",
    particular: "Particular",
    welcomeToDashboard: "Bienvenido al Panel de Control",
    selectUserType: "Selecciona tu tipo de usuario",
    selectUserTypeDesc: "Elige la opción que mejor describa tu perfil para acceder a las funcionalidades específicas",
    whatsYourRole: "¿Cuál es tu rol?",
    communityMemberDesc: "Accede a servicios exclusivos para tu comunidad",
    serviceProviderDesc: "Gestiona tus servicios y clientes",
    estateAdministratorDesc: "Administra propiedades y comunidades",
    particularDesc: "Servicios personalizados para particulares",
    accessDashboard: "Acceder al Panel",
    communityDashboard: "Panel de Comunidad",
    providerDashboard: "Panel de Proveedor",
    adminDashboard: "Panel de Administrador",
    particularDashboard: "Panel Particular",
    controlPanel: "Panel de Control",
    accessAdministratorPanel: "Acceder al Panel de Administrador",
    accessProviderPanel: "Acceder al Panel de Proveedor",
    communityMemberLink: "Miembro de la Comunidad",
    particularLink: "Particular",
    
    // Financial & Cryptocurrency
    solanaNetwork: "Red Solana",
    creditDebitCards: "Tarjetas de Crédito/Débito",
    bankTransfers: "Transferencias Bancarias",
    cash: "Efectivo",
    setupSolanaWallet: "Configura una billetera Solana",
    downloadPhantomWallet: "Descarga e instala Phantom Wallet para gestionar tus tokens SOL y HBIT de forma segura.",
    clickToPhantom: "Haz clic para ir a Phantom →",
    acquireSOL: "Adquiere SOL",
    buySOLTokens: "Compra tokens SOL a través de exchanges o directamente en tu billetera Phantom.",
    clickToLearnBuySOL: "Haz clic para aprender a comprar SOL →",
    swapSOLForHBIT: "Intercambia SOL por HBIT",
    useDecentralizedExchange: "Utiliza un DEX como GMGN para intercambiar tus tokens SOL por HBIT de forma descentralizada.",
    clickToSwap: "Haz clic para intercambiar →",
    paymentSystemTitle: "Sistema de Pagos Híbrido",
    paymentSystemIntro: "Ofrecemos múltiples opciones de pago para adaptarnos a las preferencias de todos nuestros usuarios",
    fiatCurrencies: "Monedas FIAT",
    fiatDescription: "Métodos de pago tradicionales y seguros",
    cryptocurrencies: "Criptomonedas",
    cryptoDescription: "Pagos descentralizados con las principales criptomonedas",
    bitcoin: "Bitcoin (BTC)",
    ethereum: "Ethereum (ETH)",
    binanceCoin: "Binance Coin (BNB)",
    solana: "Solana (SOL)",
    hubitToken: "Token HUBIT",
    hbitDescription: "Nuestro token nativo con beneficios exclusivos",
    acceptedPayments: "Tipos de Pagos Aceptados",
    p2pPayments: "Persona a Persona",
    p2bPayments: "Persona a Empresa",
    b2pPayments: "Empresa a Persona",
    b2bPayments: "Empresa a Empresa",
    howToBuyHbitTitle: "Cómo Comprar HBIT",
    howToBuyHbitIntro: "Sigue estos sencillos pasos para adquirir tokens HBIT y acceder a beneficios exclusivos",
    hbitBenefits: "Beneficios de usar HuBiT manteniendo tokens HBIT",
    benefit1: "Regalos por fidelidad",
    benefit2: "Acceso a todas las funcionalidades",
    benefit3: "Publicidad de tu empresa",
    benefit4: "Recompensas de fidelidad",
    startUsingHbit: "Comenzar a usar HBIT",
    learnMore: "Saber más"
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("es");

  const t = useCallback(
    (key: string, langOverride?: Language) => {
      const lang = langOverride || language;
      const keys = key.split(".");
      let result: any = translations[lang];
      for (const k of keys) {
        result = result?.[k];
        if (result === undefined) {
          // Fallback to English if translation is missing
          let fallbackResult: any = translations.en;
          for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
          }
          return fallbackResult || key;
        }
      }
      return result || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
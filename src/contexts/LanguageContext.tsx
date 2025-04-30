import React, { createContext, useContext, useState, ReactNode } from "react";

// Definimos los idiomas disponibles
type Language = "es" | "en";

// Definimos las traducciones
const translations = {
  es: {
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
    alreadyHaveAccount: "¿Ya tienes una cuenta?"
  },
  en: {
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
    alreadyHaveAccount: "Already have an account?"
  }
};

// Tipo para el contexto
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Creamos el contexto
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Proveedor del contexto
interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>("es");

  // Función para obtener traducciones
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
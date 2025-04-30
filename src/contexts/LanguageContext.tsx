
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
    languageEn: "Inglés"
  },
  en: {
    professionalServices: "Professional Services",
    services: "Services",
    profile: "Profile",
    signOut: "Sign Out",
    languageEs: "Spanish",
    languageEn: "English"
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

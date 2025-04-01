
import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "es" | "fr" | "ru" | "zh";

type Translations = {
  [key: string]: {
    [key in Language]: string;
  };
};

// Basic translations for demonstration
const translations: Translations = {
  "handyman": {
    en: "Handyman",
    es: "Manitas",
    fr: "Bricoleur",
    ru: "Мастер",
    zh: "修理工"
  },
  "professionalServices": {
    en: "Professional services for your home",
    es: "Servicios profesionales para tu hogar",
    fr: "Services professionnels pour votre maison",
    ru: "Профессиональные услуги для вашего дома",
    zh: "为您的家提供专业服务"
  },
  "register": {
    en: "Register",
    es: "Registrarse",
    fr: "S'inscrire",
    ru: "Регистрация",
    zh: "注册"
  },
  "login": {
    en: "Log In",
    es: "Iniciar Sesión",
    fr: "Connexion",
    ru: "Вход",
    zh: "登录"
  },
  "services": {
    en: "Services",
    es: "Servicios",
    fr: "Services",
    ru: "Услуги",
    zh: "服务"
  },
  "profile": {
    en: "Profile",
    es: "Perfil",
    fr: "Profil",
    ru: "Профиль",
    zh: "个人资料"
  },
  "signOut": {
    en: "Sign Out",
    es: "Cerrar Sesión",
    fr: "Déconnexion",
    ru: "Выход",
    zh: "登出"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  // Load language preference from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && ["en", "es", "fr", "ru", "zh"].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    if (!translations[key]) {
      return key;
    }
    return translations[key][language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}


import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export function TranslationBar() {
  const { language } = useLanguage();
  
  // Este componente puede ser utilizado para mostrar un banner de traducción
  // o cualquier información relacionada con el idioma actual
  // Por ahora, lo dejamos vacío para que no afecte la interfaz
  return null;
}

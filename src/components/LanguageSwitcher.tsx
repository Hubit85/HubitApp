import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={language === "es" ? "default" : "outline"}
        size="sm"
        onClick={() => setLanguage("es")}
        className={`flex items-center gap-1 ${
          language === "es" 
            ? "bg-black hover:bg-gray-800 text-white" 
            : "bg-white hover:bg-gray-100 text-black border-black"
        }`}
      >
        <span className="text-sm">🇪🇸</span>
        <span className="hidden sm:inline">{t("languageEs")}</span>
      </Button>
      <Button
        variant={language === "en" ? "default" : "outline"}
        size="sm"
        onClick={() => setLanguage("en")}
        className={`flex items-center gap-1 ${
          language === "en" 
            ? "bg-black hover:bg-gray-800 text-white" 
            : "bg-white hover:bg-gray-100 text-black border-black"
        }`}
      >
        <span className="text-sm">🇬🇧</span>
        <span className="hidden sm:inline">{t("languageEn")}</span>
      </Button>
    </div>
  );
}

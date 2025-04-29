import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function TranslationBar() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: "es", name: "Español" },
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
    { code: "ru", name: "Русский" },
    { code: "zh", name: "中文" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white py-2 px-4 z-50 flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <Globe className="h-5 w-5 text-gray-300" />
        <span className="text-sm font-medium mr-2">Idioma:</span>
        <div className="flex space-x-2">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant={language === lang.code ? "default" : "ghost"}
              size="sm"
              onClick={() => setLanguage(lang.code)}
              className={language === lang.code ? "bg-blue-600" : "hover:bg-gray-700"}
            >
              {lang.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
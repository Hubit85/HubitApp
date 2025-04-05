import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
  ];

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        {languages.map((lang) => (
          <Tooltip key={lang.code}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => setLanguage(lang.code as any)}
              >
                <span className="text-lg">{lang.flag}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{lang.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}
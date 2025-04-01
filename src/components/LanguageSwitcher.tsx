
import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function LanguageSwitcher() {
  const { setLanguage } = useLanguage();

  const languages = [
    { code: "en", flag: "🇬🇧", name: "English" },
    { code: "es", flag: "🇪🇸", name: "Español" },
    { code: "fr", flag: "🇫🇷", name: "Français" },
    { code: "ru", flag: "🇷🇺", name: "Русский" },
    { code: "zh", flag: "🇨🇳", name: "中文" },
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

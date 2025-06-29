import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Header() {
  const router = useRouter();
  const { t } = useLanguage();
  const isLoggedIn = router.pathname.startsWith('/dashboard');

  return (
    <header className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-white shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex flex-col">
          <Link href={isLoggedIn ? '/dashboard' : '/'} className="text-2xl font-bold text-black tracking-wide">
            {t("hubit")}
          </Link>
          <p className="text-sm text-gray-600">{t("professionalServices")}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {isLoggedIn ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => router.push('/')}
              >
                {t("signOut")}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/login">{t("login")}</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/register">{t("register")}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

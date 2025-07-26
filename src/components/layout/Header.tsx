import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LogOut } from "lucide-react";

export function Header() {
  const router = useRouter();
  const { t } = useLanguage();
  
  // Check if user is in any dashboard/control panel
  const isDashboardPage = router.pathname.startsWith('/dashboard') || 
                          router.pathname.startsWith('/particular') || 
                          router.pathname.startsWith('/community-member') || 
                          router.pathname.startsWith('/administrador-fincas') || 
                          router.pathname.startsWith('/service-provider');
  
  const isHomePage = router.pathname === '/';

  const handleSignOut = () => {
    // Handle sign out logic here
    console.log("Sign out clicked");
    // You can add actual sign out logic here
  };

  return (
    <header className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-white shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex flex-col">
          <Link href={isDashboardPage ? '/dashboard' : '/'} className="text-2xl font-bold text-black tracking-wide">
            {t("hubit")}
          </Link>
          <p className="text-sm text-gray-600">{t("professionalServices")}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          
          {/* Show sign out button when in dashboard pages */}
          {isDashboardPage && (
            <Button 
              variant="outline" 
              className="bg-red-900 hover:bg-red-800 text-white font-bold border-red-900 hover:border-red-800"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t("signOut")}
            </Button>
          )}
          
          {/* Only show login/register buttons on non-dashboard pages and non-home page */}
          {!isDashboardPage && !isHomePage && (
            <>
              <Button variant="ghost" asChild className="bg-black hover:bg-gray-800 text-white">
                <Link href="/auth/login">{t("login")}</Link>
              </Button>
              <Button variant="outline" asChild className="bg-white hover:bg-gray-100 text-black border-black">
                <Link href="/auth/register">{t("register")}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LogOut, FileText, HelpCircle } from "lucide-react";
import { authService } from "@/services/AuthService";
import Image from "next/image";

export function Header() {
  const router = useRouter();
  const { t, language } = useLanguage();
  
  // Check if user is in any dashboard/control panel
  const isDashboardPage = router.pathname.startsWith('/dashboard') || 
                          router.pathname.startsWith('/particular') || 
                          router.pathname.startsWith('/community-member') || 
                          router.pathname.startsWith('/administrador-fincas') || 
                          router.pathname.startsWith('/service-provider');
  
  const isHomePage = router.pathname === '/';

  const handleSignOut = async () => {
    try {
      // Show loading state with subtle animation
      const signOutButton = document.querySelector('[data-signout-btn]') as HTMLButtonElement;
      if (signOutButton) {
        signOutButton.disabled = true;
        signOutButton.style.opacity = '0.7';
        signOutButton.style.transform = 'scale(0.98)';
      }

      // Call the logout service
      await authService.logout();
      
      // Add a smooth transition before redirect
      setTimeout(() => {
        // Redirect to home page
        router.push('/');
      }, 300);
      
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      
      // Reset button state on error
      const signOutButton = document.querySelector('[data-signout-btn]') as HTMLButtonElement;
      if (signOutButton) {
        signOutButton.disabled = false;
        signOutButton.style.opacity = '1';
        signOutButton.style.transform = 'scale(1)';
      }
      
      // You could add a toast notification here for better UX
      alert("Error al cerrar sesión. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <header className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-white shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-16 transition-transform duration-200 hover:scale-105 overflow-hidden">
            <Image
              src="/HuBiT logo.png"
              alt="HuBiT Logo"
              fill
              className="object-cover object-left"
              priority
            />
          </div>
          <div className="flex flex-col">
            <Link href={isDashboardPage ? '/dashboard' : '/'} className="text-2xl font-bold text-black tracking-wide hover:text-gray-700 transition-colors duration-200">
              {t("hubit")}
            </Link>
            <p className="text-sm text-gray-600" key={`slogan-${language}`}>
              {t("professionalServices")}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          
          {/* Help button - available on all pages */}
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white text-black border-gray-300 hover:bg-gray-50 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 shadow-sm hover:shadow-md"
            asChild
          >
            <Link href="/help">
              <HelpCircle className="h-4 w-4" />
              <span>{t("help")}</span>
            </Link>
          </Button>
          
          {/* Show Whitepaper button only on home page */}
          {isHomePage && (
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white text-black border-black hover:bg-white/90 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 shadow-sm hover:shadow-md"
              asChild
            >
              <Link href="/whitepaper">
                <FileText className="h-4 w-4" />
                <span>{t("whitepaper")}</span>
              </Link>
            </Button>
          )}
          
          {/* Show additional navigation when in dashboard pages */}
          {isDashboardPage && (
            <>
            </>
          )}
          
          {/* Show sign out button when in dashboard pages */}
          {isDashboardPage && (
            <Button 
              variant="outline" 
              size="sm"
              className="bg-red-900 hover:bg-red-800 text-white border-red-900 hover:border-red-800 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-1"
              onClick={handleSignOut}
              data-signout-btn
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{t("signOut")}</span>
            </Button>
          )}
          
          {/* Only show login/register buttons on non-dashboard pages and non-home page */}
          {!isDashboardPage && !isHomePage && (
            <>
              <Button variant="ghost" asChild className="bg-black hover:bg-gray-800 text-white transition-all duration-200 hover:scale-105">
                <Link href="/auth/login">{t("login")}</Link>
              </Button>
              <Button variant="outline" asChild className="bg-white hover:bg-gray-100 text-black border-black transition-all duration-200 hover:scale-105">
                <Link href="/auth/register">{t("register")}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

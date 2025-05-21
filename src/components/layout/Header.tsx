
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export function Header() {
  const router = useRouter();
  const isLoggedIn = router.pathname.startsWith('/dashboard');

  return (
    <header className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-white shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex flex-col">
          <Link href={isLoggedIn ? '/dashboard' : '/'} className="text-2xl font-bold text-black tracking-wide">
            HANDYMAN
          </Link>
          <p className="text-sm text-gray-600">Servicios profesionales</p>
        </div>
        
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/dashboard/services">Servicios</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/dashboard/profile">Perfil</Link>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/')}
              >
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Iniciar sesión</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/register">Registrarse</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

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
          <Link href={isLoggedIn ? '/dashboard' : '/'} className="text-2xl font-bold text-gray-900">
            Handyman
          </Link>
          <p className="text-sm text-gray-600">Professional services for your home</p>
        </div>
        
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard/services" passHref>
                <Button variant="ghost">Services</Button>
              </Link>
              <Link href="/dashboard/profile" passHref>
                <Button variant="ghost">Profile</Button>
              </Link>
              <Button variant="outline" onClick={() => router.push('/')}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login" passHref>
                <Button variant="outline">Log In</Button>
              </Link>
              <Link href="/auth/register" passHref>
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
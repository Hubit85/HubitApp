import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-white shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          Handyman
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/auth/login" passHref>
            <Button variant="outline">Log In</Button>
          </Link>
          <Link href="/auth/register" passHref>
            <Button>Register</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
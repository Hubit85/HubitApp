import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Header() {
  const router = useRouter();
  const isLoggedIn = router.pathname.startsWith('/dashboard');
  const { t } = useLanguage();

  return (
    <header className='w-full py-4 px-4 sm:px-6 lg:px-8 bg-white shadow-sm'>
      <div className='container mx-auto flex justify-between items-center'>
        <div className='flex flex-col'>
          <Link href={isLoggedIn ? '/dashboard' : '/'} className='text-2xl font-bold text-black tracking-wide'>
            HANDYMAN
          </Link>
          <p className='text-sm text-gray-600'>Professional services for your home</p>
        </div>
        
        <div className='flex items-center gap-4'>
          {/* Selector de idioma con banderas */}
          <div className="flex items-center">
            <LanguageSwitcher />
          </div>
          
          {isLoggedIn && (
            <>
              <Link href='/dashboard/services' passHref>
                <Button variant='ghost'>{t('services')}</Button>
              </Link>
              <Link href='/dashboard/profile' passHref>
                <Button variant='ghost'>{t('profile')}</Button>
              </Link>
              <Button variant='outline' onClick={() => router.push('/')}>
                {t('signOut')}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
import React from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  const handleServiceProviderClick = () => {
    router.push('/service-provider');
  };

  return (
    <>
      <Head>
        <title>Handyman - Professional Home Services</title>
        <meta name="description" content="Professional handyman services for your home" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="min-h-screen flex flex-col items-center justify-center relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
            backgroundSize: "cover",
            filter: "brightness(0.7)"
          }}
        />
        
        {/* Content */}
        <div className='z-10 text-center space-y-8 px-4 sm:px-6 max-w-4xl'>
          <h1 className='text-6xl md:text-7xl font-bold text-white drop-shadow-lg'>
            Handyman
          </h1>
          <p className='text-xl md:text-2xl text-white drop-shadow-md'>
            Professional services for your home
          </p>
          
          <div className='flex flex-col sm:flex-row gap-4 justify-center mt-8'>
            <Link href='/auth/register' passHref>
              <Button size='lg' className='text-lg px-8 py-6'>
                Register
              </Button>
            </Link>
            <Link href='/auth/login' passHref>
              <Button 
                size='lg' 
                variant='outline' 
                className='text-lg px-8 py-6 bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20'
              >
                Log In
              </Button>
            </Link>
            <Button 
              size='lg' 
              variant='secondary'
              className='text-lg px-8 py-6'
              onClick={handleServiceProviderClick}
            >
              Service Provider
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
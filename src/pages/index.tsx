import React, { useState } from 'react';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench, ArrowRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [showServiceDashboard, setShowServiceDashboard] = useState(false);

  const toggleServiceDashboard = () => {
    setShowServiceDashboard(!showServiceDashboard);
  };

  return (
    <>
      <Head>
        <title>Handyman - Professional Home Services</title>
        <meta name='description' content='Professional handyman services for your home' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      
      <main className='min-h-screen flex flex-col items-center justify-center relative'>
        {/* Background Image */}
        <div 
          className='absolute inset-0 z-0 bg-cover bg-center bg-no-repeat'
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
            backgroundSize: 'cover',
            filter: 'brightness(0.7)'
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
          </div>
          
          {/* Service Provider Card */}
          <div className='mt-12'>
            <Card 
              className='bg-white/10 backdrop-blur-sm border-white/20 text-white cursor-pointer hover:bg-white/20 transition-all'
              onClick={toggleServiceDashboard}
            >
              <CardContent className='p-6 flex items-center justify-between'>
                <div className='flex items-center'>
                  <Wrench className='mr-3 h-6 w-6' />
                  <span className='text-xl font-medium'>Service Provider Portal</span>
                </div>
                <ArrowRight className='h-5 w-5' />
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Sliding Service Provider Dashboard */}
        <div 
          className={`fixed top-0 left-0 h-full bg-white shadow-xl z-50 transition-all duration-300 ease-in-out transform ${
            showServiceDashboard ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ width: '100%', maxWidth: '1200px' }}
        >
          <iframe 
            src='/service-provider/dashboard' 
            className='w-full h-full border-none'
            title='Service Provider Dashboard'
          />
          <Button 
            variant='outline' 
            className='absolute top-4 right-4'
            onClick={toggleServiceDashboard}
          >
            Close
          </Button>
        </div>
      </main>
    </>
  );
}
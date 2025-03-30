
import React from "react";
import Head from "next/head";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard - Handyman</title>
        <meta name="description" content="Handyman dashboard - Professional services for your home" />
      </Head>
      
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* About Us Card - Occupying about one-third of the screen */}
          <Card className="w-full max-w-4xl mx-auto shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Who We Are</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 space-y-4">
              <p>
                Handyman is an innovative platform designed to empower residential communities 
                by connecting them directly with trusted local service providers.
              </p>
              <p>
                Our model eliminates intermediaries, ensuring competitive pricing for shared 
                expenses, maintenance, and home services—while fostering small businesses in 
                your area. By streamlining transactions and promoting transparency, we help 
                neighborhoods save costs and build stronger local economies.
              </p>
            </CardContent>
          </Card>
          
          {/* Additional content can be added below */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for future content */}
          </div>
        </main>
      </div>
    </>
  );
}

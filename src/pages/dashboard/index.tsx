import React, { useState } from "react";
import Head from "next/head";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Dashboard - Handyman</title>
        <meta name="description" content="Handyman dashboard - Professional services for your home" />
      </Head>
      
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
            backgroundSize: "cover",
            filter: "brightness(0.9)",
            opacity: 0.2
          }}
        />
        
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Who We Are Card */}
            <Card className="w-full shadow-lg bg-white/90 backdrop-blur-sm border-blue-200 border-2">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-2xl font-serif text-blue-800">Who We Are</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-4 p-6 font-sans">
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
            
            {/* How It Works Card */}
            <Card className="w-full shadow-lg bg-white/90 backdrop-blur-sm border-green-200 border-2">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-2xl font-serif text-green-800">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-4 p-6 font-sans">
                <p>
                  Our platform connects community members with trusted service providers through a simple, 
                  transparent process:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Community members post their service needs</li>
                  <li>Local providers submit competitive quotes</li>
                  <li>Members select providers based on ratings and price</li>
                  <li>Services are delivered with quality assurance</li>
                  <li>Both parties rate the experience</li>
                </ol>
              </CardContent>
            </Card>
            
            {/* Our Greatest Achievements Card */}
            <Card className="w-full shadow-lg bg-white/90 backdrop-blur-sm border-amber-200 border-2">
              <CardHeader className="bg-amber-50">
                <CardTitle className="text-2xl font-serif text-amber-800">Our Greatest Achievements</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-4 p-6 font-sans">
                <p>
                  Since our launch, we've achieved remarkable milestones:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Connected over 10,000 communities with local service providers</li>
                  <li>Helped communities save 30% on average for maintenance services</li>
                  <li>Supported 5,000+ small businesses in growing their client base</li>
                  <li>Maintained a 4.8/5 satisfaction rating across all services</li>
                  <li>Expanded to 50+ cities nationwide</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
        </main>
        
        {/* Sidebar hover trigger area */}
        <div 
          className="fixed left-0 top-0 h-full w-8 z-40"
          onMouseEnter={() => setSidebarOpen(true)}
        ></div>
        
        {/* Sliding sidebar overlay */}
        <motion.div 
          className="fixed inset-0 bg-black/50 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: sidebarOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ pointerEvents: sidebarOpen ? "auto" : "none" }}
        >
          <div 
            className="absolute inset-0"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </motion.div>
        
        <motion.div 
          className="fixed top-0 left-0 h-full w-full z-50 flex flex-col md:flex-row"
          initial={{ x: "-100%" }}
          animate={{ x: sidebarOpen ? 0 : "-100%" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onMouseLeave={() => setSidebarOpen(false)}
        >
          {/* Community Member Box */}
          <div 
            className="flex-1 bg-cover bg-center relative"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')"
            }}
          >
            <div className="absolute inset-0 bg-blue-900/70 hover:bg-blue-900/60 transition-colors flex items-center justify-center">
              <h2 className="text-4xl font-serif text-white font-bold text-center px-6">Community Member</h2>
            </div>
          </div>
          
          {/* Service Provider Box */}
          <div 
            className="flex-1 bg-cover bg-center relative"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80')"
            }}
          >
            <div className="absolute inset-0 bg-green-900/70 hover:bg-green-900/60 transition-colors flex items-center justify-center">
              <h2 className="text-4xl font-serif text-white font-bold text-center px-6">Service Provider?</h2>
            </div>
          </div>
          
          {/* What Do You Need Box */}
          <div 
            className="flex-1 bg-cover bg-center relative"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1580810734832-91a73e4cc62f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')"
            }}
          >
            <div className="absolute inset-0 bg-amber-900/70 hover:bg-amber-900/60 transition-colors flex items-center justify-center">
              <h2 className="text-4xl font-serif text-white font-bold text-center px-6">What Do You Need?</h2>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
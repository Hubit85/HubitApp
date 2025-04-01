
import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, ArrowRight, Zap, Paintbrush, Grid, Droplet, Thermometer } from "lucide-react";

export default function ServiceProviderHome() {
  const router = useRouter();

  const handleDashboardClick = () => {
    router.push("/service-provider/dashboard");
  };

  return (
    <>
      <Head>
        <title>Service Provider Portal | Handyman</title>
        <meta name="description" content="Service provider portal for Handyman services" />
      </Head>
      
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">Service Provider Portal</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Manage your service offerings, respond to client requests, and grow your business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-800">Dashboard</CardTitle>
                <CardDescription>Access your service provider dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-6">
                  <Wrench className="h-20 w-20 text-blue-500" />
                </div>
                <p className="text-gray-600">
                  View active bids, manage service requests, and track your business performance
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleDashboardClick}
                >
                  Open Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-800">Service Profile</CardTitle>
                <CardDescription>Manage your service offerings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-6">
                  <Wrench className="h-20 w-20 text-blue-500" />
                </div>
                <p className="text-gray-600">
                  Update your service categories, pricing, availability, and business information
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  Edit Profile <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Popular Service Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: "Plumbing", icon: <Droplet className="h-8 w-8" /> },
                { name: "Electrical", icon: <Zap className="h-8 w-8" /> },
                { name: "Painting", icon: <Paintbrush className="h-8 w-8" /> },
                { name: "Flooring", icon: <Grid className="h-8 w-8" /> },
                { name: "HVAC", icon: <Thermometer className="h-8 w-8" /> },
                { name: "General Repairs", icon: <Wrench className="h-8 w-8" /> },
              ].map((category, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <div className="text-blue-600 mb-2">{category.icon}</div>
                  <span className="text-gray-800 font-medium">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

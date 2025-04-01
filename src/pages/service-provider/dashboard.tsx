
import React, { useState } from "react";
import Head from "next/head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wrench, Zap, Paintbrush, Grid, Droplet, Thermometer, Home, Lock, Hammer, Trees, Truck, Wifi } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Define repair category type
interface RepairCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
}

// Define bid type
interface Bid {
  id: string;
  amount: string;
  scope: string;
  company: string;
}

// Define community request type
interface CommunityRequest {
  id: string;
  budget: string;
  description: string;
  category: string;
}

export default function ServiceProviderDashboard() {
  const [activeCategory, setActiveCategory] = useState("plumbing");
  const { t } = useLanguage();
  
  // Define repair categories with icons
  const repairCategories: RepairCategory[] = [
    { id: "plumbing", name: t("plumbing"), icon: <Droplet className="mr-2 h-5 w-5" /> },
    { id: "electrical", name: t("electrical"), icon: <Zap className="mr-2 h-5 w-5" /> },
    { id: "painting", name: t("painting"), icon: <Paintbrush className="mr-2 h-5 w-5" /> },
    { id: "flooring", name: t("flooring"), icon: <Grid className="mr-2 h-5 w-5" /> },
    { id: "roofing", name: t("roofing"), icon: <Home className="mr-2 h-5 w-5" /> },
    { id: "hvac", name: t("hvac"), icon: <Thermometer className="mr-2 h-5 w-5" /> },
    { id: "carpentry", name: t("carpentry"), icon: <Hammer className="mr-2 h-5 w-5" /> },
    { id: "locksmith", name: t("locksmith"), icon: <Lock className="mr-2 h-5 w-5" /> },
    { id: "appliance", name: t("applianceRepair"), icon: <Wrench className="mr-2 h-5 w-5" /> },
    { id: "landscaping", name: t("landscaping"), icon: <Trees className="mr-2 h-5 w-5" /> },
    { id: "moving", name: t("movingServices"), icon: <Truck className="mr-2 h-5 w-5" /> },
    { id: "networking", name: t("homeNetworking"), icon: <Wifi className="mr-2 h-5 w-5" /> },
  ];

  // Sample bids data for each category
  const generateBids = (category: string): Bid[] => [
    { 
      id: `${category}-1`, 
      amount: "$450", 
      scope: "Complete bathroom plumbing overhaul", 
      company: "Elite Plumbing Solutions" 
    },
    { 
      id: `${category}-2`, 
      amount: "$280", 
      scope: "Kitchen sink and dishwasher installation", 
      company: "Waterworks Pro" 
    },
    { 
      id: `${category}-3`, 
      amount: "$175", 
      scope: "Toilet repair and replacement", 
      company: "Reliable Home Services" 
    },
    { 
      id: `${category}-4`, 
      amount: "$320", 
      scope: "Leak detection and pipe repair", 
      company: "Precision Plumbers" 
    },
    { 
      id: `${category}-5`, 
      amount: "$550", 
      scope: "Full house plumbing inspection and maintenance", 
      company: "Master Plumbing Co." 
    },
  ];

  // Sample community requests data
  const communityRequests: CommunityRequest[] = [
    { id: "req-1", budget: "$300", description: "Need bathroom sink installation", category: "plumbing" },
    { id: "req-2", budget: "$250", description: "Looking for electrical outlet installation", category: "electrical" },
    { id: "req-3", budget: "$500", description: "Require complete living room painting", category: "painting" },
    { id: "req-4", budget: "$400", description: "Need hardwood floor repair in dining room", category: "flooring" },
    { id: "req-5", budget: "$800", description: "Looking for roof leak repair", category: "roofing" },
    { id: "req-6", budget: "$350", description: "AC maintenance and filter replacement", category: "hvac" },
    { id: "req-7", budget: "$275", description: "Custom shelving installation", category: "carpentry" },
    { id: "req-8", budget: "$150", description: "Lock replacement for front door", category: "locksmith" },
  ];
  
  // Get bids for the active category
  const categoryBids = generateBids(activeCategory);
  
  // Filter community requests by active category
  const filteredRequests = communityRequests.filter(
    request => request.category === activeCategory
  );

  return (
    <>
      <Head>
        <title>{t("serviceProviderDashboard")} | {t("handyman")}</title>
        <meta name="description" content={t("serviceProviderDesc")} />
      </Head>
      
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-700 text-white p-4 shadow-lg">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">{t("handymanPro")}</h2>
            <p className="text-blue-200 text-sm mb-6">{t("serviceProviderDashboard")}</p>
          </div>
          
          <nav>
            <h3 className="text-xs uppercase tracking-wider text-blue-300 mb-4">{t("repairCategories")}</h3>
            <ul className="space-y-2">
              {repairCategories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center w-full px-3 py-2 rounded-md transition-colors ${
                      activeCategory === category.id
                        ? "bg-blue-600 text-white"
                        : "text-blue-100 hover:bg-blue-800"
                    }`}
                  >
                    {category.icon}
                    <span>{category.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                {repairCategories.find(c => c.id === activeCategory)?.name} {t("services")}
              </h1>
              <p className="text-gray-600">
                {t("manageBids")}
              </p>
            </header>
            
            <div className="grid grid-cols-1 gap-8">
              {/* Bids Section */}
              <Card className="shadow-md">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-xl flex items-center justify-between">
                    <span>{t("activeBids")}</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {categoryBids.length} {t("bids")}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {categoryBids.map((bid) => (
                      <div key={bid.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">{bid.company}</h3>
                          <span className="text-lg font-bold text-green-600">{bid.amount}</span>
                        </div>
                        <p className="text-gray-600 mb-3">{bid.scope}</p>
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm" className="mr-2">{t("editBid")}</Button>
                          <Button size="sm">{t("contactClient")}</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Community Requests Section */}
              <Card className="shadow-md">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-xl flex items-center justify-between">
                    <span>{t("communityRequests")}</span>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      {filteredRequests.length} {t("requests")}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {filteredRequests.length > 0 ? (
                    <div className="divide-y">
                      {filteredRequests.map((request) => (
                        <div key={request.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-gray-600">{request.description}</p>
                            <span className="font-bold text-purple-600">{request.budget}</span>
                          </div>
                          <div className="flex justify-end">
                            <Button variant="outline" size="sm" className="mr-2">{t("viewDetails")}</Button>
                            <Button size="sm">{t("submitBid")}</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <p>{t("noRequests")}</p>
                      <Button variant="outline" className="mt-4">{t("browseAllRequests")}</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


import React, { useState } from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/router";
import { 
  Building, 
  MapPin, 
  Users, 
  Plus, 
  Search,
  Home,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

interface Property {
  id: string;
  name: string;
  address: string;
  type: "apartment" | "house" | "commercial";
  residents: number;
  status: "active" | "pending" | "inactive";
}

export default function PropertySelection() {
  const { t } = useLanguage();
  const router = useRouter();
  const { userType } = router.query;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [properties] = useState<Property[]>([
    {
      id: "1",
      name: "Edificio Residencial Los Pinos",
      address: "Calle Principal 123, Madrid",
      type: "apartment",
      residents: 45,
      status: "active"
    },
    {
      id: "2", 
      name: "Casa Familiar García",
      address: "Avenida Central 456, Barcelona",
      type: "house",
      residents: 4,
      status: "active"
    },
    {
      id: "3",
      name: "Complejo Residencial Vista Mar",
      address: "Paseo Marítimo 789, Valencia",
      type: "apartment", 
      residents: 120,
      status: "pending"
    },
    {
      id: "4",
      name: "Local Comercial Centro",
      address: "Plaza Mayor 12, Sevilla",
      type: "commercial",
      residents: 0,
      status: "active"
    }
  ]);

  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case "apartment":
        return <Building className="h-6 w-6" />;
      case "house":
        return <Home className="h-6 w-6" />;
      case "commercial":
        return <Building className="h-6 w-6" />;
      default:
        return <Building className="h-6 w-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return t("active");
      case "pending":
        return t("pending");
      case "inactive":
        return t("inactive");
      default:
        return status;
    }
  };

  const handlePropertySelect = (propertyId: string) => {
    if (userType === "community") {
      router.push(`/community-member?propertyId=${propertyId}`);
    } else if (userType === "particular") {
      router.push(`/particular?propertyId=${propertyId}`);
    }
  };

  const getPageTitle = () => {
    if (userType === "community") {
      return t("communityMemberProperties");
    } else if (userType === "particular") {
      return t("particularProperties");
    }
    return t("myProperties");
  };

  return (
    <>
      <Head>
        <title>{getPageTitle()} - {t("hubit")}</title>
        <meta name="description" content={t("selectPropertyDescription")} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="min-h-screen bg-gray-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-300"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("back")}
              </Button>
            </div>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {getPageTitle()}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t("selectPropertyToAccess")}
              </p>
            </div>
          </div>

          {/* Search and Add Property */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder={t("searchProperties")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-300 focus:border-gray-500"
                />
              </div>
              <Button className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white">
                <Plus className="h-4 w-4" />
                {t("addProperty")}
              </Button>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card 
                key={property.id} 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border-gray-200 hover:border-gray-400 hover:scale-105"
                onClick={() => handlePropertySelect(property.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                        {getPropertyIcon(property.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {property.name}
                        </CardTitle>
                        <Badge className={getStatusColor(property.status)}>
                          {getStatusText(property.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{property.address}</span>
                    </div>
                    
                    {property.type !== "commercial" && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">
                          {property.residents} {t("residents")}
                        </span>
                      </div>
                    )}
                    
                    <div className="pt-4">
                      <Button className="w-full bg-black hover:bg-gray-800 text-white">
                        {t("selectProperty")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto mb-6 p-4 bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center">
                <Building className="h-10 w-10 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("noPropertiesFound")}
              </h3>
              <p className="text-gray-600 mb-6">
                {t("noPropertiesFoundDescription")}
              </p>
              <Button className="flex items-center gap-2 mx-auto bg-black hover:bg-gray-800 text-white">
                <Plus className="h-4 w-4" />
                {t("addFirstProperty")}
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

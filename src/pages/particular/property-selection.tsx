import React from "react";
import Head from "next/head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, MapPin, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/layout/Header";
import { useRouter } from "next/router";
import ZoomableSection from "@/components/ZoomableSection";
import Image from "next/image";

interface Property {
  id: string;
  name: string;
  address: string;
  type: string;
  size: string;
  image: string;
}

export default function ParticularPropertySelection() {
  const { t } = useLanguage();
  const router = useRouter();

  // Sample properties for particular users
  const properties: Property[] = [
    {
      id: "1",
      name: "Apartamento en Centro",
      address: "Calle Gran Vía 25, Madrid",
      type: "Apartamento",
      size: "85m²",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: "2",
      name: "Casa en la Playa",
      address: "Avenida Marítima 12, Málaga",
      type: "Casa",
      size: "120m²",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: "3",
      name: "Chalet en las Afueras",
      address: "Urbanización El Bosque 34, Sevilla",
      type: "Chalet",
      size: "200m²",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    }
  ];

  const handlePropertySelect = (propertyId: string) => {
    // Store selected property in localStorage or context
    localStorage.setItem("selectedProperty", propertyId);
    // Navigate to particular dashboard
    router.push("/particular");
  };

  return (
    <>
      <Head>
        <title>{t("selectProperty")} | {t("hubit")}</title>
        <meta name="description" content={t("selectPropertyDesc")} />
      </Head>
      
      <Header />
      
      <div className="min-h-screen bg-gray-100 pt-16">
        <ZoomableSection className="w-full" enableZoom={true} maxScale={3} minScale={0.5}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
              <div className="mx-auto mb-6 p-4 bg-green-100 rounded-full w-20 h-20 flex items-center justify-center">
                <User className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {t("selectProperty")}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t("selectPropertyDesc")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <Card 
                  key={property.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer transform hover:scale-105 transition-transform"
                  onClick={() => handlePropertySelect(property.id)}
                >
                  <div className="h-48 overflow-hidden relative">
                    <Image 
                      src={property.image} 
                      alt={property.name} 
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-2">
                      {property.name === "Apartamento en Centro" ? t("apartmentInCenter") : 
                       property.name === "Casa en la Playa" ? t("beachHouse") : 
                       property.name === "Chalet en las Afueras" ? t("chaletInSuburbs") : 
                       property.name}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{property.address}</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline">
                        {property.type === "Apartamento" ? t("apartment") : 
                         property.type === "Casa" ? t("house") : 
                         property.type === "Chalet" ? t("chalet") : 
                         property.type}
                      </Badge>
                      <Badge variant="outline">{property.size}</Badge>
                    </div>
                    <Button className="w-full">
                      {t("accessPropertyDashboard")}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {properties.length === 0 && (
              <div className="text-center py-12">
                <Home className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  {t("noPropertiesRegistered")}
                </h3>
                <p className="text-gray-500 mb-6">
                  {t("addPropertiesDesc")}
                </p>
                <Button onClick={() => router.push("/")}>
                  {t("backToHome")}
                </Button>
              </div>
            )}

            <div className="text-center mt-12">
              <Button 
                variant="outline" 
                onClick={() => router.push("/")}
                className="mr-4"
              >
                {t("backToHome")}
              </Button>
              <Button variant="outline">
                {t("addProperty")}
              </Button>
            </div>
          </div>
        </ZoomableSection>
      </div>
    </>
  );
}

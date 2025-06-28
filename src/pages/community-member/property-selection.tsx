import React from "react";
import Head from "next/head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, MapPin, Users, Building } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/layout/Header";
import { useRouter } from "next/router";
import ZoomableSection from "@/components/ZoomableSection";
import Image from "next/image";

interface CommunityProperty {
  id: string;
  name: string;
  address: string;
  type: string;
  units: number;
  image: string;
  role: string;
}

export default function CommunityMemberPropertySelection() {
  const { t } = useLanguage();
  const router = useRouter();

  // Sample community properties where the user is a member
  const communityProperties: CommunityProperty[] = [
    {
      id: "1",
      name: "Residencial Las Flores",
      address: "Calle de las Flores 123, Barcelona",
      type: "Residencial",
      units: 48,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      role: "Propietario"
    },
    {
      id: "2", 
      name: "Complejo Mediterráneo",
      address: "Avenida del Mar 456, Valencia",
      type: "Complejo Residencial",
      units: 72,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      role: "Inquilino"
    },
    {
      id: "3",
      name: "Torres del Centro",
      address: "Plaza Mayor 789, Madrid", 
      type: "Torres Residenciales",
      units: 96,
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      role: "Propietario"
    }
  ];

  const handlePropertySelect = (propertyId: string) => {
    // Store selected property in localStorage or context
    localStorage.setItem("selectedCommunityProperty", propertyId);
    // Navigate to community member dashboard
    router.push("/community-member");
  };

  return (
    <>
      <Head>
        <title>{t("selectCommunityProperty")} | {t("hubit")}</title>
        <meta name="description" content={t("selectCommunityPropertyDesc")} />
      </Head>
      
      <Header />
      
      <div className="min-h-screen bg-gray-100 pt-16">
        <ZoomableSection className="w-full" enableZoom={true} maxScale={3} minScale={0.5}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
              <div className="mx-auto mb-6 p-4 bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center">
                <Building className="h-10 w-10 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {t("selectCommunityProperty")}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t("selectCommunityPropertyDesc")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {communityProperties.map((property) => (
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
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-blue-600 text-white">
                        {property.role}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-2">{property.name}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{property.address}</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-gray-600">
                        <Home className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.type}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.units} {t("units")}</span>
                      </div>
                    </div>
                    <Button className="w-full">
                      {t("accessCommunityDashboard")}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {communityProperties.length === 0 && (
              <div className="text-center py-12">
                <Building className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  {t("noCommunityPropertiesFound")}
                </h3>
                <p className="text-gray-500 mb-6">
                  {t("noCommunityPropertiesDesc")}
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
                {t("addNewCommunityProperty")}
              </Button>
            </div>
          </div>
        </ZoomableSection>
      </div>
    </>
  );
}

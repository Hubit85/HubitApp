import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Calendar, DollarSign, MapPin, Phone, User, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";

interface ProviderServiceHistoryItem {
  id: string;
  serviceName: string;
  customerName: string;
  customerType: "particular" | "community";
  customerImage: string;
  category: string;
  date: string;
  cost: number;
  status: "completed" | "pending" | "cancelled";
  rating?: number;
  comment?: string;
  location: string;
  duration: string;
  clientId: string;
}

interface ProviderServiceHistoryCardProps {
  service: ProviderServiceHistoryItem;
  onViewDetails: (serviceId: string) => void;
  onContactCustomer: (serviceId: string) => void;
  onViewRating: (serviceId: string) => void;
}

export default function ProviderServiceHistoryCard({ 
  service, 
  onViewDetails, 
  onContactCustomer, 
  onViewRating 
}: ProviderServiceHistoryCardProps) {
  const { t } = useLanguage();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating 
            ? "text-yellow-400 fill-yellow-400" 
            : "text-gray-300"
        }`}
      />
    ));
  };

  const getCustomerTypeIcon = () => {
    return service.customerType === "community" ? (
      <Users className="h-4 w-4 text-blue-600" />
    ) : (
      <User className="h-4 w-4 text-green-600" />
    );
  };

  const getCustomerTypeLabel = () => {
    return service.customerType === "community" ? t("communityMember") : t("particular");
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={service.customerImage}
                alt={service.customerName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">
                {service.serviceName}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-600 font-medium">
                  {service.customerName}
                </p>
                <div className="flex items-center space-x-1">
                  {getCustomerTypeIcon()}
                  <span className="text-xs text-gray-500">{getCustomerTypeLabel()}</span>
                </div>
              </div>
            </div>
          </div>
          <Badge className={`${getStatusColor(service.status)} font-medium`}>
            {t(service.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Service Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{service.date}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <DollarSign className="h-4 w-4" />
            <span>{formatCurrency(service.cost)}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{service.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <span className="font-medium">{service.duration}</span>
          </div>
        </div>

        {/* Category Badge */}
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {t(service.category)}
        </Badge>

        {/* Rating Section */}
        {service.status === "completed" && (
          <div className="bg-gray-50 rounded-lg p-3">
            {service.rating ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">{t("customerRating")}:</span>
                  <div className="flex items-center space-x-1">
                    {renderStars(service.rating)}
                    <span className="text-sm text-gray-600 ml-2">
                      {service.rating}/5
                    </span>
                  </div>
                </div>
                {service.comment && (
                  <div className="text-sm text-gray-600 italic">
                    &quot;{service.comment}&quot;
                  </div>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onViewRating(service.id)}
                  className="w-full mt-2"
                >
                  {t("viewFullRating")}
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-2">{t("notRatedYet")}</p>
                <p className="text-xs text-gray-500">{t("waitingForCustomerRating")}</p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(service.id)}
            className="flex-1 min-w-0"
          >
            {t("viewDetails")}
          </Button>
          
          {service.status === "completed" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onContactCustomer(service.id)}
              className="flex-1 min-w-0"
            >
              <Phone className="h-4 w-4 mr-1" />
              {t("contactCustomer")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

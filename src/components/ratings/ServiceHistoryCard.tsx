
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Calendar, DollarSign, User, MapPin, MessageSquare, Phone, Repeat } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";

interface ServiceHistoryItem {
  id: string;
  serviceName: string;
  providerName: string;
  providerImage: string;
  category: string;
  date: string;
  cost: number;
  status: "completed" | "pending" | "cancelled";
  rating?: number;
  comment?: string;
  location: string;
  duration: string;
}

interface ServiceHistoryCardProps {
  service: ServiceHistoryItem;
  onRate: (serviceId: string) => void;
  onViewDetails: (serviceId: string) => void;
  onRepeatService: (serviceId: string) => void;
  onContactProvider: (serviceId: string) => void;
}

export default function ServiceHistoryCard({ 
  service, 
  onRate, 
  onViewDetails, 
  onRepeatService, 
  onContactProvider 
}: ServiceHistoryCardProps) {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

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

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={service.providerImage}
                alt={service.providerName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">
                {service.serviceName}
              </CardTitle>
              <p className="text-sm text-gray-600 font-medium">
                {service.providerName}
              </p>
            </div>
          </div>
          <Badge className={`${getStatusColor(service.status)} font-medium`}>
            {t(service.status === "completed" ? "completed" : 
               service.status === "pending" ? "pending" : "cancelled")}
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
                  <span className="font-medium text-gray-700">{t("yourRating")}:</span>
                  <div className="flex items-center space-x-1">
                    {renderStars(service.rating)}
                    <span className="text-sm text-gray-600 ml-2">
                      {service.rating}/5
                    </span>
                  </div>
                </div>
                {service.comment && (
                  <div className="text-sm text-gray-600 italic">
                    "{service.comment}"
                  </div>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onRate(service.id)}
                  className="w-full mt-2"
                >
                  {t("editRating")}
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-2">{t("notRated")}</p>
                <Button 
                  onClick={() => onRate(service.id)}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  <Star className="h-4 w-4 mr-2" />
                  {t("rateNow")}
                </Button>
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
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRepeatService(service.id)}
                className="flex-1 min-w-0"
              >
                <Repeat className="h-4 w-4 mr-1" />
                {t("repeatService")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onContactProvider(service.id)}
                className="flex-1 min-w-0"
              >
                <Phone className="h-4 w-4 mr-1" />
                {t("contactProvider")}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
</create_file_file>

<create_file file_path="src/components/ratings/RatingModal.tsx">
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, X, ThumbsUp, ThumbsDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  providerName: string;
  currentRating?: number;
  currentComment?: string;
  onSubmit: (rating: number, comment: string, wouldRecommend: boolean) => void;
}

export default function RatingModal({
  isOpen,
  onClose,
  serviceName,
  providerName,
  currentRating = 0,
  currentComment = "",
  onSubmit
}: RatingModalProps) {
  const { t } = useLanguage();
  const [rating, setRating] = useState(currentRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(currentComment);
  const [wouldRecommend, setWouldRecommend] = useState(currentRating >= 4);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit(rating, comment, wouldRecommend);
    onClose();
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      return (
        <button
          key={index}
          type="button"
          className="transition-all duration-200 hover:scale-110"
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => setRating(starValue)}
        >
          <Star
            className={`h-8 w-8 ${
              starValue <= (hoverRating || rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 hover:text-yellow-200"
            }`}
          />
        </button>
      );
    });
  };

  const getRatingText = (rating: number) => {
    switch(rating) {
      case 1: return "Muy Insatisfecho";
      case 2: return "Insatisfecho";
      case 3: return "Neutral";
      case 4: return "Satisfecho";
      case 5: return "Muy Satisfecho";
      default: return "";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-xl font-bold text-gray-900 pr-8">
            {t("rateThisService")}
          </CardTitle>
          <div className="text-sm text-gray-600">
            <p className="font-medium">{serviceName}</p>
            <p>{providerName}</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Rating Stars */}
          <div className="text-center space-y-3">
            <Label className="text-base font-medium">{t("overallSatisfaction")}</Label>
            <div className="flex justify-center space-x-1">
              {renderStars()}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 font-medium">
                {getRatingText(rating)}
              </p>
            )}
          </div>

          {/* Would Recommend */}
          <div className="space-y-3">
            <Label className="text-base font-medium">{t("wouldRecommend")}</Label>
            <div className="flex space-x-4 justify-center">
              <Button
                variant={wouldRecommend ? "default" : "outline"}
                onClick={() => setWouldRecommend(true)}
                className="flex items-center space-x-2"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>Sí</span>
              </Button>
              <Button
                variant={!wouldRecommend ? "default" : "outline"}
                onClick={() => setWouldRecommend(false)}
                className="flex items-center space-x-2"
              >
                <ThumbsDown className="h-4 w-4" />
                <span>No</span>
              </Button>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-base font-medium">
              {t("addComment")} ({t("optional")})
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("commentPlaceholder")}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {currentRating > 0 ? t("editRating") : t("submitRating")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


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
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(currentRating >= 4 ? true : (currentRating > 0 ? false : null));

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating === 0 || wouldRecommend === null) return;
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

  const getRatingText = (val: number) => {
    const currentVal = hoverRating || val;
    switch(currentVal) {
      case 1: return t("Muy Insatisfecho");
      case 2: return t("Insatisfecho");
      case 3: return t("Neutral");
      case 4: return t("Satisfecho");
      case 5: return t("Muy Satisfecho");
      default: return t("Selecciona una puntuación");
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
            <p className="text-sm text-gray-600 font-medium h-5">
              {getRatingText(rating)}
            </p>
          </div>

          {/* Would Recommend */}
          <div className="space-y-3">
            <Label className="text-base font-medium">{t("wouldRecommend")}</Label>
            <div className="flex space-x-4 justify-center">
              <Button
                variant={wouldRecommend === true ? "default" : "outline"}
                onClick={() => setWouldRecommend(true)}
                className="flex items-center space-x-2"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{t("yes")}</span>
              </Button>
              <Button
                variant={wouldRecommend === false ? "default" : "outline"}
                onClick={() => setWouldRecommend(false)}
                className="flex items-center space-x-2"
              >
                <ThumbsDown className="h-4 w-4" />
                <span>{t("no")}</span>
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
              disabled={rating === 0 || wouldRecommend === null}
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

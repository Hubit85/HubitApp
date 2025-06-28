
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Shield, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Rating } from '@/types/ratings';

interface RatingDisplayProps {
  rating: Rating;
  showEvaluatorInfo?: boolean;
}

export default function RatingDisplay({ rating, showEvaluatorInfo = true }: RatingDisplayProps) {
  const { t } = useLanguage();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Rating Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= rating.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className={`font-semibold ${getRatingColor(rating.rating)}`}>
                {rating.rating}/5
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {formatDate(rating.createdAt)}
            </span>
          </div>

          {/* Evaluator Info */}
          {showEvaluatorInfo && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <span>{rating.evaluatorInfo.publicName}</span>
                {rating.evaluatorInfo.isVerified && (
                  <Shield className="h-3 w-3 text-blue-500" />
                )}
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span className="font-mono text-xs">
                  {rating.evaluatorInfo.communityCode}
                </span>
              </div>
              <span>•</span>
              <Badge variant="outline" className="text-xs">
                {t(rating.evaluatorInfo.userType)}
              </Badge>
            </div>
          )}

          {/* Comment */}
          {rating.comment && (
            <p className="text-gray-700 text-sm leading-relaxed">
              "{rating.comment}"
            </p>
          )}

          {/* Tags */}
          {rating.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {rating.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {t(tag)}
                </Badge>
              ))}
            </div>
          )}

          {/* Service/Contract Info */}
          {(rating.serviceId || rating.contractId) && (
            <div className="text-xs text-gray-500 border-t pt-2">
              {rating.serviceId && (
                <span>{t('serviceId')}: {rating.serviceId}</span>
              )}
              {rating.contractId && (
                <span>{t('contractId')}: {rating.contractId}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

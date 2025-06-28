
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, TrendingUp, Users, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ServiceRating } from '@/types/ratings';

interface RatingStatsProps {
  serviceRating: ServiceRating;
}

export default function RatingStats({ serviceRating }: RatingStatsProps) {
  const { t } = useLanguage();

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-500';
    if (rating >= 3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Overall Rating */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-400" />
            <span>{t('overallRating')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <div className={`text-4xl font-bold ${getRatingColor(serviceRating.averageRating)}`}>
              {serviceRating.averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 ${
                    star <= Math.round(serviceRating.averageRating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              {t('basedOn')} {serviceRating.totalRatings} {t('reviews')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <span>{t('ratingDistribution')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = serviceRating.ratingDistribution[rating as keyof typeof serviceRating.ratingDistribution];
              const percentage = serviceRating.totalRatings > 0 
                ? (count / serviceRating.totalRatings) * 100 
                : 0;

              return (
                <div key={rating} className="flex items-center space-x-2">
                  <span className="text-sm w-8">{rating}★</span>
                  <Progress 
                    value={percentage} 
                    className="flex-1 h-2"
                  />
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Popular Tags */}
      {Object.keys(serviceRating.tags).length > 0 && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-purple-500" />
              <span>{t('popularTags')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(serviceRating.tags)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([tag, count]) => (
                  <div
                    key={tag}
                    className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1"
                  >
                    <span className="text-sm">{t(tag)}</span>
                    <span className="text-xs text-gray-500 bg-gray-200 rounded-full px-2 py-0.5">
                      {count}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-green-500" />
            <span>{t('quickStats')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {serviceRating.totalRatings}
              </div>
              <div className="text-sm text-gray-600">{t('totalReviews')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round((serviceRating.ratingDistribution[5] + serviceRating.ratingDistribution[4]) / serviceRating.totalRatings * 100)}%
              </div>
              <div className="text-sm text-gray-600">{t('positiveReviews')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(serviceRating.tags).length}
              </div>
              <div className="text-sm text-gray-600">{t('uniqueTags')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {serviceRating.recentRatings.length}
              </div>
              <div className="text-sm text-gray-600">{t('recentReviews')}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

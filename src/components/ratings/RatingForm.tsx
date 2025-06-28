
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Rating } from '@/types/ratings';

interface RatingFormProps {
  toUserId: string;
  serviceId?: string;
  contractId?: string;
  onSubmit: (rating: Omit<Rating, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function RatingForm({ 
  toUserId, 
  serviceId, 
  contractId, 
  onSubmit, 
  onCancel 
}: RatingFormProps) {
  const { t } = useLanguage();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [hoveredStar, setHoveredStar] = useState(0);

  const availableTags = [
    'puntual',
    'profesional',
    'limpio',
    'eficiente',
    'comunicativo',
    'precio_justo',
    'calidad_excelente',
    'recomendable',
    'rapido',
    'cuidadoso',
    'experimentado',
    'amable',
    'resolutivo',
    'organizado',
    'confiable'
  ];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert(t('pleaseSelectRating'));
      return;
    }

    if (comment.trim().length < 10) {
      alert(t('commentTooShort'));
      return;
    }

    const ratingData = {
      fromUserId: 'current-user-id', // Esto vendría del contexto de autenticación
      toUserId,
      serviceId,
      contractId,
      rating,
      comment: comment.trim(),
      isPublic,
      tags: selectedTags,
      evaluatorInfo: {
        publicName: 'Usuario Verificado', // Esto vendría del perfil del usuario
        communityCode: 'ES-MAD-MAYOR-123-0001', // Esto vendría del perfil del usuario
        userType: 'community_member',
        isVerified: true
      }
    };

    onSubmit(ratingData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t('leaveRating')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Stars */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('overallRating')}</label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-8 w-8 cursor-pointer transition-colors ${
                  star <= (hoveredStar || rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setRating(star)}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {rating > 0 && `${rating}/5`}
            </span>
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('comment')}</label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t('shareYourExperience')}
            rows={4}
            maxLength={500}
          />
          <div className="text-xs text-gray-500 text-right">
            {comment.length}/500
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('tags')} ({t('optional')})</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleTagToggle(tag)}
              >
                {t(tag)}
                {selectedTags.includes(tag) && (
                  <X className="ml-1 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* Privacy Setting */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="isPublic" className="text-sm">
            {t('makeRatingPublic')}
          </label>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800">
          <p>{t('privacyNotice')}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit}>
            {t('submitRating')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

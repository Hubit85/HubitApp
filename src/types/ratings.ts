
export interface CommunityCode {
  country: string;
  city: string;
  street: string;
  number: string;
  sequential: number; // 0-1000
}

export interface UserProfile {
  id: string;
  email: string;
  userType: 'community_member' | 'service_provider' | 'estate_administrator';
  communityCode?: CommunityCode;
  privateName?: string; // Solo visible en su comunidad
  publicName: string; // Para interacciones con proveedores
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Rating {
  id: string;
  fromUserId: string;
  toUserId: string;
  serviceId?: string;
  contractId?: string;
  rating: number; // 1-5
  comment: string;
  isPublic: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  // Información anónima del evaluador
  evaluatorInfo: {
    publicName: string;
    communityCode: string; // Solo código, no detalles
    userType: string;
    isVerified: boolean;
  };
}

export interface ServiceRating {
  serviceProviderId: string;
  averageRating: number;
  totalRatings: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  recentRatings: Rating[];
  tags: { [key: string]: number }; // Frecuencia de tags
}

export interface CommunityRating {
  communityCode: string;
  memberRatings: {
    [memberId: string]: {
      averageRating: number;
      totalRatings: number;
      recentRatings: Rating[];
    };
  };
}

export interface RatingFilter {
  rating?: number;
  tags?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  userType?: string;
  isVerified?: boolean;
}

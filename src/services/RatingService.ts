
import { Rating, ServiceRating, CommunityRating, RatingFilter, UserProfile } from '@/types/ratings';

class RatingService {
  private baseUrl = '/api/ratings';

  // Crear una nueva valoración
  async createRating(ratingData: Omit<Rating, 'id' | 'createdAt' | 'updatedAt'>): Promise<Rating> {
    const response = await fetch(`${this.baseUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ratingData),
    });

    if (!response.ok) {
      throw new Error('Error al crear la valoración');
    }

    return response.json();
  }

  // Obtener valoraciones de un proveedor de servicios
  async getServiceProviderRatings(
    serviceProviderId: string, 
    filter?: RatingFilter
  ): Promise<ServiceRating> {
    const params = new URLSearchParams();
    if (filter) {
      if (filter.rating) params.append('rating', filter.rating.toString());
      if (filter.tags) params.append('tags', filter.tags.join(','));
      if (filter.userType) params.append('userType', filter.userType);
      if (filter.isVerified !== undefined) params.append('isVerified', filter.isVerified.toString());
    }

    const response = await fetch(`${this.baseUrl}/service-provider/${serviceProviderId}?${params}`);
    
    if (!response.ok) {
      throw new Error('Error al obtener las valoraciones del proveedor');
    }

    return response.json();
  }

  // Obtener valoraciones de una comunidad
  async getCommunityRatings(communityCode: string): Promise<CommunityRating> {
    const response = await fetch(`${this.baseUrl}/community/${communityCode}`);
    
    if (!response.ok) {
      throw new Error('Error al obtener las valoraciones de la comunidad');
    }

    return response.json();
  }

  // Obtener valoraciones de un usuario específico
  async getUserRatings(userId: string, filter?: RatingFilter): Promise<Rating[]> {
    const params = new URLSearchParams();
    if (filter) {
      if (filter.rating) params.append('rating', filter.rating.toString());
      if (filter.tags) params.append('tags', filter.tags.join(','));
      if (filter.dateRange) {
        params.append('from', filter.dateRange.from.toISOString());
        params.append('to', filter.dateRange.to.toISOString());
      }
    }

    const response = await fetch(`${this.baseUrl}/user/${userId}?${params}`);
    
    if (!response.ok) {
      throw new Error('Error al obtener las valoraciones del usuario');
    }

    return response.json();
  }

  // Obtener valoraciones recibidas por un usuario
  async getReceivedRatings(userId: string, filter?: RatingFilter): Promise<Rating[]> {
    const params = new URLSearchParams();
    if (filter) {
      if (filter.rating) params.append('rating', filter.rating.toString());
      if (filter.tags) params.append('tags', filter.tags.join(','));
    }

    const response = await fetch(`${this.baseUrl}/user/${userId}/received?${params}`);
    
    if (!response.ok) {
      throw new Error('Error al obtener las valoraciones recibidas');
    }

    return response.json();
  }

  // Actualizar una valoración
  async updateRating(ratingId: string, updates: Partial<Rating>): Promise<Rating> {
    const response = await fetch(`${this.baseUrl}/${ratingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar la valoración');
    }

    return response.json();
  }

  // Eliminar una valoración
  async deleteRating(ratingId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${ratingId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error al eliminar la valoración');
    }
  }

  // Reportar una valoración inapropiada
  async reportRating(ratingId: string, reason: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${ratingId}/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      throw new Error('Error al reportar la valoración');
    }
  }

  // Obtener estadísticas de valoraciones
  async getRatingStats(userId: string): Promise<{
    given: number;
    received: number;
    averageGiven: number;
    averageReceived: number;
  }> {
    const response = await fetch(`${this.baseUrl}/stats/${userId}`);
    
    if (!response.ok) {
      throw new Error('Error al obtener las estadísticas de valoraciones');
    }

    return response.json();
  }

  // Generar código de comunidad
  generateCommunityCode(
    country: string,
    city: string,
    street: string,
    number: string,
    sequential: number
  ): string {
    return `${country.toUpperCase()}-${city.toUpperCase()}-${street.toUpperCase().replace(/\s+/g, '')}-${number}-${sequential.toString().padStart(4, '0')}`;
  }

  // Validar código de comunidad
  validateCommunityCode(code: string): boolean {
    const pattern = /^[A-Z]{2,3}-[A-Z]+-[A-Z0-9]+-\d+-\d{4}$/;
    return pattern.test(code);
  }

  // Obtener tags más utilizados
  async getPopularTags(): Promise<{ [tag: string]: number }> {
    const response = await fetch(`${this.baseUrl}/tags/popular`);
    
    if (!response.ok) {
      throw new Error('Error al obtener los tags populares');
    }

    return response.json();
  }
}

export default new RatingService();

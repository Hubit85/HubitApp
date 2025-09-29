import { useState, useEffect } from 'react';

export interface SelectedPropertyData {
  id: string;
  name: string;
  community_code: string;
  address: string;
  street: string;
  number: string;
  city: string;
  province: string;
  country: string;
}

export function useSelectedProperty() {
  const [selectedProperty, setSelectedProperty] = useState<SelectedPropertyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSelectedProperty();
  }, []);

  const loadSelectedProperty = () => {
    try {
      const savedProperty = localStorage.getItem('selectedProperty');
      if (savedProperty) {
        const propertyData = JSON.parse(savedProperty) as SelectedPropertyData;
        setSelectedProperty(propertyData);
        console.log('🏠 Propiedad cargada desde localStorage:', propertyData);
      }
    } catch (error) {
      console.error('Error cargando propiedad seleccionada:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSelectedProperty = () => {
    localStorage.removeItem('selectedProperty');
    setSelectedProperty(null);
  };

  const updateSelectedProperty = (property: SelectedPropertyData) => {
    try {
      localStorage.setItem('selectedProperty', JSON.stringify(property));
      setSelectedProperty(property);
      console.log('🏠 Propiedad actualizada:', property);
    } catch (error) {
      console.error('Error guardando propiedad seleccionada:', error);
    }
  };

  // Funciones de utilidad para filtrar datos por comunidad
  const isFromSelectedCommunity = (communityCode: string) => {
    return selectedProperty?.community_code === communityCode;
  };

  const getCommunityFilter = () => {
    return selectedProperty?.community_code || null;
  };

  return {
    selectedProperty,
    isLoading,
    clearSelectedProperty,
    updateSelectedProperty,
    loadSelectedProperty,
    isFromSelectedCommunity,
    getCommunityFilter,
    hasCommunitySelected: !!selectedProperty?.community_code
  };
}
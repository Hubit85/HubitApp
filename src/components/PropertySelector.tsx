
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  MapPin, 
  Building, 
  Home, 
  Users, 
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Property {
  id: string;
  address: string;
  propertyType: string;
  communityName: string;
  totalUnits: number;
  buildingYear: number;
  administrator: string;
  units: PropertyUnit[];
}

interface PropertyUnit {
  id: string;
  unitNumber: string;
  floor: number;
  door: string;
  ownerName?: string;
  tenantName?: string;
  isVerified: boolean;
  userType: 'owner' | 'tenant';
}

interface PropertySelectorProps {
  userType: 'particular' | 'community_member';
  onPropertySelected: (property: Property, unit: PropertyUnit) => void;
  onCancel: () => void;
}

// Mock data defined outside the component to prevent re-creation on re-renders
const mockProperties: Property[] = [
  {
    id: '1',
    address: 'Calle Mayor 123, Madrid',
    propertyType: 'apartment',
    communityName: 'Residencial Mayor',
    totalUnits: 48,
    buildingYear: 2010,
    administrator: 'Administraciones García S.L.',
    units: [
      {
        id: '1-1',
        unitNumber: '1A',
        floor: 1,
        door: 'A',
        ownerName: 'Juan Pérez',
        isVerified: true,
        userType: 'owner'
      },
      {
        id: '1-2',
        unitNumber: '1B',
        floor: 1,
        door: 'B',
        ownerName: 'María García',
        tenantName: 'Carlos López',
        isVerified: false,
        userType: 'tenant'
      },
      {
        id: '1-3',
        unitNumber: '2A',
        floor: 2,
        door: 'A',
        ownerName: 'Ana Martín',
        isVerified: true,
        userType: 'owner'
      }
    ]
  },
  {
    id: '2',
    address: 'Avenida de la Paz 45, Madrid',
    propertyType: 'house',
    communityName: 'Urbanización La Paz',
    totalUnits: 24,
    buildingYear: 2015,
    administrator: 'Gestión Inmobiliaria Plus',
    units: [
      {
        id: '2-1',
        unitNumber: '45',
        floor: 0,
        door: 'Única',
        ownerName: 'Roberto Silva',
        isVerified: true,
        userType: 'owner'
      }
    ]
  },
  {
    id: '3',
    address: 'Plaza del Sol 8, Madrid',
    propertyType: 'penthouse',
    communityName: 'Edificio Sol',
    totalUnits: 12,
    buildingYear: 2020,
    administrator: 'Administraciones Modernas',
    units: [
      {
        id: '3-1',
        unitNumber: 'Ático',
        floor: 5,
        door: 'Única',
        ownerName: 'Elena Ruiz',
        isVerified: true,
        userType: 'owner'
      }
    ]
  }
];

export default function PropertySelector({ userType, onPropertySelected, onCancel }: PropertySelectorProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<PropertyUnit | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchTerm.length >= 3) {
      setIsSearching(true);
      // Simulate API call
      setTimeout(() => {
        const filtered = mockProperties.filter(property =>
          property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.communityName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setProperties(filtered);
        setIsSearching(false);
      }, 500);
    } else {
      setProperties([]);
    }
  }, [searchTerm]);

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setSelectedUnit(null);
  };

  const handleUnitSelect = (unit: PropertyUnit) => {
    setSelectedUnit(unit);
  };

  const handleConfirmSelection = () => {
    if (selectedProperty && selectedUnit) {
      onPropertySelected(selectedProperty, selectedUnit);
    }
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'house':
        return <Home className="h-5 w-5" />;
      case 'apartment':
        return <Building className="h-5 w-5" />;
      default:
        return <Building className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {t('selectProperty')}
          </CardTitle>
          <p className="text-center text-gray-600">
            {t('selectPropertyDesc')}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!selectedProperty ? (
            <>
              {/* Search Section */}
              <div className="space-y-4">
                <Label htmlFor="search">{t('searchProperty')}</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder={t('searchProperty')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Properties List */}
              {isSearching ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">{t('loading')}</p>
                </div>
              ) : properties.length > 0 ? (
                <div className="space-y-4">
                  {properties.map((property) => (
                    <Card 
                      key={property.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200"
                      onClick={() => handlePropertySelect(property)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="text-blue-600 mt-1">
                              {getPropertyTypeIcon(property.propertyType)}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{property.communityName}</h3>
                              <div className="flex items-center text-gray-600 mt-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{property.address}</span>
                              </div>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-1" />
                                  <span>{property.totalUnits} {t('totalUnits')}</span>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span>{property.buildingYear}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {t(property.propertyType)}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : searchTerm.length >= 3 ? (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">{t('noPropertiesFound')}</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">{t('enterAddress')}</p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Property Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{t('propertyDetails')}</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedProperty(null)}
                  >
                    {t('changeProperty')}
                  </Button>
                </div>
                
                <Card className="bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="text-blue-600 mt-1">
                        {getPropertyTypeIcon(selectedProperty.propertyType)}
                      </div>
                      <div>
                        <h4 className="font-semibold">{selectedProperty.communityName}</h4>
                        <p className="text-gray-600">{selectedProperty.address}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {t('administrator')}: {selectedProperty.administrator}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Unit Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t('selectUnit')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProperty.units.map((unit) => (
                    <Card 
                      key={unit.id}
                      className={`cursor-pointer transition-all ${
                        selectedUnit?.id === unit.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'hover:border-blue-200'
                      }`}
                      onClick={() => handleUnitSelect(unit)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">{t('unitNumber')}: {unit.unitNumber}</span>
                              {unit.isVerified ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Clock className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {t('floor')} {unit.floor}, {t('door')} {unit.door}
                            </p>
                            {unit.ownerName && (
                              <p className="text-sm text-gray-500">
                                {t('ownerName')}: {unit.ownerName}
                              </p>
                            )}
                            {unit.tenantName && (
                              <p className="text-sm text-gray-500">
                                {t('tenantName')}: {unit.tenantName}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <Badge variant={unit.userType === 'owner' ? 'default' : 'secondary'}>
                              {t(unit.userType === 'owner' ? 'propertyOwner' : 'propertyTenant')}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              {unit.isVerified ? t('ownershipVerified') : t('pendingVerification')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Confirm Selection */}
              {selectedUnit && (
                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <p className="font-semibold">{t('propertySelected')}</p>
                    <p className="text-sm text-gray-600">
                      {selectedProperty.communityName} - {t('unitNumber')} {selectedUnit.unitNumber}
                    </p>
                  </div>
                  <Button onClick={handleConfirmSelection} className="flex items-center space-x-2">
                    <span>{t('confirmSelection')}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Cancel Button */}
          <div className="flex justify-center pt-4 border-t">
            <Button variant="outline" onClick={onCancel}>
              {t('cancel')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

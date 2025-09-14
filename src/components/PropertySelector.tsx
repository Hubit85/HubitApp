import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Search, 
  MapPin, 
  Building, 
  Home, 
  Users, 
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
  PlusCircle,
  FileText,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Property } from "@/integrations/supabase/types";

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

interface PropertyWithUnits extends Property {
  units?: PropertyUnit[];
  communityName?: string;
  administrator?: string;
}

interface PropertySelectorProps {
  onPropertySelected: (property: PropertyWithUnits, unit?: PropertyUnit) => void;
  onCancel?: () => void;
  userType?: string | null;
  mode?: 'incident' | 'budget' | 'full'; // New mode for different use cases
  title?: string;
  allowNoUnitSelection?: boolean; // Allow selecting just the property without specific unit
}

export default function PropertySelector({ 
  onPropertySelected, 
  onCancel, 
  userType,
  mode = 'full',
  title,
  allowNoUnitSelection = false
}: PropertySelectorProps) {
  const { t } = useLanguage();
  const { user, userRoles } = useSupabaseAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<PropertyWithUnits | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<PropertyUnit | null>(null);
  const [properties, setProperties] = useState<PropertyWithUnits[]>([]);
  const [userProperties, setUserProperties] = useState<PropertyWithUnits[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Check if user is community member
  const isCommunityMember = userRoles.some(role => 
    role.role_type === 'community_member' && role.is_verified
  );

  useEffect(() => {
    if (user && isCommunityMember) {
      loadUserProperties();
    } else {
      setLoading(false);
    }
  }, [user, isCommunityMember]);

  const loadUserProperties = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError("");

      const { data, error: queryError } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;

      // Transform properties to include community information
      const transformedProperties: PropertyWithUnits[] = (data || []).map(property => ({
        ...property,
        communityName: property.name || `Propiedad en ${property.city}`,
        administrator: 'Administrador de Fincas', // This should come from the assignment system
        units: [
          {
            id: `${property.id}-main`,
            unitNumber: 'Principal',
            floor: 0,
            door: 'A',
            ownerName: user.email || 'Propietario',
            isVerified: true,
            userType: 'owner' as const
          }
        ]
      }));

      setUserProperties(transformedProperties);

      if (transformedProperties.length === 0) {
        setShowSearch(true);
      }

    } catch (err) {
      console.error('Error loading user properties:', err);
      setError("Error al cargar las propiedades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.length >= 3) {
      performSearch();
    } else {
      setProperties([]);
    }
  }, [searchTerm]);

  const performSearch = async () => {
    setSearching(true);
    try {
      // In a real implementation, this would search all properties in the system
      // For now, we'll simulate a search
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockResults: PropertyWithUnits[] = [
        {
          id: 'community-1',
          name: 'Residencial Los Olivos',
          address: 'Av. Los Olivos 123',
          city: 'Madrid',
          property_type: 'apartment',
          user_id: 'community',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          communityName: 'Residencial Los Olivos',
          administrator: 'García & Asociados S.L.',
          units: [
            { id: 'unit-1', unitNumber: '1A', floor: 1, door: 'A', isVerified: false, userType: 'owner' },
            { id: 'unit-2', unitNumber: '2B', floor: 2, door: 'B', isVerified: false, userType: 'owner' },
          ]
        }
      ];

      const filtered = mockResults.filter(property =>
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (property.communityName && property.communityName.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      setProperties(filtered);
    } catch (err) {
      console.error('Error searching properties:', err);
      setError("Error al buscar propiedades");
    } finally {
      setSearching(false);
    }
  };

  const handlePropertySelect = (property: PropertyWithUnits) => {
    setSelectedProperty(property);
    setSelectedUnit(null);

    // For incident mode, if there's only one unit or no units needed, auto-select
    if (mode === 'incident' && allowNoUnitSelection) {
      if (!property.units || property.units.length === 1) {
        const unit = property.units?.[0];
        onPropertySelected(property, unit);
        return;
      }
    }
  };

  const handleUnitSelect = (unit: PropertyUnit) => {
    setSelectedUnit(unit);
  };

  const handleConfirmSelection = () => {
    if (selectedProperty) {
      if (allowNoUnitSelection || selectedUnit) {
        onPropertySelected(selectedProperty, selectedUnit || undefined);
      }
    }
  };

  const handleRegisterProperty = () => {
    // In a real implementation, this would redirect to property registration
    alert('Redirigiendo al formulario de registro de propiedad...');
    if (onCancel) onCancel();
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'house': return <Home className="h-5 w-5" />;
      case 'apartment': return <Building className="h-5 w-5" />;
      default: return <Building className="h-5 w-5" />;
    }
  };

  const getDisplayTitle = () => {
    if (title) return title;
    
    if (mode === 'incident') {
      return 'Selecciona la Propiedad para la Incidencia';
    }
    
    if (userType === 'community_member') {
      return 'Propiedades de Miembro de Comunidad';
    } else if (userType === 'particular') {
      return 'Propiedades de Particular';
    }
    return 'Selecciona tu Propiedad';
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-stone-600">Cargando propiedades...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
        <CardHeader>
          <CardTitle className="text-2xl text-center">{getDisplayTitle()}</CardTitle>
          <div className="text-center space-y-2">
            {mode === 'incident' ? (
              <p className="text-gray-600">
                Selecciona la propiedad donde se encuentra la incidencia
              </p>
            ) : (
              <p className="text-gray-600">Selecciona la propiedad correspondiente</p>
            )}
            <div className="flex items-center justify-center gap-2 text-sm">
              <Building className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-600">
                {userProperties.length} {userProperties.length === 1 ? 'propiedad registrada' : 'propiedades registradas'}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 overflow-y-auto flex-1 p-6">
          {error && (
            <Alert className="border-2 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="font-medium text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {!selectedProperty ? (
            <>
              {userProperties.length > 0 && !showSearch ? (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Tus Propiedades</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowSearch(true)}
                        className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white border-black"
                      >
                        <Search className="h-4 w-4" />
                        Buscar otras propiedades
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {userProperties.map((property) => (
                        <Card 
                          key={property.id} 
                          className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200" 
                          onClick={() => handlePropertySelect(property)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <div className="text-blue-600 mt-1">
                                  {getPropertyTypeIcon(property.property_type)}
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">
                                    {property.communityName || property.name}
                                  </h3>
                                  <div className="flex items-center text-gray-600 mt-1">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span>{property.address}, {property.city}</span>
                                  </div>
                                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                    <div className="flex items-center">
                                      <Users className="h-4 w-4 mr-1" />
                                      <span>{property.units_count || 1} unidades</span>
                                    </div>
                                    {property.year_built && (
                                      <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        <span>{property.year_built}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                  Mi Propiedad
                                </Badge>
                                <Badge variant="secondary">
                                  {property.property_type === 'apartment' ? 'Apartamento' : 'Casa'}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-center pt-4 border-t">
                    <Button 
                      variant="outline" 
                      onClick={handleRegisterProperty}
                      className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black border-black"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Registrar otra propiedad
                    </Button>
                  </div>
                </>
              ) : userProperties.length === 0 && !showSearch ? (
                <div className="text-center py-12 space-y-6">
                  <div className="mx-auto mb-6 p-6 bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center">
                    <Building className="h-12 w-12 text-gray-600" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      ¡Bienvenido!
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Para reportar incidencias necesitas tener registrada al menos una propiedad en la plataforma.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={handleRegisterProperty}
                      className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white"
                    >
                      <FileText className="h-4 w-4" />
                      Registrar Propiedad
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowSearch(true)}
                      className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black border-black"
                    >
                      <Search className="h-4 w-4" />
                      Buscar propiedad existente
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="search" className="text-lg font-semibold">
                        Buscar Propiedad
                      </Label>
                      {userProperties.length > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setShowSearch(false)}
                          className="bg-black hover:bg-gray-800 text-white border-black"
                        >
                          Volver a mis propiedades
                        </Button>
                      )}
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        id="search" 
                        placeholder="Busca por dirección o nombre de la comunidad..."
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="pl-10" 
                      />
                    </div>
                  </div>

                  {searching ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                      <p className="text-gray-600">Buscando...</p>
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
                                  {getPropertyTypeIcon(property.property_type)}
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">
                                    {property.communityName || property.name}
                                  </h3>
                                  <div className="flex items-center text-gray-600 mt-1">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span>{property.address}, {property.city}</span>
                                  </div>
                                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                    <div className="flex items-center">
                                      <Users className="h-4 w-4 mr-1" />
                                      <span>{property.units?.length || 1} unidades</span>
                                    </div>
                                    {property.administrator && (
                                      <p className="text-xs text-gray-500">
                                        Administrador: {property.administrator}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Badge variant="secondary">
                                {property.property_type === 'apartment' ? 'Apartamento' : 'Casa'}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : searchTerm.length >= 3 ? (
                    <div className="text-center py-8 space-y-4">
                      <Building className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">No se encontraron propiedades</p>
                      <Button 
                        onClick={handleRegisterProperty}
                        className="flex items-center gap-2 mx-auto bg-white hover:bg-gray-100 text-black border border-black"
                      >
                        <PlusCircle className="h-4 w-4" />
                        Registrar Propiedad
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Search className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Introduce al menos 3 caracteres para buscar</p>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Detalles de la Propiedad</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedProperty(null)} 
                    className="bg-black hover:bg-gray-800 text-white border-black"
                  >
                    Cambiar Propiedad
                  </Button>
                </div>
                <Card className="bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="text-blue-600 mt-1">
                        {getPropertyTypeIcon(selectedProperty.property_type)}
                      </div>
                      <div>
                        <h4 className="font-semibold">
                          {selectedProperty.communityName || selectedProperty.name}
                        </h4>
                        <p className="text-gray-600">{selectedProperty.address}, {selectedProperty.city}</p>
                        {selectedProperty.administrator && (
                          <p className="text-sm text-gray-500 mt-1">
                            Administrador: {selectedProperty.administrator}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Unit Selection - only if needed and units exist */}
              {selectedProperty.units && selectedProperty.units.length > 1 && !allowNoUnitSelection && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Selecciona la Unidad</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProperty.units.map((unit) => (
                      <Card 
                        key={unit.id} 
                        className={`cursor-pointer transition-all ${
                          selectedUnit?.id === unit.id ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-200'
                        }`} 
                        onClick={() => handleUnitSelect(unit)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold">Unidad: {unit.unitNumber}</span>
                                {unit.isVerified ? 
                                  <CheckCircle className="h-4 w-4 text-green-500" /> : 
                                  <Clock className="h-4 w-4 text-yellow-500" />
                                }
                              </div>
                              <p className="text-sm text-gray-600">Piso {unit.floor}, Puerta {unit.door}</p>
                              {unit.ownerName && (
                                <p className="text-sm text-gray-500">Propietario: {unit.ownerName}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <Badge variant={unit.userType === 'owner' ? 'default' : 'secondary'}>
                                {unit.userType === 'owner' ? 'Propietario' : 'Inquilino'}
                              </Badge>
                              <p className="text-xs text-gray-500 mt-1">
                                {unit.isVerified ? 'Verificado' : 'Pendiente'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirmation Section */}
              {(allowNoUnitSelection || selectedUnit || !selectedProperty.units || selectedProperty.units.length <= 1) && (
                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <p className="font-semibold">Propiedad Seleccionada</p>
                    <p className="text-sm text-gray-600">
                      {selectedProperty.communityName || selectedProperty.name}
                      {selectedUnit && ` - Unidad ${selectedUnit.unitNumber}`}
                    </p>
                  </div>
                  <Button 
                    onClick={handleConfirmSelection} 
                    className="flex items-center space-x-2 bg-white hover:bg-gray-100 text-black border border-black"
                  >
                    <span>Confirmar Selección</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Cancel Button */}
          <div className="flex justify-center pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={onCancel} 
              className="bg-black hover:bg-gray-800 text-white border-black"
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
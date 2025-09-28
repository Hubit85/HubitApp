import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Plus, Trash2, Home, MapPin, Building, AlertCircle, CheckCircle } from "lucide-react";

type Property = Database["public"]["Tables"]["properties"]["Row"];

export type PropertyWithUnits = Property & {
  units?: Array<{ id: string; unit_number: string }>;
};

interface PropertySelectorProps {
  selectedProperty?: PropertyWithUnits | null;
  setSelectedProperty?: (property: PropertyWithUnits | null) => void;
  onPropertySelected?: (property: PropertyWithUnits, unit?: any) => void;
  onCancel?: () => void;
  mode?: string;
  title?: string;
  allowNoUnitSelection?: boolean;
}

export function PropertySelector({
  selectedProperty,
  setSelectedProperty,
  onPropertySelected,
  onCancel,
  mode = "selection",
  title = "Seleccionar Propiedad",
  allowNoUnitSelection = true,
}: PropertySelectorProps) {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [properties, setProperties] = useState<PropertyWithUnits[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [newPropertyData, setNewPropertyData] = useState({
    name: "",
    address: "",
    city: "",
    postal_code: "",
    property_type: "residential" as "residential" | "commercial" | "mixed",
  });

  useEffect(() => {
    const fetchProperties = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        // Add mock units for demonstration
        const propertiesWithUnits = (data || []).map(property => ({
          ...property,
          units: property.units_count && property.units_count > 1 ? 
            Array.from({ length: property.units_count }, (_, i) => ({
              id: `unit_${property.id}_${i + 1}`,
              unit_number: `${i + 1}${String.fromCharCode(65 + (i % 26))}`
            })) : []
        }));

        setProperties(propertiesWithUnits);
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast({
          title: "Error cargando propiedades",
          description: "Por favor, intenta de nuevo más tarde",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [user, toast]);

  const handleSelectProperty = (property: PropertyWithUnits) => {
    if (setSelectedProperty) {
      setSelectedProperty(property);
    }
    
    if (onPropertySelected) {
      // If property has units and we're in a mode that requires unit selection
      if (property.units && property.units.length > 0 && !allowNoUnitSelection) {
        // Don't call onPropertySelected yet, wait for unit selection
        return;
      }
      
      // Call with property and no unit if no units or unit selection not required
      onPropertySelected(property, null);
    }

    setNewPropertyData({
      name: property.name,
      address: property.address,
      city: property.city,
      postal_code: property.postal_code || "",
      property_type: property.property_type as "residential" | "commercial" | "mixed",
    });
  };

  const handleSelectUnit = (unit: any) => {
    setSelectedUnit(unit);
    if (onPropertySelected && selectedProperty) {
      onPropertySelected(selectedProperty, unit);
    }
  };

  const handleConfirmSelection = () => {
    if (onPropertySelected && selectedProperty) {
      onPropertySelected(selectedProperty, selectedUnit);
    }
  };

  const handleUpdateProperty = async () => {
    if (!selectedProperty || !user) return;

    try {
      const { error } = await supabase
        .from("properties")
        .update({
          name: newPropertyData.name,
          address: newPropertyData.address,
          city: newPropertyData.city,
          postal_code: newPropertyData.postal_code,
          property_type: newPropertyData.property_type,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedProperty.id);

      if (error) throw error;

      setProperties(
        properties.map((p) =>
          p.id === selectedProperty.id
            ? { ...p, ...newPropertyData }
            : p
        )
      );
      
      if (setSelectedProperty) {
        setSelectedProperty({
          ...selectedProperty,
          ...newPropertyData,
        });
      }

      toast({ 
        title: "Propiedad actualizada",
        description: "Los detalles de tu propiedad han sido guardados.",
      });
    } catch (error) {
      console.error("Error updating property:", error);
      toast({ 
        title: "Error actualizando propiedad", 
        description: "Por favor, intenta de nuevo más tarde.",
        variant: "destructive" 
      });
    }
  };

  const handleDeleteProperty = async () => {
    if (!selectedProperty || !user) return;

    try {
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", selectedProperty.id);

      if (error) throw error;

      setProperties(properties.filter((p) => p.id !== selectedProperty.id));
      if (setSelectedProperty) {
        setSelectedProperty(null);
      }
      
      toast({ 
        title: "Propiedad eliminada",
        description: "La propiedad ha sido eliminada de tu cuenta.",
      });
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({ 
        title: "Error eliminando propiedad", 
        description: "Por favor, intenta de nuevo más tarde.",
        variant: "destructive" 
      });
    }
  };

  const handleAddProperty = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("properties")
        .insert([{ 
          ...newPropertyData, 
          user_id: user.id,
          units_count: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select("*")
        .single();

      if (error) throw error;
      
      const newCompleteProperty: PropertyWithUnits = {
        ...(data as Property),
        units: [],
      };
      
      setProperties([newCompleteProperty, ...properties]);
      setNewPropertyData({
        name: "",
        address: "",
        city: "",
        postal_code: "",
        property_type: "residential",
      });
      
      toast({ 
        title: "Propiedad agregada",
        description: "Tu nueva propiedad ha sido creada.",
      });
    } catch (error) {
      console.error("Error adding property:", error);
      toast({ 
        title: "Error agregando propiedad", 
        description: "Por favor, intenta de nuevo más tarde.",
        variant: "destructive" 
      });
    }
  };

  const renderPropertyCard = (property: PropertyWithUnits) => (
    <Card
      key={property.id}
      className={`cursor-pointer transition-all hover:shadow-md border-2 ${
        selectedProperty?.id === property.id
          ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/50"
          : "border-gray-200 hover:border-blue-300"
      }`}
      onClick={() => handleSelectProperty(property)}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-gray-600" />
            <span className="truncate font-medium">{property.name}</span>
          </div>
          <Badge 
            variant="secondary" 
            className={`text-xs ${
              property.property_type === "residential" ? "bg-green-100 text-green-800" :
              property.property_type === "commercial" ? "bg-blue-100 text-blue-800" :
              "bg-purple-100 text-purple-800"
            }`}
          >
            {property.property_type === "residential" ? "Residencial" :
             property.property_type === "commercial" ? "Comercial" : "Mixto"}
          </Badge>
        </CardTitle>
        <CardDescription className="text-xs flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {property.address}, {property.city}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Building className="h-3 w-3" />
          {property.units_count || 1} {(property.units_count || 1) === 1 ? "unidad" : "unidades"}
        </div>
        {property.units && property.units.length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            Unidades: {property.units.map(u => u.unit_number).join(", ")}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Por favor, inicia sesión para gestionar propiedades.</p>
        </div>
      </div>
    );
  }

  // Modal mode for property selection
  if (mode === "incident" || onPropertySelected) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              {onCancel && (
                <Button variant="ghost" onClick={onCancel}>
                  ✕
                </Button>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Selecciona la propiedad donde se encuentra la incidencia
            </p>
          </div>
          
          <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Cargando propiedades...</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Home className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="mb-2">No tienes propiedades registradas.</p>
                <p className="text-sm">Agrega tu primera propiedad para continuar.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {properties.map(renderPropertyCard)}
              </div>
            )}

            {selectedProperty && selectedProperty.units && selectedProperty.units.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">
                  Selecciona la unidad específica (opcional):
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {allowNoUnitSelection && (
                    <Button
                      variant={selectedUnit === null ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedUnit(null)}
                      className="text-xs"
                    >
                      Áreas comunes
                    </Button>
                  )}
                  {selectedProperty.units.map((unit) => (
                    <Button
                      key={unit.id}
                      variant={selectedUnit?.id === unit.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSelectUnit(unit)}
                      className="text-xs"
                    >
                      {unit.unit_number}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between">
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button 
              onClick={handleConfirmSelection}
              disabled={!selectedProperty}
              className="ml-auto"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirmar Selección
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Standard management mode
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <h2 className="text-xl font-semibold mb-4">Seleccionar Propiedad</h2>
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2 text-sm">Cargando...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Home className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm mb-1">No hay propiedades.</p>
              <p className="text-xs">Agrega tu primera propiedad para comenzar.</p>
            </div>
          ) : (
            properties.map(renderPropertyCard)
          )}
        </div>
      </div>

      <div className="lg:col-span-2">
        {selectedProperty ? (
          <Card>
            <CardHeader>
              <CardTitle>Editar Detalles de Propiedad</CardTitle>
              <CardDescription>
                Actualiza los detalles para &quot;{selectedProperty.name}&quot;.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Nombre de la Propiedad</label>
                  <Input
                    value={newPropertyData.name}
                    onChange={(e) =>
                      setNewPropertyData({ ...newPropertyData, name: e.target.value })
                    }
                    placeholder="Introduce el nombre de la propiedad"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Tipo de Propiedad</label>
                  <Select
                    value={newPropertyData.property_type}
                    onValueChange={(value: "residential" | "commercial" | "mixed") =>
                      setNewPropertyData({ ...newPropertyData, property_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo de propiedad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residencial</SelectItem>
                      <SelectItem value="commercial">Comercial</SelectItem>
                      <SelectItem value="mixed">Mixto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Dirección</label>
                <Input
                  value={newPropertyData.address}
                  onChange={(e) =>
                    setNewPropertyData({ ...newPropertyData, address: e.target.value })
                  }
                  placeholder="Introduce la dirección completa"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Ciudad</label>
                  <Input
                    value={newPropertyData.city}
                    onChange={(e) =>
                      setNewPropertyData({ ...newPropertyData, city: e.target.value })
                    }
                    placeholder="Introduce la ciudad"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Código Postal</label>
                  <Input
                    value={newPropertyData.postal_code}
                    onChange={(e) =>
                      setNewPropertyData({
                        ...newPropertyData,
                        postal_code: e.target.value,
                      })
                    }
                    placeholder="Introduce el código postal"
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-3">Unidades ({selectedProperty.units_count || 1})</h3>
                {selectedProperty.units && selectedProperty.units.length > 0 ? (
                  <div className="space-y-2">
                    {selectedProperty.units.map((unit, index) => (
                      <div key={unit.id} className="flex items-center gap-2">
                        <Input
                          value={unit.unit_number || `Unidad ${index + 1}`}
                          placeholder={`Unidad ${index + 1}`}
                          className="flex-1"
                          readOnly
                        />
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mb-3">
                    No hay unidades configuradas para esta propiedad.
                  </p>
                )}
                <Button variant="outline" size="sm" className="mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Unidad
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="destructive" onClick={handleDeleteProperty}>
                Eliminar Propiedad
              </Button>
              <Button onClick={handleUpdateProperty}>Guardar Cambios</Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Agregar Nueva Propiedad</CardTitle>
              <CardDescription>
                Completa los detalles para agregar una nueva propiedad a tu cuenta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Nombre de la Propiedad</label>
                  <Input
                    value={newPropertyData.name}
                    onChange={(e) =>
                      setNewPropertyData({ ...newPropertyData, name: e.target.value })
                    }
                    placeholder="Introduce el nombre de la propiedad"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Tipo de Propiedad</label>
                  <Select
                    value={newPropertyData.property_type}
                    onValueChange={(value: "residential" | "commercial" | "mixed") =>
                      setNewPropertyData({ ...newPropertyData, property_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo de propiedad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residencial</SelectItem>
                      <SelectItem value="commercial">Comercial</SelectItem>
                      <SelectItem value="mixed">Mixto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Dirección</label>
                <Input
                  value={newPropertyData.address}
                  onChange={(e) =>
                    setNewPropertyData({ ...newPropertyData, address: e.target.value })
                  }
                  placeholder="Introduce la dirección completa"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Ciudad</label>
                  <Input
                    value={newPropertyData.city}
                    onChange={(e) =>
                      setNewPropertyData({ ...newPropertyData, city: e.target.value })
                    }
                    placeholder="Introduce la ciudad"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Código Postal</label>
                  <Input
                    value={newPropertyData.postal_code}
                    onChange={(e) =>
                      setNewPropertyData({
                        ...newPropertyData,
                        postal_code: e.target.value,
                      })
                    }
                    placeholder="Introduce el código postal"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleAddProperty}
                disabled={!newPropertyData.name || !newPropertyData.address || !newPropertyData.city}
              >
                Agregar Propiedad
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}

export default PropertySelector;

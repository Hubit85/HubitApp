import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Database } from "@/integrations/supabase/types";
import { Plus, Trash2 } from "lucide-react";

type Property = Database["public"]["Tables"]["properties"]["Row"];
type PropertyUnit = Database["public"]["Tables"]["property_units"]["Row"];

export type PropertyWithUnits = Property & {
  property_units: PropertyUnit[];
};

interface PropertySelectorProps {
  selectedProperty: PropertyWithUnits | null;
  setSelectedProperty: (property: PropertyWithUnits | null) => void;
}

export function PropertySelector({
  selectedProperty,
  setSelectedProperty,
}: PropertySelectorProps) {
  const { user, supabase } = useSupabaseAuth();
  const { toast } = useToast();
  const [properties, setProperties] = useState<PropertyWithUnits[]>([]);
  const [newPropertyData, setNewPropertyData] = useState({
    name: "",
    address: "",
    city: "",
    postal_code: "",
    property_type: "residential" as const,
  });

  useEffect(() => {
    const fetchProperties = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("properties")
          .select(`
            *,
            property_units (*)
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setProperties(data as PropertyWithUnits[] || []);
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast({
          title: "Error loading properties",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    };

    fetchProperties();
  }, [user, supabase, toast]);

  const handleSelectProperty = (propertyId: string) => {
    const property = properties.find((p) => p.id === propertyId) || null;
    setSelectedProperty(property);
    if (property) {
      setNewPropertyData({
        name: property.name,
        address: property.address,
        city: property.city,
        postal_code: property.postal_code || "",
        property_type: property.property_type as "residential" | "commercial" | "mixed",
      });
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
      
      setSelectedProperty({
        ...selectedProperty,
        ...newPropertyData,
      });

      toast({ 
        title: "Property updated successfully",
        description: "Your property details have been saved.",
      });
    } catch (error) {
      console.error("Error updating property:", error);
      toast({ 
        title: "Error updating property", 
        description: "Please try again later.",
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
      setSelectedProperty(null);
      
      toast({ 
        title: "Property deleted successfully",
        description: "The property has been removed from your account.",
      });
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({ 
        title: "Error deleting property", 
        description: "Please try again later.",
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
        .select(`
          *,
          property_units (*)
        `)
        .single();

      if (error) throw error;
      
      const newCompleteProperty: PropertyWithUnits = {
        ...(data as Property),
        property_units: [],
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
        title: "Property added successfully",
        description: "Your new property has been created.",
      });
    } catch (error) {
      console.error("Error adding property:", error);
      toast({ 
        title: "Error adding property", 
        description: "Please try again later.",
        variant: "destructive" 
      });
    }
  };

  const renderPropertyCard = (property: PropertyWithUnits) => (
    <Card
      key={property.id}
      className={`cursor-pointer transition-all hover:shadow-md ${
        selectedProperty?.id === property.id
          ? "border-primary ring-2 ring-primary bg-primary/5"
          : "hover:border-primary/50"
      }`}
      onClick={() => handleSelectProperty(property.id)}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="truncate font-medium">{property.name}</span>
          <Badge variant="secondary" className="text-xs">
            {property.property_type}
          </Badge>
        </CardTitle>
        <CardDescription className="text-xs">
          {property.address}, {property.city}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-xs text-muted-foreground">
          {property.units_count} {property.units_count === 1 ? "unit" : "units"}
        </div>
      </CardContent>
    </Card>
  );

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Please log in to manage properties.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <h2 className="text-xl font-semibold mb-4">Select Property</h2>
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
          {properties.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No properties found.</p>
              <p className="text-sm">Add your first property to get started.</p>
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
              <CardTitle>Edit Property Details</CardTitle>
              <CardDescription>
                Update the details for "{selectedProperty.name}".
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Property Name</label>
                  <Input
                    value={newPropertyData.name}
                    onChange={(e) =>
                      setNewPropertyData({ ...newPropertyData, name: e.target.value })
                    }
                    placeholder="Enter property name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Property Type</label>
                  <Select
                    value={newPropertyData.property_type}
                    onValueChange={(value: "residential" | "commercial" | "mixed") =>
                      setNewPropertyData({ ...newPropertyData, property_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Address</label>
                <Input
                  value={newPropertyData.address}
                  onChange={(e) =>
                    setNewPropertyData({ ...newPropertyData, address: e.target.value })
                  }
                  placeholder="Enter full address"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">City</label>
                  <Input
                    value={newPropertyData.city}
                    onChange={(e) =>
                      setNewPropertyData({ ...newPropertyData, city: e.target.value })
                    }
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Postal Code</label>
                  <Input
                    value={newPropertyData.postal_code}
                    onChange={(e) =>
                      setNewPropertyData({
                        ...newPropertyData,
                        postal_code: e.target.value,
                      })
                    }
                    placeholder="Enter postal code"
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-3">Units ({selectedProperty.units_count})</h3>
                {selectedProperty.property_units && selectedProperty.property_units.length > 0 ? (
                  <div className="space-y-2">
                    {selectedProperty.property_units.map((unit, index) => (
                      <div key={unit.id} className="flex items-center gap-2">
                        <Input
                          value={unit.unit_number || `Unit ${index + 1}`}
                          placeholder={`Unit ${index + 1}`}
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
                  <p className="text-sm text-muted-foreground mb-3">
                    No units configured for this property.
                  </p>
                )}
                <Button variant="outline" size="sm" className="mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Unit
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="destructive" onClick={handleDeleteProperty}>
                Delete Property
              </Button>
              <Button onClick={handleUpdateProperty}>Save Changes</Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Add New Property</CardTitle>
              <CardDescription>
                Fill in the details to add a new property to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Property Name</label>
                  <Input
                    value={newPropertyData.name}
                    onChange={(e) =>
                      setNewPropertyData({ ...newPropertyData, name: e.target.value })
                    }
                    placeholder="Enter property name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Property Type</label>
                  <Select
                    value={newPropertyData.property_type}
                    onValueChange={(value: "residential" | "commercial" | "mixed") =>
                      setNewPropertyData({ ...newPropertyData, property_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Address</label>
                <Input
                  value={newPropertyData.address}
                  onChange={(e) =>
                    setNewPropertyData({ ...newPropertyData, address: e.target.value })
                  }
                  placeholder="Enter full address"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">City</label>
                  <Input
                    value={newPropertyData.city}
                    onChange={(e) =>
                      setNewPropertyData({ ...newPropertyData, city: e.target.value })
                    }
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Postal Code</label>
                  <Input
                    value={newPropertyData.postal_code}
                    onChange={(e) =>
                      setNewPropertyData({
                        ...newPropertyData,
                        postal_code: e.target.value,
                      })
                    }
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleAddProperty}
                disabled={!newPropertyData.name || !newPropertyData.address || !newPropertyData.city}
              >
                Add Property
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
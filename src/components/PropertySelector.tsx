import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext"
import { Database } from "@/integrations/supabase/types"

type Property = Database["public"]["Tables"]["properties"]["Row"];
type PropertyUnit = Database["public"]["Tables"]["property_units"]["Row"];

export type PropertyWithUnits = Property & {
  property_units: PropertyUnit[]
}

interface PropertySelectorProps {
  selectedProperty: PropertyWithUnits | null
  setSelectedProperty: (property: PropertyWithUnits | null) => void
}

export function PropertySelector({
  selectedProperty,
  setSelectedProperty,
}: PropertySelectorProps) {
  const { user, supabase } = useSupabaseAuth();
  const [properties, setProperties] = useState<PropertyWithUnits[]>([]);
  const [newPropertyData, setNewPropertyData] = useState({
    name: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    property_type: "residential",
  });

  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties(data as PropertyWithUnits[] || []);
    };
    if (user) {
      fetchProperties();
    }
  }, [user, supabase]);

  const handleSelectProperty = (propertyId: string) => {
    const property = properties.find((p) => p.id === propertyId) || null;
    setSelectedProperty(property);
    if (property) {
      setNewPropertyData({
        id: property.id,
        name: property.name,
        address: property.address,
        city: property.city,
        province: property.province,
        postal_code: property.postal_code,
        property_type: property.property_type,
      });
    }
  };

  const handleUpdateProperty = async () => {
    try {
      const { error } = await supabase
        .from("properties")
        .update(newPropertyData)
        .eq("id", selectedProperty.id);

      if (error) throw error;

      setProperties(
        properties.map((p) =>
          p.id === selectedProperty.id
            ? { ...p, ...newPropertyData, property_units: p.property_units }
            : p
        )
      );
      toast({ title: "Property updated successfully" });
    } catch (error) {
      console.error("Error updating property:", error);
      toast({ title: "Error updating property", variant: "destructive" });
    }
  };

  const handleDeleteProperty = async () => {
    try {
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", selectedProperty.id);

      if (error) throw error;

      setProperties(properties.filter((p) => p.id !== selectedProperty.id));
      setSelectedProperty(null);
      toast({ title: "Property deleted successfully" });
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({ title: "Error deleting property", variant: "destructive" });
    }
  };

  const handleAddProperty = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .insert([{ ...newPropertyData, owner_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      const newCompleteProperty: PropertyWithUnits = { ...(data as Property), property_units: [] };
      setProperties([...properties, newCompleteProperty]);
      setNewPropertyData({
        name: "",
        address: "",
        city: "",
        province: "",
        postal_code: "",
        property_type: "residential",
      });
      toast({ title: "Property added successfully" });
    } catch (error) {
      console.error("Error adding property:", error);
      toast({ title: "Error adding property", variant: "destructive" });
    }
  };

  const renderPropertyCard = (property: PropertyWithUnits) => (
    <Card
      key={property.id}
      className={`cursor-pointer ${
        selectedProperty?.id === property.id
          ? "border-primary ring-2 ring-primary"
          : ""
      }`}
      onClick={() => handleSelectProperty(property.id)}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{property.name}</span>
          <Badge variant="secondary">{property.property_type}</Badge>
        </CardTitle>
        <CardDescription>{property.address}, {property.city}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          {property.property_units.length} units
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <h2 className="text-2xl font-bold mb-4">Select Property</h2>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto p-2">
          {properties.map(renderPropertyCard)}
        </div>
      </div>

      <div className="md:col-span-2">
        {selectedProperty ? (
          <Card>
            <CardHeader>
              <CardTitle>Edit Property Details</CardTitle>
              <CardDescription>
                Update the details for "{selectedProperty.name}".
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Property Name"
                  value={newPropertyData.name}
                  onChange={(e) =>
                    setNewPropertyData({ ...newPropertyData, name: e.target.value })
                  }
                />
                <Select
                  value={newPropertyData.property_type}
                  onValueChange={(value) =>
                    setNewPropertyData({ ...newPropertyData, property_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                label="Address"
                value={newPropertyData.address}
                onChange={(e) =>
                  setNewPropertyData({ ...newPropertyData, address: e.target.value })
                }
              />
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="City"
                  value={newPropertyData.city}
                  onChange={(e) =>
                    setNewPropertyData({ ...newPropertyData, city: e.target.value })
                  }
                />
                <Input
                  label="Province"
                  value={newPropertyData.province}
                  onChange={(e) =>
                    setNewPropertyData({
                      ...newPropertyData,
                      province: e.target.value,
                    })
                  }
                />
                <Input
                  label="Postal Code"
                  value={newPropertyData.postal_code}
                  onChange={(e) =>
                    setNewPropertyData({
                      ...newPropertyData,
                      postal_code: e.target.value,
                    })
                  }
                />
              </div>

              <h3 className="text-lg font-semibold pt-4">Units</h3>
              {selectedProperty.property_units.map((unit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={unit.unit_number || ""}
                    placeholder={`Unit ${index + 1}`}
                  />
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
               <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Unit
              </Button>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
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
                Fill in the details to add a new property.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Property Name"
                  value={newPropertyData.name}
                  onChange={(e) =>
                    setNewPropertyData({ ...newPropertyData, name: e.target.value })
                  }
                />
                <Select
                  value={newPropertyData.property_type}
                  onValueChange={(value) =>
                    setNewPropertyData({ ...newPropertyData, property_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                label="Address"
                value={newPropertyData.address}
                onChange={(e) =>
                  setNewPropertyData({ ...newPropertyData, address: e.target.value })
                }
              />
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="City"
                  value={newPropertyData.city}
                  onChange={(e) =>
                    setNewPropertyData({ ...newPropertyData, city: e.target.value })
                  }
                />
                <Input
                  label="Province"
                  value={newPropertyData.province}
                  onChange={(e) =>
                    setNewPropertyData({
                      ...newPropertyData,
                      province: e.target.value,
                    })
                  }
                />
                <Input
                  label="Postal Code"
                  value={newPropertyData.postal_code}
                  onChange={(e) =>
                    setNewPropertyData({
                      ...newPropertyData,
                      postal_code: e.target.value,
                    })
                  }
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleAddProperty}>Add Property</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, Building, Trash2, Edit } from "lucide-react";
import { Property, PropertyInsert, PropertyUpdate } from "@/integrations/supabase/types";

export default function PropertyManager() {
  const { user } = useSupabaseAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProperty, setCurrentProperty] = useState<Partial<Property>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user]);

  const fetchProperties = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (property: Property | null = null) => {
    if (property) {
      setIsEditing(true);
      setCurrentProperty(property);
    } else {
      setIsEditing(false);
      setCurrentProperty({
        name: "",
        address: "",
        city: "",
        postal_code: "",
        property_type: "residential",
        description: "",
        units_count: 1,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const propertyData = {
        ...currentProperty,
        user_id: user.id,
        name: currentProperty.name || '',
        address: currentProperty.address || '',
        city: currentProperty.city || '',
        postal_code: currentProperty.postal_code || '',
      };
      
      let res;
      if (isEditing) {
        const updateData: PropertyUpdate = { ...propertyData };
        delete updateData.id; 
        res = await supabase.from("properties").update(updateData).eq("id", currentProperty.id!);
      } else {
        const insertData: PropertyInsert = {
            user_id: user.id,
            name: propertyData.name,
            address: propertyData.address,
            city: propertyData.city,
            postal_code: propertyData.postal_code || '',
            property_type: propertyData.property_type,
            description: propertyData.description,
            units_count: propertyData.units_count
        };
        res = await supabase.from("properties").insert(insertData);
      }

      if (res.error) throw res.error;

      setIsDialogOpen(false);
      await fetchProperties();

    } catch (err: any) {
        setError(err.message);
    }
  };

  const handleDelete = async (propertyId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta propiedad?")) return;
    try {
      const { error } = await supabase.from("properties").delete().eq("id", propertyId);
      if (error) throw error;
      await fetchProperties();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="flex justify-center items-center"><Loader2 className="animate-spin mr-2" /> Cargando propiedades...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gestor de Propiedades</CardTitle>
          <CardDescription>Añade y administra tus propiedades y comunidades.</CardDescription>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Añadir Propiedad
        </Button>
      </CardHeader>
      <CardContent>
        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

        <div className="space-y-4">
          {properties.length > 0 ? (
            properties.map(prop => (
              <Card key={prop.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{prop.name}</h3>
                    <p className="text-sm text-muted-foreground">{prop.address}, {prop.city}</p>
                    <p className="text-sm">{prop.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog(prop)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(prop.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Building className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay propiedades</h3>
              <p className="mt-1 text-sm text-gray-500">Empieza añadiendo tu primera propiedad.</p>
            </div>
          )}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar" : "Añadir"} Propiedad</DialogTitle>
            <DialogDescription>
              {isEditing ? "Modifica los detalles de tu propiedad." : "Completa los detalles para añadir una nueva propiedad."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nombre</Label>
              <Input id="name" value={currentProperty.name || ''} onChange={(e) => setCurrentProperty({...currentProperty, name: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">Dirección</Label>
              <Input id="address" value={currentProperty.address || ''} onChange={(e) => setCurrentProperty({...currentProperty, address: e.target.value})} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">Ciudad</Label>
              <Input id="city" value={currentProperty.city || ''} onChange={(e) => setCurrentProperty({...currentProperty, city: e.target.value})} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="postal_code" className="text-right">Código Postal</Label>
              <Input id="postal_code" value={currentProperty.postal_code || ''} onChange={(e) => setCurrentProperty({...currentProperty, postal_code: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Descripción</Label>
              <Textarea id="description" value={currentProperty.description || ''} onChange={(e) => setCurrentProperty({...currentProperty, description: e.target.value})} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{isEditing ? "Guardar Cambios" : "Crear Propiedad"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
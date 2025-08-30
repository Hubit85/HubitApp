
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Home, MapPin, Users, Edit, Trash2, Loader2, Building, AlertCircle } from "lucide-react";

interface Property {
  id: string;
  name: string;
  address: string;
  property_type: string;  // Allow any string to match database
  description?: string;
  units_count?: number;
  created_at: string;
}

export default function PropertyManager() {
  const { user } = useSupabaseAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null as string | null,
    name: "",
    address: "",
    property_type: "" as 'residential' | 'commercial' | 'mixed' | "",
    description: "",
    units_count: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProperties = async () => {
    if (!user?.id) return;  // Add user validation
    
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        if (error.code === '42P01') {
          console.warn("Property table does not exist. Please run setup script.");
          setError("La tabla de propiedades no existe. Por favor, completa la configuración de la base de datos.");
          setProperties([]);
        } else {
          throw error;
        }
      } else {
        setProperties(data || []);
      }
    } catch (err: any) {
      console.error("Error fetching properties:", err);
      setError("No se pudieron cargar las propiedades.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProperties();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, property_type: value as any}));
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      address: "",
      property_type: "",
      description: "",
      units_count: ""
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;  // Add user validation
    
    setIsSubmitting(true);
    setError(null);

    try {
      const propertyData = {
        name: formData.name,
        address: formData.address,
        property_type: formData.property_type,
        description: formData.description || null,
        units_count: formData.units_count ? parseInt(formData.units_count) : null,
        user_id: user.id
      };
      
      let response;
      if (formData.id) {
        // Update
        response = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', formData.id)
          .select()
          .single();
      } else {
        // Insert
        response = await supabase
          .from('properties')
          .insert(propertyData)
          .select()
          .single();
      }

      if (response.error) throw response.error;

      fetchProperties();
      resetForm();
      setIsDialogOpen(false);
    } catch (err: any) {
      console.error('Error saving property:', err);
      setError('Error al guardar la propiedad. ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEdit = (property: Property) => {
    setFormData({
      id: property.id,
      name: property.name,
      address: property.address,
      property_type: property.property_type,
      description: property.description || '',
      units_count: property.units_count?.toString() || ''
    });
    setIsDialogOpen(true);
  }
  
  const handleDelete = async (propertyId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) return;
    
    try {
      const { error } = await supabase.from('properties').delete().eq('id', propertyId);
      if (error) throw error;
      fetchProperties();
    } catch (err: any) {
      console.error('Error deleting property:', err);
      setError('Error al eliminar la propiedad. ' + err.message);
    }
  }


  const getPropertyTypeInfo = (type: string) => {
    switch (type) {
      case 'residential':
        return { label: 'Residencial', color: 'bg-blue-500', icon: Home };
      case 'commercial':
        return { label: 'Comercial', color: 'bg-emerald-500', icon: Building };
      case 'mixed':
        return { label: 'Mixto', color: 'bg-purple-500', icon: Building };
      default:
        return { label: 'Sin especificar', color: 'bg-neutral-500', icon: Home };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Mis Propiedades</h2>
          <p className="text-neutral-600">Gestiona tus propiedades y comunidades</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Propiedad
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{formData.id ? 'Editar Propiedad' : 'Agregar Nueva Propiedad'}</DialogTitle>
              <DialogDescription>
                Completa la información de tu propiedad para comenzar a gestionarla.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Propiedad</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder="Ej: Edificio Central, Casa Principal..."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleFormChange('address', e.target.value)}
                  placeholder="Calle, número, ciudad..."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="property_type">Tipo de Propiedad</Label>
                <Select 
                  value={formData.property_type} 
                  onValueChange={handleSelectChange}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residencial</SelectItem>
                    <SelectItem value="commercial">Comercial</SelectItem>
                    <SelectItem value="mixed">Mixto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="units_count">Número de Unidades (opcional)</Label>
                <Input
                  id="units_count"
                  type="number"
                  value={formData.units_count}
                  onChange={(e) => handleFormChange('units_count', e.target.value)}
                  placeholder="Ej: 24 apartamentos"
                  min="1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Información adicional sobre la propiedad..."
                  rows={3}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    formData.id ? 'Guardar Cambios' : 'Agregar Propiedad'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-neutral-600">Cargando propiedades...</span>
        </div>
      ) : error ? (
        <Card className="text-center py-12 bg-red-50 border-red-200">
          <CardContent>
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-red-900 mb-2">
              Ocurrió un error
            </h3>
            <p className="text-red-700 mb-6">{error}</p>
            <Button onClick={fetchProperties}>
              Intentar de nuevo
            </Button>
          </CardContent>
        </Card>
      ) : properties.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Building className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              No tienes propiedades registradas
            </h3>
            <p className="text-neutral-600 mb-6">
              Agrega tu primera propiedad para comenzar a gestionar servicios y mantenimiento.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-r from-blue-600 to-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Primera Propiedad
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => {
            const typeInfo = getPropertyTypeInfo(property.property_type);
            const TypeIcon = typeInfo.icon;
            
            return (
              <Card key={property.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${typeInfo.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <TypeIcon className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {typeInfo.label}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold line-clamp-1">
                    {property.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{property.address}</span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0 flex-grow flex flex-col">
                  <div className="flex-grow">
                    {property.description && (
                      <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                        {property.description}
                      </p>
                    )}
                    
                    {property.units_count && (
                      <div className="flex items-center gap-2 text-sm text-neutral-600 mb-4">
                        <Users className="h-4 w-4" />
                        <span>{property.units_count} unidades</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-neutral-500 mb-4">
                    <span>Creado: {new Date(property.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(property)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(property.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
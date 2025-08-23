
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
import { Plus, Home, MapPin, Users, Edit, Trash2, Loader2, Building } from "lucide-react";

interface Property {
  id: string;
  name: string;
  address: string;
  property_type: 'residential' | 'commercial' | 'mixed';
  description?: string;
  units_count?: number;
  created_at: string;
}

export default function PropertyManager() {
  const { user } = useSupabaseAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    property_type: "" as 'residential' | 'commercial' | 'mixed' | "",
    description: "",
    units_count: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('properties')
        .insert([
          {
            name: formData.name,
            address: formData.address,
            property_type: formData.property_type,
            description: formData.description || null,
            units_count: formData.units_count ? parseInt(formData.units_count) : null,
            user_id: user?.id
          }
        ]);

      if (error) throw error;

      // Reset form and close dialog
      setFormData({
        name: "",
        address: "",
        property_type: "",
        description: "",
        units_count: ""
      });
      setIsDialogOpen(false);
      fetchProperties();
    } catch (error) {
      console.error('Error creating property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-neutral-600">Cargando propiedades...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Mis Propiedades</h2>
          <p className="text-neutral-600">Gestiona tus propiedades y comunidades</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Propiedad
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Agregar Nueva Propiedad</DialogTitle>
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
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Edificio Central, Casa Principal..."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Calle, número, ciudad..."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="property_type">Tipo de Propiedad</Label>
                <Select 
                  value={formData.property_type} 
                  onValueChange={(value) => setFormData({ ...formData, property_type: value as any })}
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
                  onChange={(e) => setFormData({ ...formData, units_count: e.target.value })}
                  placeholder="Ej: 24 apartamentos"
                  min="1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                    'Agregar Propiedad'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {properties.length === 0 ? (
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
              <Card key={property.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
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
                
                <CardContent className="pt-0">
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
                  
                  <div className="flex items-center justify-between text-xs text-neutral-500 mb-4">
                    <span>Creado: {new Date(property.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
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


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
import { Plus, FileText, Calendar, Clock, CheckCircle, XCircle, Loader2, Wrench } from "lucide-react";

interface BudgetRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string | null;
  budget_range_min: number | null;  // Match database type exactly
  budget_range_max: number | null;  // Match database type exactly
  created_at: string | null;
  property_name?: string;
}

export default function BudgetRequestManager() {
  const { user } = useSupabaseAuth();
  const [requests, setRequests] = useState<BudgetRequest[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    property_id: "",
    budget_range_min: "",
    budget_range_max: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: "cleaning", label: "Limpieza" },
    { value: "plumbing", label: "Fontanería" },
    { value: "electrical", label: "Electricidad" },
    { value: "gardening", label: "Jardinería" },
    { value: "painting", label: "Pintura" },
    { value: "maintenance", label: "Mantenimiento General" },
    { value: "security", label: "Seguridad" },
    { value: "other", label: "Otros" }
  ];

  useEffect(() => {
    if (user) {
      fetchRequests();
      fetchProperties();
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      if (!user?.id) return;  // Add user validation
      
      const { data, error } = await supabase
        .from('budget_requests')
        .select(`
          *,
          properties(name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedData = data?.map(item => ({
        ...item,
        property_name: item.properties?.name || undefined
      })) || [];
      
      setRequests(formattedData);
    } catch (error) {
      console.error('Error fetching budget requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      if (!user?.id) return;  // Add user validation
      
      const { data, error } = await supabase
        .from('properties')
        .select('id, name')
        .eq('user_id', user.id);

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;  // Add user validation
    
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('budget_requests')
        .insert({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          property_id: formData.property_id || null,
          budget_range_min: formData.budget_range_min ? parseFloat(formData.budget_range_min) : null,
          budget_range_max: formData.budget_range_max ? parseFloat(formData.budget_range_max) : null,
          user_id: user.id,
          status: 'pending'
        });

      if (error) throw error;

      // Reset form and close dialog
      setFormData({
        title: "",
        description: "",
        category: "",
        property_id: "",
        budget_range_min: "",
        budget_range_max: ""
      });
      setIsDialogOpen(false);
      fetchRequests();
    } catch (error) {
      console.error('Error creating budget request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusInfo = (status: string | null) => {
    switch (status) {
      case 'pending':
        return { label: 'Pendiente', color: 'bg-yellow-500', icon: Clock };
      case 'in_progress':
        return { label: 'En Progreso', color: 'bg-blue-500', icon: Clock };
      case 'completed':
        return { label: 'Completado', color: 'bg-green-500', icon: CheckCircle };
      case 'cancelled':
        return { label: 'Cancelado', color: 'bg-red-500', icon: XCircle };
      default:
        return { label: 'Pendiente', color: 'bg-yellow-500', icon: Clock };
    }
  };

  const getCategoryLabel = (category: string) => {
    const found = categories.find(cat => cat.value === category);
    return found ? found.label : category;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-neutral-600">Cargando solicitudes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Solicitudes de Presupuesto</h2>
          <p className="text-neutral-600">Gestiona tus solicitudes de servicios</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Solicitud
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Nueva Solicitud de Presupuesto</DialogTitle>
              <DialogDescription>
                Describe el servicio que necesitas para recibir presupuestos de proveedores.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título de la Solicitud</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Reparación de fontanería en baño principal"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {properties.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="property_id">Propiedad (opcional)</Label>
                  <Select 
                    value={formData.property_id} 
                    onValueChange={(value) => setFormData({ ...formData, property_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una propiedad" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget_min">Presupuesto Mín. (€)</Label>
                  <Input
                    id="budget_min"
                    type="number"
                    value={formData.budget_range_min}
                    onChange={(e) => setFormData({ ...formData, budget_range_min: e.target.value })}
                    placeholder="100"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget_max">Presupuesto Máx. (€)</Label>
                  <Input
                    id="budget_max"
                    type="number"
                    value={formData.budget_range_max}
                    onChange={(e) => setFormData({ ...formData, budget_range_max: e.target.value })}
                    placeholder="500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descripción Detallada</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe en detalle el trabajo que necesitas..."
                  rows={4}
                  required
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
                      Creando...
                    </>
                  ) : (
                    'Crear Solicitud'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {requests.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <Wrench className="h-10 w-10 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              No tienes solicitudes de presupuesto
            </h3>
            <p className="text-neutral-600 mb-6">
              Crea tu primera solicitud para recibir presupuestos de proveedores de servicios.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-r from-emerald-600 to-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Crear Primera Solicitud
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((request) => {
            const statusInfo = getStatusInfo(request.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <Card key={request.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 ${statusInfo.color} rounded-lg flex items-center justify-center`}>
                      <StatusIcon className="h-4 w-4 text-white" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {getCategoryLabel(request.category)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                    {request.title}
                  </CardTitle>
                  {request.property_name && (
                    <CardDescription className="text-sm text-neutral-600">
                      Propiedad: {request.property_name}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
                    {request.description}
                  </p>
                  
                  {(request.budget_range_min || request.budget_range_max) && (
                    <div className="flex items-center gap-2 text-sm text-neutral-600 mb-4">
                      <span className="font-medium">Presupuesto:</span>
                      {request.budget_range_min && request.budget_range_max ? (
                        <span>{request.budget_range_min}€ - {request.budget_range_max}€</span>
                      ) : request.budget_range_min ? (
                        <span>Desde {request.budget_range_min}€</span>
                      ) : (
                        <span>Hasta {request.budget_range_max}€</span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={`${statusInfo.color} text-white text-xs`}>
                      {statusInfo.label}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                      <Calendar className="h-3 w-3" />
                      <span>{request.created_at ? new Date(request.created_at).toLocaleDateString() : 'Sin fecha'}</span>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-1" />
                    Ver Detalles
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
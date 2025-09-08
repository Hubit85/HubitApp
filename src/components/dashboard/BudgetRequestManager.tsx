
import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, FileText, Trash2, Edit } from "lucide-react";
import { BudgetRequest, Property, BudgetRequestInsert, BudgetRequestUpdate } from "@/integrations/supabase/types";

type BudgetRequestWithProperty = BudgetRequest & {
  properties: Pick<Property, 'name' | 'address'> | null;
};

const CATEGORIES = [
  "cleaning", "plumbing", "electrical", "gardening", "painting", 
  "maintenance", "security", "hvac", "carpentry", "emergency", "other"
] as const;

const STATUS_OPTIONS = [
  "pending", "published", "in_progress", "completed", "cancelled", "expired"
] as const;

export default function BudgetRequestManager() {
  const { user } = useSupabaseAuth();
  const [requests, setRequests] = useState<BudgetRequestWithProperty[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<Partial<BudgetRequest>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const [requestsRes, propertiesRes] = await Promise.all([
        supabase
          .from("budget_requests")
          .select(`*, properties (name, address)`)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("properties")
          .select("*")
          .eq("user_id", user.id),
      ]);

      if (requestsRes.error) throw new Error(`Error fetching requests: ${requestsRes.error.message}`);
      if (propertiesRes.error) throw new Error(`Error fetching properties: ${propertiesRes.error.message}`);

      setRequests(requestsRes.data as BudgetRequestWithProperty[]);
      setProperties(propertiesRes.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (request: BudgetRequest | null = null) => {
    if (request) {
      setIsEditing(true);
      setCurrentRequest(request);
    } else {
      setIsEditing(false);
      setCurrentRequest({
        title: "",
        description: "",
        category: "maintenance",
        property_id: "",
        status: "pending",
        budget_range_min: null,
        budget_range_max: null,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      const requestData = {
        ...currentRequest,
        user_id: user.id,
        property_id: currentRequest.property_id || properties[0]?.id || '',
        title: currentRequest.title || '',
        description: currentRequest.description || '',
        category: currentRequest.category as typeof CATEGORIES[number] || 'maintenance',
      };
      
      let res;
      if (isEditing) {
        const updateData: BudgetRequestUpdate = { 
          title: requestData.title,
          description: requestData.description,
          category: requestData.category,
          property_id: requestData.property_id,
          budget_range_min: requestData.budget_range_min,
          budget_range_max: requestData.budget_range_max
        };
        res = await supabase.from("budget_requests").update(updateData).eq("id", currentRequest.id!);
      } else {
        const insertData: BudgetRequestInsert = { 
          user_id: user.id,
          property_id: requestData.property_id,
          title: requestData.title,
          description: requestData.description,
          category: requestData.category,
          status: 'pending',
          budget_range_min: requestData.budget_range_min,
          budget_range_max: requestData.budget_range_max
        };
        res = await supabase.from("budget_requests").insert(insertData);
      }

      if (res.error) throw res.error;

      setIsDialogOpen(false);
      await fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (requestId: string) => {
    if (!requestId) {
      console.error("No request ID provided");
      return;
    }
    
    if (!confirm("¿Estás seguro de que quieres eliminar esta solicitud?")) return;
    
    try {
      const { error } = await supabase.from("budget_requests").delete().eq("id", requestId);
      if (error) throw error;
      await fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'published':
        return 'secondary';
      case 'in_progress':
        return 'secondary';
      case 'completed':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) return <div className="flex justify-center items-center"><Loader2 className="animate-spin mr-2" /> Cargando solicitudes...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Solicitudes de Presupuesto</CardTitle>
          <CardDescription>Crea y gestiona tus solicitudes de servicios.</CardDescription>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Nueva Solicitud
        </Button>
      </CardHeader>
      <CardContent>
        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
        
        <div className="space-y-4">
          {requests.length > 0 ? (
            requests.map(req => (
              <Card key={req.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{req.title}</h3>
                    <p className="text-sm text-muted-foreground">{req.properties?.name || 'Propiedad no especificada'}</p>
                    <p className="text-sm">{req.description}</p>
                    <Badge variant={getStatusBadgeVariant(req.status)} className="mt-2">{req.status}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog(req)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => {
                        if (req.id) {
                          handleDelete(req.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay solicitudes</h3>
              <p className="mt-1 text-sm text-gray-500">Empieza creando una nueva solicitud de presupuesto.</p>
            </div>
          )}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar" : "Nueva"} Solicitud de Presupuesto</DialogTitle>
            <DialogDescription>
              {isEditing ? "Modifica los detalles de tu solicitud." : "Completa los detalles para crear una nueva solicitud."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Título</Label>
              <Input id="title" value={currentRequest.title || ''} onChange={(e) => setCurrentRequest({...currentRequest, title: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Descripción</Label>
              <Textarea id="description" value={currentRequest.description || ''} onChange={(e) => setCurrentRequest({...currentRequest, description: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="property" className="text-right">Propiedad</Label>
              <Select value={currentRequest.property_id || undefined} onValueChange={(value) => setCurrentRequest({...currentRequest, property_id: value})} >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecciona una propiedad" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Categoría</Label>
              <Select value={currentRequest.category || undefined} onValueChange={(value) => setCurrentRequest({...currentRequest, category: value as typeof CATEGORIES[number]})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{isEditing ? "Guardar Cambios" : "Crear Solicitud"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
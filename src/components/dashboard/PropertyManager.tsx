import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Building, Trash2, Edit, Upload, Camera, Code } from "lucide-react";
import { CommunityCodeService } from "@/services/CommunityCodeService";
import { Database } from "@/integrations/supabase/database.types";

// Define types from database
type Property = Database['public']['Tables']['properties']['Row'];
type PropertyInsert = Database['public']['Tables']['properties']['Insert'];

// Extended property interface with new fields
interface ExtendedProperty extends Property {
  street?: string | null;
  number?: string | null;
  province?: string | null;
  country?: string | null;
  community_code?: string | null;
  property_photo_url?: string | null;
}

export default function PropertyManager() {
  const { user } = useSupabaseAuth();
  const [properties, setProperties] = useState<ExtendedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProperty, setCurrentProperty] = useState<Partial<ExtendedProperty>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

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

  const handleOpenDialog = (property: ExtendedProperty | null = null) => {
    if (property) {
      setIsEditing(true);
      setCurrentProperty(property);
    } else {
      setIsEditing(false);
      setCurrentProperty({
        name: "",
        street: "",
        number: "",
        city: "",
        province: "",
        country: "España",
        postal_code: "",
        property_type: "residential",
        description: "",
        community_code: "",
        property_photo_url: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleGenerateCommunityCode = async () => {
    if (!user || !currentProperty.country || !currentProperty.province || 
        !currentProperty.city || !currentProperty.street || !currentProperty.number) {
      setError("Por favor, completa todos los campos obligatorios antes de generar el código");
      return;
    }

    setGeneratingCode(true);
    try {
      const codeData = {
        country: currentProperty.country,
        province: currentProperty.province,
        city: currentProperty.city,
        street: currentProperty.street,
        street_number: currentProperty.number,
        created_by: user.id
      };

      const result = await CommunityCodeService.createOrGetCommunityCode(codeData);
      
      setCurrentProperty({
        ...currentProperty,
        community_code: result.code
      });

      if (result.isNew) {
        // Mostrar notificación de código nuevo
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.innerHTML = `
          <div class="flex items-center gap-2">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Código de comunidad generado: ${result.code}</span>
          </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 5000);
      } else {
        // Mostrar notificación de código existente
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.innerHTML = `
          <div class="flex items-center gap-2">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Código existente recuperado: ${result.code}</span>
          </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 5000);
      }

    } catch (err: any) {
      setError(`Error generando código: ${err.message}`);
    } finally {
      setGeneratingCode(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploadingPhoto(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `property-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      setCurrentProperty({
        ...currentProperty,
        property_photo_url: data.publicUrl
      });

    } catch (err: any) {
      setError(`Error subiendo foto: ${err.message}`);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const propertyData = {
        ...currentProperty,
        user_id: user.id,
        name: currentProperty.name || '',
        street: currentProperty.street || '',
        number: currentProperty.number || '',
        city: currentProperty.city || '',
        province: currentProperty.province || '',
        country: currentProperty.country || 'España',
        postal_code: currentProperty.postal_code || '',
        community_code: currentProperty.community_code || '',
        property_photo_url: currentProperty.property_photo_url || '',
        // Mantener compatibilidad con el campo address existente
        address: `${currentProperty.street || ''} ${currentProperty.number || ''}`.trim(),
      };
      
      let res;
      if (isEditing) {
        const { id, created_at, user_id, ...updateData } = propertyData as ExtendedProperty & { id: string; created_at: string; user_id: string };
        res = await supabase.from("properties").update(updateData).eq("id", currentProperty.id!);
      } else {
        const insertData: PropertyInsert & {
          street?: string;
          number?: string;
          province?: string;
          country?: string;
          community_code?: string;
          property_photo_url?: string;
        } = {
          user_id: user.id,
          name: propertyData.name || 'Nueva Propiedad',
          address: propertyData.address || '',
          street: propertyData.street,
          number: propertyData.number,
          city: propertyData.city || '',
          province: propertyData.province,
          country: propertyData.country,
          postal_code: propertyData.postal_code || '',
          property_type: (propertyData as ExtendedProperty).property_type || 'residential',
          description: propertyData.description || '',
          units_count: (currentProperty as any).units_count || 1,
          community_code: propertyData.community_code,
          property_photo_url: propertyData.property_photo_url
        };
        res = await supabase.from("properties").insert(insertData);
      }

      if (res.error) throw res.error;

      setIsDialogOpen(false);
      await fetchProperties();

      // Mostrar notificación de éxito
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Propiedad ${isEditing ? 'actualizada' : 'creada'} exitosamente</span>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);

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

      // Mostrar notificación de eliminación
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
          <span>Propiedad eliminada</span>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);

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
          <CardDescription>Añade y administra tus propiedades con información detallada y códigos de comunidad únicos.</CardDescription>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Añadir Propiedad
        </Button>
      </CardHeader>
      <CardContent>
        {error && <Alert variant="destructive" className="mb-4"><AlertDescription>{error}</AlertDescription></Alert>}

        <div className="space-y-4">
          {properties.length > 0 ? (
            properties.map(prop => (
              <Card key={prop.id} className="p-4 border-l-4 border-l-blue-500">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{prop.name}</h3>
                      {prop.community_code && (
                        <Badge variant="outline" className="font-mono text-sm bg-blue-50 text-blue-700 border-blue-200">
                          {prop.community_code}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Dirección:</span> {prop.street ? `${prop.street} ${prop.number}` : prop.address}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Ciudad:</span> {prop.city}
                          {prop.province && <>, {prop.province}</>}
                          {prop.country && <>, {prop.country}</>}
                        </p>
                        {prop.postal_code && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">C.P.:</span> {prop.postal_code}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Tipo:</span> {
                            prop.property_type === 'residential' ? 'Residencial' :
                            prop.property_type === 'commercial' ? 'Comercial' :
                            prop.property_type === 'industrial' ? 'Industrial' :
                            prop.property_type
                          }
                        </p>
                        {prop.units_count && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Unidades:</span> {prop.units_count}
                          </p>
                        )}
                        {prop.description && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Descripción:</span> {prop.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {prop.property_photo_url && (
                      <div className="mt-3">
                        <img 
                          src={prop.property_photo_url} 
                          alt="Foto de la propiedad" 
                          className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog(prop)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(prop.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar" : "Añadir"} Propiedad</DialogTitle>
            <DialogDescription>
              {isEditing ? "Modifica los detalles de tu propiedad." : "Completa los detalles para añadir una nueva propiedad."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            {/* Información básica */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Información Básica</h4>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nombre *</Label>
                <Input 
                  id="name" 
                  value={currentProperty.name || ''} 
                  onChange={(e) => setCurrentProperty({...currentProperty, name: e.target.value})} 
                  className="col-span-3" 
                  placeholder="Ej: Mi casa, Apartamento centro..."
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Descripción</Label>
                <Textarea 
                  id="description" 
                  value={currentProperty.description || ''} 
                  onChange={(e) => setCurrentProperty({...currentProperty, description: e.target.value})} 
                  className="col-span-3" 
                  placeholder="Descripción de la propiedad..."
                  rows={2}
                />
              </div>
            </div>

            {/* Ubicación */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Ubicación</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Calle *</Label>
                  <Input 
                    id="street" 
                    value={currentProperty.street || ''} 
                    onChange={(e) => setCurrentProperty({...currentProperty, street: e.target.value})} 
                    placeholder="Nombre de la calle"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number">Número *</Label>
                  <Input 
                    id="number" 
                    value={currentProperty.number || ''} 
                    onChange={(e) => setCurrentProperty({...currentProperty, number: e.target.value})} 
                    placeholder="Ej: 25, 25B"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad *</Label>
                  <Input 
                    id="city" 
                    value={currentProperty.city || ''} 
                    onChange={(e) => setCurrentProperty({...currentProperty, city: e.target.value})} 
                    placeholder="Nombre de la ciudad"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal_code">Código Postal</Label>
                  <Input 
                    id="postal_code" 
                    value={currentProperty.postal_code || ''} 
                    onChange={(e) => setCurrentProperty({...currentProperty, postal_code: e.target.value})} 
                    placeholder="28001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="province">Provincia *</Label>
                  <Input 
                    id="province" 
                    value={currentProperty.province || ''} 
                    onChange={(e) => setCurrentProperty({...currentProperty, province: e.target.value})} 
                    placeholder="Nombre de la provincia"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">País *</Label>
                  <Input 
                    id="country" 
                    value={currentProperty.country || 'España'} 
                    onChange={(e) => setCurrentProperty({...currentProperty, country: e.target.value})} 
                    placeholder="País"
                  />
                </div>
              </div>
            </div>

            {/* Código de comunidad */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Código de Comunidad</h4>
              
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input 
                    id="community_code" 
                    value={currentProperty.community_code || ''} 
                    readOnly
                    placeholder="Se generará automáticamente"
                    className="bg-gray-50"
                  />
                </div>
                <Button 
                  type="button" 
                  onClick={handleGenerateCommunityCode}
                  disabled={generatingCode || !currentProperty.country || !currentProperty.province || !currentProperty.city || !currentProperty.street || !currentProperty.number}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {generatingCode ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Code className="mr-2 h-4 w-4" />
                      Generar Código
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                El código se genera con las 3 primeras letras del país, provincia, ciudad, 6 letras de la calle y 4 dígitos del número.
              </p>
            </div>

            {/* Fotografía */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Fotografía de la Propiedad</h4>
              
              <div className="space-y-3">
                {currentProperty.property_photo_url && (
                  <div className="flex items-center gap-4">
                    <img 
                      src={currentProperty.property_photo_url} 
                      alt="Vista previa" 
                      className="w-20 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={() => setCurrentProperty({...currentProperty, property_photo_url: ""})}
                    >
                      Eliminar foto
                    </Button>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="property_photo"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => document.getElementById('property_photo')?.click()}
                    disabled={uploadingPhoto}
                  >
                    {uploadingPhoto ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Subiendo...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-4 w-4" />
                        {currentProperty.property_photo_url ? 'Cambiar foto' : 'Subir foto'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Detalles adicionales */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Detalles Adicionales</h4>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="units_count" className="text-right">Nº Unidades</Label>
                <Input 
                  id="units_count" 
                  type="number" 
                  min="1"
                  value={(currentProperty as any).units_count || 1} 
                  onChange={(e) => setCurrentProperty({...currentProperty, units_count: parseInt(e.target.value, 10)})} 
                  className="col-span-3" 
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={generatingCode || uploadingPhoto}>
              {isEditing ? "Guardar Cambios" : "Crear Propiedad"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

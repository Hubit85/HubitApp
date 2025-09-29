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

// Create a simple type that includes all the fields we need
interface ExtendedProperty {
  id?: string;
  user_id?: string;
  name?: string | null;
  address?: string | null;
  street?: string | null;
  number?: string | null;
  floor?: string | null;
  door?: string | null;
  city?: string | null;
  province?: string | null;
  country?: string | null;
  postal_code?: string | null;
  property_type?: string | null;
  description?: string | null;
  units_count?: number | null;
  community_code?: string | null;
  property_photo_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  amenities?: string[] | null;
  images?: string[] | null;
  size?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  garage?: boolean | null;
  garden?: boolean | null;
  pool?: boolean | null;
  elevator?: boolean | null;
  year_built?: number | null;
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
        floor: "",
        door: "",
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
      if (isEditing && currentProperty.id) {
        // Para actualizar, usar solo los campos que existen en la tabla
        const updateData = {
          name: currentProperty.name || '',
          city: currentProperty.city || '',
          postal_code: currentProperty.postal_code || '',
          description: currentProperty.description || '',
          // Mantener compatibilidad con address existente
          address: `${currentProperty.street || ''} ${currentProperty.number || ''}`.trim(),
          updated_at: new Date().toISOString(),
        };
        
        const { error } = await supabase
          .from("properties")
          .update(updateData)
          .eq("id", currentProperty.id);
          
        if (error) throw error;
      } else {
        // Para insertar, crear datos básicos compatibles
        const insertData = {
          user_id: user.id,
          name: currentProperty.name || 'Nueva Propiedad',
          address: `${currentProperty.street || ''} ${currentProperty.number || ''}`.trim(),
          city: currentProperty.city || '',
          postal_code: currentProperty.postal_code || '',
          property_type: 'residential',
          description: currentProperty.description || '',
          units_count: 1,
        };
        
        const { error } = await supabase
          .from("properties")
          .insert(insertData);
          
        if (error) throw error;
      }

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

  const handleDelete = async (propertyId: string | undefined) => {
    if (!propertyId || !confirm("¿Estás seguro de que quieres eliminar esta propiedad?")) return;
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
      }, 5000);

    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="flex justify-center items-center"><Loader2 className="animate-spin mr-2" /> Cargando propiedades...</div>;

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-slate-50 to-white">
      <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-t-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <Building className="h-7 w-7" />
              Mis Propiedades
            </CardTitle>
            <CardDescription className="text-slate-200 mt-2 text-base">
              Gestiona tu cartera inmobiliaria con información detallada y códigos de comunidad únicos.
            </CardDescription>
          </div>
          <Button 
            onClick={() => handleOpenDialog()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" /> Añadir Propiedad
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        {error && (
          <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(prop => (
                <Card key={prop.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white">
                  {/* Photo Section */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {prop.property_photo_url ? (
                      <img 
                        src={prop.property_photo_url} 
                        alt={`Fotografía de ${prop.name}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100">
                        <div className="text-center">
                          <Building className="h-16 w-16 text-slate-300 mx-auto mb-3" />
                          <p className="text-slate-400 text-sm font-medium">Sin fotografía</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Community Code Badge */}
                    {prop.community_code && (
                      <div className="absolute top-3 left-3">
                        <Badge className="font-mono text-xs bg-white/90 text-slate-700 border-0 shadow-md backdrop-blur-sm">
                          <Code className="h-3 w-3 mr-1" />
                          {prop.community_code}
                        </Badge>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleOpenDialog(prop)}
                        className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm border-0 shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
                      >
                        <Edit className="h-4 w-4 text-slate-600" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDelete(prop.id)}
                        className="h-8 w-8 p-0 bg-red-500/90 backdrop-blur-sm border-0 shadow-md hover:bg-red-600 hover:scale-110 transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <CardContent className="p-5">
                    <div className="space-y-4">
                      {/* Title and Type */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-slate-900 transition-colors">
                            {prop.name}
                          </h3>
                          <Badge variant="outline" className="mt-2 text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                            {prop.property_type === 'residential' ? 'Residencial' :
                             prop.property_type === 'commercial' ? 'Comercial' :
                             prop.property_type === 'industrial' ? 'Industrial' :
                             prop.property_type}
                          </Badge>
                        </div>
                      </div>

                      {/* Address Section */}
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Building className="h-4 w-4 text-slate-400 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700 leading-relaxed">
                              {prop.street ? `${prop.street} ${prop.number}` : prop.address}
                              {(prop.floor || prop.door) && (
                                <span className="text-blue-600 font-semibold ml-1">
                                  {prop.floor && `${prop.floor}º`}
                                  {prop.door && ` ${prop.door}`}
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-slate-500">
                              {prop.city}
                              {prop.province && <span>, {prop.province}</span>}
                              {prop.country && <span>, {prop.country}</span>}
                            </p>
                            {prop.postal_code && (
                              <p className="text-xs text-slate-400 font-mono">
                                CP {prop.postal_code}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {prop.description && (
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                            {prop.description}
                          </p>
                        </div>
                      )}

                      {/* Details Grid */}
                      <div className="flex items-center justify-between pt-2 text-xs">
                        {prop.units_count && (
                          <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-full">
                            <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                            <span className="font-medium text-slate-600">{prop.units_count} unidades</span>
                          </div>
                        )}
                        
                        <div className="text-xs text-slate-400">
                          {prop.created_at && new Date(prop.created_at).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-2xl border border-slate-100">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">No hay propiedades registradas</h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                Empieza añadiendo tu primera propiedad para gestionar tu cartera inmobiliaria.
              </p>
              <Button 
                onClick={() => handleOpenDialog()}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="mr-2 h-4 w-4" /> Añadir Primera Propiedad
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-white via-slate-50 to-white">
          <DialogHeader className="pb-4 border-b border-slate-200">
            <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              {isEditing ? (
                <>
                  <Edit className="h-6 w-6 text-blue-600" />
                  Editar Propiedad
                </>
              ) : (
                <>
                  <Plus className="h-6 w-6 text-green-600" />
                  Añadir Nueva Propiedad
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-slate-600 text-base">
              {isEditing ? "Modifica los detalles de tu propiedad y mantén actualizada tu información." : "Completa todos los campos para registrar una nueva propiedad en tu cartera."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-8 py-6">
            {/* Fotografía Principal - Primera Sección */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Fotografía de la Propiedad
                </h4>
                <p className="text-purple-100 text-sm mt-1">Sube una imagen representativa de tu propiedad</p>
              </div>
              
              <div className="p-6">
                {currentProperty.property_photo_url ? (
                  <div className="space-y-4">
                    <div className="relative group">
                      <img 
                        src={currentProperty.property_photo_url} 
                        alt="Vista previa de la propiedad" 
                        className="w-full h-64 object-cover rounded-lg border-2 border-slate-200 shadow-md"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-lg flex items-center justify-center">
                        <Button 
                          type="button"
                          variant="destructive" 
                          size="sm"
                          onClick={() => setCurrentProperty({...currentProperty, property_photo_url: ""})}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar foto
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center gap-3">
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
                        className="hover:bg-slate-50"
                      >
                        {uploadingPhoto ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Subiendo...
                          </>
                        ) : (
                          <>
                            <Camera className="mr-2 h-4 w-4" />
                            Cambiar fotografía
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        type="button"
                        onClick={handleSave}
                        disabled={generatingCode || uploadingPhoto}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-md"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Guardar Cambios
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Camera className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-slate-600 font-medium mb-2">No hay fotografía</p>
                      <p className="text-slate-400 text-sm mb-4">Añade una imagen para mostrar tu propiedad</p>
                      
                      <input
                        type="file"
                        id="property_photo"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <div className="flex items-center justify-center gap-3">
                        <Button 
                          type="button"
                          onClick={() => document.getElementById('property_photo')?.click()}
                          disabled={uploadingPhoto}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        >
                          {uploadingPhoto ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Subiendo...
                            </>
                          ) : (
                            <>
                              <Camera className="mr-2 h-4 w-4" />
                              Subir fotografía
                            </>
                          )}
                        </Button>
                        
                        <Button 
                          type="button"
                          onClick={handleSave}
                          disabled={generatingCode || uploadingPhoto}
                          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Guardar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Información básica */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Información Básica
                </h4>
                <p className="text-blue-100 text-sm mt-1">Datos principales de identificación</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-slate-700">Nombre de la Propiedad *</Label>
                    <Input 
                      id="name" 
                      value={currentProperty.name || ''} 
                      onChange={(e) => setCurrentProperty({...currentProperty, name: e.target.value})} 
                      placeholder="Ej: Mi casa, Apartamento centro..."
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-semibold text-slate-700">Descripción</Label>
                    <Textarea 
                      id="description" 
                      value={currentProperty.description || ''} 
                      onChange={(e) => setCurrentProperty({...currentProperty, description: e.target.value})} 
                      placeholder="Descripción breve de la propiedad..."
                      rows={3}
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Dirección y Ubicación
                </h4>
                <p className="text-emerald-100 text-sm mt-1">Información detallada de localización</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street" className="text-sm font-semibold text-slate-700">Calle *</Label>
                    <Input 
                      id="street" 
                      value={currentProperty.street || ''} 
                      onChange={(e) => setCurrentProperty({...currentProperty, street: e.target.value})} 
                      placeholder="Nombre de la calle"
                      className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number" className="text-sm font-semibold text-slate-700">Número *</Label>
                    <Input 
                      id="number" 
                      value={currentProperty.number || ''} 
                      onChange={(e) => setCurrentProperty({...currentProperty, number: e.target.value})} 
                      placeholder="Ej: 25, 25B"
                      className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="floor" className="text-sm font-semibold text-slate-700">Piso</Label>
                    <Input 
                      id="floor" 
                      value={currentProperty.floor || ''} 
                      onChange={(e) => setCurrentProperty({...currentProperty, floor: e.target.value})} 
                      placeholder="Ej: 3, 3º, Bajo"
                      className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                    <p className="text-xs text-slate-500">
                      Para distinguir la propiedad individual (no necesario para el código de comunidad)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="door" className="text-sm font-semibold text-slate-700">Mano / Puerta</Label>
                    <Input 
                      id="door" 
                      value={currentProperty.door || ''} 
                      onChange={(e) => setCurrentProperty({...currentProperty, door: e.target.value})} 
                      placeholder="Ej: A, B, Izda, Dcha"
                      className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                    <p className="text-xs text-slate-500">
                      Letra o posición de la puerta (no necesario para el código de comunidad)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-semibold text-slate-700">Ciudad *</Label>
                    <Input 
                      id="city" 
                      value={currentProperty.city || ''} 
                      onChange={(e) => setCurrentProperty({...currentProperty, city: e.target.value})} 
                      placeholder="Nombre de la ciudad"
                      className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal_code" className="text-sm font-semibold text-slate-700">Código Postal</Label>
                    <Input 
                      id="postal_code" 
                      value={currentProperty.postal_code || ''} 
                      onChange={(e) => setCurrentProperty({...currentProperty, postal_code: e.target.value})} 
                      placeholder="28001"
                      className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="province" className="text-sm font-semibold text-slate-700">Provincia *</Label>
                    <Input 
                      id="province" 
                      value={currentProperty.province || ''} 
                      onChange={(e) => setCurrentProperty({...currentProperty, province: e.target.value})} 
                      placeholder="Nombre de la provincia"
                      className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-semibold text-slate-700">País *</Label>
                    <Input 
                      id="country" 
                      value={currentProperty.country || 'España'} 
                      onChange={(e) => setCurrentProperty({...currentProperty, country: e.target.value})} 
                      placeholder="País"
                      className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Código de comunidad */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Código de Comunidad
                </h4>
                <p className="text-amber-100 text-sm mt-1">Identificador único de la ubicación</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input 
                      id="community_code" 
                      value={currentProperty.community_code || ''} 
                      readOnly
                      placeholder="Se generará automáticamente"
                      className="bg-slate-50 border-slate-300 font-mono text-center text-lg"
                    />
                  </div>
                  <Button 
                    type="button" 
                    onClick={handleGenerateCommunityCode}
                    disabled={generatingCode || !currentProperty.country || !currentProperty.province || !currentProperty.city || !currentProperty.street || !currentProperty.number}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-md"
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
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800 leading-relaxed">
                    <strong>Formato del código:</strong> País(3) - Provincia(3) - Ciudad(3) - Calle(6) - Número(4)
                    <br />
                    El código se genera automáticamente usando los primeros caracteres de cada campo.
                  </p>
                </div>
              </div>
            </div>

            {/* Detalles adicionales */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Información Adicional
                </h4>
                <p className="text-purple-100 text-sm mt-1">Detalles complementarios de la propiedad</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <Label htmlFor="units_count" className="text-sm font-semibold text-slate-700">Número de Unidades</Label>
                  <Input 
                    id="units_count" 
                    type="number" 
                    min="1"
                    value={(currentProperty as any).units_count || 1} 
                    onChange={(e) => setCurrentProperty({...currentProperty, units_count: parseInt(e.target.value, 10)})} 
                    className="border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                  <p className="text-xs text-slate-500">Número total de viviendas o locales</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-6 border-t border-slate-200 bg-slate-50/50">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-300 hover:bg-slate-50">
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={generatingCode || uploadingPhoto}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md"
            >
              {isEditing ? "Guardar Cambios" : "Crear Propiedad"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

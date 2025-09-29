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
    setError(""); // Limpiar errores previos
    
    try {
      console.log('🔄 Iniciando subida de foto...', { 
        fileName: file.name, 
        size: file.size, 
        type: file.type 
      });
      
      // Validar que el archivo sea una imagen
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen (JPEG, PNG, WebP)');
      }

      // Validar tamaño máximo (10MB para mejor flexibilidad)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('La imagen es demasiado grande. Máximo 10MB permitido');
      }

      // Crear un nombre único para el archivo con mejor estructura
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const cleanFileName = `hubit_property_${user.id}_${timestamp}_${randomId}.${fileExtension}`;
      const filePath = `property-photos/${cleanFileName}`;

      console.log('📁 Preparando subida:', { cleanFileName, filePath });

      // Subir archivo a Supabase Storage con configuración optimizada
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file, {
          cacheControl: '86400', // 24 horas
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        console.error('❌ Error de subida:', uploadError);
        throw new Error(`Error subiendo imagen: ${uploadError.message}`);
      }

      console.log('✅ Archivo subido exitosamente:', uploadData);

      // Obtener la URL pública de la imagen con validación mejorada
      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error('No se pudo obtener la URL pública de la imagen');
      }

      // Construir URL optimizada y verificada
      const imageUrl = urlData.publicUrl;
      console.log('🔗 URL pública generada:', imageUrl);

      // Precargar la imagen para asegurar que funciona antes de guardarlam
      const testImage = new Image();
      testImage.onload = () => {
        console.log('✅ Imagen verificada y precargada correctamente');
        
        // Actualizar el estado con la nueva URL SOLO después de verificar que funciona
        setCurrentProperty({
          ...currentProperty,
          property_photo_url: imageUrl
        });

        // Mostrar notificación de éxito mejorada
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-6 rounded-xl shadow-2xl z-50 border border-emerald-300 backdrop-blur-sm';
        successDiv.innerHTML = `
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <p class="text-lg font-bold">¡Imagen subida correctamente!</p>
              <p class="text-sm text-emerald-100 mt-1">La fotografía se ha guardado y está lista para mostrarse</p>
              <div class="flex items-center gap-2 mt-2">
                <div class="w-2 h-2 bg-emerald-200 rounded-full animate-pulse"></div>
                <span class="text-xs text-emerald-200 font-medium">Verificada • ${Math.round(file.size / 1024)}KB</span>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(successDiv);
        
        // Animación de salida después de 5 segundos
        setTimeout(() => {
          if (document.body.contains(successDiv)) {
            successDiv.style.transition = 'all 0.8s ease-out';
            successDiv.style.transform = 'translateX(120%) scale(0.9)';
            successDiv.style.opacity = '0';
            setTimeout(() => {
              if (document.body.contains(successDiv)) {
                document.body.removeChild(successDiv);
              }
            }, 800);
          }
        }, 5000);
      };

      testImage.onerror = () => {
        console.error('❌ Error verificando imagen después de subida');
        throw new Error('La imagen se subió pero no se puede verificar su accesibilidad');
      };

      // Iniciar verificación de imagen
      testImage.src = imageUrl;

    } catch (err: any) {
      console.error('❌ Error completo al subir imagen:', err);
      setError(`Error subiendo imagen: ${err.message}`);
      
      // Mostrar notificación de error mejorada
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-6 rounded-xl shadow-2xl z-50 border border-red-400 backdrop-blur-sm max-w-md';
      errorDiv.innerHTML = `
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-lg font-bold">Error al subir imagen</p>
            <p class="text-sm text-red-100 mt-1 leading-relaxed">${err.message}</p>
            <div class="mt-3 p-3 bg-red-800/30 rounded-lg border border-red-500/30">
              <p class="text-xs text-red-200 font-medium">💡 Consejos:</p>
              <ul class="text-xs text-red-200 mt-1 space-y-1">
                <li>• Usa imágenes JPG, PNG o WebP</li>
                <li>• Tamaño máximo: 10MB</li>
                <li>• Verifica tu conexión a internet</li>
              </ul>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(errorDiv);
      
      // Remover después de 10 segundos con animación
      setTimeout(() => {
        if (document.body.contains(errorDiv)) {
          errorDiv.style.transition = 'all 0.8s ease-out';
          errorDiv.style.transform = 'translateX(120%) scale(0.9)';
          errorDiv.style.opacity = '0';
          setTimeout(() => {
            if (document.body.contains(errorDiv)) {
              document.body.removeChild(errorDiv);
            }
          }, 800);
        }
      }, 10000);
      
    } finally {
      setUploadingPhoto(false);
      // Limpiar el input file
      const fileInput = event.target;
      fileInput.value = '';
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      if (isEditing && currentProperty.id) {
        // Para actualizar, incluir TODOS los campos nuevos
        const updateData = {
          name: currentProperty.name || '',
          // Mantener tanto address como los campos separados para compatibilidad
          address: `${currentProperty.street || ''} ${currentProperty.number || ''}`.trim(),
          street: currentProperty.street || null,
          number: currentProperty.number || null,
          floor: currentProperty.floor || null,
          door: currentProperty.door || null,
          city: currentProperty.city || '',
          province: currentProperty.province || null,
          country: currentProperty.country || 'España',
          postal_code: currentProperty.postal_code || '',
          description: currentProperty.description || '',
          property_type: currentProperty.property_type || 'residential',
          units_count: currentProperty.units_count || 1,
          property_photo_url: currentProperty.property_photo_url || null,
          community_code: currentProperty.community_code || null,
          updated_at: new Date().toISOString(),
        };
        
        const { error } = await supabase
          .from("properties")
          .update(updateData)
          .eq("id", currentProperty.id);
          
        if (error) throw error;
      } else {
        // Para insertar, crear datos completos con TODOS los campos nuevos
        const insertData = {
          user_id: user.id,
          name: currentProperty.name || 'Nueva Propiedad',
          address: `${currentProperty.street || ''} ${currentProperty.number || ''}`.trim(),
          street: currentProperty.street || null,
          number: currentProperty.number || null,
          floor: currentProperty.floor || null,
          door: currentProperty.door || null,
          city: currentProperty.city || '',
          province: currentProperty.province || null,
          country: currentProperty.country || 'España',
          postal_code: currentProperty.postal_code || '',
          property_type: currentProperty.property_type || 'residential',
          description: currentProperty.description || '',
          units_count: currentProperty.units_count || 1,
          property_photo_url: currentProperty.property_photo_url || null,
          community_code: currentProperty.community_code || null,
        };
        
        const { error } = await supabase
          .from("properties")
          .insert(insertData);
          
        if (error) throw error;
      }

      setIsDialogOpen(false);
      await fetchProperties();

      // Mostrar notificación de éxito mejorada
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-lg shadow-xl z-50 border border-green-400';
      successDiv.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div>
            <p class="font-semibold">${isEditing ? '¡Propiedad actualizada!' : '¡Propiedad creada!'}</p>
            <p class="text-sm text-green-100">Todos los cambios se han guardado correctamente</p>
          </div>
        </div>
      `;
      document.body.appendChild(successDiv);
      
      // Animación de salida
      setTimeout(() => {
        if (document.body.contains(successDiv)) {
          successDiv.style.transition = 'all 0.5s ease-out';
          successDiv.style.transform = 'translateX(100%)';
          successDiv.style.opacity = '0';
          setTimeout(() => {
            if (document.body.contains(successDiv)) {
              document.body.removeChild(successDiv);
            }
          }, 500);
        }
      }, 4000);

    } catch (err: any) {
        console.error('Error saving property:', err);
        setError(`Error guardando la propiedad: ${err.message}`);
        
        // Mostrar notificación de error mejorada
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-lg shadow-xl z-50 border border-red-400';
        errorDiv.innerHTML = `
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <div>
              <p class="font-semibold">Error al guardar</p>
              <p class="text-sm text-red-100">${err.message}</p>
            </div>
          </div>
        `;
        document.body.appendChild(errorDiv);
        setTimeout(() => {
          if (document.body.contains(errorDiv)) {
            document.body.removeChild(errorDiv);
          }
        }, 5000);
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {properties.map(prop => (
                <Card key={prop.id} className="group hover:shadow-2xl transition-all duration-700 border-0 shadow-xl overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-200 hover:scale-[1.03] transform-gpu backdrop-blur-sm">
                  {/* DRAMATICALLY ENHANCED Photo Section - Made Even More Prominent */}
                  <div className="relative h-80 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 overflow-hidden group cursor-pointer">
                    {prop.property_photo_url ? (
                      <>
                        {/* Professional Main Property Image Display */}
                        <img 
                          src={prop.property_photo_url} 
                          alt={`Fotografía profesional de ${prop.name}`}
                          className="w-full h-full object-cover transition-all duration-1200 group-hover:scale-115 group-hover:brightness-110"
                          style={{
                            filter: 'contrast(1.05) saturate(1.1)'
                          }}
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200">
                                  <div class="text-center">
                                    <div class="w-24 h-24 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                      <svg class="h-12 w-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                      </svg>
                                    </div>
                                    <p class="text-slate-500 text-lg font-bold mb-2">Imagen no disponible</p>
                                    <p class="text-slate-400 text-sm">No se pudo cargar la fotografía</p>
                                  </div>
                                </div>
                              `;
                            }
                          }}
                        />
                        
                        {/* Premium Gradient Overlays for Professional Look */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-all duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20 opacity-50 group-hover:opacity-30 transition-all duration-700" />
                        
                        {/* PREMIUM Photo Quality Badge - Very Prominent */}
                        <div className="absolute bottom-6 left-6 opacity-95 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105">
                          <div className="bg-white/98 backdrop-blur-xl rounded-2xl px-6 py-3 shadow-2xl border border-white/30">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                              <div className="text-left">
                                <p className="text-sm font-black text-slate-800 leading-none">Fotografía Profesional</p>
                                <p className="text-xs font-semibold text-emerald-600 leading-none mt-0.5">HD • Verificada</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Premium HuBiT Watermark */}
                        <div className="absolute top-6 left-6 opacity-80 group-hover:opacity-100 transition-all duration-500">
                          <div className="bg-black/70 backdrop-blur-lg rounded-xl px-4 py-2 shadow-xl">
                            <div className="flex items-center gap-2">
                              <Camera className="h-4 w-4 text-white" />
                              <span className="text-sm font-black text-white tracking-wide">HuBiT</span>
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse ml-1"></div>
                            </div>
                          </div>
                        </div>

                        {/* Professional Photo Frame Effect */}
                        <div className="absolute inset-3 border-2 border-white/20 rounded-lg opacity-0 group-hover:opacity-60 transition-all duration-700 pointer-events-none"></div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-100 group-hover:from-slate-200 group-hover:via-slate-100 group-hover:to-slate-200 transition-all duration-700 relative overflow-hidden">
                        {/* Sophisticated Pattern Background */}
                        <div className="absolute inset-0 opacity-8" style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23475569' fill-opacity='0.6'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                        }} />
                        
                        <div className="text-center transform group-hover:scale-110 transition-all duration-700 z-10">
                          <div className="w-32 h-32 bg-gradient-to-br from-slate-300 via-slate-200 to-slate-400 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:shadow-2xl transition-shadow duration-700 border-4 border-white shadow-lg">
                            <Building className="h-16 w-16 text-white drop-shadow-2xl" />
                          </div>
                          <div className="space-y-3">
                            <p className="text-slate-600 text-xl font-bold">Sin fotografía</p>
                            <p className="text-slate-500 text-sm max-w-56 mx-auto leading-relaxed">
                              Añade una imagen profesional para destacar tu propiedad y generar más interés
                            </p>
                            <div className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500/15 to-purple-500/15 rounded-full inline-block border border-blue-200">
                              <p className="text-blue-700 text-sm font-semibold">📸 Haz clic para añadir foto</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Enhanced Community Code Badge - More Premium */}
                    {prop.community_code && (
                      <div className="absolute top-6 right-6 transform group-hover:scale-110 transition-all duration-500 z-30">
                        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 rounded-xl px-4 py-3 shadow-2xl border-2 border-white/30 backdrop-blur-sm">
                          <div className="flex items-center gap-2">
                            <Code className="h-4 w-4 text-white" />
                            <span className="font-mono text-sm font-black text-white tracking-wider drop-shadow-sm">
                              {prop.community_code}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Premium Action Buttons - Even More Professional */}
                    <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleOpenDialog(prop)}
                        className="h-12 w-12 p-0 bg-white/98 backdrop-blur-xl border-2 border-white/50 shadow-2xl hover:bg-white hover:scale-125 hover:shadow-2xl transition-all duration-300 rounded-full group/btn"
                      >
                        <Edit className="h-5 w-5 text-slate-600 group-hover/btn:text-blue-600 transition-colors drop-shadow-sm" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDelete(prop.id)}
                        className="h-12 w-12 p-0 bg-gradient-to-r from-red-500 to-red-600 backdrop-blur-xl border-2 border-red-300 shadow-2xl hover:from-red-600 hover:to-red-700 hover:scale-125 hover:shadow-2xl transition-all duration-300 rounded-full"
                      >
                        <Trash2 className="h-5 w-5 drop-shadow-sm" />
                      </Button>
                    </div>

                    {/* Enhanced Property Type Badge */}
                    <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0 delay-150 z-20">
                      <Badge 
                        variant="outline" 
                        className="bg-white/98 backdrop-blur-xl text-slate-800 border-2 border-white/50 shadow-xl text-sm font-black px-4 py-2 rounded-full"
                      >
                        {prop.property_type === 'residential' ? '🏠 Residencial' :
                         prop.property_type === 'commercial' ? '🏢 Comercial' :
                         prop.property_type === 'industrial' ? '🏭 Industrial' :
                         '🏘️ ' + prop.property_type}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Enhanced Content Section */}
                  <CardContent className="p-6">
                    <div className="space-y-5">
                      {/* Title Section with Enhanced Typography */}
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-slate-800 leading-tight group-hover:text-slate-900 transition-colors mb-2 line-clamp-2">
                              {prop.name}
                            </h3>
                            
                            {/* Property Metadata Pills */}
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline" className="text-xs bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200 font-medium">
                                ✓ {prop.property_type === 'residential' ? 'Residencial' :
                                     prop.property_type === 'commercial' ? 'Comercial' :
                                     prop.property_type === 'industrial' ? 'Industrial' :
                                     prop.property_type}
                              </Badge>
                              
                              {prop.units_count && prop.units_count > 1 && (
                                <Badge variant="outline" className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 font-medium">
                                  🏠 {prop.units_count} unidades
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Address Section with Better Formatting */}
                      <div className="space-y-3 pb-4 border-b border-slate-100">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <Building className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-2">
                            {/* Main Address */}
                            <div>
                              <p className="text-base font-semibold text-slate-800 leading-relaxed">
                                {prop.street ? `${prop.street} ${prop.number}` : prop.address}
                                {(prop.floor || prop.door) && (
                                  <span className="inline-flex items-center ml-2 px-2 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-sm font-bold rounded-full">
                                    {prop.floor && `${prop.floor}º`}
                                    {prop.door && ` ${prop.door}`}
                                  </span>
                                )}
                              </p>
                            </div>
                            
                            {/* Location Details */}
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                                {prop.city}
                                {prop.province && <span className="text-slate-400">•</span>}
                                {prop.province && <span>{prop.province}</span>}
                                {prop.country && <span className="text-slate-400">•</span>}
                                {prop.country && <span>{prop.country}</span>}
                              </p>
                              
                              {prop.postal_code && (
                                <p className="text-xs text-slate-500 font-mono bg-slate-50 inline-block px-2 py-1 rounded">
                                  📮 CP {prop.postal_code}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Description Section */}
                      {prop.description && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
                            <h4 className="text-sm font-semibold text-slate-700">Descripción</h4>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 pl-3 border-l-2 border-slate-100">
                            {prop.description}
                          </p>
                        </div>
                      )}

                      {/* Enhanced Footer with Stats */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                          {prop.created_at && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse"></div>
                              <span className="font-medium">
                                Registrada {new Date(prop.created_at).toLocaleDateString('es-ES', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Property Status */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs font-medium text-green-700">Activa</span>
                          </div>
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

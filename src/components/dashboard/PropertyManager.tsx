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
import { Loader2, Plus, Building, Trash2, Edit, Upload, Camera, Code, Save, RefreshCw } from "lucide-react";
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
  const [savingProperty, setSavingProperty] = useState(false);

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
    setError("");
    
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
          cacheControl: '86400',
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

      const imageUrl = urlData.publicUrl;
      console.log('🔗 URL pública generada:', imageUrl);

      // Actualizar el estado inmediatamente con la nueva URL
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

    setSavingProperty(true);
    setError("");

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

      // Refrescar la lista de propiedades
      await fetchProperties();
      
      // Cerrar el diálogo
      setIsDialogOpen(false);

      // Mostrar notificación de éxito mejorada
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl shadow-2xl z-50 border border-green-400';
      successDiv.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div>
            <p class="font-bold text-lg">${isEditing ? '¡Propiedad actualizada!' : '¡Propiedad creada!'}</p>
            <p class="text-sm text-green-100">Todos los cambios se han guardado correctamente</p>
          </div>
        </div>
      `;
      document.body.appendChild(successDiv);
      
      // Animación de salida después de 4 segundos
      setTimeout(() => {
        if (document.body.contains(successDiv)) {
          successDiv.style.transition = 'all 0.5s ease-out';
          successDiv.style.transform = 'translateX(120%)';
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
        setError(`Error al guardar: ${err.message}`);
        
        // Mostrar notificación de error mejorada
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-xl shadow-2xl z-50 border border-red-400';
        errorDiv.innerHTML = `
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <div>
              <p class="font-bold text-lg">Error al guardar</p>
              <p class="text-sm text-red-100">${err.message}</p>
            </div>
          </div>
        `;
        document.body.appendChild(errorDiv);
        setTimeout(() => {
          if (document.body.contains(errorDiv)) {
            document.body.removeChild(errorDiv);
          }
        }, 6000);
    } finally {
      setSavingProperty(false);
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
              Añade y administra tus propiedades con información detallada y códigos de comunidad únicos.
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
      </
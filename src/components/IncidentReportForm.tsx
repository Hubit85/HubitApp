import { useState, useRef, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, X, Camera, FileImage, Loader2, Shield, AlertTriangle, 
  CheckCircle, MapPin, Clock, AlertCircle, Image as ImageIcon, Home
} from "lucide-react";
import PropertySelector from "./PropertySelector";
import type { Property } from "@/integrations/supabase/types";

// Service categories matching those in register.tsx
const SERVICE_CATEGORIES = [
  { id: 'integral', name: 'Servicio Integral', icon: '⭐' },
  { id: 'plumbing', name: 'Fontanería', icon: '🔧' },
  { id: 'electrical', name: 'Electricidad', icon: '⚡' },
  { id: 'cleaning', name: 'Limpieza', icon: '✨' },
  { id: 'gardening', name: 'Jardinería', icon: '🌳' },
  { id: 'painting', name: 'Pintura', icon: '🎨' },
  { id: 'hvac', name: 'Climatización', icon: '🌡️' },
  { id: 'carpentry', name: 'Carpintería', icon: '🔨' },
  { id: 'locksmith', name: 'Cerrajería', icon: '🔐' },
  { id: 'construction', name: 'Albañilería', icon: '🧱' },
  { id: 'roofing', name: 'Techado', icon: '🏠' },
  { id: 'moving', name: 'Mudanzas', icon: '🚛' },
  { id: 'security', name: 'Seguridad', icon: '🛡️' },
  { id: 'installation', name: 'Instalaciones', icon: '⚙️' },
  { id: 'maintenance', name: 'Reparaciones Generales', icon: '🔧' },
  { id: 'consulting', name: 'Consultoría Técnica', icon: '👥' },
];

const URGENCY_LEVELS = [
  { value: 'low' as const, label: 'Baja', color: 'bg-green-100 text-green-800', icon: '🟢' },
  { value: 'normal' as const, label: 'Normal', color: 'bg-blue-100 text-blue-800', icon: '🔵' },
  { value: 'high' as const, label: 'Alta', color: 'bg-orange-100 text-orange-800', icon: '🟠' },
  { value: 'emergency' as const, label: 'Emergencia', color: 'bg-red-100 text-red-800', icon: '🔴' },
];

interface IncidentFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  urgency: 'low' | 'normal' | 'high' | 'emergency';
  photos: File[];
  selectedProperty?: Property;
  selectedUnit?: any;
}

interface IncidentReportFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface PropertyAdministrator {
  id: string;
  user_id: string;
  company_name: string;
  contact_email: string;
}

export function IncidentReportForm({ onSuccess, onCancel }: IncidentReportFormProps) {
  const { user, profile, userRoles } = useSupabaseAuth();
  const [formData, setFormData] = useState<IncidentFormData>({
    title: "",
    description: "",
    category: "",
    location: "",
    urgency: "normal",
    photos: [],
    selectedProperty: undefined,
    selectedUnit: undefined
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [propertyAdministrators, setPropertyAdministrators] = useState<PropertyAdministrator[]>([]);
  const [assignedAdministrator, setAssignedAdministrator] = useState<PropertyAdministrator | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPropertySelector, setShowPropertySelector] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user is community member
  const isCommunityMember = userRoles.some(role => 
    role.role_type === 'community_member' && role.is_verified
  );

  useEffect(() => {
    if (user && isCommunityMember) {
      initializeComponent();
    } else {
      setLoading(false);
    }
  }, [user, isCommunityMember]);

  const initializeComponent = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Load assigned administrator for this community member
      await loadAssignedAdministrator();
      
      // Load available property administrators as fallback
      await findPropertyAdministrators();
      
    } catch (err) {
      console.error('Error initializing component:', err);
      setError("Error al inicializar el formulario de incidencias");
    } finally {
      setLoading(false);
    }
  };

  const loadAssignedAdministrator = async () => {
    if (!user?.id) return;

    try {
      // Look for approved administrator assignment
      const { data: assignment, error } = await supabase
        .from('community_member_administrators')
        .select('*')
        .eq('user_id', user.id)
        .eq('administrator_verified', true)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error loading assigned administrator:', error);
        return;
      }

      if (assignment) {
        // Find the full administrator details
        const { data: adminRole, error: adminError } = await supabase
          .from('user_roles')
          .select(`
            user_id,
            profiles!user_roles_user_id_fkey(full_name, email)
          `)
          .eq('role_type', 'property_administrator')
          .eq('is_verified', true);

        if (adminError) {
          console.warn('Error loading administrator details:', adminError);
          return;
        }

        // Find matching administrator by company details
        if (adminRole) {
          const matchingAdmin = adminRole.find(admin => 
            admin.profiles && 
            typeof admin.profiles === 'object' && 
            !Array.isArray(admin.profiles) &&
            (admin.profiles as any).email === assignment.contact_email
          );

          if (matchingAdmin) {
            setAssignedAdministrator({
              id: assignment.id,
              user_id: matchingAdmin.user_id,
              company_name: assignment.company_name,
              contact_email: assignment.contact_email
            });
          }
        }
      }
    } catch (err) {
      console.error('Error loading assigned administrator:', err);
    }
  };

  const findPropertyAdministrators = async () => {
    if (!user?.id) return;

    try {
      // Find property administrators for notifications
      const { data: admins, error } = await supabase
        .from('user_roles')
        .select(`
          id,
          user_id,
          profiles!user_roles_user_id_fkey(full_name, email)
        `)
        .eq('role_type', 'property_administrator')
        .eq('is_verified', true);

      if (error) {
        console.error('Error fetching property administrators:', error);
        return;
      }

      // FIXED: Better type handling for the admin list with comprehensive null checking
      const adminList: PropertyAdministrator[] = [];
      
      if (admins) {
        admins.forEach(admin => {
          // Safe access to profile data with proper null checking
          if (admin.profiles && typeof admin.profiles === 'object' && !Array.isArray(admin.profiles)) {
            const profile = admin.profiles as { full_name: string | null; email: string | null };
            
            // FIXED: Only add administrators with valid email addresses
            if (profile.email) {
              adminList.push({
                id: admin.id,
                user_id: admin.user_id,
                company_name: profile.full_name || 'Administrador de Fincas',
                contact_email: profile.email // Now guaranteed to be non-null
              });
            }
          }
        });
      }

      setPropertyAdministrators(adminList);
      
    } catch (err) {
      console.error('Error setting up property administrators:', err);
    }
  };

  const handleInputChange = (field: keyof IncidentFormData, value: string) => {
    if (field === 'urgency') {
      setFormData(prev => ({ ...prev, [field]: value as 'low' | 'normal' | 'high' | 'emergency' }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    setError("");
  };

  const handlePropertySelection = (property: any, unit?: any) => {
    setFormData(prev => ({
      ...prev,
      selectedProperty: property,
      selectedUnit: unit
    }));
    setShowPropertySelector(false);
    setError("");
  };

  const handlePhotoUpload = (files: FileList | null) => {
    if (!files) return;

    const newPhotos: File[] = [];
    const maxFileSize = 5 * 1024 * 1024; // 5MB per file
    const maxFiles = 5; // Maximum 5 photos
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        if (file.size <= maxFileSize) {
          if (formData.photos.length + newPhotos.length < maxFiles) {
            newPhotos.push(file);
          }
        } else {
          setError(`La imagen "${file.name}" es demasiado grande. Máximo 5MB por archivo.`);
        }
      } else {
        setError(`"${file.name}" no es una imagen válida.`);
      }
    });

    if (newPhotos.length > 0) {
      setFormData(prev => ({ 
        ...prev, 
        photos: [...prev.photos, ...newPhotos].slice(0, maxFiles)
      }));
      setError("");
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoUpload(e.dataTransfer.files);
    }
  };

  const uploadPhotosToStorage = async (photos: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const photo of photos) {
      try {
        const fileExt = photo.name.split('.').pop();
        const fileName = `incident_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        // Use a simpler path structure to avoid RLS issues
        const filePath = `public/${fileName}`;

        // Try uploading to a public bucket or create base64 encoded version as fallback
        try {
          const { data, error } = await supabase.storage
            .from('incident-photos')
            .upload(filePath, photo, {
              cacheControl: '3600',
              upsert: false
            });

          if (error) {
            throw error;
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('incident-photos')
            .getPublicUrl(filePath);

          uploadedUrls.push(publicUrl);
        } catch (storageError) {
          console.warn('Storage upload failed, using base64 fallback:', storageError);
          
          // Fallback: convert to base64 and store as data URL
          const base64 = await convertToBase64(photo);
          uploadedUrls.push(base64);
        }

      } catch (uploadError) {
        console.error('Failed to process photo:', uploadError);
        // Continue with other photos even if one fails
      }
    }

    return uploadedUrls;
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !isCommunityMember) {
      setError("Solo los miembros de comunidad pueden reportar incidencias.");
      return;
    }

    if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }

    if (!formData.selectedProperty) {
      setError("Por favor, selecciona la propiedad donde se encuentra la incidencia.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      // Upload photos if any
      let photoUrls: string[] = [];
      if (formData.photos.length > 0) {
        setSuccessMessage("Subiendo fotografías...");
        photoUrls = await uploadPhotosToStorage(formData.photos);
      }

      // Determine administrator ID
      let primaryAdministratorId: string;
      
      if (assignedAdministrator) {
        // Use assigned administrator
        primaryAdministratorId = assignedAdministrator.user_id;
      } else if (propertyAdministrators.length > 0) {
        // Use first available property administrator
        primaryAdministratorId = propertyAdministrators[0].user_id;
      } else {
        // FALLBACK: Use the reporter's ID as temporary administrator
        primaryAdministratorId = user.id;
        console.warn('No property administrators found, using reporter as temporary administrator');
      }

      // Build location details including property info
      const locationDetails = formData.selectedProperty 
        ? `${formData.selectedProperty.name || formData.selectedProperty.address} - ${formData.location.trim() || 'Ubicación específica no especificada'}`
        : formData.location.trim() || 'Áreas comunes de la comunidad';

      // Create incident record with proper UUID
      const incidentData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        urgency: formData.urgency,
        status: 'pending' as const,
        work_location: locationDetails,
        special_requirements: formData.selectedUnit ? `Unidad: ${formData.selectedUnit.unitNumber}` : null,
        images: photoUrls.length > 0 ? photoUrls : null,
        documents: null,
        reporter_id: user.id,
        community_id: 'general_community',
        administrator_id: primaryAdministratorId,
        admin_notes: null,
        reviewed_at: null,
        reviewed_by: null
      };

      console.log('Creating incident with data:', {
        title: incidentData.title,
        reporter_id: incidentData.reporter_id,
        administrator_id: incidentData.administrator_id,
        category: incidentData.category,
        urgency: incidentData.urgency,
        work_location: incidentData.work_location
      });

      const { data: incident, error: incidentError } = await supabase
        .from('incidents')
        .insert(incidentData)
        .select()
        .single();

      if (incidentError) {
        console.error('Error creating incident:', incidentError);
        
        // Provide specific error handling
        if (incidentError.code === '23503') {
          setError("Error de configuración del sistema. No se encontró un administrador válido asignado.");
          return;
        } else if (incidentError.code === '22P02') {
          setError("Error de datos inválidos. Por favor, contacta con soporte técnico.");
          return;
        } else {
          throw incidentError;
        }
      }

      console.log('Incident created successfully:', incident.id);

      // Send notifications to the assigned administrator
      const targetAdministrator = assignedAdministrator || (propertyAdministrators.length > 0 ? propertyAdministrators[0] : null);
      
      if (targetAdministrator) {
        try {
          const urgencyLevel = URGENCY_LEVELS.find(u => u.value === formData.urgency);
          
          const notification = {
            user_id: targetAdministrator.user_id,
            title: `Nueva incidencia reportada - ${urgencyLevel?.label || 'Normal'}`,
            message: `${profile?.full_name || 'Un miembro de comunidad'} ha reportado una incidencia: "${formData.title}". Propiedad: ${formData.selectedProperty?.name || 'No especificada'}. Categoría: ${SERVICE_CATEGORIES.find(c => c.id === formData.category)?.name}`,
            type: (formData.urgency === 'emergency' ? 'error' : 'info') as 'error' | 'info',
            category: 'incident' as const,
            related_entity_type: 'incident',
            related_entity_id: incident.id,
            action_url: `/dashboard?tab=incidencias&incident=${incident.id}`,
            action_label: 'Ver Incidencia',
            read: false
          };

          const { error: notifError } = await supabase.from('notifications').insert([notification]);
          
          if (notifError) {
            console.warn('Failed to send notification:', notifError);
          } else {
            console.log(`Notification sent to administrator: ${targetAdministrator.company_name}`);
          }
        } catch (notifError) {
          console.warn('Failed to create notification:', notifError);
        }
      }

      // Success message
      setSuccessMessage(
        targetAdministrator
          ? `¡Incidencia reportada exitosamente! ${targetAdministrator.company_name} ha sido notificado y revisará tu solicitud.`
          : "¡Incidencia reportada exitosamente! Se ha creado el reporte y será asignado a un administrador cuando esté disponible."
      );
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        location: "",
        urgency: "normal",
        photos: [],
        selectedProperty: undefined,
        selectedUnit: undefined
      });

      // Call success callback
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }

    } catch (err) {
      console.error('Error submitting incident:', err);
      
      // Provide more specific error messages
      let errorMessage = "Error al reportar la incidencia. Por favor, inténtalo de nuevo.";
      
      if (err instanceof Error) {
        if (err.message.includes('administrator_id')) {
          errorMessage = "Error de configuración del sistema. No se encontró un administrador válido.";
        } else if (err.message.includes('uuid')) {
          errorMessage = "Error de datos inválidos. Por favor, contacta con soporte técnico.";
        } else if (err.message.includes('23503')) {
          errorMessage = "Error de configuración de la base de datos. Contacta con soporte.";
        } else if (err.message.includes('RLS') || err.message.includes('policy')) {
          errorMessage = "Error de permisos del sistema. La incidencia fue reportada pero las fotos no se pudieron guardar.";
        } else if (err.message.includes('community_id')) {
          errorMessage = "Error de comunidad no válida. Contacta con tu administrador de fincas.";
        } else {
          errorMessage = `Error: ${err.message}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-stone-200 shadow-xl">
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-stone-600 mx-auto mb-4" />
          <p className="text-stone-600">Configurando sistema de incidencias...</p>
        </CardContent>
      </Card>
    );
  }

  if (!isCommunityMember) {
    return (
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-amber-600" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-2">Acceso Restringido</h3>
          <p className="text-amber-700 mb-4">
            Esta funcionalidad está disponible exclusivamente para miembros de comunidad verificados.
          </p>
          <Badge className="bg-amber-100 text-amber-800">
            Se requiere rol de "Miembro de Comunidad"
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-stone-200 shadow-xl bg-gradient-to-br from-white to-neutral-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-red-100 to-orange-100 rounded-xl">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">Reportar Incidencia</CardTitle>
              <CardDescription className="mt-1">
                Informa al administrador de fincas sobre problemas en Mi Comunidad
                {assignedAdministrator ? (
                  <span className="text-green-600 font-medium ml-2">
                    (Administrador: {assignedAdministrator.company_name})
                  </span>
                ) : propertyAdministrators.length > 0 ? (
                  <span className="text-blue-600 font-medium ml-2">
                    ({propertyAdministrators.length} administrador{propertyAdministrators.length !== 1 ? 'es' : ''} disponible{propertyAdministrators.length !== 1 ? 's' : ''})
                  </span>
                ) : (
                  <span className="text-orange-600 font-medium ml-2">
                    (Asigna un administrador en Mi Perfil)
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {(error || successMessage) && (
            <Alert className={`border-2 ${error ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}>
              <div className="flex items-center gap-2">
                {error ? <AlertCircle className="h-4 w-4 text-red-600" /> : <CheckCircle className="h-4 w-4 text-green-600" />}
                <AlertDescription className={`font-medium ${error ? "text-red-800" : "text-green-800"}`}>
                  {error || successMessage}
                </AlertDescription>
              </div>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Property Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-stone-700">
                Propiedad donde ocurre la incidencia *
              </Label>
              {formData.selectedProperty ? (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Home className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">
                        {formData.selectedProperty.name}
                      </p>
                      <p className="text-sm text-blue-700">
                        {formData.selectedProperty.address}, {formData.selectedProperty.city}
                      </p>
                      {formData.selectedUnit && (
                        <p className="text-xs text-blue-600">
                          Unidad: {formData.selectedUnit.unitNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPropertySelector(true)}
                    className="bg-white hover:bg-blue-50"
                  >
                    Cambiar
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPropertySelector(true)}
                  className="w-full h-12 border-dashed border-stone-300 hover:border-blue-400 bg-stone-50 hover:bg-blue-50 text-stone-600"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Seleccionar Propiedad
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-stone-700">
                  Título de la incidencia *
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Ej: Fuga de agua en el garaje"
                  className="h-12 bg-white border-stone-200 focus:border-red-500 focus:ring-red-500/20"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium text-stone-700">
                  Categoría del servicio *
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="h-12 bg-white border-stone-200 focus:border-red-500">
                    <SelectValue placeholder="Selecciona la categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium text-stone-700">
                  Ubicación específica dentro de la propiedad
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <Input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Ej: Portal A, Ascensor 2, Jardín trasero, Apartamento 3B"
                    className="pl-10 h-12 bg-white border-stone-200 focus:border-red-500 focus:ring-red-500/20"
                  />
                </div>
              </div>

              {/* Urgency */}
              <div className="space-y-2">
                <Label htmlFor="urgency" className="text-sm font-medium text-stone-700">
                  Nivel de urgencia *
                </Label>
                <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                  <SelectTrigger className="h-12 bg-white border-stone-200 focus:border-red-500">
                    <SelectValue placeholder="Selecciona la urgencia" />
                  </SelectTrigger>
                  <SelectContent>
                    {URGENCY_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex items-center gap-2">
                          <span>{level.icon}</span>
                          <span>{level.label}</span>
                          {level.value === 'emergency' && (
                            <Badge className="bg-red-100 text-red-800 text-xs ml-2">
                              Atención inmediata
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-stone-700">
                Descripción detallada *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe la incidencia con el mayor detalle posible: qué ha ocurrido, cuándo lo notaste, si afecta a otros residentes, etc."
                className="min-h-[120px] bg-white border-stone-200 focus:border-red-500 focus:ring-red-500/20 resize-none"
                required
              />
              <p className="text-xs text-stone-500">
                Mínimo 20 caracteres. Incluye todos los detalles relevantes para facilitar la resolución.
              </p>
            </div>

            {/* Photo Upload */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-stone-700">
                Fotografías (opcional)
              </Label>
              <p className="text-sm text-stone-600">
                Añade hasta 5 fotografías para proporcionar más información visual sobre la incidencia.
              </p>

              {/* Drop Zone */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                  dragActive
                    ? 'border-red-400 bg-red-50'
                    : 'border-stone-300 hover:border-red-400 bg-stone-50 hover:bg-red-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-6 w-6 text-stone-500" />
                  </div>
                  <p className="text-sm font-medium text-stone-700 mb-1">
                    Arrastra las imágenes aquí o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-stone-500">
                    PNG, JPG, GIF hasta 5MB cada una. Máximo 5 imágenes.
                  </p>
                </div>
              </div>

              {/* Photo Preview */}
              {formData.photos.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-stone-700">
                    Fotografías seleccionadas ({formData.photos.length}/5)
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
                          <div className="w-full h-full flex items-center justify-center">
                            <FileImage className="h-8 w-8 text-stone-400" />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <p className="text-xs text-stone-600 mt-1 truncate">
                          {photo.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-stone-200">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={submitting}
                  className="flex-1 border-stone-200 hover:bg-stone-50"
                >
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                disabled={submitting || !formData.title.trim() || !formData.description.trim() || !formData.category || !formData.selectedProperty}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Reportando incidencia...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Reportar Incidencia
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">
                  ¿Qué sucede después de reportar?
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• {assignedAdministrator ? assignedAdministrator.company_name : 'Los administradores de fincas'} recibirán una notificación inmediata</li>
                  <li>• Se evaluará la incidencia y su prioridad</li>
                  <li>• Si requiere servicios externos, se solicitarán presupuestos</li>
                  <li>• Recibirás actualizaciones sobre el estado de resolución</li>
                  <li>• Las incidencias de emergencia tienen atención prioritaria</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Selector Modal */}
      {showPropertySelector && (
        <PropertySelector
          onPropertySelected={handlePropertySelection}
          onCancel={() => setShowPropertySelector(false)}
          userType="community_member"
          mode="incident"
          title="Selecciona la Propiedad para la Incidencia"
          allowNoUnitSelection={true}
        />
      )}
    </>
  );
}
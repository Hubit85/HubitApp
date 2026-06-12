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
  X, Camera, Loader2, Shield, 
  CheckCircle, MapPin, Clock, AlertCircle, Home, FileImage
} from "lucide-react";
import PropertySelector from "@/components/PropertySelector";
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
  community_id?: string | null;
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
      const communityMemberRole = userRoles.find(role =>
        role.role_type === 'community_member' && role.is_verified
      );

      if (!communityMemberRole?.id) {
        console.warn('No verified community member role found for incident routing');
        return;
      }

      const { data: assignment, error } = await supabase
        .from('managed_communities')
        .select('id, community_id, property_administrator_id')
        .eq('community_member_id', communityMemberRole.id)
        .eq('relationship_status', 'active')
        .order('established_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error loading assigned administrator:', error);
        return;
      }

      if (assignment) {
        const { data: adminRole, error: adminError } = await supabase
          .from('user_roles')
          .select(`
            id,
            user_id,
            role_specific_data,
            profiles!user_roles_user_id_fkey(full_name, email)
          `)
          .eq('id', assignment.property_administrator_id)
          .eq('role_type', 'property_administrator')
          .eq('is_verified', true)
          .maybeSingle();

        if (adminError) {
          console.warn('Error loading administrator details:', adminError);
          return;
        }

        if (adminRole) {
          const profileData = adminRole.profiles as any;
          const roleData = adminRole.role_specific_data as any || {};

          setAssignedAdministrator({
            id: adminRole.id,
            user_id: adminRole.user_id,
            company_name: roleData.company_name || profileData?.full_name || 'Administrador de Fincas',
            contact_email: roleData.business_email || profileData?.email || '',
            community_id: assignment.community_id
          });
        }
      }
    } catch (err) {
      console.error('Error loading assigned administrator:', err);
    }
  };

  const findPropertyAdministrators = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      console.log("🔍 [INCIDENT-ADMIN-SEARCH] Searching for ALL available property administrators...");

      // FIXED: Query property administrators directly from user_roles table
      // This is the EXACT query that works in CommunityAdministratorAssignment.tsx
      const baseQuery = supabase
        .from("user_roles")
        .select(`
          id,
          user_id,
          role_specific_data,
          is_verified,
          is_active,
          created_at,
          profiles!user_roles_user_id_fkey (
            id,
            full_name,
            email,
            phone,
            city,
            address
          )
        `)
        .eq("role_type", "property_administrator")
        .eq("is_verified", true)
        .order("created_at", { ascending: false });

      const { data: propertyAdministrators, error: adminError } = await baseQuery;
      
      if (adminError) {
        console.error("❌ [INCIDENT-ADMIN-SEARCH] Error fetching property administrators:", adminError);
        setError(`Error al cargar administradores: ${adminError.message}`);
        return;
      }

      console.log(`📊 [INCIDENT-ADMIN-SEARCH] Found ${propertyAdministrators?.length || 0} verified property administrators`);

      if (!propertyAdministrators || propertyAdministrators.length === 0) {
        console.log("⚠️ [INCIDENT-ADMIN-SEARCH] No verified property administrators found");
        setError("No se encontraron administradores de fincas verificados en la plataforma. Por favor, contacta con soporte.");
        setPropertyAdministrators([]);
        return;
      }

      // Transform user_roles data to PropertyAdministrator format
      const transformedAdmins: PropertyAdministrator[] = propertyAdministrators
        .filter(admin => admin.profiles) // Only include admins with profile data
        .map((admin, index) => {
          const profileData = admin.profiles as any;
          const roleData = admin.role_specific_data as any || {};
          
          console.log(`👤 [INCIDENT-ADMIN-SEARCH] Processing admin ${index + 1}:`, {
            user_id: admin.user_id.substring(0, 8) + '...',
            full_name: profileData?.full_name,
            email: profileData?.email,
            company_name: roleData?.company_name || profileData?.full_name,
            is_verified: admin.is_verified
          });

          // Extract company info from role_specific_data
          const companyName = roleData?.company_name || profileData?.full_name || 'Administrador de Fincas';
          const contactEmail = roleData?.business_email || profileData?.email;

          return {
            id: admin.id,
            user_id: admin.user_id,
            company_name: companyName,
            contact_email: contactEmail || ''
          };
        })
        .filter(admin => admin.contact_email); // Only keep admins with valid email

      // Sort by company name for better UX
      transformedAdmins.sort((a, b) => {
        const nameA = a.company_name?.toLowerCase() || '';
        const nameB = b.company_name?.toLowerCase() || '';
        return nameA.localeCompare(nameB);
      });

      console.log(`✅ [INCIDENT-ADMIN-SEARCH] Final results: ${transformedAdmins.length} property administrators ready for display`);
      
      // Log summary for debugging
      const summary = transformedAdmins.map(admin => ({
        company: admin.company_name,
        email: admin.contact_email,
        user_id: admin.user_id.substring(0, 8) + '...'
      }));
      
      console.table(summary);

      setPropertyAdministrators(transformedAdmins);
      
      // Show user-friendly message if no administrators found after filtering
      if (transformedAdmins.length === 0) {
        setError("No se encontraron administradores de fincas con información de contacto válida. Por favor, asegúrate de tener un administrador asignado en tu perfil o contacta con soporte.");
      }
      
    } catch (err) {
      console.error('❌ [INCIDENT-ADMIN-SEARCH] Critical error fetching property administrators:', err);
      setError(`Error crítico al cargar los administradores de fincas: ${err instanceof Error ? err.message : 'Error desconocido'}. Por favor, inténtalo de nuevo más tarde.`);
      setPropertyAdministrators([]);
    } finally {
      setLoading(false);
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
          const { error } = await supabase.storage
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

  const resolveIncidentCommunityId = async (administratorId: string): Promise<string> => {
    if (assignedAdministrator?.community_id) {
      return assignedAdministrator.community_id;
    }

    if (!formData.selectedProperty) {
      throw new Error('No selected property available for incident community');
    }

    const { data: existingCommunity, error: lookupError } = await supabase
      .from('communities')
      .select('id')
      .eq('administrator_id', administratorId)
      .eq('address', formData.selectedProperty.address)
      .maybeSingle();

    if (lookupError && lookupError.code !== 'PGRST116') {
      throw lookupError;
    }

    if (existingCommunity?.id) {
      return existingCommunity.id;
    }

    const { data: createdCommunity, error: createError } = await supabase
      .from('communities')
      .insert({
        administrator_id: administratorId,
        name: formData.selectedProperty.name || `Comunidad ${formData.selectedProperty.address}`,
        address: formData.selectedProperty.address,
        city: formData.selectedProperty.city,
        postal_code: formData.selectedProperty.postal_code || null,
        status: 'active',
        description: formData.selectedProperty.description || null,
      })
      .select('id')
      .single();

    if (createError || !createdCommunity?.id) {
      throw createError || new Error('Could not resolve incident community');
    }

    return createdCommunity.id;
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
      if (!assignedAdministrator) {
        setError("No tienes un administrador de fincas asignado para gestionar incidencias. Solicita la asignación antes de reportar una incidencia.");
        return;
      }

      const primaryAdministratorId = assignedAdministrator.user_id;
      const communityId = await resolveIncidentCommunityId(primaryAdministratorId);

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
        images: null,
        documents: null,
        reporter_id: user.id,
        community_id: communityId,
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
        work_location: incidentData.work_location,
        community_id: incidentData.community_id
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

      if (incident) {
        console.log('Incident created successfully:', incident.id);

        let photoUrls: string[] = [];
        if (formData.photos.length > 0) {
          setSuccessMessage("Subiendo fotografías...");
          photoUrls = await uploadPhotosToStorage(formData.photos);

          if (photoUrls.length > 0) {
            const { error: imageUpdateError } = await supabase
              .from('incidents')
              .update({ images: photoUrls })
              .eq('id', incident.id);

            if (imageUpdateError) {
              console.warn('Failed to attach incident photos:', imageUpdateError);
            }
          }
        }

        // Send notifications to the assigned administrator
        const targetAdministrator = assignedAdministrator;
        
        if (targetAdministrator) {
          try {
            const urgencyLevel = URGENCY_LEVELS.find(u => u.value === formData.urgency);
            
            // FIXED: Safe handling of profile data with null check
            const reporterName = profile?.full_name || user?.email?.split('@')[0] || 'Un miembro de comunidad';
            
            const notification = {
              user_id: targetAdministrator.user_id,
              title: `Nueva incidencia reportada - ${urgencyLevel?.label || 'Normal'}`,
              message: `${reporterName} ha reportado una incidencia: "${formData.title}". Propiedad: ${formData.selectedProperty?.name || 'No especificada'}. Categoría: ${SERVICE_CATEGORIES.find(c => c.id === formData.category)?.name}`,
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
      } else {
         setError("No se pudo crear la incidencia. El resultado fue nulo.");
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
            Se requiere rol de &quot;Miembro de Comunidad&quot;
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
          mode="incident"
          title="Selecciona la Propiedad para la Incidencia"
          allowNoUnitSelection={true}
        />
      )}
    </>
  );
}

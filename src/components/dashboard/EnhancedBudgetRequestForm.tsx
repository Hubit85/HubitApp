
import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { 
  Send, Eye, Star, Building, MapPin, Clock, Euro, AlertTriangle, 
  CheckCircle, Loader2, Calendar, Image as ImageIcon, FileText,
  Users, Zap, Info, Target, ArrowRight
} from "lucide-react";
import { BudgetRequestInsert, Property } from "@/integrations/supabase/types";
import { SupabaseBudgetService } from "@/services/SupabaseBudgetService";
import { supabase } from "@/integrations/supabase/client";

interface ServiceCategoryOption {
  value: string;
  label: string;
  icon: string;
  description: string;
}

interface EligibleProviderPreview {
  company_name: string;
  rating_average: number;
  total_jobs_completed: number;
}

interface ProviderPreviewResults {
  count: number;
  preview: EligibleProviderPreview[];
}

const SERVICE_CATEGORIES: ServiceCategoryOption[] = [
  { value: "cleaning", label: "Limpieza", icon: "🧽", description: "Servicios de limpieza general y especializada" },
  { value: "plumbing", label: "Fontanería", icon: "🔧", description: "Reparaciones e instalaciones de fontanería" },
  { value: "electrical", label: "Electricidad", icon: "⚡", description: "Instalaciones y reparaciones eléctricas" },
  { value: "gardening", label: "Jardinería", icon: "🌱", description: "Mantenimiento de jardines y paisajismo" },
  { value: "painting", label: "Pintura", icon: "🎨", description: "Pintura interior y exterior" },
  { value: "maintenance", label: "Mantenimiento", icon: "🛠️", description: "Mantenimiento general y reparaciones" },
  { value: "security", label: "Seguridad", icon: "🛡️", description: "Sistemas de seguridad y vigilancia" },
  { value: "hvac", label: "Climatización", icon: "🌡️", description: "Calefacción, ventilación y aire acondicionado" },
  { value: "carpentry", label: "Carpintería", icon: "🪵", description: "Trabajos en madera y carpintería" },
  { value: "emergency", label: "Emergencia", icon: "🚨", description: "Servicios de emergencia 24/7" },
  { value: "other", label: "Otros", icon: "📋", description: "Otros servicios no listados" }
];

const URGENCY_OPTIONS = [
  { value: "low", label: "Baja Prioridad", icon: "🕐", description: "No hay prisa, cuando sea posible" },
  { value: "normal", label: "Normal", icon: "📅", description: "Plazo estándar de ejecución" },
  { value: "high", label: "Alta Prioridad", icon: "🔥", description: "Necesito que sea pronto" },
  { value: "emergency", label: "Emergencia", icon: "🚨", description: "Situación urgente, necesito ayuda inmediata" }
];

export function EnhancedBudgetRequestForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user, activeRole } = useSupabaseAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // Preview states
  const [showPreview, setShowPreview] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [providerPreview, setProviderPreview] = useState<ProviderPreviewResults | null>(null);

  const [formData, setFormData] = useState<BudgetRequestInsert>({
    user_id: user?.id || "",
    title: "",
    description: "",
    category: "other",
    urgency: "normal",
    property_id: null,
    budget_range_min: null,
    budget_range_max: null,
    preferred_date: null,
    deadline_date: null,
    work_location: "",
    special_requirements: "",
    images: [],
    documents: []
  });

  const [autoPublish, setAutoPublish] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (user && (activeRole?.role_type === 'particular' || activeRole?.role_type === 'property_administrator')) {
      loadUserProperties();
    }
  }, [user, activeRole]);

  const loadUserProperties = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.id)
        .eq('property_status', 'active')
        .order('name');

      if (error) {
        console.error("Error loading properties:", error);
        throw error;
      }

      setProperties(data || []);
      
      // Auto-select the first property if available
      if (data && data.length > 0 && !formData.property_id) {
        setFormData(prev => ({ ...prev, property_id: data[0].id }));
      }

    } catch (err) {
      console.error("Error loading properties:", err);
      setError("Error al cargar las propiedades");
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewProviders = async () => {
    if (!formData.category || !formData.title || !formData.description) {
      setError("Por favor completa título, descripción y categoría para ver la vista previa de proveedores");
      return;
    }

    try {
      setPreviewLoading(true);
      setError("");

      // Create a temporary budget request for preview
      const tempRequest: any = {
        id: 'temp-preview',
        ...formData,
        status: 'published'
      };

      const preview = await SupabaseBudgetService.findEligibleProvidersPreview(tempRequest);
      setProviderPreview(preview);
      setShowPreview(true);

    } catch (err) {
      console.error("Error previewing providers:", err);
      setError("Error al obtener vista previa de proveedores");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user?.id || !formData.title || !formData.description) {
      setError("Por favor completa todos los campos obligatorios");
      return;
    }

    if (autoPublish) {
      setShowConfirmDialog(true);
      return;
    }

    await createBudgetRequest(false);
  };

  const createBudgetRequest = async (shouldAutoPublish: boolean) => {
    try {
      setSubmitting(true);
      setError("");

      const requestData: BudgetRequestInsert = {
        ...formData,
        user_id: user!.id,
        // Convert empty strings to null for optional fields
        budget_range_min: formData.budget_range_min || null,
        budget_range_max: formData.budget_range_max || null,
        preferred_date: formData.preferred_date || null,
        deadline_date: formData.deadline_date || null,
        work_location: formData.work_location || null,
        special_requirements: formData.special_requirements || null
      };

      console.log("🚀 Creating budget request with auto-publish:", shouldAutoPublish);

      const result = await SupabaseBudgetService.createAndPublishBudgetRequest(requestData, shouldAutoPublish);

      if (shouldAutoPublish && result.notificationResults) {
        setSuccessMessage(`¡Solicitud creada y publicada exitosamente! Se ha notificado a ${result.notificationResults.notificationsSent} proveedores.`);
      } else {
        setSuccessMessage("¡Solicitud de presupuesto creada exitosamente! Puedes publicarla cuando estés listo.");
      }

      // Reset form
      setFormData({
        user_id: user!.id,
        title: "",
        description: "",
        category: "other",
        urgency: "normal",
        property_id: properties.length > 0 ? properties[0].id : null,
        budget_range_min: null,
        budget_range_max: null,
        preferred_date: null,
        deadline_date: null,
        work_location: "",
        special_requirements: "",
        images: [],
        documents: []
      });

      setShowConfirmDialog(false);
      setProviderPreview(null);

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);

    } catch (err) {
      console.error("Error creating budget request:", err);
      setError(err instanceof Error ? err.message : "Error al crear la solicitud");
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryOption = (value: string) => {
    return SERVICE_CATEGORIES.find(cat => cat.value === value) || SERVICE_CATEGORIES[SERVICE_CATEGORIES.length - 1];
  };

  const getUrgencyOption = (value: string) => {
    return URGENCY_OPTIONS.find(opt => opt.value === value) || URGENCY_OPTIONS[1];
  };

  if (!activeRole || (activeRole.role_type !== 'particular' && activeRole.role_type !== 'property_administrator')) {
    return (
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/60">
        <CardContent className="text-center p-8">
          <Users className="h-12 w-12 mx-auto mb-4 text-amber-600" />
          <h3 className="text-lg font-semibold text-amber-900 mb-2">Acceso Restringido</h3>
          <p className="text-sm text-amber-700">
            Esta funcionalidad está disponible solo para particulares y administradores de fincas.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-white to-blue-50/30 border-blue-200/60 shadow-xl shadow-blue-900/10">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Send className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">Solicitar Presupuesto</CardTitle>
              <CardDescription className="text-blue-100">
                Describe tu proyecto y obtén cotizaciones de proveedores profesionales
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Status Messages */}
          {(error || successMessage) && (
            <Alert className={`border-2 ${
              error 
                ? "border-red-200 bg-red-50" 
                : "border-green-200 bg-green-50"
            }`}>
              <AlertDescription className={`font-medium ${
                error ? "text-red-800" : "text-green-800"
              }`}>
                {error || successMessage}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-neutral-900">Información Básica</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Título del Proyecto *</Label>
                  <Input
                    id="title"
                    placeholder="ej: Reparación de tubería en cocina"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    maxLength={100}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoría de Servicio *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as BudgetRequest['category'] }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_CATEGORIES.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{category.icon}</span>
                            <div>
                              <div className="font-medium">{category.label}</div>
                              <div className="text-xs text-neutral-600">{category.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="urgency">Nivel de Urgencia</Label>
                  <Select value={formData.urgency} onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value as BudgetRequest['urgency'] }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {URGENCY_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{option.icon}</span>
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-xs text-neutral-600">{option.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Descripción Detallada *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe detalladamente qué necesitas que se haga..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    maxLength={1000}
                  />
                  <div className="text-xs text-neutral-500 mt-1">
                    {formData.description.length}/1000 caracteres
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Location */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-neutral-900">Ubicación</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {properties.length > 0 ? (
                  <div>
                    <Label htmlFor="property_id">Propiedad</Label>
                    <Select value={formData.property_id || ""} onValueChange={(value) => setFormData(prev => ({ ...prev, property_id: value || null }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una propiedad" />
                      </SelectTrigger>
                      <SelectContent>
                        {properties.map(property => (
                          <SelectItem key={property.id} value={property.id}>
                            <div>
                              <div className="font-medium">{property.name}</div>
                              <div className="text-xs text-neutral-600">{property.address}, {property.city}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="md:col-span-2">
                    <Label htmlFor="work_location">Ubicación del Trabajo</Label>
                    <Input
                      id="work_location"
                      placeholder="Dirección donde se realizará el trabajo"
                      value={formData.work_location || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, work_location: e.target.value }))}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="special_requirements">Requisitos Especiales</Label>
                  <Input
                    id="special_requirements"
                    placeholder="ej: Acceso por escalera, horario específico"
                    value={formData.special_requirements || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, special_requirements: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Budget and Timeline */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Euro className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-neutral-900">Presupuesto y Fechas</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="budget_min">Presupuesto Mínimo (€)</Label>
                  <Input
                    id="budget_min"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    value={formData.budget_range_min || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget_range_min: parseFloat(e.target.value) || null }))}
                  />
                </div>

                <div>
                  <Label htmlFor="budget_max">Presupuesto Máximo (€)</Label>
                  <Input
                    id="budget_max"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    value={formData.budget_range_max || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget_range_max: parseFloat(e.target.value) || null }))}
                  />
                </div>

                <div>
                  <Label htmlFor="preferred_date">Fecha Preferida</Label>
                  <Input
                    id="preferred_date"
                    type="date"
                    value={formData.preferred_date || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferred_date: e.target.value || null }))}
                  />
                </div>

                <div>
                  <Label htmlFor="deadline_date">Fecha Límite</Label>
                  <Input
                    id="deadline_date"
                    type="date"
                    value={formData.deadline_date || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline_date: e.target.value || null }))}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Provider Preview Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-neutral-900">Vista Previa de Proveedores</h3>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviewProviders}
                  disabled={previewLoading || !formData.title || !formData.category}
                >
                  {previewLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Cargando...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Proveedores
                    </>
                  )}
                </Button>
              </div>

              {providerPreview && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 mb-2">
                        {providerPreview.count} proveedores elegibles encontrados
                      </h4>
                      
                      {providerPreview.preview.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm text-blue-700 mb-3">
                            Estos son algunos de los proveedores mejor calificados que podrían cotizar tu proyecto:
                          </p>
                          
                          <div className="space-y-2">
                            {providerPreview.preview.map((provider, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-white rounded border border-blue-200">
                                <div className="flex items-center gap-3">
                                  <Building className="h-4 w-4 text-blue-600" />
                                  <div>
                                    <div className="font-medium text-sm">{provider.company_name}</div>
                                    <div className="flex items-center gap-2 text-xs text-neutral-600">
                                      <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                        <span>{provider.rating_average.toFixed(1)}</span>
                                      </div>
                                      <Separator orientation="vertical" className="h-3" />
                                      <span>{provider.total_jobs_completed} trabajos</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {providerPreview.count > providerPreview.preview.length && (
                            <p className="text-xs text-blue-600 mt-2">
                              Y {providerPreview.count - providerPreview.preview.length} proveedores más...
                            </p>
                          )}
                        </div>
                      )}
                      
                      {providerPreview.count === 0 && (
                        <p className="text-sm text-blue-700">
                          No se encontraron proveedores específicos para esta categoría, pero tu solicitud será visible para todos los proveedores activos.
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </div>

            <Separator />

            {/* Publication Options */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-neutral-900">Opciones de Publicación</h3>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-600 rounded-lg">
                    <Send className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900">Publicar y Notificar Automáticamente</h4>
                    <p className="text-sm text-green-700">
                      Tu solicitud será publicada inmediatamente y los proveedores elegibles recibirán una notificación
                    </p>
                  </div>
                </div>
                <Switch
                  checked={autoPublish}
                  onCheckedChange={setAutoPublish}
                />
              </div>

              {!autoPublish && (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    Si no seleccionas la publicación automática, tu solicitud se guardará como borrador. Tendrás que publicarla manualmente para que los proveedores puedan verla.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <Button
                type="submit"
                disabled={submitting || !formData.title || !formData.description}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {autoPublish ? "Publicando..." : "Guardando..."}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {autoPublish ? "Publicar Solicitud" : "Guardar Borrador"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-600" />
              Confirmar Publicación de Solicitud
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres publicar esta solicitud de presupuesto?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Request Summary */}
            <Card className="p-4 bg-neutral-50">
              <h4 className="font-medium mb-3">Resumen de tu solicitud:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-medium text-neutral-700 min-w-[100px]">Título:</span>
                  <span>{formData.title}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium text-neutral-700 min-w-[100px]">Categoría:</span>
                  <span>{getCategoryOption(formData.category!).icon} {getCategoryOption(formData.category!).label}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium text-neutral-700 min-w-[100px]">Urgencia:</span>
                  <span>{getUrgencyOption(formData.urgency!).icon} {getUrgencyOption(formData.urgency!).label}</span>
                </div>
                {(formData.budget_range_min || formData.budget_range_max) && (
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-neutral-700 min-w-[100px]">Presupuesto:</span>
                    <span>
                      €{formData.budget_range_min || 0} - €{formData.budget_range_max || 0}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Expected Actions */}
            {providerPreview && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Se notificará a <strong>{providerPreview.count} proveedores elegibles</strong> sobre tu solicitud.
                  Podrán revisar los detalles y enviarte cotizaciones.
                </AlertDescription>
              </Alert>
            )}

            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Una vez publicada, los proveedores podrán ver tu solicitud y enviarte cotizaciones. 
                Recibirás notificaciones cuando lleguen nuevas ofertas.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmDialog(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={() => createBudgetRequest(true)}
              disabled={submitting}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Publicando...
                </>
              ) : (
                <>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Sí, Publicar Ahora
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
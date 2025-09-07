import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  AlertTriangle, CheckCircle, Clock, Eye, FileText, 
  Image as ImageIcon, MapPin, MessageCircle, Send, 
  User, Calendar, ArrowRight, RefreshCw, Filter,
  Loader2, AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Incident {
  id: string;
  title: string;
  description: string;
  category: string;
  urgency: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'processed';
  work_location: string;
  special_requirements?: string;
  images?: string[];
  documents?: string[];
  reporter_name: string;
  reporter_email: string;
  community_name: string;
  community_id: string;
  created_at: string;
  admin_notes?: string;
}

const SERVICE_CATEGORIES = {
  "cleaning": { label: "Limpieza", icon: "🧽" },
  "plumbing": { label: "Fontanería", icon: "🔧" },
  "electrical": { label: "Electricidad", icon: "⚡" },
  "gardening": { label: "Jardinería", icon: "🌱" },
  "painting": { label: "Pintura", icon: "🎨" },
  "maintenance": { label: "Mantenimiento", icon: "🛠️" },
  "security": { label: "Seguridad", icon: "🛡️" },
  "hvac": { label: "Climatización", icon: "🌡️" },
  "carpentry": { label: "Carpintería", icon: "🪵" },
  "emergency": { label: "Emergencia", icon: "🚨" },
  "other": { label: "Otros", icon: "📋" }
};

const URGENCY_LEVELS = {
  "low": { label: "Baja", color: "bg-blue-100 text-blue-800", icon: "🕐" },
  "normal": { label: "Normal", color: "bg-green-100 text-green-800", icon: "📅" },
  "high": { label: "Alta", color: "bg-orange-100 text-orange-800", icon: "🔥" },
  "emergency": { label: "Emergencia", color: "bg-red-100 text-red-800", icon: "🚨" }
};

const STATUS_CONFIG = {
  "pending": { label: "Pendiente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  "under_review": { label: "En Revisión", color: "bg-blue-100 text-blue-800", icon: Eye },
  "approved": { label: "Aprobada", color: "bg-green-100 text-green-800", icon: CheckCircle },
  "rejected": { label: "Rechazada", color: "bg-red-100 text-red-800", icon: AlertCircle },
  "processed": { label: "Procesada", color: "bg-neutral-100 text-neutral-800", icon: CheckCircle }
};

export function IncidentManagement({ onProcessIncident }: { onProcessIncident?: (incident: Incident) => void }) {
  const { user, activeRole } = useSupabaseAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showProcessDialog, setShowProcessDialog] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (user && activeRole?.role_type === 'property_administrator') {
      loadIncidents();
    }
  }, [user, activeRole]);

  const loadIncidents = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError("");

      const { data, error: queryError } = await supabase
        .from('incidents')
        .select(`
          *,
          community:communities!incidents_community_id_fkey(
            name
          )
        `)
        .eq('administrator_id', user.id)
        .order('created_at', { ascending: false });

      if (queryError) {
        throw queryError;
      }

      // Get reporter information separately to avoid relation issues
      const incidentsWithReporters = await Promise.all((data || []).map(async (incident) => {
        let reporter_name = 'Usuario desconocido';
        let reporter_email = '';

        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', incident.reporter_id)
            .single();

          if (profile) {
            reporter_name = profile.full_name || 'Usuario desconocido';
            reporter_email = profile.email || '';
          }
        } catch (profileError) {
          console.warn(`Could not fetch profile for reporter ${incident.reporter_id}:`, profileError);
        }

        return {
          id: incident.id,
          title: incident.title,
          description: incident.description,
          category: incident.category,
          urgency: incident.urgency,
          status: incident.status,
          work_location: incident.work_location,
          special_requirements: incident.special_requirements,
          images: incident.images || [],
          documents: incident.documents || [],
          reporter_name,
          reporter_email,
          community_name: incident.community?.name || 'Comunidad desconocida',
          community_id: incident.community_id,
          created_at: incident.created_at,
          admin_notes: incident.admin_notes
        };
      }));

      setIncidents(incidentsWithReporters);

    } catch (err) {
      console.error("Error loading incidents:", err);
      setError("Error al cargar las incidencias");
    } finally {
      setLoading(false);
    }
  };

  const handleViewIncident = (incident: Incident) => {
    setSelectedIncident(incident);
    setShowDetailDialog(true);
  };

  const handleProcessIncident = (incident: Incident) => {
    setSelectedIncident(incident);
    setAdminNotes(incident.admin_notes || "");
    setShowProcessDialog(true);
  };

  const updateIncidentStatus = async (status: 'approved' | 'rejected' | 'under_review') => {
    if (!selectedIncident) return;

    try {
      setProcessing(true);
      setError("");

      const { error: updateError } = await supabase
        .from('incidents')
        .update({
          status,
          admin_notes: adminNotes,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id
        })
        .eq('id', selectedIncident.id);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setIncidents(prev => prev.map(inc => 
        inc.id === selectedIncident.id 
          ? { ...inc, status, admin_notes: adminNotes }
          : inc
      ));

      // If approved, trigger budget request process
      if (status === 'approved' && onProcessIncident) {
        onProcessIncident({ ...selectedIncident, status, admin_notes: adminNotes });
      }

      setShowProcessDialog(false);
      setSelectedIncident(null);
      setAdminNotes("");

    } catch (err) {
      console.error("Error updating incident:", err);
      setError("Error al actualizar la incidencia");
    } finally {
      setProcessing(false);
    }
  };

  const filteredIncidents = incidents.filter(incident => {
    if (filterStatus === "all") return true;
    return incident.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
    const IconComponent = config.icon;
    return (
      <Badge className={`${config.color} border-0`}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!activeRole || activeRole.role_type !== 'property_administrator') {
    return (
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/60">
        <CardContent className="text-center p-8">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-amber-600" />
          <h3 className="text-lg font-semibold text-amber-900 mb-2">Acceso Restringido</h3>
          <p className="text-sm text-amber-700">
            Esta funcionalidad está disponible solo para administradores de fincas.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-white to-orange-50/30 border-orange-200/60 shadow-xl shadow-orange-900/10">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">Gestión de Incidencias</CardTitle>
              <CardDescription className="text-orange-100">
                Revisa y gestiona las incidencias reportadas por los miembros de tu comunidad
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-neutral-600" />
              <span className="text-sm font-medium">Filtrar por estado:</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
              >
                Todas
              </Button>
              <Button
                variant={filterStatus === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("pending")}
              >
                Pendientes
              </Button>
              <Button
                variant={filterStatus === "under_review" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("under_review")}
              >
                En Revisión
              </Button>
              <Button
                variant={filterStatus === "approved" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("approved")}
              >
                Aprobadas
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadIncidents}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-orange-600 mr-2" />
              <span className="text-orange-800">Cargando incidencias...</span>
            </div>
          ) : filteredIncidents.length === 0 ? (
            <div className="text-center p-8 text-neutral-600">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
              <h3 className="font-semibold mb-2">No hay incidencias</h3>
              <p className="text-sm">
                {filterStatus === "all" 
                  ? "No se han reportado incidencias aún." 
                  : `No hay incidencias con estado "${STATUS_CONFIG[filterStatus as keyof typeof STATUS_CONFIG]?.label}".`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredIncidents.map(incident => {
                const categoryConfig = SERVICE_CATEGORIES[incident.category as keyof typeof SERVICE_CATEGORIES];
                const urgencyConfig = URGENCY_LEVELS[incident.urgency as keyof typeof URGENCY_LEVELS];
                
                return (
                  <Card key={incident.id} className="hover:shadow-lg transition-shadow border-neutral-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-neutral-900">{incident.title}</h3>
                            {getStatusBadge(incident.status)}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-neutral-600 mb-3">
                            <div className="flex items-center gap-1">
                              <span className="text-base">{categoryConfig?.icon}</span>
                              <span>{categoryConfig?.label}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge className={`${urgencyConfig?.color} border-0 text-xs`}>
                                <span className="mr-1">{urgencyConfig?.icon}</span>
                                {urgencyConfig?.label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(incident.created_at)}</span>
                            </div>
                          </div>

                          <p className="text-neutral-700 mb-3 line-clamp-2">{incident.description}</p>

                          <div className="flex items-center gap-4 text-sm text-neutral-600">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{incident.reporter_name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{incident.community_name}</span>
                            </div>
                            {(incident.images && incident.images.length > 0) && (
                              <div className="flex items-center gap-1">
                                <ImageIcon className="h-3 w-3" />
                                <span>{incident.images.length} fotos</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewIncident(incident)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalles
                          </Button>
                          
                          {incident.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleProcessIncident(incident)}
                              className="bg-orange-600 hover:bg-orange-700"
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Revisar
                            </Button>
                          )}

                          {incident.status === 'approved' && (
                            <Button
                              size="sm"
                              onClick={() => onProcessIncident && onProcessIncident(incident)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Send className="h-4 w-4 mr-1" />
                              Tramitar
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Detalles de la Incidencia
            </DialogTitle>
          </DialogHeader>

          {selectedIncident && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                {getStatusBadge(selectedIncident.status)}
                <Badge className={URGENCY_LEVELS[selectedIncident.urgency as keyof typeof URGENCY_LEVELS]?.color}>
                  {URGENCY_LEVELS[selectedIncident.urgency as keyof typeof URGENCY_LEVELS]?.icon} {URGENCY_LEVELS[selectedIncident.urgency as keyof typeof URGENCY_LEVELS]?.label}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-neutral-700">Reportado por:</span>
                  <p>{selectedIncident.reporter_name}</p>
                </div>
                <div>
                  <span className="font-medium text-neutral-700">Comunidad:</span>
                  <p>{selectedIncident.community_name}</p>
                </div>
                <div>
                  <span className="font-medium text-neutral-700">Categoría:</span>
                  <p>
                    {SERVICE_CATEGORIES[selectedIncident.category as keyof typeof SERVICE_CATEGORIES]?.icon} {SERVICE_CATEGORIES[selectedIncident.category as keyof typeof SERVICE_CATEGORIES]?.label}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-neutral-700">Fecha:</span>
                  <p>{formatDate(selectedIncident.created_at)}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-neutral-900 mb-2">Título:</h4>
                <p className="text-neutral-700">{selectedIncident.title}</p>
              </div>

              <div>
                <h4 className="font-medium text-neutral-900 mb-2">Descripción:</h4>
                <p className="text-neutral-700 whitespace-pre-wrap">{selectedIncident.description}</p>
              </div>

              {selectedIncident.work_location && (
                <div>
                  <h4 className="font-medium text-neutral-900 mb-2">Ubicación:</h4>
                  <p className="text-neutral-700">{selectedIncident.work_location}</p>
                </div>
              )}

              {selectedIncident.special_requirements && (
                <div>
                  <h4 className="font-medium text-neutral-900 mb-2">Requisitos Especiales:</h4>
                  <p className="text-neutral-700">{selectedIncident.special_requirements}</p>
                </div>
              )}

              {selectedIncident.images && selectedIncident.images.length > 0 && (
                <div>
                  <h4 className="font-medium text-neutral-900 mb-2">Imágenes:</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedIncident.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:opacity-80"
                        onClick={() => window.open(image, '_blank')}
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedIncident.admin_notes && (
                <div>
                  <h4 className="font-medium text-neutral-900 mb-2">Notas del Administrador:</h4>
                  <p className="text-neutral-700 bg-neutral-50 p-3 rounded-lg">{selectedIncident.admin_notes}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Cerrar
            </Button>
            {selectedIncident && selectedIncident.status === 'pending' && (
              <Button 
                onClick={() => {
                  setShowDetailDialog(false);
                  handleProcessIncident(selectedIncident);
                }}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Revisar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Process Dialog */}
      <Dialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-orange-600" />
              Revisar Incidencia
            </DialogTitle>
            <DialogDescription>
              Revisa la incidencia y decide si aprobarla para generar una solicitud de presupuesto.
            </DialogDescription>
          </DialogHeader>

          {selectedIncident && (
            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-medium mb-2">{selectedIncident.title}</h4>
                <p className="text-sm text-neutral-600 mb-2">{selectedIncident.description}</p>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span>Reportado por: {selectedIncident.reporter_name}</span>
                  <Separator orientation="vertical" className="h-3" />
                  <span>{selectedIncident.community_name}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="admin_notes">Notas y Comentarios</Label>
                <Textarea
                  id="admin_notes"
                  placeholder="Añade notas sobre tu revisión, instrucciones adicionales, o comentarios..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowProcessDialog(false)}
              disabled={processing}
            >
              Cancelar
            </Button>
            <Button 
              variant="outline"
              onClick={() => updateIncidentStatus('under_review')}
              disabled={processing}
            >
              {processing ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Clock className="h-4 w-4 mr-1" />}
              Marcar en Revisión
            </Button>
            <Button 
              variant="destructive"
              onClick={() => updateIncidentStatus('rejected')}
              disabled={processing}
            >
              {processing ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <AlertCircle className="h-4 w-4 mr-1" />}
              Rechazar
            </Button>
            <Button 
              onClick={() => updateIncidentStatus('approved')}
              disabled={processing}
              className="bg-green-600 hover:bg-green-700"
            >
              {processing ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <ArrowRight className="h-4 w-4 mr-1" />}
              Aprobar y Tramitar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
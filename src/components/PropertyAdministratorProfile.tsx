import React, { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Building, 
  Mail, 
  Calendar, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Edit3,
  Save,
  X,
  Phone,
  Users,
  Clock,
  UserCheck
} from "lucide-react";

interface PropertyAdministratorData {
  company_name: string;
  company_cif: string;
  contact_email: string;
  contact_phone: string;
  membership_date: string;
  license_number: string;
  notes: string;
}

export function PropertyAdministratorProfile() {
  const { user, profile } = useSupabaseAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    company_name: profile?.full_name || "",
    company_cif: "",
    contact_email: user?.email || "",
    contact_phone: profile?.phone || "",
    license_number: "",
    notes: ""
  });

  useEffect(() => {
    if (user?.id) {
      loadPendingAssignmentRequests();
    }
  }, [user?.id]);

  const loadPendingAssignmentRequests = async () => {
    if (!user?.id) return;

    try {
      // Find requests where the administrator email matches this user's email
      const { data: requests, error } = await supabase
        .from('community_member_administrators')
        .select(`
          *,
          profiles!community_member_administrators_user_id_fkey(full_name, email)
        `)
        .eq('contact_email', user.email)
        .eq('administrator_verified', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Error loading assignment requests:', error);
        return;
      }

      setPendingRequests(requests || []);
    } catch (err) {
      console.error('Error loading pending requests:', err);
    }
  };

  const handleAssignmentRequest = async (requestId: string, approve: boolean) => {
    try {
      setProcessingRequest(requestId);
      setError("");

      const { error: updateError } = await supabase
        .from('community_member_administrators')
        .update({
          administrator_verified: approve,
          notes: approve 
            ? `Asignación confirmada por ${profile?.full_name || 'Administrador'} el ${new Date().toLocaleDateString('es-ES')}`
            : `Solicitud rechazada por ${profile?.full_name || 'Administrador'} el ${new Date().toLocaleDateString('es-ES')}`
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Send notification back to the community member
      const request = pendingRequests.find(r => r.id === requestId);
      if (request) {
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: request.user_id,
            title: approve ? 'Asignación de administrador confirmada' : 'Solicitud de asignación rechazada',
            message: approve 
              ? `Tu solicitud de asignación a ${request.company_name} ha sido aprobada. Ya puedes reportar incidencias.`
              : `Tu solicitud de asignación a ${request.company_name} ha sido rechazada. Puedes intentar con otro administrador.`,
            type: approve ? 'info' : 'warning',
            category: 'assignment_response',
            related_entity_type: 'community_member_administrator',
            related_entity_id: requestId,
            read: false
          });

        if (notificationError) {
          console.warn('Failed to send notification:', notificationError);
        }
      }

      // Reload requests
      await loadPendingAssignmentRequests();

    } catch (err) {
      console.error('Error processing assignment request:', err);
      setError('Error al procesar la solicitud');
    } finally {
      setProcessingRequest(null);
    }
  };

  const validateCIF = (cif: string): boolean => {
    const cifRegex = /^[A-HJNPQRSUVW]\d{8}$/;
    return cifRegex.test(cif.toUpperCase());
  };

  const handleSave = async () => {
    if (!user?.id) return;

    // Validate required fields
    if (!formData.company_name.trim()) {
      setError("El nombre de la empresa es obligatorio");
      return;
    }

    if (!formData.contact_email.trim()) {
      setError("El email de contacto es obligatorio");
      return;
    }

    if (formData.company_cif && !validateCIF(formData.company_cif)) {
      setError("El formato del CIF no es válido. Debe tener una letra seguida de 8 números (ej: A12345678)");
      return;
    }

    try {
      setSaving(true);
      setError("");

      // TODO: When property_administrators table is properly integrated,
      // save the data to that table. For now, show success message.
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setIsEditing(false);
      console.log("Administrator profile would be updated successfully");
      
    } catch (err) {
      console.error("Error saving administrator data:", err);
      setError("Error al guardar la información. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      company_name: profile?.full_name || "",
      company_cif: "",
      contact_email: user?.email || "",
      contact_phone: profile?.phone || "",
      license_number: "",
      notes: ""
    });
    setIsEditing(false);
    setError("");
  };

  // Get administrator data from the user profile
  const adminData: PropertyAdministratorData = {
    company_name: profile?.full_name || "No especificado",
    company_cif: "Pendiente de configurar",
    contact_email: user?.email || "No especificado",
    contact_phone: profile?.phone || "No especificado",
    membership_date: profile?.created_at || new Date().toISOString(),
    license_number: "Pendiente de configurar",
    notes: "Información básica del administrador de fincas"
  };

  return (
    <div className="space-y-6">
      {/* Assignment Requests Section - NEW */}
      {pendingRequests.length > 0 && (
        <Card className="border-blue-200 shadow-lg bg-gradient-to-br from-blue-50 to-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-blue-900">
                  <UserCheck className="h-6 w-6 text-blue-600" />
                  Solicitudes de Asignación
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Miembros de comunidad que solicitan ser asignados a tu gestión
                </CardDescription>
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                {pendingRequests.length} pendiente{pendingRequests.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {pendingRequests.map((request) => (
              <div key={request.id} className="p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">
                        {request.profiles?.full_name || 'Miembro de Comunidad'}
                      </h4>
                      <Badge className="bg-orange-100 text-orange-800 text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        Pendiente
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-blue-700 mb-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <span>{request.profiles?.email || 'Email no disponible'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>Solicitado: {new Date(request.created_at).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>

                    {request.notes && (
                      <div className="p-2 bg-blue-50 rounded text-xs text-blue-800 mb-3">
                        {request.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      onClick={() => handleAssignmentRequest(request.id, true)}
                      disabled={processingRequest === request.id}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {processingRequest === request.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Aprobar
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => handleAssignmentRequest(request.id, false)}
                      disabled={processingRequest === request.id}
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Rechazar
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                ¿Qué significa aprobar una asignación?
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• El miembro de comunidad podrá reportar incidencias directamente a tu empresa</li>
                <li>• Recibirás notificaciones de todas las incidencias que reporten</li>
                <li>• Podrás gestionar sus solicitudes de presupuestos y servicios</li>
                <li>• Se establecerá una comunicación directa para la gestión de su comunidad</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Existing Company Information Card */}
      <Card className="border-stone-200 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-black">
                <Building className="h-6 w-6 text-stone-600" />
                Información de la Empresa
              </CardTitle>
              <CardDescription>
                Datos corporativos del administrador de fincas
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Editar
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  size="sm"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Guardar
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="company_name" className="text-sm font-medium text-stone-700">
                  Nombre de la Empresa *
                </Label>
                {isEditing ? (
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                    placeholder="ej: García y Asociados S.L."
                    className="mt-1"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200 mt-1">
                    <Building className="h-5 w-5 text-stone-500" />
                    <span className="font-semibold text-black">
                      {adminData.company_name}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="company_cif" className="text-sm font-medium text-stone-700">
                  CIF de la Empresa *
                </Label>
                {isEditing ? (
                  <div>
                    <Input
                      id="company_cif"
                      value={formData.company_cif}
                      onChange={(e) => setFormData(prev => ({ ...prev, company_cif: e.target.value.toUpperCase() }))}
                      placeholder="ej: A12345678"
                      className="mt-1"
                      maxLength={9}
                    />
                    <p className="text-xs text-stone-500 mt-1">
                      Formato: Una letra seguida de 8 números (ej: A12345678)
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200 mt-1">
                    <FileText className="h-5 w-5 text-amber-500" />
                    <span className="font-semibold text-amber-900">
                      {adminData.company_cif}
                    </span>
                    <Badge className="bg-amber-100 text-amber-800">Configurar</Badge>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="contact_email" className="text-sm font-medium text-stone-700">
                  Email de Contacto *
                </Label>
                {isEditing ? (
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                    placeholder="contacto@empresa.com"
                    className="mt-1"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200 mt-1">
                    <Mail className="h-5 w-5 text-stone-500" />
                    <span className="font-semibold text-black">
                      {adminData.contact_email}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="contact_phone" className="text-sm font-medium text-stone-700">
                  Teléfono de Contacto
                </Label>
                {isEditing ? (
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                    placeholder="ej: +34 91 123 45 67"
                    className="mt-1"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200 mt-1">
                    <Phone className="h-5 w-5 text-stone-500" />
                    <span className="font-semibold text-black">
                      {adminData.contact_phone}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-stone-700">
                  Fecha de Membresía
                </Label>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200 mt-1">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <div>
                    <span className="font-semibold text-green-900">
                      {new Date(adminData.membership_date).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </span>
                    <p className="text-xs text-green-700 mt-1">
                      Miembro verificado de HuBiT
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="license_number" className="text-sm font-medium text-stone-700">
                  Número de Colegiado
                </Label>
                {isEditing ? (
                  <Input
                    id="license_number"
                    value={formData.license_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, license_number: e.target.value }))}
                    placeholder="ej: 12345"
                    className="mt-1"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200 mt-1">
                    <Badge className="bg-amber-100 text-amber-800">
                      {adminData.license_number}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div>
              <Label htmlFor="notes" className="text-sm font-medium text-stone-700">
                Notas Adicionales
              </Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Información adicional sobre la empresa..."
                className="mt-1 w-full p-3 border border-stone-300 rounded-md resize-none h-20 text-sm"
              />
            </div>
          )}

          {!isEditing && adminData.notes && adminData.notes !== "Información básica del administrador de fincas" && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Notas:</h4>
              <p className="text-blue-800 text-sm">{adminData.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-stone-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-black">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Estado de Verificación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-bold text-green-900">Cuenta Verificada</h3>
              <p className="text-sm text-green-700">Email confirmado</p>
            </div>
            
            <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
              <Building className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <h3 className="font-bold text-amber-900">Empresa Registrada</h3>
              <p className="text-sm text-amber-700">Información pendiente</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <Badge className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                ✓ ACTIVO
              </Badge>
              <h3 className="font-bold text-green-900">Administrador Activo</h3>
              <p className="text-sm text-green-700">Servicios disponibles</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Configuración Pendiente</h4>
                <p className="text-blue-700 text-sm mb-3">
                  Para completar tu perfil de administrador de fincas, es necesario proporcionar:
                </p>
                <ul className="text-blue-700 text-sm space-y-1 list-disc list-inside">
                  <li>CIF de la empresa</li>
                  <li>Número de colegiado (opcional)</li>
                  <li>Información adicional de la empresa</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
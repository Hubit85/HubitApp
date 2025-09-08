
import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Building, CheckCircle, Edit, Save, X, Loader2, 
  AlertCircle, Phone, Mail, Building2, FileText, User
} from "lucide-react";
import type { CommunityMemberAdministrator } from "@/integrations/supabase/types";

export function CommunityAdministratorAssignment() {
  const { user, userRoles } = useSupabaseAuth();
  const [assignment, setAssignment] = useState<CommunityMemberAdministrator | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    company_name: "",
    company_cif: "",
    contact_email: "",
    contact_phone: "",
    notes: ""
  });

  // Check if user is community member
  const isCommunityMember = userRoles.some(role => 
    role.role_type === 'community_member' && role.is_verified
  );

  useEffect(() => {
    if (user && isCommunityMember) {
      loadAssignment();
    } else {
      setLoading(false);
    }
  }, [user, isCommunityMember]);

  const loadAssignment = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError("");

      const { data, error: queryError } = await supabase
        .from('community_member_administrators')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (queryError) {
        throw queryError;
      }

      if (data) {
        setAssignment(data);
        setFormData({
          company_name: data.company_name || "",
          company_cif: data.company_cif || "",
          contact_email: data.contact_email || "",
          contact_phone: data.contact_phone || "",
          notes: data.notes || ""
        });
      } else {
        // No assignment found - this is normal for new users
        setAssignment(null);
      }
    } catch (err) {
      console.error("Error loading administrator assignment:", err);
      setError("Error al cargar la información del administrador de fincas");
    } finally {
      setLoading(false);
    }
  };

  const validateCIF = (cif: string): boolean => {
    // Basic CIF validation for Spanish companies
    const cifRegex = /^[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J]$/;
    return cifRegex.test(cif.toUpperCase());
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
    setSuccess("");
  };

  const handleSave = async () => {
    if (!user?.id) return;

    // Validation
    if (!formData.company_name.trim()) {
      setError("El nombre de la empresa es obligatorio");
      return;
    }

    if (!formData.company_cif.trim()) {
      setError("El CIF de la empresa es obligatorio");
      return;
    }

    if (!validateCIF(formData.company_cif)) {
      setError("El formato del CIF no es válido (ej: B12345678)");
      return;
    }

    if (formData.contact_email && !formData.contact_email.includes('@')) {
      setError("El email de contacto no es válido");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const assignmentData = {
        user_id: user.id,
        company_name: formData.company_name.trim(),
        company_cif: formData.company_cif.trim().toUpperCase(),
        contact_email: formData.contact_email.trim() || null,
        contact_phone: formData.contact_phone.trim() || null,
        notes: formData.notes.trim() || null,
        administrator_verified: false // Reset verification when updating
      };

      if (assignment) {
        // Update existing assignment
        const { data, error: updateError } = await supabase
          .from('community_member_administrators')
          .update({
            ...assignmentData,
            updated_at: new Date().toISOString()
          })
          .eq('id', assignment.id)
          .select()
          .single();

        if (updateError) throw updateError;
        setAssignment(data);
      } else {
        // Create new assignment
        const { data, error: insertError } = await supabase
          .from('community_member_administrators')
          .insert(assignmentData)
          .select()
          .single();

        if (insertError) throw insertError;
        setAssignment(data);
      }

      setSuccess("Información del administrador de fincas guardada correctamente");
      setEditing(false);

      // Auto-hide success message
      setTimeout(() => setSuccess(""), 3000);

    } catch (err) {
      console.error("Error saving administrator assignment:", err);
      setError(err instanceof Error ? err.message : "Error al guardar la información");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    if (assignment) {
      setFormData({
        company_name: assignment.company_name || "",
        company_cif: assignment.company_cif || "",
        contact_email: assignment.contact_email || "",
        contact_phone: assignment.contact_phone || "",
        notes: assignment.notes || ""
      });
    } else {
      setFormData({
        company_name: "",
        company_cif: "",
        contact_email: "",
        contact_phone: "",
        notes: ""
      });
    }
    setEditing(false);
    setError("");
    setSuccess("");
  };

  if (!isCommunityMember) {
    return (
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardContent className="p-6 text-center">
          <Building className="h-12 w-12 mx-auto mb-4 text-amber-600" />
          <h3 className="text-lg font-semibold text-amber-900 mb-2">Función No Disponible</h3>
          <p className="text-sm text-amber-700">
            Esta funcionalidad está disponible solo para miembros de comunidad verificados.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="border-stone-200">
        <CardContent className="p-6 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-stone-600 mx-auto mb-4" />
          <p className="text-stone-600">Cargando información...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-stone-200 shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-black">
                Administrador de Fincas Asignado
              </CardTitle>
              <CardDescription>
                Información de la empresa que administra tu comunidad
              </CardDescription>
            </div>
          </div>
          
          {assignment && !editing && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {(error || success) && (
          <Alert className={`border-2 ${error ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}>
            <div className="flex items-center gap-2">
              {error ? <AlertCircle className="h-4 w-4 text-red-600" /> : <CheckCircle className="h-4 w-4 text-green-600" />}
              <AlertDescription className={`font-medium ${error ? "text-red-800" : "text-green-800"}`}>
                {error || success}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {!assignment && !editing ? (
          // No assignment exists - show initial setup
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">
              Asignar Administrador de Fincas
            </h3>
            <p className="text-stone-600 mb-6 max-w-md mx-auto">
              Para poder reportar incidencias eficazmente, necesitas especificar qué empresa administra tu comunidad.
            </p>
            <Button
              onClick={() => setEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Building className="h-4 w-4 mr-2" />
              Añadir Administrador
            </Button>
          </div>
        ) : editing ? (
          // Editing form
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name" className="text-sm font-medium">
                  Nombre de la Empresa *
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => handleInputChange("company_name", e.target.value)}
                    placeholder="Ej: García & Asociados S.L."
                    className="pl-10 bg-white border-stone-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_cif" className="text-sm font-medium">
                  CIF de la Empresa *
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <Input
                    id="company_cif"
                    value={formData.company_cif}
                    onChange={(e) => handleInputChange("company_cif", e.target.value.toUpperCase())}
                    placeholder="Ej: B12345678"
                    className="pl-10 bg-white border-stone-200"
                    maxLength={9}
                    required
                  />
                </div>
                <p className="text-xs text-stone-500">
                  Formato: Letra + 7 números + dígito de control
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email" className="text-sm font-medium">
                  Email de Contacto
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => handleInputChange("contact_email", e.target.value)}
                    placeholder="administracion@empresa.com"
                    className="pl-10 bg-white border-stone-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone" className="text-sm font-medium">
                  Teléfono de Contacto
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <Input
                    id="contact_phone"
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => handleInputChange("contact_phone", e.target.value)}
                    placeholder="91 123 45 67"
                    className="pl-10 bg-white border-stone-200"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Notas Adicionales
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Información adicional, horarios de atención, persona de contacto específica..."
                className="bg-white border-stone-200 min-h-[80px]"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-stone-200">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !formData.company_name.trim() || !formData.company_cif.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Guardar
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : assignment ? (
          // Display mode
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              {assignment.administrator_verified ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verificado
                </Badge>
              ) : (
                <Badge className="bg-orange-100 text-orange-800">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Pendiente de verificación
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg">
                  <Building2 className="h-5 w-5 text-stone-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-stone-900">{assignment.company_name}</p>
                    <p className="text-sm text-stone-600">Empresa administradora</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg">
                  <FileText className="h-5 w-5 text-stone-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-stone-900">{assignment.company_cif}</p>
                    <p className="text-sm text-stone-600">CIF de la empresa</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {assignment.contact_email && (
                  <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg">
                    <Mail className="h-5 w-5 text-stone-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-stone-900">{assignment.contact_email}</p>
                      <p className="text-sm text-stone-600">Email de contacto</p>
                    </div>
                  </div>
                )}

                {assignment.contact_phone && (
                  <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg">
                    <Phone className="h-5 w-5 text-stone-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-stone-900">{assignment.contact_phone}</p>
                      <p className="text-sm text-stone-600">Teléfono de contacto</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {assignment.notes && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium text-stone-900 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Notas Adicionales
                  </h4>
                  <p className="text-stone-700 bg-stone-50 p-3 rounded-lg whitespace-pre-wrap">
                    {assignment.notes}
                  </p>
                </div>
              </>
            )}

            <Separator />
            
            <div className="flex items-center justify-between text-sm text-stone-500">
              <span>
                Registrado: {assignment.created_at ? new Date(assignment.created_at).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                }) : 'Fecha desconocida'}
              </span>
              {assignment.updated_at !== assignment.created_at && assignment.updated_at && (
                <span>
                  Actualizado: {new Date(assignment.updated_at).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              )}
            </div>
          </div>
        ) : null}

        {!assignment && !editing && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">¿Por qué es importante esta información?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Facilita la comunicación directa con tu administrador</li>
              <li>• Permite reportar incidencias de manera más eficiente</li>
              <li>• Agiliza la resolución de problemas en la comunidad</li>
              <li>• Mejora la coordinación en servicios y mantenimiento</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
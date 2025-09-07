import React, { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PropertyAdministratorData {
  company_name: string;
  company_cif: string;
  contact_email: string;
  contact_phone?: string;
  membership_date: string;
  license_number?: string;
  notes?: string;
}

export function PropertyAdministratorProfile() {
  const { user, profile } = useSupabaseAuth();
  const [adminData, setAdminData] = useState<PropertyAdministratorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    company_cif: "",
    contact_email: "",
    contact_phone: "",
    license_number: "",
    notes: ""
  });

  useEffect(() => {
    if (user) {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError("");

      // First try to get existing data
      const { data, error: queryError } = await supabase
        .from('property_administrators')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (queryError && queryError.code !== 'PGRST116') {
        throw queryError;
      }

      if (data) {
        const adminInfo = {
          company_name: data.company_name || "",
          company_cif: data.company_cif || "",
          contact_email: data.contact_email || user.email || "",
          contact_phone: data.contact_phone || "",
          membership_date: data.created_at || profile?.created_at || new Date().toISOString(),
          license_number: data.license_number || "",
          notes: data.notes || ""
        };
        
        setAdminData(adminInfo);
        setFormData({
          company_name: adminInfo.company_name,
          company_cif: adminInfo.company_cif,
          contact_email: adminInfo.contact_email,
          contact_phone: adminInfo.contact_phone || "",
          license_number: adminInfo.license_number || "",
          notes: adminInfo.notes || ""
        });
      } else {
        // Create default data for new administrators
        const defaultData = {
          company_name: profile?.full_name || "",
          company_cif: "",
          contact_email: user.email || "",
          contact_phone: profile?.phone || "",
          membership_date: profile?.created_at || new Date().toISOString(),
          license_number: "",
          notes: ""
        };
        
        setAdminData(defaultData);
        setFormData({
          company_name: defaultData.company_name,
          company_cif: defaultData.company_cif,
          contact_email: defaultData.contact_email,
          contact_phone: defaultData.contact_phone || "",
          license_number: defaultData.license_number || "",
          notes: defaultData.notes || ""
        });
      }
    } catch (err) {
      console.error("Error loading administrator data:", err);
      setError("Error al cargar la información del administrador");
    } finally {
      setLoading(false);
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

    if (!formData.company_cif.trim()) {
      setError("El CIF de la empresa es obligatorio");
      return;
    }

    if (!validateCIF(formData.company_cif)) {
      setError("El formato del CIF no es válido. Debe tener una letra seguida de 8 números (ej: A12345678)");
      return;
    }

    if (!formData.contact_email.trim()) {
      setError("El email de contacto es obligatorio");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const adminInfo = {
        user_id: user.id,
        company_name: formData.company_name.trim(),
        company_cif: formData.company_cif.toUpperCase().trim(),
        contact_email: formData.contact_email.trim(),
        contact_phone: formData.contact_phone?.trim() || null,
        license_number: formData.license_number?.trim() || null,
        notes: formData.notes?.trim() || null,
        updated_at: new Date().toISOString()
      };

      const { error: upsertError } = await supabase
        .from('property_administrators')
        .upsert(adminInfo, { onConflict: 'user_id' });

      if (upsertError) {
        throw upsertError;
      }

      // Update local state
      setAdminData({
        ...adminInfo,
        membership_date: adminData?.membership_date || profile?.created_at || new Date().toISOString()
      });
      
      setIsEditing(false);
      console.log("Administrator profile updated successfully");
      
    } catch (err) {
      console.error("Error saving administrator data:", err);
      setError("Error al guardar la información. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (adminData) {
      setFormData({
        company_name: adminData.company_name,
        company_cif: adminData.company_cif,
        contact_email: adminData.contact_email,
        contact_phone: adminData.contact_phone || "",
        license_number: adminData.license_number || "",
        notes: adminData.notes || ""
      });
    }
    setIsEditing(false);
    setError("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-stone-600 mx-auto mb-4" />
          <p className="text-stone-600">Cargando información del administrador...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
                      {adminData?.company_name || "No especificado"}
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
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200 mt-1">
                    <FileText className="h-5 w-5 text-stone-500" />
                    <span className="font-semibold text-black font-mono">
                      {adminData?.company_cif || "No especificado"}
                    </span>
                    {adminData?.company_cif && validateCIF(adminData.company_cif) && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
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
                      {adminData?.contact_email || "No especificado"}
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
                    <Calendar className="h-5 w-5 text-stone-500" />
                    <span className="font-semibold text-black">
                      {adminData?.contact_phone || "No especificado"}
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
                      {adminData?.membership_date ? new Date(adminData.membership_date).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      }) : 'No disponible'}
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
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200 mt-1">
                    <Badge className="bg-blue-100 text-blue-800">
                      {adminData?.license_number || "No especificado"}
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

          {!isEditing && adminData?.notes && (
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
            
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <Building className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-bold text-green-900">Empresa Registrada</h3>
              <p className="text-sm text-green-700">Información corporativa</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <Badge className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                ✓ ACTIVO
              </Badge>
              <h3 className="font-bold text-green-900">Administrador Activo</h3>
              <p className="text-sm text-green-700">Servicios disponibles</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
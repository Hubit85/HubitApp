import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Mail, 
  Eye, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Copy, 
  ExternalLink,
  Loader2,
  AlertTriangle,
  Code,
  Palette
} from "lucide-react";
import SupabaseEmailService, { EmailTemplate } from "@/services/SupabaseEmailService";

export default function EmailTemplateManager() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<{success: boolean, message?: string, error?: string} | null>(null);
  const [previewMode, setPreviewMode] = useState<'html' | 'code'>('html');

  useEffect(() => {
    loadEmailTemplates();
  }, []);

  const loadEmailTemplates = async () => {
    setLoading(true);
    try {
      const result = await SupabaseEmailService.getEmailTemplates();
      if (result.data) {
        setTemplates(result.data);
        if (result.data.length > 0) {
          setSelectedTemplate(result.data[0]);
        }
      }
    } catch (error) {
      console.error("Error loading templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const testEmailConfiguration = async () => {
    setLoading(true);
    setTestStatus(null);
    
    try {
      const result = await SupabaseEmailService.testEmailConfiguration();
      setTestStatus(result);
    } catch (error) {
      setTestStatus({
        success: false,
        error: error instanceof Error ? error.message : "Test failed"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyTemplateCode = async (template: EmailTemplate) => {
    try {
      await navigator.clipboard.writeText(template.html_content);
      // Could add a toast notification here
    } catch (error) {
      console.error("Failed to copy template code:", error);
    }
  };

  const openSupabaseDashboard = () => {
    window.open("https://supabase.com/dashboard/project/djkrzbmgzfwagmripozi/auth/templates", "_blank");
  };

  if (loading && templates.length === 0) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
            <p className="text-neutral-600">Cargando plantillas de email...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
              <Mail className="h-8 w-8 text-blue-600" />
              Gestión de Email Templates
            </h1>
            <p className="text-neutral-600">
              Configuración y previsualización de plantillas de email para Supabase Auth
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={testEmailConfiguration}
              disabled={loading}
              variant="outline"
              className="bg-transparent hover:bg-neutral-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Settings className="h-4 w-4 mr-2" />}
              Probar configuración
            </Button>
            
            <Button
              onClick={openSupabaseDashboard}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Abrir Supabase Auth
            </Button>
          </div>
        </div>

        {/* Test Status */}
        {testStatus && (
          <Alert className={testStatus.success ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}>
            <div className="flex items-center gap-2">
              {testStatus.success ? 
                <CheckCircle className="h-4 w-4 text-emerald-600" /> : 
                <XCircle className="h-4 w-4 text-red-600" />
              }
              <AlertDescription className={testStatus.success ? "text-emerald-800" : "text-red-800"}>
                {testStatus.success ? 
                  `Configuración exitosa - ${testStatus.message} (${(testStatus as any).templates_count} plantillas)` : 
                  `Error: ${testStatus.error}`
                }
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Setup Instructions */}
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Instrucciones:</strong> Para usar estas plantillas, copia el código HTML y pégalo en el 
            <Button 
              variant="link" 
              className="p-0 h-auto text-amber-700 hover:text-amber-900"
              onClick={openSupabaseDashboard}
            >
              panel de Supabase Auth → Email Templates
            </Button>
          </AlertDescription>
        </Alert>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Templates List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Plantillas disponibles
            </CardTitle>
            <CardDescription>
              Selecciona una plantilla para previsualizar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedTemplate?.id === template.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-neutral-200 hover:border-neutral-300 bg-white"
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm text-neutral-900">
                    {template.name}
                  </h3>
                  <Badge 
                    variant={template.is_active ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {template.is_active ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                
                <p className="text-xs text-neutral-600 mb-3">
                  {template.subject}
                </p>
                
                <div className="flex items-center justify-between">
                  <code className="text-xs bg-neutral-100 px-2 py-1 rounded text-blue-600">
                    {template.template_type}
                  </code>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyTemplateCode(template);
                    }}
                    className="h-6 px-2 text-xs"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Template Preview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Previsualización
              </CardTitle>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={previewMode === 'html' ? 'default' : 'outline'}
                  onClick={() => setPreviewMode('html')}
                  className="text-xs"
                >
                  <Palette className="h-3 w-3 mr-1" />
                  Visual
                </Button>
                <Button
                  size="sm"
                  variant={previewMode === 'code' ? 'default' : 'outline'}
                  onClick={() => setPreviewMode('code')}
                  className="text-xs"
                >
                  <Code className="h-3 w-3 mr-1" />
                  Código
                </Button>
              </div>
            </div>
            
            {selectedTemplate && (
              <CardDescription>
                <strong>Tipo:</strong> {selectedTemplate.template_type} | 
                <strong> Variables:</strong> {selectedTemplate.variables.join(", ")}
              </CardDescription>
            )}
          </CardHeader>
          
          <CardContent>
            {selectedTemplate ? (
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview">Vista Previa</TabsTrigger>
                  <TabsTrigger value="details">Detalles</TabsTrigger>
                </TabsList>
                
                <TabsContent value="preview" className="mt-4">
                  {previewMode === 'html' ? (
                    <div className="border rounded-lg overflow-hidden">
                      <div 
                        className="email-preview max-h-96 overflow-auto p-4"
                        dangerouslySetInnerHTML={{ 
                          __html: selectedTemplate.html_content
                            .replace(/\{\{\s*\.ConfirmationURL\s*\}\}/g, "#confirmation-url")
                            .replace(/\{\{\s*\.Email\s*\}\}/g, "usuario@ejemplo.com")
                            .replace(/\{\{\s*now\.Year\s*\}\}/g, new Date().getFullYear().toString())
                        }}
                      />
                    </div>
                  ) : (
                    <Textarea
                      value={selectedTemplate.html_content}
                      readOnly
                      className="h-96 font-mono text-xs"
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="details" className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Nombre</Label>
                      <Input value={selectedTemplate.name} readOnly className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Tipo</Label>
                      <Input value={selectedTemplate.template_type} readOnly className="mt-1" />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Asunto</Label>
                    <Input value={selectedTemplate.subject} readOnly className="mt-1" />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Variables disponibles</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedTemplate.variables.map((variable) => (
                        <Badge key={variable} variant="secondary" className="font-mono text-xs">
                          {`{{ ${variable} }}`}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      onClick={() => copyTemplateCode(selectedTemplate)}
                      className="w-full"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar código HTML
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex items-center justify-center py-12 text-neutral-500">
                <div className="text-center">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
                  <p>Selecciona una plantilla para previsualizar</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Implementation Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Guía de Implementación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <h4 className="font-semibold text-sm">Acceder a Supabase</h4>
              </div>
              <p className="text-xs text-neutral-600">Ve a Authentication → Email Templates en tu dashboard</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <h4 className="font-semibold text-sm">Copiar HTML</h4>
              </div>
              <p className="text-xs text-neutral-600">Copia el código HTML de la plantilla que desees usar</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <h4 className="font-semibold text-sm">Configurar</h4>
              </div>
              <p className="text-xs text-neutral-600">Pega el HTML en el template correspondiente y guarda</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                <h4 className="font-semibold text-sm">Probar</h4>
              </div>
              <p className="text-xs text-neutral-600">Realiza un registro de prueba para verificar el diseño</p>
            </div>
          </div>
          
          <Alert className="border-blue-200 bg-blue-50">
            <Mail className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Tip:</strong> Las variables como <code>{`{{ .ConfirmationURL }}`}</code> son reemplazadas automáticamente por Supabase cuando se envía el email.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}

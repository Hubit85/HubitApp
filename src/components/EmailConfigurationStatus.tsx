
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertTriangle, Mail, ExternalLink } from "lucide-react";
import CustomEmailService from "@/lib/customEmailService";

export default function EmailConfigurationStatus() {
  const [emailConfig, setEmailConfig] = useState<{
    isValid: boolean;
    missingVars: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkEmailConfiguration();
  }, []);

  const checkEmailConfiguration = () => {
    try {
      const config = CustomEmailService.validateEmailConfig();
      setEmailConfig(config);
    } catch (error) {
      console.error("Error checking email config:", error);
      setEmailConfig({
        isValid: false,
        missingVars: ['RESEND_API_KEY']
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
        <div className="flex items-center gap-2">
          <div className="animate-spin w-4 h-4 border-2 border-neutral-400 border-t-transparent rounded-full" />
          <span className="text-sm text-neutral-600">Verificando configuración de email...</span>
        </div>
      </div>
    );
  }

  if (!emailConfig) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <XCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Error al verificar la configuración del servicio de email.
        </AlertDescription>
      </Alert>
    );
  }

  if (emailConfig.isValid) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-green-800 font-medium">Servicio de Email Configurado</span>
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                <Mail className="w-3 h-3 mr-1" />
                Resend API
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Activo</span>
            </div>
          </div>
          <p className="text-sm text-green-700 mt-2">
            Los emails de verificación de roles se enviarán correctamente.
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-amber-200 bg-amber-50">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-amber-800 font-medium">Configuración de Email Incompleta</span>
            <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
              Configuración Requerida
            </Badge>
          </div>
          
          <div className="text-sm text-amber-700">
            <p className="mb-2">Variables de entorno faltantes:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              {emailConfig.missingVars.map((varName) => (
                <li key={varName} className="font-mono text-xs bg-amber-100 px-2 py-1 rounded inline-block mr-2">
                  {varName}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-100/50 p-3 rounded-lg border border-amber-200">
            <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Cómo configurar el servicio de email:
            </h4>
            <ol className="text-sm text-amber-700 space-y-2 ml-4 list-decimal">
              <li>
                Registra una cuenta gratuita en{" "}
                <a 
                  href="https://resend.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-800 underline hover:text-amber-900 inline-flex items-center gap-1"
                >
                  Resend.com <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>Crea una API Key en tu dashboard de Resend</li>
              <li>
                Agrega la variable de entorno en la configuración de Softgen:
                <div className="mt-1 p-2 bg-amber-200/50 rounded text-xs font-mono">
                  RESEND_API_KEY=tu_api_key_aquí
                </div>
              </li>
            </ol>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkEmailConfiguration}
              className="bg-transparent hover:bg-amber-100"
            >
              Verificar de Nuevo
            </Button>
            <span className="text-xs text-amber-600">
              💡 Sin esta configuración, los emails de verificación no funcionarán
            </span>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}

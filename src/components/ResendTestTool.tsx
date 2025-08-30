
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, CheckCircle, AlertCircle, Zap } from 'lucide-react';

interface TestResult {
  success: boolean;
  message: string;
  details?: any;
  status?: number;
  responseData?: any;
}

export default function ResendTestTool() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const testResendAPI = async () => {
    setTesting(true);
    setResult(null);

    try {
      const response = await fetch('/api/test/resend-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testEmail: 'test@example.com'
        })
      });

      const data = await response.json();
      
      setResult({
        success: response.ok && data.success,
        message: data.message || `HTTP ${response.status}`,
        status: response.status,
        details: data.details,
        responseData: data
      });

    } catch (error) {
      setResult({
        success: false,
        message: `Error de conexión: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-white to-blue-50/30 border-blue-200/60 shadow-lg shadow-blue-900/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-blue-900">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Zap className="h-5 w-5 text-blue-600" />
          </div>
          Diagnóstico de Resend API
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button 
            onClick={testResendAPI}
            disabled={testing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {testing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Probando...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Probar Conexión API
              </>
            )}
          </Button>
          
          <div className="text-sm text-blue-700">
            Esto probará si la clave de API de Resend está configurada correctamente
          </div>
        </div>

        {result && (
          <Alert className={`border-2 ${
            result.success 
              ? 'border-green-200 bg-green-50' 
              : 'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={`font-medium ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                <div className="space-y-2">
                  <div>
                    <strong>Estado:</strong> {result.success ? '✅ Éxito' : '❌ Error'}
                  </div>
                  <div>
                    <strong>Mensaje:</strong> {result.message}
                  </div>
                  {result.status && (
                    <div>
                      <strong>Código HTTP:</strong> {result.status}
                    </div>
                  )}
                  {result.details && (
                    <div>
                      <strong>Detalles:</strong>
                      <pre className="text-xs mt-1 p-2 bg-neutral-100 rounded overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </div>
          </Alert>
        )}

        <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200/60">
          <h4 className="font-medium text-blue-900 mb-2">🔧 Qué hace este test:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Verifica que RESEND_API_KEY esté configurada</li>
            <li>• Valida el formato de la clave (debe empezar con 're_')</li>
            <li>• Intenta hacer una llamada de prueba a la API de Resend</li>
            <li>• Muestra errores específicos para diagnosticar problemas</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

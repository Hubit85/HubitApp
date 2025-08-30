
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, CheckCircle, AlertCircle, Zap, Settings, AlertTriangle } from 'lucide-react';

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

        <div className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium">Estado de Configuración de Resend</h3>
                <p className="text-sm text-neutral-600">Verificar la configuración de la API de Resend</p>
              </div>
              <Button 
                onClick={checkResendConfiguration}
                disabled={checking}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {checking ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-2" />
                    Verificar Config
                  </>
                )}
              </Button>
            </div>

            {/* Configuration Status */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  configStatus.hasKey ? 'bg-emerald-500' : 'bg-red-500'
                }`}>
                  {configStatus.hasKey ? (
                    <CheckCircle className="h-5 w-5 text-white" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-white" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">Estado de RESEND_API_KEY</h4>
                  <p className="text-sm text-blue-700">
                    {configStatus.hasKey 
                      ? "✅ Configurada correctamente" 
                      : "❌ No configurada o inválida"
                    }
                  </p>
                </div>
              </div>

              {configStatus.hasKey ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <p className="text-sm text-emerald-800">
                    <strong>✅ RESEND_API_KEY encontrada:</strong> {configStatus.keyPreview}
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">
                    La clave está configurada y tiene el formato correcto.
                  </p>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800 mb-2">
                    <strong>❌ RESEND_API_KEY no encontrada</strong>
                  </p>
                  <div className="space-y-2">
                    <div className="text-xs text-red-700">
                      <strong>Para solucionarlo:</strong>
                    </div>
                    <ol className="text-xs text-red-700 space-y-1 ml-4">
                      <li>1. Ve a <a href="https://resend.com/api-keys" target="_blank" className="text-blue-600 underline">https://resend.com/api-keys</a></li>
                      <li>2. Crea una nueva API key (empieza con 're_')</li>
                      <li>3. En Softgen: Settings (⚙️) → Environment → añadir:</li>
                      <li className="ml-4 font-mono bg-red-100 px-2 py-1 rounded">RESEND_API_KEY=tu_clave_aqui</li>
                      <li>4. Guarda y reinicia el servidor</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>

            {/* Test Results */}
            {result && (
              <Alert className={`border-2 ${
                result.success 
                  ? "border-emerald-200 bg-emerald-50" 
                  : "border-red-200 bg-red-50"
              }`}>
                <AlertDescription>
                  <div className="space-y-2">
                    <div className={`font-medium flex items-center gap-2 ${
                      result.success ? "text-emerald-800" : "text-red-800"
                    }`}>
                      {result.success ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                      {result.success ? "✅ Test Exitoso" : "❌ Error en el Test"}
                    </div>
                    
                    <p className={result.success ? "text-emerald-700" : "text-red-700"}>
                      {result.message}
                    </p>

                    {result.details && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm font-medium text-neutral-700 hover:text-neutral-900">
                          Ver detalles técnicos
                        </summary>
                        <pre className="mt-2 text-xs bg-neutral-100 p-3 rounded border overflow-x-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}

                    {!result.success && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                        <h5 className="font-medium text-blue-900 mb-2">💡 Posibles soluciones:</h5>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Verifica que RESEND_API_KEY esté configurada</li>
                          <li>• La clave debe empezar con 're_'</li>
                          <li>• Reinicia el servidor después de cambios</li>
                          <li>• Verifica tu cuenta en Resend.com</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
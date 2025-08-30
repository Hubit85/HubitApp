import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, Mail } from "lucide-react";

interface TestResult {
  success: boolean;
  message: string;
  details: {
    status?: number;
    keyExists?: boolean;
    keyLength?: number;
    keyPrefix?: string;
    currentKey?: string;
    error?: any;
    recommendations?: string[];
  };
}

export default function ResendKeyTester() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const testResendKey = async () => {
    setTesting(true);
    setResult(null);

    try {
      const response = await fetch('/api/test/resend-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Error de conexión al probar la API',
        details: {
          error: String(error),
          recommendations: [
            'Verifica que el servidor esté funcionando',
            'Intenta recargar la página',
            'Contacta soporte si el problema persiste'
          ]
        }
      });
    } finally {
      setTesting(false);
    }
  };

  const getStatusIcon = () => {
    if (testing) return <Clock className="h-5 w-5 text-yellow-500 animate-spin" />;
    if (!result) return <Mail className="h-5 w-5 text-gray-400" />;
    return result.success ? 
      <CheckCircle className="h-5 w-5 text-green-500" /> : 
      <AlertCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusColor = () => {
    if (testing) return "bg-yellow-50 border-yellow-200";
    if (!result) return "bg-gray-50 border-gray-200";
    return result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Diagnóstico de Clave Resend
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={testResendKey}
            disabled={testing}
            className="flex-1"
          >
            {testing ? "Probando..." : "🧪 Probar Clave Actual"}
          </Button>
        </div>

        {result && (
          <Card className={`${getStatusColor()} transition-all duration-300`}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant={result.success ? "default" : "destructive"}>
                    {result.success ? "✅ FUNCIONANDO" : "❌ ERROR"}
                  </Badge>
                  <span className="font-medium">{result.message}</span>
                </div>

                {result.details && (
                  <div className="space-y-2 text-sm">
                    {result.details.keyExists !== undefined && (
                      <div className="flex justify-between">
                        <span>Clave configurada:</span>
                        <Badge variant={result.details.keyExists ? "outline" : "destructive"}>
                          {result.details.keyExists ? "SÍ" : "NO"}
                        </Badge>
                      </div>
                    )}
                    
                    {result.details.keyLength && (
                      <div className="flex justify-between">
                        <span>Longitud de clave:</span>
                        <span className="font-mono">{result.details.keyLength} caracteres</span>
                      </div>
                    )}

                    {result.details.keyPrefix && (
                      <div className="flex justify-between">
                        <span>Formato de clave:</span>
                        <span className="font-mono">{result.details.keyPrefix}</span>
                      </div>
                    )}

                    {result.details.status && (
                      <div className="flex justify-between">
                        <span>Código de respuesta:</span>
                        <Badge variant={result.details.status === 200 ? "default" : "destructive"}>
                          {result.details.status}
                        </Badge>
                      </div>
                    )}

                    {result.details.currentKey && (
                      <div className="flex justify-between">
                        <span>Clave actual:</span>
                        <span className="font-mono text-xs">{result.details.currentKey}</span>
                      </div>
                    )}
                  </div>
                )}

                {result.details?.recommendations && (
                  <div className="mt-4 p-3 bg-white/50 rounded-lg border border-white/20">
                    <h4 className="font-semibold text-sm mb-2">🔧 Pasos para solucionar:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      {result.details.recommendations.map((rec, index) => (
                        <li key={index} className="text-gray-700">{rec}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {result.details?.error && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-gray-500">
                      Ver detalles técnicos
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                      {JSON.stringify(result.details.error, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>💡 Tip:</strong> Si tu clave no funciona, necesitas crear una nueva en resend.com</p>
          <p><strong>🔑 Clave actual:</strong> re_G5uNjHmE_EQdCfxeNTY3j4YmvFmqSv5Es</p>
        </div>
      </CardContent>
    </Card>
  );
}

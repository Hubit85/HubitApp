import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface DiagnosticResult {
  timestamp: string;
  environment: string;
  tests: {
    environmentVariables: any;
    resendApiTest: any;
    domainOptions: any;
    resendDomains?: any;
  };
  recommendations: string[];
}

export default function ResendDiagnostic() {
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostic = async () => {
    setIsRunning(true);
    setError(null);
    setDiagnosticResult(null);

    try {
      const response = await fetch('/api/test/resend-test');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setDiagnosticResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (success: boolean | undefined) => {
    if (success === undefined) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return success ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusColor = (success: boolean | undefined) => {
    if (success === undefined) return 'secondary';
    return success ? 'default' : 'destructive';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Diagnóstico de Resend API
          </CardTitle>
          <CardDescription>
            Herramienta de diagnóstico para verificar la configuración de Resend y identificar problemas de email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runDiagnostic} 
            disabled={isRunning}
            className="mb-4"
          >
            {isRunning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isRunning ? 'Ejecutando Diagnóstico...' : 'Ejecutar Diagnóstico'}
          </Button>

          {error && (
            <Alert className="mb-4">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Error:</strong> {error}
              </AlertDescription>
            </Alert>
          )}

          {diagnosticResult && (
            <div className="space-y-4">
              <div className="text-sm text-gray-500">
                Ejecutado: {new Date(diagnosticResult.timestamp).toLocaleString()}
              </div>

              {/* Environment Variables Test */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getStatusIcon(diagnosticResult.tests.environmentVariables.RESEND_API_KEY.configured)}
                    Variables de Entorno
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>RESEND_API_KEY</span>
                    <Badge variant={getStatusColor(diagnosticResult.tests.environmentVariables.RESEND_API_KEY.configured)}>
                      {diagnosticResult.tests.environmentVariables.RESEND_API_KEY.configured ? 'Configurada' : 'No Configurada'}
                    </Badge>
                  </div>
                  
                  {diagnosticResult.tests.environmentVariables.RESEND_API_KEY.configured && (
                    <div className="text-sm text-gray-600">
                      <div>Longitud: {diagnosticResult.tests.environmentVariables.RESEND_API_KEY.length} caracteres</div>
                      <div>Formato válido: {diagnosticResult.tests.environmentVariables.RESEND_API_KEY.startsWithRe ? '✅' : '❌'}</div>
                      <div>Preview: {diagnosticResult.tests.environmentVariables.RESEND_API_KEY.preview}</div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span>NEXT_PUBLIC_SITE_URL</span>
                    <Badge variant={diagnosticResult.tests.environmentVariables.NEXT_PUBLIC_SITE_URL ? 'default' : 'secondary'}>
                      {diagnosticResult.tests.environmentVariables.NEXT_PUBLIC_SITE_URL || 'No Configurada'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>EMAIL_FROM_DOMAIN</span>
                    <Badge variant={diagnosticResult.tests.environmentVariables.EMAIL_FROM_DOMAIN ? 'default' : 'secondary'}>
                      {diagnosticResult.tests.environmentVariables.EMAIL_FROM_DOMAIN || 'No Configurada'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Resend API Test */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getStatusIcon(diagnosticResult.tests.resendApiTest?.success)}
                    Test de Conectividad Resend API
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {diagnosticResult.tests.resendApiTest ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Estado</span>
                        <Badge variant={getStatusColor(diagnosticResult.tests.resendApiTest.success)}>
                          {diagnosticResult.tests.resendApiTest.success ? 'Éxito' : 'Error'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>Código HTTP</span>
                        <Badge variant="outline">
                          {diagnosticResult.tests.resendApiTest.status} {diagnosticResult.tests.resendApiTest.statusText}
                        </Badge>
                      </div>

                      {diagnosticResult.tests.resendApiTest.response && (
                        <div className="mt-2">
                          <details className="cursor-pointer">
                            <summary className="text-sm font-medium">Ver Respuesta Completa</summary>
                            <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                              {JSON.stringify(diagnosticResult.tests.resendApiTest.response, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}

                      {diagnosticResult.tests.resendApiTest.error && (
                        <Alert>
                          <AlertDescription>
                            <strong>Error:</strong> {diagnosticResult.tests.resendApiTest.error}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-500">No se ejecutó el test</div>
                  )}
                </CardContent>
              </Card>

              {/* Domain Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Opciones de Dominio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Resend Default</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">{diagnosticResult.tests.domainOptions.resendDefault}</code>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Softgen Domain</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">{diagnosticResult.tests.domainOptions.softgenDomain}</code>
                  </div>
                  
                  {diagnosticResult.tests.domainOptions.customDomain && (
                    <div className="flex items-center justify-between">
                      <span>Custom Domain</span>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">{diagnosticResult.tests.domainOptions.customDomain}</code>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Resend Domains */}
              {diagnosticResult.tests.resendDomains && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getStatusIcon(diagnosticResult.tests.resendDomains.success)}
                      Dominios Configurados en Resend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {diagnosticResult.tests.resendDomains.success ? (
                      <div>
                        {diagnosticResult.tests.resendDomains.domains?.length > 0 ? (
                          <div className="space-y-2">
                            {diagnosticResult.tests.resendDomains.domains.map((domain: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-2 border rounded">
                                <span>{domain.name || domain.domain}</span>
                                <Badge variant={domain.status === 'verified' ? 'default' : 'secondary'}>
                                  {domain.status || 'Unknown'}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-500">No hay dominios configurados</div>
                        )}
                      </div>
                    ) : (
                      <Alert>
                        <AlertDescription>
                          Error al obtener dominios: {diagnosticResult.tests.resendDomains.error}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Recommendations */}
              {diagnosticResult.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      Recomendaciones
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {diagnosticResult.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-yellow-500">⚠️</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
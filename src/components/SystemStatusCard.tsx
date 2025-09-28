import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertTriangle, Loader2, Database, Settings, RefreshCw, ExternalLink } from "lucide-react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";

type Status = 'checking' | 'success' | 'warning' | 'error';

interface Check {
  id: string;
  name: string;
  status: Status;
  message?: string;
}

export default function SystemStatusCard() {
  const { isConnected } = useSupabaseAuth();
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [checks, setChecks] = useState<Check[]>([
    { id: 'supabase_connection', name: 'Conexión a Supabase', status: 'checking' },
    { id: 'auth_status', name: 'Servicio de Autenticación', status: 'checking' }
  ]);

  const performSystemChecks = async () => {
    setLoading(true);
    setChecks(prev => prev.map(c => ({ ...c, status: 'checking' })));

    // Simulating checks
    await new Promise(resolve => setTimeout(resolve, 1000));

    setChecks([
      {
        id: 'supabase_connection',
        name: 'Conexión a Supabase',
        status: isConnected ? 'success' : 'error',
        message: isConnected ? 'Conectado correctamente' : 'Fallo en la conexión'
      },
      {
        id: 'auth_status',
        name: 'Servicio de Autenticación',
        status: isConnected ? 'success' : 'error',
        message: isConnected ? 'Operativo' : 'No disponible'
      }
    ]);

    setLastChecked(new Date());
    setLoading(false);
  };
  
  useEffect(() => {
    performSystemChecks();
  }, [isConnected]);

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case 'checking': return <Loader2 className="h-4 w-4 animate-spin text-neutral-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: Status) => {
    switch (status) {
      case 'checking': return <Badge variant="outline">Verificando...</Badge>;
      case 'success': return <Badge className="bg-emerald-100 text-emerald-800">Operativo</Badge>;
      case 'warning': return <Badge variant="destructive" className="bg-amber-100 text-amber-800">Aviso</Badge>;
      case 'error': return <Badge variant="destructive">Error</Badge>;
    }
  };
  
  const overallStatus: Status = checks.some(c => c.status === 'error') ? 'error' :
                                checks.some(c => c.status === 'warning') ? 'warning' :
                                checks.some(c => c.status === 'checking') ? 'checking' : 'success';


  return (
    <Card className="w-full bg-gradient-to-br from-white to-neutral-50 border-neutral-200/60 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
              overallStatus === 'success' ? 'bg-emerald-500' :
              overallStatus === 'warning' ? 'bg-amber-500' :
              overallStatus === 'error' ? 'bg-red-500' : 'bg-neutral-500'
            }`}>
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                Estado del Sistema
                {getStatusIcon(overallStatus)}
              </CardTitle>
              <p className="text-sm text-neutral-600">
                Verificación de componentes principales
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={performSystemChecks}
              disabled={loading}
              className="text-neutral-600 hover:text-neutral-900"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {checks.map((check) => (
            <div
              key={check.id}
              className="flex items-center justify-between p-3 rounded-lg bg-neutral-50/50 hover:bg-neutral-100/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(check.status)}
                <div>
                  <p className="font-medium text-sm text-neutral-900">
                    {check.name}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {check.message}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {getStatusBadge(check.status)}
              </div>
            </div>
          ))}
        </div>

        {lastChecked && (
          <div className="text-xs text-neutral-500 text-center pt-2 border-t border-neutral-200">
            Última verificación: {lastChecked.toLocaleTimeString('es-ES')}
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 pt-4 border-t border-neutral-200">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            asChild
          >
            <a 
              href="https://supabase.com/dashboard/project/djkrzbmgzfwagmripozi" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Settings className="h-3 w-3" />
              Supabase Dashboard
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

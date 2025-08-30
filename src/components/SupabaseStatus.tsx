
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Database, User, Settings, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function SupabaseStatus() {
  const { user, profile, session, loading } = useSupabaseAuth();
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error' | 'not_configured'>('checking');
  const [dbStatus, setDbStatus] = useState<'checking' | 'ready' | 'error' | 'not_configured'>('checking');

  // Check if Supabase is configured
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
                              process.env.NEXT_PUBLIC_SUPABASE_URL !== "" &&
                              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "";

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setConnectionStatus('not_configured');
      setDbStatus('not_configured');
      return;
    }
    
    checkConnection();
    checkDatabaseTables();
  }, [isSupabaseConfigured]);

  const checkConnection = async () => {
    if (!isSupabaseConfigured) {
      setConnectionStatus('not_configured');
      return;
    }

    try {
      // Simple health check
      const { error } = await supabase.from('profiles').select('count').limit(1);
      if (error) {
        console.warn("Supabase connection check failed:", error.message);
        setConnectionStatus('error');
      } else {
        setConnectionStatus('connected');
      }
    } catch (error) {
      console.warn("Supabase connection check exception:", error);
      setConnectionStatus('error');
    }
  };

  const checkDatabaseTables = async () => {
    if (!isSupabaseConfigured) {
      setDbStatus('not_configured');
      return;
    }

    try {
      // Check if main tables exist by testing specific queries with better error handling
      const checks = await Promise.allSettled([
        supabase.from('profiles').select('count').limit(1),
        supabase.from('properties').select('count').limit(1),
        supabase.from('budget_requests').select('count').limit(1)
      ]);
      
      const hasFailures = checks.some(result => result.status === 'rejected' || 
        (result.status === 'fulfilled' && result.value.error));
      
      setDbStatus(hasFailures ? 'error' : 'ready');
    } catch (error) {
      console.warn("Database tables check exception:", error);
      setDbStatus('error');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'checking': return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'connected': 
      case 'ready': return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'not_configured': return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      default: return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string, label: string) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
    
    if (status === 'connected' || status === 'ready') {
      variant = 'default';
    } else if (status === 'error') {
      variant = 'destructive';
    } else if (status === 'not_configured') {
      variant = 'outline';
    }
    
    return (
      <Badge variant={variant} className="flex items-center gap-2">
        {getStatusIcon(status)}
        {label}
      </Badge>
    );
  };

  // Show configuration notice if Supabase is not set up
  if (!isSupabaseConfigured) {
    return (
      <Card className="w-full max-w-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/60 shadow-lg shadow-amber-900/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
            <div>
              <CardTitle className="text-xl font-semibold text-amber-900">Supabase No Configurado</CardTitle>
              <CardDescription className="text-amber-700">Se requiere configuración para funcionalidad completa</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-amber-100/50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-800 mb-3">
              Para habilitar la funcionalidad completa de HuBiT, necesitas conectar Supabase:
            </p>
            <ul className="text-xs text-amber-700 space-y-1 ml-4 list-disc">
              <li>Haz clic en el botón "Supabase" en la barra de navegación de Softgen</li>
              <li>Sigue las instrucciones para conectar tu proyecto</li>
              <li>Las variables de entorno se configurarán automáticamente</li>
            </ul>
          </div>
          <div className="text-center">
            <p className="text-xs text-amber-600">
              Mientras tanto, la aplicación funciona con datos locales simulados
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl bg-gradient-to-br from-white to-neutral-50 border-neutral-200/60 shadow-lg shadow-neutral-900/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Database className="h-6 w-6 text-emerald-600" />
          <div>
            <CardTitle className="text-xl font-semibold">Estado de Supabase</CardTitle>
            <CardDescription>Conexión y configuración de la base de datos</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className="space-y-3">
          <h3 className="font-medium text-neutral-900 flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Conexión
          </h3>
          <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50/50">
            <span className="text-sm text-neutral-700">Estado de la conexión a Supabase</span>
            {getStatusBadge(connectionStatus, connectionStatus === 'connected' ? 'Conectado' : 
                           connectionStatus === 'error' ? 'Error' : 'Verificando...')}
          </div>
        </div>

        {/* Database Schema */}
        <div className="space-y-3">
          <h3 className="font-medium text-neutral-900 flex items-center gap-2">
            <Database className="h-4 w-4" />
            Esquema de Base de Datos
          </h3>
          <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50/50">
            <span className="text-sm text-neutral-700">Tablas principales configuradas</span>
            {getStatusBadge(dbStatus, dbStatus === 'ready' ? 'Listo' : 
                           dbStatus === 'error' ? 'Error' : 'Verificando...')}
          </div>
        </div>

        {/* Authentication Status */}
        <div className="space-y-3">
          <h3 className="font-medium text-neutral-900 flex items-center gap-2">
            <User className="h-4 w-4" />
            Autenticación
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50/50">
              <span className="text-sm text-neutral-700">Usuario autenticado</span>
              {loading ? (
                <Badge variant="secondary" className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cargando...
                </Badge>
              ) : user ? (
                <Badge variant="default" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  Conectado
                </Badge>
              ) : (
                <Badge variant="outline" className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-gray-400" />
                  No autenticado
                </Badge>
              )}
            </div>
            
            {user && profile && (
              <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200/60">
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                  <p><span className="font-medium">Nombre:</span> {profile.full_name || 'Sin especificar'}</p>
                  <p><span className="font-medium">Tipo de usuario:</span> {profile.user_type}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Configuration Info */}
        <div className="space-y-3">
          <h3 className="font-medium text-neutral-900">Configuración</h3>
          <div className="text-xs text-neutral-600 space-y-1 bg-neutral-50/50 p-3 rounded-lg font-mono">
            <p><span className="font-semibold">URL:</span> {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
            <p><span className="font-semibold">Clave:</span> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              checkConnection();
              checkDatabaseTables();
            }}
            className="bg-transparent hover:bg-neutral-50"
          >
            Verificar conexión
          </Button>
          {!user && (
            <Button 
              size="sm"
              onClick={() => window.location.href = '/auth/login'}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Iniciar sesión
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
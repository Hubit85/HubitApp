import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Database, 
  Mail, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  ExternalLink, 
  RefreshCw,
  AlertTriangle,
  Settings,
  Code,
  Send
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import SupabaseEmailService from "@/services/SupabaseEmailService";
import ResendKeyTester from "./ResendKeyTester";

interface SystemCheck {
  id: string;
  name: string;
  description: string;
  status: 'checking' | 'success' | 'warning' | 'error';
  message?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export default function SystemStatusCard() {
  const { user, databaseConnected } = useSupabaseAuth();
  const [checks, setChecks] = useState<SystemCheck[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    performSystemChecks();
  }, [user, databaseConnected]);

  const performSystemChecks = async () => {
    setLoading(true);
    
    const newChecks: SystemCheck[] = [
      {
        id: 'supabase_connection',
        name: 'Conexión Supabase',
        description: 'Conectividad con la base de datos',
        status: 'checking'
      },
      {
        id: 'database_schema',
        name: 'Esquema de Base de Datos',
        description: 'Tablas principales y configuración',
        status: 'checking'
      },
      {
        id: 'authentication',
        name: 'Sistema de Autenticación',
        description: 'Configuración de Auth y RLS',
        status: 'checking'
      },
      {
        id: 'email_templates',
        name: 'Plantillas de Email',
        description: 'Templates personalizadas para Auth',
        status: 'checking'
      }
    ];

    setChecks(newChecks);

    try {
      // Check Supabase connection
      const connectionResult = await checkSupabaseConnection();
      updateCheckStatus('supabase_connection', connectionResult);

      // Check database schema
      const schemaResult = await checkDatabaseSchema();
      updateCheckStatus('database_schema', schemaResult);

      // Check authentication
      const authResult = await checkAuthentication();
      updateCheckStatus('authentication', authResult);

      // Check email templates
      const emailResult = await checkEmailTemplates();
      updateCheckStatus('email_templates', emailResult);

    } catch (error) {
      console.error("System checks failed:", error);
    } finally {
      setLoading(false);
      setLastChecked(new Date());
    }
  };

  const updateCheckStatus = (checkId: string, result: Partial<SystemCheck>) => {
    setChecks(prev => prev.map(check => 
      check.id === checkId ? { ...check, ...result } : check
    ));
  };

  const checkSupabaseConnection = async (): Promise<Partial<SystemCheck>> => {
    try {
      const { error } = await supabase.from('profiles').select('count').limit(1);
      
      if (error) {
        return {
          status: 'error',
          message: 'Error de conexión: ' + error.message,
          action: {
            label: 'Abrir Supabase',
            href: 'https://supabase.com/dashboard/project/djkrzbmgzfwagmripozi'
          }
        };
      }

      return {
        status: 'success',
        message: 'Conexión activa y estable'
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Error de conectividad',
        action: {
          label: 'Revisar Config',
          href: 'https://supabase.com/dashboard/project/djkrzbmgzfwagmripozi'
        }
      };
    }
  };

  const checkDatabaseSchema = async (): Promise<Partial<SystemCheck>> => {
    try {
      const tables = ['profiles', 'properties', 'budget_requests', 'service_categories'];
      const checks = await Promise.all(
        tables.map(table => supabase.from(table as any).select('count').limit(1))
      );

      const hasErrors = checks.some(check => check.error !== null);
      
      if (hasErrors) {
        return {
          status: 'warning',
          message: 'Algunas tablas no están configuradas',
          action: {
            label: 'Ver Setup SQL',
            href: '/help'
          }
        };
      }

      return {
        status: 'success',
        message: `${tables.length} tablas principales configuradas`
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Error verificando esquema',
        action: {
          label: 'Documentación',
          href: '/help'
        }
      };
    }
  };

  const checkAuthentication = async (): Promise<Partial<SystemCheck>> => {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser();
      
      if (error && !user) {
        return {
          status: 'warning',
          message: 'No autenticado - funcionalidad limitada',
          action: {
            label: 'Iniciar Sesión',
            href: '/auth/login'
          }
        };
      }

      if (user && databaseConnected) {
        return {
          status: 'success',
          message: 'Usuario autenticado con base de datos'
        };
      }

      return {
        status: 'warning',
        message: user ? 'Usuario autenticado (sin DB)' : 'No autenticado',
        action: {
          label: user ? 'Ver Perfil' : 'Iniciar Sesión',
          href: user ? '/dashboard' : '/auth/login'
        }
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Error en sistema de autenticación'
      };
    }
  };

  const checkEmailTemplates = async (): Promise<Partial<SystemCheck>> => {
    try {
      const result = await SupabaseEmailService.testEmailConfiguration();
      
      if (result.success) {
        return {
          status: 'success',
          message: `${(result as any).templates_count || 4} plantillas disponibles`,
          action: {
            label: 'Gestionar',
            href: '/email-templates'
          }
        };
      } else {
        return {
          status: 'warning',
          message: 'Templates por defecto (no personalizadas)',
          action: {
            label: 'Configurar',
            href: '/email-templates'
          }
        };
      }
    } catch (error) {
      return {
        status: 'warning',
        message: 'Templates no configuradas',
        action: {
          label: 'Configurar',
          href: '/email-templates'
        }
      };
    }
  };

  const getStatusIcon = (status: SystemCheck['status']) => {
    switch (status) {
      case 'checking':
        return <Loader2 className="h-4 w-4 animate-spin text-neutral-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <XCircle className="h-4 w-4 text-neutral-400" />;
    }
  };

  const getStatusBadge = (status: SystemCheck['status']) => {
    const variants = {
      checking: { variant: "secondary" as const, label: "Verificando..." },
      success: { variant: "default" as const, label: "OK" },
      warning: { variant: "secondary" as const, label: "Atención" },
      error: { variant: "destructive" as const, label: "Error" }
    };

    const config = variants[status] || variants.error;
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  const getOverallStatus = () => {
    if (checks.some(check => check.status === 'checking')) return 'checking';
    if (checks.some(check => check.status === 'error')) return 'error';
    if (checks.some(check => check.status === 'warning')) return 'warning';
    return 'success';
  };

  const overallStatus = getOverallStatus();

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
        {/* System Checks */}
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
                    {check.message || check.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {getStatusBadge(check.status)}
                {check.action && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    asChild={!!check.action.href}
                    onClick={check.action.onClick}
                  >
                    {check.action.href ? (
                      <a href={check.action.href} target={check.action.href.startsWith('http') ? '_blank' : undefined}>
                        {check.action.label}
                        {check.action.href.startsWith('http') && <ExternalLink className="h-3 w-3 ml-1" />}
                      </a>
                    ) : (
                      <span>{check.action.label}</span>
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Last checked info */}
        {lastChecked && (
          <div className="text-xs text-neutral-500 text-center pt-2 border-t border-neutral-200">
            Última verificación: {lastChecked.toLocaleTimeString('es-ES')}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-200">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            asChild
          >
            <a 
              href="https://supabase.com/dashboard/project/djkrzbmgzfwagmripozi" 
              target="_blank"
              className="flex items-center gap-2"
            >
              <Settings className="h-3 w-3" />
              Supabase Dashboard
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            asChild
          >
            <a href="/email-templates" className="flex items-center gap-2">
              <Mail className="h-3 w-3" />
              Email Templates
            </a>
          </Button>
        </div>

        {/* Resend API Diagnostics */}
        <div className="pt-4 border-t border-neutral-200">
          <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
            <Send className="h-4 w-4" />
            Diagnóstico de Resend API
          </h4>
          <ResendKeyTester />
        </div>
      </CardContent>
    </Card>
  );
}
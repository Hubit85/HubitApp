import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Database, Users, Mail, Zap } from "lucide-react";

interface TableStatus {
  name: string;
  exists: boolean;
  description: string;
  category: 'core' | 'business' | 'messaging' | 'system';
}

export default function DatabaseSetupNotice() {
  const [databaseStatus, setDatabaseStatus] = useState<{
    isConnected: boolean;
    isConfigured: boolean;
    tables: TableStatus[];
    loading: boolean;
    error: string | null;
  }>({
    isConnected: false,
    isConfigured: false,
    tables: [],
    loading: true,
    error: null
  });

  const expectedTables: Omit<TableStatus, 'exists'>[] = [
    // Core tables
    { name: 'profiles', description: 'Perfiles de usuario', category: 'core' },
    { name: 'properties', description: 'Propiedades gestionadas', category: 'core' },
    { name: 'service_categories', description: 'Categorías de servicios', category: 'core' },
    
    // Business logic tables
    { name: 'budget_requests', description: 'Solicitudes de presupuesto', category: 'business' },
    { name: 'service_providers', description: 'Proveedores de servicios', category: 'business' },
    { name: 'quotes', description: 'Cotizaciones', category: 'business' },
    { name: 'contracts', description: 'Contratos', category: 'business' },
    { name: 'work_sessions', description: 'Sesiones de trabajo', category: 'business' },
    { name: 'invoices', description: 'Facturas', category: 'business' },
    { name: 'payments', description: 'Pagos', category: 'business' },
    { name: 'ratings', description: 'Calificaciones y reseñas', category: 'business' },
    { name: 'emergency_requests', description: 'Solicitudes de emergencia', category: 'business' },
    
    // Messaging and communication
    { name: 'conversations', description: 'Conversaciones', category: 'messaging' },
    { name: 'messages', description: 'Mensajes', category: 'messaging' },
    { name: 'notifications', description: 'Notificaciones', category: 'messaging' },
    
    // Document management
    { name: 'documents', description: 'Gestión de documentos', category: 'system' }
  ];

  const checkDatabaseStatus = async () => {
    try {
      setDatabaseStatus(prev => ({ ...prev, loading: true, error: null }));
      
      // Check basic connectivity
      const { error: connectionError } = await supabase.from('profiles').select('count').limit(1);
      
      if (connectionError) {
        setDatabaseStatus({
          isConnected: false,
          isConfigured: false,
          tables: expectedTables.map(table => ({ ...table, exists: false })),
          loading: false,
          error: connectionError.message
        });
        return;
      }

      // Check each table
      const tableChecks = await Promise.allSettled(
        expectedTables.map(async (table) => {
          const { error } = await supabase.from(table.name as any).select('count').limit(1);
          return { ...table, exists: !error };
        })
      );

      const tables = tableChecks.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        }
        return { ...expectedTables[index], exists: false };
      });

      const configuredCount = tables.filter(t => t.exists).length;
      const isConfigured = configuredCount >= expectedTables.length * 0.8; // 80% of tables must exist

      setDatabaseStatus({
        isConnected: true,
        isConfigured,
        tables,
        loading: false,
        error: null
      });
      
    } catch (error) {
      console.error('Database check failed:', error);
      setDatabaseStatus({
        isConnected: false,
        isConfigured: false,
        tables: expectedTables.map(table => ({ ...table, exists: false })),
        loading: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const getCategoryIcon = (category: TableStatus['category']) => {
    switch (category) {
      case 'core': return <Users className="h-4 w-4" />;
      case 'business': return <Database className="h-4 w-4" />;
      case 'messaging': return <Mail className="h-4 w-4" />;
      case 'system': return <Zap className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: TableStatus['category']) => {
    switch (category) {
      case 'core': return 'bg-blue-100 text-blue-800';
      case 'business': return 'bg-green-100 text-green-800';
      case 'messaging': return 'bg-purple-100 text-purple-800';
      case 'system': return 'bg-orange-100 text-orange-800';
    }
  };

  if (databaseStatus.loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Verificando estado de la base de datos...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!databaseStatus.isConnected) {
    return (
      <Card className="w-full max-w-4xl mx-auto border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-6 w-6" />
            <span>Error de Conexión a Supabase</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {databaseStatus.error}
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <p>Por favor verifica:</p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Las credenciales de Supabase en el archivo .env.local</li>
              <li>Que el proyecto de Supabase esté activo</li>
              <li>La conectividad a internet</li>
            </ul>
            
            <Button onClick={checkDatabaseStatus} variant="outline">
              Reintentar Conexión
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!databaseStatus.isConfigured) {
    const configuredCount = databaseStatus.tables.filter(t => t.exists).length;
    const totalCount = databaseStatus.tables.length;
    const progressPercentage = Math.round((configuredCount / totalCount) * 100);

    return (
      <Card className="w-full max-w-4xl mx-auto border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-600">
              <Database className="h-6 w-6" />
              <span>Configuración de Base de Datos Requerida</span>
            </div>
            <Badge variant="secondary">
              {configuredCount}/{totalCount} tablas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription>
              <strong>Progreso:</strong> {progressPercentage}% completado. 
              {configuredCount === 0 
                ? " Necesitas ejecutar el script de configuración inicial."
                : ` ${totalCount - configuredCount} tablas pendientes por configurar.`
              }
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="font-semibold">Estado de las tablas:</h3>
            
            {['core', 'business', 'messaging', 'system'].map(category => {
              const categoryTables = databaseStatus.tables.filter(t => t.category === category);
              const categoryConfigured = categoryTables.filter(t => t.exists).length;
              
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(category as TableStatus['category'])}
                    <h4 className="font-medium capitalize">
                      {category === 'core' && 'Tablas Principales'}
                      {category === 'business' && 'Lógica de Negocio'}
                      {category === 'messaging' && 'Comunicación'}
                      {category === 'system' && 'Sistema'}
                    </h4>
                    <Badge className={getCategoryColor(category as TableStatus['category'])}>
                      {categoryConfigured}/{categoryTables.length}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 ml-6">
                    {categoryTables.map(table => (
                      <div key={table.name} className="flex items-center space-x-2">
                        {table.exists ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm ${table.exists ? 'text-green-700' : 'text-red-700'}`}>
                          {table.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">📋 Pasos para configurar:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Abre el SQL Editor en tu dashboard de Supabase</li>
              <li>Ejecuta el archivo: <code className="bg-gray-100 px-1 rounded">docs/complete-database-setup.sql</code></li>
              <li>Ejecuta las políticas RLS: <code className="bg-gray-100 px-1 rounded">docs/basic-rls-policies.sql</code></li>
              <li>Configura las plantillas de email siguiendo: <code className="bg-gray-100 px-1 rounded">docs/supabase-email-templates.md</code></li>
              <li>Haz clic en &quot;Verificar Configuración&quot; cuando termines</li>
            </ol>
          </div>

          <div className="flex space-x-2">
            <Button onClick={checkDatabaseStatus} variant="outline">
              🔄 Verificar Configuración
            </Button>
            <Button 
              onClick={() => window.open('https://supabase.com/dashboard', '_blank')} 
              variant="default"
            >
              🚀 Abrir Supabase Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-green-600">
          <CheckCircle className="h-6 w-6" />
          <span>¡Base de Datos Configurada Correctamente!</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <strong>✅ Sistema completamente funcional:</strong> Todas las {databaseStatus.tables.length} tablas están configuradas y listas. 
            HuBiT puede manejar propiedades, presupuestos, contratos, pagos, comunicaciones y más.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{databaseStatus.tables.filter(t => t.category === 'core').length}</div>
            <div className="text-sm text-gray-600">Tablas Principales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{databaseStatus.tables.filter(t => t.category === 'business').length}</div>
            <div className="text-sm text-gray-600">Lógica de Negocio</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{databaseStatus.tables.filter(t => t.category === 'messaging').length}</div>
            <div className="text-sm text-gray-600">Comunicación</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{databaseStatus.tables.filter(t => t.category === 'system').length}</div>
            <div className="text-sm text-gray-600">Sistema</div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button onClick={checkDatabaseStatus} variant="outline" size="sm">
            🔄 Verificar Estado
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

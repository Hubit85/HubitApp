import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Database, Users, Building, Eye, RefreshCw, 
  CheckCircle, AlertCircle, Search, FileText
} from "lucide-react";

export function SupabaseDataViewer() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAllData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const results = await Promise.allSettled([
        // 1. Tabla property_administrators
        supabase
          .from('property_administrators')
          .select('*')
          .order('created_at', { ascending: false }),
        
        // 2. Tabla user_roles con rol property_administrator
        supabase
          .from('user_roles')
          .select(`
            *,
            profiles:user_id (
              full_name,
              email,
              phone,
              created_at
            )
          `)
          .eq('role_type', 'property_administrator'),
        
        // 3. Todas las tablas profiles
        supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false }),
        
        // 4. Tabla administrator_requests
        supabase
          .from('administrator_requests')
          .select('*')
          .order('created_at', { ascending: false }),
        
        // 5. Tabla managed_communities
        supabase
          .from('managed_communities')
          .select('*')
          .order('created_at', { ascending: false }),
        
        // 6. Tabla community_member_administrators
        supabase
          .from('community_member_administrators')
          .select('*')
          .order('created_at', { ascending: false }),
        
        // 7. Todos los user_roles
        supabase
          .from('user_roles')
          .select(`
            *,
            profiles:user_id (full_name, email)
          `)
          .order('created_at', { ascending: false })
      ]);

      setData({
        property_administrators: results[0].status === 'fulfilled' ? results[0].value.data : [],
        admin_user_roles: results[1].status === 'fulfilled' ? results[1].value.data : [],
        profiles: results[2].status === 'fulfilled' ? results[2].value.data : [],
        administrator_requests: results[3].status === 'fulfilled' ? results[3].value.data : [],
        managed_communities: results[4].status === 'fulfilled' ? results[4].value.data : [],
        community_member_administrators: results[5].status === 'fulfilled' ? results[5].value.data : [],
        all_user_roles: results[6].status === 'fulfilled' ? results[6].value.data : []
      });

      // Log any errors
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Query ${index} failed:`, result.reason);
        }
      });

    } catch (err) {
      setError('Error al cargar los datos de Supabase');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const formatData = (obj: any) => {
    if (!obj) return 'null';
    if (typeof obj === 'string') return obj;
    return JSON.stringify(obj, null, 2);
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Database className="h-6 w-6" />
            Diagnóstico de Datos - Supabase
          </CardTitle>
          <CardDescription className="text-blue-700">
            Información completa sobre dónde están los administradores de fincas y otros roles en la base de datos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button onClick={loadAllData} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Cargando...' : 'Actualizar Datos'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* 1. Property Administrators Table */}
      <Card className="border-green-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Building className="h-5 w-5" />
            Tabla: property_administrators ({data.property_administrators?.length || 0} registros)
          </CardTitle>
          <CardDescription>
            Tabla específica de administradores de fincas con datos de empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.property_administrators?.length === 0 ? (
            <p className="text-gray-600">No hay registros en esta tabla</p>
          ) : (
            <div className="space-y-3">
              {data.property_administrators?.map((admin: any, index: number) => (
                <Card key={admin.id || index} className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p><strong>ID:</strong> {admin.id}</p>
                        <p><strong>User ID:</strong> {admin.user_id}</p>
                        <p><strong>Nombre Empresa:</strong> {admin.company_name}</p>
                        <p><strong>CIF:</strong> {admin.company_cif}</p>
                        <p><strong>Email Contacto:</strong> {admin.contact_email}</p>
                        <p><strong>Teléfono:</strong> {admin.contact_phone}</p>
                      </div>
                      <div>
                        <p><strong>Número Licencia:</strong> {admin.license_number || 'N/A'}</p>
                        <p><strong>Creado:</strong> {admin.created_at ? new Date(admin.created_at).toLocaleString() : 'N/A'}</p>
                        <p><strong>Actualizado:</strong> {admin.updated_at ? new Date(admin.updated_at).toLocaleString() : 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. User Roles - Property Administrators */}
      <Card className="border-purple-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Users className="h-5 w-5" />
            Tabla: user_roles (property_administrator) ({data.admin_user_roles?.length || 0} registros)
          </CardTitle>
          <CardDescription>
            Roles de usuario tipo &quot;property_administrator&quot; con datos del perfil
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.admin_user_roles?.length === 0 ? (
            <p className="text-gray-600">No hay roles de property_administrator</p>
          ) : (
            <div className="space-y-3">
              {data.admin_user_roles?.map((role: any) => (
                <Card key={role.id} className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p><strong>Role ID:</strong> {role.id}</p>
                        <p><strong>User ID:</strong> {role.user_id}</p>
                        <p><strong>Tipo Rol:</strong> {role.role_type}</p>
                        <p><strong>Verificado:</strong> {role.is_verified ? '✅ Sí' : '❌ No'}</p>
                        <p><strong>Activo:</strong> {role.is_active ? '✅ Sí' : '❌ No'}</p>
                      </div>
                      <div>
                        <p><strong>Perfil - Nombre:</strong> {role.profiles?.full_name || 'N/A'}</p>
                        <p><strong>Perfil - Email:</strong> {role.profiles?.email || 'N/A'}</p>
                        <p><strong>Perfil - Teléfono:</strong> {role.profiles?.phone || 'N/A'}</p>
                        <p><strong>Datos Específicos:</strong></p>
                        <pre className="text-xs bg-gray-100 p-2 rounded max-h-20 overflow-auto">
                          {formatData(role.role_specific_data)}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. All User Roles Summary */}
      <Card className="border-orange-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-900">
            <FileText className="h-5 w-5" />
            Resumen: Todos los user_roles ({data.all_user_roles?.length || 0} registros)
          </CardTitle>
          <CardDescription>
            Resumen de todos los tipos de roles en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.all_user_roles?.length === 0 ? (
            <p className="text-gray-600">No hay roles en el sistema</p>
          ) : (
            <div className="space-y-4">
              {/* Estadísticas por tipo de rol */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['particular', 'community_member', 'service_provider', 'property_administrator'].map(roleType => {
                  const count = data.all_user_roles?.filter((r: any) => r.role_type === roleType).length || 0;
                  const verified = data.all_user_roles?.filter((r: any) => r.role_type === roleType && r.is_verified).length || 0;
                  return (
                    <Card key={roleType} className="bg-orange-50 border-orange-200">
                      <CardContent className="p-3 text-center">
                        <p className="font-semibold text-sm">{roleType}</p>
                        <p className="text-lg font-bold text-orange-900">{count}</p>
                        <p className="text-xs text-orange-700">({verified} verificados)</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Lista de roles de property_administrator */}
              <div className="space-y-2">
                <h4 className="font-semibold text-orange-900">Administradores de fincas encontrados:</h4>
                {data.all_user_roles?.filter((r: any) => r.role_type === 'property_administrator').map((role: any) => (
                  <div key={role.id} className="flex items-center gap-2 p-2 bg-orange-100 rounded">
                    <Badge variant={role.is_verified ? "default" : "secondary"}>
                      {role.is_verified ? '✅ Verificado' : '⏳ Pendiente'}
                    </Badge>
                    <span className="font-medium">{role.profiles?.full_name || 'Sin nombre'}</span>
                    <span className="text-sm text-gray-600">({role.profiles?.email || 'Sin email'})</span>
                    <span className="text-xs text-gray-500">ID: {role.id.substring(0, 8)}...</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. Profiles Table */}
      <Card className="border-indigo-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-900">
            <Users className="h-5 w-5" />
            Tabla: profiles ({data.profiles?.length || 0} registros)
          </CardTitle>
          <CardDescription>
            Perfiles de usuarios registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {data.profiles?.map((profile: any, index: number) => (
              <div key={profile.id} className="flex items-center gap-2 p-2 bg-indigo-50 rounded text-sm">
                <span className="font-medium">{profile.full_name || 'Sin nombre'}</span>
                <span className="text-gray-600">({profile.email})</span>
                <span className="text-xs text-gray-500">ID: {profile.id.substring(0, 8)}...</span>
                <Badge variant="outline" className="text-xs">
                  {profile.user_type || 'Sin tipo'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 5. Administrator Requests */}
      <Card className="border-cyan-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-900">
            <Search className="h-5 w-5" />
            Tabla: administrator_requests ({data.administrator_requests?.length || 0} registros)
          </CardTitle>
          <CardDescription>
            Solicitudes entre miembros de comunidad y administradores de fincas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.administrator_requests?.length === 0 ? (
            <p className="text-gray-600">No hay solicitudes de administradores</p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {data.administrator_requests?.map((request: any, index: number) => (
                <div key={request.id} className="p-3 bg-cyan-50 border-cyan-200 border rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Solicitud #{index + 1}</p>
                      <p className="text-sm">Estado: {request.status}</p>
                      <p className="text-xs text-gray-500">
                        De: {request.community_member_id?.substring(0, 8)}... 
                        → A: {request.property_administrator_id?.substring(0, 8)}...
                      </p>
                    </div>
                    <Badge variant={request.status === 'pending' ? 'default' : 'secondary'}>
                      {request.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary and Diagnostics */}
      <Card className="border-gray-300 bg-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Resumen del Diagnóstico
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-blue-800">
              <strong>Ubicación de los administradores de fincas:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• <strong>property_administrators</strong>: {data.property_administrators?.length || 0} registros con datos de empresa</li>
                <li>• <strong>user_roles</strong>: {data.admin_user_roles?.length || 0} roles verificados de tipo &quot;property_administrator&quot;</li>
                <li>• <strong>profiles</strong>: {data.profiles?.length || 0} perfiles de usuario con información básica</li>
                <li>• <strong>administrator_requests</strong>: {data.administrator_requests?.length || 0} solicitudes de gestión</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-100 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">✅ Datos Encontrados</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Property administrators: {data.property_administrators?.length || 0}</li>
                <li>• Admin user roles: {data.admin_user_roles?.length || 0}</li>
                <li>• Profiles totales: {data.profiles?.length || 0}</li>
                <li>• Solicitudes: {data.administrator_requests?.length || 0}</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-100 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Posibles Problemas</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Consultas con joins complejos fallan</li>
                <li>• Relaciones FK no están bien definidas</li>
                <li>• Validación de tipos demasiado estricta</li>
                <li>• Filtros excluyen datos válidos</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

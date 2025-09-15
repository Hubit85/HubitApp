
import React, { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Bell, Check, X, MessageSquare, User, Mail, Phone, 
  Building, AlertCircle, Loader2, CheckCircle, XCircle, Clock
} from "lucide-react";

interface NotificationCenterProps {
  userRole?: "property_administrator" | "community_member" | "service_provider" | "particular";
}

interface AdminRequest {
  id: string;
  community_member_id: string;
  property_administrator_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  request_message?: string;
  response_message?: string;
  requested_at: string;
  responded_at?: string;
  community_member?: {
    profiles?: {
      full_name: string;
      email: string;
      phone?: string;
    };
    role_specific_data?: any;
  };
}

export function NotificationCenter({ userRole = "particular" }: NotificationCenterProps) {
  const { user, activeRole, userRoles } = useSupabaseAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [adminRequests, setAdminRequests] = useState<AdminRequest[]>([]);
  const [managedIncidents, setManagedIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<AdminRequest | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [showResponseDialog, setShowResponseDialog] = useState(false);

  const isPropertyAdministrator = userRoles.some(role => 
    role.role_type === 'property_administrator' && role.is_verified
  );

  useEffect(() => {
    if (user && isPropertyAdministrator && activeRole) {
      loadAllAdministratorData();
    } else if (user) {
      loadGeneralNotifications();
    }
  }, [user, activeRole, isPropertyAdministrator]);

  const loadAllAdministratorData = async () => {
    if (!user || !activeRole) return;

    setLoading(true);
    setError("");

    try {
      await Promise.all([
        loadGeneralNotifications(),
        loadAdministratorRequests(),
        loadManagedIncidents()
      ]);
    } catch (err) {
      console.error('Error loading administrator data:', err);
      setError('Error al cargar los datos del administrador');
    } finally {
      setLoading(false);
    }
  };

  const loadManagedIncidents = async () => {
    if (!activeRole || activeRole.role_type !== 'property_administrator') return;

    try {
      console.log('🔍 Loading managed incidents for administrator...');

      // First, get managed community members
      const { data: managedMembers, error: managedError } = await supabase
        .from('managed_communities')
        .select('community_member_id, community_member:user_roles!managed_communities_community_member_id_fkey(user_id)')
        .eq('property_administrator_id', activeRole.id)
        .eq('relationship_status', 'active');

      if (managedError) {
        console.warn('Error loading managed members:', managedError);
        return;
      }

      if (!managedMembers || managedMembers.length === 0) {
        console.log('No managed members found');
        setManagedIncidents([]);
        return;
      }

      // Extract user IDs from managed members
      const managedUserIds = managedMembers
        .map(member => {
          const communityMember = member.community_member as any;
          return communityMember?.user_id;
        })
        .filter((id): id is string => !!id && typeof id === 'string');

      if (managedUserIds.length === 0) {
        console.log('No valid user IDs found');
        setManagedIncidents([]);
        return;
      }

      console.log(`📋 Loading incidents for ${managedUserIds.length} managed users`);

      // Get incidents from managed users
      const { data: incidents, error: incidentsError } = await supabase
        .from('incident_reports')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email,
            phone
          )
        `)
        .in('user_id', managedUserIds)
        .order('reported_at', { ascending: false })
        .limit(20);

      if (incidentsError) {
        console.error('Error loading incidents:', incidentsError);
        return;
      }

      console.log(`✅ Loaded ${incidents?.length || 0} incidents`);
      setManagedIncidents(incidents || []);

      // Auto-assign administrator to unassigned incidents
      try {
        const unassignedIncidents = incidents?.filter(incident => 
          !incident.managing_administrator_id
        ) || [];

        if (unassignedIncidents.length > 0) {
          console.log(`🔄 Auto-assigning ${unassignedIncidents.length} incidents to administrator`);
          
          const incidentIds = unassignedIncidents.map(i => i.id);
          
          await supabase
            .from('incident_reports')
            .update({
              managing_administrator_id: activeRole.id,
              updated_at: new Date().toISOString()
            })
            .in('id', incidentIds);

          console.log('✅ Auto-assignment completed');
        }
      } catch (assignError) {
        console.warn('Could not auto-assign incidents:', assignError);
      }

    } catch (err) {
      console.error('Error loading managed incidents:', err);
    }
  };

  const loadGeneralNotifications = async () => {
    if (!user) return;

    try {
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.warn('Error loading general notifications:', error);
      } else {
        setNotifications(notifications || []);
      }
    } catch (err) {
      console.error('Error loading general notifications:', err);
    }
  };

  const loadAdministratorRequests = async () => {
    if (!activeRole || activeRole.role_type !== 'property_administrator') return;

    try {
      console.log('🔍 NOTIFICATIONS: Loading administrator requests for role:', activeRole.id);

      // CORRECTED: Use the AdministratorRequestService for consistent data loading
      const { AdministratorRequestService } = await import('@/services/AdministratorRequestService');
      
      const result = await AdministratorRequestService.getReceivedRequests(activeRole.id);
      
      if (result.success) {
        console.log(`✅ NOTIFICATIONS: Found ${result.requests.length} administrator requests`);
        setAdminRequests(result.requests as AdminRequest[]);
      } else {
        console.error('❌ NOTIFICATIONS: Error loading administrator requests:', result.message);
        setAdminRequests([]);
      }

    } catch (err) {
      console.error('❌ NOTIFICATIONS: Exception loading administrator requests:', err);
      setAdminRequests([]);
    }
  };

  const handleRespondToRequest = async (response: 'accepted' | 'rejected') => {
    if (!selectedRequest || !user || !activeRole) return;

    setResponding(selectedRequest.id);
    setError("");
    setSuccess("");

    try {
      // Update the request
      const { error: updateError } = await supabase
        .from('administrator_requests')
        .update({
          status: response,
          response_message: responseMessage.trim() || null,
          responded_at: new Date().toISOString(),
          responded_by: user.id
        })
        .eq('id', selectedRequest.id);

      if (updateError) {
        throw updateError;
      }

      // If accepted, create management relationship
      if (response === 'accepted') {
        const { error: relationError } = await supabase
          .from('managed_communities')
          .insert({
            property_administrator_id: activeRole.id,
            community_member_id: selectedRequest.community_member_id,
            relationship_status: 'active',
            established_at: new Date().toISOString(),
            established_by: user.id,
            notes: `Relación establecida tras aceptar solicitud del ${new Date().toLocaleDateString()}`
          });

        if (relationError) {
          console.warn('Failed to create management relationship:', relationError);
        }
      }

      // Send notification to community member
      if (selectedRequest.community_member?.profiles) {
        const { data: memberRole } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('id', selectedRequest.community_member_id)
          .single();

        if (memberRole) {
          await supabase.from('notifications').insert({
            user_id: memberRole.user_id,
            title: response === 'accepted' ? '✅ Solicitud Aceptada' : '❌ Solicitud Rechazada',
            message: response === 'accepted' 
              ? 'Tu solicitud de gestión de incidencias ha sido aceptada. Ahora tus reportes serán gestionados por el administrador.'
              : 'Tu solicitud de gestión de incidencias ha sido rechazada.',
            type: response === 'accepted' ? 'success' as const : 'warning' as const,
            category: 'request' as const,
            related_entity_type: 'administrator_request',
            related_entity_id: selectedRequest.id,
            read: false
          });
        }
      }

      setSuccess(response === 'accepted' ? 'Solicitud aceptada correctamente' : 'Solicitud rechazada correctamente');
      setShowResponseDialog(false);
      setResponseMessage("");
      setSelectedRequest(null);

      // Reload data
      await loadAllAdministratorData();

    } catch (err) {
      console.error('Error responding to request:', err);
      setError('Error al procesar la respuesta');
    } finally {
      setResponding(null);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    if (!user) return;

    setResponding(requestId);
    setError("");
    setSuccess("");

    try {
      // Mark the request as cancelled
      const { error: cancelError } = await supabase
        .from('administrator_requests')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .eq('status', 'pending');

      if (cancelError) {
        throw cancelError;
      }

      setSuccess('Solicitud eliminada correctamente');

      // Reload administrator requests
      await loadAdministratorRequests();

    } catch (err) {
      console.error('Error cancelling request:', err);
      setError('Error al eliminar la solicitud');
    } finally {
      setResponding(null);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      accepted: { label: 'Aceptada', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { label: 'Rechazada', color: 'bg-red-100 text-red-800', icon: XCircle },
      cancelled: { label: 'Cancelada', color: 'bg-gray-100 text-gray-800', icon: XCircle }
    }[status] || { label: status, color: 'bg-gray-100 text-gray-800', icon: Clock };

    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card className="border-stone-200 shadow-lg">
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-stone-600 mx-auto mb-4" />
          <p className="text-stone-600">Cargando notificaciones...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Notificaciones
          </h2>
          <p className="text-stone-600">
            {isPropertyAdministrator && userRole === "property_administrator"
              ? "Gestiona solicitudes de miembros de comunidad y revisa las incidencias bajo tu gestión"
              : "Revisa tus notificaciones y actualizaciones del sistema"}
          </p>
        </div>
        
        {/* Quick Stats for Property Administrators */}
        {isPropertyAdministrator && userRole === "property_administrator" && (
          <div className="text-right space-y-1">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-amber-600">
                <Clock className="h-4 w-4" />
                <span>{adminRequests.filter(r => r.status === 'pending').length} pendientes</span>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <AlertCircle className="h-4 w-4" />
                <span>{managedIncidents.length} incidencias</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Administrator Requests Section - Only for Property Administrators */}
      {isPropertyAdministrator && userRole === "property_administrator" && (
        <Card className="border-blue-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <MessageSquare className="h-5 w-5" />
              Solicitudes de Gestión ({adminRequests.filter(r => r.status === 'pending').length} pendientes)
            </CardTitle>
            <CardDescription>
              Miembros de comunidad que solicitan que gestiones sus incidencias
            </CardDescription>
          </CardHeader>
          <CardContent>
            {adminRequests.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-stone-400 mx-auto mb-4" />
                <p className="text-stone-600">No hay solicitudes de gestión</p>
                <p className="text-sm text-stone-500 mt-1">
                  Las solicitudes de miembros de comunidad aparecerán aquí
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {adminRequests.map((request) => (
                  <Card key={request.id} className="border border-stone-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <User className="h-4 w-4 text-stone-600" />
                            <span className="font-semibold">
                              {request.community_member?.profiles?.full_name || 'Miembro de Comunidad'}
                            </span>
                            {getStatusBadge(request.status)}
                          </div>

                          <div className="text-sm text-stone-600 space-y-1">
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              {request.community_member?.profiles?.email || 'Email no disponible'}
                            </div>
                            {request.community_member?.profiles?.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3" />
                                {request.community_member.profiles.phone}
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              Solicitado el {formatDate(request.requested_at)}
                            </div>
                          </div>

                          {request.request_message && (
                            <div className="bg-stone-50 p-3 rounded-lg">
                              <p className="text-sm"><strong>Mensaje:</strong> {request.request_message}</p>
                            </div>
                          )}

                          {request.response_message && (
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-sm"><strong>Tu respuesta:</strong> {request.response_message}</p>
                            </div>
                          )}
                        </div>

                        {request.status === 'pending' && (
                          <div className="flex gap-2 ml-4 flex-col sm:flex-row">
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowResponseDialog(true);
                              }}
                              className="bg-blue-600 hover:bg-blue-700"
                              disabled={responding === request.id}
                            >
                              {responding === request.id ? (
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              ) : (
                                <MessageSquare className="h-3 w-3 mr-1" />
                              )}
                              Responder
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancelRequest(request.id)}
                              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                              disabled={responding === request.id}
                            >
                              {responding === request.id ? (
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              ) : (
                                <X className="h-3 w-3 mr-1" />
                              )}
                              Eliminar
                            </Button>
                          </div>
                        )}
                        
                        {request.status !== 'pending' && (
                          <div className="ml-4 text-right">
                            <p className="text-xs text-stone-500">
                              {request.responded_at && `Respondido el ${formatDate(request.responded_at)}`}
                            </p>
                            {request.status === 'cancelled' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCancelRequest(request.id)}
                                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 mt-2"
                              >
                                <X className="h-3 w-3 mr-1" />
                                Eliminar Registro
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Managed Incidents Section - Only for Property Administrators */}
      {isPropertyAdministrator && userRole === "property_administrator" && managedIncidents.length > 0 && (
        <Card className="border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <AlertCircle className="h-5 w-5" />
              Incidencias Gestionadas ({managedIncidents.length})
            </CardTitle>
            <CardDescription>
              Incidencias reportadas por miembros bajo tu gestión
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {managedIncidents.slice(0, 5).map((incident) => (
                <Card key={incident.id} className="border border-stone-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <AlertCircle className="h-4 w-4 text-stone-600" />
                          <span className="font-semibold">{incident.title}</span>
                          <Badge className={`text-xs ${
                            incident.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            incident.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {incident.status === 'pending' ? 'Pendiente' :
                             incident.status === 'in_progress' ? 'En Proceso' :
                             incident.status === 'resolved' ? 'Resuelto' :
                             incident.status}
                          </Badge>
                        </div>

                        <div className="text-sm text-stone-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3" />
                            {incident.profiles?.full_name || 'Usuario'}
                          </div>
                          <div className="flex items-center gap-2">
                            <Building className="h-3 w-3" />
                            {incident.service_category || 'Categoría no especificada'}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {formatDate(incident.reported_at)}
                          </div>
                        </div>

                        {incident.description && (
                          <div className="bg-stone-50 p-3 rounded-lg">
                            <p className="text-sm">{incident.description.substring(0, 150)}
                              {incident.description.length > 150 && '...'}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        {incident.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => {
                              // Navigate to budget request creation
                              window.location.href = `/dashboard?tab=gestionar-incidencias&incident=${incident.id}`;
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Building className="h-3 w-3 mr-1" />
                            Solicitar Presupuesto
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            window.location.href = `/dashboard?tab=gestionar-incidencias&incident=${incident.id}`;
                          }}
                        >
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {managedIncidents.length > 5 && (
                <div className="text-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.location.href = '/dashboard?tab=gestionar-incidencias';
                    }}
                  >
                    Ver todas las incidencias ({managedIncidents.length})
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* General Notifications */}
      <Card className="border-stone-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones del Sistema ({notifications.filter(n => !n.read).length} sin leer)
          </CardTitle>
          <CardDescription>
            Actualizaciones y notificaciones importantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-stone-400 mx-auto mb-4" />
              <p className="text-stone-600">No hay notificaciones</p>
              <p className="text-sm text-stone-500 mt-1">
                Las notificaciones aparecerán aquí cuando haya actualizaciones
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all hover:shadow-sm cursor-pointer ${
                    notification.read
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-stone-900">{notification.title}</h4>
                        {!notification.read && (
                          <Badge className="bg-blue-600 text-white text-xs">Nuevo</Badge>
                        )}
                      </div>
                      <p className="text-sm text-stone-600 mb-2">{notification.message}</p>
                      <div className="flex items-center gap-4 text-xs text-stone-500">
                        <span>{formatDate(notification.created_at)}</span>
                        {notification.category && (
                          <Badge variant="outline" className="text-xs">
                            {notification.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {notification.action_url && (
                      <Button variant="outline" size="sm" className="ml-3">
                        {notification.action_label || 'Ver'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Response Dialog */}
      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Responder a Solicitud de Gestión</DialogTitle>
            <DialogDescription>
              Decide si aceptas o rechazas gestionar las incidencias de este miembro
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="bg-stone-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Detalles del solicitante:</h4>
                <div className="space-y-1 text-sm text-stone-600">
                  <p><strong>Nombre:</strong> {selectedRequest.community_member?.profiles?.full_name || 'No disponible'}</p>
                  <p><strong>Email:</strong> {selectedRequest.community_member?.profiles?.email || 'No disponible'}</p>
                  <p><strong>Fecha:</strong> {formatDate(selectedRequest.requested_at)}</p>
                  {selectedRequest.request_message && (
                    <div className="mt-2">
                      <strong>Mensaje:</strong>
                      <p className="mt-1 italic bg-white p-2 rounded">"{selectedRequest.request_message}"</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="response">Mensaje de respuesta (opcional)</Label>
                <Textarea
                  id="response"
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="Escribe un mensaje explicando tu decisión..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleRespondToRequest('accepted')}
                  disabled={responding !== null}
                  className="bg-green-600 hover:bg-green-700 flex-1"
                >
                  {responding === selectedRequest.id ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  Aceptar
                </Button>
                <Button
                  onClick={() => handleRespondToRequest('rejected')}
                  disabled={responding !== null}
                  variant="destructive"
                  className="flex-1"
                >
                  {responding === selectedRequest.id ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <X className="h-4 w-4 mr-2" />
                  )}
                  Rechazar
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setShowResponseDialog(false);
                  setResponseMessage("");
                  setSelectedRequest(null);
                }}
                className="w-full"
                disabled={responding !== null}
              >
                Cancelar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
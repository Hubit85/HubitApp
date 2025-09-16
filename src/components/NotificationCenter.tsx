
import React, { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Bell, Check, X, MessageSquare, User, Mail, Phone, 
  Building, AlertCircle, Loader2, CheckCircle, XCircle, Clock,
  UserPlus, Users
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

interface AssignmentRequest {
  id: string;
  community_member_id: string;
  property_administrator_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  assignment_type: 'property_management' | 'incident_management' | 'full_management';
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
  property_details?: {
    address?: string;
    community_name?: string;
  };
}

export function NotificationCenter({ userRole = "particular" }: NotificationCenterProps) {
  const { user, activeRole, userRoles } = useSupabaseAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [adminRequests, setAdminRequests] = useState<AdminRequest[]>([]);
  const [assignmentRequests, setAssignmentRequests] = useState<AssignmentRequest[]>([]);
  const [managedIncidents, setManagedIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<AdminRequest | null>(null);
  const [selectedAssignmentRequest, setSelectedAssignmentRequest] = useState<AssignmentRequest | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [showAssignmentResponseDialog, setShowAssignmentResponseDialog] = useState(false);

  const isPropertyAdministrator = userRoles.some(role => 
    role.role_type === 'property_administrator' && role.is_verified
  );

  useEffect(() => {
    if (user && isPropertyAdministrator && activeRole?.role_type === 'property_administrator') {
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
        loadAssignmentRequests(),
        loadManagedIncidents()
      ]);
    } catch (err) {
      console.error('Error loading administrator data:', err);
      setError('Error al cargar los datos del administrador');
    } finally {
      setLoading(false);
    }
  };

  const loadAssignmentRequests = async () => {
    if (!activeRole || activeRole.role_type !== "property_administrator") return;

    try {
      console.log("🔍 NOTIFICATIONS: Loading assignment requests for administrator:", activeRole.id);

      // REVERTED: Since we removed assignment_type from the service, this section will be empty for now
      // We'll handle this properly in a future update when we have a clear separation of concerns
      console.log("📝 NOTIFICATIONS: Assignment requests temporarily disabled - using management requests");
      setAssignmentRequests([]);
      return;

    } catch (err) {
      console.error("❌ NOTIFICATIONS: Exception loading assignment requests:", err);
      setAssignmentRequests([]);
    }
  };

  const loadManagedIncidents = async () => {
    if (!activeRole || activeRole.role_type !== 'property_administrator') return;

    try {
      console.log('🔍 NOTIFICATIONS: Loading managed incidents...');

      // Use the AdministratorRequestService for consistency
      const { AdministratorRequestService } = await import('@/services/AdministratorRequestService');
      
      const result = await AdministratorRequestService.getManagedIncidents(activeRole.id);
      
      if (result.success) {
        console.log(`✅ NOTIFICATIONS: Found ${result.incidents.length} managed incidents`);
        setManagedIncidents(result.incidents);
      } else {
        console.warn('⚠️ NOTIFICATIONS: Error loading managed incidents:', result.message);
        setManagedIncidents([]);
      }

    } catch (err) {
      console.error('❌ NOTIFICATIONS: Exception loading managed incidents:', err);
      setManagedIncidents([]);
    }
  };

  const loadGeneralNotifications = async () => {
    if (!user) return;

    try {
      console.log('🔍 NOTIFICATIONS: Loading general notifications for user:', user.id);

      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.warn('⚠️ NOTIFICATIONS: Error loading general notifications:', error);
        setNotifications([]);
      } else {
        console.log(`✅ NOTIFICATIONS: Found ${notifications?.length || 0} general notifications`);
        setNotifications(notifications || []);
      }
    } catch (err) {
      console.error('❌ NOTIFICATIONS: Exception loading general notifications:', err);
      setNotifications([]);
    }
  };

  const loadAdministratorRequests = async () => {
    if (!activeRole || activeRole.role_type !== 'property_administrator') return;

    try {
      console.log('🔍 NOTIFICATIONS: Loading administrator requests for role:', activeRole.id);

      // Use the AdministratorRequestService for consistent data loading
      const { AdministratorRequestService } = await import('@/services/AdministratorRequestService');
      
      const result = await AdministratorRequestService.getReceivedRequests(activeRole.id);
      
      if (result.success) {
        console.log(`✅ NOTIFICATIONS: Found ${result.requests.length} management requests`);
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

  const handleRespondToAssignmentRequest = async (response: 'accepted' | 'rejected') => {
    if (!selectedAssignmentRequest || !user || !activeRole) return;

    setResponding(selectedAssignmentRequest.id);
    setError("");
    setSuccess("");

    try {
      console.log('📝 NOTIFICATIONS: Responding to assignment request:', selectedAssignmentRequest.id, 'with:', response);

      // Use the AdministratorRequestService for consistency
      const { AdministratorRequestService } = await import('@/services/AdministratorRequestService');
      
      const result = await AdministratorRequestService.respondToRequest({
        requestId: selectedAssignmentRequest.id,
        response: response,
        responseMessage: responseMessage.trim() || undefined,
        respondedBy: user.id
      });

      if (result.success) {
        console.log('✅ NOTIFICATIONS: Assignment response processed successfully');
        
        setSuccess(result.message);
        setShowAssignmentResponseDialog(false);
        setResponseMessage("");
        setSelectedAssignmentRequest(null);

        // Reload all administrator data to reflect changes
        await loadAllAdministratorData();

      } else {
        console.error('❌ NOTIFICATIONS: Error responding to assignment request:', result.message);
        setError(result.message);
      }

    } catch (err) {
      console.error('❌ NOTIFICATIONS: Exception responding to assignment request:', err);
      setError('Error inesperado al procesar la respuesta');
    } finally {
      setResponding(null);
    }
  };

  const handleCancelAssignmentRequest = async (requestId: string) => {
    if (!user) return;

    setResponding(requestId);
    setError("");
    setSuccess("");

    try {
      console.log('🗑️ NOTIFICATIONS: Cancelling assignment request:', requestId);

      // Use the AdministratorRequestService for consistency
      const { AdministratorRequestService } = await import('@/services/AdministratorRequestService');
      
      const result = await AdministratorRequestService.cancelRequest(requestId);

      if (result.success) {
        console.log('✅ NOTIFICATIONS: Assignment request cancelled successfully');
        
        setSuccess(result.message);
        
        // Reload assignment requests to reflect changes
        await loadAssignmentRequests();

      } else {
        console.error('❌ NOTIFICATIONS: Error cancelling assignment request:', result.message);
        setError(result.message);
      }

    } catch (err) {
      console.error('❌ NOTIFICATIONS: Exception cancelling assignment request:', err);
      setError('Error inesperado al eliminar la solicitud de asignación');
    } finally {
      setResponding(null);
    }
  };

  const getAssignmentTypeLabel = (type: string) => {
    const types = {
      property_management: 'Gestión de Propiedad',
      incident_management: 'Gestión de Incidencias',
      full_management: 'Gestión Completa'
    };
    return types[type as keyof typeof types] || type;
  };

  const getAssignmentTypeBadge = (type: string) => {
    const config = {
      property_management: { color: 'bg-blue-100 text-blue-800', icon: Building },
      incident_management: { color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
      full_management: { color: 'bg-purple-100 text-purple-800', icon: Users }
    }[type] || { color: 'bg-gray-100 text-gray-800', icon: Building };

    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {getAssignmentTypeLabel(type)}
      </Badge>
    );
  };

  const handleRespondToRequest = async (response: 'accepted' | 'rejected') => {
    if (!selectedRequest || !user || !activeRole) return;

    setResponding(selectedRequest.id);
    setError("");
    setSuccess("");

    try {
      console.log('📝 NOTIFICATIONS: Responding to request:', selectedRequest.id, 'with:', response);

      // CORRECTED: Use the AdministratorRequestService for consistency
      const { AdministratorRequestService } = await import('@/services/AdministratorRequestService');
      
      const result = await AdministratorRequestService.respondToRequest({
        requestId: selectedRequest.id,
        response: response,
        responseMessage: responseMessage.trim() || undefined,
        respondedBy: user.id
      });

      if (result.success) {
        console.log('✅ NOTIFICATIONS: Response processed successfully');
        
        setSuccess(result.message);
        setShowResponseDialog(false);
        setResponseMessage("");
        setSelectedRequest(null);

        // Reload all administrator data to reflect changes
        await loadAllAdministratorData();

      } else {
        console.error('❌ NOTIFICATIONS: Error responding to request:', result.message);
        setError(result.message);
      }

    } catch (err) {
      console.error('❌ NOTIFICATIONS: Exception responding to request:', err);
      setError('Error inesperado al procesar la respuesta');
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
      console.log('🗑️ NOTIFICATIONS: Cancelling request:', requestId);

      // Use the AdministratorRequestService for consistency
      const { AdministratorRequestService } = await import('@/services/AdministratorRequestService');
      
      const result = await AdministratorRequestService.cancelRequest(requestId);

      if (result.success) {
        console.log('✅ NOTIFICATIONS: Request cancelled successfully');
        
        setSuccess(result.message);
        
        // Reload administrator requests to reflect changes
        await loadAdministratorRequests();

      } else {
        console.error('❌ NOTIFICATIONS: Error cancelling request:', result.message);
        setError(result.message);
      }

    } catch (err) {
      console.error('❌ NOTIFICATIONS: Exception cancelling request:', err);
      setError('Error inesperado al eliminar la solicitud');
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
                <span>{adminRequests.filter(r => r.status === 'pending').length} gestión</span>
              </div>
              <div className="flex items-center gap-1 text-purple-600">
                <UserPlus className="h-4 w-4" />
                <span>{assignmentRequests.filter(r => r.status === 'pending').length} asignación</span>
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
                            {(request.status === 'cancelled' || request.status === 'rejected') && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCancelRequest(request.id)}
                                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 mt-2"
                                disabled={responding === request.id}
                              >
                                {responding === request.id ? (
                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                ) : (
                                  <X className="h-3 w-3 mr-1" />
                                )}
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

      {/* Assignment Requests Section - Only for Property Administrators */}
      {isPropertyAdministrator && userRole === "property_administrator" && (
        <Card className="border-purple-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <UserPlus className="h-5 w-5" />
              Solicitudes de Asignación ({assignmentRequests.filter(r => r.status === 'pending').length} pendientes)
            </CardTitle>
            <CardDescription>
              Miembros de comunidad que quieren asignarte como su administrador
            </CardDescription>
          </CardHeader>
          <CardContent>
            {assignmentRequests.length === 0 ? (
              <div className="text-center py-8">
                <UserPlus className="h-12 w-12 text-stone-400 mx-auto mb-4" />
                <p className="text-stone-600">No hay solicitudes de asignación</p>
                <p className="text-sm text-stone-500 mt-1">
                  Cuando un miembro te asigne como su administrador, aparecerá aquí
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {assignmentRequests.map((request) => (
                  <Card key={request.id} className="border border-stone-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <User className="h-4 w-4 text-stone-600" />
                            <span className="font-semibold">
                              {request.community_member?.profiles?.full_name || 'Miembro de Comunidad'}
                            </span>
                            {getAssignmentTypeBadge(request.assignment_type)}
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
                              <p className="text-sm">
                                <strong>Mensaje:</strong> {request.request_message}
                              </p>
                            </div>
                          )}
                          {request.response_message && (
                            <div className="bg-purple-50 p-3 rounded-lg">
                              <p className="text-sm">
                                <strong>Tu respuesta:</strong> {request.response_message}
                              </p>
                            </div>
                          )}
                        </div>
                        {request.status === 'pending' && (
                          <div className="flex gap-2 ml-4 flex-col sm:flex-row">
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedAssignmentRequest(request);
                                setShowAssignmentResponseDialog(true);
                              }}
                              className="bg-purple-600 hover:bg-purple-700"
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
                              onClick={() => handleCancelAssignmentRequest(request.id)}
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
                            {(request.status === 'cancelled' || request.status === 'rejected') && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCancelAssignmentRequest(request.id)}
                                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 mt-2"
                                disabled={responding === request.id}
                              >
                                {responding === request.id ? (
                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                ) : (
                                  <X className="h-3 w-3 mr-1" />
                                )}
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

      {/* Assignment Response Dialog */}
      <Dialog open={showAssignmentResponseDialog} onOpenChange={setShowAssignmentResponseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Responder a Solicitud de Asignación</DialogTitle>
            <DialogDescription>
              Decide si aceptas o rechazas la asignación como administrador de este miembro
            </DialogDescription>
          </DialogHeader>

          {selectedAssignmentRequest && (
            <div className="space-y-4">
              <div className="bg-stone-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Detalles del solicitante:</h4>
                <div className="space-y-1 text-sm text-stone-600">
                  <p>
                    <strong>Nombre:</strong>{" "}
                    {selectedAssignmentRequest.community_member?.profiles?.full_name || "No disponible"}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {selectedAssignmentRequest.community_member?.profiles?.email || "No disponible"}
                  </p>
                  <p>
                    <strong>Tipo de asignación:</strong>{" "}
                    {getAssignmentTypeLabel(selectedAssignmentRequest.assignment_type)}
                  </p>
                  <p><strong>Fecha:</strong> {formatDate(selectedAssignmentRequest.requested_at)}</p>
                  {selectedAssignmentRequest.request_message && (
                    <div className="mt-2">
                      <strong>Mensaje:</strong>
                      <p className="mt-1 italic bg-white p-2 rounded">
                        "{selectedAssignmentRequest.request_message}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="assignment-response">Mensaje de respuesta (opcional)</Label>
                <Textarea
                  id="assignment-response"
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="Escribe un mensaje explicando tu decisión..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleRespondToAssignmentRequest("accepted")}
                  disabled={responding !== null}
                  className="bg-green-600 hover:bg-green-700 flex-1"
                >
                  {responding === selectedAssignmentRequest.id ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  Aceptar
                </Button>
                <Button
                  onClick={() => handleRespondToAssignmentRequest("rejected")}
                  disabled={responding !== null}
                  variant="destructive"
                  className="flex-1"
                >
                  {responding === selectedAssignmentRequest.id ? (
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
                  setShowAssignmentResponseDialog(false);
                  setResponseMessage("");
                  setSelectedAssignmentRequest(null);
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

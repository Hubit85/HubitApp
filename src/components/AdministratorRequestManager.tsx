import React, { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { AdministratorRequestService, CommunityMemberRequest } from "@/services/AdministratorRequestService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Send, Clock, CheckCircle, XCircle, MessageSquare, 
  Building, User, Mail, Phone, MapPin, AlertCircle, Loader2,
  Plus, Eye, Trash2
} from "lucide-react";

interface AdministratorRequestManagerProps {
  userRole: "community_member" | "property_administrator";
}

export function AdministratorRequestManager({ userRole }: AdministratorRequestManagerProps) {
  const { activeRole, user } = useSupabaseAuth();
  
  // Estados para miembros de comunidad
  const [searchTerm, setSearchTerm] = useState("");
  const [administrators, setAdministrators] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<CommunityMemberRequest[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Estados para administradores de fincas
  const [receivedRequests, setReceivedRequests] = useState<CommunityMemberRequest[]>([]);
  const [managedMembers, setManagedMembers] = useState<any[]>([]);
  const [managedIncidents, setManagedIncidents] = useState<any[]>([]);
  
  // Estados generales
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<CommunityMemberRequest | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    if (activeRole) {
      loadInitialData();
    }
  }, [activeRole]);

  const loadInitialData = async () => {
    if (!activeRole) return;

    setLoading(true);
    try {
      if (userRole === "community_member") {
        await loadSentRequests();
      } else if (userRole === "property_administrator") {
        await Promise.all([
          loadReceivedRequests(),
          loadManagedMembers(),
          loadManagedIncidents()
        ]);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSentRequests = async () => {
    if (!activeRole) return;
    
    const result = await AdministratorRequestService.getSentRequests(activeRole.id);
    if (result.success) {
      setSentRequests(result.requests);
    }
  };

  const loadReceivedRequests = async () => {
    if (!activeRole) return;
    
    const result = await AdministratorRequestService.getReceivedRequests(activeRole.id);
    if (result.success) {
      setReceivedRequests(result.requests);
    }
  };

  const loadManagedMembers = async () => {
    if (!activeRole) return;
    
    const result = await AdministratorRequestService.getManagedMembers(activeRole.id);
    if (result.success) {
      setManagedMembers(result.members);
    }
  };

  const loadManagedIncidents = async () => {
    if (!activeRole) return;
    
    const result = await AdministratorRequestService.getManagedIncidents(activeRole.id);
    if (result.success) {
      setManagedIncidents(result.incidents);
    }
  };

  const searchAdministrators = async () => {
    setSearchLoading(true);
    setError("");
    
    try {
      const result = await AdministratorRequestService.searchPropertyAdministrators(searchTerm);
      if (result.success) {
        setAdministrators(result.administrators);
      } else {
        setError(result.message || 'Error al buscar administradores');
      }
    } catch (error) {
      setError('Error inesperado al buscar administradores');
    } finally {
      setSearchLoading(false);
    }
  };

  const sendRequest = async () => {
    if (!selectedAdmin || !activeRole || !user) return;
    
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const result = await AdministratorRequestService.sendRequestToAdministrator({
        communityMemberRoleId: activeRole.id,
        propertyAdministratorRoleId: selectedAdmin.role_id,
        requestMessage: requestMessage.trim() || undefined
      });

      if (result.success) {
        setSuccess(result.message);
        setShowRequestDialog(false);
        setRequestMessage("");
        setSelectedAdmin(null);
        await loadSentRequests();
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Error inesperado al enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const respondToRequest = async (response: 'accepted' | 'rejected') => {
    if (!selectedRequest || !user) return;
    
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const result = await AdministratorRequestService.respondToRequest({
        requestId: selectedRequest.id,
        response,
        responseMessage: responseMessage.trim() || undefined,
        respondedBy: user.id
      });

      if (result.success) {
        setSuccess(result.message);
        setShowResponseDialog(false);
        setResponseMessage("");
        setSelectedRequest(null);
        await Promise.all([
          loadReceivedRequests(),
          loadManagedMembers(),
          loadManagedIncidents()
        ]);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Error inesperado al procesar la respuesta');
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = async (requestId: string) => {
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const result = await AdministratorRequestService.cancelRequest(requestId);
      if (result.success) {
        setSuccess(result.message);
        await loadSentRequests();
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Error al cancelar la solicitud');
    } finally {
      setLoading(false);
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
    const statusConfig = {
      pending: { label: 'Pendiente', variant: 'default' as const, icon: Clock },
      accepted: { label: 'Aceptada', variant: 'default' as const, icon: CheckCircle },
      rejected: { label: 'Rechazada', variant: 'destructive' as const, icon: XCircle },
      cancelled: { label: 'Cancelada', variant: 'secondary' as const, icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  // Vista para miembros de comunidad
  if (userRole === "community_member") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">Gestión de Administradores</h2>
            <p className="text-stone-600">Solicita a un administrador de fincas que gestione tus incidencias</p>
          </div>
          
          <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
            <DialogTrigger asChild>
              <Button className="bg-stone-800 hover:bg-stone-900">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Solicitud
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Solicitar Gestión de Incidencias</DialogTitle>
                <DialogDescription>
                  Busca y contacta con un administrador de fincas para que gestione tus reportes de incidencias
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Buscador */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="search">Buscar administrador de fincas</Label>
                    <div className="relative mt-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
                      <Input
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Nombre de empresa, email o nombre..."
                        className="pl-10"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            searchAdministrators();
                          }
                        }}
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={searchAdministrators} 
                    disabled={searchLoading}
                    className="mt-6"
                  >
                    {searchLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Resultados de búsqueda */}
                {administrators.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-stone-900">Administradores disponibles</h3>
                    <div className="grid gap-4 max-h-60 overflow-y-auto">
                      {administrators.map((admin) => (
                        <Card 
                          key={admin.role_id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedAdmin?.role_id === admin.role_id ? 'ring-2 ring-stone-800' : ''
                          }`}
                          onClick={() => setSelectedAdmin(admin)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4 text-stone-600" />
                                  <span className="font-semibold">{admin.company_name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-stone-600">
                                  <User className="h-3 w-3" />
                                  {admin.user_name}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-stone-600">
                                  <Mail className="h-3 w-3" />
                                  {admin.business_email}
                                </div>
                                {admin.business_phone && (
                                  <div className="flex items-center gap-2 text-sm text-stone-600">
                                    <Phone className="h-3 w-3" />
                                    {admin.business_phone}
                                  </div>
                                )}
                              </div>
                              {selectedAdmin?.role_id === admin.role_id && (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mensaje de solicitud */}
                {selectedAdmin && (
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <Label htmlFor="message">Mensaje para el administrador (opcional)</Label>
                      <Textarea
                        id="message"
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                        placeholder="Describe brevemente por qué necesitas sus servicios de gestión..."
                        className="mt-1"
                        rows={4}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={sendRequest}
                        disabled={loading}
                        className="bg-stone-800 hover:bg-stone-900"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Enviar Solicitud
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowRequestDialog(false);
                          setSelectedAdmin(null);
                          setRequestMessage("");
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
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

        {/* Lista de solicitudes enviadas */}
        <Card>
          <CardHeader>
            <CardTitle>Mis Solicitudes</CardTitle>
            <CardDescription>
              Historial de solicitudes enviadas a administradores de fincas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && sentRequests.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-stone-600" />
              </div>
            ) : sentRequests.length === 0 ? (
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-stone-400 mx-auto mb-4" />
                <p className="text-stone-600">No has enviado solicitudes aún</p>
                <p className="text-sm text-stone-500 mt-1">
                  Haz clic en "Nueva Solicitud" para comenzar
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sentRequests.map((request) => (
                  <Card key={request.id} className="border border-stone-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-stone-600" />
                            <span className="font-semibold">
                              {request.property_administrator?.role_specific_data?.company_name || 'Administrador de Fincas'}
                            </span>
                            {getStatusBadge(request.status)}
                          </div>
                          
                          <div className="text-sm text-stone-600">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="h-3 w-3" />
                              {request.property_administrator?.profiles?.full_name || 'Usuario'}
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="h-3 w-3" />
                              Solicitado el {formatDate(request.requested_at)}
                            </div>
                            {request.responded_at && (
                              <div className="flex items-center gap-2">
                                <MessageSquare className="h-3 w-3" />
                                Respondido el {formatDate(request.responded_at)}
                              </div>
                            )}
                          </div>

                          {request.request_message && (
                            <div className="bg-stone-50 p-3 rounded-lg">
                              <p className="text-sm"><strong>Mi mensaje:</strong> {request.request_message}</p>
                            </div>
                          )}

                          {request.response_message && (
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-sm"><strong>Respuesta:</strong> {request.response_message}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 ml-4">
                          {request.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => cancelRequest(request.id)}
                              disabled={loading}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vista para administradores de fincas
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-900">Panel de Gestión</h2>
        <p className="text-stone-600">Gestiona solicitudes de miembros de comunidad y las incidencias asignadas</p>
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

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Solicitudes ({receivedRequests.filter(r => r.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="managed" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Miembros ({managedMembers.length})
          </TabsTrigger>
          <TabsTrigger value="incidents" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Incidencias ({managedIncidents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          {loading && receivedRequests.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-stone-600" />
            </div>
          ) : receivedRequests.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-stone-400 mx-auto mb-4" />
              <p className="text-stone-600">No hay solicitudes pendientes</p>
            </div>
          ) : (
            <div className="space-y-4">
              {receivedRequests.map((request) => (
                <Card key={request.id} className="border border-stone-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-stone-600" />
                          <span className="font-semibold">
                            {request.community_member?.profiles?.full_name || 'Miembro de Comunidad'}
                          </span>
                          {getStatusBadge(request.status)}
                        </div>

                        <div className="text-sm text-stone-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            {request.community_member?.profiles?.email}
                          </div>
                          {request.community_member?.profiles?.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3" />
                              {request.community_member?.profiles?.phone}
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
                            <p className="text-sm"><strong>Mi respuesta:</strong> {request.response_message}</p>
                          </div>
                        )}
                      </div>

                      {request.status === 'pending' && (
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowResponseDialog(true);
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Responder
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="managed" className="space-y-4">
          {managedMembers.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-stone-400 mx-auto mb-4" />
              <p className="text-stone-600">No gestionas ningún miembro aún</p>
              <p className="text-sm text-stone-500 mt-1">
                Los miembros aparecerán aquí cuando aceptes sus solicitudes
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {managedMembers.map((member) => (
                <Card key={member.id} className="border border-stone-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-stone-600" />
                          <span className="font-semibold">
                            {member.community_member?.profiles?.full_name || 'Miembro de Comunidad'}
                          </span>
                        </div>

                        <div className="text-sm text-stone-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            {member.community_member?.profiles?.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            Relación establecida el {formatDate(member.established_at)}
                          </div>
                        </div>

                        {member.notes && (
                          <div className="bg-stone-50 p-3 rounded-lg">
                            <p className="text-sm">{member.notes}</p>
                          </div>
                        )}
                      </div>

                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Activo
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          {managedIncidents.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-stone-400 mx-auto mb-4" />
              <p className="text-stone-600">No hay incidencias gestionadas</p>
              <p className="text-sm text-stone-500 mt-1">
                Las incidencias de tus miembros gestionados aparecerán aquí
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {managedIncidents.map((incident) => (
                <Card key={incident.id} className="border border-stone-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-stone-600" />
                          <span className="font-semibold">{incident.title}</span>
                          <Badge 
                            variant={incident.status === 'pending' ? 'default' : 'secondary'}
                            className={
                              incident.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              incident.status === 'resolved' ? 'bg-green-100 text-green-800' : ''
                            }
                          >
                            {incident.status === 'pending' ? 'Pendiente' : 
                             incident.status === 'resolved' ? 'Resuelto' : incident.status}
                          </Badge>
                        </div>

                        <div className="text-sm text-stone-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3" />
                            Reportado por: {incident.profiles?.full_name || 'Usuario'}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {formatDate(incident.reported_at)}
                          </div>
                          {incident.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3" />
                              {incident.location}
                            </div>
                          )}
                        </div>

                        <div className="bg-stone-50 p-3 rounded-lg">
                          <p className="text-sm">{incident.description}</p>
                        </div>

                        {incident.resolution_notes && (
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-sm"><strong>Resolución:</strong> {incident.resolution_notes}</p>
                          </div>
                        )}
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // Aquí podrías abrir un modal para ver/editar la incidencia
                          console.log('Ver incidencia:', incident.id);
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog para responder solicitudes */}
      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Responder Solicitud</DialogTitle>
            <DialogDescription>
              Decide si aceptas o rechazas la solicitud de gestión de este miembro
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="bg-stone-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Detalles de la solicitud:</h4>
                <div className="space-y-1 text-sm text-stone-600">
                  <p><strong>Solicitante:</strong> {selectedRequest.community_member?.profiles?.full_name}</p>
                  <p><strong>Email:</strong> {selectedRequest.community_member?.profiles?.email}</p>
                  <p><strong>Fecha:</strong> {formatDate(selectedRequest.requested_at)}</p>
                  {selectedRequest.request_message && (
                    <div className="mt-2">
                      <strong>Mensaje:</strong>
                      <p className="mt-1 italic">"{selectedRequest.request_message}"</p>
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
                  onClick={() => respondToRequest('accepted')}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Aceptar
                </Button>
                <Button
                  onClick={() => respondToRequest('rejected')}
                  disabled={loading}
                  variant="destructive"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Rechazar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowResponseDialog(false);
                    setResponseMessage("");
                    setSelectedRequest(null);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

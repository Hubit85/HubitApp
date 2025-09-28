import React, { useState, useEffect, useCallback } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { 
  AdministratorRequestService,
  CommunityMemberRequest
} from "@/services/AdministratorRequestService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { 
  Search, Send, Clock, CheckCircle, XCircle, MessageSquare, 
  Building, User, Mail, Phone, MapPin, AlertCircle, Loader2,
  Plus, Eye, Trash2
} from "lucide-react";
/* eslint-enable @typescript-eslint/no-unused-vars */

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

  const loadSentRequests = useCallback(async () => {
    if (!activeRole) return;
    
    const result = await AdministratorRequestService.getSentRequests(activeRole.id);
    if (result.success) {
      setSentRequests(result.requests);
    }
  }, [activeRole]);

  const loadReceivedRequests = useCallback(async () => {
    if (!activeRole) return;
    
    const result = await AdministratorRequestService.getReceivedRequests(activeRole.id);
    if (result.success) {
      setReceivedRequests(result.requests);
    }
  }, [activeRole]);

  const loadManagedMembers = useCallback(async () => {
    if (!activeRole) return;
    
    const result = await AdministratorRequestService.getManagedMembers(activeRole.id);
    if (result.success) {
      setManagedMembers(result.members);
    }
  }, [activeRole]);

  const loadManagedIncidents = useCallback(async () => {
    if (!activeRole) return;
    
    const result = await AdministratorRequestService.getManagedIncidents(activeRole.id);
    if (result.success) {
      setManagedIncidents(result.incidents);
    }
  }, [activeRole]);

  // Cargar datos iniciales
  const loadInitialData = useCallback(async () => {
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
    } catch (err: any) {
      console.error("Error loading initial data:", err);
      setError(err.message || "Error al cargar los datos iniciales");
    } finally {
      setLoading(false);
    }
  }, [activeRole, userRole, loadSentRequests, loadReceivedRequests, loadManagedMembers, loadManagedIncidents]);

  useEffect(() => {
    if (activeRole) {
      loadInitialData();
    }
  }, [activeRole, loadInitialData]);

  const searchAdministrators = async () => {
    setSearchLoading(true);
    setError("");
    
    try {
      const result = await AdministratorRequestService.searchPropertyAdministrators(searchTerm);
      if (result.success) {
        setAdministrators(result.administrators);
      } else {
        setError(result.message || "Error al buscar administradores");
      }
    } catch (e: any) {
      console.error("Error inesperado al buscar administradores", e);
      setError("Error inesperado al buscar administradores");
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
    } catch (e: any) {
      console.error("Error inesperado al enviar la solicitud", e);
      setError("Error inesperado al enviar la solicitud");
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
    } catch (e: any) {
      console.error("Error inesperado al procesar la respuesta", e);
      setError("Error inesperado al procesar la respuesta");
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
    } catch (e: any) {
      console.error("Error al cancelar la solicitud", e);
      setError("Error al cancelar la solicitud");
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
  
  const renderCommunityMemberView = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Buscar Administrador de Fincas</CardTitle>
          <CardDescription>Encuentra y solicita un administrador para tu comunidad.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Buscar por nombre o empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={searchLoading}
            />
            <Button onClick={searchAdministrators} disabled={searchLoading}>
              {searchLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {administrators.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados de la Búsqueda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {administrators.map((admin) => (
              <div key={admin.role_id} className="flex items-center justify-between p-2 border rounded-lg">
                <div>
                  <p className="font-semibold">{admin.company_name}</p>
                  <p className="text-sm text-muted-foreground">{admin.user_name} - {admin.business_email}</p>
                </div>
                <Button size="sm" onClick={() => {
                  setSelectedAdmin(admin);
                  setShowRequestDialog(true);
                }}>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Solicitud
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Mis Solicitudes Enviadas</CardTitle>
        </CardHeader>
        <CardContent>
          {sentRequests.length === 0 ? (
            <p className="text-muted-foreground">No has enviado ninguna solicitud.</p>
          ) : (
            <div className="space-y-2">
              {sentRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-2 border rounded-lg">
                  <div>
                    <p className="font-semibold">{req.property_administrator?.role_specific_data.company_name}</p>
                    <p className="text-sm text-muted-foreground">Enviada: {formatDate(req.requested_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(req.status)}
                    {req.status === "pending" && (
                      <Button variant="destructive" size="sm" onClick={() => cancelRequest(req.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderAdministratorView = () => (
    <Tabs defaultValue="received-requests" className="w-full">
      <TabsList>
        <TabsTrigger value="received-requests">Solicitudes Recibidas</TabsTrigger>
        <TabsTrigger value="managed-members">Miembros Gestionados</TabsTrigger>
        <TabsTrigger value="managed-incidents">Incidencias</TabsTrigger>
      </TabsList>
      <TabsContent value="received-requests" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes de Gestión Recibidas</CardTitle>
          </CardHeader>
          <CardContent>
            {receivedRequests.length === 0 ? (
              <p className="text-muted-foreground">No tienes solicitudes pendientes.</p>
            ) : (
              <div className="space-y-2">
                {receivedRequests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div>
                      <p className="font-semibold">{req.community_member?.profiles?.full_name}</p>
                      <p className="text-sm text-muted-foreground">Recibida: {formatDate(req.requested_at)}</p>
                    </div>
                    {req.status === 'pending' ? (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => {
                          setSelectedRequest(req);
                          setShowResponseDialog(true);
                        }}>
                          Responder
                        </Button>
                      </div>
                    ) : getStatusBadge(req.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="managed-members" className="mt-4">
        <Card>
          <CardHeader><CardTitle>Miembros Gestionados</CardTitle></CardHeader>
          <CardContent>
            {managedMembers.length === 0 ? <p>No gestionas ningún miembro.</p> : managedMembers.map((member: any) => <div key={member.id}>{member.profiles?.full_name}</div>)}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="managed-incidents" className="mt-4">
        <Card>
          <CardHeader><CardTitle>Incidencias Gestionadas</CardTitle></CardHeader>
          <CardContent>
            {managedIncidents.length === 0 ? <p>No hay incidencias.</p> : managedIncidents.map((incident: any) => <div key={incident.id}>{incident.title}</div>)}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="space-y-6">
      {success && <Alert variant="default" className="bg-green-100 border-green-200 text-green-800"><CheckCircle className="h-4 w-4" /><AlertDescription>{success}</AlertDescription></Alert>}
      {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}

      {loading && <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}

      {!loading && (userRole === "community_member" ? renderCommunityMemberView() : renderAdministratorView())}

      {/* Dialog para enviar solicitud */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Solicitud a {selectedAdmin?.company_name}</DialogTitle>
            <DialogDescription>
              Puedes incluir un mensaje opcional con tu solicitud.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="request-message" className="text-right">
                Mensaje
              </Label>
              <Textarea
                id="request-message"
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                className="col-span-3"
                placeholder="Ej: Hola, nos gustaría que gestionaran nuestra comunidad..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestDialog(false)}>Cancelar</Button>
            <Button onClick={sendRequest} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog para responder solicitud */}
      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Responder a Solicitud</DialogTitle>
            <DialogDescription>
              Acepta o rechaza la solicitud de {selectedRequest?.community_member?.profiles?.full_name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="response-message" className="text-right">
                Respuesta
              </Label>
              <Textarea
                id="response-message"
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                className="col-span-3"
                placeholder="Mensaje opcional para el miembro de la comunidad..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResponseDialog(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => respondToRequest('rejected')} disabled={loading}>Rechazar</Button>
            <Button onClick={() => respondToRequest('accepted')} disabled={loading}>Aceptar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

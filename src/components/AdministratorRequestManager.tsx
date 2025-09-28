
import React, { useState, useEffect, useCallback } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  }, [activeRole, userRole]);

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
      console.error('Error loading initial data:', err);
      setError(err.message || "Error al cargar los datos iniciales");
    } finally {
      setLoading(false);
    }
  }, [activeRole, userRole]);

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
    } catch (e: any) {
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
    } catch (e: any) {
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
    } catch (e: any) {
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
    } catch (e: any) {
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
  
  return <div className="space-y-6">...</div>
}

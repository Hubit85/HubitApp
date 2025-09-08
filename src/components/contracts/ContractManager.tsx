
import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, Search, Filter, MapPin, Clock, Euro, AlertTriangle, CheckCircle, 
  Send, Eye, MessageSquare, Calendar, Building, User, Star, Signature,
  Loader2, RefreshCw, Download, Upload, Edit, Trash2, Plus, BookOpen,
  Shield, Award, Target, ClipboardList, DollarSign
} from "lucide-react";
import { Contract, Quote, BudgetRequest } from "@/integrations/supabase/types";

interface ExtendedContract extends Contract {
  client_name?: string;
  provider_name?: string;
  quote_title?: string;
  budget_title?: string;
  property_address?: string;
}

interface ExtendedQuote {
  id: string;
  amount: number;
  attachments: string[] | null;
  budget_request_id: string;
  created_at: string;
  description?: string;
  estimated_duration: string | null;
  estimated_start_date: string | null;
  labor_cost: number;
  materials_cost: number;
  notes: string | null;
  payment_terms: string;
  service_provider_id: string;
  status: "pending" | "accepted" | "rejected" | "expired" | "cancelled";
  terms_and_conditions: string | null;
  updated_at: string;
  valid_until: string | null;
  viewed_by_client: boolean;
  warranty_period: string | null;
  user_id: string;
  title?: string;
  budget_requests?: {
    title: string;
    description?: string;
    user_id: string;
    profiles: {
      full_name: string;
    };
    properties: {
      address: string;
    };
  };
}

interface ContractFormData {
  title: string;
  description: string;
  work_scope: string;
  payment_terms: string;
  deadline: string;
  warranty_period: string;
  special_terms: string;
}

export function ContractManager() {
  const { user, activeRole } = useSupabaseAuth();
  const [contracts, setContracts] = useState<ExtendedContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedContract, setSelectedContract] = useState<ExtendedContract | null>(null);
  const [showContractDialog, setShowContractDialog] = useState(false);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentTab, setCurrentTab] = useState("my-contracts");
  const [availableQuotes, setAvailableQuotes] = useState<ExtendedQuote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<ExtendedQuote | null>(null);

  const [contractForm, setContractForm] = useState<ContractFormData>({
    title: "",
    description: "",
    work_scope: "",
    payment_terms: "50% al inicio, 50% al completar",
    deadline: "",
    warranty_period: "12 meses",
    special_terms: ""
  });

  useEffect(() => {
    if (user) {
      loadContractsData();
    }
  }, [user, activeRole]);

  const loadContractsData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError("");

      console.log("🔍 Loading contracts data for user:", user.id.substring(0, 8) + '...');

      if (activeRole?.role_type === 'service_provider') {
        await Promise.all([
          loadProviderContracts(),
          loadAvailableQuotes()
        ]);
      } else {
        await loadClientContracts();
      }

    } catch (err) {
      console.error("❌ Error loading contracts data:", err);
      setError(err instanceof Error ? err.message : "Error al cargar contratos");
    } finally {
      setLoading(false);
    }
  };

  const loadClientContracts = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          service_providers (
            company_name
          ),
          quotes (
            title,
            description,
            budget_requests (
              title,
              properties (
                address
              )
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("❌ Error loading client contracts:", error);
        throw error;
      }

      const enhancedContracts = (data || []).map((contract: any) => ({
        ...contract,
        provider_name: contract.service_providers?.company_name || 'Proveedor',
        quote_title: contract.quotes?.title || 'Servicio',
        budget_title: contract.quotes?.budget_requests?.title || '',
        property_address: contract.quotes?.budget_requests?.properties?.address || ''
      }));

      setContracts(enhancedContracts);
      console.log("✅ Client contracts loaded:", enhancedContracts.length);

    } catch (error) {
      console.error("❌ Error loading client contracts:", error);
      throw error;
    }
  };

  const loadProviderContracts = async () => {
    if (!user?.id) return;

    try {
      const { data: providerData, error: providerError } = await supabase
        .from('service_providers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (providerError) {
        console.error("❌ Error loading provider data:", providerError);
        throw new Error(`Error cargando datos del proveedor: ${providerError.message}`);
      }

      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          profiles (
            full_name
          ),
          quotes (
            title,
            description,
            budget_requests (
              title,
              properties (
                address
              )
            )
          )
        `)
        .eq('service_provider_id', providerData.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("❌ Error loading provider contracts:", error);
        throw error;
      }

      const enhancedContracts = (data || []).map((contract: any) => ({
        ...contract,
        client_name: contract.profiles?.full_name || 'Cliente',
        quote_title: contract.quotes?.title || 'Servicio',
        budget_title: contract.quotes?.budget_requests?.title || '',
        property_address: contract.quotes?.budget_requests?.properties?.address || ''
      }));

      setContracts(enhancedContracts);
      console.log("✅ Provider contracts loaded:", enhancedContracts.length);

    } catch (error) {
      console.error("❌ Error loading provider contracts:", error);
      throw error;
    }
  };

  const loadAvailableQuotes = async () => {
    if (!user?.id) return;

    try {
      const { data: providerData, error: providerError } = await supabase
        .from('service_providers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (providerError) {
        console.warn("⚠️ Provider not found, skipping quotes");
        return;
      }

      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          budget_requests (
            title,
            description,
            user_id,
            properties (
              address
            ),
            profiles (
              full_name
            )
          )
        `)
        .eq('service_provider_id', providerData.id)
        .eq('status', 'accepted')
        .is('contract_id', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("❌ Error loading quotes:", error);
        return;
      }

      const transformedQuotes: ExtendedQuote[] = (data || []).map((quote: any) => ({
        ...quote,
        user_id: quote.budget_requests?.user_id || quote.user_id || '',
        title: quote.title || quote.budget_requests?.title || 'Servicio sin título',
        description: quote.description || quote.budget_requests?.description || 'Sin descripción',
        budget_requests: quote.budget_requests
      }));

      setAvailableQuotes(transformedQuotes);
      console.log("✅ Available quotes loaded:", transformedQuotes.length);

    } catch (error) {
      console.error("❌ Error loading available quotes:", error);
    }
  };

  const handleCreateContract = async () => {
    if (!selectedQuote || !user?.id) return;

    try {
      setSubmitting(true);
      setError("");

      console.log("📄 Creating contract for quote:", selectedQuote.id);

      const { data: providerData, error: providerError } = await supabase
        .from('service_providers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (providerError) {
        throw new Error("Error al obtener datos del proveedor");
      }

      const contractNumber = `CON-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const contractUserId = selectedQuote.budget_requests?.user_id || selectedQuote.user_id;
      
      if (!contractUserId) {
        throw new Error("No se puede determinar el usuario propietario del contrato");
      }

      const contractData = {
        quote_id: selectedQuote.id,
        user_id: contractUserId,
        service_provider_id: providerData.id,
        contract_number: contractNumber,
        work_description: contractForm.work_scope || selectedQuote.description || 'Descripción del trabajo',
        total_amount: selectedQuote.amount,
        payment_schedule: contractForm.payment_terms,
        status: 'pending' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: newContract, error: createError } = await supabase
        .from('contracts')
        .insert(contractData)
        .select()
        .single();

      if (createError) {
        console.error("❌ Error creating contract:", createError);
        throw createError;
      }

      console.log("✅ Contract created successfully:", newContract.id);

      // Send notification to the contract owner
      const contractUserId = selectedQuote.budget_requests?.user_id || selectedQuote.user_id;
      
      if (contractUserId) {
        try {
          await supabase
            .from('notifications')
            .insert({
              user_id: contractUserId,
              title: 'Nuevo contrato disponible',
              message: `Se ha generado un contrato para tu solicitud "${selectedQuote.title || 'Servicio'}"`,
              type: 'info' as const,
              category: 'contract' as const,
              related_entity_type: 'contract',
              related_entity_id: newContract.id,
              action_url: `/dashboard?contract=${newContract.id}`,
              action_label: 'Ver Contrato',
              read: false
            });
        } catch (notifError) {
          console.warn("⚠️ Failed to send notification:", notifError);
        }
      }

      setSuccessMessage("¡Contrato creado exitosamente!");
      setShowContractDialog(false);
      resetContractForm();
      await loadContractsData();
      setTimeout(() => setSuccessMessage(""), 5000);

    } catch (err) {
      console.error("❌ Error creating contract:", err);
      setError(err instanceof Error ? err.message : "Error al crear el contrato");
    } finally {
      setSubmitting(false);
    }
  };

  const resetContractForm = () => {
    setContractForm({
      title: "",
      description: "",
      work_scope: "",
      payment_terms: "50% al inicio, 50% al completar",
      deadline: "",
      warranty_period: "12 meses",
      special_terms: ""
    });
    setSelectedQuote(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">📝 Borrador</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">⏳ Pendiente Firma</Badge>;
      case 'signed':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">✅ Firmado</Badge>;
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">🚀 Activo</Badge>;
      case 'completed':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">🎉 Completado</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-200">❌ Cancelado</Badge>;
      case 'disputed':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">⚠️ En Disputa</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = (contract.quote_title || contract.work_description || '')?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredQuotes = availableQuotes.filter(quote => {
    const matchesSearch = quote.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-pulse text-center">
            <Loader2 className="h-10 w-10 mx-auto mb-3 animate-spin text-purple-600" />
            <p className="text-sm text-neutral-600">Cargando contratos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-white to-neutral-50 border-neutral-200/60 shadow-xl shadow-neutral-900/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">Gestión de Contratos</CardTitle>
                <CardDescription className="mt-1">
                  Administra contratos, firmas y seguimiento de proyectos
                </CardDescription>
              </div>
            </div>
            
            <Button 
              onClick={loadContractsData}
              disabled={loading}
              variant="outline"
              size="sm"
              className="bg-transparent hover:bg-purple-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {(error || successMessage) && (
            <Alert className={`border-2 ${
              error 
                ? "border-red-200 bg-red-50" 
                : "border-green-200 bg-green-50"
            }`}>
              <AlertDescription className={`font-medium ${
                error ? "text-red-800" : "text-green-800"
              }`}>
                {error || successMessage}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/60">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-purple-900">{contracts.length}</div>
                  <div className="text-sm text-purple-600">Total Contratos</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/60">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-900">
                    {contracts.filter(c => c.status === 'active').length}
                  </div>
                  <div className="text-sm text-green-600">Contratos Activos</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/60">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-900">
                    {contracts.filter(c => c.status === 'completed').length}
                  </div>
                  <div className="text-sm text-blue-600">Completados</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200/60">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-amber-600" />
                <div>
                  <div className="text-2xl font-bold text-amber-900">
                    €{contracts.reduce((sum, c) => sum + (c.total_amount || 0), 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-amber-600">Valor Total</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Buscar contratos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="draft">Borrador</SelectItem>
                <SelectItem value="pending">Pendiente Firma</SelectItem>
                <SelectItem value="signed">Firmado</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
                <SelectItem value="disputed">En Disputa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="my-contracts">
                Mis Contratos ({filteredContracts.length})
              </TabsTrigger>
              {activeRole?.role_type === 'service_provider' && (
                <TabsTrigger value="create-contracts">
                  Crear Contratos ({filteredQuotes.length})
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="my-contracts" className="space-y-4 mt-6">
              {filteredContracts.length === 0 ? (
                <Card className="p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                  <h4 className="font-medium text-neutral-600 mb-2">No hay contratos disponibles</h4>
                  <p className="text-sm text-neutral-500">
                    {searchTerm || statusFilter !== 'all' 
                      ? "Ajusta los filtros para ver más resultados"
                      : "No tienes contratos en este momento"
                    }
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredContracts.map(contract => (
                    <Card key={contract.id} className="p-6 border hover:border-neutral-300 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-2xl">📄</div>
                            <div>
                              <h3 className="text-lg font-semibold text-neutral-900">
                                {contract.quote_title || contract.work_description || 'Contrato de Servicio'}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-neutral-600">
                                <User className="h-4 w-4" />
                                <span>{contract.client_name || contract.provider_name}</span>
                                <Separator orientation="vertical" className="h-4" />
                                <span>#{contract.contract_number || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-neutral-700 mb-4 line-clamp-2">{contract.work_description}</p>
                          
                          <div className="flex items-center gap-4 text-sm">
                            {getStatusBadge(contract.status)}
                            
                            <div className="flex items-center gap-1 text-green-600 font-semibold">
                              <Euro className="h-4 w-4" />
                              <span>€{contract.total_amount?.toLocaleString()}</span>
                            </div>
                            
                            <div className="flex items-center gap-1 text-neutral-600">
                              <Calendar className="h-4 w-4" />
                              <span>Creado: {contract.created_at ? new Date(contract.created_at).toLocaleDateString() : 'Fecha desconocida'}</span>
                            </div>

                            {contract.end_date && (
                              <div className="flex items-center gap-1 text-orange-600">
                                <Clock className="h-4 w-4" />
                                <span>Fecha límite: {new Date(contract.end_date).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                          
                          {contract.status === 'pending' && (
                            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-indigo-600">
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </Button>
                          )}

                          {contract.status === 'pending' && (
                            <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600">
                              <Signature className="h-4 w-4 mr-2" />
                              Firmar
                            </Button>
                          )}

                          {contract.status === 'active' && (
                            <Button size="sm" className="bg-gradient-to-r from-amber-600 to-orange-600">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Completar
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {activeRole?.role_type === 'service_provider' && (
              <TabsContent value="create-contracts" className="space-y-4 mt-6">
                {filteredQuotes.length === 0 ? (
                  <Card className="p-8 text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                    <h4 className="font-medium text-neutral-600 mb-2">No hay cotizaciones disponibles para contratos</h4>
                    <p className="text-sm text-neutral-500">
                      Necesitas tener cotizaciones aceptadas para poder crear contratos.
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredQuotes.map(quote => (
                      <Card key={quote.id} className="p-6 border hover:border-neutral-300 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="text-2xl">💼</div>
                              <div>
                                <h3 className="text-lg font-semibold text-neutral-900">{quote.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-neutral-600">
                                  <User className="h-4 w-4" />
                                  <span>{quote.budget_requests?.profiles?.full_name || 'Cliente'}</span>
                                  <Separator orientation="vertical" className="h-4" />
                                  <MapPin className="h-4 w-4" />
                                  <span>{quote.budget_requests?.properties?.address || 'Ubicación'}</span>
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-neutral-700 mb-4">{quote.description}</p>
                            
                            <div className="flex items-center gap-4 text-sm">
                              <Badge className="bg-green-100 text-green-800 border-green-200">✅ Cotización Aceptada</Badge>
                              
                              <div className="flex items-center gap-1 text-green-600 font-semibold">
                                <Euro className="h-4 w-4" />
                                <span>€{quote.amount.toLocaleString()}</span>
                              </div>
                              
                              <div className="flex items-center gap-1 text-neutral-600">
                                <Calendar className="h-4 w-4" />
                                <span>Aceptada: {new Date(quote.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>

                          <div className="ml-4">
                            <Dialog open={showContractDialog && selectedQuote?.id === quote.id} onOpenChange={(open) => {
                              setShowContractDialog(open);
                              if (!open) {
                                setSelectedQuote(null);
                                resetContractForm();
                              }
                            }}>
                              <DialogTrigger asChild>
                                <Button
                                  onClick={() => {
                                    setSelectedQuote(quote);
                                    setContractForm(prev => ({
                                      ...prev,
                                      work_scope: quote.description || ''
                                    }));
                                  }}
                                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  Crear Contrato
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Crear Nuevo Contrato</DialogTitle>
                                  <DialogDescription>
                                    Genera un contrato formal para la cotización aceptada
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-6">
                                  <Card className="p-4 bg-neutral-50">
                                    <h4 className="font-medium mb-2">Resumen de la cotización</h4>
                                    <div className="text-sm space-y-1">
                                      <p><span className="font-medium">Cliente:</span> {quote.budget_requests?.profiles?.full_name}</p>
                                      <p><span className="font-medium">Servicio:</span> {quote.title}</p>
                                      <p><span className="font-medium">Monto:</span> €{quote.amount.toLocaleString()}</p>
                                      <p><span className="font-medium">Descripción:</span> {quote.description}</p>
                                    </div>
                                  </Card>

                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="title">Título del Contrato *</Label>
                                      <Input
                                        id="title"
                                        value={contractForm.title}
                                        onChange={(e) => setContractForm(prev => ({ ...prev, title: e.target.value }))}
                                      />
                                    </div>

                                    <div>
                                      <Label htmlFor="work_scope">Alcance del Trabajo *</Label>
                                      <Textarea
                                        id="work_scope"
                                        placeholder="Describe detalladamente el trabajo a realizar..."
                                        value={contractForm.work_scope}
                                        onChange={(e) => setContractForm(prev => ({ ...prev, work_scope: e.target.value }))}
                                        rows={4}
                                      />
                                    </div>

                                    <div>
                                      <Label htmlFor="payment_terms">Términos de Pago</Label>
                                      <Input
                                        id="payment_terms"
                                        value={contractForm.payment_terms}
                                        onChange={(e) => setContractForm(prev => ({ ...prev, payment_terms: e.target.value }))}
                                      />
                                    </div>

                                    <div>
                                      <Label htmlFor="deadline">Fecha Límite de Entrega</Label>
                                      <Input
                                        id="deadline"
                                        type="date"
                                        value={contractForm.deadline}
                                        onChange={(e) => setContractForm(prev => ({ ...prev, deadline: e.target.value }))}
                                      />
                                    </div>

                                    <div>
                                      <Label htmlFor="warranty_period">Período de Garantía</Label>
                                      <Input
                                        id="warranty_period"
                                        value={contractForm.warranty_period}
                                        onChange={(e) => setContractForm(prev => ({ ...prev, warranty_period: e.target.value }))}
                                      />
                                    </div>

                                    <div>
                                      <Label htmlFor="special_terms">Términos Especiales</Label>
                                      <Textarea
                                        id="special_terms"
                                        placeholder="Condiciones adicionales, restricciones o consideraciones especiales..."
                                        value={contractForm.special_terms}
                                        onChange={(e) => setContractForm(prev => ({ ...prev, special_terms: e.target.value }))}
                                        rows={3}
                                      />
                                    </div>
                                  </div>
                                </div>
                                
                                <DialogFooter className="mt-6">
                                  <Button 
                                    variant="outline" 
                                    onClick={() => setShowContractDialog(false)}
                                    disabled={submitting}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button 
                                    onClick={handleCreateContract}
                                    disabled={!contractForm.title || !contractForm.work_scope || submitting}
                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                                  >
                                    {submitting ? (
                                      <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Creando...
                                      </>
                                    ) : (
                                      <>
                                        <FileText className="h-4 w-4 mr-2" />
                                        Crear Contrato
                                      </>
                                    )}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
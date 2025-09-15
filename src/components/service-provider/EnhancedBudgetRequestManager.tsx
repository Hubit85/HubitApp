
import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Send, Eye, Star, Building, MapPin, Clock, Euro, AlertTriangle, 
  CheckCircle, Loader2, Calendar, Zap, Bell, Target, Filter,
  TrendingUp, Award, FileText, Users, MessageCircle, Phone,
  Mail, ExternalLink, ChevronRight, Timer, DollarSign,
  Briefcase, CheckSquare, XCircle, ArrowRight, Heart,
  BookOpen, Settings, RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast"
import { Database } from "@/integrations/supabase/types"

type BudgetRequest = Database["public"]["Tables"]["budget_requests"]["Row"];
type Quote = Database["public"]["Tables"]["quotes"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Property = Database["public"]["Tables"]["properties"]["Row"];

type BudgetRequestWithDetails = BudgetRequest & {
  profiles: Profile;
  properties: Property;
  quotes: Quote[];
};

type QuoteWithDetails = Quote & {
  budget_requests: BudgetRequest & {
    profiles: Profile;
    properties: Property;
  }
};

interface EnhancedBudgetRequestManagerProps {
  providerId: string
}

export function EnhancedBudgetRequestManager() {
  const { user, activeRole } = useSupabaseAuth();
  const [requests, setRequests] = useState<BudgetRequestWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState({ min: "", max: "" });
  
  // Quote creation states
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BudgetRequestWithDetails | null>(null);
  const [submittingQuote, setSubmittingQuote] = useState(false);
  const [quoteData, setQuoteData] = useState({
    amount: "",
    materials_cost: "",
    labor_cost: "",
    description: "",
    terms_and_conditions: "",
    valid_until: "",
    notes: ""
  });

  useEffect(() => {
    if (user && activeRole?.role_type === 'service_provider') {
      loadServiceProviderData();
    }
  }, [user, activeRole]);

  const loadServiceProviderData = async () => {
    try {
      setLoading(true);
      setError("");

      // Load service provider profile
      const { data: providerData, error: providerError } = await supabase
        .from('service_providers')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (providerError) {
        throw new Error("Error loading service provider profile");
      }

      setServiceProviderProfile(providerData);

      // Load available budget requests
      await loadAvailableRequests(providerData);

      // Load my quotes
      await loadMyQuotes(providerData.id);

    } catch (err) {
      console.error("Error loading service provider data:", err);
      setError(err instanceof Error ? err.message : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableRequests = async (provider?: ServiceProvider) => {
    try {
      const currentProvider = provider || serviceProviderProfile;
      if (!currentProvider) return;

      const filters: any = {};

      // Filter by service categories
      if (currentProvider.service_categories && currentProvider.service_categories.length > 0) {
        filters.serviceCategories = currentProvider.service_categories;
      }

      // Apply additional filters
      if (categoryFilter !== "all") {
        filters.category = categoryFilter;
      }
      if (urgencyFilter !== "all") {
        filters.urgency = urgencyFilter;
      }
      if (budgetFilter.min) {
        filters.minBudget = parseFloat(budgetFilter.min);
      }
      if (budgetFilter.max) {
        filters.maxBudget = parseFloat(budgetFilter.max);
      }

      const requests = await SupabaseBudgetService.getPublishedBudgetRequests(filters);

      // Filter out requests where I already submitted a quote
      const myQuoteRequestIds = myQuotes.map(q => q.budget_request_id);
      const filteredRequests = requests.filter(r => !myQuoteRequestIds.includes(r.id));

      // Enrich with client information
      const enrichedRequests = await Promise.all(
        filteredRequests.map(async (request) => {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, email, phone')
              .eq('id', request.user_id)
              .single();

            return { ...request, profiles: profile || null };
          } catch (error) {
            return { ...request, profiles: null };
          }
        })
      );

      setAvailableRequests(enrichedRequests as BudgetRequestWithDetails[]);

    } catch (err) {
      console.error("Error loading available requests:", err);
    }
  };

  const loadMyQuotes = async (providerId?: string) => {
    try {
      const currentProviderId = providerId || serviceProviderProfile?.id;
      if (!currentProviderId) return;

      const quotes = await SupabaseBudgetService.getProviderQuotes(currentProviderId);

      // Enrich quotes with budget request details
      const enrichedQuotes = await Promise.all(
        quotes.map(async (quote) => {
          try {
            const request = await SupabaseBudgetService.getBudgetRequest(quote.budget_request_id);
            
            // Get client profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, email, phone')
              .eq('id', request.user_id)
              .single();

            return {
              ...quote,
              budget_requests: {
                ...request,
                profiles: profile || null
              }
            };
          } catch (error) {
            return { ...quote, budget_requests: null };
          }
        })
      );

      setMyQuotes(enrichedQuotes as QuoteWithDetails[]);

    } catch (err) {
      console.error("Error loading my quotes:", err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadServiceProviderData();
    setRefreshing(false);
    setSuccessMessage("Datos actualizados correctamente");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const openQuoteDialog = (request: BudgetRequestWithDetails) => {
    setSelectedRequest(request);
    setQuoteData({
      amount: "",
      materials_cost: "",
      labor_cost: "",
      description: "",
      terms_and_conditions: "",
      valid_until: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      notes: ""
    });
    setShowQuoteDialog(true);
  };

  const handleSubmitQuote = async () => {
    if (!selectedRequest || !serviceProviderProfile) return;

    try {
      setSubmittingQuote(true);
      setError("");

      const quoteInsert: QuoteInsert = {
        service_provider_id: serviceProviderProfile.id,
        budget_request_id: selectedRequest.id,
        amount: parseFloat(quoteData.amount),
        materials_cost: parseFloat(quoteData.materials_cost) || undefined,
        labor_cost: parseFloat(quoteData.labor_cost),
        description: quoteData.description,
        terms_and_conditions: quoteData.terms_and_conditions || null,
        valid_until: quoteData.valid_until ? new Date(quoteData.valid_until).toISOString() : null,
        notes: quoteData.notes || null
      };

      await SupabaseBudgetService.createQuote(quoteInsert);

      setSuccessMessage(`¡Cotización enviada exitosamente para "${selectedRequest.title}"!`);
      setShowQuoteDialog(false);
      
      // Refresh data
      await loadServiceProviderData();

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);

    } catch (err) {
      console.error("Error submitting quote:", err);
      setError(err instanceof Error ? err.message : "Error al enviar cotización");
    } finally {
      setSubmittingQuote(false);
    }
  };

  const getUrgencyDisplay = (urgency: string | null) => {
    if (!urgency) return { label: "Sin especificar", icon: "❓", color: "bg-neutral-100 text-neutral-700" };
    return URGENCY_LEVELS[urgency as keyof typeof URGENCY_LEVELS] || URGENCY_LEVELS.normal;
  };

  const getCategoryDisplay = (category: string) => {
    return SERVICE_CATEGORIES_MAP[category] || SERVICE_CATEGORIES_MAP.other;
  };

  const getStatusBadge = (status: string | null) => {
    const statusConfig = {
      pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
      accepted: { label: "Aceptada", color: "bg-green-100 text-green-800" },
      rejected: { label: "Rechazada", color: "bg-red-100 text-red-800" },
      cancelled: { label: "Cancelada", color: "bg-gray-100 text-gray-800" }
    };

    if (!status) {
      return <Badge className="bg-neutral-100 text-neutral-800">Sin estado</Badge>;
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy', { locale: es });
  };

  const calculateQuoteStats = () => {
    const total = myQuotes.length;
    const pending = myQuotes.filter(q => q.status === 'pending').length;
    const accepted = myQuotes.filter(q => q.status === 'accepted').length;
    const rejected = myQuotes.filter(q => q.status === 'rejected').length;
    const acceptanceRate = total > 0 ? (accepted / total) * 100 : 0;

    return { total, pending, accepted, rejected, acceptanceRate };
  };

  if (!activeRole || activeRole.role_type !== 'service_provider') {
    return (
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/60">
        <CardContent className="text-center p-8">
          <Users className="h-12 w-12 mx-auto mb-4 text-amber-600" />
          <h3 className="text-lg font-semibold text-amber-900 mb-2">Acceso Restringido</h3>
          <p className="text-sm text-amber-700">
            Esta funcionalidad está disponible solo para proveedores de servicios.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleQuoteAction = async (
    quoteId: string,
    action: "accept" | "reject"
  ) => {
    try {
      const { data, error } = await supabase
        .from("quotes")
        .update({ status: action === "accept" ? "accepted" : "rejected" })
        .eq("id", quoteId)
        .select()
        .single()

      if (error) throw error

      setRequests((prev) =>
        prev.map((req) => ({
          ...req,
          quotes: req.quotes.map((q) =>
            q.id === quoteId ? { ...q, status: data.status } : q
          ),
        }))
      )

      toast({
        title: `Quote ${action === "accept" ? "accepted" : "rejected"}`,
      })
    } catch (err) {
      console.error(`Error ${action}ing quote:`, err)
      toast({
        title: `Error ${action}ing quote`,
        variant: "destructive",
      })
    }
  }

  const renderRequestDetails = (request: BudgetRequestWithDetails) => (
    <Card key={request.id}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <Badge className="mb-2">{request.category}</Badge>
            <CardTitle>{request.title}</CardTitle>
            <CardDescription>
              From {request.profiles.full_name} for{" "}
              {request.properties.name}
            </CardDescription>
          </div>
          <Badge variant={request.urgency === "high" ? "destructive" : "outline"}>
            {request.urgency}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="quotes">
              Quotes ({request.quotes.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="pt-4">
            <p className="text-sm">{request.description}</p>
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <strong>Budget:</strong> €{request.budget_range_min} - €
                {request.budget_range_max}
              </div>
              <div>
                <strong>Deadline:</strong>{" "}
                {request.deadline_date
                  ? new Date(request.deadline_date).toLocaleDateString()
                  : "N/A"}
              </div>
              <div>
                <strong>Preferred Date:</strong>{" "}
                {request.preferred_date
                  ? new Date(request.preferred_date).toLocaleDateString()
                  : "N/A"}
              </div>
               <div>
                <strong>Location:</strong> {request.properties.address}, {request.properties.city}
              </div>
              {request.special_requirements && <div><strong>Special Requirements:</strong> {request.special_requirements}</div>}
            </div>
          </TabsContent>
          <TabsContent value="quotes" className="pt-4">
            {request.quotes.length > 0 ? (
              <div className="space-y-4">
                {request.quotes.map((quote) => (
                  <div
                    key={quote.id}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">
                        €{quote.amount}
                      </p>
                      <Badge
                        variant={
                          quote.status === "accepted"
                            ? "default"
                            : quote.status === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {quote.status}
                      </Badge>
                    </div>
                    <p className="text-sm mt-2">
                      {quote.description}
                    </p>
                    {quote.status === "pending" && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          onClick={() => handleQuoteAction(quote.id, "accept")}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuoteAction(quote.id, "reject")}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No quotes submitted yet.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )

  const renderActiveQuoteCard = (quote: QuoteWithDetails) => (
    <Card key={quote.id}>
      <CardHeader>
        <CardTitle>{quote.budget_requests.title}</CardTitle>
        <CardDescription>
          Quote for {quote.budget_requests.profiles.full_name} at {quote.budget_requests.properties.address}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Your quote of €{quote.amount} was{" "}
          <span
            className={
              quote.status === "accepted"
                ? "font-bold text-green-600"
                : "font-bold text-red-600"
            }
          >
            {quote.status}
          </span>
          .
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {quote.description}
        </p>
        <div className="text-xs text-gray-400 mt-4">
          Submitted on: {new Date(quote.created_at).toLocaleDateString()} | Valid
          until: {quote.valid_until ? new Date(quote.valid_until).toLocaleDateString() : 'N/A'}
        </div>
      </CardContent>
       {quote.status === "accepted" && (
        <CardFooter>
          <Button size="sm">Create Contract</Button>
        </CardFooter>
      )}
    </Card>
  )

  if (loading) {
    return (
      <Card className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-neutral-600">Cargando solicitudes de presupuesto...</p>
        </div>
      </Card>
    );
  }

  const quoteStats = calculateQuoteStats();

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Gestión de Presupuestos</h1>
              <p className="text-blue-100">
                Encuentra nuevas oportunidades y gestiona tus cotizaciones
              </p>
            </div>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 hover:bg-white/20"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Actualizar
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-5 w-5" />
                <span className="text-sm font-medium">Disponibles</span>
              </div>
              <p className="text-2xl font-bold">{availableRequests.length}</p>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Send className="h-5 w-5" />
                <span className="text-sm font-medium">Mis Cotizaciones</span>
              </div>
              <p className="text-2xl font-bold">{quoteStats.total}</p>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Aceptadas</span>
              </div>
              <p className="text-2xl font-bold">{quoteStats.accepted}</p>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">Tasa Éxito</span>
              </div>
              <p className="text-2xl font-bold">{quoteStats.acceptanceRate.toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Messages */}
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

      {/* Main Tabs */}
      <Tabs defaultValue="available" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Solicitudes Disponibles ({availableRequests.length})
          </TabsTrigger>
          <TabsTrigger value="my-quotes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Mis Cotizaciones ({quoteStats.total})
          </TabsTrigger>
        </TabsList>

        {/* Available Requests Tab */}
        <TabsContent value="available" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros de Búsqueda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Categoría</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      {Object.entries(SERVICE_CATEGORIES_MAP).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.icon} {value.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Urgencia</Label>
                  <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las urgencias</SelectItem>
                      {Object.entries(URGENCY_LEVELS).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.icon} {value.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Presupuesto Mínimo (€)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={budgetFilter.min}
                    onChange={(e) => setBudgetFilter(prev => ({ ...prev, min: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>Presupuesto Máximo (€)</Label>
                  <Input
                    type="number"
                    placeholder="Sin límite"
                    value={budgetFilter.max}
                    onChange={(e) => setBudgetFilter(prev => ({ ...prev, max: e.target.value }))}
                  />
                </div>
              </div>

              <div className="mt-4">
                <Button 
                  onClick={() => loadAvailableRequests()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Aplicar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Available Requests List */}
          {availableRequests.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Target className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                <h3 className="text-lg font-semibold text-neutral-600 mb-2">
                  No hay solicitudes disponibles
                </h3>
                <p className="text-neutral-500 mb-4">
                  No se encontraron solicitudes de presupuesto que coincidan con tus servicios y filtros.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setCategoryFilter("all");
                    setUrgencyFilter("all");
                    setBudgetFilter({ min: "", max: "" });
                    loadAvailableRequests();
                  }}
                >
                  Limpiar Filtros
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {availableRequests.map((request) => {
                const categoryInfo = getCategoryDisplay(request.category);
                const urgencyInfo = getUrgencyDisplay(request.urgency);

                return (
                  <Card key={request.id} className="hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-neutral-900">
                              {request.title}
                            </h3>
                            <Badge className={categoryInfo.color}>
                              {categoryInfo.icon} {categoryInfo.label}
                            </Badge>
                            <Badge className={urgencyInfo.color}>
                              {urgencyInfo.icon} {urgencyInfo.label}
                            </Badge>
                          </div>
                          
                          <p className="text-neutral-600 mb-3 line-clamp-2">
                            {request.description}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            {request.profiles && (
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-neutral-500" />
                                <span className="font-medium">Cliente:</span>
                                <span>{request.profiles.full_name}</span>
                              </div>
                            )}

                            {request.properties && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-neutral-500" />
                                <span className="font-medium">Ubicación:</span>
                                <span>{request.properties.city}</span>
                              </div>
                            )}

                            {(request.budget_range_min || request.budget_range_max) && (
                              <div className="flex items-center gap-2">
                                <Euro className="h-4 w-4 text-neutral-500" />
                                <span className="font-medium">Presupuesto:</span>
                                <span>
                                  {formatCurrency(request.budget_range_min || 0)} - 
                                  {formatCurrency(request.budget_range_max || 0)}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-neutral-500" />
                              <span className="font-medium">Publicado:</span>
                              <span>{formatDate(request.created_at!)}</span>
                            </div>

                            {request.deadline_date && (
                              <div className="flex items-center gap-2">
                                <Timer className="h-4 w-4 text-neutral-500" />
                                <span className="font-medium">Fecha límite:</span>
                                <span>{formatDate(request.deadline_date)}</span>
                              </div>
                            )}

                            {request.preferred_date && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-neutral-500" />
                                <span className="font-medium">Fecha preferida:</span>
                                <span>{formatDate(request.preferred_date)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="ml-6 flex flex-col gap-2">
                          <Button 
                            onClick={() => openQuoteDialog(request)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Enviar Cotización
                          </Button>
                          
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                        </div>
                      </div>

                      {request.special_requirements && (
                        <>
                          <Separator className="my-4" />
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                              <div>
                                <span className="font-medium text-amber-800">Requisitos especiales:</span>
                                <p className="text-amber-700 text-sm mt-1">{request.special_requirements}</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* My Quotes Tab */}
        <TabsContent value="my-quotes" className="space-y-6">
          {myQuotes.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                <h3 className="text-lg font-semibold text-neutral-600 mb-2">
                  No has enviado cotizaciones aún
                </h3>
                <p className="text-neutral-500">
                  Explora las solicitudes disponibles y envía tu primera cotización.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {myQuotes.map((quote) => {
                const request = quote.budget_requests;
                if (!request) return null;

                const categoryInfo = getCategoryDisplay(request.category);
                const urgencyInfo = getUrgencyDisplay(request.urgency);

                return (
                  <Card key={quote.id} className="hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-neutral-900">
                              {request.title}
                            </h3>
                            <Badge className={categoryInfo.color}>
                              {categoryInfo.icon} {categoryInfo.label}
                            </Badge>
                            <Badge className={urgencyInfo.color}>
                              {urgencyInfo.icon} {urgencyInfo.label}
                            </Badge>
                            {getStatusBadge(quote.status)}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-neutral-500" />
                              <span className="font-medium">Mi Cotización:</span>
                              <span className="text-green-600 font-semibold">
                                {formatCurrency(quote.amount)}
                              </span>
                            </div>

                            {quote.estimated_duration && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-neutral-500" />
                                <span className="font-medium">Duración estimada:</span>
                                <span>{quote.estimated_duration}</span>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-neutral-500" />
                              <span className="font-medium">Enviada:</span>
                              <span>{formatDate(quote.created_at!)}</span>
                            </div>

                            {quote.valid_until && (
                              <div className="flex items-center gap-2">
                                <Timer className="h-4 w-4 text-neutral-500" />
                                <span className="font-medium">Válida hasta:</span>
                                <span>{formatDate(quote.valid_until)}</span>
                              </div>
                            )}
                          </div>

                          {request.profiles && (
                            <div className="flex items-center gap-2 text-sm text-neutral-600">
                              <Users className="h-4 w-4" />
                              <span>Cliente: {request.profiles.full_name}</span>
                              {request.properties && (
                                <>
                                  <span className="mx-2">•</span>
                                  <MapPin className="h-4 w-4" />
                                  <span>{request.properties.city}</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="ml-6 flex flex-col gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                          
                          {request.profiles?.email && (
                            <Button variant="outline" size="sm">
                              <Mail className="h-4 w-4 mr-2" />
                              Contactar
                            </Button>
                          )}
                        </div>
                      </div>

                      {quote.description && (
                        <>
                          <Separator className="my-4" />
                          <div className="bg-neutral-50 rounded-lg p-3">
                            <h4 className="font-medium text-neutral-800 mb-2">Mi propuesta:</h4>
                            <p className="text-neutral-700 text-sm">{quote.description}</p>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Quote Creation Dialog */}
      <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-green-600" />
              Crear Cotización para: {selectedRequest?.title}
            </DialogTitle>
            <DialogDescription>
              Completa todos los detalles de tu cotización para este proyecto
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Request Summary */}
              <Card className="bg-neutral-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Resumen del Proyecto:</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Descripción:</span> {selectedRequest.description}</p>
                    {selectedRequest.properties && (
                      <p><span className="font-medium">Ubicación:</span> {selectedRequest.properties.address}, {selectedRequest.properties.city}</p>
                    )}
                    {(selectedRequest.budget_range_min || selectedRequest.budget_range_max) && (
                      <p><span className="font-medium">Presupuesto del cliente:</span> {formatCurrency(selectedRequest.budget_range_min || 0)} - {formatCurrency(selectedRequest.budget_range_max || 0)}</p>
                    )}
                    {selectedRequest.preferred_date && (
                      <p><span className="font-medium">Fecha preferida:</span> {formatDate(selectedRequest.preferred_date)}</p>
                    )}
                    {selectedRequest.special_requirements && (
                      <p><span className="font-medium">Requisitos especiales:</span> {selectedRequest.special_requirements}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quote Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="quote-amount">Precio Total (€) *</Label>
                    <Input
                      id="quote-amount"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="1500.00"
                      value={quoteData.amount}
                      onChange={(e) => setQuoteData(prev => ({ ...prev, amount: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="quote-materials">Coste de Materiales (€)</Label>
                    <Input
                      id="quote-materials"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="500.00"
                      value={quoteData.materials_cost}
                      onChange={(e) => setQuoteData(prev => ({ ...prev, materials_cost: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="quote-labor">Coste de Mano de Obra (€)</Label>
                    <Input
                      id="quote-labor"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="1000.00"
                      value={quoteData.labor_cost}
                      onChange={(e) => setQuoteData(prev => ({ ...prev, labor_cost: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="quote-valid-until">Válida Hasta</Label>
                    <Input
                      id="quote-valid-until"
                      type="date"
                      value={quoteData.valid_until}
                      onChange={(e) => setQuoteData(prev => ({ ...prev, valid_until: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="quote-description">Descripción del Trabajo *</Label>
                    <Textarea
                      id="quote-description"
                      rows={4}
                      placeholder="Describe detalladamente el trabajo que realizarás, materiales incluidos, garantías, etc..."
                      value={quoteData.description}
                      onChange={(e) => setQuoteData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="quote-terms">Términos y Condiciones</Label>
                    <Textarea
                      id="quote-terms"
                      rows={3}
                      placeholder="Condiciones de pago, garantías, etc..."
                      value={quoteData.terms_and_conditions}
                      onChange={(e) => setQuoteData(prev => ({ ...prev, terms_and_conditions: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="quote-notes">Notas Adicionales</Label>
                    <Textarea
                      id="quote-notes"
                      rows={2}
                      placeholder="Cualquier información adicional relevante..."
                      value={quoteData.notes}
                      onChange={(e) => setQuoteData(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowQuoteDialog(false)}
              disabled={submittingQuote}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmitQuote}
              disabled={submittingQuote || !quoteData.amount || !quoteData.description}
              className="bg-green-600 hover:bg-green-700"
            >
              {submittingQuote ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Enviar Cotización
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
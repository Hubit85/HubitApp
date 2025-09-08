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
  Search, Filter, MapPin, Clock, Euro, AlertTriangle, CheckCircle, 
  Send, Eye, MessageSquare, Calendar, Building, User, Star,
  Loader2, RefreshCw, FileText, Image as ImageIcon, Plus
} from "lucide-react";
import { BudgetRequest, Quote } from "@/integrations/supabase/types";

interface ExtendedBudgetRequest extends BudgetRequest {
  user_name?: string;
  property_name?: string;
  property_address?: string;
  distance?: number;
  quote_count?: number;
  my_quote?: Quote | null;
}

interface QuoteFormData {
  amount: number;
  labor_cost: number;
  materials_cost: number;
  description: string;
  estimated_duration: string;
  estimated_start_date: string;
  payment_terms: string;
  warranty_period: string;
  notes: string;
  valid_until: string;
  terms_and_conditions: string;
}

export function BudgetRequestManager() {
  const { user, activeRole } = useSupabaseAuth();
  const [budgetRequests, setBudgetRequests] = useState<ExtendedBudgetRequest[]>([]);
  const [myQuotes, setMyQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<ExtendedBudgetRequest | null>(null);
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentTab, setCurrentTab] = useState("available");
  const [serviceProvider, setServiceProvider] = useState<any>(null);

  const [quoteForm, setQuoteForm] = useState<QuoteFormData>({
    amount: 0,
    labor_cost: 0,
    materials_cost: 0,
    description: "",
    estimated_duration: "",
    estimated_start_date: "",
    payment_terms: "50% al inicio, 50% al completar",
    warranty_period: "12 meses",
    notes: "",
    valid_until: "",
    terms_and_conditions: ""
  });

  useEffect(() => {
    if (user && activeRole?.role_type === 'service_provider') {
      loadServiceProviderData();
    }
  }, [user, activeRole]);

  const loadServiceProviderData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError("");

      console.log("🔍 Loading service provider data for user:", user.id.substring(0, 8) + '...');

      // Get service provider record
      const { data: providerData, error: providerError } = await supabase
        .from('service_providers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (providerError) {
        console.error("❌ Error loading service provider:", providerError);
        throw new Error(`Error cargando perfil de proveedor: ${providerError.message}`);
      }

      console.log("✅ Service provider loaded:", {
        providerId: providerData.id.substring(0, 8) + '...',
        companyName: providerData.company_name,
        serviceCategories: providerData.service_categories
      });

      setServiceProvider(providerData);

      // Load budget requests and my quotes in parallel
      const [requestsResult, quotesResult] = await Promise.all([
        loadAvailableBudgetRequests(providerData),
        loadMyQuotes(providerData.id)
      ]);

      if (requestsResult.success) {
        setBudgetRequests(requestsResult.data);
        console.log("✅ Budget requests loaded:", requestsResult.data.length);
      } else {
        console.warn("⚠️ Failed to load budget requests:", requestsResult.message);
        setError(requestsResult.message || "Error al cargar solicitudes");
      }

      if (quotesResult.success) {
        setMyQuotes(quotesResult.data);
        console.log("✅ My quotes loaded:", quotesResult.data.length);
      }

    } catch (err) {
      console.error("❌ Error loading service provider data:", err);
      setError(err instanceof Error ? err.message : "Error al cargar datos del proveedor");
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableBudgetRequests = async (provider: any) => {
    try {
      console.log("🔍 Loading available budget requests...");

      // IMPROVED QUERY: First get all published requests without category filtering
      const { data: allRequests, error } = await supabase
        .from('budget_requests')
        .select(`
          *,
          properties (
            name,
            address,
            city,
            user_id
          ),
          profiles (
            full_name
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(100);

      console.log("📊 Raw query results:", {
        total_requests: allRequests?.length || 0,
        sample_data: allRequests?.slice(0, 2).map(r => ({
          title: r.title,
          category: r.category,
          status: r.status,
          created: r.created_at?.substring(0, 10)
        })) || [],
        query_error: error?.message || 'none'
      });

      if (error) {
        console.error("❌ Database query error:", error);
        throw error;
      }

      if (!allRequests || allRequests.length === 0) {
        console.log("⚠️ No published budget requests found in database");
        return { success: true, data: [], message: "No hay solicitudes publicadas disponibles" };
      }

      // APPLY FILTERING ONLY AFTER SUCCESSFUL QUERY
      let filteredRequests = allRequests;

      // Remove expired requests
      const now = new Date();
      filteredRequests = filteredRequests.filter(request => {
        if (!request.expires_at) return true; // No expiration = always valid
        return new Date(request.expires_at) > now;
      });

      console.log("⏰ After expiration filter:", filteredRequests.length, "requests remaining");

      // OPTIONAL: Apply service category filter only if provider has specific categories
      if (provider.service_categories && 
          Array.isArray(provider.service_categories) && 
          provider.service_categories.length > 0) {
        
        const validCategories = provider.service_categories.filter((cat: string) => 
          typeof cat === 'string' && cat.trim().length > 0
        );

        console.log("🔧 Provider service categories:", validCategories);

        if (validCategories.length > 0) {
          const categoryFiltered = filteredRequests.filter(request => 
            validCategories.some((cat: string) => 
              cat.toLowerCase() === request.category.toLowerCase()
            )
          );

          console.log("📋 Category filtering results:", {
            before_filter: filteredRequests.length,
            after_filter: categoryFiltered.length,
            showing_all: categoryFiltered.length === 0 ? "YES - too restrictive" : "NO"
          });

          // If category filtering is too restrictive, show all valid requests
          if (categoryFiltered.length === 0) {
            console.log("⚠️ Category filter too restrictive, showing all valid requests");
          } else {
            filteredRequests = categoryFiltered;
          }
        }
      } else {
        console.log("📋 No specific service categories defined, showing all requests");
      }

      // Enhance requests with additional data
      const enhancedRequests = await Promise.all(
        filteredRequests.map(async (request: any) => {
          try {
            // Check for existing quote from this provider
            const { data: existingQuote, error: quoteError } = await supabase
              .from('quotes')
              .select('*')
              .eq('budget_request_id', request.id)
              .eq('service_provider_id', provider.id)
              .maybeSingle();

            if (quoteError && quoteError.code !== 'PGRST116') {
              console.warn(`⚠️ Error checking quote for request ${request.id}:`, quoteError.message);
            }

            return {
              ...request,
              user_name: request.profiles?.full_name || 'Usuario',
              property_name: request.properties?.name || 'Propiedad',
              property_address: request.properties?.address || request.work_location || '',
              my_quote: existingQuote || null,
              quote_count: 0
            };
          } catch (enhanceError) {
            console.warn(`⚠️ Error enhancing request ${request.id}:`, enhanceError);
            return {
              ...request,
              user_name: 'Usuario',
              property_name: 'Propiedad',
              property_address: request.work_location || '',
              my_quote: null,
              quote_count: 0
            };
          }
        })
      );

      console.log("✅ Enhanced requests prepared:", {
        total: enhancedRequests.length,
        with_existing_quotes: enhancedRequests.filter(r => r.my_quote).length,
        categories: Array.from(new Set(enhancedRequests.map(r => r.category))),
        titles: enhancedRequests.slice(0, 3).map(r => r.title)
      });

      return { success: true, data: enhancedRequests };

    } catch (error) {
      console.error("❌ Error loading budget requests:", error);
      return { 
        success: false, 
        data: [], 
        message: error instanceof Error ? error.message : "Error al cargar solicitudes de presupuesto"
      };
    }
  };

  const loadMyQuotes = async (providerId: string) => {
    try {
      console.log("💰 Loading my quotes for provider:", providerId.substring(0, 8) + '...');

      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          budget_requests (
            title,
            description,
            status,
            category,
            properties (
              name,
              address
            ),
            profiles (
              full_name
            )
          )
        `)
        .eq('service_provider_id', providerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("❌ Error loading quotes:", error);
        throw error;
      }

      console.log("✅ Quotes loaded successfully:", {
        total_quotes: data?.length || 0,
        by_status: data?.reduce((acc: any, quote) => {
          acc[quote.status] = (acc[quote.status] || 0) + 1;
          return acc;
        }, {}) || {}
      });

      return { success: true, data: data || [] };

    } catch (error) {
      console.error("❌ Error loading my quotes:", error);
      return { success: false, data: [] };
    }
  };

  const handleCreateQuote = async () => {
    if (!selectedRequest || !serviceProvider) return;

    try {
      setSubmitting(true);
      setError("");

      console.log("📝 Creating quote for request:", selectedRequest.title);

      // Validate form
      if (!quoteForm.amount || !quoteForm.description) {
        throw new Error("Monto y descripción son obligatorios");
      }

      // Prepare quote data
      const quoteData = {
        budget_request_id: selectedRequest.id,
        service_provider_id: serviceProvider.id,
        amount: quoteForm.amount,
        labor_cost: quoteForm.labor_cost,
        materials_cost: quoteForm.materials_cost,
        description: quoteForm.description,
        estimated_duration: quoteForm.estimated_duration || null,
        estimated_start_date: quoteForm.estimated_start_date || null,
        payment_terms: quoteForm.payment_terms,
        warranty_period: quoteForm.warranty_period || null,
        notes: quoteForm.notes || null,
        valid_until: quoteForm.valid_until || null,
        terms_and_conditions: quoteForm.terms_and_conditions || null,
        status: 'pending' as const,
        viewed_by_client: false,
        created_at: new Date().toISOString()
      };

      const { data: newQuote, error: createError } = await supabase
        .from('quotes')
        .insert(quoteData)
        .select()
        .single();

      if (createError) {
        console.error("❌ Error creating quote:", createError);
        throw createError;
      }

      console.log("✅ Quote created successfully:", newQuote.id);

      // Create notification for the client
      try {
        await supabase
          .from('notifications')
          .insert({
            user_id: selectedRequest.user_id,
            title: 'Nueva cotización recibida',
            message: `Has recibido una nueva cotización para "${selectedRequest.title}" por €${quoteForm.amount}`,
            type: 'info' as const,
            category: 'quote' as const,
            related_entity_type: 'quote',
            related_entity_id: newQuote.id,
            action_url: `/dashboard?quote=${newQuote.id}`,
            action_label: 'Ver Cotización',
            read: false
          });
        console.log("📧 Notification sent to client");
      } catch (notifError) {
        console.warn("⚠️ Failed to send notification:", notifError);
      }

      setSuccessMessage("¡Cotización enviada exitosamente!");
      setShowQuoteDialog(false);
      resetQuoteForm();
      
      // Refresh data
      await loadServiceProviderData();

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);

    } catch (err) {
      console.error("❌ Error creating quote:", err);
      setError(err instanceof Error ? err.message : "Error al crear la cotización");
    } finally {
      setSubmitting(false);
    }
  };

  const resetQuoteForm = () => {
    setQuoteForm({
      amount: 0,
      labor_cost: 0,
      materials_cost: 0,
      description: "",
      estimated_duration: "",
      estimated_start_date: "",
      payment_terms: "50% al inicio, 50% al completar",
      warranty_period: "12 meses",
      notes: "",
      valid_until: "",
      terms_and_conditions: ""
    });
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      'cleaning': '🧽',
      'plumbing': '🔧',
      'electrical': '⚡',
      'gardening': '🌱',
      'painting': '🎨',
      'maintenance': '🛠️',
      'security': '🛡️',
      'hvac': '🌡️',
      'carpentry': '🪵',
      'emergency': '🚨',
      'other': '📋'
    };
    return icons[category] || '📋';
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return <Badge className="bg-red-100 text-red-800 border-red-200">🚨 Emergencia</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">🔥 Alta</Badge>;
      case 'normal':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">📅 Normal</Badge>;
      case 'low':
        return <Badge variant="outline">🕐 Baja</Badge>;
      default:
        return <Badge variant="outline">{urgency}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">⏳ Pendiente</Badge>;
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800 border-green-200">✅ Aceptada</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">❌ Rechazada</Badge>;
      case 'expired':
        return <Badge variant="outline">⏰ Expirada</Badge>;
      case 'cancelled':
        return <Badge variant="outline">🚫 Cancelada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredRequests = budgetRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || request.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredQuotes = myQuotes.filter(quote => {
    const matchesSearch = (quote as any).budget_requests?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (!activeRole || activeRole.role_type !== 'service_provider') {
    return (
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/60">
        <CardContent className="text-center p-8">
          <Building className="h-12 w-12 mx-auto mb-4 text-amber-600" />
          <h3 className="text-lg font-semibold text-amber-900 mb-2">Acceso Restringido</h3>
          <p className="text-sm text-amber-700">
            Esta sección está disponible solo para proveedores de servicios.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-pulse text-center">
            <Loader2 className="h-10 w-10 mx-auto mb-3 animate-spin text-blue-600" />
            <p className="text-sm text-neutral-600">Cargando solicitudes de presupuesto...</p>
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
              <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">Gestión de Presupuestos</CardTitle>
                <CardDescription className="mt-1">
                  Encuentra oportunidades de negocio y gestiona tus cotizaciones
                </CardDescription>
              </div>
            </div>
            
            <Button 
              onClick={loadServiceProviderData}
              disabled={loading}
              variant="outline"
              size="sm"
              className="bg-transparent hover:bg-blue-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
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

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/60">
              <div className="flex items-center gap-3">
                <Search className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-900">{filteredRequests.length}</div>
                  <div className="text-sm text-blue-600">Solicitudes Disponibles</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200/60">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-emerald-600" />
                <div>
                  <div className="text-2xl font-bold text-emerald-900">{myQuotes.length}</div>
                  <div className="text-sm text-emerald-600">Mis Cotizaciones</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200/60">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-amber-600" />
                <div>
                  <div className="text-2xl font-bold text-amber-900">
                    {myQuotes.filter(q => q.status === 'accepted').length}
                  </div>
                  <div className="text-sm text-amber-600">Cotizaciones Aceptadas</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/60">
              <div className="flex items-center gap-3">
                <Euro className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-purple-900">
                    €{myQuotes.reduce((sum, q) => sum + (q.status === 'accepted' ? q.amount : 0), 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-purple-600">Valor Aceptado</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Buscar por título o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="cleaning">Limpieza</SelectItem>
                <SelectItem value="plumbing">Fontanería</SelectItem>
                <SelectItem value="electrical">Electricidad</SelectItem>
                <SelectItem value="gardening">Jardinería</SelectItem>
                <SelectItem value="painting">Pintura</SelectItem>
                <SelectItem value="maintenance">Mantenimiento</SelectItem>
                <SelectItem value="security">Seguridad</SelectItem>
                <SelectItem value="hvac">Climatización</SelectItem>
                <SelectItem value="carpentry">Carpintería</SelectItem>
                <SelectItem value="emergency">Emergencia</SelectItem>
                <SelectItem value="other">Otros</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="published">Publicadas</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="accepted">Aceptadas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="available">
                Solicitudes Disponibles ({filteredRequests.length})
              </TabsTrigger>
              <TabsTrigger value="my-quotes">
                Mis Cotizaciones ({filteredQuotes.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="space-y-4 mt-6">
              {filteredRequests.length === 0 ? (
                <Card className="p-8 text-center">
                  <Search className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                  <h4 className="font-medium text-neutral-600 mb-2">No hay solicitudes disponibles</h4>
                  <p className="text-sm text-neutral-500">
                    {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' 
                      ? "Ajusta los filtros para ver más resultados"
                      : "No hay solicitudes de presupuesto disponibles en este momento"
                    }
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredRequests.map(request => (
                    <Card key={request.id} className="p-6 border hover:border-neutral-300 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-2xl">{getCategoryIcon(request.category)}</div>
                            <div>
                              <h3 className="text-lg font-semibold text-neutral-900">{request.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-neutral-600">
                                <User className="h-4 w-4" />
                                <span>{request.user_name}</span>
                                <Separator orientation="vertical" className="h-4" />
                                <MapPin className="h-4 w-4" />
                                <span>{request.property_address || request.work_location}</span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-neutral-700 mb-4 line-clamp-3">{request.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm">
                            {getUrgencyBadge(request.urgency)}
                            
                            {request.budget_range_min && request.budget_range_max && (
                              <div className="flex items-center gap-1 text-green-600">
                                <Euro className="h-4 w-4" />
                                <span>€{request.budget_range_min} - €{request.budget_range_max}</span>
                              </div>
                            )}
                            
                            {request.deadline_date && (
                              <div className="flex items-center gap-1 text-neutral-600">
                                <Calendar className="h-4 w-4" />
                                <span>Fecha límite: {new Date(request.deadline_date).toLocaleDateString()}</span>
                              </div>
                            )}

                            {request.views_count > 0 && (
                              <div className="flex items-center gap-1 text-neutral-500">
                                <Eye className="h-4 w-4" />
                                <span>{request.views_count} vistas</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          {request.my_quote ? (
                            <div className="text-center">
                              {getStatusBadge(request.my_quote.status)}
                              <p className="text-sm text-neutral-600 mt-1">
                                Tu oferta: €{request.my_quote.amount}
                              </p>
                            </div>
                          ) : (
                            <Dialog open={showQuoteDialog && selectedRequest?.id === request.id} onOpenChange={(open) => {
                              setShowQuoteDialog(open);
                              if (!open) setSelectedRequest(null);
                            }}>
                              <DialogTrigger asChild>
                                <Button
                                  onClick={() => setSelectedRequest(request)}
                                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                >
                                  <Send className="h-4 w-4 mr-2" />
                                  Cotizar
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Crear Cotización</DialogTitle>
                                  <DialogDescription>
                                    Envía tu propuesta para "{request.title}"
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-6">
                                  {/* Request Summary */}
                                  <Card className="p-4 bg-neutral-50">
                                    <h4 className="font-medium mb-2">Resumen de la solicitud</h4>
                                    <div className="text-sm space-y-1">
                                      <p><span className="font-medium">Cliente:</span> {request.user_name}</p>
                                      <p><span className="font-medium">Ubicación:</span> {request.property_address}</p>
                                      <p><span className="font-medium">Categoría:</span> {request.category}</p>
                                      <p><span className="font-medium">Urgencia:</span> {request.urgency}</p>
                                      <p><span className="font-medium">Descripción:</span> {request.description}</p>
                                    </div>
                                  </Card>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Pricing Section */}
                                    <div className="space-y-4">
                                      <h4 className="font-medium text-lg">Cotización</h4>
                                      
                                      <div className="space-y-4">
                                        <div>
                                          <Label htmlFor="labor_cost">Costo de Mano de Obra (€)</Label>
                                          <Input
                                            id="labor_cost"
                                            type="number"
                                            step="0.01"
                                            value={quoteForm.labor_cost || ""}
                                            onChange={(e) => {
                                              const value = parseFloat(e.target.value) || 0;
                                              setQuoteForm(prev => ({ 
                                                ...prev, 
                                                labor_cost: value,
                                                amount: value + prev.materials_cost
                                              }));
                                            }}
                                          />
                                        </div>

                                        <div>
                                          <Label htmlFor="materials_cost">Costo de Materiales (€)</Label>
                                          <Input
                                            id="materials_cost"
                                            type="number"
                                            step="0.01"
                                            value={quoteForm.materials_cost || ""}
                                            onChange={(e) => {
                                              const value = parseFloat(e.target.value) || 0;
                                              setQuoteForm(prev => ({ 
                                                ...prev, 
                                                materials_cost: value,
                                                amount: prev.labor_cost + value
                                              }));
                                            }}
                                          />
                                        </div>

                                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                          <Label className="text-lg font-semibold text-blue-900">
                                            Total: €{quoteForm.amount.toFixed(2)}
                                          </Label>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Details Section */}
                                    <div className="space-y-4">
                                      <h4 className="font-medium text-lg">Detalles del Servicio</h4>
                                      
                                      <div>
                                        <Label htmlFor="estimated_duration">Duración Estimada</Label>
                                        <Input
                                          id="estimated_duration"
                                          placeholder="ej: 2-3 días hábiles"
                                          value={quoteForm.estimated_duration}
                                          onChange={(e) => setQuoteForm(prev => ({ ...prev, estimated_duration: e.target.value }))}
                                        />
                                      </div>

                                      <div>
                                        <Label htmlFor="estimated_start_date">Fecha de Inicio Estimada</Label>
                                        <Input
                                          id="estimated_start_date"
                                          type="date"
                                          value={quoteForm.estimated_start_date}
                                          onChange={(e) => setQuoteForm(prev => ({ ...prev, estimated_start_date: e.target.value }))}
                                        />
                                      </div>

                                      <div>
                                        <Label htmlFor="valid_until">Validez de la Cotización</Label>
                                        <Input
                                          id="valid_until"
                                          type="date"
                                          value={quoteForm.valid_until}
                                          onChange={(e) => setQuoteForm(prev => ({ ...prev, valid_until: e.target.value }))}
                                        />
                                      </div>

                                      <div>
                                        <Label htmlFor="warranty_period">Período de Garantía</Label>
                                        <Input
                                          id="warranty_period"
                                          value={quoteForm.warranty_period}
                                          onChange={(e) => setQuoteForm(prev => ({ ...prev, warranty_period: e.target.value }))}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="description">Descripción del Trabajo *</Label>
                                      <Textarea
                                        id="description"
                                        placeholder="Describe detalladamente el trabajo que realizarás..."
                                        value={quoteForm.description}
                                        onChange={(e) => setQuoteForm(prev => ({ ...prev, description: e.target.value }))}
                                        rows={4}
                                      />
                                    </div>

                                    <div>
                                      <Label htmlFor="payment_terms">Términos de Pago</Label>
                                      <Input
                                        id="payment_terms"
                                        value={quoteForm.payment_terms}
                                        onChange={(e) => setQuoteForm(prev => ({ ...prev, payment_terms: e.target.value }))}
                                      />
                                    </div>

                                    <div>
                                      <Label htmlFor="notes">Notas Adicionales</Label>
                                      <Textarea
                                        id="notes"
                                        placeholder="Información adicional o consideraciones especiales..."
                                        value={quoteForm.notes}
                                        onChange={(e) => setQuoteForm(prev => ({ ...prev, notes: e.target.value }))}
                                        rows={3}
                                      />
                                    </div>

                                    <div>
                                      <Label htmlFor="terms_and_conditions">Términos y Condiciones</Label>
                                      <Textarea
                                        id="terms_and_conditions"
                                        placeholder="Términos específicos del servicio..."
                                        value={quoteForm.terms_and_conditions}
                                        onChange={(e) => setQuoteForm(prev => ({ ...prev, terms_and_conditions: e.target.value }))}
                                        rows={3}
                                      />
                                    </div>
                                  </div>
                                </div>
                                
                                <DialogFooter className="mt-6">
                                  <Button 
                                    variant="outline" 
                                    onClick={() => setShowQuoteDialog(false)}
                                    disabled={submitting}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button 
                                    onClick={handleCreateQuote}
                                    disabled={!quoteForm.amount || !quoteForm.description || submitting}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                  >
                                    {submitting ? (
                                      <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Enviando...
                                      </>
                                    ) : (
                                      <>
                                        <Send className="h-4 w-4 mr-2" />
                                        Enviar Cotización (€{quoteForm.amount.toFixed(2)})
                                      </>
                                    )}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                          
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="my-quotes" className="space-y-4 mt-6">
              {filteredQuotes.length === 0 ? (
                <Card className="p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                  <h4 className="font-medium text-neutral-600 mb-2">No has enviado cotizaciones aún</h4>
                  <p className="text-sm text-neutral-500">
                    Busca solicitudes de presupuesto en la pestaña anterior para comenzar a enviar cotizaciones.
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredQuotes.map(quote => (
                    <Card key={quote.id} className="p-6 border hover:border-neutral-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-2xl">{getCategoryIcon((quote as any).budget_requests?.category || 'other')}</div>
                            <div>
                              <h3 className="text-lg font-semibold text-neutral-900">
                                {(quote as any).budget_requests?.title || 'Solicitud de Presupuesto'}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-neutral-600">
                                <User className="h-4 w-4" />
                                <span>{(quote as any).budget_requests?.profiles?.full_name || 'Cliente'}</span>
                                <Separator orientation="vertical" className="h-4" />
                                <MapPin className="h-4 w-4" />
                                <span>{(quote as any).budget_requests?.properties?.address || 'Ubicación'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-neutral-700 mb-4">{quote.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm">
                            {getStatusBadge(quote.status)}
                            
                            <div className="flex items-center gap-1 text-green-600 font-semibold">
                              <Euro className="h-4 w-4" />
                              <span>€{quote.amount.toLocaleString()}</span>
                            </div>
                            
                            <div className="flex items-center gap-1 text-neutral-600">
                              <Calendar className="h-4 w-4" />
                              <span>Enviada: {new Date(quote.created_at).toLocaleDateString()}</span>
                            </div>

                            {quote.valid_until && (
                              <div className="flex items-center gap-1 text-neutral-600">
                                <Clock className="h-4 w-4" />
                                <span>Válida hasta: {new Date(quote.valid_until).toLocaleDateString()}</span>
                              </div>
                            )}

                            {!quote.viewed_by_client && (
                              <Badge variant="outline" className="text-blue-600">
                                <Eye className="h-3 w-3 mr-1" />
                                No vista
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                          
                          {quote.status === 'pending' && (
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Mensaje Cliente
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

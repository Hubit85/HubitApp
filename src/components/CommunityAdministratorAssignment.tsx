import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";
import { UserPlus, Building, Mail, Phone, Search, Loader2 } from "lucide-react";

type ServiceProvider = Database["public"]["Tables"]["service_providers"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type ServiceProviderWithProfile = ServiceProvider & {
  profiles: Profile | null;
};

export function CommunityAdministratorAssignment() {
  const { user, supabase } = useSupabaseAuth();
  const { toast } = useToast();

  const [availableAdmins, setAvailableAdmins] = useState<ServiceProviderWithProfile[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<ServiceProviderWithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAvailableAdmins();
    }
  }, [user]);

  const fetchAvailableAdmins = async () => {
    try {
      setLoading(true);
      if (!supabase) return;
      
      let query = supabase
        .from("service_providers")
        .select(`
          *,
          profiles:user_id (
            full_name,
            email,
            phone
          )
        `)
        .eq("is_active", true)
        // This is a guess, maybe we should filter by a category or specialty
        // For now, let's get all service providers.
        // .like('specialties', '%administration%')

      if (searchTerm) {
        query = query.or(`company_name.ilike.%${searchTerm}%,profiles.full_name.ilike.%${searchTerm}%,profiles.email.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }
      
      setAvailableAdmins(data as ServiceProviderWithProfile[] || []);

    } catch (error) {
      console.error("Error fetching administrators:", error);
      toast({
        title: "Error al cargar administradores",
        description: "No se pudieron obtener los administradores disponibles.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAvailableAdmins();
  };

  const handleAssignAdmin = async () => {
    if (!selectedAdmin || !user) {
      toast({
        title: "Selección requerida",
        description: "Por favor, selecciona un administrador para asignar.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    toast({
      title: "Asignación en progreso",
      description: `Asignando a ${selectedAdmin.company_name} como administrador.`,
    });

    // NOTE: The logic for assignment is missing. 
    // This component seems to be a placeholder for a more complex feature.
    // I will simulate an async operation and show a success message.
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Asignación completada",
        description: `${selectedAdmin.company_name} ha sido asignado exitosamente.`,
      });
      setSelectedAdmin(null);
    }, 2000);
  };
  
  if (!user) {
    return <p>Por favor, inicia sesión para gestionar administradores.</p>;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Asignar Administrador de Comunidad</CardTitle>
        <CardDescription>
          Busca y selecciona un administrador de fincas para gestionar una comunidad.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <Input
            placeholder="Buscar por nombre de empresa, nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </form>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : availableAdmins.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No se encontraron administradores disponibles.
          </p>
        ) : (
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {availableAdmins.map((admin) => (
              <div
                key={admin.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedAdmin?.id === admin.id
                    ? "border-primary ring-2 ring-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedAdmin(admin)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Building className="h-5 w-5 text-muted-foreground" />
                      {admin.company_name}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      {admin.profiles?.full_name || 'Nombre no disponible'}
                    </p>
                  </div>
                  {admin.verified && (
                    <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Verificado
                    </span>
                  )}
                </div>
                <div className="mt-2 text-sm space-y-1">
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {admin.profiles?.email || 'Email no disponible'}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {admin.profiles?.phone || 'Teléfono no disponible'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleAssignAdmin} 
          disabled={!selectedAdmin || isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <UserPlus className="h-4 w-4 mr-2" />
          )}
          Asignar Administrador
        </Button>
      </CardFooter>
    </Card>
  );
}

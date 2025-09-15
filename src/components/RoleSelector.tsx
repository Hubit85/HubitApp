
import { useState } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { SupabaseUserRoleService, UserRole } from "@/services/SupabaseUserRoleService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CheckCircle, ChevronDown, User, Users, Building, Settings, RefreshCw } from "lucide-react";

interface RoleSelectorProps {
  compact?: boolean;
  showLabel?: boolean;
  onRoleChange?: (role: UserRole) => void;
}

export default function RoleSelector({ compact = false, showLabel = true, onRoleChange }: RoleSelectorProps) {
  const { userRoles, activeRole, activateRole, refreshRoles } = useSupabaseAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [switching, setSwitching] = useState(false);

  const verifiedRoles = userRoles.filter(r => r.is_verified === true);

  const getRoleIcon = (roleType: UserRole['role_type']) => {
    switch (roleType) {
      case 'particular': return <User className="h-4 w-4" />;
      case 'community_member': return <Users className="h-4 w-4" />;
      case 'service_provider': return <Building className="h-4 w-4" />;
      case 'property_administrator': return <Settings className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (roleType: UserRole['role_type']) => {
    switch (roleType) {
      case 'particular': return "text-blue-700 bg-blue-50 border-blue-200";
      case 'community_member': return "text-purple-700 bg-purple-50 border-purple-200";
      case 'service_provider': return "text-orange-700 bg-orange-50 border-orange-200";
      case 'property_administrator': return "text-indigo-700 bg-indigo-50 border-indigo-200";
      default: return "text-neutral-700 bg-neutral-50 border-neutral-200";
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    if (role.is_active) {
      setIsOpen(false);
      return;
    }

    setSelectedRole(role);
    setIsOpen(false);
    setShowConfirmDialog(true);
  };

  const confirmRoleSwitch = async () => {
    if (!selectedRole) return;

    try {
      setSwitching(true);
      const result = await activateRole(selectedRole.role_type);

      if (result.success) {
        setShowConfirmDialog(false);
        await refreshRoles();
        onRoleChange?.(selectedRole);
        
        // Reload page to reflect changes
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Error switching role:", error);
    } finally {
      setSwitching(false);
      setSelectedRole(null);
    }
  };

  if (!activeRole || verifiedRoles.length <= 1) {
    return null;
  }

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`${
              compact 
                ? "h-8 px-2" 
                : "h-10 px-3"
            } bg-white hover:bg-neutral-50 border-neutral-200 shadow-sm`}
          >
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded ${getRoleColor(activeRole.role_type)}`}>
                {getRoleIcon(activeRole.role_type)}
              </div>
              {!compact && showLabel && (
                <span className="text-sm font-medium">
                  {SupabaseUserRoleService.getRoleDisplayName(activeRole.role_type)}
                </span>
              )}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-0" align="end">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm text-neutral-900">Cambiar rol</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshRoles}
                className="h-6 w-6 p-0"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>

            <div className="space-y-2">
              {verifiedRoles.map((role) => (
                <div
                  key={role.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    role.is_active
                      ? 'border-emerald-200 bg-emerald-50/50'
                      : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                  }`}
                  onClick={() => handleRoleSelect(role)}
                >
                  <div className={`p-2 rounded-lg ${
                    role.is_active 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : getRoleColor(role.role_type)
                  }`}>
                    {getRoleIcon(role.role_type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {SupabaseUserRoleService.getRoleDisplayName(role.role_type)}
                      </p>
                      {role.is_active && (
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">
                          <CheckCircle className="h-2.5 w-2.5 mr-1" />
                          Activo
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {role.role_type === 'particular' && 'Usuario individual'}
                      {role.role_type === 'community_member' && 'Miembro de comunidad'}
                      {role.role_type === 'service_provider' && 'Proveedor de servicios'}
                      {role.role_type === 'property_administrator' && 'Administrador de fincas'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-200">
              <p className="text-xs text-neutral-500">
                Tienes {verifiedRoles.length} roles disponibles. Solo uno puede estar activo.
              </p>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${selectedRole ? getRoleColor(selectedRole.role_type) : 'bg-neutral-100'}`}>
                {selectedRole && getRoleIcon(selectedRole.role_type)}
              </div>
              Confirmar cambio de rol
            </DialogTitle>
            <DialogDescription className="text-left">
              {selectedRole && (
                <>
                  ¿Cambiar a <strong>
                    {SupabaseUserRoleService.getRoleDisplayName(selectedRole.role_type)}
                  </strong>?
                  <br /><br />
                  <span className="text-sm text-neutral-600">
                    Esto actualizará tus permisos y las funcionalidades disponibles.
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmDialog(false);
                setSelectedRole(null);
              }}
              disabled={switching}
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmRoleSwitch}
              disabled={switching}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {switching ? "Cambiando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

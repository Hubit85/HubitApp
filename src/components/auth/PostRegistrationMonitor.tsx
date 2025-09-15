
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

interface PostRegistrationMonitorProps {
  onRolesVerified: (rolesCount: number) => void;
  onError: (error: string) => void;
  expectedRolesCount: number;
}

export function PostRegistrationMonitor({ 
  onRolesVerified, 
  onError, 
  expectedRolesCount 
}: PostRegistrationMonitorProps) {
  const { user } = useSupabaseAuth();

  useEffect(() => {
    if (!user?.id) return;

    const monitorRoleCreation = async () => {
      console.log('🔍 POST-REGISTRATION MONITOR: Starting role verification...');
      
      let attempts = 0;
      const maxAttempts = 10;
      const checkInterval = 2000; // 2 seconds

      const checkRoles = async (): Promise<boolean> => {
        attempts++;
        console.log(`🔍 MONITOR: Attempt ${attempts}/${maxAttempts} - Checking roles...`);

        try {
          const { data: roles, error } = await supabase
            .from('user_roles')
            .select('id, role_type, is_verified, is_active')
            .eq('user_id', user.id);

          if (error) {
            console.error('🔍 MONITOR: Error checking roles:', error);
            return false;
          }

          const rolesCount = roles?.length || 0;
          console.log(`🔍 MONITOR: Found ${rolesCount}/${expectedRolesCount} roles`);

          if (rolesCount >= expectedRolesCount) {
            console.log('✅ MONITOR: All expected roles found!');
            onRolesVerified(rolesCount);
            return true;
          }

          if (attempts >= maxAttempts) {
            console.error('🔍 MONITOR: Max attempts reached, roles still missing');
            
            if (rolesCount > 0) {
              // Partial success
              onRolesVerified(rolesCount);
              return true;
            } else {
              // Complete failure - attempt emergency recovery
              await attemptEmergencyRoleRecovery();
              return false;
            }
          }

          // Continue monitoring
          setTimeout(() => checkRoles(), checkInterval);
          return false;

        } catch (error) {
          console.error('🔍 MONITOR: Exception during role check:', error);
          
          if (attempts >= maxAttempts) {
            onError('Error verificando roles después del registro');
            return false;
          }

          setTimeout(() => checkRoles(), checkInterval);
          return false;
        }
      };

      const attemptEmergencyRoleRecovery = async () => {
        console.log('🆘 MONITOR: Attempting emergency role recovery...');

        try {
          // Get user's profile to determine primary role
          const { data: profile } = await supabase
            .from('profiles')
            .select('user_type, full_name, email')
            .eq('id', user.id)
            .single();

          if (profile && profile.user_type) {
            console.log('🆘 MONITOR: Creating emergency role:', profile.user_type);

            const emergencyRoleData = {
              user_id: user.id,
              role_type: profile.user_type as any,
              is_verified: true,
              is_active: true,
              role_specific_data: {
                full_name: profile.full_name || 'Usuario',
                phone: '',
                address: '',
                city: '',
                postal_code: '',
                country: 'España'
              },
              verification_confirmed_at: new Date().toISOString(),
              verification_token: null,
              verification_expires_at: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };

            const { data: emergencyRole, error: emergencyError } = await supabase
              .from('user_roles')
              .insert(emergencyRoleData)
              .select()
              .single();

            if (!emergencyError && emergencyRole) {
              console.log('✅ MONITOR: Emergency role created successfully');
              
              // Create notification
              try {
                await supabase
                  .from('notifications')
                  .insert({
                    user_id: user.id,
                    title: 'Configuración de cuenta completada',
                    message: 'Tu cuenta se ha configurado correctamente. Tu rol principal está activo.',
                    type: 'success' as const,
                    category: 'system' as const,
                    read: false
                  });
              } catch (notificationError) {
                console.warn('Could not create emergency notification:', notificationError);
              }

              onRolesVerified(1);
              return;
            }
          }

          onError('No se pudieron configurar los roles automáticamente. Contacta con soporte.');

        } catch (emergencyError) {
          console.error('🆘 MONITOR: Emergency recovery failed:', emergencyError);
          onError('Error durante la configuración automática de roles.');
        }
      };

      // Start monitoring
      checkRoles();
    };

    // Small delay to ensure registration process is complete
    const timeoutId = setTimeout(monitorRoleCreation, 1000);

    return () => clearTimeout(timeoutId);
  }, [user?.id, expectedRolesCount, onRolesVerified, onError]);

  return null; // This is a monitoring component, no UI
}

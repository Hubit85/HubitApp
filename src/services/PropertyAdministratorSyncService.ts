
import { supabase } from "@/integrations/supabase/client";

export interface PropertyAdministratorData {
  id: string;
  user_id: string;
  company_name: string;
  company_cif: string;
  contact_email: string;
  contact_phone?: string;
  license_number?: string;
}

/**
 * SERVICIO DE SINCRONIZACIÓN AUTOMÁTICA
 * Mantiene sincronizados los administradores de fincas entre:
 * - user_roles (tabla general de roles)
 * - property_administrators (tabla específica de administradores)
 */
export class PropertyAdministratorSyncService {
  
  /**
   * SINCRONIZACIÓN COMPLETA BIDIRECCIONAL
   * Asegura que todos los administradores estén en ambas tablas
   */
  static async syncAllPropertyAdministrators(): Promise<{
    success: boolean;
    message: string;
    synced_count: number;
    created_in_user_roles: number;
    created_in_property_administrators: number;
    errors: string[];
  }> {
    console.log('🔄 PROPERTY SYNC: Iniciando sincronización completa bidireccional...');
    
    const errors: string[] = [];
    let synced_count = 0;
    let created_in_user_roles = 0;
    let created_in_property_administrators = 0;

    try {
      // PASO 1: Obtener todos los administradores de user_roles
      console.log('📋 PROPERTY SYNC: Obteniendo administradores de user_roles...');
      const { data: userRoleAdmins, error: userRoleError } = await supabase
        .from('user_roles')
        .select(`
          id,
          user_id,
          role_specific_data,
          profiles:user_id (full_name, email, phone)
        `)
        .eq('role_type', 'property_administrator')
        .eq('is_verified', true);

      if (userRoleError) {
        console.error('❌ PROPERTY SYNC: Error cargando user_roles:', userRoleError);
        errors.push(`Error en user_roles: ${userRoleError.message}`);
      }

      // PASO 2: Obtener todos los administradores de property_administrators
      console.log('📋 PROPERTY SYNC: Obteniendo administradores de property_administrators...');
      const { data: propertyAdmins, error: propertyError } = await supabase
        .from('property_administrators')
        .select('*')
        .order('created_at', { ascending: false });

      if (propertyError) {
        console.error('❌ PROPERTY SYNC: Error cargando property_administrators:', propertyError);
        errors.push(`Error en property_administrators: ${propertyError.message}`);
      }

      console.log('📊 PROPERTY SYNC: Datos obtenidos:', {
        user_roles_count: userRoleAdmins?.length || 0,
        property_administrators_count: propertyAdmins?.length || 0
      });

      // PASO 3: Sincronizar user_roles -> property_administrators
      if (userRoleAdmins && userRoleAdmins.length > 0) {
        console.log('🔄 PROPERTY SYNC: Sincronizando user_roles -> property_administrators...');
        
        for (const userRole of userRoleAdmins) {
          try {
            const profile = userRole.profiles as any;
            const roleData = userRole.role_specific_data as any;
            
            // Verificar si ya existe en property_administrators
            const existsInPropertyTable = propertyAdmins?.some(pa => pa.user_id === userRole.user_id);
            
            if (!existsInPropertyTable) {
              console.log(`➕ PROPERTY SYNC: Creando en property_administrators para ${profile?.full_name || 'Usuario'}`);
              
              const { data: newPropertyAdmin, error: createError } = await supabase
                .from('property_administrators')
                .insert({
                  user_id: userRole.user_id,
                  company_name: roleData?.company_name || profile?.full_name || 'Administración de Fincas',
                  company_cif: roleData?.cif || roleData?.company_cif || this.generateTempCif(),
                  contact_email: roleData?.business_email || profile?.email || 'sin-email@temp.com',
                  contact_phone: roleData?.business_phone || profile?.phone || null,
                  license_number: roleData?.professional_number || roleData?.license_number || null
                })
                .select()
                .single();

              if (createError) {
                console.error(`❌ PROPERTY SYNC: Error creando property_administrator:`, createError);
                errors.push(`Error creando property_administrator: ${createError.message}`);
              } else {
                console.log(`✅ PROPERTY SYNC: Creado property_administrator: ${newPropertyAdmin?.company_name}`);
                created_in_property_administrators++;
                synced_count++;
              }
            } else {
              console.log(`✓ PROPERTY SYNC: Ya existe en property_administrators: ${profile?.full_name}`);
              synced_count++;
            }
          } catch (syncError) {
            console.error('❌ PROPERTY SYNC: Error en sincronización user_role:', syncError);
            errors.push(`Error sincronizando user_role: ${syncError}`);
          }
        }
      }

      // PASO 4: Sincronizar property_administrators -> user_roles
      if (propertyAdmins && propertyAdmins.length > 0) {
        console.log('🔄 PROPERTY SYNC: Sincronizando property_administrators -> user_roles...');
        
        for (const propertyAdmin of propertyAdmins) {
          try {
            // Verificar si ya existe en user_roles
            const existsInUserRoles = userRoleAdmins?.some(ur => ur.user_id === propertyAdmin.user_id);
            
            if (!existsInUserRoles && propertyAdmin.user_id) {
              console.log(`➕ PROPERTY SYNC: Creando user_role para ${propertyAdmin.company_name}`);
              
              const { data: newUserRole, error: createRoleError } = await supabase
                .from('user_roles')
                .insert({
                  user_id: propertyAdmin.user_id,
                  role_type: 'property_administrator',
                  is_verified: true,
                  is_active: false, // No activar automáticamente para evitar conflictos
                  role_specific_data: {
                    company_name: propertyAdmin.company_name,
                    cif: propertyAdmin.company_cif,
                    business_email: propertyAdmin.contact_email,
                    business_phone: propertyAdmin.contact_phone,
                    professional_number: propertyAdmin.license_number,
                    company_address: '',
                    company_city: '',
                    company_postal_code: '',
                    company_country: 'España'
                  },
                  verification_confirmed_at: new Date().toISOString()
                })
                .select()
                .single();

              if (createRoleError) {
                console.error(`❌ PROPERTY SYNC: Error creando user_role:`, createRoleError);
                errors.push(`Error creando user_role: ${createRoleError.message}`);
              } else {
                console.log(`✅ PROPERTY SYNC: Creado user_role: ${propertyAdmin.company_name}`);
                created_in_user_roles++;
                synced_count++;
              }
            } else {
              console.log(`✓ PROPERTY SYNC: Ya existe user_role para: ${propertyAdmin.company_name}`);
            }
          } catch (syncError) {
            console.error('❌ PROPERTY SYNC: Error en sincronización property_admin:', syncError);
            errors.push(`Error sincronizando property_admin: ${syncError}`);
          }
        }
      }

      // PASO 5: Verificación final
      console.log('🔍 PROPERTY SYNC: Verificación final...');
      const { data: finalUserRoles } = await supabase
        .from('user_roles')
        .select('id')
        .eq('role_type', 'property_administrator');
        
      const { data: finalPropertyAdmins } = await supabase
        .from('property_administrators')
        .select('id');

      const finalUserRoleCount = finalUserRoles?.length || 0;
      const finalPropertyAdminCount = finalPropertyAdmins?.length || 0;

      console.log('📊 PROPERTY SYNC: Resultado final:', {
        user_roles_final: finalUserRoleCount,
        property_administrators_final: finalPropertyAdminCount,
        synced_count,
        created_in_user_roles,
        created_in_property_administrators,
        errors_count: errors.length
      });

      // PASO 6: Crear notificación de sincronización si hay cambios
      if (created_in_user_roles > 0 || created_in_property_administrators > 0) {
        try {
          // Obtener un admin para enviar notificación (opcional)
          const { data: adminUsers } = await supabase
            .from('user_roles')
            .select('user_id')
            .eq('role_type', 'property_administrator')
            .limit(1);

          if (adminUsers && adminUsers.length > 0) {
            await supabase
              .from('notifications')
              .insert({
                user_id: adminUsers[0].user_id,
                title: '🔄 Sincronización completada',
                message: `Se han sincronizado los datos de administradores de fincas. Creados: ${created_in_property_administrators} en property_administrators, ${created_in_user_roles} en user_roles.`,
                type: 'info' as const,
                category: 'system' as const,
                read: false
              });
          }
        } catch (notificationError) {
          console.warn('PROPERTY SYNC: No se pudo crear notificación:', notificationError);
        }
      }

      const success = finalUserRoleCount > 0 && finalPropertyAdminCount > 0 && errors.length === 0;

      return {
        success,
        message: success 
          ? `Sincronización exitosa: ${finalUserRoleCount} user_roles, ${finalPropertyAdminCount} property_administrators`
          : `Sincronización con errores: ${errors.length} errores encontrados`,
        synced_count,
        created_in_user_roles,
        created_in_property_administrators,
        errors
      };

    } catch (error) {
      console.error('❌ PROPERTY SYNC: Error crítico en sincronización:', error);
      return {
        success: false,
        message: 'Error crítico durante la sincronización',
        synced_count,
        created_in_user_roles,
        created_in_property_administrators,
        errors: [...errors, error instanceof Error ? error.message : String(error)]
      };
    }
  }

  /**
   * SINCRONIZAR UN ADMINISTRADOR ESPECÍFICO
   * Se ejecuta automáticamente cuando se crea/actualiza un administrador
   */
  static async syncSingleAdministrator(userId: string): Promise<{
    success: boolean;
    message: string;
    updated_tables: string[];
  }> {
    console.log(`🔄 PROPERTY SYNC: Sincronizando administrador individual: ${userId.substring(0, 8)}...`);
    
    const updated_tables: string[] = [];
    
    try {
      // Verificar en user_roles
      const { data: userRole } = await supabase
        .from('user_roles')
        .select(`
          id,
          user_id,
          role_specific_data,
          profiles:user_id (full_name, email, phone)
        `)
        .eq('user_id', userId)
        .eq('role_type', 'property_administrator')
        .maybeSingle();

      // Verificar en property_administrators  
      const { data: propertyAdmin } = await supabase
        .from('property_administrators')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      // Sincronizar según lo que existe
      if (userRole && !propertyAdmin) {
        // Existe en user_roles pero no en property_administrators
        console.log('➕ PROPERTY SYNC: Creando en property_administrators...');
        
        const profile = userRole.profiles as any;
        const roleData = userRole.role_specific_data as any;
        
        const { error: createError } = await supabase
          .from('property_administrators')
          .insert({
            user_id: userId,
            company_name: roleData?.company_name || profile?.full_name || 'Administración de Fincas',
            company_cif: roleData?.cif || this.generateTempCif(),
            contact_email: roleData?.business_email || profile?.email || 'sin-email@temp.com',
            contact_phone: roleData?.business_phone || profile?.phone || null,
            license_number: roleData?.professional_number || null
          });

        if (createError) {
          throw new Error(`Error creando property_administrator: ${createError.message}`);
        }
        
        updated_tables.push('property_administrators');
        console.log('✅ PROPERTY SYNC: Creado en property_administrators');
        
      } else if (propertyAdmin && !userRole) {
        // Existe en property_administrators pero no en user_roles
        console.log('➕ PROPERTY SYNC: Creando user_role...');
        
        const { error: createRoleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role_type: 'property_administrator',
            is_verified: true,
            is_active: false,
            role_specific_data: {
              company_name: propertyAdmin.company_name,
              cif: propertyAdmin.company_cif,
              business_email: propertyAdmin.contact_email,
              business_phone: propertyAdmin.contact_phone,
              professional_number: propertyAdmin.license_number,
              company_address: '',
              company_city: '',
              company_postal_code: '',
              company_country: 'España'
            },
            verification_confirmed_at: new Date().toISOString()
          });

        if (createRoleError) {
          throw new Error(`Error creando user_role: ${createRoleError.message}`);
        }
        
        updated_tables.push('user_roles');
        console.log('✅ PROPERTY SYNC: Creado user_role');
        
      } else if (userRole && propertyAdmin) {
        console.log('✓ PROPERTY SYNC: Ya existe en ambas tablas');
      } else {
        console.warn('⚠️ PROPERTY SYNC: No existe en ninguna tabla');
      }

      return {
        success: true,
        message: `Sincronización individual completada. Tablas actualizadas: ${updated_tables.join(', ') || 'ninguna'}`,
        updated_tables
      };

    } catch (error) {
      console.error('❌ PROPERTY SYNC: Error en sincronización individual:', error);
      return {
        success: false,
        message: `Error en sincronización individual: ${error instanceof Error ? error.message : String(error)}`,
        updated_tables
      };
    }
  }

  /**
   * OBTENER ADMINISTRADORES SINCRONIZADOS
   * Devuelve la lista completa de administradores unificando ambas tablas
   */
  static async getAllSynchronizedAdministrators(): Promise<{
    success: boolean;
    administrators: PropertyAdministratorData[];
    message?: string;
  }> {
    console.log('📋 PROPERTY SYNC: Obteniendo administradores sincronizados...');
    
    try {
      // Obtener de property_administrators con datos de perfil
      const { data: propertyAdmins, error: propertyError } = await supabase
        .from('property_administrators')
        .select('*')
        .order('created_at', { ascending: false });

      if (propertyError) {
        console.error('❌ PROPERTY SYNC: Error obteniendo property_administrators:', propertyError);
        return {
          success: false,
          administrators: [],
          message: `Error: ${propertyError.message}`
        };
      }

      const administrators: PropertyAdministratorData[] = [];
      
      if (propertyAdmins && propertyAdmins.length > 0) {
        for (const admin of propertyAdmins) {
          // Obtener información adicional del perfil si está disponible
          let profileData = null;
          if (admin.user_id) {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, email, phone')
                .eq('id', admin.user_id)
                .single();
              profileData = profile;
            } catch (profileError) {
              console.warn(`PROPERTY SYNC: No se pudo obtener perfil para ${admin.company_name}`);
            }
          }

          administrators.push({
            id: admin.id,
            user_id: admin.user_id,
            company_name: admin.company_name || profileData?.full_name || 'Administración de Fincas',
            company_cif: admin.company_cif || 'SIN-CIF',
            contact_email: admin.contact_email || profileData?.email || 'sin-email@temp.com',
            contact_phone: admin.contact_phone || profileData?.phone || undefined,
            license_number: admin.license_number || undefined
          });
        }
      }

      console.log(`✅ PROPERTY SYNC: Obtenidos ${administrators.length} administradores sincronizados`);
      
      return {
        success: true,
        administrators,
        message: `${administrators.length} administradores encontrados`
      };

    } catch (error) {
      console.error('❌ PROPERTY SYNC: Error obteniendo administradores sincronizados:', error);
      return {
        success: false,
        administrators: [],
        message: `Error crítico: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * GENERAR CIF TEMPORAL
   */
  private static generateTempCif(): string {
    const randomNum = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    return `A${randomNum}B`;
  }

  /**
   * EJECUTAR SINCRONIZACIÓN AUTOMÁTICA
   * Método público para ejecutar desde otros servicios
   */
  static async runAutoSync(): Promise<void> {
    console.log('🚀 PROPERTY SYNC: Ejecutando sincronización automática...');
    
    try {
      const result = await this.syncAllPropertyAdministrators();
      
      if (result.success) {
        console.log('✅ PROPERTY SYNC: Sincronización automática exitosa');
      } else {
        console.warn('⚠️ PROPERTY SYNC: Sincronización automática con advertencias:', result.errors);
      }
    } catch (error) {
      console.error('❌ PROPERTY SYNC: Error en sincronización automática:', error);
    }
  }
}

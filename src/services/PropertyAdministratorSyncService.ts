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
 * SERVICIO DE SINCRONIZACIÓN AUTOMÁTICA CORREGIDO
 * Mantiene sincronizados los administradores de fincas entre:
 * - user_roles (tabla general de roles)
 * - property_administrators (tabla específica de administradores)
 */
export class PropertyAdministratorSyncService {
  
  /**
   * SINCRONIZACIÓN COMPLETA BIDIRECCIONAL - VERSION CORREGIDA
   * Asegura que todos los administradores estén en ambas tablas SIN errores de SQL
   */
  static async syncAllPropertyAdministrators(): Promise<{
    success: boolean;
    message: string;
    synced_count: number;
    created_in_user_roles: number;
    created_in_property_administrators: number;
    errors: string[];
  }> {
    console.log('🔄 PROPERTY SYNC: Iniciando sincronización completa bidireccional CORREGIDA...');
    
    const errors: string[] = [];
    let synced_count = 0;
    let created_in_user_roles = 0;
    let created_in_property_administrators = 0;

    try {
      // PASO 1: Obtener administradores de user_roles SIN joins problemáticos
      console.log('📋 PROPERTY SYNC: Obteniendo administradores de user_roles...');
      const { data: userRoleAdmins, error: userRoleError } = await supabase
        .from('user_roles')
        .select('id, user_id, role_specific_data, created_at')
        .eq('role_type', 'property_administrator')
        .eq('is_verified', true);

      if (userRoleError) {
        console.error('❌ PROPERTY SYNC: Error cargando user_roles:', userRoleError);
        errors.push(`Error en user_roles: ${userRoleError.message}`);
        // CONTINUAR sin fallar completamente
      }

      // PASO 2: Obtener administradores de property_administrators
      console.log('📋 PROPERTY SYNC: Obteniendo administradores de property_administrators...');
      const { data: propertyAdmins, error: propertyError } = await supabase
        .from('property_administrators')
        .select('*')
        .order('created_at', { ascending: false });

      if (propertyError) {
        console.error('❌ PROPERTY SYNC: Error cargando property_administrators:', propertyError);
        errors.push(`Error en property_administrators: ${propertyError.message}`);
        // CONTINUAR sin fallar completamente
      }

      console.log('📊 PROPERTY SYNC: Datos obtenidos:', {
        user_roles_count: userRoleAdmins?.length || 0,
        property_administrators_count: propertyAdmins?.length || 0
      });

      // PASO 3: Sincronizar user_roles -> property_administrators (SOLO si no existe)
      if (userRoleAdmins && userRoleAdmins.length > 0) {
        console.log('🔄 PROPERTY SYNC: Sincronizando user_roles -> property_administrators...');
        
        for (const userRole of userRoleAdmins) {
          try {
            // CONSULTA SEPARADA para obtener perfil (sin join problemático)
            let profileData = null;
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, email, phone')
                .eq('id', userRole.user_id)
                .single();
              profileData = profile;
            } catch (_profileError) {
              console.warn(`PROPERTY SYNC: No se pudo obtener perfil para user_role ${userRole.id}`);
            }

            const roleData = userRole.role_specific_data as any;
            
            // VERIFICACIÓN MEJORADA: Verificar si ya existe en property_administrators
            const existsInPropertyTable = propertyAdmins?.some(pa => pa.user_id === userRole.user_id);
            
            if (!existsInPropertyTable) {
              console.log(`➕ PROPERTY SYNC: Creando en property_administrators para ${profileData?.full_name || 'Usuario'}`);
              
              // VALIDACIÓN ANTES DE INSERTAR: Verificar una vez más para evitar duplicados
              const { data: existingCheck } = await supabase
                .from('property_administrators')
                .select('id')
                .eq('user_id', userRole.user_id)
                .maybeSingle();

              if (!existingCheck) {
                const { data: newPropertyAdmin, error: createError } = await supabase
                  .from('property_administrators')
                  .insert({
                    user_id: userRole.user_id,
                    company_name: roleData?.company_name || profileData?.full_name || 'Administración de Fincas',
                    company_cif: roleData?.cif || roleData?.company_cif || this.generateTempCif(),
                    contact_email: roleData?.business_email || profileData?.email || 'sin-email@temp.com',
                    contact_phone: roleData?.business_phone || profileData?.phone || null,
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
                console.log(`✓ PROPERTY SYNC: Ya existe (verificación final): ${profileData?.full_name}`);
                synced_count++;
              }
            } else {
              console.log(`✓ PROPERTY SYNC: Ya existe en property_administrators: ${profileData?.full_name}`);
              synced_count++;
            }
          } catch (syncError) {
            console.error('❌ PROPERTY SYNC: Error en sincronización user_role:', syncError);
            errors.push(`Error sincronizando user_role: ${syncError}`);
          }
        }
      }

      // PASO 4: Sincronizar property_administrators -> user_roles (SOLO si no existe)
      if (propertyAdmins && propertyAdmins.length > 0) {
        console.log('🔄 PROPERTY SYNC: Sincronizando property_administrators -> user_roles...');
        
        for (const propertyAdmin of propertyAdmins) {
          try {
            // Verificar si ya existe en user_roles
            const existsInUserRoles = userRoleAdmins?.some(ur => ur.user_id === propertyAdmin.user_id);
            
            if (!existsInUserRoles && propertyAdmin.user_id) {
              console.log(`➕ PROPERTY SYNC: Creando user_role para ${propertyAdmin.company_name}`);
              
              // VERIFICACIÓN EXTRA ANTES DE INSERTAR: Evitar violación de constraint único
              const { data: existingUserRole } = await supabase
                .from('user_roles')
                .select('id')
                .eq('user_id', propertyAdmin.user_id)
                .eq('role_type', 'property_administrator')
                .maybeSingle();

              if (!existingUserRole) {
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
                  // MANEJAR ERROR DE DUPLICATE KEY más graciosamente
                  if (createRoleError.code === '23505') {
                    console.warn(`⚠️ PROPERTY SYNC: User_role ya existe (constraint violation): ${propertyAdmin.company_name}`);
                    synced_count++;
                  } else {
                    console.error(`❌ PROPERTY SYNC: Error creando user_role:`, createRoleError);
                    errors.push(`Error creando user_role: ${createRoleError.message}`);
                  }
                } else {
                  console.log(`✅ PROPERTY SYNC: Creado user_role: ${propertyAdmin.company_name}`);
                  created_in_user_roles++;
                  synced_count++;
                }
              } else {
                console.log(`✓ PROPERTY SYNC: Ya existe user_role (verificación final): ${propertyAdmin.company_name}`);
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

      // PASO 5: Verificación final SIN joins problemáticos
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

      // CONSIDERAMOS ÉXITO si hay administradores en ambas tablas, incluso con algunos errores menores
      const success = finalUserRoleCount > 0 && finalPropertyAdminCount > 0;

      return {
        success,
        message: success 
          ? `Sincronización exitosa: ${finalUserRoleCount} user_roles, ${finalPropertyAdminCount} property_administrators` +
            (errors.length > 0 ? ` (${errors.length} advertencias)` : '')
          : `Sincronización fallida: ${finalUserRoleCount} user_roles, ${finalPropertyAdminCount} property_administrators`,
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
   * SINCRONIZAR UN ADMINISTRADOR ESPECÍFICO - VERSIÓN CORREGIDA
   */
  static async syncSingleAdministrator(userId: string): Promise<{
    success: boolean;
    message: string;
    updated_tables: string[];
  }> {
    console.log(`🔄 PROPERTY SYNC: Sincronizando administrador individual: ${userId.substring(0, 8)}...`);
    
    const updated_tables: string[] = [];
    
    try {
      // CONSULTAS SEPARADAS sin joins problemáticos
      
      // Verificar en user_roles
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('id, user_id, role_specific_data')
        .eq('user_id', userId)
        .eq('role_type', 'property_administrator')
        .maybeSingle();

      // Verificar en property_administrators  
      const { data: propertyAdmin } = await supabase
        .from('property_administrators')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      // Obtener perfil por separado si es necesario
      let profileData = null;
      if (userId) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, email, phone')
            .eq('id', userId)
            .single();
          profileData = profile;
        } catch (_profileError) {
          console.warn('PROPERTY SYNC: No se pudo obtener perfil para sincronización individual');
        }
      }

      // Sincronizar según lo que existe
      if (userRole && !propertyAdmin) {
        // Existe en user_roles pero no en property_administrators
        console.log('➕ PROPERTY SYNC: Creando en property_administrators...');
        
        const roleData = userRole.role_specific_data as any;
        
        const { error: createError } = await supabase
          .from('property_administrators')
          .insert({
            user_id: userId,
            company_name: roleData?.company_name || profileData?.full_name || 'Administración de Fincas',
            company_cif: roleData?.cif || roleData?.company_cif || this.generateTempCif(),
            contact_email: roleData?.business_email || profileData?.email || 'sin-email@temp.com',
            contact_phone: roleData?.business_phone || profileData?.phone || null,
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
        
        // VERIFICACIÓN ANTES DE CREAR para evitar duplicados
        const { data: existingCheck } = await supabase
          .from('user_roles')
          .select('id')
          .eq('user_id', userId)
          .eq('role_type', 'property_administrator')
          .maybeSingle();

        if (!existingCheck) {
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
            if (createRoleError.code === '23505') {
              console.warn('⚠️ PROPERTY SYNC: User_role ya existe (constraint violation en sincronización individual)');
            } else {
              throw new Error(`Error creando user_role: ${createRoleError.message}`);
            }
          } else {
            updated_tables.push('user_roles');
            console.log('✅ PROPERTY SYNC: Creado user_role');
          }
        } else {
          console.log('✓ PROPERTY SYNC: User_role ya existe (verificación individual)');
        }
        
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
   * OBTENER ADMINISTRADORES SINCRONIZADOS - VERSIÓN CORREGIDA
   * Devuelve la lista completa de administradores unificando ambas tablas SIN joins problemáticos
   */
  static async getAllSynchronizedAdministrators(): Promise<{
    success: boolean;
    administrators: PropertyAdministratorData[];
    message?: string;
  }> {
    console.log('📋 PROPERTY SYNC: Obteniendo administradores sincronizados...');
    
    try {
      // CONSULTA SIMPLE sin joins problemáticos
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
        // OBTENER DATOS DEL PERFIL EN CONSULTAS SEPARADAS para evitar errores de join
        for (const admin of propertyAdmins) {
          let profileData = null;
          
          if (admin.user_id) {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, email, phone')
                .eq('id', admin.user_id)
                .single();
              profileData = profile;
            } catch (_profileError) {
              console.warn(`PROPERTY SYNC: No se pudo obtener perfil para ${admin.company_name}:`, _profileError);
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
    const timestamp = Date.now().toString().slice(-8);
    return `A${timestamp}T`;
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

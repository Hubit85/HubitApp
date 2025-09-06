import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseUserRoleService } from '@/services/SupabaseUserRoleService';
import { PropertyAutoService, UserPropertyData } from '@/services/PropertyAutoService';

interface RoleSpecificData {
  // Particular fields
  full_name?: string;
  phone?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  province?: string;
  country?: string;

  // Community member fields (inherits from particular)
  community_code?: string;
  community_name?: string;
  portal_number?: string;
  apartment_number?: string;

  // Service provider fields
  company_name?: string;
  company_address?: string;
  company_postal_code?: string;
  company_city?: string;
  company_province?: string;
  company_country?: string;
  cif?: string;
  business_email?: string;
  business_phone?: string;
  selected_services?: string[];
  service_costs?: Record<string, number>;

  // Property administrator fields
  professional_number?: string;
}

const validateRoleSpecificData = (roleType: string, data: RoleSpecificData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  switch (roleType) {
    case 'particular':
      if (!data.full_name?.trim()) errors.push('Nombre completo es requerido');
      if (!data.phone?.trim()) errors.push('Teléfono es requerido');
      if (!data.address?.trim()) errors.push('Dirección es requerida');
      if (!data.postal_code?.trim()) errors.push('Código postal es requerido');
      if (!data.city?.trim()) errors.push('Ciudad es requerida');
      if (!data.province?.trim()) errors.push('Provincia es requerida');
      break;

    case 'community_member':
      if (!data.full_name?.trim()) errors.push('Nombre completo es requerido');
      if (!data.phone?.trim()) errors.push('Teléfono es requerido');
      if (!data.address?.trim()) errors.push('Dirección es requerida');
      if (!data.postal_code?.trim()) errors.push('Código postal es requerido');
      if (!data.city?.trim()) errors.push('Ciudad es requerida');
      if (!data.province?.trim()) errors.push('Provincia es requerida');
      break;

    case 'service_provider':
      if (!data.company_name?.trim()) errors.push('Nombre de empresa es requerido');
      if (!data.business_email?.trim()) errors.push('Email del negocio es requerido');
      if (!data.business_phone?.trim()) errors.push('Teléfono del negocio es requerido');
      if (!data.cif?.trim()) errors.push('CIF es requerido');
      if (!data.company_address?.trim()) errors.push('Dirección de empresa es requerida');
      if (!data.company_postal_code?.trim()) errors.push('Código postal de empresa es requerido');
      if (!data.company_city?.trim()) errors.push('Ciudad de empresa es requerida');
      if (!data.company_province?.trim()) errors.push('Provincia de empresa es requerida');
      
      // Validate services if provided
      if (data.selected_services && data.selected_services.length === 0) {
        errors.push('Debe seleccionar al menos un servicio');
      }
      break;

    case 'property_administrator':
      if (!data.company_name?.trim()) errors.push('Nombre de empresa es requerido');
      if (!data.business_email?.trim()) errors.push('Email del negocio es requerido');
      if (!data.business_phone?.trim()) errors.push('Teléfono del negocio es requerido');
      if (!data.cif?.trim()) errors.push('CIF es requerido');
      if (!data.professional_number?.trim()) errors.push('Número de colegiado es requerido');
      if (!data.company_address?.trim()) errors.push('Dirección de empresa es requerida');
      break;
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const generateCommunityCode = (address: string): string => {
  const hash = address.toLowerCase().replace(/\s+/g, '').slice(0, 10);
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `COM-${hash}-${randomNum}`.toUpperCase();
};

// NUEVA FUNCIÓN: Sincronizar información entre roles
const syncInformationBetweenRoles = async (userId: string, newRoleType: string, newRoleData: any): Promise<void> => {
  try {
    console.log('🔄 API: Starting cross-role information sync for user:', userId.substring(0, 8) + '...');
    
    // Obtener todos los roles existentes del usuario
    const { data: existingRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role_type, role_specific_data')
      .eq('user_id', userId)
      .eq('is_verified', true);

    if (rolesError) {
      console.warn('⚠️ API: Could not fetch existing roles for sync:', rolesError);
      return;
    }

    if (!existingRoles || existingRoles.length === 0) {
      console.log('📝 API: No existing roles to sync with');
      return;
    }

    console.log(`🔍 API: Found ${existingRoles.length} existing roles to sync with`);

    // Lógica de sincronización específica
    const syncPromises = existingRoles.map(async (existingRole) => {
      if (existingRole.role_type === newRoleType) {
        return; // No sincronizar con el mismo rol
      }

      let updatedData = { ...existingRole.role_specific_data };
      let hasChanges = false;

      // SINCRONIZACIÓN PARTICULAR ↔ MIEMBRO DE COMUNIDAD
      if ((newRoleType === 'particular' && existingRole.role_type === 'community_member') ||
          (newRoleType === 'community_member' && existingRole.role_type === 'particular')) {
        
        // Sincronizar datos básicos
        const fieldsToSync = ['full_name', 'phone', 'address', 'postal_code', 'city', 'province', 'country'];
        
        for (const field of fieldsToSync) {
          if (newRoleData[field] && (!updatedData[field] || updatedData[field] !== newRoleData[field])) {
            updatedData[field] = newRoleData[field];
            hasChanges = true;
            console.log(`📤 API: Syncing ${field} from ${newRoleType} to ${existingRole.role_type}`);
          }
        }

        // Si el nuevo rol es community_member, sincronizar info de comunidad al particular
        if (newRoleType === 'community_member') {
          const communityFields = ['community_name', 'portal_number', 'apartment_number'];
          for (const field of communityFields) {
            if (newRoleData[field]) {
              updatedData[`community_${field}`] = newRoleData[field];
              hasChanges = true;
            }
          }
        }
      }

      // SINCRONIZACIÓN CON PROVEEDORES DE SERVICIOS
      if (newRoleType === 'service_provider') {
        // Los proveedores pueden beneficiarse de conocer ubicaciones de otros roles
        if (newRoleData.company_city && !updatedData.service_area) {
          updatedData.service_area = newRoleData.company_city;
          hasChanges = true;
        }
      }

      // SINCRONIZACIÓN CON ADMINISTRADORES DE FINCAS
      if (newRoleType === 'property_administrator') {
        // Administradores pueden beneficiarse de conocer propiedades gestionadas
        if (newRoleData.company_city && !updatedData.management_area) {
          updatedData.management_area = newRoleData.company_city;
          hasChanges = true;
        }
      }

      // Aplicar cambios si los hay
      if (hasChanges) {
        const { error: updateError } = await supabase
          .from('user_roles')
          .update({ 
            role_specific_data: updatedData,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('role_type', existingRole.role_type);

        if (updateError) {
          console.warn(`⚠️ API: Failed to sync data to ${existingRole.role_type}:`, updateError);
        } else {
          console.log(`✅ API: Successfully synced data to ${existingRole.role_type}`);
        }
      }
    });

    await Promise.all(syncPromises);
    
    // SINCRONIZACIÓN DE PROPIEDADES
    if (newRoleType === 'particular' || newRoleType === 'community_member') {
      await PropertyAutoService.syncPropertiesBetweenRoles(userId);
    }

    console.log('✅ API: Cross-role information sync completed successfully');

  } catch (error) {
    console.error('❌ API: Error in cross-role sync:', error);
    throw error;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Método no permitido. Solo se permite POST.' 
    });
  }

  const startTime = Date.now();
  console.log('🚀 API: add-role endpoint called');

  try {
    const { userId, roleType, roleSpecificData } = req.body;

    // Enhanced input validation
    if (!userId || typeof userId !== 'string') {
      console.error('❌ API: Invalid or missing userId');
      return res.status(400).json({ 
        success: false, 
        message: 'ID de usuario requerido y debe ser una cadena válida' 
      });
    }

    const validRoleTypes = ['particular', 'community_member', 'service_provider', 'property_administrator'];
    if (!roleType || !validRoleTypes.includes(roleType)) {
      console.error('❌ API: Invalid roleType:', roleType);
      return res.status(400).json({ 
        success: false, 
        message: `Tipo de rol inválido. Debe ser uno de: ${validRoleTypes.join(', ')}` 
      });
    }

    if (!roleSpecificData || typeof roleSpecificData !== 'object') {
      console.error('❌ API: Invalid or missing roleSpecificData');
      return res.status(400).json({ 
        success: false, 
        message: 'Datos específicos del rol son requeridos' 
      });
    }

    console.log('✅ API: Input validation passed', { userId: userId.substring(0, 8) + '...', roleType });

    // Validate role-specific data
    const validation = validateRoleSpecificData(roleType, roleSpecificData);
    if (!validation.isValid) {
      console.error('❌ API: Role data validation failed:', validation.errors);
      return res.status(400).json({
        success: false,
        message: `Datos incompletos: ${validation.errors.join(', ')}`
      });
    }

    // Step 1: Check if user exists and get their data with retry logic
    console.log('🔍 API: Checking user existence and current roles...');
    let userCheckAttempts = 0;
    const maxUserCheckAttempts = 3;
    let userExists = false;
    let existingRoles: any[] = [];

    while (userCheckAttempts < maxUserCheckAttempts && !userExists) {
      try {
        // Check if user profile exists
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, email, full_name, user_type')
          .eq('id', userId)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.warn(`⚠️ API: Profile check attempt ${userCheckAttempts + 1} failed:`, profileError.message);
          userCheckAttempts++;
          if (userCheckAttempts < maxUserCheckAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000 * userCheckAttempts));
            continue;
          }
          throw profileError;
        }

        if (!profileData) {
          return res.status(404).json({
            success: false,
            message: 'Usuario no encontrado. Asegúrate de que la cuenta esté creada correctamente.'
          });
        }

        userExists = true;
        console.log('✅ API: User profile found:', { userId: profileData.id.substring(0, 8) + '...', email: profileData.email });

        // Get existing roles
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('role_type, is_verified, is_active')
          .eq('user_id', userId);

        if (rolesError && rolesError.code !== 'PGRST116') {
          console.warn('⚠️ API: Could not fetch existing roles:', rolesError.message);
          // Don't fail completely, just proceed without existing roles data
        } else {
          existingRoles = rolesData || [];
          console.log('📋 API: Found existing roles:', existingRoles.length);
        }

        break;

      } catch (checkError) {
        userCheckAttempts++;
        console.error(`❌ API: User check attempt ${userCheckAttempts} failed:`, checkError);
        
        if (userCheckAttempts >= maxUserCheckAttempts) {
          return res.status(500).json({
            success: false,
            message: `Error de conexión después de ${maxUserCheckAttempts} intentos. Intenta nuevamente en unos momentos.`
          });
        }
        
        // Wait with exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * userCheckAttempts));
      }
    }

    // Step 2: Check if role already exists
    const existingRole = existingRoles.find(r => r.role_type === roleType);
    if (existingRole) {
      console.log('⚠️ API: Role already exists', { roleType, isVerified: existingRole.is_verified });
      if (existingRole.is_verified) {
        return res.status(409).json({
          success: false,
          message: `Ya tienes el rol de ${SupabaseUserRoleService.getRoleDisplayName(roleType)} verificado.`
        });
      } else {
        return res.status(409).json({
          success: false,
          message: `Ya tienes una verificación pendiente para el rol de ${SupabaseUserRoleService.getRoleDisplayName(roleType)}.`
        });
      }
    }

    // Step 3: Prepare role data with automatic community code generation
    const processedRoleData: Record<string, any> = {};
    
    // CRITICAL FIX: Direct property assignment to avoid spread type issues completely
    if (roleSpecificData && typeof roleSpecificData === 'object' && !Array.isArray(roleSpecificData) && roleSpecificData !== null) {
      try {
        // Safely copy properties one by one to avoid spread type errors
        const sourceData = roleSpecificData as Record<string, any>;
        
        // Copy all valid properties directly
        Object.keys(sourceData).forEach(key => {
          if (typeof key === 'string' && key.length > 0) {
            const value = sourceData[key];
            if (value !== undefined && value !== null) {
              processedRoleData[key] = value;
            }
          }
        });
        
        console.log('✅ API: Successfully processed role-specific data with', Object.keys(processedRoleData).length, 'valid fields');
      } catch (processingError) {
        console.warn('⚠️ API: Error processing role-specific data:', processingError);
        // processedRoleData is already initialized as empty object
      }
    } else {
      console.warn('⚠️ API: Invalid roleSpecificData format, using empty object');
      // processedRoleData is already initialized as empty object
    }
    
    if (roleType === 'community_member') {
      // Generate community code if not provided or empty
      if (!processedRoleData.community_code || processedRoleData.community_code.trim() === '') {
        processedRoleData.community_code = generateCommunityCode(processedRoleData.address || '');
        console.log('🏘️ API: Generated community code:', processedRoleData.community_code);
      }
    }

    // Step 4: Determine if role should be automatically verified (during registration flow)
    // During registration, if this is being called immediately after signup, auto-verify
    const shouldAutoVerify = true; // For multi-role registration, auto-verify all roles
    
    const verificationToken = shouldAutoVerify ? null : SupabaseUserRoleService.generateVerificationToken();
    const verificationExpires = shouldAutoVerify ? null : new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Step 5: Insert role with retry logic
    console.log('💾 API: Creating role record...');
    let insertAttempts = 0;
    const maxInsertAttempts = 3;
    let roleCreated = false;

    while (insertAttempts < maxInsertAttempts && !roleCreated) {
      try {
        const { data: newRole, error: insertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role_type: roleType,
            is_verified: shouldAutoVerify,
            is_active: false, // Will be activated manually by user
            role_specific_data: processedRoleData,
            verification_token: verificationToken,
            verification_expires_at: verificationExpires?.toISOString() || null,
            verification_confirmed_at: shouldAutoVerify ? new Date().toISOString() : null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        roleCreated = true;
        console.log('✅ API: Role created successfully', { 
          roleType, 
          isVerified: shouldAutoVerify,
          userId: userId.substring(0, 8) + '...'
        });

        // Step 6: Create welcome notification (non-blocking)
        try {
          await supabase
            .from('notifications')
            .insert({
              user_id: userId,
              title: `Nuevo rol agregado: ${SupabaseUserRoleService.getRoleDisplayName(roleType)}`,
              message: shouldAutoVerify ? 
                `Tu rol de ${SupabaseUserRoleService.getRoleDisplayName(roleType)} ha sido agregado y verificado automáticamente.` :
                `Tu rol de ${SupabaseUserRoleService.getRoleDisplayName(roleType)} ha sido agregado. Revisa tu email para verificarlo.`,
              type: 'info' as const,
              category: 'system' as const,
              read: false,
              created_at: new Date().toISOString()
            });
          console.log('📨 API: Welcome notification created');
        } catch (notificationError) {
          console.warn('⚠️ API: Could not create notification (non-critical):', notificationError);
          // Don't fail the entire operation for notification errors
        }

        // Step 7: Create default property for particular and community_member roles (non-blocking)
        if (roleType === 'particular' || roleType === 'community_member') {
          console.log(`🏠 API: Creating default property for role: ${roleType}`);
          
          try {
            const propertyUserData: UserPropertyData = {
              full_name: processedRoleData.full_name || 'Usuario',
              address: processedRoleData.address || '',
              city: processedRoleData.city || '',
              postal_code: processedRoleData.postal_code || '',
              province: processedRoleData.province || '',
              country: processedRoleData.country || 'España',
              community_name: processedRoleData.community_name || '',
              portal_number: processedRoleData.portal_number || '',
              apartment_number: processedRoleData.apartment_number || '',
              user_type: roleType
            };

            const propertyResult = await PropertyAutoService.createDefaultProperty(userId, propertyUserData);
            
            if (propertyResult.success) {
              console.log('✅ API: Default property created successfully:', propertyResult.message);
              
              // NUEVA FUNCIONALIDAD: Sincronizar información entre roles existentes
              await syncInformationBetweenRoles(userId, roleType, processedRoleData);
              
              // Add property creation info to the response
              const processingTime = Date.now() - startTime;
              return res.status(200).json({
                success: true,
                message: shouldAutoVerify ? 
                  `Rol de ${SupabaseUserRoleService.getRoleDisplayName(roleType)} agregado, verificado y propiedad creada correctamente` :
                  `Rol de ${SupabaseUserRoleService.getRoleDisplayName(roleType)} agregado con propiedad por defecto. Revisa tu email para completar la verificación.`,
                role: newRole,
                property: propertyResult.property,
                propertyCreated: true,
                requiresVerification: !shouldAutoVerify,
                processingTime,
                crossSyncCompleted: true
              });
              
            } else {
              console.warn('⚠️ API: Property creation failed (non-critical):', propertyResult.message);
              // Continue without failing - property creation is non-critical for role creation
            }
            
          } catch (propertyError) {
            console.warn('⚠️ API: Property creation error (non-critical):', propertyError);
            // Don't fail the role creation for property errors
          }
        }

        // NUEVA FUNCIONALIDAD: Sincronizar información entre todos los roles
        try {
          await syncInformationBetweenRoles(userId, roleType, processedRoleData);
        } catch (syncError) {
          console.warn('⚠️ API: Cross-role sync failed (non-critical):', syncError);
          // Don't fail the role creation for sync errors
        }

        const processingTime = Date.now() - startTime;
        console.log(`✅ API: add-role completed successfully in ${processingTime}ms`);

        return res.status(200).json({
          success: true,
          message: shouldAutoVerify ? 
            `Rol de ${SupabaseUserRoleService.getRoleDisplayName(roleType)} agregado y verificado correctamente` :
            `Rol de ${SupabaseUserRoleService.getRoleDisplayName(roleType)} agregado. Revisa tu email para completar la verificación.`,
          role: newRole,
          requiresVerification: !shouldAutoVerify,
          processingTime,
          crossSyncCompleted: true
        });

      } catch (insertError: any) {
        insertAttempts++;
        console.error(`❌ API: Role creation attempt ${insertAttempts} failed:`, insertError);
        
        if (insertAttempts >= maxInsertAttempts) {
          console.error('❌ API: All role creation attempts failed');
          
          let errorMessage = 'Error al crear el rol después de múltiples intentos.';
          
          if (insertError.message?.includes('duplicate key')) {
            errorMessage = `Ya existe un rol de ${SupabaseUserRoleService.getRoleDisplayName(roleType)} para este usuario.`;
          } else if (insertError.message?.includes('violates foreign key')) {
            errorMessage = 'Error de referencia de datos. Contacta con soporte.';
          } else if (insertError.message?.includes('violates check constraint')) {
            errorMessage = 'Los datos proporcionados no cumplen los requisitos del sistema.';
          } else if (insertError.code === '42501') {
            errorMessage = 'Error de permisos. Verifica que tu sesión esté activa.';
          } else if (insertError.code === 'PGRST301') {
            errorMessage = 'Error de conexión con la base de datos. Intenta nuevamente.';
          }

          return res.status(500).json({
            success: false,
            message: errorMessage,
            errorCode: insertError.code || 'UNKNOWN',
            processingTime: Date.now() - startTime
          });
        }
        
        // Wait with exponential backoff before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * insertAttempts));
      }
    }

    // This should never be reached, but just in case
    return res.status(500).json({
      success: false,
      message: 'Error inesperado en la creación del rol'
    });

  } catch (error: any) {
    const processingTime = Date.now() - startTime;
    console.error('❌ API: Unhandled error in add-role:', error);

    let statusCode = 500;
    let errorMessage = 'Error interno del servidor al procesar la solicitud.';

    // Handle specific error types
    if (error.message?.includes('JWT') || error.message?.includes('auth')) {
      statusCode = 401;
      errorMessage = 'Error de autenticación. Por favor, inicia sesión nuevamente.';
    } else if (error.message?.includes('timeout') || error.message?.includes('ECONNRESET')) {
      statusCode = 408;
      errorMessage = 'Tiempo de respuesta agotado. Verifica tu conexión e intenta nuevamente.';
    } else if (error.message?.includes('rate limit')) {
      statusCode = 429;
      errorMessage = 'Demasiadas solicitudes. Espera un momento antes de intentar nuevamente.';
    }

    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
      errorDetails: process.env.NODE_ENV === 'development' ? error.message : undefined,
      processingTime
    });
  }
}
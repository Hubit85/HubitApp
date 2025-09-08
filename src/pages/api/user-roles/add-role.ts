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

interface SingleRoleRequest {
  roleType: string;
  roleSpecificData: RoleSpecificData;
}

interface MultipleRoleRequest {
  roles: SingleRoleRequest[];
}

// NUEVO: Manejar tanto roles únicos como múltiples
interface RequestBody {
  userId: string;
  // Modo individual (compatibilidad hacia atrás)
  roleType?: string;
  roleSpecificData?: RoleSpecificData;
  // Modo múltiple (nuevo)
  multipleRoles?: SingleRoleRequest[];
  // Flags de control
  enableAutoSync?: boolean;
  syncUserType?: boolean;
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

// NUEVA FUNCIÓN MEJORADA: Sincronización automática de user_type más robusta
const ensureComprehensiveUserTypeSynchronization = async (
  userId: string, 
  createdRoleTypes: string[]
): Promise<{ success: boolean; activeRoleType?: string; totalRoles?: number }> => {
  try {
    console.log('🔄 API: Starting comprehensive user_type synchronization with created roles:', createdRoleTypes);

    // Step 1: Get current profile and ALL user roles (including newly created)
    const [profileResult, rolesResult] = await Promise.all([
      supabase.from('profiles').select('user_type').eq('id', userId).single(),
      supabase.from('user_roles').select('role_type, is_verified, is_active, created_at').eq('user_id', userId).order('created_at', { ascending: true })
    ]);

    const { data: currentProfile, error: profileError } = profileResult;
    const { data: allRoles, error: rolesError } = rolesResult;

    if (profileError || rolesError) {
      console.warn('⚠️ API: Could not fetch profile or roles for comprehensive sync');
      return { success: false };
    }

    console.log('📊 API: COMPREHENSIVE SYNC - Current state:', {
      currentProfileType: currentProfile?.user_type,
      totalRoles: allRoles?.length || 0,
      verifiedRoles: allRoles?.filter(r => r.is_verified).length || 0,
      activeRoles: allRoles?.filter(r => r.is_active).length || 0,
      createdRoleTypes,
      allRoleTypes: allRoles?.map(r => r.role_type) || []
    });

    // Step 2: Determine the priority order for user_type
    const ROLE_PRIORITY = ['particular', 'community_member', 'service_provider', 'property_administrator'];
    
    const verifiedRoles = (allRoles || []).filter(r => r.is_verified);
    
    // Find the highest priority verified role
    let targetUserType = currentProfile?.user_type || 'particular';
    
    for (const priorityRole of ROLE_PRIORITY) {
      if (verifiedRoles.some(r => r.role_type === priorityRole)) {
        targetUserType = priorityRole;
        break;
      }
    }
    
    console.log('🎯 API: COMPREHENSIVE SYNC - Target user_type determined:', {
      targetUserType,
      reasoning: 'First verified role in priority order',
      availableVerifiedRoles: verifiedRoles.map(r => r.role_type)
    });

    // Step 3: Update profile.user_type if needed
    if (currentProfile?.user_type !== targetUserType) {
      console.log(`🔄 API: COMPREHENSIVE SYNC - Updating profile.user_type from "${currentProfile?.user_type}" to "${targetUserType}"`);
      
      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({ 
          user_type: targetUserType as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateProfileError) {
        console.error('❌ API: COMPREHENSIVE SYNC - Failed to update profile.user_type:', updateProfileError);
        return { success: false };
      }
      
      console.log('✅ API: COMPREHENSIVE SYNC - Profile.user_type updated successfully');
    }

    // Step 4: Ensure exactly ONE active verified role (the target user_type)
    const activeRoles = verifiedRoles.filter(r => r.is_active);
    const targetRole = verifiedRoles.find(r => r.role_type === targetUserType);
    
    if (!targetRole) {
      console.error('❌ API: COMPREHENSIVE SYNC - Target role not found in verified roles');
      return { success: false };
    }
    
    // Fix active role situation
    if (activeRoles.length !== 1 || !activeRoles.some(r => r.role_type === targetUserType)) {
      console.log('🔄 API: COMPREHENSIVE SYNC - Fixing active role configuration');
      
      // First, deactivate all roles
      await supabase
        .from('user_roles')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('user_id', userId);
      
      // Then activate only the target role
      const { error: activateError } = await supabase
        .from('user_roles')
        .update({ 
          is_active: true, 
          updated_at: new Date().toISOString() 
        })
        .eq('user_id', userId)
        .eq('role_type', targetUserType)
        .eq('is_verified', true);

      if (activateError) {
        console.error('❌ API: COMPREHENSIVE SYNC - Failed to activate target role:', activateError);
        return { success: false };
      }
      
      console.log('✅ API: COMPREHENSIVE SYNC - Active role configuration fixed');
    }

    // Step 5: Final verification
    const [finalProfileResult, finalActiveRoleResult] = await Promise.all([
      supabase.from('profiles').select('user_type').eq('id', userId).single(),
      supabase.from('user_roles').select('role_type').eq('user_id', userId).eq('is_active', true).eq('is_verified', true).single()
    ]);

    const finalSuccess = (
      finalProfileResult.data?.user_type === finalActiveRoleResult.data?.role_type &&
      finalProfileResult.data?.user_type === targetUserType
    );

    console.log('🏁 API: COMPREHENSIVE SYNC - Final state verification:', {
      profileUserType: finalProfileResult.data?.user_type,
      activeRoleType: finalActiveRoleResult.data?.role_type,
      targetUserType,
      synchronized: finalSuccess,
      totalVerifiedRoles: verifiedRoles.length
    });

    return {
      success: finalSuccess,
      activeRoleType: targetUserType,
      totalRoles: verifiedRoles.length
    };

  } catch (error) {
    console.error('❌ API: COMPREHENSIVE SYNC - Critical error:', error);
    return { success: false };
  }
};

// NUEVA FUNCIÓN: Crear múltiples roles de forma eficiente
const createMultipleRoles = async (
  userId: string, 
  roleRequests: SingleRoleRequest[]
): Promise<{
  success: boolean;
  createdRoles: any[];
  failedRoles: string[];
  totalProcessed: number;
  errors: string[];
}> => {
  const createdRoles: any[] = [];
  const failedRoles: string[] = [];
  const errors: string[] = [];
  
  console.log(`🚀 API: Starting batch creation of ${roleRequests.length} roles for user:`, userId.substring(0, 8) + '...');

  for (let i = 0; i < roleRequests.length; i++) {
    const roleRequest = roleRequests[i];
    const { roleType, roleSpecificData } = roleRequest;
    
    try {
      console.log(`🔄 API: Processing role ${i + 1}/${roleRequests.length}: ${roleType}`);
      
      // Validate role data
      const validation = validateRoleSpecificData(roleType, roleSpecificData);
      if (!validation.isValid) {
        const errorMsg = `${roleType}: ${validation.errors.join(', ')}`;
        errors.push(errorMsg);
        failedRoles.push(roleType);
        continue;
      }

      // Process role specific data safely
      const processedRoleData: Record<string, any> = {};
      
      // Safe property copying (avoiding spread operator issues)
      const knownStringFields = [
        'full_name', 'phone', 'address', 'postal_code', 'city', 'province', 'country',
        'community_code', 'community_name', 'portal_number', 'apartment_number',
        'company_name', 'company_address', 'company_postal_code', 'company_city',
        'company_province', 'company_country', 'cif', 'business_email', 'business_phone',
        'professional_number'
      ];
      
      knownStringFields.forEach(field => {
        const value = (roleSpecificData as any)?.[field];
        if (value && typeof value === 'string' && value.trim().length > 0) {
          processedRoleData[field] = value.trim();
        }
      });
      
      // Handle arrays and objects
      if (roleSpecificData.selected_services && Array.isArray(roleSpecificData.selected_services)) {
        processedRoleData.selected_services = roleSpecificData.selected_services;
      }
      
      if (roleSpecificData.service_costs && typeof roleSpecificData.service_costs === 'object') {
        processedRoleData.service_costs = roleSpecificData.service_costs;
      }

      // Generate community code if needed
      if (roleType === 'community_member' && !processedRoleData.community_code && processedRoleData.address) {
        processedRoleData.community_code = generateCommunityCode(processedRoleData.address);
      }

      // Create role record
      const { data: newRole, error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role_type: roleType as 'particular' | 'community_member' | 'service_provider' | 'property_administrator',
          is_verified: true, // Auto-verify during batch creation
          is_active: false,  // Will be set properly during sync
          role_specific_data: processedRoleData as any,
          verification_confirmed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        console.error(`❌ API: Failed to create role ${roleType}:`, insertError);
        errors.push(`${roleType}: ${insertError.message}`);
        failedRoles.push(roleType);
        continue;
      }

      createdRoles.push(newRole);
      console.log(`✅ API: Successfully created role ${roleType}`);

      // Create properties for applicable roles
      if (roleType === 'particular' || roleType === 'community_member') {
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
            console.log(`✅ API: Default property created for ${roleType}`);
          } else {
            console.warn(`⚠️ API: Property creation failed for ${roleType} (non-critical):`, propertyResult.message);
          }
        } catch (propertyError) {
          console.warn(`⚠️ API: Property creation error for ${roleType} (non-critical):`, propertyError);
        }
      }

    } catch (roleError) {
      console.error(`❌ API: Exception creating role ${roleType}:`, roleError);
      const errorMsg = roleError instanceof Error ? roleError.message : 'Unknown error';
      errors.push(`${roleType}: ${errorMsg}`);
      failedRoles.push(roleType);
    }
  }

  const success = createdRoles.length > 0;
  const totalProcessed = createdRoles.length + failedRoles.length;

  console.log(`📊 API: Batch creation completed:`, {
    totalRequested: roleRequests.length,
    created: createdRoles.length,
    failed: failedRoles.length,
    success,
    failedRoles
  });

  return {
    success,
    createdRoles,
    failedRoles,
    totalProcessed,
    errors
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Método no permitido. Solo se permite POST.' 
    });
  }

  const startTime = Date.now();
  console.log('🚀 API: Enhanced add-role endpoint called with multi-role support');

  try {
    const requestBody = req.body as RequestBody;
    const { userId, enableAutoSync = true, syncUserType = true } = requestBody;

    // Enhanced input validation
    if (!userId || typeof userId !== 'string') {
      console.error('❌ API: Invalid or missing userId');
      return res.status(400).json({ 
        success: false, 
        message: 'ID de usuario requerido y debe ser una cadena válida' 
      });
    }

    // Determine if this is a multiple role request or single role request
    const isMultipleRoles = requestBody.multipleRoles && Array.isArray(requestBody.multipleRoles);
    
    let roleRequests: SingleRoleRequest[] = [];
    
    if (isMultipleRoles) {
      roleRequests = requestBody.multipleRoles!;
      console.log(`📋 API: Multiple roles mode detected: ${roleRequests.length} roles to process`);
    } else {
      // Single role mode (backward compatibility)
      if (!requestBody.roleType || !requestBody.roleSpecificData) {
        return res.status(400).json({
          success: false,
          message: 'Para modo individual: roleType y roleSpecificData son requeridos'
        });
      }
      
      roleRequests = [{
        roleType: requestBody.roleType,
        roleSpecificData: requestBody.roleSpecificData
      }];
      console.log(`📋 API: Single role mode detected: ${requestBody.roleType}`);
    }

    if (roleRequests.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay roles para procesar'
      });
    }

    // Validate all role types
    const validRoleTypes = ['particular', 'community_member', 'service_provider', 'property_administrator'];
    for (const roleRequest of roleRequests) {
      if (!validRoleTypes.includes(roleRequest.roleType)) {
        return res.status(400).json({
          success: false,
          message: `Tipo de rol inválido: ${roleRequest.roleType}. Debe ser uno de: ${validRoleTypes.join(', ')}`
        });
      }
    }

    // Step 1: Verify user exists
    console.log('🔍 API: Verifying user existence...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, user_type')
      .eq('id', userId)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('❌ API: Profile check failed:', profileError);
      return res.status(500).json({
        success: false,
        message: 'Error verificando usuario. Intenta nuevamente.'
      });
    }

    if (!profileData) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado. Asegúrate de que la cuenta esté creada correctamente.'
      });
    }

    console.log('✅ API: User profile verified:', { userId: profileData.id.substring(0, 8) + '...', email: profileData.email });

    // Step 2: Check for existing roles to avoid conflicts
    const { data: existingRoles } = await supabase
      .from('user_roles')
      .select('role_type, is_verified')
      .eq('user_id', userId);

    const conflictingRoles: string[] = [];
    for (const roleRequest of roleRequests) {
      const existing = existingRoles?.find(r => r.role_type === roleRequest.roleType);
      if (existing) {
        if (existing.is_verified) {
          conflictingRoles.push(`${roleRequest.roleType} (ya verificado)`);
        } else {
          conflictingRoles.push(`${roleRequest.roleType} (verificación pendiente)`);
        }
      }
    }

    if (conflictingRoles.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Los siguientes roles ya existen: ${conflictingRoles.join(', ')}`
      });
    }

    // Step 3: Create multiple roles efficiently
    console.log(`🏗️ API: Creating ${roleRequests.length} roles...`);
    const creationResult = await createMultipleRoles(userId, roleRequests);

    if (!creationResult.success || creationResult.createdRoles.length === 0) {
      return res.status(500).json({
        success: false,
        message: `Error creando roles: ${creationResult.errors.join('; ')}`,
        failedRoles: creationResult.failedRoles,
        errors: creationResult.errors
      });
    }

    // Step 4: Comprehensive user_type synchronization
    let syncResult = { success: false };
    if (enableAutoSync && syncUserType) {
      console.log('🔄 API: Performing comprehensive user_type synchronization...');
      const createdRoleTypes = creationResult.createdRoles.map(r => r.role_type);
      syncResult = await ensureComprehensiveUserTypeSynchronization(userId, createdRoleTypes);
    }

    // Step 5: Create success notifications (non-blocking)
    try {
      const notifications = creationResult.createdRoles.map(role => ({
        user_id: userId,
        title: isMultipleRoles 
          ? `¡${creationResult.createdRoles.length} roles agregados correctamente!`
          : `Nuevo rol: ${SupabaseUserRoleService.getRoleDisplayName(role.role_type)}`,
        message: isMultipleRoles
          ? `Se han agregado y verificado ${creationResult.createdRoles.length} roles automáticamente.`
          : `Tu rol de ${SupabaseUserRoleService.getRoleDisplayName(role.role_type)} ha sido agregado y verificado automáticamente.`,
        type: 'info' as const,
        category: 'system' as const,
        read: false,
        created_at: new Date().toISOString()
      }));

      await supabase.from('notifications').insert(notifications);
      console.log(`📨 API: Created ${notifications.length} success notifications`);
    } catch (notificationError) {
      console.warn('⚠️ API: Could not create notifications (non-critical):', notificationError);
    }

    // Step 6: Prepare comprehensive response
    const processingTime = Date.now() - startTime;
    const responseMessage = isMultipleRoles
      ? `¡${creationResult.createdRoles.length} de ${roleRequests.length} roles creados exitosamente!`
      : `Rol de ${SupabaseUserRoleService.getRoleDisplayName(creationResult.createdRoles[0].role_type)} agregado correctamente`;

    const response = {
      success: true,
      message: responseMessage,
      multipleRoles: isMultipleRoles,
      totalRequested: roleRequests.length,
      totalCreated: creationResult.createdRoles.length,
      totalFailed: creationResult.failedRoles.length,
      createdRoles: creationResult.createdRoles.map(r => ({
        roleType: r.role_type,
        isVerified: r.is_verified,
        isActive: r.is_active
      })),
      failedRoles: creationResult.failedRoles,
      errors: creationResult.errors.length > 0 ? creationResult.errors : undefined,
      syncCompleted: syncResult.success,
      activeRoleType: syncResult.activeRoleType,
      requiresVerification: false, // Auto-verified
      processingTime,
      crossSyncCompleted: true
    };

    console.log(`✅ API: Enhanced add-role completed successfully in ${processingTime}ms:`, {
      multipleRoles: isMultipleRoles,
      totalCreated: creationResult.createdRoles.length,
      syncSuccess: syncResult.success
    });

    return res.status(200).json(response);

  } catch (error: any) {
    const processingTime = Date.now() - startTime;
    console.error('❌ API: Unhandled error in enhanced add-role:', error);

    let statusCode = 500;
    let errorMessage = 'Error interno del servidor al procesar la solicitud de roles.';

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
      processingTime,
      multipleRoles: req.body.multipleRoles ? true : false
    });
  }
}

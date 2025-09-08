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
const syncInformationBetweenRoles = async (userId: string, newRoleType: string, newRoleData: Record<string, any>): Promise<void> => {
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

      const currentRoleData = existingRole.role_specific_data as Record<string, any> || {};
      const updatedData: Record<string, any> = {};
      
      // Copy all existing data first
      Object.keys(currentRoleData).forEach(key => {
        updatedData[key] = currentRoleData[key];
      });
      
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

// ENHANCED FUNCTION: Comprehensive user_type synchronization between profiles and user_roles
const ensureUserTypeSynchronization = async (userId: string, newRoleType: string): Promise<boolean> => {
  try {
    console.log('🔄 API: Starting comprehensive user_type synchronization for:', userId.substring(0, 8) + '...');

    // Step 1: Get current profile user_type
    const { data: currentProfile, error: profileError } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.warn('⚠️ API: Could not fetch profile for sync:', profileError);
      return false;
    }

    // Step 2: Get ALL user roles (verified and unverified)
    const { data: allRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role_type, is_verified, is_active, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (rolesError) {
      console.warn('⚠️ API: Could not fetch roles for sync:', rolesError);
      return false;
    }

    const verifiedRoles = allRoles.filter(r => r.is_verified);
    const activeRoles = verifiedRoles.filter(r => r.is_active);

    console.log('📊 API: SYNC - Role analysis:', {
      currentProfileType: currentProfile.user_type,
      newRoleType,
      totalRoles: allRoles.length,
      verifiedRoles: verifiedRoles.length,
      activeRoles: activeRoles.length,
      roles: allRoles.map(r => ({
        type: r.role_type,
        verified: r.is_verified,
        active: r.is_active
      }))
    });

    // Step 3: Determine the correct user_type using priority logic
    let correctUserType = newRoleType;
    
    // Priority logic for user_type determination:
    // 1. If there's an active verified role, use it
    // 2. If there are verified roles but none active, use the first verified role
    // 3. If no verified roles, use the new role type
    
    if (activeRoles.length > 0) {
      correctUserType = activeRoles[0].role_type;
      console.log('🎯 API: SYNC - Using active role as user_type:', correctUserType);
    } else if (verifiedRoles.length > 0) {
      correctUserType = verifiedRoles[0].role_type;
      console.log('🎯 API: SYNC - Using first verified role as user_type:', correctUserType);
    } else {
      correctUserType = newRoleType;
      console.log('🎯 API: SYNC - Using new role as user_type:', correctUserType);
    }

    console.log('🔍 API: SYNC - Synchronization decision:', {
      currentProfileType: currentProfile.user_type,
      newRoleType,
      calculatedCorrectType: correctUserType,
      needsProfileUpdate: currentProfile.user_type !== correctUserType,
      needsRoleActivation: activeRoles.length === 0 && verifiedRoles.length > 0
    });

    // Step 4: Update profile.user_type if needed
    if (currentProfile.user_type !== correctUserType) {
      console.log(`🔄 API: SYNC - Updating profile.user_type from "${currentProfile.user_type}" to "${correctUserType}"`);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          user_type: correctUserType as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ API: SYNC - Failed to update profile.user_type:', updateError);
        return false;
      } else {
        console.log('✅ API: SYNC - Profile.user_type updated successfully');
      }
    }

    // Step 5: Ensure there's always one active verified role if we have verified roles
    if (verifiedRoles.length > 0 && activeRoles.length === 0) {
      console.log('🔄 API: SYNC - No active role found, activating the role that matches user_type');
      
      // Find the verified role that matches the correct user_type
      const roleToActivate = verifiedRoles.find(r => r.role_type === correctUserType) || verifiedRoles[0];
      
      try {
        // First deactivate all roles
        await supabase
          .from('user_roles')
          .update({ is_active: false, updated_at: new Date().toISOString() })
          .eq('user_id', userId);

        // Then activate the selected role
        const { error: activateError } = await supabase
          .from('user_roles')
          .update({ 
            is_active: true, 
            updated_at: new Date().toISOString() 
          })
          .eq('user_id', userId)
          .eq('role_type', roleToActivate.role_type)
          .eq('is_verified', true);

        if (activateError) {
          console.error('❌ API: SYNC - Failed to activate role:', activateError);
        } else {
          console.log('✅ API: SYNC - Role activated successfully:', roleToActivate.role_type);
        }
      } catch (activationError) {
        console.error('❌ API: SYNC - Error during role activation:', activationError);
      }
    }

    // Step 6: Handle the case where we have multiple active roles (shouldn't happen, but fix it)
    if (activeRoles.length > 1) {
      console.log('⚠️ API: SYNC - Multiple active roles detected, fixing...');
      
      // Keep only the first active role that matches user_type, or just the first one
      const preferredRole = activeRoles.find(r => r.role_type === correctUserType) || activeRoles[0];
      
      // Deactivate all roles first
      await supabase
        .from('user_roles')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      // Activate only the preferred role
      await supabase
        .from('user_roles')
        .update({ 
          is_active: true, 
          updated_at: new Date().toISOString() 
        })
        .eq('user_id', userId)
        .eq('role_type', preferredRole.role_type)
        .eq('is_verified', true);
        
      console.log('✅ API: SYNC - Fixed multiple active roles, kept:', preferredRole.role_type);
    }

    // Step 7: Final verification
    const { data: finalProfile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', userId)
      .single();

    const { data: finalActiveRole } = await supabase
      .from('user_roles')
      .select('role_type')
      .eq('user_id', userId)
      .eq('is_active', true)
      .eq('is_verified', true)
      .single();

    const syncSuccess = finalProfile?.user_type === finalActiveRole?.role_type;
    
    console.log('🏁 API: SYNC - Final synchronization state:', {
      profileUserType: finalProfile?.user_type,
      activeRoleType: finalActiveRole?.role_type,
      synchronized: syncSuccess,
      totalVerifiedRoles: verifiedRoles.length
    });

    console.log('✅ API: SYNC - Comprehensive user_type synchronization completed successfully');
    return syncSuccess;

  } catch (error) {
    console.error('❌ API: SYNC - Critical error in comprehensive synchronization:', error);
    return false;
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

    // Step 3: Process role data with completely safe and explicit approach
    console.log('🔧 API: Processing role-specific data with explicit type safety...');
    
    // Create a completely safe object with explicit property validation
    const processedRoleData: Record<string, any> = {};
    
    // Explicitly validate and copy known properties safely
    try {
      // Direct property access with type guards - no looping or spreading
      const knownStringFields = [
        'full_name', 'phone', 'address', 'postal_code', 'city', 'province', 'country',
        'community_code', 'community_name', 'portal_number', 'apartment_number',
        'company_name', 'company_address', 'company_postal_code', 'company_city',
        'company_province', 'company_country', 'cif', 'business_email', 'business_phone',
        'professional_number'
      ];
      
      const knownArrayFields = ['selected_services'];
      const knownObjectFields = ['service_costs'];
      
      // Process string fields with explicit type checking
      knownStringFields.forEach(field => {
        const rawValue = (roleSpecificData as any)?.[field];
        if (rawValue && typeof rawValue === 'string' && rawValue.trim().length > 0) {
          processedRoleData[field] = rawValue.trim();
        }
      });
      
      // Process array fields with explicit validation
      knownArrayFields.forEach(field => {
        const rawValue = (roleSpecificData as any)?.[field];
        if (Array.isArray(rawValue) && rawValue.length > 0) {
          processedRoleData[field] = rawValue;
        }
      });
      
      // Process object fields with explicit validation
      knownObjectFields.forEach(field => {
        const rawValue = (roleSpecificData as any)?.[field];
        if (rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue) && Object.keys(rawValue).length > 0) {
          processedRoleData[field] = rawValue;
        }
      });
      
      console.log('✅ API: Role data processed with', Object.keys(processedRoleData).length, 'properties');
      
    } catch (processingError) {
      console.error('❌ API: Error processing role data:', processingError);
      return res.status(400).json({
        success: false,
        message: 'Error al procesar los datos específicos del rol'
      });
    }

    if (roleType === 'community_member') {
      // Generate community code if not provided or empty
      const communityCodeValue = processedRoleData.community_code;
      const addressValue = processedRoleData.address;
      
      if (!communityCodeValue || (typeof communityCodeValue === 'string' && communityCodeValue.trim() === '')) {
        const safeAddress = typeof addressValue === 'string' ? addressValue : '';
        processedRoleData.community_code = generateCommunityCode(safeAddress);
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
            role_type: roleType as 'particular' | 'community_member' | 'service_provider' | 'property_administrator',
            is_verified: shouldAutoVerify,
            is_active: false,
            role_specific_data: processedRoleData as any,
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
              full_name: (typeof processedRoleData.full_name === 'string' ? processedRoleData.full_name : 'Usuario'),
              address: (typeof processedRoleData.address === 'string' ? processedRoleData.address : ''),
              city: (typeof processedRoleData.city === 'string' ? processedRoleData.city : ''),
              postal_code: (typeof processedRoleData.postal_code === 'string' ? processedRoleData.postal_code : ''),
              province: (typeof processedRoleData.province === 'string' ? processedRoleData.province : ''),
              country: (typeof processedRoleData.country === 'string' ? processedRoleData.country : 'España'),
              community_name: (typeof processedRoleData.community_name === 'string' ? processedRoleData.community_name : ''),
              portal_number: (typeof processedRoleData.portal_number === 'string' ? processedRoleData.portal_number : ''),
              apartment_number: (typeof processedRoleData.apartment_number === 'string' ? processedRoleData.apartment_number : ''),
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
import { supabase } from "@/integrations/supabase/client";

/**
 * Ensures service_provider user_roles have a matching service_providers domain row.
 * Marketplace UI (budgets, quotes, contracts) queries service_providers by user_id;
 * registration historically only inserted user_roles.
 */
export class ServiceProviderSyncService {
  static async ensureServiceProviderProfile(userId: string): Promise<{
    success: boolean;
    message: string;
    providerId?: string;
    created: boolean;
  }> {
    console.log(`🔄 PROVIDER SYNC: Ensuring service_providers row for ${userId.substring(0, 8)}...`);

    try {
      const { data: existingProvider, error: existingError } = await supabase
        .from('service_providers')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existingError && existingError.code !== 'PGRST116') {
        throw new Error(existingError.message);
      }

      if (existingProvider?.id) {
        return {
          success: true,
          message: 'service_providers row already exists',
          providerId: existingProvider.id,
          created: false,
        };
      }

      const { data: userRole, error: roleError } = await supabase
        .from('user_roles')
        .select('id, role_specific_data')
        .eq('user_id', userId)
        .eq('role_type', 'service_provider')
        .maybeSingle();

      if (roleError && roleError.code !== 'PGRST116') {
        throw new Error(roleError.message);
      }

      if (!userRole) {
        return {
          success: false,
          message: 'No service_provider role found for user',
          created: false,
        };
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email, phone, city, address')
        .eq('id', userId)
        .maybeSingle();

      const roleData = (userRole.role_specific_data || {}) as Record<string, any>;
      const selectedServices = Array.isArray(roleData.selected_services)
        ? roleData.selected_services.filter((id: unknown): id is string => typeof id === 'string')
        : [];

      const companyName =
        (typeof roleData.company_name === 'string' && roleData.company_name.trim()) ||
        (typeof profile?.full_name === 'string' && profile.full_name.trim()) ||
        'Proveedor de servicios';

      const insertPayload = {
        user_id: userId,
        company_name: companyName,
        tax_id: (typeof roleData.cif === 'string' && roleData.cif.trim()) || null,
        description: null as string | null,
        service_categories: selectedServices,
        service_area: [
          roleData.company_city,
          roleData.company_province,
          profile?.city,
        ].filter((v): v is string => typeof v === 'string' && v.trim().length > 0),
        verified: true,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: created, error: createError } = await supabase
        .from('service_providers')
        .insert(insertPayload)
        .select('id')
        .single();

      if (createError) {
        // Concurrent create: re-read and reuse
        if (createError.code === '23505') {
          const { data: raced } = await supabase
            .from('service_providers')
            .select('id')
            .eq('user_id', userId)
            .maybeSingle();

          if (raced?.id) {
            return {
              success: true,
              message: 'service_providers row created by concurrent request',
              providerId: raced.id,
              created: false,
            };
          }
        }
        throw new Error(createError.message);
      }

      console.log(`✅ PROVIDER SYNC: Created service_providers row ${created.id}`);
      return {
        success: true,
        message: 'service_providers row created',
        providerId: created.id,
        created: true,
      };
    } catch (error) {
      console.error('❌ PROVIDER SYNC: Failed to ensure service_providers row:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : String(error),
        created: false,
      };
    }
  }
}

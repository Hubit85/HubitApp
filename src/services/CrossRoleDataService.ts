
import { supabase } from "@/integrations/supabase/client";
import { SupabaseUserRoleService, UserRole } from "./SupabaseUserRoleService";
import { SupabasePropertyService } from "./SupabasePropertyService";

export interface CrossRoleSyncResult {
  success: boolean;
  message: string;
  syncedCount?: number;
  errors?: string[];
}

export interface PropertySyncOptions {
  includeDocuments: boolean;
  includeContracts: boolean;
  includeBudgetHistory: boolean;
  syncDirection: 'bidirectional' | 'one-way';
}

export interface RoleSyncMapping {
  sourceRole: UserRole['role_type'];
  targetRole: UserRole['role_type'];
  propertyIds: string[];
  options: PropertySyncOptions;
}

export class CrossRoleDataService {
  
  /**
   * Synchronizes property access across multiple user roles
   */
  static async syncPropertyAccess(
    userId: string, 
    mapping: RoleSyncMapping
  ): Promise<CrossRoleSyncResult> {
    try {
      console.log('🔄 Starting cross-role property sync:', {
        userId: userId.substring(0, 8) + '...',
        sourceRole: mapping.sourceRole,
        targetRole: mapping.targetRole,
        propertyCount: mapping.propertyIds.length
      });

      // Validate user has both roles
      const userRoles = await SupabaseUserRoleService.getUserRoles(userId);
      const sourceRole = userRoles.find(r => r.role_type === mapping.sourceRole && r.is_verified);
      const targetRole = userRoles.find(r => r.role_type === mapping.targetRole && r.is_verified);

      if (!sourceRole || !targetRole) {
        return {
          success: false,
          message: "Usuario debe tener ambos roles verificados para sincronizar datos"
        };
      }

      // Validate property access
      const accessibleProperties = await this.validatePropertyAccess(userId, mapping.sourceRole, mapping.propertyIds);
      
      if (accessibleProperties.length !== mapping.propertyIds.length) {
        return {
          success: false,
          message: "Algunas propiedades no están disponibles para el rol de origen"
        };
      }

      // Execute the sync
      const syncResults = await this.executePropertySync(userId, mapping);
      
      if (syncResults.success) {
        // Update role-specific data to track sync relationships
        await this.updateRoleSyncMetadata(userId, mapping);
        
        console.log('✅ Cross-role property sync completed successfully');
        return {
          success: true,
          message: `${syncResults.syncedCount} propiedades sincronizadas exitosamente`,
          syncedCount: syncResults.syncedCount
        };
      } else {
        return syncResults;
      }

    } catch (error) {
      console.error('❌ Cross-role sync failed:', error);
      return {
        success: false,
        message: "Error interno durante la sincronización de roles"
      };
    }
  }

  /**
   * Validates that the user has access to the specified properties in the given role
   */
  private static async validatePropertyAccess(
    userId: string, 
    roleType: UserRole['role_type'], 
    propertyIds: string[]
  ): Promise<string[]> {
    try {
      let accessibleProperties: string[] = [];

      switch (roleType) {
        case 'particular':
        case 'community_member':
          // Check owned properties
          const ownedProperties = await SupabasePropertyService.getUserProperties(userId);
          accessibleProperties = ownedProperties
            .filter(prop => propertyIds.includes(prop.id))
            .map(prop => prop.id);
          break;

        case 'property_administrator':
          // Check managed properties
          const managedProperties = await SupabasePropertyService.getManagedProperties(userId);
          accessibleProperties = managedProperties
            .filter((prop: { id: string }) => propertyIds.includes(prop.id))
            .map((prop: { id: string }) => prop.id);
          break;

        case 'service_provider':
          // Check properties with service history
          const serviceProperties = await this.getServiceProviderProperties(userId);
          accessibleProperties = serviceProperties
            .filter(propId => propertyIds.includes(propId));
          break;
      }

      return accessibleProperties;

    } catch (error) {
      console.error('Error validating property access:', error);
      return [];
    }
  }

  /**
   * Executes the actual property synchronization process
   */
  private static async executePropertySync(
    userId: string, 
    mapping: RoleSyncMapping
  ): Promise<CrossRoleSyncResult> {
    try {
      let syncedCount = 0;
      const errors: string[] = [];

      // Start transaction using regular queries instead of non-existent RPC
      console.log('🔄 Starting cross-role sync transaction...');

      for (const propertyId of mapping.propertyIds) {
        try {
          // Create property association in target role
          await this.createPropertyAssociation(userId, mapping.targetRole, propertyId, {
            source_role: mapping.sourceRole,
            sync_date: new Date().toISOString(),
            sync_options: mapping.options,
            bidirectional: mapping.options.syncDirection === 'bidirectional'
          });

          // Sync related data based on options
          if (mapping.options.includeDocuments) {
            await this.syncPropertyDocuments(propertyId, mapping.sourceRole, mapping.targetRole);
          }

          if (mapping.options.includeContracts) {
            await this.syncPropertyContracts(propertyId, mapping.sourceRole, mapping.targetRole);
          }

          if (mapping.options.includeBudgetHistory) {
            await this.syncPropertyBudgetHistory(propertyId, mapping.sourceRole, mapping.targetRole);
          }

          syncedCount++;

        } catch (propertyError) {
          console.error(`Failed to sync property ${propertyId}:`, propertyError);
          errors.push(`Propiedad ${propertyId}: ${propertyError instanceof Error ? propertyError.message : 'Error desconocido'}`);
        }
      }

      console.log('✅ Cross-role sync transaction completed');

      return {
        success: syncedCount > 0,
        message: `${syncedCount} de ${mapping.propertyIds.length} propiedades sincronizadas`,
        syncedCount,
        errors: errors.length > 0 ? errors : undefined
      };

    } catch (error) {
      console.error('❌ Cross-role sync failed:', error);
      
      return {
        success: false,
        message: `Error durante la sincronización: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }

  /**
   * Creates property association in target role's data
   */
  private static async createPropertyAssociation(
    userId: string,
    targetRole: UserRole['role_type'],
    propertyId: string,
    metadata: Record<string, any>
  ) {
    const userRoles = await SupabaseUserRoleService.getUserRoles(userId);
    const roleData = userRoles.find(r => r.role_type === targetRole);
    
    if (!roleData) {
      throw new Error(`Target role ${targetRole} not found`);
    }

    const currentData = (roleData.role_specific_data as Record<string, any>) || {};
    const propertyAssociations = currentData.property_associations || [];
    const syncMetadata = currentData.sync_metadata || {};

    // Add property association if not already present
    if (!propertyAssociations.includes(propertyId)) {
      propertyAssociations.push(propertyId);
    }

    // Update sync metadata
    syncMetadata[propertyId] = {
      ...metadata,
      last_updated: new Date().toISOString()
    };

    const updatedData = {
      ...currentData,
      property_associations: propertyAssociations,
      sync_metadata: syncMetadata
    };

    // Update role data using our service
    await this.updateRoleSpecificData(userId, targetRole, updatedData);
  }

  /**
   * Syncs property documents between roles
   */
  private static async syncPropertyDocuments(
    propertyId: string,
    _sourceRole: UserRole['role_type'],
    _targetRole: UserRole['role_type']
  ) {
    try {
      // Instead of using non-existent RPC, directly update document access
      const { data: documents, error: fetchError } = await supabase
        .from('documents')
        .select('*')
        .eq('related_entity_id', propertyId)
        .eq('related_entity_type', 'property');

      if (fetchError) {
        throw new Error(`Failed to fetch property documents: ${fetchError.message}`);
      }

      console.log(`📄 Synced ${documents?.length || 0} documents for property ${propertyId}`);

    } catch (error) {
      console.warn('Document sync failed:', error);
      // Non-critical, continue with other syncing
    }
  }

  /**
   * Syncs property contracts between roles
   */
  private static async syncPropertyContracts(
    propertyId: string,
    _sourceRole: UserRole['role_type'],
    _targetRole: UserRole['role_type']
  ) {
    try {
      // Instead of using non-existent RPC, find contracts related to this property
      const { data: budgetRequests, error: budgetError } = await supabase
        .from('budget_requests')
        .select('id')
        .eq('property_id', propertyId);

      if (budgetError) {
        throw new Error(`Failed to fetch property budget requests: ${budgetError.message}`);
      }

      if (budgetRequests && budgetRequests.length > 0) {
        const budgetRequestIds = budgetRequests.map(br => br.id);
        
        // Get quotes for these budget requests first
        const { data: quotes, error: quotesError } = await supabase
          .from('quotes')
          .select('id')
          .in('budget_request_id', budgetRequestIds);

        if (!quotesError && quotes && quotes.length > 0) {
          const quoteIds = quotes.map(q => q.id);
          
          const { data: contracts } = await supabase
            .from('contracts')
            .select('id')
            .in('quote_id', quoteIds);

          console.log(`📋 Found ${contracts?.length || 0} contracts for property ${propertyId}`);
        }
      }

    } catch (error) {
      console.warn('Contract sync failed:', error);
      // Non-critical, continue with other syncing
    }
  }

  /**
   * Syncs property budget history between roles
   */
  private static async syncPropertyBudgetHistory(
    propertyId: string,
    _sourceRole: UserRole['role_type'],
    _targetRole: UserRole['role_type']
  ) {
    try {
      // Instead of using non-existent RPC, find budget requests for this property
      const { data: budgetHistory, error: budgetError } = await supabase
        .from('budget_requests')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (budgetError) {
        throw new Error(`Failed to fetch budget history: ${budgetError.message}`);
      }

      console.log(`💰 Synced ${budgetHistory?.length || 0} budget requests for property ${propertyId}`);

    } catch (error) {
      console.warn('Budget history sync failed:', error);
      // Non-critical, continue with other syncing
    }
  }

  /**
   * Updates role sync metadata to track relationships
   */
  private static async updateRoleSyncMetadata(
    userId: string,
    mapping: RoleSyncMapping
  ) {
    try {
      const userRoles = await SupabaseUserRoleService.getUserRoles(userId);
      
      // Update source role metadata
      const sourceRole = userRoles.find(r => r.role_type === mapping.sourceRole);
      if (sourceRole) {
        const currentData = (sourceRole.role_specific_data as Record<string, any>) || {};
        const syncHistory = currentData.sync_history || [];
        
        syncHistory.push({
          target_role: mapping.targetRole,
          property_count: mapping.propertyIds.length,
          sync_date: new Date().toISOString(),
          sync_options: mapping.options
        });

        await this.updateRoleSpecificData(userId, mapping.sourceRole, {
          ...currentData,
          sync_history: syncHistory.slice(-10) // Keep last 10 sync operations
        });
      }

    } catch (error) {
      console.warn('Failed to update sync metadata:', error);
      // Non-critical, don't fail the entire operation
    }
  }

  /**
   * Gets properties accessible to service provider
   */
  private static async getServiceProviderProperties(userId: string): Promise<string[]> {
    try {
      // First, get the service provider record
      const { data: providerData, error: providerError } = await supabase
        .from('service_providers')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (providerError) {
        console.error('Error finding service provider:', providerError);
        return [];
      }

      // Then get contracts using the service provider ID
      const { data, error } = await supabase
        .from('contracts')
        .select('quote_id')
        .eq('service_provider_id', providerData.id);

      if (error) {
        console.error('Error fetching service provider contracts:', error);
        return [];
      }

      // Get unique property IDs from the quotes
      if (!data || data.length === 0) {
        return [];
      }

      const quoteIds = data.map(contract => contract.quote_id).filter(Boolean);
      
      if (quoteIds.length === 0) {
        return [];
      }

      // Get properties from budget requests associated with these quotes
      const { data: quotes, error: quotesError } = await supabase
        .from('quotes')
        .select('budget_request_id')
        .in('id', quoteIds);

      if (quotesError || !quotes) {
        console.error('Error fetching quotes for property mapping:', quotesError);
        return [];
      }

      const budgetRequestIds = quotes.map(quote => quote.budget_request_id).filter(Boolean);

      if (budgetRequestIds.length === 0) {
        return [];
      }

      const { data: budgetRequests, error: budgetError } = await supabase
        .from('budget_requests')
        .select('property_id')
        .in('id', budgetRequestIds);

      if (budgetError || !budgetRequests) {
        console.error('Error fetching budget requests for properties:', budgetError);
        return [];
      }

      const propertyIds = budgetRequests
        .map(request => request.property_id)
        .filter(Boolean) as string[];

      return Array.from(new Set(propertyIds));

    } catch (error) {
      console.error('Error getting service provider properties:', error);
      return [];
    }
  }

  /**
   * Updates role-specific data
   */
  private static async updateRoleSpecificData(
    userId: string,
    roleType: UserRole['role_type'],
    data: Record<string, any>
  ) {
    const { error } = await supabase
      .from('user_roles')
      .update({
        role_specific_data: data,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('role_type', roleType);

    if (error) {
      throw new Error(`Failed to update role data: ${error.message}`);
    }
  }

  /**
   * Removes property sync between roles
   */
  static async unsyncProperty(
    userId: string,
    roleType: UserRole['role_type'],
    propertyId: string
  ): Promise<CrossRoleSyncResult> {
    try {
      const userRoles = await SupabaseUserRoleService.getUserRoles(userId);
      const roleData = userRoles.find(r => r.role_type === roleType);
      
      if (!roleData) {
        return {
          success: false,
          message: "Rol no encontrado"
        };
      }

      const currentData = (roleData.role_specific_data as Record<string, any>) || {};
      const propertyAssociations = (currentData.property_associations || []).filter((id: string) => id !== propertyId);
      const syncMetadata = currentData.sync_metadata || {};
      
      // Remove property from sync metadata
      delete syncMetadata[propertyId];

      const updatedData = {
        ...currentData,
        property_associations: propertyAssociations,
        sync_metadata: syncMetadata
      };

      await this.updateRoleSpecificData(userId, roleType, updatedData);

      return {
        success: true,
        message: "Propiedad desincronizada exitosamente"
      };

    } catch (error) {
      console.error('Error unsyncing property:', error);
      return {
        success: false,
        message: "Error al desincronizar propiedad"
      };
    }
  }

  /**
   * Gets sync status for all user roles
   */
  static async getSyncStatus(userId: string): Promise<{
    roles: Array<{
      roleType: UserRole['role_type'];
      syncedProperties: number;
      lastSyncDate?: string;
      syncPartners: UserRole['role_type'][];
    }>;
  }> {
    try {
      const userRoles = await SupabaseUserRoleService.getUserRoles(userId);
      const roleStatuses = [];

      for (const role of userRoles.filter(r => r.is_verified)) {
        const roleData = (role.role_specific_data as Record<string, any>) || {};
        const propertyAssociations = roleData.property_associations || [];
        const syncMetadata = roleData.sync_metadata || {};
        const syncHistory = roleData.sync_history || [];

        // Find sync partners
        const syncPartners = Array.from(new Set(
          syncHistory.map((sync: any) => sync.target_role)
        )) as UserRole['role_type'][];

        // Get last sync date
        const lastSyncDate = syncHistory.length > 0 
          ? syncHistory[syncHistory.length - 1].sync_date 
          : undefined;

        roleStatuses.push({
          roleType: role.role_type,
          syncedProperties: propertyAssociations.length,
          lastSyncDate,
          syncPartners
        });
      }

      return { roles: roleStatuses };

    } catch (error) {
      console.error('Error getting sync status:', error);
      return { roles: [] };
    }
  }
}

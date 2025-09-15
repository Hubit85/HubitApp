
import { supabase } from "@/integrations/supabase/client";

export interface CommunityMemberRequest {
  id: string;
  community_member_id: string;
  property_administrator_id: string;
  community_id?: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  request_message?: string | null;
  response_message?: string | null;
  requested_at: string;
  responded_at?: string | null;
  responded_by?: string | null;
  created_at: string;
  updated_at: string;
  
  community_member?: {
    id: string;
    user_id: string;
    role_specific_data: any;
    profiles?: {
      id: string;
      full_name: string | null;
      email: string;
      phone?: string | null;
    } | null;
  } | null;
  property_administrator?: {
    id: string;
    user_id: string;
    role_specific_data: any;
    profiles?: {
      id: string;
      full_name: string | null;
      email: string;
      phone?: string | null;
    } | null;
  } | null;
  community?: {
    id: string;
    name: string;
    address: string;
    city: string;
  } | null;
}

export interface ManagedCommunity {
  id: string;
  property_administrator_id: string;
  community_member_id: string;
  community_id?: string | null;
  relationship_status: 'active' | 'inactive' | 'suspended';
  established_at: string;
  established_by?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  
  community_member?: {
    id: string;
    user_id: string;
    role_specific_data: any;
    profiles?: {
      id: string;
      full_name: string | null;
      email: string;
      phone?: string | null;
    } | null;
  } | null;
  community?: {
    id: string;
    name: string;
    address: string;
    city: string;
  } | null;
}

export class AdministratorRequestService {
  
  private static async getRoleAndProfile(roleId: string): Promise<{
    id: string;
    user_id: string;
    role_specific_data: any;
    profiles?: {
      id: string;
      full_name: string | null;
      email: string;
      phone?: string | null;
    } | null;
  } | null> {
    if (!roleId) return null;
    
    try {
      const { data: role, error: roleError } = await supabase
        .from('user_roles')
        .select('id, user_id, role_specific_data')
        .eq('id', roleId)
        .single();

      if (roleError || !role) {
        console.warn(`Could not fetch role for roleId ${roleId}:`, roleError?.message);
        return null;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone')
        .eq('id', role.user_id)
        .single();
      
      if (profileError || !profile) {
        console.warn(`Could not fetch profile for userId ${role.user_id}:`, profileError?.message);
        return { 
          id: role.id, 
          user_id: role.user_id, 
          role_specific_data: role.role_specific_data, 
          profiles: null 
        };
      }

      return { 
        id: role.id, 
        user_id: role.user_id, 
        role_specific_data: role.role_specific_data, 
        profiles: {
          id: profile.id,
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone
        }
      };
    } catch (error) {
      console.warn(`Exception in getRoleAndProfile for ${roleId}:`, error);
      return null;
    }
  }

  static async getReceivedRequests(propertyAdministratorRoleId: string): Promise<{
    success: boolean;
    requests: CommunityMemberRequest[];
    message?: string;
  }> {
    try {
      const { data: requests, error } = await supabase
        .from('administrator_requests')
        .select('*')
        .eq('property_administrator_id', propertyAdministratorRoleId)
        .order('requested_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      const enrichedRequests = await Promise.all(
        (requests || []).map(async (request) => {
          const [communityMember, community] = await Promise.all([
            this.getRoleAndProfile(request.community_member_id),
            request.community_id ? this.getCommunityById(request.community_id) : Promise.resolve(null)
          ]);
          return {
            ...request,
            community_member: communityMember,
            community: community,
          };
        })
      );
      
      return {
        success: true,
        requests: enrichedRequests as CommunityMemberRequest[],
      };

    } catch (error) {
      console.error('❌ ADMIN REQUEST: Exception fetching received requests:', error);
      return { success: false, requests: [], message: 'Error inesperado al obtener las solicitudes' };
    }
  }

  static async getSentRequests(communityMemberRoleId: string): Promise<{
    success: boolean;
    requests: CommunityMemberRequest[];
    message?: string;
  }> {
    try {
      const { data: requests, error } = await supabase
        .from('administrator_requests')
        .select('*')
        .eq('community_member_id', communityMemberRoleId)
        .order('requested_at', { ascending: false });
  
      if (error) {
        throw new Error(error.message);
      }
  
      const enrichedRequests = await Promise.all(
        (requests || []).map(async (request) => {
          const [propertyAdministrator, community] = await Promise.all([
            this.getRoleAndProfile(request.property_administrator_id),
            request.community_id ? this.getCommunityById(request.community_id) : Promise.resolve(null)
          ]);
          return {
            ...request,
            property_administrator: propertyAdministrator,
            community: community,
          };
        })
      );
  
      return {
        success: true,
        requests: enrichedRequests as CommunityMemberRequest[],
      };
  
    } catch (error) {
      console.error('❌ ADMIN REQUEST: Exception fetching sent requests:', error);
      return { success: false, requests: [], message: 'Error inesperado al obtener las solicitudes enviadas' };
    }
  }

  private static async getCommunityById(communityId: string): Promise<{
    id: string;
    name: string;
    address: string;
    city: string;
  } | null> {
    try {
      const { data: community, error } = await supabase
        .from('communities')
        .select('*')
        .eq('id', communityId)
        .single();
      
      return error ? null : community;
    } catch (error) {
      console.warn(`Could not fetch community ${communityId}:`, error);
      return null;
    }
  }

  static async searchPropertyAdministrators(searchTerm?: string): Promise<{
    success: boolean;
    administrators: Array<{
      role_id: string;
      user_id: string;
      company_name: string;
      business_email: string;
      business_phone?: string;
      user_name: string;
      user_email: string;
    }>;
    message?: string;
  }> {
    try {
      console.log('🔍 SEARCH: Loading administrators...');
      
      const { data: propertyAdmins, error: propertyError } = await supabase
        .from('property_administrators')
        .select('*');

      if (propertyError) {
        throw new Error(propertyError.message);
      }

      const enrichedAdmins = await Promise.all(
        (propertyAdmins || []).map(async (admin) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, email, phone')
            .eq('id', admin.user_id)
            .single();

          return {
            role_id: admin.id,
            user_id: admin.user_id,
            company_name: admin.company_name || 'Empresa no especificada',
            business_email: admin.contact_email || profile?.email || '',
            business_phone: admin.contact_phone || profile?.phone || '',
            user_name: profile?.full_name || 'Usuario',
            user_email: profile?.email || ''
          };
        })
      );

      let filteredAdmins = enrichedAdmins;
      if (searchTerm && searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        filteredAdmins = enrichedAdmins.filter(admin => 
          admin.company_name.toLowerCase().includes(term) ||
          admin.business_email.toLowerCase().includes(term) ||
          admin.user_name.toLowerCase().includes(term)
        );
      }

      return {
        success: true,
        administrators: filteredAdmins
      };

    } catch (error) {
      console.error('❌ SEARCH: Exception searching administrators:', error);
      return { success: false, administrators: [], message: 'Error inesperado al buscar administradores' };
    }
  }

  static async sendRequestToAdministrator(options: {
    communityMemberRoleId: string;
    propertyAdministratorRoleId: string;
    communityId?: string;
    requestMessage?: string;
  }): Promise<{
    success: boolean;
    message: string;
    requestId?: string;
  }> {
    try {
      console.log('📨 ADMIN REQUEST: Sending request to administrator...');

      // Check if request already exists
      const { data: existingRequest } = await supabase
        .from('administrator_requests')
        .select('id, status')
        .eq('community_member_id', options.communityMemberRoleId)
        .eq('property_administrator_id', options.propertyAdministratorRoleId)
        .eq('status', 'pending')
        .maybeSingle();

      if (existingRequest) {
        return { success: false, message: 'Ya tienes una solicitud pendiente con este administrador.' };
      }

      // Create the request
      const { data: newRequest, error } = await supabase
        .from('administrator_requests')
        .insert({
          community_member_id: options.communityMemberRoleId,
          property_administrator_id: options.propertyAdministratorRoleId,
          community_id: options.communityId,
          status: 'pending',
          request_message: options.requestMessage,
          requested_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) {
        console.error('❌ ADMIN REQUEST: Error creating request:', error);
        throw new Error(error.message);
      }

      console.log('✅ ADMIN REQUEST: Request created successfully:', newRequest.id);

      // CRITICAL: Get administrator user_id to send notification
      const { data: adminRoleData, error: adminRoleError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('id', options.propertyAdministratorRoleId)
        .single();

      if (adminRoleError || !adminRoleData) {
        console.error('❌ NOTIFICATION: Could not find administrator user_id:', adminRoleError);
        // Request was created but notification failed
        return { 
          success: true, 
          message: 'Solicitud enviada (notificación pendiente)', 
          requestId: newRequest.id 
        };
      }

      console.log('📧 NOTIFICATION: Sending to administrator user_id:', adminRoleData.user_id);

      // Get community member info for notification
      const memberRoleData = await this.getRoleAndProfile(options.communityMemberRoleId);
      const memberName = memberRoleData?.profiles?.full_name || 'Un miembro de comunidad';

      // Create notification for administrator
      const { data: notification, error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: adminRoleData.user_id,
          title: '🏢 Nueva Solicitud de Gestión',
          message: `${memberName} ha solicitado que gestiones sus incidencias. Puedes aceptar o rechazar esta solicitud desde el panel de notificaciones.`,
          type: 'info',
          category: 'administrator_request',
          read: false,
          related_entity_type: 'administrator_request',
          related_entity_id: newRequest.id,
          action_url: '/dashboard?tab=notificaciones',
          action_label: 'Ver Solicitud'
        })
        .select('id')
        .single();

      if (notificationError) {
        console.error('❌ NOTIFICATION: Failed to create notification:', notificationError);
        // Request was created but notification failed
        return { 
          success: true, 
          message: 'Solicitud enviada (notificación no enviada)', 
          requestId: newRequest.id 
        };
      }

      console.log('✅ NOTIFICATION: Created successfully:', notification.id);

      return { 
        success: true, 
        message: 'Solicitud enviada correctamente. El administrador recibirá una notificación.', 
        requestId: newRequest.id 
      };

    } catch (error) {
      console.error('❌ ADMIN REQUEST: Exception sending request:', error);
      return { 
        success: false, 
        message: 'Error inesperado al enviar la solicitud: ' + (error instanceof Error ? error.message : 'Error desconocido')
      };
    }
  }

  static async respondToRequest(options: {
    requestId: string;
    response: 'accepted' | 'rejected';
    responseMessage?: string;
    respondedBy: string;
  }): Promise<{ success: boolean; message: string; }> {
    try {
      console.log('📝 ADMIN REQUEST: Responding to request:', options.requestId, 'with:', options.response);

      // First get the original request data
      const { data: originalRequest, error: fetchError } = await supabase
        .from('administrator_requests')
        .select('*')
        .eq('id', options.requestId)
        .single();

      if (fetchError || !originalRequest) {
        console.error('❌ ADMIN REQUEST: Could not fetch original request:', fetchError);
        return { success: false, message: 'No se pudo encontrar la solicitud' };
      }

      // Update the request status
      const { data: updatedRequest, error: updateError } = await supabase
        .from('administrator_requests')
        .update({
          status: options.response,
          response_message: options.responseMessage,
          responded_at: new Date().toISOString(),
          responded_by: options.respondedBy,
          updated_at: new Date().toISOString()
        })
        .eq('id', options.requestId)
        .select('*')
        .single();

      if (updateError) {
        console.error('❌ ADMIN REQUEST: Error updating request:', updateError);
        throw new Error(updateError.message);
      }

      console.log('✅ ADMIN REQUEST: Request updated successfully');

      // If accepted, create management relationship
      if (options.response === 'accepted') {
        console.log('🔗 MANAGEMENT: Creating relationship...');
        
        await this.createManagementRelationship({
          propertyAdministratorRoleId: originalRequest.property_administrator_id,
          communityMemberRoleId: originalRequest.community_member_id,
          communityId: originalRequest.community_id ?? undefined,
          establishedBy: options.respondedBy,
          notes: `Relación establecida tras aceptar solicitud del ${new Date().toLocaleDateString()}`
        });
      }
      
      // Send notification to community member
      console.log('📧 NOTIFICATION: Sending response notification to member...');
      
      const memberRole = await this.getRoleAndProfile(originalRequest.community_member_id);
      const adminRole = await this.getRoleAndProfile(originalRequest.property_administrator_id);

      if (memberRole?.user_id) {
        const adminName = adminRole?.profiles?.full_name || 'El administrador';
        
        const { error: memberNotificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: memberRole.user_id,
            title: options.response === 'accepted' ? '✅ Solicitud Aceptada' : '❌ Solicitud Rechazada',
            message: options.response === 'accepted'
              ? `${adminName} ha aceptado gestionar tus incidencias. Ahora podrás reportar incidencias y serán gestionadas automáticamente.`
              : `${adminName} ha rechazado tu solicitud de gestión de incidencias.`,
            type: options.response === 'accepted' ? 'success' : 'warning',
            category: 'administrator_request',
            read: false,
            related_entity_type: 'administrator_request',
            related_entity_id: options.requestId,
            action_url: '/dashboard?tab=notificaciones'
          });

        if (memberNotificationError) {
          console.warn('⚠️ NOTIFICATION: Failed to notify member:', memberNotificationError);
        } else {
          console.log('✅ NOTIFICATION: Member notified successfully');
        }
      }

      return { 
        success: true, 
        message: options.response === 'accepted' 
          ? 'Solicitud aceptada correctamente. Se ha establecido la relación de gestión.' 
          : 'Solicitud rechazada correctamente.' 
      };

    } catch (error) {
      console.error('❌ ADMIN REQUEST: Exception responding to request:', error);
      return { 
        success: false, 
        message: 'Error inesperado al procesar la respuesta: ' + (error instanceof Error ? error.message : 'Error desconocido')
      };
    }
  }

  private static async createManagementRelationship(options: {
    propertyAdministratorRoleId: string;
    communityMemberRoleId: string;
    communityId?: string;
    establishedBy: string;
    notes?: string;
  }): Promise<{ success: boolean; message: string; relationshipId?: string; }> {
    try {
      // Check if relationship already exists
      const { data: existing } = await supabase
        .from('managed_communities')
        .select('id')
        .eq('property_administrator_id', options.propertyAdministratorRoleId)
        .eq('community_member_id', options.communityMemberRoleId)
        .eq('relationship_status', 'active')
        .maybeSingle();
      
      if (existing) {
        console.log('🔗 MANAGEMENT: Relationship already exists:', existing.id);
        return { success: true, message: 'La relación ya existe', relationshipId: existing.id };
      }

      // Create new relationship
      const { data: newRel, error } = await supabase
        .from('managed_communities')
        .insert({
          property_administrator_id: options.propertyAdministratorRoleId,
          community_member_id: options.communityMemberRoleId,
          community_id: options.communityId,
          relationship_status: 'active',
          established_at: new Date().toISOString(),
          established_by: options.establishedBy,
          notes: options.notes
        })
        .select('id')
        .single();

      if (error) {
        console.error('❌ MANAGEMENT: Error creating relationship:', error);
        throw new Error(error.message);
      }

      console.log('✅ MANAGEMENT: Relationship created successfully:', newRel.id);
      return { success: true, message: 'Relación de gestión creada', relationshipId: newRel.id };
      
    } catch (error) {
      console.error('❌ MANAGEMENT: Exception creating relationship:', error);
      return { 
        success: false, 
        message: 'Error inesperado al crear la relación: ' + (error instanceof Error ? error.message : 'Error desconocido')
      };
    }
  }

  static async getManagedMembers(propertyAdministratorRoleId: string): Promise<{ success: boolean; members: ManagedCommunity[]; message?: string; }> {
    try {
      const { data: managed, error } = await supabase
        .from('managed_communities')
        .select('*')
        .eq('property_administrator_id', propertyAdministratorRoleId)
        .eq('relationship_status', 'active')
        .order('established_at', { ascending: false });
        
      if (error) {
        console.error('❌ MANAGEMENT: Error fetching managed members:', error);
        throw new Error(error.message);
      }
      
      const enrichedMembers = await Promise.all(
        (managed || []).map(async (member) => {
          const [communityMember, community] = await Promise.all([
            this.getRoleAndProfile(member.community_member_id),
            member.community_id ? this.getCommunityById(member.community_id) : Promise.resolve(null)
          ]);
          return { ...member, community_member: communityMember, community };
        })
      );
      
      return { success: true, members: enrichedMembers as ManagedCommunity[] };
      
    } catch (error) {
      console.error('❌ MANAGEMENT: Exception fetching managed members:', error);
      return { success: false, members: [], message: 'Error al obtener miembros gestionados' };
    }
  }

  static async getManagedIncidents(propertyAdministratorRoleId: string): Promise<{ success: boolean; incidents: any[]; message?: string; }> {
    try {
      const managedResult = await this.getManagedMembers(propertyAdministratorRoleId);
      if (!managedResult.success || managedResult.members.length === 0) {
        return { success: true, incidents: [], message: 'No hay miembros gestionados' };
      }
      
      const managedUserIds = managedResult.members
        .map(member => member.community_member?.user_id)
        .filter((id): id is string => !!id && typeof id === 'string');
        
      if (managedUserIds.length === 0) {
        return { success: true, incidents: [], message: 'No se encontraron IDs de usuario válidos' };
      }

      const { data: incidents, error } = await supabase
        .from('incident_reports')
        .select(`
          *,
          profiles:user_id (
            id,
            full_name,
            email,
            phone
          )
        `)
        .in('user_id', managedUserIds)
        .order('reported_at', { ascending: false });
        
      if (error) {
        console.error('❌ INCIDENTS: Error fetching managed incidents:', error);
        throw new Error(error.message);
      }

      // Auto-assign administrator to unassigned incidents
      try {
        const unassignedIncidents = incidents?.filter(incident => 
          !incident.managing_administrator_id
        ) || [];

        if (unassignedIncidents.length > 0) {
          console.log(`🔄 INCIDENTS: Auto-assigning ${unassignedIncidents.length} incidents`);
          
          const incidentIds = unassignedIncidents.map(i => i.id).filter((id): id is string => !!id);
          
          if (incidentIds.length > 0) {
            await supabase
              .from('incident_reports')
              .update({ 
                managing_administrator_id: propertyAdministratorRoleId,
                updated_at: new Date().toISOString()
              })
              .in('id', incidentIds);

            console.log('✅ INCIDENTS: Auto-assignment completed');
          }
        }
      } catch (assignError) {
        console.warn('⚠️ INCIDENTS: Could not auto-assign:', assignError);
      }

      return { success: true, incidents: incidents || [] };
      
    } catch (error) {
      console.error('❌ INCIDENTS: Exception fetching managed incidents:', error);
      return { success: false, incidents: [], message: 'Error inesperado al obtener incidencias' };
    }
  }

  static async cancelRequest(requestId: string): Promise<{ success: boolean; message: string; }> {
    try {
      const { error } = await supabase
        .from('administrator_requests')
        .update({ 
          status: 'cancelled', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', requestId)
        .eq('status', 'pending'); // Only cancel pending requests

      if (error) {
        console.error('❌ ADMIN REQUEST: Error cancelling request:', error);
        throw new Error(error.message);
      }

      console.log('✅ ADMIN REQUEST: Request cancelled successfully');
      return { success: true, message: 'Solicitud cancelada correctamente' };
      
    } catch (error) {
      console.error('❌ ADMIN REQUEST: Exception cancelling request:', error);
      return { 
        success: false, 
        message: 'Error al cancelar la solicitud: ' + (error instanceof Error ? error.message : 'Error desconocido')
      };
    }
  }

  static async endManagementRelationship(relationshipId: string, reason?: string): Promise<{ success: boolean; message: string; }> {
    try {
      const { error } = await supabase
        .from('managed_communities')
        .update({ 
          relationship_status: 'inactive', 
          notes: reason ? `Relación terminada: ${reason}` : 'Relación terminada', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', relationshipId);
        
      if (error) {
        console.error('❌ MANAGEMENT: Error ending relationship:', error);
        throw new Error(error.message);
      }

      console.log('✅ MANAGEMENT: Relationship ended successfully');
      return { success: true, message: 'Relación de gestión terminada correctamente' };
      
    } catch (error) {
      console.error('❌ MANAGEMENT: Exception ending relationship:', error);
      return { 
        success: false, 
        message: 'Error inesperado al terminar la relación: ' + (error instanceof Error ? error.message : 'Error desconocido')
      };
    }
  }
}

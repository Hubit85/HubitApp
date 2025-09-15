
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
    role_specific_data: any;
    profiles?: {
      id: string;
      full_name: string;
      email: string;
      phone?: string;
    };
  } | null;
  property_administrator?: {
    id: string;
    role_specific_data: any;
    profiles?: {
      id: string;
      full_name: string;
      email: string;
      phone?: string;
    };
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
    role_specific_data: any;
    profiles?: {
      id: string;
      full_name: string;
      email: string;
    };
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
      full_name: string;
      email: string;
      phone?: string;
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
        profiles: profile 
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
        throw new Error(error.message);
      }

      const { data: adminRoleData } = await supabase.from('user_roles').select(`user_id`).eq('id', options.propertyAdministratorRoleId).single();
      const memberRoleData = await this.getRoleAndProfile(options.communityMemberRoleId);

      if (adminRoleData?.user_id && memberRoleData?.profiles?.full_name) {
          await supabase.from('notifications').insert({
            user_id: adminRoleData.user_id,
            title: '🏢 Nueva solicitud de gestión',
            message: `${memberRoleData.profiles.full_name} ha solicitado que gestiones sus incidencias.`,
            type: 'info' as const, category: 'request' as const, read: false,
            related_entity_type: 'administrator_request', related_entity_id: newRequest.id,
            action_url: '/dashboard?tab=notificaciones', action_label: 'Ver solicitud'
          });
      }

      return { success: true, message: 'Solicitud enviada correctamente', requestId: newRequest.id };

    } catch (error) {
      console.error('❌ ADMIN REQUEST: Exception sending request:', error);
      return { success: false, message: 'Error inesperado al enviar la solicitud' };
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

      if (updateError) throw new Error(updateError.message);

      if (options.response === 'accepted') {
        await this.createManagementRelationship({
          propertyAdministratorRoleId: updatedRequest.property_administrator_id,
          communityMemberRoleId: updatedRequest.community_member_id,
          communityId: updatedRequest.community_id ?? undefined,
          establishedBy: options.respondedBy,
          notes: `Relación establecida tras aceptar solicitud del ${new Date().toLocaleDateString()}`
        });
      }
      
      const memberRole = await this.getRoleAndProfile(updatedRequest.community_member_id);
      const adminRole = await this.getRoleAndProfile(updatedRequest.property_administrator_id);

      if (memberRole?.user_id) {
          const adminName = adminRole?.profiles?.full_name || 'El administrador';
          await supabase.from('notifications').insert({
            user_id: memberRole.user_id,
            title: options.response === 'accepted' ? '✅ Solicitud aceptada' : '❌ Solicitud rechazada',
            message: options.response === 'accepted'
              ? `${adminName} ha aceptado gestionar tus incidencias.`
              : `${adminName} ha rechazado tu solicitud.`,
            type: options.response === 'accepted' ? 'success' as const : 'warning' as const,
            category: 'request' as const, read: false,
            related_entity_type: 'administrator_request', related_entity_id: options.requestId
          });
      }

      return { success: true, message: options.response === 'accepted' ? 'Solicitud aceptada.' : 'Solicitud rechazada.' };

    } catch (error) {
      console.error('❌ ADMIN REQUEST: Exception responding to request:', error);
      return { success: false, message: 'Error inesperado al procesar la respuesta' };
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
      const { data: existing } = await supabase.from('managed_communities').select('id').eq('property_administrator_id', options.propertyAdministratorRoleId).eq('community_member_id', options.communityMemberRoleId).eq('relationship_status', 'active').maybeSingle();
      if (existing) return { success: true, message: 'La relación ya existe', relationshipId: existing.id };

      const { data: newRel, error } = await supabase.from('managed_communities').insert({
        property_administrator_id: options.propertyAdministratorRoleId,
        community_member_id: options.communityMemberRoleId,
        community_id: options.communityId, relationship_status: 'active',
        established_at: new Date().toISOString(), established_by: options.establishedBy,
        notes: options.notes
      }).select('id').single();

      if (error) throw new Error(error.message);
      return { success: true, message: 'Relación de gestión creada', relationshipId: newRel.id };
    } catch (error) {
      console.error('❌ MANAGEMENT: Exception creating relationship:', error);
      return { success: false, message: 'Error inesperado al crear la relación' };
    }
  }

  static async getManagedMembers(propertyAdministratorRoleId: string): Promise<{ success: boolean; members: ManagedCommunity[]; message?: string; }> {
    try {
      const { data: managed, error } = await supabase.from('managed_communities').select('*').eq('property_administrator_id', propertyAdministratorRoleId).eq('relationship_status', 'active').order('established_at', { ascending: false });
      if (error) throw new Error(error.message);
      
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
      if (!managedResult.success || managedResult.members.length === 0) return { success: true, incidents: [] };
      
      const managedUserIds = managedResult.members
        .map(member => member.community_member?.user_id)
        .filter((id): id is string => !!id && typeof id === 'string');
        
      if (managedUserIds.length === 0) return { success: true, incidents: [] };

      const { data: incidents, error } = await supabase.from('incident_reports').select('*').in('user_id', managedUserIds).order('reported_at', { ascending: false });
      if (error) throw new Error(error.message);

      const enrichedIncidents = await Promise.all(
        (incidents || []).map(async (incident) => {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', incident.user_id).single();
          return { ...incident, profiles: profile };
        })
      );

      return { success: true, incidents: enrichedIncidents || [] };
    } catch (error) {
      console.error('❌ INCIDENTS: Exception fetching managed incidents:', error);
      return { success: false, incidents: [], message: 'Error inesperado al obtener incidencias' };
    }
  }

  static async cancelRequest(requestId: string): Promise<{ success: boolean; message: string; }> {
    try {
      const { error } = await supabase.from('administrator_requests').update({ status: 'cancelled', updated_at: new Date().toISOString() }).eq('id', requestId).eq('status', 'pending');
      if (error) throw new Error(error.message);
      return { success: true, message: 'Solicitud cancelada' };
    } catch (error) {
      console.error('❌ ADMIN REQUEST: Exception cancelling request:', error);
      return { success: false, message: 'Error al cancelar la solicitud' };
    }
  }

  static async endManagementRelationship(relationshipId: string, reason?: string): Promise<{ success: boolean; message: string; }> {
    try {
      const { error } = await supabase.from('managed_communities').update({ relationship_status: 'inactive', notes: reason ? `Relación terminada: ${reason}` : 'Relación terminada', updated_at: new Date().toISOString() }).eq('id', relationshipId);
      if (error) throw new Error(error.message);
      return { success: true, message: 'Relación de gestión terminada' };
    } catch (error) {
      console.error('❌ MANAGEMENT: Exception ending relationship:', error);
      return { success: false, message: 'Error inesperado al terminar la relación' };
    }
  }
}

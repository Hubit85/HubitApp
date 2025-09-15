import { supabase } from "@/integrations/supabase/client";

export interface CommunityMemberRequest {
  id: string;
  community_member_id: string;
  property_administrator_id: string;
  community_id?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  request_message?: string;
  response_message?: string;
  requested_at: string;
  responded_at?: string;
  responded_by?: string;
  created_at: string;
  updated_at: string;
  
  // Campos expandidos desde las relaciones
  community_member?: {
    id: string;
    role_specific_data: any;
    user?: {
      id: string;
      full_name: string;
      email: string;
      phone?: string;
    };
  };
  property_administrator?: {
    id: string;
    role_specific_data: any;
    user?: {
      id: string;
      full_name: string;
      email: string;
      phone?: string;
    };
  };
  community?: {
    id: string;
    name: string;
    address: string;
    city: string;
  };
}

export interface ManagedCommunity {
  id: string;
  property_administrator_id: string;
  community_member_id: string;
  community_id?: string;
  relationship_status: 'active' | 'inactive' | 'suspended';
  established_at: string;
  established_by?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // Campos expandidos
  community_member?: {
    id: string;
    role_specific_data: any;
    user?: {
      id: string;
      full_name: string;
      email: string;
    };
  };
  community?: {
    id: string;
    name: string;
    address: string;
    city: string;
  };
}

export class AdministratorRequestService {
  
  /**
   * Enviar solicitud de un miembro de comunidad a un administrador de fincas
   */
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
      console.log('📨 ADMIN REQUEST: Sending request to administrator...', {
        from: options.communityMemberRoleId.substring(0, 8) + '...',
        to: options.propertyAdministratorRoleId.substring(0, 8) + '...'
      });

      // Verificar que no existe ya una solicitud pendiente entre estos usuarios
      const { data: existingRequest } = await supabase
        .from('administrator_requests')
        .select('id, status')
        .eq('community_member_id', options.communityMemberRoleId)
        .eq('property_administrator_id', options.propertyAdministratorRoleId)
        .eq('status', 'pending')
        .maybeSingle();

      if (existingRequest) {
        return {
          success: false,
          message: 'Ya tienes una solicitud pendiente con este administrador de fincas'
        };
      }

      // Crear nueva solicitud
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
        return {
          success: false,
          message: 'Error al enviar la solicitud'
        };
      }

      // Crear notificación para el administrador
      try {
        const { data: adminRoleData } = await supabase
          .from('user_roles')
          .select(`
            user_id,
            role_specific_data,
            profiles:user_id (full_name, email)
          `)
          .eq('id', options.propertyAdministratorRoleId)
          .single();

        const { data: memberRoleData } = await supabase
          .from('user_roles')
          .select(`
            user_id,
            role_specific_data,
            profiles:user_id (full_name, email)
          `)
          .eq('id', options.communityMemberRoleId)
          .single();

        if (adminRoleData && memberRoleData) {
          await supabase
            .from('notifications')
            .insert({
              user_id: adminRoleData.user_id,
              title: '🏢 Nueva solicitud de gestión',
              message: `${(memberRoleData.profiles as any)?.full_name || 'Un miembro de comunidad'} ha solicitado que gestiones sus incidencias.`,
              type: 'info' as const,
              category: 'request' as const,
              read: false,
              related_entity_type: 'administrator_request',
              related_entity_id: newRequest.id,
              action_url: '/dashboard?tab=profile',
              action_label: 'Ver solicitud'
            });
        }
      } catch (notificationError) {
        console.warn('Could not create notification:', notificationError);
      }

      return {
        success: true,
        message: 'Solicitud enviada correctamente',
        requestId: newRequest.id
      };

    } catch (error) {
      console.error('❌ ADMIN REQUEST: Exception sending request:', error);
      return {
        success: false,
        message: 'Error inesperado al enviar la solicitud'
      };
    }
  }

  /**
   * Obtener solicitudes recibidas por un administrador de fincas
   */
  static async getReceivedRequests(propertyAdministratorRoleId: string): Promise<{
    success: boolean;
    requests: CommunityMemberRequest[];
    message?: string;
  }> {
    try {
      const { data: requests, error } = await supabase
        .from('administrator_requests')
        .select(`
          *,
          community_member:community_member_id (
            id,
            role_specific_data,
            profiles:user_id (
              id,
              full_name,
              email,
              phone
            )
          ),
          community:community_id (
            id,
            name,
            address,
            city
          )
        `)
        .eq('property_administrator_id', propertyAdministratorRoleId)
        .order('requested_at', { ascending: false });

      if (error) {
        console.error('❌ ADMIN REQUEST: Error fetching received requests:', error);
        return {
          success: false,
          requests: [],
          message: 'Error al obtener las solicitudes'
        };
      }

      return {
        success: true,
        requests: (requests || []) as CommunityMemberRequest[]
      };

    } catch (error) {
      console.error('❌ ADMIN REQUEST: Exception fetching received requests:', error);
      return {
        success: false,
        requests: [],
        message: 'Error inesperado al obtener las solicitudes'
      };
    }
  }

  /**
   * Obtener solicitudes enviadas por un miembro de comunidad
   */
  static async getSentRequests(communityMemberRoleId: string): Promise<{
    success: boolean;
    requests: CommunityMemberRequest[];
    message?: string;
  }> {
    try {
      const { data: requests, error } = await supabase
        .from('administrator_requests')
        .select(`
          *,
          property_administrator:property_administrator_id (
            id,
            role_specific_data,
            profiles:user_id (
              id,
              full_name,
              email,
              phone
            )
          ),
          community:community_id (
            id,
            name,
            address,
            city
          )
        `)
        .eq('community_member_id', communityMemberRoleId)
        .order('requested_at', { ascending: false });

      if (error) {
        console.error('❌ ADMIN REQUEST: Error fetching sent requests:', error);
        return {
          success: false,
          requests: [],
          message: 'Error al obtener las solicitudes enviadas'
        };
      }

      return {
        success: true,
        requests: (requests || []) as CommunityMemberRequest[]
      };

    } catch (error) {
      console.error('❌ ADMIN REQUEST: Exception fetching sent requests:', error);
      return {
        success: false,
        requests: [],
        message: 'Error inesperado al obtener las solicitudes enviadas'
      };
    }
  }

  /**
   * Responder a una solicitud (aceptar o rechazar)
   */
  static async respondToRequest(options: {
    requestId: string;
    response: 'accepted' | 'rejected';
    responseMessage?: string;
    respondedBy: string;
  }): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      console.log('📝 ADMIN REQUEST: Responding to request:', options.requestId, 'with:', options.response);

      // Actualizar la solicitud
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
        .select(`
          *,
          community_member:community_member_id (
            user_id,
            profiles:user_id (full_name, email)
          ),
          property_administrator:property_administrator_id (
            user_id,
            profiles:user_id (full_name, email)
          )
        `)
        .single();

      if (updateError) {
        console.error('❌ ADMIN REQUEST: Error updating request:', updateError);
        return {
          success: false,
          message: 'Error al procesar la respuesta'
        };
      }

      // Si la solicitud fue aceptada, crear relación de gestión
      if (options.response === 'accepted') {
        const managementResult = await this.createManagementRelationship({
          propertyAdministratorRoleId: updatedRequest.property_administrator_id,
          communityMemberRoleId: updatedRequest.community_member_id,
          communityId: updatedRequest.community_id,
          establishedBy: options.respondedBy,
          notes: `Relación establecida tras aceptar solicitud del ${new Date().toLocaleDateString()}`
        });

        if (!managementResult.success) {
          console.warn('⚠️ ADMIN REQUEST: Could not create management relationship:', managementResult.message);
        }
      }

      // Crear notificación para el miembro de comunidad
      try {
        const memberData = updatedRequest.community_member as any;
        const adminData = updatedRequest.property_administrator as any;

        if (memberData?.user_id) {
          const notificationTitle = options.response === 'accepted' 
            ? '✅ Solicitud aceptada'
            : '❌ Solicitud rechazada';
            
          const notificationMessage = options.response === 'accepted'
            ? `${adminData?.profiles?.full_name || 'El administrador de fincas'} ha aceptado gestionar tus incidencias. Ahora tus reportes aparecerán en su panel de gestión.`
            : `${adminData?.profiles?.full_name || 'El administrador de fincas'} ha rechazado tu solicitud de gestión.`;

          await supabase
            .from('notifications')
            .insert({
              user_id: memberData.user_id,
              title: notificationTitle,
              message: notificationMessage,
              type: options.response === 'accepted' ? 'success' as const : 'warning' as const,
              category: 'request' as const,
              read: false,
              related_entity_type: 'administrator_request',
              related_entity_id: options.requestId
            });
        }
      } catch (notificationError) {
        console.warn('Could not create response notification:', notificationError);
      }

      const responseMessage = options.response === 'accepted'
        ? 'Solicitud aceptada. Se ha establecido la relación de gestión.'
        : 'Solicitud rechazada correctamente.';

      return {
        success: true,
        message: responseMessage
      };

    } catch (error) {
      console.error('❌ ADMIN REQUEST: Exception responding to request:', error);
      return {
        success: false,
        message: 'Error inesperado al procesar la respuesta'
      };
    }
  }

  /**
   * Crear relación de gestión entre administrador y miembro
   */
  private static async createManagementRelationship(options: {
    propertyAdministratorRoleId: string;
    communityMemberRoleId: string;
    communityId?: string;
    establishedBy: string;
    notes?: string;
  }): Promise<{
    success: boolean;
    message: string;
    relationshipId?: string;
  }> {
    try {
      // Verificar que no existe ya una relación activa
      const { data: existingRelationship } = await supabase
        .from('managed_communities')
        .select('id, relationship_status')
        .eq('property_administrator_id', options.propertyAdministratorRoleId)
        .eq('community_member_id', options.communityMemberRoleId)
        .eq('relationship_status', 'active')
        .maybeSingle();

      if (existingRelationship) {
        return {
          success: true,
          message: 'La relación de gestión ya existe',
          relationshipId: existingRelationship.id
        };
      }

      // Crear nueva relación de gestión
      const { data: newRelationship, error } = await supabase
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
        return {
          success: false,
          message: 'Error al crear la relación de gestión'
        };
      }

      console.log('✅ MANAGEMENT: Management relationship created:', newRelationship.id);
      return {
        success: true,
        message: 'Relación de gestión creada correctamente',
        relationshipId: newRelationship.id
      };

    } catch (error) {
      console.error('❌ MANAGEMENT: Exception creating relationship:', error);
      return {
        success: false,
        message: 'Error inesperado al crear la relación de gestión'
      };
    }
  }

  /**
   * Obtener miembros de comunidad gestionados por un administrador
   */
  static async getManagedMembers(propertyAdministratorRoleId: string): Promise<{
    success: boolean;
    members: ManagedCommunity[];
    message?: string;
  }> {
    try {
      const { data: managedMembers, error } = await supabase
        .from('managed_communities')
        .select(`
          *,
          community_member:community_member_id (
            id,
            role_specific_data,
            profiles:user_id (
              id,
              full_name,
              email
            )
          ),
          community:community_id (
            id,
            name,
            address,
            city
          )
        `)
        .eq('property_administrator_id', propertyAdministratorRoleId)
        .eq('relationship_status', 'active')
        .order('established_at', { ascending: false });

      if (error) {
        console.error('❌ MANAGEMENT: Error fetching managed members:', error);
        return {
          success: false,
          members: [],
          message: 'Error al obtener los miembros gestionados'
        };
      }

      return {
        success: true,
        members: (managedMembers || []) as ManagedCommunity[]
      };

    } catch (error) {
      console.error('❌ MANAGEMENT: Exception fetching managed members:', error);
      return {
        success: false,
        members: [],
        message: 'Error inesperado al obtener los miembros gestionados'
      };
    }
  }

  /**
   * Obtener incidencias de miembros gestionados por un administrador
   */
  static async getManagedIncidents(propertyAdministratorRoleId: string): Promise<{
    success: boolean;
    incidents: any[];
    message?: string;
  }> {
    try {
      // Primero obtener los miembros gestionados
      const managedResult = await this.getManagedMembers(propertyAdministratorRoleId);
      
      if (!managedResult.success || managedResult.members.length === 0) {
        return {
          success: true,
          incidents: [],
          message: 'No hay miembros gestionados'
        };
      }

      // Obtener los user_ids de los miembros gestionados
      const managedUserIds = managedResult.members
        .map(member => member.community_member?.user?.id)
        .filter(Boolean);

      if (managedUserIds.length === 0) {
        return {
          success: true,
          incidents: [],
          message: 'No se encontraron IDs de usuario válidos'
        };
      }

      // Obtener las incidencias de estos usuarios
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
        return {
          success: false,
          incidents: [],
          message: 'Error al obtener las incidencias'
        };
      }

      // También marcar estas incidencias como gestionadas por este administrador
      try {
        if (incidents && incidents.length > 0) {
          await supabase
            .from('incident_reports')
            .update({ 
              managing_administrator_id: propertyAdministratorRoleId,
              updated_at: new Date().toISOString()
            })
            .in('id', incidents.map(i => i.id))
            .is('managing_administrator_id', null);
        }
      } catch (updateError) {
        console.warn('Could not update incident administrator assignment:', updateError);
      }

      return {
        success: true,
        incidents: incidents || []
      };

    } catch (error) {
      console.error('❌ INCIDENTS: Exception fetching managed incidents:', error);
      return {
        success: false,
        incidents: [],
        message: 'Error inesperado al obtener las incidencias'
      };
    }
  }

  /**
   * Cancelar solicitud pendiente
   */
  static async cancelRequest(requestId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const { error } = await supabase
        .from('administrator_requests')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .eq('status', 'pending');

      if (error) {
        console.error('❌ ADMIN REQUEST: Error cancelling request:', error);
        return {
          success: false,
          message: 'Error al cancelar la solicitud'
        };
      }

      return {
        success: true,
        message: 'Solicitud cancelada correctamente'
      };

    } catch (error) {
      console.error('❌ ADMIN REQUEST: Exception cancelling request:', error);
      return {
        success: false,
        message: 'Error inesperado al cancelar la solicitud'
      };
    }
  }

  /**
   * Buscar administradores de fincas disponibles
   */
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
      let query = supabase
        .from('user_roles')
        .select(`
          id,
          user_id,
          role_specific_data,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .eq('role_type', 'property_administrator')
        .eq('is_verified', true)
        .eq('is_active', true);

      // Si hay término de búsqueda, filtrar por nombre de empresa o email
      if (searchTerm && searchTerm.trim()) {
        // Nota: En PostgreSQL necesitaríamos usar ilike con JSON
        // Para simplificar, obtenemos todos y filtramos en el cliente
      }

      const { data: administrators, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('❌ SEARCH: Error searching administrators:', error);
        return {
          success: false,
          administrators: [],
          message: 'Error al buscar administradores'
        };
      }

      // Procesar y filtrar resultados
      let processedAdmins = (administrators || [])
        .map((admin: any) => {
          const roleData = admin.role_specific_data || {};
          const profile = admin.profiles || {};
          
          return {
            role_id: admin.id,
            user_id: admin.user_id,
            company_name: roleData.company_name || 'Empresa no especificada',
            business_email: roleData.business_email || profile.email || '',
            business_phone: roleData.business_phone || '',
            user_name: profile.full_name || 'Usuario',
            user_email: profile.email || ''
          };
        });

      // Filtrar por término de búsqueda si se proporciona
      if (searchTerm && searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        processedAdmins = processedAdmins.filter(admin => 
          admin.company_name.toLowerCase().includes(term) ||
          admin.business_email.toLowerCase().includes(term) ||
          admin.user_name.toLowerCase().includes(term)
        );
      }

      return {
        success: true,
        administrators: processedAdmins
      };

    } catch (error) {
      console.error('❌ SEARCH: Exception searching administrators:', error);
      return {
        success: false,
        administrators: [],
        message: 'Error inesperado al buscar administradores'
      };
    }
  }

  /**
   * Terminar relación de gestión
   */
  static async endManagementRelationship(relationshipId: string, reason?: string): Promise<{
    success: boolean;
    message: string;
  }> {
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
        return {
          success: false,
          message: 'Error al terminar la relación de gestión'
        };
      }

      return {
        success: true,
        message: 'Relación de gestión terminada correctamente'
      };

    } catch (error) {
      console.error('❌ MANAGEMENT: Exception ending relationship:', error);
      return {
        success: false,
        message: 'Error inesperado al terminar la relación'
      };
    }
  }
}

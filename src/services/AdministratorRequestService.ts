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

            try {
                const { data: adminRoleData } = await supabase
                    .from('user_roles')
                    .select(`user_id`)
                    .eq('id', options.propertyAdministratorRoleId)
                    .single();

                const { data: memberRoleData } = await supabase
                    .from('user_roles')
                    .select(`profiles:user_id(full_name)`)
                    .eq('id', options.communityMemberRoleId)
                    .single();

                if (adminRoleData && memberRoleData) {
                    const memberName = (memberRoleData.profiles as any)?.full_name || 'Un miembro de comunidad';
                    await supabase
                        .from('notifications')
                        .insert({
                            user_id: adminRoleData.user_id,
                            title: '🏢 Nueva solicitud de gestión',
                            message: `${memberName} ha solicitado que gestiones sus incidencias.`,
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
                requests: (requests || []) as unknown as CommunityMemberRequest[]
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
                requests: (requests || []) as unknown as CommunityMemberRequest[]
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
          community_member:community_member_id(user_id, profiles:user_id(full_name)),
          property_administrator:property_administrator_id(profiles:user_id(full_name))
        `)
                .single();

            if (updateError) {
                console.error('❌ ADMIN REQUEST: Error updating request:', updateError);
                return {
                    success: false,
                    message: 'Error al procesar la respuesta'
                };
            }

            if (options.response === 'accepted') {
                const managementResult = await this.createManagementRelationship({
                    propertyAdministratorRoleId: updatedRequest.property_administrator_id,
                    communityMemberRoleId: updatedRequest.community_member_id,
                    communityId: updatedRequest.community_id ?? undefined,
                    establishedBy: options.respondedBy,
                    notes: `Relación establecida tras aceptar solicitud del ${new Date().toLocaleDateString()}`
                });

                if (!managementResult.success) {
                    console.warn('⚠️ ADMIN REQUEST: Could not create management relationship:', managementResult.message);
                }
            }

            try {
                const memberData = updatedRequest.community_member as any;
                const adminData = updatedRequest.property_administrator as any;

                if (memberData?.user_id) {
                    const adminName = adminData?.profiles?.full_name || 'El administrador de fincas';
                    const notificationTitle = options.response === 'accepted'
                        ? '✅ Solicitud aceptada'
                        : '❌ Solicitud rechazada';

                    const notificationMessage = options.response === 'accepted'
                        ? `${adminName} ha aceptado gestionar tus incidencias. Ahora tus reportes aparecerán en su panel de gestión.`
                        : `${adminName} ha rechazado tu solicitud de gestión.`;

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
                members: (managedMembers || []) as unknown as ManagedCommunity[]
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

    static async getManagedIncidents(propertyAdministratorRoleId: string): Promise<{
        success: boolean;
        incidents: any[];
        message?: string;
    }> {
        try {
            const managedResult = await this.getManagedMembers(propertyAdministratorRoleId);

            if (!managedResult.success || managedResult.members.length === 0) {
                return {
                    success: true,
                    incidents: [],
                    message: 'No hay miembros gestionados'
                };
            }

            const managedUserIds = managedResult.members
                .map(member => (member.community_member as any)?.profiles?.id)
                .filter((id): id is string => !!id);

            if (managedUserIds.length === 0) {
                return {
                    success: true,
                    incidents: [],
                    message: 'No se encontraron IDs de usuario válidos'
                };
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
                return {
                    success: false,
                    incidents: [],
                    message: 'Error al obtener las incidencias'
                };
            }

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

    static async searchPropertyAdministrators(searchTerm?: string): Promise<
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
        console.log('🔍 SEARCH: Loading administrators from property_administrators table...');

        // Cargar directamente desde la tabla property_administrators
        const { data: propertyAdmins, error: propertyError } = await supabase
            .from('property_administrators')
            .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
            .order('created_at', { ascending: false });

        if(propertyError) {
            console.error('❌ SEARCH: Error loading property administrators:', propertyError);
            return {
                success: false,
                administrators: [],
                message: 'Error al buscar administradores'
            };
        }

      console.log('📋 RAW ADMINISTRATORS DATA:', {
            total_count: propertyAdmins?.length || 0,
            administrators: propertyAdmins?.map(admin => ({
                id: admin.id?.substring(0, 8) + '...',
                company_name: admin.company_name,
                contact_email: admin.contact_email
            }))
        });

        // Procesar administradores desde la tabla property_administrators
        let processedAdmins = (propertyAdmins || [])
            .map((admin: any) => {
                const profile = admin.profiles || {};

                // Crear un role_id único usando el ID del administrador de propiedad
                const administrator = {
                    role_id: admin.id, // Usar el ID del administrador de propiedad como role_id
                    user_id: admin.user_id,
                    company_name: admin.company_name || 'Empresa no especificada',
                    business_email: admin.contact_email || profile.email || '',
                    business_phone: admin.contact_phone || '',
                    user_name: profile.full_name || 'Usuario',
                    user_email: profile.email || ''
                };

                console.log(`✅ PROCESSED admin:`, {
                    company_name: administrator.company_name,
                    business_email: administrator.business_email,
                    user_name: administrator.user_name
                });

                return administrator;
            });

        // Aplicar filtro de búsqueda si se proporciona
        if(searchTerm && searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    const originalCount = processedAdmins.length;

    processedAdmins = processedAdmins.filter(admin =>
        admin.company_name.toLowerCase().includes(term) ||
        admin.business_email.toLowerCase().includes(term) ||
        admin.user_name.toLowerCase().includes(term)
    );

    console.log(`🔍 SEARCH FILTER: "${term}" reduced ${originalCount} to ${processedAdmins.length} results`);
}

console.log('🎯 FINAL SEARCH RESULTS:', {
    total_found: processedAdmins.length,
    administrators: processedAdmins.map(admin => ({
        company_name: admin.company_name,
        business_email: admin.business_email,
        user_name: admin.user_name
    }))
});

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

  static async endManagementRelationship(relationshipId: string, reason ?: string): Promise < {
    success: boolean;
    message: string;
} > {
    try {
        const { error } = await supabase
            .from('managed_communities')
            .update({
                relationship_status: 'inactive',
                notes: reason ? `Relación terminada: ${reason}` : 'Relación terminada',
                updated_at: new Date().toISOString()
            })
            .eq('id', relationshipId);

        if(error) {
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

    } catch(error) {
        console.error('❌ MANAGEMENT: Exception ending relationship:', error);
        return {
            success: false,
            message: 'Error inesperado al terminar la relación'
        };
    }
}

  static async getAdministratorProfile(propertyAdministratorRoleId: string): Promise < {
    success: boolean;
    profile?: {
        id: string;
        user_id: string;
        company_name: string;
        contact_email: string;
        contact_phone?: string;
        website?: string;
        description?: string;
        services?: string[];
        years_experience?: number;
        created_at: string;
        updated_at: string;
        profile: {
            full_name: string;
            email: string;
            avatar_url?: string;
        };
    };
    message?: string;
} > {
    try {
        const { data: adminProfile, error } = await supabase
            .from('property_administrators')
            .select(`
          *,
          profiles:user_id (
            full_name,
            email,
            avatar_url
          )
        `)
            .eq('id', propertyAdministratorRoleId)
            .single();

        if(error) {
            console.error('❌ PROFILE: Error fetching administrator profile:', error);
            return {
                success: false,
                message: 'Error al obtener el perfil del administrador'
            };
        }

      return {
            success: true,
            profile: adminProfile as any
        };

    } catch(error) {
        console.error('❌ PROFILE: Exception fetching administrator profile:', error);
        return {
            success: false,
            message: 'Error inesperado al obtener el perfil del administrador'
        };
    }
}

  static async updateAdministratorProfile(propertyAdministratorRoleId: string, updates: {
    company_name?: string;
    contact_email?: string;
    contact_phone?: string;
    website?: string;
    description?: string;
    services?: string[];
    years_experience?: number;
}): Promise < {
    success: boolean;
    message: string;
} > {
    try {
        const { error } = await supabase
            .from('property_administrators')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', propertyAdministratorRoleId);

        if(error) {
            console.error('❌ PROFILE: Error updating administrator profile:', error);
            return {
                success: false,
                message: 'Error al actualizar el perfil del administrador'
            };
        }

      return {
            success: true,
            message: 'Perfil actualizado correctamente'
        };

    } catch(error) {
        console.error('❌ PROFILE: Exception updating administrator profile:', error);
        return {
            success: false,
            message: 'Error inesperado al actualizar el perfil del administrador'
        };
    }
}
}
}
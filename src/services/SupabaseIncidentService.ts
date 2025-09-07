
import { supabase } from "@/integrations/supabase/client";

export interface IncidentInsert {
  title: string;
  description: string;
  category: string;
  urgency: string;
  work_location?: string;
  special_requirements?: string;
  images?: string[];
  documents?: string[];
  reporter_id: string;
  community_id: string;
  administrator_id: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: string;
  urgency: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'processed';
  work_location?: string;
  special_requirements?: string;
  images?: string[];
  documents?: string[];
  reporter_id: string;
  community_id: string;
  administrator_id: string;
  admin_notes?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  created_at: string;
  updated_at: string;
  // Additional joined fields
  reporter_name?: string;
  reporter_email?: string;
  community_name?: string;
}

export class SupabaseIncidentService {
  static async createIncident(incidentData: IncidentInsert): Promise<Incident> {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .insert(incidentData)
        .select()
        .single();

      if (error) {
        console.error("Error creating incident:", error);
        throw new Error(`Error al crear la incidencia: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Service error creating incident:", error);
      throw error;
    }
  }

  static async getIncidentsByReporter(reporterId: string): Promise<Incident[]> {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select(`
          *,
          community:communities!incidents_community_id_fkey(
            name
          )
        `)
        .eq('reporter_id', reporterId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching incidents by reporter:", error);
        throw new Error(`Error al obtener incidencias: ${error.message}`);
      }

      return (data || []).map(incident => ({
        ...incident,
        community_name: incident.community?.name || 'Comunidad desconocida'
      }));
    } catch (error) {
      console.error("Service error fetching incidents by reporter:", error);
      throw error;
    }
  }

  static async getIncidentsByAdministrator(administratorId: string): Promise<Incident[]> {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select(`
          *,
          reporter:profiles!incidents_reporter_id_fkey(
            full_name,
            email
          ),
          community:communities!incidents_community_id_fkey(
            name
          )
        `)
        .eq('administrator_id', administratorId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching incidents by administrator:", error);
        throw new Error(`Error al obtener incidencias: ${error.message}`);
      }

      return (data || []).map(incident => ({
        ...incident,
        reporter_name: incident.reporter?.full_name || 'Usuario desconocido',
        reporter_email: incident.reporter?.email || '',
        community_name: incident.community?.name || 'Comunidad desconocida'
      }));
    } catch (error) {
      console.error("Service error fetching incidents by administrator:", error);
      throw error;
    }
  }

  static async updateIncidentStatus(
    incidentId: string,
    status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'processed',
    adminNotes?: string,
    reviewedBy?: string
  ): Promise<Incident> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (adminNotes !== undefined) {
        updateData.admin_notes = adminNotes;
      }

      if (reviewedBy) {
        updateData.reviewed_by = reviewedBy;
        updateData.reviewed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('incidents')
        .update(updateData)
        .eq('id', incidentId)
        .select()
        .single();

      if (error) {
        console.error("Error updating incident status:", error);
        throw new Error(`Error al actualizar el estado de la incidencia: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Service error updating incident status:", error);
      throw error;
    }
  }

  static async getIncidentById(incidentId: string): Promise<Incident | null> {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select(`
          *,
          reporter:profiles!incidents_reporter_id_fkey(
            full_name,
            email
          ),
          community:communities!incidents_community_id_fkey(
            name
          )
        `)
        .eq('id', incidentId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error("Error fetching incident by ID:", error);
        throw new Error(`Error al obtener la incidencia: ${error.message}`);
      }

      return {
        ...data,
        reporter_name: data.reporter?.full_name || 'Usuario desconocido',
        reporter_email: data.reporter?.email || '',
        community_name: data.community?.name || 'Comunidad desconocida'
      };
    } catch (error) {
      console.error("Service error fetching incident by ID:", error);
      throw error;
    }
  }

  static async uploadIncidentFile(file: File, incidentId: string): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `incident-${incidentId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('incident-attachments')
        .upload(fileName, file);

      if (uploadError) {
        console.error("Error uploading incident file:", uploadError);
        throw new Error(`Error al subir archivo: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('incident-attachments')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error("Service error uploading incident file:", error);
      throw error;
    }
  }

  static async deleteIncidentFile(filePath: string): Promise<void> {
    try {
      const fileName = filePath.split('/').pop();
      if (!fileName) return;

      const { error } = await supabase.storage
        .from('incident-attachments')
        .remove([fileName]);

      if (error) {
        console.error("Error deleting incident file:", error);
        throw new Error(`Error al eliminar archivo: ${error.message}`);
      }
    } catch (error) {
      console.error("Service error deleting incident file:", error);
      throw error;
    }
  }

  static async getRecentIncidentsSummary(administratorId: string): Promise<{
    total: number;
    pending: number;
    approved: number;
    recent: Incident[];
  }> {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select(`
          *,
          reporter:profiles!incidents_reporter_id_fkey(full_name),
          community:communities!incidents_community_id_fkey(name)
        `)
        .eq('administrator_id', administratorId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching incidents summary:", error);
        throw new Error(`Error al obtener resumen de incidencias: ${error.message}`);
      }

      const incidents = (data || []).map(incident => ({
        ...incident,
        reporter_name: incident.reporter?.full_name || 'Usuario desconocido',
        community_name: incident.community?.name || 'Comunidad desconocida'
      }));

      const total = incidents.length;
      const pending = incidents.filter(i => i.status === 'pending').length;
      const approved = incidents.filter(i => i.status === 'approved').length;
      const recent = incidents.slice(0, 5);

      return {
        total,
        pending,
        approved,
        recent
      };
    } catch (error) {
      console.error("Service error fetching incidents summary:", error);
      throw error;
    }
  }

  static async processIncidentToBudgetRequest(incident: Incident, userId: string): Promise<void> {
    try {
      // Mark the incident as processed
      await this.updateIncidentStatus(incident.id, 'processed', incident.admin_notes, userId);

      // Note: The actual budget request creation will be handled by the parent component
      // This service method just marks the incident as processed
    } catch (error) {
      console.error("Service error processing incident to budget request:", error);
      throw error;
    }
  }

  static async getCommunityFromIncident(incidentId: string): Promise<{ id: string; name: string; address: string } | null> {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select(`
          community:communities!incidents_community_id_fkey(
            id,
            name,
            address
          )
        `)
        .eq('id', incidentId)
        .single();

      if (error || !data?.community) {
        return null;
      }

      return data.community;
    } catch (error) {
      console.error("Service error fetching community from incident:", error);
      return null;
    }
  }
}

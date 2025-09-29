
import { supabase } from "@/integrations/supabase/client";

export interface CommunityCodeData {
  country: string;
  province: string;
  city: string;
  street: string;
  street_number: string;
  created_by: string;
}

export interface CommunityCode {
  id: string;
  code: string;
  country: string;
  province: string;
  city: string;
  street: string;
  street_number: string;
  created_at: string;
  created_by: string;
  updated_at: string;
}

export class CommunityCodeService {
  static generateCommunityCode(data: CommunityCodeData): string {
    // Obtener 3 primeras letras del país
    const countryCode = data.country.substring(0, 3).toUpperCase();
    
    // Obtener 3 primeras letras de la provincia
    const provinceCode = data.province.substring(0, 3).toUpperCase();
    
    // Obtener 3 primeras letras de la ciudad
    const cityCode = data.city.substring(0, 3).toUpperCase();
    
    // Obtener 6 primeras letras de la calle, rellenar con X si es necesario
    let streetCode = data.street.replace(/[^a-zA-Z]/g, '').substring(0, 6).toUpperCase();
    while (streetCode.length < 6) {
      streetCode += 'X';
    }
    
    // Formatear número de calle a 4 dígitos
    const streetNumber = data.street_number.padStart(4, '0');
    
    return `${countryCode}-${provinceCode}-${cityCode}-${streetCode}${streetNumber}`;
  }

  static async findExistingCode(data: CommunityCodeData): Promise<CommunityCode | null> {
    const { data: existingCode, error } = await supabase
      .from('community_codes')
      .select('*')
      .eq('country', data.country)
      .eq('province', data.province)
      .eq('city', data.city)
      .eq('street', data.street)
      .eq('street_number', data.street_number)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw new Error(`Error buscando código existente: ${error.message}`);
    }

    return existingCode;
  }

  static async createOrGetCommunityCode(data: CommunityCodeData): Promise<{ code: string; isNew: boolean }> {
    try {
      // Verificar si ya existe un código para esta combinación
      const existingCode = await this.findExistingCode(data);
      
      if (existingCode) {
        return { code: existingCode.code, isNew: false };
      }

      // Generar nuevo código
      const generatedCode = this.generateCommunityCode(data);

      // Insertar nuevo código en la base de datos
      const { data: newCode, error } = await supabase
        .from('community_codes')
        .insert({
          code: generatedCode,
          country: data.country,
          province: data.province,
          city: data.city,
          street: data.street,
          street_number: data.street_number,
          created_by: data.created_by
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Error creando código de comunidad: ${error.message}`);
      }

      return { code: newCode.code, isNew: true };
    } catch (error: any) {
      throw new Error(`Error en el servicio de códigos de comunidad: ${error.message}`);
    }
  }

  static async getAllCommunityCodes(): Promise<CommunityCode[]> {
    const { data, error } = await supabase
      .from('community_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error obteniendo códigos de comunidad: ${error.message}`);
    }

    return data || [];
  }

  static async getCommunityCodeByCode(code: string): Promise<CommunityCode | null> {
    const { data, error } = await supabase
      .from('community_codes')
      .select('*')
      .eq('code', code)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error obteniendo código de comunidad: ${error.message}`);
    }

    return data;
  }

  static async deleteCommunityCode(id: string): Promise<void> {
    const { error } = await supabase
      .from('community_codes')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error eliminando código de comunidad: ${error.message}`);
    }
  }
}

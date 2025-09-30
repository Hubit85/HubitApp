
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
  created_at: string | null;
  created_by: string;
  updated_at: string | null;
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
    
    return `${countryCode}-${provinceCode}-${cityCode}-${streetCode}-${streetNumber}`;
  }

  static generateUniqueCodeVariant(baseCode: string, attempt: number): string {
    // Si es el primer intento, devolver el código base
    if (attempt === 0) {
      return baseCode;
    }
    
    // Para intentos subsecuentes, agregar un sufijo único
    const suffix = attempt.toString().padStart(2, '0');
    return `${baseCode}-${suffix}`;
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

    return existingCode as CommunityCode | null;
  }

  static async isCodeUnique(code: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('community_codes')
      .select('id')
      .eq('code', code)
      .single();

    // Si no hay error, significa que encontró un registro (no es único)
    // Si el error es PGRST116 (no rows returned), significa que es único
    if (error && error.code === 'PGRST116') {
      return true; // Es único
    }

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error verificando unicidad del código: ${error.message}`);
    }

    return false; // No es único
  }

  static async createOrGetCommunityCode(data: CommunityCodeData): Promise<{ code: string; isNew: boolean }> {
    try {
      // Verificar si ya existe un código para esta combinación exacta
      const existingCode = await this.findExistingCode(data);
      
      if (existingCode) {
        return { code: existingCode.code, isNew: false };
      }

      // Generar código base
      const baseCode = this.generateCommunityCode(data);

      // MEJORA CRÍTICA: Buscar un código único con intentos múltiples
      let uniqueCode = baseCode;
      let attempt = 0;
      const maxAttempts = 100;

      while (attempt < maxAttempts) {
        uniqueCode = this.generateUniqueCodeVariant(baseCode, attempt);
        
        const isUnique = await this.isCodeUnique(uniqueCode);
        
        if (isUnique) {
          break; // Encontramos un código único
        }
        
        attempt++;
      }

      if (attempt >= maxAttempts) {
        throw new Error('No se pudo generar un código único después de múltiples intentos');
      }

      // Insertar nuevo código en la base de datos con el código único generado
      const { data: newCode, error } = await supabase
        .from('community_codes')
        .insert({
          code: uniqueCode,
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
        // MEJORA CRÍTICA: Manejo específico para errores de duplicados
        if (error.code === '23505') { // unique_violation
          console.warn(`Código duplicado detectado (${uniqueCode}), reintentando...`);
          
          // Reintentar con un código diferente
          const timestamp = Date.now().toString().slice(-4);
          const fallbackCode = `${baseCode}-${timestamp}`;
          
          const { data: fallbackNewCode, error: fallbackError } = await supabase
            .from('community_codes')
            .insert({
              code: fallbackCode,
              country: data.country,
              province: data.province,
              city: data.city,
              street: data.street,
              street_number: data.street_number,
              created_by: data.created_by
            })
            .select()
            .single();

          if (fallbackError) {
            throw new Error(`Error creando código de comunidad con fallback: ${fallbackError.message}`);
          }

          return { code: fallbackNewCode.code, isNew: true };
        }
        
        throw new Error(`Error creando código de comunidad: ${error.message}`);
      }

      return { code: newCode.code, isNew: true };
    } catch (error: any) {
      console.error('Error en CommunityCodeService:', error);
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

    return (data as CommunityCode[]) || [];
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

    return data as CommunityCode | null;
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

  // NUEVO MÉTODO: Para debugging y monitoreo
  static async getCodeStatistics(): Promise<{
    total: number;
    uniquePatterns: number;
    duplicatePatterns: string[];
  }> {
    const { data, error } = await supabase
      .from('community_codes')
      .select('code');

    if (error) {
      throw new Error(`Error obteniendo estadísticas de códigos: ${error.message}`);
    }

    const codes = data.map(item => item.code);
    const uniqueCodes = new Set(codes);
    const duplicates: string[] = [];

    codes.forEach(code => {
      const occurrences = codes.filter(c => c === code).length;
      if (occurrences > 1 && !duplicates.includes(code)) {
        duplicates.push(code);
      }
    });

    return {
      total: codes.length,
      uniquePatterns: uniqueCodes.size,
      duplicatePatterns: duplicates
    };
  }
}

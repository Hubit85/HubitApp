
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
      // PASO 1: Verificar si ya existe un código para esta combinación exacta de ubicación
      console.log('🔍 Buscando código existente para:', {
        country: data.country,
        province: data.province, 
        city: data.city,
        street: data.street,
        street_number: data.street_number
      });

      const existingCode = await this.findExistingCode(data);
      
      if (existingCode) {
        console.log('✅ Código existente encontrado:', existingCode.code);
        return { code: existingCode.code, isNew: false };
      }

      // PASO 2: No existe código para esta ubicación, generar nuevo código base
      const baseCode = this.generateCommunityCode(data);
      console.log('🏗️ Código base generado:', baseCode);

      // PASO 3: Verificar si el código base está disponible
      const isBaseCodeUnique = await this.isCodeUnique(baseCode);
      
      if (isBaseCodeUnique) {
        // El código base está disponible, crearlo directamente
        console.log('✨ Código base disponible, creando:', baseCode);
        
        const { data: newCode, error } = await supabase
          .from('community_codes')
          .insert({
            code: baseCode,
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

        console.log('✅ Nuevo código creado exitosamente:', newCode.code);
        return { code: newCode.code, isNew: true };
      }

      // PASO 4: El código base ya existe para otra ubicación, generar variante única
      console.log('⚠️ Código base ya existe para otra ubicación, generando variante única...');
      
      let uniqueCode = baseCode;
      let attempt = 1;
      const maxAttempts = 100;

      while (attempt <= maxAttempts) {
        // Generar código con sufijo numérico
        const suffix = attempt.toString().padStart(2, '0');
        uniqueCode = `${baseCode}-${suffix}`;
        
        console.log(`🔄 Intento ${attempt}: Verificando código ${uniqueCode}`);
        
        const isUnique = await this.isCodeUnique(uniqueCode);
        
        if (isUnique) {
          console.log(`✨ Código único encontrado: ${uniqueCode}`);
          break;
        }
        
        attempt++;
      }

      if (attempt > maxAttempts) {
        throw new Error('No se pudo generar un código único después de múltiples intentos');
      }

      // PASO 5: Crear el nuevo código único
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
        // Manejo específico para errores de duplicados
        if (error.code === '23505') { // unique_violation
          console.warn(`⚠️ Código duplicado detectado (${uniqueCode}), generando fallback...`);
          
          // Generar código de fallback con timestamp
          const timestamp = Date.now().toString().slice(-6);
          const fallbackCode = `${baseCode}-T${timestamp}`;
          
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

          console.log('✅ Código fallback creado:', fallbackNewCode.code);
          return { code: fallbackNewCode.code, isNew: true };
        }
        
        throw new Error(`Error creando código de comunidad: ${error.message}`);
      }

      console.log('✅ Nuevo código con variante creado exitosamente:', newCode.code);
      return { code: newCode.code, isNew: true };

    } catch (error: any) {
      console.error('❌ Error en CommunityCodeService:', error);
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

  // Método para obtener todos los usuarios que comparten un código de comunidad
  static async getUsersWithCommunityCode(code: string): Promise<{
    communityCode: CommunityCode;
    properties: any[];
    totalUsers: number;
  }> {
    try {
      // Obtener información del código de comunidad
      const communityCode = await this.getCommunityCodeByCode(code);
      
      if (!communityCode) {
        throw new Error('Código de comunidad no encontrado');
      }

      // Buscar todas las propiedades que usan este código
      const { data: properties, error } = await supabase
        .from('properties')
        .select(`
          id,
          name,
          user_id,
          community_code,
          created_at,
          profiles!properties_user_id_fkey (
            id,
            full_name,
            email
          )
        `)
        .eq('community_code', code)
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(`Error obteniendo propiedades con código ${code}: ${error.message}`);
      }

      // Contar usuarios únicos
      const uniqueUsers = new Set(properties?.map(p => p.user_id) || []);

      return {
        communityCode,
        properties: properties || [],
        totalUsers: uniqueUsers.size
      };

    } catch (error: any) {
      console.error('Error obteniendo usuarios con código de comunidad:', error);
      throw error;
    }
  }

  // NUEVO MÉTODO: Para debugging y monitoreo
  static async getCodeStatistics(): Promise<{
    total: number;
    uniquePatterns: number;
    duplicatePatterns: string[];
    sharedCodes: { code: string; userCount: number; }[];
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

    // Obtener códigos compartidos con conteo de usuarios
    const sharedCodes: { code: string; userCount: number; }[] = [];
    
    for (const code of uniqueCodes) {
      try {
        const { totalUsers } = await this.getUsersWithCommunityCode(code);
        if (totalUsers > 1) {
          sharedCodes.push({ code, userCount: totalUsers });
        }
      } catch (err) {
        // Ignorar errores para códigos individuales
        console.warn(`No se pudo obtener información para código ${code}`);
      }
    }

    return {
      total: codes.length,
      uniquePatterns: uniqueCodes.size,
      duplicatePatterns: duplicates,
      sharedCodes: sharedCodes.sort((a, b) => b.userCount - a.userCount)
    };
  }
}


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
    // NORMALIZAR DATOS PARA GENERACIÓN CONSISTENTE
    const country = data.country.trim().toUpperCase();
    const province = data.province.trim().toUpperCase();
    const city = data.city.trim().toUpperCase();
    const street = data.street.trim().toUpperCase();
    const streetNumberStr = data.street_number.trim();

    // Obtener 3 primeras letras del país
    const countryCode = country.substring(0, 3);
    
    // Obtener 3 primeras letras de la provincia
    const provinceCode = province.substring(0, 3);
    
    // Obtener 3 primeras letras de la ciudad
    const cityCode = city.substring(0, 3);
    
    // Obtener 6 primeras letras de la calle, rellenar con X si es necesario
    let streetCode = street.replace(/[^A-Z]/g, '').substring(0, 6);
    while (streetCode.length < 6) {
      streetCode += 'X';
    }
    
    // Formatear número de calle a 4 dígitos
    const streetNumber = streetNumberStr.padStart(4, '0');
    
    return `${countryCode}-${provinceCode}-${cityCode}-${streetCode}-${streetNumber}`;
  }

  static async findExistingCode(data: CommunityCodeData): Promise<CommunityCode | null> {
    // BÚSQUEDA FLEXIBLE E INSENSIBLE A MAYÚSCULAS/MINÚSCULAS
    const { data: existingCodes, error } = await supabase
      .from('community_codes')
      .select('*')
      .ilike('country', data.country.trim())
      .ilike('province', data.province.trim())
      .ilike('city', data.city.trim())
      .ilike('street', data.street.trim())
      .eq('street_number', data.street_number.trim())
      .limit(1);

    if (error) {
      console.error(`Error buscando código existente: ${error.message}`);
      throw new Error(`Error buscando código existente: ${error.message}`);
    }

    return existingCodes && existingCodes.length > 0 ? (existingCodes[0] as CommunityCode) : null;
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
      // PASO 0: Normalizar los datos de entrada para consistencia
      const normalizedData: CommunityCodeData = {
        country: data.country.trim(),
        province: data.province.trim(),
        city: data.city.trim(),
        street: data.street.trim(),
        street_number: data.street_number.trim(),
        created_by: data.created_by
      };

      // PASO 1: Verificar si ya existe un código para esta combinación de ubicación (búsqueda flexible)
      console.log('🔍 Buscando código existente para (normalizado):', {
        country: normalizedData.country,
        province: normalizedData.province, 
        city: normalizedData.city,
        street: normalizedData.street,
        street_number: normalizedData.street_number
      });

      const existingCode = await this.findExistingCode(normalizedData);
      
      if (existingCode) {
        console.log('✅ Código existente encontrado (búsqueda flexible):', existingCode.code);
        return { code: existingCode.code, isNew: false };
      }

      // PASO 2: No existe código para esta ubicación, generar nuevo código base
      const baseCode = this.generateCommunityCode(normalizedData);
      console.log('🏗️ Código base generado:', baseCode);

      // PASO 3: Verificar si el código base está disponible
      const isBaseCodeUnique = await this.isCodeUnique(baseCode);
      
      if (isBaseCodeUnique) {
        // El código base está disponible, crearlo directamente con datos normalizados
        console.log('✨ Código base disponible, creando:', baseCode);
        
        const { data: newCode, error } = await supabase
          .from('community_codes')
          .insert({
            code: baseCode,
            country: normalizedData.country.toUpperCase(),
            province: normalizedData.province.toUpperCase(),
            city: normalizedData.city.toUpperCase(),
            street: normalizedData.street.toUpperCase(),
            street_number: normalizedData.street_number,
            created_by: normalizedData.created_by
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

      // PASO 5: Crear el nuevo código único con datos normalizados
      const { data: newCode, error } = await supabase
        .from('community_codes')
        .insert({
          code: uniqueCode,
          country: normalizedData.country.toUpperCase(),
          province: normalizedData.province.toUpperCase(),
          city: normalizedData.city.toUpperCase(),
          street: normalizedData.street.toUpperCase(),
          street_number: normalizedData.street_number,
          created_by: normalizedData.created_by
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
              country: normalizedData.country.toUpperCase(),
              province: normalizedData.province.toUpperCase(),
              city: normalizedData.city.toUpperCase(),
              street: normalizedData.street.toUpperCase(),
              street_number: normalizedData.street_number,
              created_by: normalizedData.created_by
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

    // Obtener códigos compartidos con conteo de usuarios - FIXED: Use Array.from
    const sharedCodes: { code: string; userCount: number; }[] = [];
    
    for (const code of Array.from(uniqueCodes)) {
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

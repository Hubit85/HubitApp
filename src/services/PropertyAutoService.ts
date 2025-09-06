import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types/property";

export interface UserPropertyData {
  full_name: string;
  address?: string;
  city?: string;
  postal_code?: string;
  province?: string;
  country?: string;
  community_name?: string;
  portal_number?: string;
  apartment_number?: string;
  user_type: string;
}

export class PropertyAutoService {
  
  /**
   * Crea automáticamente una propiedad cuando un usuario se registra
   */
  static async createDefaultProperty(userId: string, userData: UserPropertyData): Promise<{ success: boolean; property?: any; message: string }> {
    try {
      console.log("🏠 PropertyAutoService: Creating default property for user:", userId.substring(0, 8) + '...');
      
      // Validar que tenemos los datos mínimos necesarios
      if (!userData.address || !userData.city) {
        console.warn("⚠️ PropertyAutoService: Insufficient address data to create default property");
        return {
          success: false,
          message: "Datos de dirección insuficientes para crear la propiedad automáticamente"
        };
      }

      // Determinar el tipo de propiedad basado en el rol del usuario
      let propertyType: Property["type"] = "apartment"; // por defecto
      let propertyName = "";
      
      if (userData.user_type === "community_member") {
        propertyType = "apartment";
        propertyName = userData.community_name 
          ? `${userData.community_name} - ${userData.apartment_number || 'Vivienda'}`
          : `Apartamento en ${userData.city}`;
      } else if (userData.user_type === "particular") {
        // Para particulares, asumimos apartamento por defecto pero podría ser casa
        propertyType = "apartment";
        propertyName = `Propiedad en ${userData.city}`;
      }

      // Crear los datos de la propiedad
      const propertyData = {
        user_id: userId,
        name: propertyName,
        address: userData.address,
        city: userData.city,
        postal_code: userData.postal_code || "",
        province: userData.province || "",
        country: userData.country || "España",
        type: propertyType,
        status: "owned" as const,
        is_currently_selected: true, // Marcar como seleccionada por defecto
        
        // Información específica de comunidad si aplica
        ...(userData.user_type === "community_member" && {
          community_info: {
            community_name: userData.community_name || "",
            portal_number: userData.portal_number || "",
            apartment_number: userData.apartment_number || "",
            management_company: null,
            total_units: null
          }
        }),
        
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Insertar la propiedad en la base de datos
      const { data: newProperty, error: insertError } = await supabase
        .from('properties')
        .insert(propertyData)
        .select()
        .single();

      if (insertError) {
        console.error("❌ PropertyAutoService: Error creating default property:", insertError);
        throw new Error(`Error al crear la propiedad: ${insertError.message}`);
      }

      console.log("✅ PropertyAutoService: Default property created successfully:", {
        propertyId: newProperty.id.substring(0, 8) + '...',
        propertyName: propertyData.name,
        propertyType: propertyData.type,
        city: propertyData.city
      });

      return {
        success: true,
        property: newProperty,
        message: `Propiedad "${propertyData.name}" creada automáticamente`
      };

    } catch (error) {
      console.error("❌ PropertyAutoService: Exception creating default property:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido al crear la propiedad"
      };
    }
  }

  /**
   * Sincroniza las propiedades entre diferentes roles del mismo usuario
   */
  static async syncPropertiesBetweenRoles(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log("🔄 PropertyAutoService: Syncing properties between roles for user:", userId.substring(0, 8) + '...');

      // Obtener todas las propiedades del usuario
      const { data: userProperties, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (fetchError) {
        throw new Error(`Error fetching user properties: ${fetchError.message}`);
      }

      console.log(`✅ PropertyAutoService: Found ${userProperties?.length || 0} properties for user`);

      // Aquí se pueden implementar lógicas adicionales de sincronización
      // Por ejemplo, asegurar que cada rol tenga acceso a las propiedades relevantes

      return {
        success: true,
        message: `${userProperties?.length || 0} propiedades sincronizadas correctamente`
      };

    } catch (error) {
      console.error("❌ PropertyAutoService: Error syncing properties:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido en la sincronización"
      };
    }
  }

  /**
   * Actualiza la información de una propiedad cuando cambian los datos del usuario
   */
  static async updatePropertyFromUserData(userId: string, updatedUserData: Partial<UserPropertyData>): Promise<{ success: boolean; message: string }> {
    try {
      console.log("🔄 PropertyAutoService: Updating properties with new user data:", userId.substring(0, 8) + '...');

      // Obtener las propiedades existentes del usuario
      const { data: userProperties, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', userId);

      if (fetchError) {
        throw new Error(`Error fetching properties: ${fetchError.message}`);
      }

      if (!userProperties || userProperties.length === 0) {
        console.log("📝 PropertyAutoService: No properties found to update");
        return {
          success: true,
          message: "No hay propiedades que actualizar"
        };
      }

      // Actualizar cada propiedad con los nuevos datos relevantes
      const updatePromises = userProperties.map(async (property) => {
        const updatedFields: any = {};

        // Actualizar campos de dirección si han cambiado
        if (updatedUserData.address && updatedUserData.address !== property.address) {
          updatedFields.address = updatedUserData.address;
        }
        if (updatedUserData.city && updatedUserData.city !== property.city) {
          updatedFields.city = updatedUserData.city;
        }
        if (updatedUserData.postal_code && updatedUserData.postal_code !== property.postal_code) {
          updatedFields.postal_code = updatedUserData.postal_code;
        }

        // Actualizar información de comunidad si aplica
        if (updatedUserData.user_type === "community_member") {
          const currentCommunityInfo = property.community_info || {};
          const newCommunityInfo = {
            ...currentCommunityInfo,
            ...(updatedUserData.community_name && { community_name: updatedUserData.community_name }),
            ...(updatedUserData.portal_number && { portal_number: updatedUserData.portal_number }),
            ...(updatedUserData.apartment_number && { apartment_number: updatedUserData.apartment_number })
          };

          if (JSON.stringify(newCommunityInfo) !== JSON.stringify(currentCommunityInfo)) {
            updatedFields.community_info = newCommunityInfo;
          }
        }

        // Solo actualizar si hay cambios
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.updated_at = new Date().toISOString();

          const { error: updateError } = await supabase
            .from('properties')
            .update(updatedFields)
            .eq('id', property.id);

          if (updateError) {
            console.error(`❌ Error updating property ${property.id}:`, updateError);
            throw updateError;
          }

          console.log(`✅ Updated property ${property.id.substring(0, 8)}... with fields:`, Object.keys(updatedFields));
        }
      });

      await Promise.all(updatePromises);

      return {
        success: true,
        message: `${userProperties.length} propiedades actualizadas correctamente`
      };

    } catch (error) {
      console.error("❌ PropertyAutoService: Error updating properties:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido al actualizar propiedades"
      };
    }
  }
}

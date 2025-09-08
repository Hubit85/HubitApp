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
      let propertyType = "apartment"; // por defecto
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

      // Crear los datos de la propiedad usando el schema correcto
      const propertyData = {
        user_id: userId,
        name: propertyName,
        address: userData.address,
        city: userData.city,
        postal_code: userData.postal_code || "",
        property_type: propertyType, // Campo correcto del schema
        
        // Para información de comunidad, usar la descripción en su lugar
        ...(userData.user_type === "community_member" && userData.community_name && {
          description: `${userData.community_name}${userData.portal_number ? ` - Portal ${userData.portal_number}` : ''}${userData.apartment_number ? ` - Apto ${userData.apartment_number}` : ''}`
        }),
        
        created_at: new Date().toISOString()
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
        propertyType: propertyData.property_type,
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

      // Obtener todos los roles del usuario para entender qué sincronizaciones hacer
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role_type, role_specific_data, is_verified')
        .eq('user_id', userId)
        .eq('is_verified', true);

      if (rolesError) {
        throw new Error(`Error fetching user roles: ${rolesError.message}`);
      }

      console.log(`✅ PropertyAutoService: Found ${userProperties?.length || 0} properties and ${userRoles?.length || 0} roles for user`);

      // CRUCE DE INFORMACIÓN: Sincronizar datos entre propiedades y roles
      if (userProperties && userProperties.length > 0 && userRoles && userRoles.length > 0) {
        
        // Buscar roles con información de dirección
        const rolesWithAddress = userRoles.filter(role => {
          const data = role.role_specific_data as any;
          return data && (data.address || data.company_address);
        });

        if (rolesWithAddress.length > 0) {
          console.log(`🏗️ PropertyAutoService: Found ${rolesWithAddress.length} roles with address data for cross-sync`);

          // Actualizar propiedades existentes con información de roles
          const updatePromises = userProperties.map(async (property) => {
            let needsUpdate = false;
            const updateFields: any = {};

            // Buscar información complementaria en los roles
            for (const role of rolesWithAddress) {
              const roleData = role.role_specific_data as any;
              
              // Si la propiedad no tiene descripción completa y es miembro de comunidad, actualizarla
              if (role.role_type === 'community_member') {
                if (roleData.community_name || roleData.portal_number || roleData.apartment_number) {
                  const communityDescription = `${roleData.community_name || ''}${roleData.portal_number ? ` - Portal ${roleData.portal_number}` : ''}${roleData.apartment_number ? ` - Apto ${roleData.apartment_number}` : ''}`;
                  
                  if (!property.description || !property.description.includes(roleData.community_name || '')) {
                    updateFields.description = communityDescription;
                    needsUpdate = true;
                  }
                }
              }

              // Actualizar información de la propiedad si está incompleta
              if (!property.description && roleData.full_name) {
                updateFields.description = `Propiedad de ${roleData.full_name}`;
                needsUpdate = true;
              }
            }

            // Aplicar actualizaciones si las hay
            if (needsUpdate) {
              const { error: updateError } = await supabase
                .from('properties')
                .update(updateFields)
                .eq('id', property.id);

              if (updateError) {
                console.error(`❌ Error updating property ${property.id}:`, updateError);
              } else {
                console.log(`✅ Updated property ${property.id.substring(0, 8)}... with cross-role data`);
              }
            }
          });

          await Promise.all(updatePromises);
        }

        // CREAR PROPIEDADES FALTANTES basadas en roles con direcciones diferentes
        for (const role of rolesWithAddress) {
          const roleData = role.role_specific_data as any;
          const roleAddress = roleData.address || roleData.company_address;
          
          if (!roleAddress) continue;

          // Verificar si ya existe una propiedad con esta dirección
          const existingProperty = userProperties.find(prop => 
            prop.address?.toLowerCase().includes(roleAddress.toLowerCase()) ||
            roleAddress.toLowerCase().includes(prop.address?.toLowerCase() || '')
          );

          if (!existingProperty) {
            console.log(`🏠 PropertyAutoService: Creating missing property from ${role.role_type} role data`);
            
            // Crear nueva propiedad basada en el rol
            const newPropertyData: UserPropertyData = {
              full_name: roleData.full_name || roleData.company_name || 'Usuario',
              address: roleAddress,
              city: roleData.city || roleData.company_city || '',
              postal_code: roleData.postal_code || roleData.company_postal_code || '',
              province: roleData.province || roleData.company_province || '',
              country: roleData.country || roleData.company_country || 'España',
              community_name: roleData.community_name || '',
              portal_number: roleData.portal_number || '',
              apartment_number: roleData.apartment_number || '',
              user_type: role.role_type
            };

            await this.createDefaultProperty(userId, newPropertyData);
          }
        }
      }

      return {
        success: true,
        message: `${userProperties?.length || 0} propiedades sincronizadas y cruzadas correctamente con ${userRoles?.length || 0} roles`
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
   * NUEVA FUNCIÓN: Obtener propiedades con información cruzada de roles
   */
  static async getPropertiesWithCrossRoleInfo(userId: string): Promise<{ 
    success: boolean; 
    properties: any[]; 
    message: string 
  }> {
    try {
      console.log("🔍 PropertyAutoService: Getting properties with cross-role info for user:", userId.substring(0, 8) + '...');

      // Obtener propiedades y roles del usuario
      const [propertiesResult, rolesResult] = await Promise.all([
        supabase
          .from('properties')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: true }),
        supabase
          .from('user_roles')
          .select('role_type, role_specific_data, is_verified')
          .eq('user_id', userId)
          .eq('is_verified', true)
      ]);

      if (propertiesResult.error) {
        throw new Error(`Error fetching properties: ${propertiesResult.error.message}`);
      }

      if (rolesResult.error) {
        throw new Error(`Error fetching roles: ${rolesResult.error.message}`);
      }

      const properties = propertiesResult.data || [];
      const roles = rolesResult.data || [];

      // Enriquecer propiedades con información de roles - pero sin acceder a propiedades que no existen
      const enrichedProperties = properties.map(property => {
        const enrichedProperty = { ...property };
        
        // Agregar información de roles relacionados
        const relatedRoles: any[] = [];
        
        roles.forEach(role => {
          const roleData = role.role_specific_data as any;
          const roleAddress = roleData?.address || roleData?.company_address;
          
          // Si la dirección del rol coincide con la propiedad, agregar relación
          if (roleAddress && (
            property.address?.toLowerCase().includes(roleAddress.toLowerCase()) ||
            roleAddress.toLowerCase().includes(property.address?.toLowerCase() || '')
          )) {
            relatedRoles.push({
              role_type: role.role_type,
              role_label: this.getRoleDisplayName(role.role_type),
              role_data: roleData
            });
          }
        });

        // Solo agregar relatedRoles si hay relaciones
        if (relatedRoles.length > 0) {
          (enrichedProperty as any).relatedRoles = relatedRoles;
        }

        return enrichedProperty;
      });

      return {
        success: true,
        properties: enrichedProperties,
        message: `${enrichedProperties.length} propiedades obtenidas con información cruzada de ${roles.length} roles`
      };

    } catch (error) {
      console.error("❌ PropertyAutoService: Error getting cross-role properties:", error);
      return {
        success: false,
        properties: [],
        message: error instanceof Error ? error.message : "Error desconocido al obtener propiedades"
      };
    }
  }

  /**
   * Helper: Obtener nombre de display del rol
   */
  private static getRoleDisplayName(roleType: string): string {
    const roleNames = {
      'particular': 'Particular',
      'community_member': 'Miembro de Comunidad',
      'service_provider': 'Proveedor de Servicios',
      'property_administrator': 'Administrador de Fincas'
    };
    return roleNames[roleType as keyof typeof roleNames] || roleType;
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

        // Actualizar información de comunidad si aplica - usando descripción en su lugar
        if (updatedUserData.user_type === "community_member") {
          let communityDescription = property.description || '';
          
          if (updatedUserData.community_name || updatedUserData.portal_number || updatedUserData.apartment_number) {
            const newCommunityDescription = `${updatedUserData.community_name || ''}${updatedUserData.portal_number ? ` - Portal ${updatedUserData.portal_number}` : ''}${updatedUserData.apartment_number ? ` - Apto ${updatedUserData.apartment_number}` : ''}`;
            
            if (newCommunityDescription !== communityDescription) {
              updatedFields.description = newCommunityDescription;
            }
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
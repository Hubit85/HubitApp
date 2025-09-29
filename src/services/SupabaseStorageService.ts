
import { supabase } from "@/integrations/supabase/client";

export interface UploadResult {
  success: boolean;
  publicUrl?: string;
  error?: string;
  fileName?: string;
}

export class SupabaseStorageService {
  private static BUCKET_NAME = 'uploads';
  
  /**
   * Sube un archivo al bucket de Supabase Storage
   */
  static async uploadFile(
    file: File, 
    folder: string = 'property-photos', 
    userId?: string
  ): Promise<UploadResult> {
    try {
      // Validar el archivo
      if (!file) {
        return { success: false, error: 'No se proporcionó ningún archivo' };
      }

      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return { 
          success: false, 
          error: 'Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, WebP)' 
        };
      }

      // Validar tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return { 
          success: false, 
          error: 'El archivo es demasiado grande. El tamaño máximo es 5MB' 
        };
      }

      // Crear nombre único para el archivo
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileName = userId 
        ? `${userId}_${timestamp}_${randomId}.${fileExt}`
        : `${timestamp}_${randomId}.${fileExt}`;
      
      const filePath = `${folder}/${fileName}`;

      console.log('Subiendo archivo:', { fileName, filePath, size: file.size, type: file.type });

      // Subir el archivo
      const { data, error: uploadError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Error de subida:', uploadError);
        return { 
          success: false, 
          error: `Error subiendo archivo: ${uploadError.message}` 
        };
      }

      console.log('Archivo subido exitosamente:', data);

      // Obtener la URL pública
      const publicUrlResult = this.getPublicUrl(filePath);
      
      if (!publicUrlResult.success) {
        return publicUrlResult;
      }

      return { 
        success: true, 
        publicUrl: publicUrlResult.publicUrl,
        fileName: fileName
      };

    } catch (error: any) {
      console.error('Error inesperado en uploadFile:', error);
      return { 
        success: false, 
        error: `Error inesperado: ${error.message}` 
      };
    }
  }

  /**
   * Obtiene la URL pública de un archivo
   */
  static getPublicUrl(filePath: string): UploadResult {
    try {
      const { data } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      if (!data?.publicUrl) {
        return { 
          success: false, 
          error: 'No se pudo obtener la URL pública del archivo' 
        };
      }

      // Verificar que la URL sea válida
      const url = new URL(data.publicUrl);
      if (!url.hostname.includes('supabase')) {
        return { 
          success: false, 
          error: 'URL pública inválida' 
        };
      }

      console.log('URL pública obtenida:', data.publicUrl);
      return { 
        success: true, 
        publicUrl: data.publicUrl 
      };

    } catch (error: any) {
      console.error('Error obteniendo URL pública:', error);
      return { 
        success: false, 
        error: `Error obteniendo URL pública: ${error.message}` 
      };
    }
  }

  /**
   * Elimina un archivo del storage
   */
  static async deleteFile(filePath: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        console.error('Error eliminando archivo:', error);
        return { 
          success: false, 
          error: `Error eliminando archivo: ${error.message}` 
        };
      }

      console.log('Archivo eliminado exitosamente:', filePath);
      return { success: true };

    } catch (error: any) {
      console.error('Error inesperado en deleteFile:', error);
      return { 
        success: false, 
        error: `Error inesperado: ${error.message}` 
      };
    }
  }

  /**
   * Obtiene información sobre un archivo
   */
  static async getFileInfo(filePath: string): Promise<{
    success: boolean;
    fileInfo?: any;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(filePath.substring(0, filePath.lastIndexOf('/')), {
          search: filePath.substring(filePath.lastIndexOf('/') + 1)
        });

      if (error) {
        return { 
          success: false, 
          error: `Error obteniendo información del archivo: ${error.message}` 
        };
      }

      const fileInfo = data?.find(file => 
        filePath.endsWith(file.name)
      );

      return { 
        success: true, 
        fileInfo 
      };

    } catch (error: any) {
      return { 
        success: false, 
        error: `Error inesperado: ${error.message}` 
      };
    }
  }

  /**
   * Lista archivos en una carpeta
   */
  static async listFiles(folder: string): Promise<{
    success: boolean;
    files?: any[];
    error?: string;
  }> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(folder);

      if (error) {
        return { 
          success: false, 
          error: `Error listando archivos: ${error.message}` 
        };
      }

      return { 
        success: true, 
        files: data || [] 
      };

    } catch (error: any) {
      return { 
        success: false, 
        error: `Error inesperado: ${error.message}` 
      };
    }
  }

  /**
   * Valida si una URL de imagen es accesible
   */
  static async validateImageUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok && response.headers.get('content-type')?.startsWith('image/');
    } catch {
      return false;
    }
  }

  /**
   * Extrae el path del archivo desde una URL pública de Supabase
   */
  static extractFilePathFromUrl(publicUrl: string): string | null {
    try {
      const url = new URL(publicUrl);
      const pathSegments = url.pathname.split('/');
      
      // Buscar el índice donde está 'uploads'
      const uploadsIndex = pathSegments.indexOf('uploads');
      if (uploadsIndex === -1) {
        return null;
      }
      
      // El path del archivo es todo lo que viene después de 'uploads'
      return pathSegments.slice(uploadsIndex + 1).join('/');
    } catch {
      return null;
    }
  }

  /**
   * Optimiza una imagen para web (redimensiona si es necesario)
   */
  static async optimizeImageForWeb(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Configurar tamaño máximo
        const maxWidth = 1200;
        const maxHeight = 800;
        
        let { width, height } = img;

        // Calcular nuevas dimensiones manteniendo aspecto
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // Dibujar imagen redimensionada
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(optimizedFile);
            } else {
              reject(new Error('Error optimizando imagen'));
            }
          },
          file.type,
          0.85 // Calidad del 85%
        );
      };

      img.onerror = () => reject(new Error('Error cargando imagen'));
      img.src = URL.createObjectURL(file);
    });
  }
}

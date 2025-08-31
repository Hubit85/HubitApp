
import { supabase } from "@/integrations/supabase/client";
import { Document, DocumentInsert, DocumentUpdate } from "@/integrations/supabase/types";

export class SupabaseDocumentService {
  // ===================== DOCUMENTS CRUD =====================
  
  static async createDocument(documentData: DocumentInsert): Promise<Document> {
    const { data, error } = await supabase
      .from("documents")
      .insert({
        ...documentData,
        is_public: documentData.is_public || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async updateDocument(id: string, updates: DocumentUpdate): Promise<Document> {
    const { data, error } = await supabase
      .from("documents")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async getDocument(id: string): Promise<Document> {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async deleteDocument(id: string): Promise<void> {
    // First, try to delete the physical file from storage
    try {
      const document = await this.getDocument(id);
      if (document.file_path) {
        await this.deleteFileFromStorage(document.file_path);
      }
    } catch (error) {
      console.warn("Could not delete file from storage:", error);
    }

    // Then delete the document record
    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  }

  // ===================== DOCUMENT QUERIES =====================

  static async getUserDocuments(userId: string): Promise<Document[]> {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getDocumentsByEntity(entityType: Document['related_entity_type'], entityId: string): Promise<Document[]> {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("related_entity_type", entityType)
      .eq("related_entity_id", entityId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getDocumentsByType(documentType: Document['document_type'], userId?: string): Promise<Document[]> {
    let query = supabase
      .from("documents")
      .select("*")
      .eq("document_type", documentType);

    if (userId) {
      query = query.eq("user_id", userId);
    } else {
      query = query.eq("is_public", true);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async getPublicDocuments(): Promise<Document[]> {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // ===================== FILE STORAGE OPERATIONS =====================

  static async uploadFile(file: File, folder: string = "documents"): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from("documents")
      .upload(filePath, file);

    if (error) {
      throw new Error(error.message);
    }

    return filePath;
  }

  static async deleteFileFromStorage(filePath: string): Promise<void> {
    const { error } = await supabase.storage
      .from("documents")
      .remove([filePath]);

    if (error) {
      console.warn("Failed to delete file from storage:", error);
    }
  }

  static async getFileUrl(filePath: string): Promise<string> {
    const { data } = supabase.storage
      .from("documents")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  static async getSignedFileUrl(filePath: string, expiresIn: number = 3600): Promise<string> {
    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      throw new Error(error.message);
    }

    return data.signedUrl;
  }

  // ===================== DOCUMENT MANAGEMENT =====================

  static async uploadAndCreateDocument(
    file: File,
    documentData: Omit<DocumentInsert, "file_path" | "file_size">
  ): Promise<Document> {
    // Upload file to storage
    const filePath = await this.uploadFile(file, `${documentData.document_type}s`);
    
    // Create document record
    const fullDocumentData: DocumentInsert = {
      ...documentData,
      file_path: filePath,
      file_size: file.size
    };

    return this.createDocument(fullDocumentData);
  }

  static async replaceDocumentFile(documentId: string, newFile: File): Promise<Document> {
    const document = await this.getDocument(documentId);
    
    // Delete old file
    if (document.file_path) {
      await this.deleteFileFromStorage(document.file_path);
    }

    // Upload new file
    const newFilePath = await this.uploadFile(newFile, document.document_type);
    
    // Update document record
    return this.updateDocument(documentId, {
      file_path: newFilePath,
      file_size: newFile.size,
      name: newFile.name
    });
  }

  static async makeDocumentPublic(id: string): Promise<Document> {
    return this.updateDocument(id, { is_public: true });
  }

  static async makeDocumentPrivate(id: string): Promise<Document> {
    return this.updateDocument(id, { is_public: false });
  }

  // ===================== DOCUMENT CATEGORIES =====================

  static async getContractDocuments(contractId: string): Promise<Document[]> {
    return this.getDocumentsByEntity("contract", contractId);
  }

  static async getQuoteDocuments(quoteId: string): Promise<Document[]> {
    return this.getDocumentsByEntity("quote", quoteId);
  }

  static async getBudgetRequestDocuments(budgetRequestId: string): Promise<Document[]> {
    return this.getDocumentsByEntity("budget_request", budgetRequestId);
  }

  static async getPropertyDocuments(propertyId: string): Promise<Document[]> {
    return this.getDocumentsByEntity("property", propertyId);
  }

  static async getServiceProviderDocuments(serviceProviderId: string): Promise<Document[]> {
    return this.getDocumentsByEntity("profile", serviceProviderId);
  }

  static async getUserCertificates(userId: string): Promise<Document[]> {
    return this.getDocumentsByType("certificate", userId);
  }

  static async getUserLicenses(userId: string): Promise<Document[]> {
    return this.getDocumentsByType("license", userId);
  }

  static async getUserInsuranceDocuments(userId: string): Promise<Document[]> {
    return this.getDocumentsByType("insurance", userId);
  }

  // ===================== DOCUMENT VALIDATION =====================

  static async validateDocumentAccess(documentId: string, userId: string): Promise<boolean> {
    const document = await this.getDocument(documentId);
    
    // Public documents are accessible to everyone
    if (document.is_public) {
      return true;
    }

    // Owner can always access
    if (document.user_id === userId) {
      return true;
    }

    return false;
  }

  // ===================== SEARCH & FILTERS =====================

  static async searchDocuments(userId: string, query: string, filters?: {
    documentType?: string;
    entityType?: string;
    isPublic?: boolean;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Document[]> {
    let supabaseQuery = supabase
      .from("documents")
      .select("*");

    // If not searching public documents, restrict to user's documents
    if (!filters?.isPublic) {
      supabaseQuery = supabaseQuery.eq("user_id", userId);
    } else {
      supabaseQuery = supabaseQuery.eq("is_public", true);
    }

    if (query) {
      supabaseQuery = supabaseQuery.or(
        `name.ilike.%${query}%`
      );
    }

    if (filters?.documentType) {
      supabaseQuery = supabaseQuery.eq("document_type", filters.documentType);
    }

    if (filters?.entityType) {
      supabaseQuery = supabaseQuery.eq("related_entity_type", filters.entityType);
    }

    if (filters?.dateFrom) {
      supabaseQuery = supabaseQuery.gte("created_at", filters.dateFrom);
    }

    if (filters?.dateTo) {
      supabaseQuery = supabaseQuery.lte("created_at", filters.dateTo);
    }

    const { data, error } = await supabaseQuery
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // ===================== DOCUMENT STATISTICS =====================

  static async getUserDocumentStats(userId: string): Promise<{
    total: number;
    byType: { [key: string]: number };
    totalSize: number;
    public: number;
    private: number;
  }> {
    const documents = await this.getUserDocuments(userId);
    
    const stats = {
      total: documents.length,
      byType: documents.reduce((acc, doc) => {
        acc[doc.document_type] = (acc[doc.document_type] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number }),
      totalSize: documents.reduce((sum, doc) => sum + (doc.file_size || 0), 0),
      public: documents.filter(doc => doc.is_public).length,
      private: documents.filter(doc => !doc.is_public).length
    };

    return stats;
  }

  // ===================== FILE TYPE VALIDATION =====================

  static isValidFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }

  static isValidFileSize(file: File, maxSizeInMB: number): boolean {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  }

  static getFileExtension(filename: string): string {
    return filename.split(".").pop()?.toLowerCase() || "";
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}
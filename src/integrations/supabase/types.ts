/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Database as DB } from "./database.types";

export type Database = DB;

// Helper type to extract Row types from tables
type PublicSchema = DB["public"];
type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"];

// Individual table types
export type AdministratorRequest = Tables<"administrator_requests">;
export type BudgetRequest = Tables<"budget_requests">;
export type Community = Tables<"communities">;
export type CommunityMemberAdministrator =
  Tables<"community_member_administrators">;
export type Contract = Tables<"contracts">;
export type Conversation = Tables<"conversations">;
export type Document = Tables<"documents">;
export type EmergencyRequest = Tables<"emergency_requests">;
export type IncidentReport = Tables<"incident_reports">;
export type Incident = Tables<"incidents">;
export type Invoice = Tables<"invoices">;
export type ManagedCommunity = Tables<"managed_communities">;
export type Message = Tables<"messages">;
export type Notification = Tables<"notifications">;
export type Payment = Tables<"payments">;
export type Profile = Tables<"profiles">;
export type Property = Tables<"properties">;
export type PropertyAdministrator = Tables<"property_administrators">;
export type QuoteRejection = Tables<"quote_rejections">;
export type Quote = Tables<"quotes">;
export type Rating = Tables<"ratings">;
export type ServiceCategory = Tables<"service_categories">;
export type ServiceProvider = Tables<"service_providers">;
export type UserRole = Tables<"user_roles">;
export type WorkSession = Tables<"work_sessions">;

// Insert types
export type AdministratorRequestInsert =
  DB["public"]["Tables"]["administrator_requests"]["Insert"];
export type BudgetRequestInsert =
  DB["public"]["Tables"]["budget_requests"]["Insert"];
export type CommunityInsert = DB["public"]["Tables"]["communities"]["Insert"];
export type CommunityMemberAdministratorInsert =
  DB["public"]["Tables"]["community_member_administrators"]["Insert"];
export type ContractInsert = DB["public"]["Tables"]["contracts"]["Insert"];
export type ConversationInsert = DB["public"]["Tables"]["conversations"]["Insert"];
export type DocumentInsert = DB["public"]["Tables"]["documents"]["Insert"];
export type EmergencyRequestInsert =
  DB["public"]["Tables"]["emergency_requests"]["Insert"];
export type IncidentReportInsert =
  DB["public"]["Tables"]["incident_reports"]["Insert"];
export type IncidentInsert = DB["public"]["Tables"]["incidents"]["Insert"];
export type InvoiceInsert = DB["public"]["Tables"]["invoices"]["Insert"];
export type ManagedCommunityInsert =
  DB["public"]["Tables"]["managed_communities"]["Insert"];
export type MessageInsert = DB["public"]["Tables"]["messages"]["Insert"];
export type NotificationInsert = DB["public"]["Tables"]["notifications"]["Insert"];
export type PaymentInsert = DB["public"]["Tables"]["payments"]["Insert"];
export type ProfileInsert = DB["public"]["Tables"]["profiles"]["Insert"];
export type PropertyInsert = DB["public"]["Tables"]["properties"]["Insert"];
export type PropertyAdministratorInsert =
  DB["public"]["Tables"]["property_administrators"]["Insert"];
export type QuoteRejectionInsert =
  DB["public"]["Tables"]["quote_rejections"]["Insert"];
export type QuoteInsert = DB["public"]["Tables"]["quotes"]["Insert"];
export type RatingInsert = DB["public"]["Tables"]["ratings"]["Insert"];
export type ServiceCategoryInsert =
  DB["public"]["Tables"]["service_categories"]["Insert"];
export type ServiceProviderInsert =
  DB["public"]["Tables"]["service_providers"]["Insert"];
export type UserRoleInsert = DB["public"]["Tables"]["user_roles"]["Insert"];
export type WorkSessionInsert = DB["public"]["Tables"]["work_sessions"]["Insert"];

// Update types
export type AdministratorRequestUpdate =
  DB["public"]["Tables"]["administrator_requests"]["Update"];
export type BudgetRequestUpdate =
  DB["public"]["Tables"]["budget_requests"]["Update"];
export type CommunityUpdate = DB["public"]["Tables"]["communities"]["Update"];
export type CommunityMemberAdministratorUpdate =
  DB["public"]["Tables"]["community_member_administrators"]["Update"];
export type ContractUpdate = DB["public"]["Tables"]["contracts"]["Update"];
export type ConversationUpdate = DB["public"]["Tables"]["conversations"]["Update"];
export type DocumentUpdate = DB["public"]["Tables"]["documents"]["Update"];
export type EmergencyRequestUpdate =
  DB["public"]["Tables"]["emergency_requests"]["Update"];
export type IncidentReportUpdate =
  DB["public"]["Tables"]["incident_reports"]["Update"];
export type IncidentUpdate = DB["public"]["Tables"]["incidents"]["Update"];
export type InvoiceUpdate = DB["public"]["Tables"]["invoices"]["Update"];
export type ManagedCommunityUpdate =
  DB["public"]["Tables"]["managed_communities"]["Update"];
export type MessageUpdate = DB["public"]["Tables"]["messages"]["Update"];
export type NotificationUpdate = DB["public"]["Tables"]["notifications"]["Update"];
export type PaymentUpdate = DB["public"]["Tables"]["payments"]["Update"];
export type ProfileUpdate = DB["public"]["Tables"]["profiles"]["Update"];
export type PropertyUpdate = DB["public"]["Tables"]["properties"]["Update"];
export type PropertyAdministratorUpdate =
  DB["public"]["Tables"]["property_administrators"]["Update"];
export type QuoteRejectionUpdate =
  DB["public"]["Tables"]["quote_rejections"]["Update"];
export type QuoteUpdate = DB["public"]["Tables"]["quotes"]["Update"];
export type RatingUpdate = DB["public"]["Tables"]["ratings"]["Update"];
export type ServiceCategoryUpdate =
  DB["public"]["Tables"]["service_categories"]["Update"];
export type ServiceProviderUpdate =
  DB["public"]["Tables"]["service_providers"]["Update"];
export type UserRoleUpdate = DB["public"]["Tables"]["user_roles"]["Update"];
export type WorkSessionUpdate = DB["public"]["Tables"]["work_sessions"]["Update"];

export type Enums<T extends keyof DB["public"]["Enums"]> =
  DB["public"]["Enums"][T];
export type Functions<T extends keyof DB["public"]["Functions"]> =
  DB["public"]["Functions"][T];

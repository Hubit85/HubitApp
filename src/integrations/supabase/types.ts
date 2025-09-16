
/* eslint-disable @typescript-eslint/no-empty-object-type */

import type { Database as DB } from "./database.types";

type Tables<T extends keyof DB["public"]["Tables"]> =
  DB["public"]["Tables"][T]["Row"];

export type Database = DB;

// Profiles
export type Profile = Tables<"profiles">;
export type ProfileInsert = DB["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = DB["public"]["Tables"]["profiles"]["Update"];

// User Roles
export type UserRole = Tables<"user_roles">;
export type UserRoleInsert = DB["public"]["Tables"]["user_roles"]["Insert"];
export type UserRoleUpdate = DB["public"]["Tables"]["user_roles"]["Update"];

// Service Providers
export type ServiceProvider = Tables<"service_providers">;
export type ServiceProviderInsert = DB["public"]["Tables"]["service_providers"]["Insert"];
export type ServiceProviderUpdate = DB["public"]["Tables"]["service_providers"]["Update"];

// Properties
export type Property = Tables<"properties">;
export type PropertyInsert = DB["public"]["Tables"]["properties"]["Insert"];
export type PropertyUpdate = DB["public"]["Tables"]["properties"]["Update"];

// Communities
export type Community = Tables<"communities">;
export type CommunityInsert = DB["public"]["Tables"]["communities"]["Insert"];
export type CommunityUpdate = DB["public"]["Tables"]["communities"]["Update"];

// Budget Requests
export type BudgetRequest = Tables<"budget_requests">;
export type BudgetRequestInsert = DB["public"]["Tables"]["budget_requests"]["Insert"];
export type BudgetRequestUpdate = DB["public"]["Tables"]["budget_requests"]["Update"];

// Quotes
export type Quote = Tables<"quotes">;
export type QuoteInsert = DB["public"]["Tables"]["quotes"]["Insert"];
export type QuoteUpdate = DB["public"]["Tables"]["quotes"]["Update"];

// Contracts
export type Contract = Tables<"contracts">;
export type ContractInsert = DB["public"]["Tables"]["contracts"]["Insert"];
export type ContractUpdate = DB["public"]["Tables"]["contracts"]["Update"];

// Work Sessions
export type WorkSession = Tables<"work_sessions">;
export type WorkSessionInsert = DB["public"]["Tables"]["work_sessions"]["Insert"];
export type WorkSessionUpdate = DB["public"]["Tables"]["work_sessions"]["Update"];

// Incident Reports
export type IncidentReport = Tables<"incident_reports">;
export type IncidentReportInsert = DB["public"]["Tables"]["incident_reports"]["Insert"];
export type IncidentReportUpdate = DB["public"]["Tables"]["incident_reports"]["Update"];

// Notifications
export type Notification = Tables<"notifications">;
export type NotificationInsert = DB["public"]["Tables"]["notifications"]["Insert"];
export type NotificationUpdate = DB["public"]["Tables"]["notifications"]["Update"];

// Documents
export type Document = Tables<"documents">;
export type DocumentInsert = DB["public"]["Tables"]["documents"]["Insert"];
export type DocumentUpdate = DB["public"]["Tables"]["documents"]["Update"];

// Conversations
export type Conversation = Tables<"conversations">;
export type ConversationInsert = DB["public"]["Tables"]["conversations"]["Insert"];
export type ConversationUpdate = DB["public"]["Tables"]["conversations"]["Update"];

// Messages
export type Message = Tables<"messages">;
export type MessageInsert = DB["public"]["Tables"]["messages"]["Insert"];
export type MessageUpdate = DB["public"]["Tables"]["messages"]["Update"];

// Ratings
export type Rating = Tables<"ratings">;
export type RatingInsert = DB["public"]["Tables"]["ratings"]["Insert"];
export type RatingUpdate = DB["public"]["Tables"]["ratings"]["Update"];

// Service Categories
export type ServiceCategory = Tables<"service_categories">;
export type ServiceCategoryInsert = DB["public"]["Tables"]["service_categories"]["Insert"];
export type ServiceCategoryUpdate = DB["public"]["Tables"]["service_categories"]["Update"];

// Administrator Requests
export type AdministratorRequest = Tables<"administrator_requests">;
export type AdministratorRequestInsert = DB["public"]["Tables"]["administrator_requests"]["Insert"];
export type AdministratorRequestUpdate = DB["public"]["Tables"]["administrator_requests"]["Update"];

// Managed Communities
export type ManagedCommunity = Tables<"managed_communities">;
export type ManagedCommunityInsert = DB["public"]["Tables"]["managed_communities"]["Insert"];
export type ManagedCommunityUpdate = DB["public"]["Tables"]["managed_communities"]["Update"];

// String literals for enum-like types (since no enums exist in DB)
export type RoleTypeEnum = "particular" | "community_member" | "service_provider" | "property_administrator";
export type BudgetRequestStatusEnum = "draft" | "published" | "in_progress" | "completed" | "cancelled";
export type QuoteStatusEnum = "pending" | "sent" | "accepted" | "rejected" | "expired";
export type ContractStatusEnum = "draft" | "active" | "completed" | "cancelled" | "disputed";
export type IncidentStatusEnum = "pending" | "in_progress" | "resolved" | "closed";
export type NotificationTypeEnum = "info" | "warning" | "error" | "success";
export type DocumentTypeEnum = "invoice" | "contract" | "quote" | "image" | "other";
export type RelationshipStatusEnum = "active" | "inactive" | "suspended";

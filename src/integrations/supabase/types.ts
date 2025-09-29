
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { Database as DB } from "./database.types";

export type Database = DB;

// Re-export all table types for convenience
export type Profile = DB["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = DB["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = DB["public"]["Tables"]["profiles"]["Update"];

export type Property = DB["public"]["Tables"]["properties"]["Row"];
export type PropertyInsert = DB["public"]["Tables"]["properties"]["Insert"];
export type PropertyUpdate = DB["public"]["Tables"]["properties"]["Update"];

export type BudgetRequest = DB["public"]["Tables"]["budget_requests"]["Row"];
export type BudgetRequestInsert = DB["public"]["Tables"]["budget_requests"]["Insert"];
export type BudgetRequestUpdate = DB["public"]["Tables"]["budget_requests"]["Update"];

export type Quote = DB["public"]["Tables"]["quotes"]["Row"];
export type QuoteInsert = DB["public"]["Tables"]["quotes"]["Insert"];
export type QuoteUpdate = DB["public"]["Tables"]["quotes"]["Update"];

export type Contract = DB["public"]["Tables"]["contracts"]["Row"];
export type ContractInsert = DB["public"]["Tables"]["contracts"]["Insert"];
export type ContractUpdate = DB["public"]["Tables"]["contracts"]["Update"];

export type UserRole = DB["public"]["Tables"]["user_roles"]["Row"];
export type UserRoleInsert = DB["public"]["Tables"]["user_roles"]["Insert"];
export type UserRoleUpdate = DB["public"]["Tables"]["user_roles"]["Update"];

export type ServiceProvider = DB["public"]["Tables"]["service_providers"]["Row"];
export type ServiceProviderInsert = DB["public"]["Tables"]["service_providers"]["Insert"];

export type Notification = DB["public"]["Tables"]["notifications"]["Row"];
export type NotificationInsert = DB["public"]["Tables"]["notifications"]["Insert"];
export type NotificationUpdate = DB["public"]["Tables"]["notifications"]["Update"];

export type Conversation = DB["public"]["Tables"]["conversations"]["Row"];
export type ConversationInsert = DB["public"]["Tables"]["conversations"]["Insert"];
export type ConversationUpdate = DB["public"]["Tables"]["conversations"]["Update"];

export type Message = DB["public"]["Tables"]["messages"]["Row"];
export type MessageInsert = DB["public"]["Tables"]["messages"]["Insert"];
export type MessageUpdate = DB["public"]["Tables"]["messages"]["Update"];

export type Document = DB["public"]["Tables"]["documents"]["Row"];
export type DocumentInsert = DB["public"]["Tables"]["documents"]["Insert"];
export type DocumentUpdate = DB["public"]["Tables"]["documents"]["Update"];

export type Rating = DB["public"]["Tables"]["ratings"]["Row"];

export type ServiceCategory = DB["public"]["Tables"]["service_categories"]["Row"];
export type ServiceCategoryInsert = DB["public"]["Tables"]["service_categories"]["Insert"];
export type ServiceCategoryUpdate = DB["public"]["Tables"]["service_categories"]["Update"];

export type WorkSession = DB["public"]["Tables"]["work_sessions"]["Row"];
export type WorkSessionUpdate = DB["public"]["Tables"]["work_sessions"]["Update"];

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
export type Functions<T extends keyof Database["public"]["Functions"]> =
  Database["public"]["Functions"][T];

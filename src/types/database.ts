// ── Enums ────────────────────────────────────────────────────────────────────

export type UserRole = "client" | "admin";
export type InvoiceStatus = "draft" | "pending" | "paid" | "overdue" | "cancelled";

// ── Profiles ──────────────────────────────────────────────────────────────────

export type ProfileRow = {
  id: string;
  full_name: string | null;
  company_name: string | null;
  role: UserRole;
  created_at: string;
};

export type ProfileInsert = {
  id: string; // must match auth.users id — no default
  full_name?: string | null;
  company_name?: string | null;
  role?: UserRole; // default 'client'
};

// ── Avatars ───────────────────────────────────────────────────────────────────

export type AvatarRow = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  is_preset: boolean;
  profile_id: string | null;
  created_at: string;
};

export type AvatarInsert = {
  id?: string;            // default gen_random_uuid()
  name: string;
  description?: string | null;
  image_url?: string | null;
  is_preset?: boolean;    // default false
  profile_id?: string | null;
  created_at?: string;    // default now()
};

// ── Conversations ─────────────────────────────────────────────────────────────

export type ConversationRow = {
  id: string;
  profile_id: string;
  avatar_id: string;
  title: string | null;
  comprehension: number | null;
  created_at: string;
  updated_at: string;
};

export type ConversationInsert = {
  id?: string;            // default gen_random_uuid()
  profile_id: string;
  avatar_id: string;
  title?: string | null;
  comprehension?: number | null;
  created_at?: string;    // default now()
  updated_at?: string;    // default now()
};

// ── Messages ──────────────────────────────────────────────────────────────────

export type MessageRow = {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export type MessageInsert = {
  id?: string;            // default gen_random_uuid()
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;    // default now()
};

// ── Invoices ──────────────────────────────────────────────────────────────────

export type InvoiceRow = {
  id: string;
  profile_id: string;
  status: InvoiceStatus;
  amount_due: number;
  due_date: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type InvoiceInsert = {
  id?: string;            // default gen_random_uuid()
  profile_id: string;
  status?: InvoiceStatus; // default 'draft'
  amount_due: number;
  due_date?: string | null;
  description?: string | null;
  created_at?: string;    // default now()
  updated_at?: string;    // default now()
};

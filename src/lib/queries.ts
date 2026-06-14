import { createClient } from "@/lib/supabase/server";
import { ConversationRow } from "@/types/database";

// Confirms a session exists and returns the client + userId.
// Throws if the user is not logged in.
async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  return { supabase, userId: user.id };
}

// ── Avatars ──────────────────────────────────────────────────────────────────
// RLS returns both preset rows (profile_id IS NULL) and the user's custom rows.
// No manual filter needed — the policies handle it.

export async function getAvatars() {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("avatars")
    .select("id, name, description, image_url, is_preset, created_at")
    .order("is_preset", { ascending: false }) // presets first
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function createCustomAvatar(
  name: string,
  description?: string,
  imageUrl?: string
) {
  const { supabase, userId } = await requireUser();
  const { data, error } = await supabase
    .from("avatars")
    .insert({ name, description, image_url: imageUrl, profile_id: userId, is_preset: false })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── Conversations ─────────────────────────────────────────────────────────────

export async function getConversations() {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("conversations")
    .select(`
      id,
      title,
      updated_at,
      avatar:avatars ( id, name, image_url, is_preset ),
      comprehension
    `)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createConversation(avatarId: string, title?: string): Promise<ConversationRow> {
  const { supabase, userId } = await requireUser();
  const { data, error } = await supabase
    .from("conversations")
    .insert({ profile_id: userId, avatar_id: avatarId, title })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteConversation(conversationId: string) {
  const { supabase } = await requireUser();
  // Messages are removed automatically via ON DELETE CASCADE.
  const { error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", conversationId);
  if (error) throw error;
}

// ── Messages ──────────────────────────────────────────────────────────────────

export async function getMessages(conversationId: string) {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("messages")
    .select("id, role, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function saveMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string
) {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("messages")
    .insert({ conversation_id: conversationId, role, content })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── Invoices ──────────────────────────────────────────────────────────────────

export async function getInvoices() {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("invoices")
    .select("id, status, amount_due, due_date, description, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

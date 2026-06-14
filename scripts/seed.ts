import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

// Load .env.local so this script works without any extra tooling
const envFile = readFileSync(".env.local", "utf-8");
for (const line of envFile.split("\n")) {
  const match = line.match(/^([^#\s][^=]*)=(.*)/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

// Service role client — bypasses RLS, needed for auth.admin.createUser
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Seed data ─────────────────────────────────────────────────────────────────

const ADMIN = {
  email: "admin@dev.local",
  password: "Password123!",
  full_name: "Admin User",
  role: "admin" as const,
};

const CLIENTS = [
  {
    email: "alice@dev.local",
    password: "Password123!",
    full_name: "Alice Nguyen",
    company_name: "Nguyen & Co",
    avatars: [
      { name: "Chef Miguel", description: "A warm Mexican chef who teaches Spanish through recipes." },
      { name: "Profesora Luna", description: "A strict but kind Madrid teacher focused on grammar." },
      { name: "Surf Bro Diego", description: "A chill Costa Rican surfer who keeps things casual." },
    ],
  },
  {
    email: "bob@dev.local",
    password: "Password123!",
    full_name: "Bob Okafor",
    company_name: "Okafor Imports",
    avatars: [
      { name: "Abuela Rosa", description: "A warm Colombian grandmother who loves telling stories." },
      { name: "DJ Mateo", description: "A Buenos Aires DJ who teaches through music and lyrics." },
    ],
  },
  {
    email: "carol@dev.local",
    password: "Password123!",
    full_name: "Carol Kim",
    company_name: null,
    avatars: [
      { name: "Detective Vargas", description: "A noir-style detective who narrates mysteries in Spanish." },
      { name: "Coach Fernanda", description: "An intense soccer coach who drills vocabulary fast." },
      { name: "Botanist Tomás", description: "A gentle Peruvian botanist who explains nature slowly and clearly." },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

async function createUser(email: string, password: string): Promise<string> {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // skip confirmation email
  });
  if (error) throw new Error(`createUser(${email}): ${error.message}`);
  return data.user.id;
}

async function updateProfile(
  id: string,
  fields: { full_name?: string; company_name?: string | null; role?: "client" | "admin" }
) {
  const { error } = await supabase.from("profiles").update(fields).eq("id", id);
  if (error) throw new Error(`updateProfile(${id}): ${error.message}`);
}

async function createAvatar(
  profileId: string,
  name: string,
  description: string
) {
  const { error } = await supabase.from("avatars").insert({
    name,
    description,
    profile_id: profileId,
    is_preset: false,
  });
  if (error) throw new Error(`createAvatar(${name}): ${error.message}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function seed() {
  console.log("Seeding...\n");

  // Admin
  console.log(`Creating admin: ${ADMIN.email}`);
  const adminId = await createUser(ADMIN.email, ADMIN.password);
  await updateProfile(adminId, { full_name: ADMIN.full_name, role: "admin" });
  console.log("  ✓ admin profile updated\n");

  // Clients + their avatars
  for (const client of CLIENTS) {
    console.log(`Creating client: ${client.email}`);
    const clientId = await createUser(client.email, client.password);
    await updateProfile(clientId, {
      full_name: client.full_name,
      company_name: client.company_name,
    });
    console.log("  ✓ profile updated");

    for (const avatar of client.avatars) {
      await createAvatar(clientId, avatar.name, avatar.description);
      console.log(`  ✓ avatar: ${avatar.name}`);
    }
    console.log();
  }

  console.log("Done.");
}

seed().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

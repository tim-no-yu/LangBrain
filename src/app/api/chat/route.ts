import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { Message } from "@/types/chat";

const CreateChatSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be 100 characters or fewer"),
  description: z.string().max(1000, "Description must be 1000 characters or fewer").optional(),
  username: z
    .string()
    .min(1, "Username is required")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username may only contain letters, numbers, underscores, and hyphens"),
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).optional(),
});

type ChatLog = {
  id: string;
  name: string;
  description?: string;
  username: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
};

// In-memory store — resets on server restart
const chatLogs = new Map<string, ChatLog>();

function notFound() {
  return NextResponse.json({ error: "Chat log not found" }, { status: 404 });
}

// GET /api/chat — list all chat logs
export async function GET() {
  return NextResponse.json(Array.from(chatLogs.values()));
}

// POST /api/chat — create a new chat log
export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = CreateChatSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return NextResponse.json({ errors }, { status: 400 });
  }

  const { name, description, username, messages = [] } = result.data;
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const log: ChatLog = { id, name, description, username, messages, createdAt: now, updatedAt: now };
  chatLogs.set(id, log);
  return NextResponse.json(log, { status: 201 });
}

// PUT /api/chat — update a chat log by id
export async function PUT(req: NextRequest) {
  const { id, messages }: { id: string; messages: Message[] } = await req.json();
  const existing = chatLogs.get(id);
  if (!existing) return notFound();
  const updated: ChatLog = { ...existing, messages, updatedAt: new Date().toISOString() };
  chatLogs.set(id, updated);
  return NextResponse.json(updated);
}

// DELETE /api/chat?id=... — delete a chat log by id
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") ?? "";
  if (!chatLogs.has(id)) return notFound();
  chatLogs.delete(id);
  return NextResponse.json({ deleted: id });
}

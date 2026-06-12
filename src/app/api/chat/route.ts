import { NextRequest, NextResponse } from "next/server";
import type { Message } from "@/types/chat";

type ChatLog = {
  id: string;
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
  const { messages }: { messages: Message[] } = await req.json();
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const log: ChatLog = { id, messages, createdAt: now, updatedAt: now };
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

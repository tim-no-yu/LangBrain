import { NextResponse } from "next/server";
import { getConversations, createConversation } from "@/lib/queries";

export async function GET() {
  try {
    const conversations = await getConversations();
    return NextResponse.json(conversations);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const { avatar_id, title } = await request.json();
    if (!avatar_id) return NextResponse.json({ error: "avatar_id is required" }, { status: 400 });
    const conversation = await createConversation(avatar_id, title);
    return NextResponse.json(conversation, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

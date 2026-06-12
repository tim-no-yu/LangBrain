import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import type { Message } from "@/types/chat";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a friendly Spanish tutor helping the user practice conversational Spanish over text. Keep replies short like real texts. Reply in Spanish first, then put the English translation in parentheses on the next line. Occasionally (not every message) add a short inline tip starting with "💡 Tip:" about the grammar, vocabulary, or phrasing used. Be warm and encouraging.`;

export async function POST(req: NextRequest) {
  const { messages }: { messages: Message[] } = await req.json();

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages,
  });

  const block = response.content[0];
  const text = block.type === "text" ? block.text : "";

  return NextResponse.json({ message: text });
}

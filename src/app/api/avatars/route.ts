import { NextResponse } from "next/server";
import { getAvatars, createCustomAvatar } from "@/lib/queries";

export async function GET() {
  try {
    const avatars = await getAvatars();
    return NextResponse.json(avatars);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, image_url } = await request.json();
    if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });
    const avatar = await createCustomAvatar(name, description, image_url);
    return NextResponse.json(avatar, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

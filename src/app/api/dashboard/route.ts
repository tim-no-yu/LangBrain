import { NextResponse } from "next/server";

const mockUserProfile = {
  username: "mockUser",
  proficiency: 3,
  timeSpentMinutes: 47,
  email: "mockUser@example.com"
};

export async function GET() {
  return NextResponse.json(mockUserProfile);
}

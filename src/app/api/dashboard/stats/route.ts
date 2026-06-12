import { NextResponse } from "next/server";

const mockStats = {
  totalUsers: 1,
  totalAvatars: 4,
  timeSpentMonth: 47,
};

export async function GET() {
  return NextResponse.json(mockStats);
}

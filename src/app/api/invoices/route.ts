import { NextResponse } from "next/server";
import { getInvoices } from "@/lib/queries";

export async function GET() {
  try {
    const invoices = await getInvoices();
    return NextResponse.json(invoices);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

import { getJWT } from "../../utils/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const token = await getJWT();
  if (!token) {
    return NextResponse.json({ success: false, error: "Failed to get JWT" }, { status: 500 });
  }

  return NextResponse.json({ success: true, token }, { status: 200 });
}

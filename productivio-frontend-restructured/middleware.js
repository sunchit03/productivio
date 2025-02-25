import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req) {
  
  const token = await cookies().get("token")?.value;

  if (!token) {
    return NextResponse.json({ success: false, error: "Unauthorized: No token provided" }, { status: 401 });
  }

  // Call the verification API route
  const verifyResponse = await fetch(new URL("/api/auth/verify", req.url), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  const verifyData = await verifyResponse.json();
  if (!verifyData.success) {
    return NextResponse.json({ success: false, error: "Unauthorized: Invalid token" }, { status: 403 });
  }

  console.log("User Verified:", verifyData.decoded);
  return NextResponse.next();
}

// Protect specific API routes
export const config = {
  matcher: ["/api/lists/:path*", "/api/tasks/:path*", "/api/teams/:path*", "/api/users/:path*"],
};

import { NextResponse } from "next/server";

export async function middleware(req) {
  const authHeader = req.headers.get("Authorization");
  console.log("Middleware is running...");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ success: false, error: "Unauthorized: No token provided" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1]; // Extract JWT

  // Call the new API route to verify the token
  const verifyResponse = await fetch(new URL("/api/auth/verify", req.url), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  const verifyData = await verifyResponse.json();
  if (!verifyData.success) {
    return NextResponse.json({ success: false, error: "Unauthorized: Invalid token" }, { status: 403 });
  }

  // Token is valid, allow request
  console.log("User Verified:", verifyData.decoded);
  return NextResponse.next();
}

// Protect specific API routes
export const config = {
  matcher: ["/api/lists/:path*", "/api/tasks/:path*", "/api/teams/:path*", "/api/users/:path*"],
};

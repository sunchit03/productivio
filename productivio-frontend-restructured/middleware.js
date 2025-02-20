import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET; // Store in .env.local

export function middleware(req) {
  const authHeader = req.headers.get("Authorization");
  console.log("I am hereeeeeeeee");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ success: false, error: "Unauthorized: No token provided" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1]; // Extract JWT

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("Decoded Token:", decoded);

    // Token is valid, allow request
    return NextResponse.next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return NextResponse.json({ success: false, error: "Unauthorized: Invalid token" }, { status: 403 });
  }
}
// Apply middleware only to API routes that need protection
export const config = {
  // Protect all routes under /api/lists/, /api/tasks/, /api/teams/, /api/users/
  matcher: ["/api/lists/:path*", "/api/tasks/:path*", "/api/teams/:path*", "/api/users/:path*"],
};

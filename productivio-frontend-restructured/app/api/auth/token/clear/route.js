import { NextResponse } from "next/server";

export async function GET(req) {
  const response = NextResponse.json({ success: true, message: "Tokens cleared" });

  // ✅ Clear the token cookie
  response.cookies.set("token", "", { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    path: "/", 
    expires: new Date(0) // Expire immediately
  });

  // ✅ Clear Auth0 session cookie (appSession)
  response.cookies.set("appSession", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0) // Expire immediately
  });

  return response;
}

import { NextResponse } from "next/server";
import { jwtVerify, importJWK } from "jose";

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN; // Your Auth0 domain
const JWKS_URL = `https://${AUTH0_DOMAIN}/.well-known/jwks.json`;

async function getPublicKey() {
  const response = await fetch(JWKS_URL);
  const { keys } = await response.json();

  // Extract first key (assuming Auth0 provides only one)
  const jwk = keys[0];

  // Convert JWK to a format usable by `jose`
  return await importJWK(jwk, "RS256");
}

export async function POST(req) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const publicKey = await getPublicKey();

    // Verify the token
    const { payload } = await jwtVerify(token, publicKey);
    
    return NextResponse.json({ success: true, decoded: payload });
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return NextResponse.json({ success: false, error: "Unauthorized: Invalid token" }, { status: 403 });
  }
}

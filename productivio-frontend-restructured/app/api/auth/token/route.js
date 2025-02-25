import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                grant_type: "client_credentials",
                client_id: process.env.AUTH0_CLIENT_ID, 
                client_secret: process.env.AUTH0_CLIENT_SECRET,
                audience: process.env.AUTH0_API_IDENTIFIER,
            }),
        });

        if (!response.ok) {
            return NextResponse.json({ success: false, error: `Failed to retrieve token: ${response.statusText}` }, { status: response.status });
        }

        const data = await response.json();
        const token = data.access_token;

        // ✅ Set HttpOnly, Secure cookie
        const responseWithCookie = NextResponse.json({ success: true }, { status: 200 });
        responseWithCookie.cookies.set("token", token, {
            httpOnly: true, // Prevent access from JavaScript
            secure: process.env.NODE_ENV === "production", // Secure in production
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day expiration
        });

        return responseWithCookie;
    } catch (error) {
        console.error("Error fetching JWT:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

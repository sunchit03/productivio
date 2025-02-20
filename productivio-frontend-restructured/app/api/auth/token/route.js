import { NextResponse } from "next/server";

export async function POST() {
    try {
        const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
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
        return NextResponse.json({ token: data.access_token }, { status: 200 });
    } catch (error) {
        console.error("Error fetching JWT:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

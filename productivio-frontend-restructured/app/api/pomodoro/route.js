import { NextResponse } from "next/server";
import User from "../../models/User";
import Session from "../../models/Session";

export async function POST(req) {
    try {
        if (!req.body) {
            return NextResponse.json({ success: false, error: "Empty request body" }, { status: 400 });
        }

        const jsonString = await req.text(); // Read raw body as text
        if (!jsonString) {
            return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
        }

        const requestData = JSON.parse(jsonString); // Parse JSON manually

        const { currentMode, focusSeconds, breakSeconds, assignedUser, workAmounts, breakAmounts } = requestData;

        if (!assignedUser) {
            return NextResponse.json({ success: false, error: "Assigned user is required" }, { status: 400 });
        }

        // Check if user exists
        const user = await User.findById(assignedUser);
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        // Create new session
        const newSession = new Session({
            currentMode: "work",
            focusSeconds: 0,
            breakSeconds: 0,
            assignedUser,
            workAmounts: 0,
            breakAmounts: 0,
        });

        await newSession.save();

        return NextResponse.json({ success: true, session: newSession }, { status: 201 });

    } catch (error) {
        console.error("Error creating session:", error);
        return NextResponse.json({ success: false, error: "Server error: " + error.message }, { status: 500 });
    }
}

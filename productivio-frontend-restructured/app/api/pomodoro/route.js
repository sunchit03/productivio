import { NextResponse } from "next/server";
import User from "../../models/User";
import Session from "../../models/Session";
import connectDB from "../../utils/connect";

export async function POST(req) {
    try {
        await connectDB();
        if (!req.body) {
            return NextResponse.json({ success: false, error: "Empty request body" }, { status: 400 });
        }

        const jsonString = await req.text();
        if (!jsonString) {
            return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
        }

        const requestData = JSON.parse(jsonString);

        const { currentMode, focusSeconds, breakSeconds, assignedUser, workAmounts, breakAmounts } = requestData;
        if (!assignedUser) {
            return NextResponse.json({ success: false, error: "Assigned user is required" }, { status: 400 });
        }

        const user = await User.findById(assignedUser);
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        const newSession = new Session({
            currentMode: "work",
            focusSeconds: 0,
            breakSeconds: 0,
            workAmounts: 0,
            breakAmounts: 0,
        });
        await newSession.save();

        user.sessions.push(newSession);

        await user.save();

        return NextResponse.json({ success: true, session: newSession }, { status: 201 });

    } catch (error) {
        console.error("Error creating session:", error);
        return NextResponse.json({ success: false, error: "Server error: " + error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await connectDB();
        const jsonString = await req.text();
        const requestData = JSON.parse(jsonString);
        const { userId, sessionId, focusSeconds, breakSeconds, workAmounts, breakAmounts, currentMode } = requestData;

        const user = await User.findById(userId);

        const session = user.sessions.find((s) => s._id.toString() === sessionId);

        if (!session) {
            return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
        }

        session.focusSeconds = session.focusSeconds || 0;
        session.breakSeconds = session.breakSeconds || 0;
        session.workAmounts = session.workAmounts || 0;
        session.breakAmounts = session.breakAmounts || 0;

        console.log("session: ", session);
        console.log("current focus:", session.focusSeconds);

        session.focusSeconds += focusSeconds;
        session.breakSeconds += breakSeconds;
        session.workAmounts += workAmounts;
        session.breakAmounts += breakAmounts;
        session.currentMode = currentMode;

        console.log("update focus:", session.focusSeconds);

        await user.save();
        return NextResponse.json({ success: true, updatedSession: session }, { status: 200 });
    } catch (error) {
        console.error("Error updating session:", error);
        return NextResponse.json({ success: false, error: "Server error: " + error.message }, { status: 500 });
    }
}

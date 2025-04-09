import { NextResponse } from "next/server";
import User from "../../models/User";
import Session from "../../models/Session";
import connectDB from "../../utils/connect";

export async function POST(req) {
  try {   
    const { userId, focusSeconds } = await req.json();
    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const newSession = new Session({
      focusSeconds,
      userId
    });
    await newSession.save();

    user.sessions.push(newSession);
    // Update stats
    user.stats.todayPomo += 1;
    user.stats.totalPomo += 1;
    user.stats.todayFocus += focusSeconds;
    user.stats.totalFocus += focusSeconds;
    user.stats.lastUpdated = new Date();
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
        const {sessionId, focusSeconds, breakSeconds, workAmounts, breakAmounts, currentMode } = requestData;

        const session = await Session.findById(sessionId);

        if (!session) {
            return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
        }

        session.focusSeconds = session.focusSeconds || 0;
        session.breakSeconds = session.breakSeconds || 0;
        session.workAmounts = session.workAmounts || 0;
        session.breakAmounts = session.breakAmounts || 0;

        console.log("ASD")
        console.log("session: ", session);
        console.log("current focus:", session.focusSeconds);

        session.focusSeconds += focusSeconds;
        session.breakSeconds += breakSeconds;
        session.workAmounts += workAmounts;
        session.breakAmounts += breakAmounts;
        session.currentMode = currentMode;

        console.log("update focus:", session.focusSeconds);

        await session.save();
        return NextResponse.json({ success: true, updatedSession: session }, { status: 200 });
    } catch (error) {
        console.error("Error updating session:", error);
        return NextResponse.json({ success: false, error: "Server error: " + error.message }, { status: 500 });
    }
}


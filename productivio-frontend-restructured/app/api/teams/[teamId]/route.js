import { NextResponse } from "next/server";
import Team from "../../../models/Team";

export async function GET(req, { params }) {
  try {
    const { teamId } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    if (!teamId) {
      return NextResponse.json({ success: false, error: "Team ID is required" }, { status: 400 });
    }

    const team = await Team.findById(teamId).populate("members").populate("admin");

    if (!team) {
      return NextResponse.json({ success: false, error: "Team not found" }, { status: 404 });
    }

    // Check if the requesting user is a member of the team
    const isMember = team.members.some(member => member._id.toString() === userId);

    if (!isMember) {
      return NextResponse.json({ success: false, error: "Access denied. You are not a team member." }, { status: 403 });
    }

    return NextResponse.json({ success: true, team }, { status: 200 });
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

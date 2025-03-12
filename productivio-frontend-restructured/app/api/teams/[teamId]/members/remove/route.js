import { NextResponse } from "next/server";
import Team from "../../../../../models/Team";
import User from "../../../../../models/User";
import Task from "../../../../../models/Task";

export async function PATCH(req, { params }) {
  try {
    const { teamId } = await params;
    const { userId, memberId, remove } = await req.json();

    if (!teamId || !userId) {
      return NextResponse.json({ success: false, error: "TeamId and UserId is required." }, { status: 400 });
    }

    const team = await Team.findById(teamId).populate("admin");
    if (!team) {
      return NextResponse.json({ success: false, error: "Team not found" }, { status: 404 });
    }

    if (remove === "true") {
        if (team.admin._id.toString() !== userId) {
        return NextResponse.json({ success: false, error: "Not authorized to remove member from the team" }, { status: 401 });
        }
    }

    const member = await User.findById(memberId);
    if (!member) {
        return NextResponse.json({ success: false, error: "Member not found" }, { status: 404 });
    }

    // Remove the member from the team
    const updatedTeam = await Team.findByIdAndUpdate(
        teamId,
        { $pull: { members: memberId } },
        { new: true }
      );
  
      // Remove the team from the user's teams array
      await User.findByIdAndUpdate(memberId, { $pull: { teams: teamId } });
  
      // Update all tasks of this team where assignedTo is the member, setting assignedTo to null
      await Task.updateMany(
        { team: teamId, assignedTo: memberId },
        { $set: { assignedTo: null } }
      );

    return NextResponse.json({ success: true, team: updatedTeam }, { status: 200 });

  } catch (error) {
    console.error("Error adding new user to the team:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
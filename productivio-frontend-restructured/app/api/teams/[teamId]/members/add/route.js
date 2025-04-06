import { NextResponse } from "next/server";
import Team from "../../../../../models/Team";
import User from "../../../../../models/User";

export async function PATCH(req, { params }) {
  try {
    const { teamId } = params;
    const { userId, newMember } = await req.json();

    if (!teamId || !userId) {
      return NextResponse.json({ success: false, error: "TeamId and UserId is required." }, { status: 400 });
    }

    const team = await Team.findById(teamId).populate("admin");
    if (!team) {
      return NextResponse.json({ success: false, error: "Team not found" }, { status: 404 });
    }

    if (team.admin._id.toString() !== userId) {
      return NextResponse.json({ success: false, error: "Not authorized to add users to this team" }, { status: 401 });
    }

    const newUser = await User.findOne({email: newMember.email, connection: newMember.connection});
    if (!newUser) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const updatedTeam = await Team.findByIdAndUpdate(
        teamId,
        { $addToSet: { members: newUser._id } },
        { new: true }
    );

    newUser.teams.push(team._id);
    await newUser.save();

    return NextResponse.json({ success: true, team: updatedTeam }, { status: 200 });

  } catch (error) {
    console.error("Error adding new user to the team:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import Team from "../../../models/Team";
import User from "../../../models/User";
import Task from "../../../models/Task";

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

    const team = await Team.findById(teamId)
      .populate("admin", "_id") // Only get admin ID
      .populate("members", "_id email connection profilePicture") // Only get required fields for members
      .select("_id title members admin"); // Only retrieve these fields from the Team model

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



export async function PATCH(req, { params }) {
  try {
    const { teamId } = await params;
    const { userId, ...updateTeam } = await req.json();

    if(!teamId || !userId){
      return NextResponse.json({ success: false, error: "TeamId and UserId is required." }, { status: 400 });
    }

    const team = await Team.findById(teamId).populate("admin");
    if (!team) {
      return NextResponse.json({ success: false, error: "Team not found" }, { status: 404 });
    }

    if(team.admin._id.toString() !== userId){
      return NextResponse.json({ success: false, error: "Not authorized to update this team" }, { status: 401 });
    }

    const updatedTeam = await Team.findByIdAndUpdate(teamId, updateTeam, { new: true });

    return NextResponse.json({ success: true, team: updatedTeam }, { status: 200 });

  } catch (error) {
    console.error("Error updating team:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, {params}){
  try{
    const {teamId} = await params;
    const {userId} = await req.json();

    if(!userId || !teamId){
      return NextResponse.json({success: false, error: "UserId and TeamId is required"},{status: 400});
    }

    const team = await Team.findById(teamId).populate("admin");

    if(!team){
      return NextResponse.json({success: false, error:"Team does not exist."},{status: 404})
    }

    if(team.admin._id.toString() !== userId){
      return NextResponse.json({success: false, error: "Only admins can delete the team."},{status:401});
    }
    await Task.deleteMany({ _id: { $in: team.tasks } });
    await User.updateMany({ _id:{ $in: team.members} },{ $pull: { teams: teamId } });
    await team.deleteOne();
    return NextResponse.json({success: true, error: "Team deleted successfully."},{status:200});
    }catch(error){
      return NextResponse.json({success: false, error:error.message},{status:500});
  }
}





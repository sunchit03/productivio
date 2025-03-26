import { NextResponse } from "next/server";
import Task from "../../../../models/Task";

export async function GET(req, { params }) {
    try {
      const { teamId } = await params;
  
      if (!teamId) {
        return NextResponse.json({ success: false, error: "Team ID is required" }, { status: 400 });
      }
  
      const tasks = await Task.find({ team: teamId })
      .populate("updatedAt")
      .populate("assignedTo", "_id email")
      .populate("createdBy", "_id email")
      .populate("updatedBy", "_id email");
  
      return NextResponse.json({ success: true, tasks }, { status: 200 });
  
    } catch (error) {
      console.error("Error fetching team tasks:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }
  
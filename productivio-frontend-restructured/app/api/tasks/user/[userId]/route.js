import { NextResponse } from "next/server";
import Task from "../../../../models/Task";

export async function GET(req, { params }) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const tasks = await Task.find({ assignedTo: userId }).lean();

    return NextResponse.json({ success: true, tasks }, { status: 200 });

  } catch (error) {
    console.error("Error fetching tasks for user:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
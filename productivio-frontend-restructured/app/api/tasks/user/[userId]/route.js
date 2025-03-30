import { NextResponse } from "next/server";
import mongoose from "mongoose";
const connectDB = require('../../../../utils/connect');
import Task from "../../../../models/Task";
import List from "../../../../models/List"
import Team from "../../../../models/Team"


export async function GET(req, { params }) {
  try {
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    const { userId } = await params;

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    let tasks;
      tasks = await Task.find({ assignedTo: userId }).populate([{
        path: "list",
        select: "_id name emoji"
      },{
        path: "team",
        select: "title"
      }]);

    return NextResponse.json({ success: true, tasks }, { status: 200 });

  } catch (error) {
    console.error("Error fetching tasks for user:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import mongoose from "mongoose";
const connectDB = require('../../../../utils/connect');
import Task from "../../../../models/Task";
import List from "../../../../models/List"

export async function GET(req, { params }) {
  try {
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    const { userId } = await params;

    const list = req.nextUrl.searchParams.get('list');

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    let tasks;
    if (list === "true") {
      tasks = await Task.find({ assignedTo: userId }).populate({
        path: "list",
        select: "name emoji"
      });
    } else {
      tasks = await Task.find({ assignedTo: userId }).lean();
    }

    return NextResponse.json({ success: true, tasks }, { status: 200 });

  } catch (error) {
    console.error("Error fetching tasks for user:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
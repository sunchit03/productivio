import { NextResponse } from "next/server";
import mongoose from "mongoose";
const connectDB = require('../../../../utils/connect');
import List from "../../../../models/List";

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

    const lists = await List.find({ createdBy: userId }).lean();

    return NextResponse.json({ success: true, lists }, { status: 200 });

  } catch (error) {
    console.error("Error fetching lists for user:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
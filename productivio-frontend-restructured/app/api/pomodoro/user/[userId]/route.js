import { NextResponse } from "next/server";
import mongoose from "mongoose";
const connectDB = require('../../../../utils/connect');
import User from "../../../../models/User";


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
  
    const user = await User.findById(userId);
    if (!user) {
    return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const stats = user.stats;
    const today = new Date();
    const lastUpdated = stats.lastUpdated;

    const isStale =
      !lastUpdated ||
      lastUpdated.getFullYear() !== today.getFullYear() ||
      lastUpdated.getMonth() !== today.getMonth() ||
      lastUpdated.getDate() !== today.getDate();

    if (isStale) {
      // Reset today's stats
      stats.todayPomo = 0;
      stats.todayFocus = 0;
      stats.lastUpdated = today;

      await user.save();
    }

    return NextResponse.json({ success: true, stats: user.stats }, { status: 200 });

  } catch (error) {
    console.error("Error fetching tasks for user:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
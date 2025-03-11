import { NextResponse } from "next/server";
import mongoose from "mongoose";
const connectDB = require('../../../../utils/connect');
import Team from "../../../../models/Team";
import User from "../../../../models/User";

export async function GET(req, { params }) {
    try {
      if (mongoose.connection.readyState === 0) {
        await connectDB();
      }

      const { userId } = await params;
  
      if (!userId) {
        return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
      }
  
      const user = await User.findById(userId).populate({
        path: "teams",
        select: "_id title description admin",
        populate: {
          path: "admin",
          select: "_id", // Only selecting _id for admin
        },
      });

      if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
      }
      console.log(user.teams);
      return NextResponse.json({ success: true, teams: user.teams }, { status: 200 });
    } catch (error) {
      console.error("Error fetching teams:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}


export async function POST(req) {
  try {

    const { title, description, userId } = await req.json();

    if (!title || !userId) {
        return NextResponse.json({ success: false, error: "Title and User ID are required" }, { status: 400 });
    }
  
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const newTeam = new Team({ title, description, admin: user._id, members: [user._id] });
    await newTeam.save();

    user.teams.push(newTeam._id);
    await user.save();

    return NextResponse.json({ success: true, team: newTeam }, { status: 201 });
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

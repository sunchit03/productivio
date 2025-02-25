import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "../../models/User";
const connectDB = require('../../utils/connect');

export async function POST(req) {
  try {
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    const { email, profilePicture, connection } = await req.json();

    // Check if the user already exists
    let user = await User.findOne({ email, connection }).lean();

    if (!user) {
      user = new User({ email, profilePicture, connection });
      await user.save();
    }


    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

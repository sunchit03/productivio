import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "../../models/User";
const connectDB = require('../../utils/connect');

const MONGO_URI = process.env.MONGO_URI;
connectDB();

export async function POST(req) {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables.");
    }

    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState === 0) {
        console.log(mongoose.connection.readyState);
      await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    const { email, connection } = await req.json();
    console.log(email, connection);

    // Check if the user already exists
    let user = await User.findOne({ email, connection });

    if (!user) {
      user = new User({ email, connection });
      await user.save();
    }

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

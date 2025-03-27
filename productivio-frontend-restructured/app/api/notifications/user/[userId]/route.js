import { NextResponse } from "next/server";
import mongoose from "mongoose";
const connectDB = require('../../../../utils/connect');
import Notification from "../../../../models/Notification";
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

    let notifications = await Notification.find({ user: userId }).lean();

    return NextResponse.json({ success: true, notifications }, { status: 200 });

  } catch (error) {
    console.error("Error fetching notifications for user:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { userId } = await params;

    const user = await User.findById(userId);

    if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    if (!user.notifications || user.notifications.length === 0) {
        return NextResponse.json({ success: true, message: "No notifications to update" }, { status: 200 });
    }

    await Notification.updateMany({ _id: { $in: user.notifications } }, { $set: { isNew: false } });

    return NextResponse.json({ success: true, message: "Notifications marked as read" }, { status: 200 });

  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  try {
    const { userId } = await params;

    const user = await User.findById(userId);

    if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    await Notification.deleteMany({ _id: { $in: user.notifications } });
    await User.updateOne({ _id: userId }, { $set: { notifications: [] } });

    return NextResponse.json({ success: true, message: "Notifications deleted" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting notifications:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
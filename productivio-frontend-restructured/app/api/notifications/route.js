import { NextResponse } from "next/server";
import Notification from "../../models/Notification";
import User from "../../models/User";

export async function POST(req) {
  try {
    const { title, type, receiverId } = await req.json();

    if (!title || !receiverId) {
      return NextResponse.json({ success: false, error: "Title and Receiver are required" }, { status: 400 });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
        return NextResponse.json({ success: false, error: "Receiver not found" }, { status: 404 });
    }

    const newNotification = new Notification({
      title,
      type,
      user: receiver
    });

    await newNotification.save();

    receiver.notifications.push(newNotification._id);
    await receiver.save();

    return NextResponse.json({ success: true, notification: newNotification }, { status: 201 });

  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { notificationId } = await params;
    const { userId } = await req.json(); // User making the request

    const user = await User.findById(userId);

    if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return NextResponse.json({ success: false, error: "Notification not found" }, { status: 404 });
    }

    // Remove the notification from the user's notifications array
    await User.findByIdAndUpdate(userId, { $pull: { notifications: notificationId } });
    await notification.deleteOne();
    return NextResponse.json({ success: true, message: "Notification deleted" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
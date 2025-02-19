import { NextResponse } from "next/server";
import List from "../../models/List";
import User from "../../models/User";

export async function POST(req) {
  try {
    const { name, emoji, createdBy } = await req.json();

    if (!name || !createdBy) {
      return NextResponse.json({ success: false, error: "Name and CreatedBy are required" }, { status: 400 });
    }

    // Check if user exists
    const user = await User.findById(createdBy);
    if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Check if list with provided name already exists
    const list = await List.findOne({name});
    if (list) {
      return NextResponse.json({ success: false, error: `List with name ${name} already exists` }, { status: 400 });
    }

    // Create new list
    const newList = new List({
      name,
      emoji,
      createdBy
    });

    await newList.save();

    user.lists.push(newList._id);
    await user.save();

    return NextResponse.json({ success: true, list: newList }, { status: 201 });

  } catch (error) {
    console.error("Error creating list:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
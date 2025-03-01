import { NextResponse } from "next/server";
import Team from "../../models/Team";
import User from "../../models/User";

export async function POST(req) {
  try {
    const { title, description, admin } = await req.json();

    if (!title || !admin) {
        return NextResponse.json({ success: false, error: "Title and Admin are required" }, { status: 400 });
    }
  
    // Check if user exists
    const user = await User.findById(admin);
    if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    console.log(user);

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
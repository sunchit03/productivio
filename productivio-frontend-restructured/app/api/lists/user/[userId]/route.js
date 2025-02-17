import { NextResponse } from "next/server";
import List from "../../../../models/List";

export async function GET(req, { params }) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const lists = await List.find({ createdBy: userId });

    return NextResponse.json({ success: true, lists }, { status: 200 });

  } catch (error) {
    console.error("Error fetching lists for user:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
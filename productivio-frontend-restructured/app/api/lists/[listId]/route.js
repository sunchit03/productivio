import { NextResponse } from "next/server";
import List from "../../../models/List";
import Task from "../../../models/Task";

export async function GET(req, { params }) {
    try {
        const { listId } = await params;
        const list = await List.findById(listId).lean();
        if (!list) return NextResponse.json({ success: false, message: "List not found" }, { status: 404 });
    
        return NextResponse.json({ success: true, list }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }

export async function DELETE(req, { params }) {
  try {
    const { listId } = await params;
    const { userId } = await req.json(); // User making the request

    const list = await List.findById(listId);
    if (!list) {
      return NextResponse.json({ success: false, error: "List not found" }, { status: 404 });
    }

    // Ensure only the creator can delete the list
    if (list.createdBy.toString() !== userId) {
      return NextResponse.json({ success: false, error: "You are not authorized to delete this list" }, { status: 403 });
    }

    // Delete all tasks belonging to this list
    await Task.deleteMany({ list: listId });

    await list.deleteOne();
    return NextResponse.json({ success: true, message: "List deleted" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting list:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { listId } = await params;
    const { userId, ...updateData } = await req.json();

    const list = await List.findById(listId);
    if (!list) {
      return NextResponse.json({ success: false, error: "List not found" }, { status: 404 });
    }

    // Only the creator or assigned user can update the list
    if (list.createdBy.toString() !== userId) {
      return NextResponse.json({ success: false, error: "Not authorized to update this list" }, { status: 403 });
    }

    const updatedList = await List.findByIdAndUpdate(listId, updateData, { new: true });

    return NextResponse.json({ success: true, list: updatedList }, { status: 200 });

  } catch (error) {
    console.error("Error updating list:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
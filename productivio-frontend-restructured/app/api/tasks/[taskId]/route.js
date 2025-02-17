import { NextResponse } from "next/server";
import Task from "../../../models/Task";

export async function GET(req, { params }) {
    try {
        const { taskId } = await params;
        const task = await Task.findById(taskId).lean();
        if (!task) return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });
    
        return NextResponse.json({ success: true, task }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }

export async function DELETE(req, { params }) {
  try {
    const { taskId } = params;
    const { userId } = await req.json(); // User making the request

    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }

    // Ensure only the creator can delete the task
    if (task.createdBy.toString() !== userId) {
      return NextResponse.json({ success: false, error: "You are not authorized to delete this task" }, { status: 403 });
    }

    await task.deleteOne();
    return NextResponse.json({ success: true, message: "Task deleted" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { taskId } = params;
    const { userId, ...updateData } = await req.json();

    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }

    // Only the creator or assigned user can update the task
    if (task.createdBy.toString() !== userId && task.assignedTo.toString() !== userId) {
      return NextResponse.json({ success: false, error: "Not authorized to update this task" }, { status: 403 });
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, { new: true });

    return NextResponse.json({ success: true, task: updatedTask }, { status: 200 });

  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
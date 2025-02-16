import { NextResponse } from "next/server";
import Task from "../../models/Task";

export async function POST(req) {
  try {
    const { title, description, assignedTo, createdBy, list, team, priority, dueDate } = await req.json();

    if (!title || !createdBy) {
      return NextResponse.json({ success: false, error: "Title and CreatedBy are required" }, { status: 400 });
    }

    // Determine task type (Individual or Team)
    const newTask = new Task({
      title,
      description,
      assignedTo: team ? assignedTo : createdBy, // If it's an individual task, assignedTo = createdBy
      list: list || null,
      team: team || null, // Ensure null if it's an individual task
      priority,
      dueDate,
      createdBy
    });

    await newTask.save();

    return NextResponse.json({ success: true, task: newTask }, { status: 201 });

  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
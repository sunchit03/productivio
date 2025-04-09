// File: app/api/files/upload/route.js

//Parses upload, sends to Cloudflare R2
import { NextResponse } from "next/server";
import { uploadFileToR2, deleteFileFromR2, getSignedUrlForR2 } from "@/app/services/cloudflareService";
import Task from "@/app/models/Task";
import dbConnect from "@/app/utils/connect"; // ensures DB connection in route handlers

export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const file = formData.get("file");
    const taskId = formData.get("taskId");

    if (!file || !taskId) {
      return NextResponse.json({ success: false, error: "Missing file or task ID" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `uploads/${Date.now()}-${file.name}`;

    const formattedFile = {
      key,
      mimetype: file.type,
      buffer,
    };

    const uploadedKey = await uploadFileToR2(formattedFile);

    const fileData = {
      name: file.name,
      key: uploadedKey,
      uploadedAt: new Date()
    };

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $push: { files: fileData } },
      { new: true }
    );

    if (!updatedTask) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, key: uploadedKey, updatedFiles: updatedTask.files }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
    //console.log("🔥 DELETE /api/files/upload called");
  try {
    const { key, taskId } = await req.json();
    if (!key || !taskId) return NextResponse.json({ success: false, error: "Missing key or task ID" }, { status: 400 });

    await dbConnect();
    await deleteFileFromR2(key);

    //console.log("Attempting to delete file with key:", key);

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $pull: { files: { key: key } } },
      { new: true }
    );
    
    //console.log("Updated Task Files:", updatedTask?.files);

    if (!updatedTask) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, updatedFiles: updatedTask.files }, { status: 200 });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key) return NextResponse.json({ success: false, error: "Missing file key" }, { status: 400 });

    const url = await getSignedUrlForR2(key);
    return NextResponse.json({ success: true, url }, { status: 200 });
  } catch (error) {
    console.error("Get download URL error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

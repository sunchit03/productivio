import { NextResponse } from "next/server";
import User from "../../../../models/User";
import Task from "../../../../models/Task";
import connectDB from "../../../../utils/connect";

connectDB();

export async function PUT(req, { params }) {
    try {
        const { taskId } = params;
        const { title, description, priority, userId } = await req.json();

        if (!title || !userId) {
            return NextResponse.json({ success: false, error: "Title and User ID are required." }, { status: 400 });
        }

        if(!taskId){
            return NextResponse.json({ success: false, error: "TaskId is required.." }, { status: 400 });
        }

        // Find the task and update it
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { title, description, priority },
            { new: true } // Return the updated task
        );

        if (!updatedTask) {
            return NextResponse.json({ success: false, error: "Task not found." }, { status: 404 });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
        }

        // Check if the task is already in the user's tasks array
        const taskIndex = user.tasks.findIndex(task => task.toString() === taskId);
        
        if (taskIndex !== -1) {
            // If the task exists, replace it with the updated task
            user.tasks[taskIndex] = updatedTask._id;
        } else {
            // If it doesn't exist, add the updated task to the user's array
            user.tasks.push(updatedTask._id);
        }

        await user.save(); // Save the updated user document

        return NextResponse.json({ success: true, task: updatedTask }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}


export async function DELETE(req, { params }) {
    try {
        const { taskId } = params;  // Extract taskId from route
        const { userId } = await req.json(); // Extract userId from request body

        if (!taskId || !userId) {
            return NextResponse.json({ success: false, error: "UserId and TaskId are required." }, { status: 400 });
        }

        const user = await User.findById(userId);

        if(!user){
            return NextResponse.json({success: false, error: "User does not exist."},{status: 400});
        }

        // Find user and remove the task reference
        await User.findByIdAndUpdate(userId, { $pull: { tasks: taskId } });


        //debugging
        const neuser = User.findById(userId).populate("tasks")
        // console.log(`Logged in user remaining tasks are: ${neuser.tasks}`)

        // Delete the actual task from the database
        await Task.findByIdAndDelete(taskId);
        console.log(`deleted task is: ${taskId}`);

        return NextResponse.json({ success: true, message: "Task deleted successfully." }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Error deleting task." }, { status: 500 });
    }
}

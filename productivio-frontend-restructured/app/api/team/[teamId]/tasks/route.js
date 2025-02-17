import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Team from "../../../../models/Team";
import Task from "../../../../models/Task";
const connectDB = require('../../../../utils/connect');

export async function GET(req,{params}){
    try{

        // Connect to MongoDB if not already connected
        if (mongoose.connection.readyState === 0) {
            await connectDB();
        }
        
        const { teamId } = params;
        const {searchParams} = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
        }

        if(!teamId){
            return NextResponse.json ({success: false, error: "teamId is required"}, {status: 400})
        }

        const team = await Team.findById(teamId).populate({path: "tasks"}).populate("members");

        if(!team){
            return NextResponse.json({success: false, error: "Team not found"},{status: 400})
        }  

        const isMember = team.members.some(member => member._id.toString() === userId);

        if (!isMember) {
            return NextResponse.json({ success: false, error: "Access denied. You are not a team member." }, { status: 403 });
        }

        if (!team.tasks || team.tasks.length === 0) {
                return NextResponse.json({ success: true, tasks: [], message: "No tasks available for this team." }, { status: 201 });
        }
        
        console.log(" Returning tasks:", team.tasks);

        return NextResponse.json({success: true, tasks: team.tasks},{status: 200})
}
   catch(error){
    console.error("Error fetching team tasks:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
   }
}

export async function POST(req,context){
    try{
    const {teamId} = await context.params;
    const {taskTitle, taskDescription} = await req.json();

    if(!teamId){
        return NextResponse.json({success: false, error: "TeamID and UserID  required"},{status: 400})
    }
    if(!taskTitle){
        return NextResponse.json({success: false, error: "Task title is required"},{status: 400})
    }
    const team = await Team.findById(teamId)

    if(!team){
        return NextResponse.json({success: false, error: "Team not found"},{status: 404})
    }

    const newTeamTask = new Task({title: taskTitle, description: taskDescription, createdBy: team.admin._id, team: team._id})
    await newTeamTask.save()

    team.tasks.push(newTeamTask._id)
    await team.save()

    console.log("Task successfully created:", newTeamTask);

    return NextResponse.json({success: true, task: newTeamTask},{status: 201});
}
    catch (error) {
        console.error("Error creating team tasks:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

}

export async function DELETE(req, { params }) {
    try {
        const { teamId } = await params;
        const { searchParams } = new URL(req.url);
        const taskId = searchParams.get("taskId");

        if (!teamId) {
            return NextResponse.json({ success: false, error: "teamId is required." }, { status: 400 });
        }
        if (!taskId) {
            return NextResponse.json({ success: false, error: "taskId is required." }, { status: 400 });
        }

        // Find the team
        const team = await Team.findById(teamId)

        if (!team) {
            return NextResponse.json({ success: false, error: "Team not found." }, { status: 404 });
        }

        // Check if task exists in the team
        const isTask = team.tasks.some(task => task._id.toString() === taskId);

        if (!isTask) {
            return NextResponse.json({ success: false, error: "Task not found in this team." }, { status: 404 });
        }

        // Remove task from the `tasks` array in `Team`
        await Team.findByIdAndUpdate(teamId, {
            $pull: { tasks: taskId }
        });

        //array of three tasks back because team object 
        console.log(`array of tasks: ${team.tasks}`);

        //gets updated in database but object remains in memory
        // Re-fetch the updated team to verify
        //const toteam = await Team.findById(teamId);
        //console.log(`task is:  ${taskId}`);
        // Delete the task from `Task` collection
        await Task.findByIdAndDelete(taskId);
        // console.log(`array of tasks: ${toteam.tasks}`);

        return NextResponse.json({ success: true, message: "Task deleted successfully." }, { status: 200 });

    } catch (error) {
        console.error("Error deleting task:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

import { useState } from "react";

export default function CreateTeamTask({teamId, onClose, refresh, userId}){
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    
    const handleCreateTeamTask = async () => {
        if (!taskTitle.trim()) return;
    
        try {
          const res = await fetch(`/api/team/${teamId}/tasks?${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({taskTitle, taskDescription }),
          });
    
          if (res.ok) {
            onClose(); // Close modal on success
            await refresh() // Refresh to show new team
          }
          else{
            console.error("Error adding team's task: ", error)
          }
        } catch (error) {
          console.error("Error creating task of team: ", error.message);
        }
      };
    
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-semibold mb-4 text-black">Create New Team Task</h2>
    
            <input
              type="text"
              placeholder="Task Title"
              className="w-full border p-2 rounded mb-2 text-black"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
    
            <textarea
              placeholder="Task Description"
              className="w-full border p-2 rounded mb-4 text-black"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
    
            <div className="flex justify-end">
              <button className="bg-gray-300 px-4 py-2 rounded mr-2" onClick={onClose}>
                Cancel
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleCreateTeamTask}>
                Create
              </button>
            </div>
          </div>
        </div>
      );
}
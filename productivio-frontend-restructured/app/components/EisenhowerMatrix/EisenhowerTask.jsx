import { useState, useEffect} from "react";


export default function EisenHowerTask({ refresh, onClose, userId, task }) {
    const [title, setTitle] = useState(task ? task.title : "");
    const [description, setDescription] = useState(task ? task.description : "");
    const [priority, setPriority] = useState(task ? task.priority : "4");

    useEffect(()=>{
        if(task){
            setTitle(task.title);
            setDescription(task.description);
            setPriority(task.priority);
        }
    },[task])


    const handleCreateTask = async () => {
        if (!title.trim()){
            alert("Please enter task title.");
            return;
        }
        try {
            let res;
            if (task) {
                // Update existing Task (PUT request)
                res = await fetch(`/api/user/tasks/${task._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, description, priority, userId }),
                });
            } else {
                // Create New Task (POST request)
                res = await fetch(`/api/user/tasks`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, description, priority, userId }),
                });
            }

            if (res.ok) {
                onClose();
                await refresh();
            } else {
                console.log("Task operation failed");
            }
        } catch (error) {
            console.error("Error handling task:", error.message);
        }
    }


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-xl font-semibold mb-4 text-black">{task ? "Edit Task" : "Create New Task"}</h2>

                <input
                    type="text"
                    placeholder="Task Title"
                    className="w-full border p-2 rounded mb-2 text-black"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    placeholder="Task Description"
                    className="w-full border p-2 rounded mb-4 text-black"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <select
                    className="w-full border p-2 rounded mb-4 text-black"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value || "4")}
                >
                    <option value="">Select Priority</option>
                    <option value="1">Urgent & Important</option>
                    <option value="2">Not Urgent & Important</option>
                    <option value="3">Urgent & Unimportant</option>
                    <option value="4">Not Urgent & Unimportant</option>
                </select>

                <div className="flex justify-end">
                    <button className="bg-gray-300 px-4 py-2 rounded mr-2" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleCreateTask}>
                    {task ? "Update" : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
}
// // app/components/TaskItem.jsx
import { useState } from "react";
import { useTasks } from "../context/TasksContext";

const TaskItem = ({ task }) => {
  const { deleteTask, toggleTaskCompletion, editTask } = useTasks();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task?.title , // Ensure title is always present
    dueDate: task?.dueDate || "",
  });

  // Open and close edit modal
  const openEditModal = () => setIsEditing(true);
  const closeEditModal = () => setIsEditing(false);

  // Handle task update
  const handleUpdate = (e) => {
    e.preventDefault();
    editTask(task.id, editedTask);
    closeEditModal();
  };

  return (
    <div
      className="flex items-center justify-between bg-gray-100 p-3 rounded-md mb-2 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Task Name */}
      <span className={`text-black ${task?.completed ? "line-through text-gray-500" : ""}`}>
        {task?.title || "Untitled Task"} {/* Ensures task title is displayed */}
      </span>

      <div className="flex items-center">
        {/* Complete Task Button */}
        <button onClick={() => toggleTaskCompletion(task.id)} className="text-green-600 mx-2">
          ✅
        </button>

        {/* Delete Task Button */}
        <button onClick={() => deleteTask(task.id)} className="text-red-600">
          ❌
        </button>

        {/* Three Dots Button (Visible on Hover) */}
        {isHovered && (
          <button onClick={openEditModal} className="ml-2 text-gray-600 hover:text-black">
            ⋮
          </button>
        )}
      </div>

      {/* Edit Task Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-black">Edit Task</h2>
            <form onSubmit={handleUpdate}>
              <label className="block text-black mb-2">
                Task Name:
                <input
                  type="text"
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  className="w-full border rounded p-2 text-black mt-1"
                  required
                />
              </label>
              <label className="block text-black mb-2">
                Due Date:
                <input
                  type="datetime-local"
                  value={editedTask.dueDate}
                  onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                  className="w-full border rounded p-2 text-black mt-1"
                  required
                />
              </label>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="mr-2 px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;

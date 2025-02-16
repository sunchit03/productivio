// // app/components/TaskItem.jsx
import { useState } from "react";
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";

const TaskItem = ({ task }) => {
  // const { deleteTask, toggleTaskCompletion, editTask } = useTasks();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task?.title , // Ensure title is always present
    dueDate: task?.dueDate || "",
  });
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Open and close edit modal
  const openEditModal = () => setIsEditing(true);
  const closeEditModal = () => setIsEditing(false);

  // Handle task update
  const handleUpdate = (e) => {
    e.preventDefault();
   // editTask(task.id, editedTask);
    closeEditModal();
  };

  const getPriorityColor = () => {
    let color;
    switch (task.priority) {
      case '1':
        color = "text-rose-500";
        break;

      case '2':
        color = "text-amber-500";
        break;

      case '3':
        color = "text-blue-500";
        break;

      case '4':
        color = "text-teal-400";
        break;
    }
    return color;
  }

  const handleCheckBoxCheck = () => {
    task.isCompleted = !task.isCompleted;
    console.log(task.isCompleted);
  }

  const formatDate = () => {
    let dateVal = new Date(task.dueDate);
    let now = new Date();
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    if (dateVal <= todayEnd && dateVal >= now) {
      return "Today";
    }
    
    // Set the time to midnight for accurate date comparison
    now.setHours(0, 0, 0, 0);
    dateVal.setHours(0, 0, 0, 0);
  
    let next7Days = new Date();
    next7Days.setDate(now.getDate() + 7);
  
    if (dateVal <= next7Days && dateVal >= now) {
      return dayNames[dateVal.getDay()];
    }
  
    let date = dateVal.getDate().toString();
    let month = monthNames[dateVal.getMonth()];
    let year = dateVal.getFullYear();
  
    let dateString = `${date} ${month} ${year !== now.getFullYear() ? year.toString() : ""}`;
    return dateString;
  };
  

  return (
    <div
      className={`flex items-center justify-between relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Task Name */}
      <span className={`text-black text-base flex items-center ${task?.isCompleted ? "line-through text-gray-500" : ""}`}>
        {task.isCompleted ? 
          <MdCheckBox className={`mr-2 cursor-pointer ${getPriorityColor()}`} onClick={handleCheckBoxCheck}/> 
        :
          <MdCheckBoxOutlineBlank className={`mr-2 cursor-pointer ${getPriorityColor()}`} onClick={handleCheckBoxCheck}/> 
        }
        
        {task?.title || "Untitled Task"} {/* Ensures task title is displayed */}
      </span>

      <div className="flex items-center">
        {task.dueDate &&
          <span className="text-black text-xs font-thin">{formatDate()}</span>
        }

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

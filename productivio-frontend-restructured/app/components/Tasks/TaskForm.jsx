// // app/components/TaskForm.jsx
import { useState } from "react";
import { useTasks } from "../../context/TasksContext";

const TaskForm = () => {
  const { addTask } = useTasks();
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !dueDate) return;

    addTask({ title, dueDate });
    setTitle("");
    setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title..."
        className="p-2 border rounded w-80 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="datetime-local"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="ml-2 p-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;

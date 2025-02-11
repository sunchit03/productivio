// // app/views/ListsView.jsx
"use client";
import { useState } from "react";
import { useLists } from "../context/ListsContext";
import TaskItem from "../components/TaskItem";

const ListsView = () => {
  const { activeList, addTaskToList } = useLists();
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Add a task to the active list
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskName || !dueDate || !activeList) return;

    addTaskToList(activeList.id, { title: taskName, dueDate });
    setTaskName("");
    setDueDate("");
  };

  return (
    <div className="p-6 w-full">
      {activeList ? (
        <>
          <h2 className="text-2xl text-black font-bold mb-4">{activeList.emoji} {activeList.name}</h2>
        
          {/* Task Form */}
          <form onSubmit={handleAddTask} className="mb-4">
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Task name..."
              className="p-2 border rounded w-80 text-black"
              required
            />
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="ml-2 p-2 border rounded text-black"
              required
            />
            <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
              Add Task
            </button>
          </form>

          {/* Task List */}
          <div>
            {activeList.tasks.length > 0 ? (
              activeList.tasks.map((task) => <TaskItem key={task.id} task={task} />)
            ) : (
              <p className="text-black  mb-4" >No tasks in this list.</p>
            )}
          </div>
        </>
      ) : (
        <p>Select a list from the sidebar to view tasks.</p>
      )}
    </div>
  );
};

export default ListsView;

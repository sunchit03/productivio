// // app/components/TasksSidebar.jsx
import { useState } from "react";
import { useLists } from "../context/ListsContext";
import { useTasks } from "../context/TasksContext";

const TasksSidebar = ({ setActiveTab }) => {
  const tabs = ["tasks", "lists", "today", "next7days", "completed", "trash"];
  const [hoveredTab, setHoveredTab] = useState(null);
  const [isListsDropdownOpen, setIsListsDropdownOpen] = useState(false);
  const { lists, addList, selectList } = useLists();
  const { addTask } = useTasks(); // Use tasks context
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newList, setNewList] = useState({ name: "", emoji: "📁" });
  const [newTask, setNewTask] = useState({ name: "", dueDate: "" });

  // Open and close list modal
  const openListModal = () => setIsListModalOpen(true);
  const closeListModal = () => setIsListModalOpen(false);

  // Open and close task modal
  const openTaskModal = () => setIsTaskModalOpen(true);
  const closeTaskModal = () => setIsTaskModalOpen(false);

  // Handle new list creation
  const handleAddList = (e) => {
    e.preventDefault();
    if (!newList.name) return;

    addList(newList);
    setNewList({ name: "", emoji: "📁" });
    closeListModal();
  };

  // Handle new task creation
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.name || !newTask.dueDate) return;
  
    // Ensure the task object has a title
    const taskToAdd = {
      title: newTask.name, // Use `title` instead of `name`
      dueDate: newTask.dueDate,
      completed: false, // Default value
    };
  
    addTask(taskToAdd); // Add task to global context
    setNewTask({ name: "", dueDate: "" }); // Reset the form
    closeTaskModal();
  };

  return (
    <div className="w-56 bg-white text-black h-screen p-4">
      <h3 className="text-lg font-bold mb-3">Tasks</h3>
      <ul>
        {tabs.map((tab) => (
          <li key={tab} className="mb-2 flex flex-col relative"
              onMouseEnter={() => setHoveredTab(tab)}
              onMouseLeave={() => setHoveredTab(null)}>
            
            {tab === "tasks" ? (
              <div className="relative w-full">
                <button
                  onClick={() => setActiveTab(tab)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-200 flex justify-between items-center"
                >
                  Tasks
                </button>
                {hoveredTab === "tasks" && (
                  <button
                    onClick={openTaskModal}
                    className="absolute right-3 top-2 text-black bg-white px-2 py-1 rounded-md text-sm transition-opacity duration-200"
                  >
                    +
                  </button>
                )}
              </div>
            ) : tab === "lists" ? (
              <div className="relative w-full">
                <button
                  onClick={() => setIsListsDropdownOpen(!isListsDropdownOpen)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-200 flex justify-between items-center"
                >
                  Lists
                  <span className="ml-2">{isListsDropdownOpen ? "⇧" : "⇩"}</span>
                </button>
                {hoveredTab === "lists" && (
                  <button
                    onClick={openListModal}
                    className="absolute right-3 top-2 text-black bg-white px-2 py-1 rounded-md text-sm transition-opacity duration-200"
                  >
                    +
                  </button>
                )}
                {isListsDropdownOpen && (
                  <div className="bg-white mt-1 p-2 rounded-md">
                    {lists.length > 0 ? (
                      lists.map((list) => (
                        <button
                          key={list.id}
                          onClick={() => {
                            setActiveTab(`list-${list.id}`);
                            selectList(list.id);
                          }}
                          className="block w-full text-left px-3 py-2 hover:bg-gray-200 rounded-md flex items-center"
                        >
                          {list.emoji} <span className="ml-2">{list.name}</span>
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-2 text-gray-400">No lists yet.</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setActiveTab(tab)}
                className="w-full text-left px-3 py-2 hover:bg-gray-200"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Modal for adding a new list */}
      {isListModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-black">Create New List</h2>
            <form onSubmit={handleAddList}>
              <label className="block text-black mb-2">
                List Name:
                <input
                  type="text"
                  value={newList.name}
                  onChange={(e) => setNewList({ ...newList, name: e.target.value })}
                  className="w-full border rounded p-2 text-black mt-1"
                  required
                />
              </label>
              <label className="block text-black mb-2">
                Choose Emoji:
                <select
                  value={newList.emoji}
                  onChange={(e) => setNewList({ ...newList, emoji: e.target.value })}
                  className="w-full border rounded p-2 text-black mt-1"
                >
                  <option>📁</option>
                  <option>🎓</option>
                  <option>📅</option>
                  <option>💼</option>
                  <option>🏠</option>
                </select>
              </label>
              <div className="flex justify-end mt-4">
                <button type="button" onClick={closeListModal} className="mr-2 px-4 py-2 bg-gray-400 text-white rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                  Add List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for adding a new task */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-black">Add New Task</h2>
            <form onSubmit={handleAddTask}>
              <label className="block text-black mb-2">
                Task Name:
                <input
                  type="text"
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  className="w-full border rounded p-2 text-black mt-1"
                  required
                />
              </label>
              <label className="block text-black mb-2">
                Due Date:
                <input
                  type="datetime-local"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full border rounded p-2 text-black mt-1"
                  required
                />
              </label>
              <div className="flex justify-end mt-4">
                <button type="button" onClick={closeTaskModal} className="mr-2 px-4 py-2 bg-gray-400 text-white rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksSidebar;
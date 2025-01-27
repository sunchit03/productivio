
"use client";

import { useState } from "react";
import { FaCalendarAlt, FaInbox, FaList, FaSearch } from "react-icons/fa";

const FeaturesPage = () => {
  const [activeMainTab, setActiveMainTab] = useState("inbox"); // Main Sidebar Tabs
  const [activeInboxTab, setActiveInboxTab] = useState("tasks"); // Inbox Sidebar Tabs
  const [tasks, setTasks] = useState([]); // General tasks
  const [lists, setLists] = useState([]); // Dynamic lists
  const [selectedListId, setSelectedListId] = useState(null); // Currently selected list for tasks
  const [newTask, setNewTask] = useState(""); // Task input field
  const [newListName, setNewListName] = useState(""); // List name input

  // Add a new list
  const handleAddList = () => {
    if (newListName.trim() !== "") {
      const newList = {
        id: Date.now().toString(),
        name: newListName.trim(),
        tasks: [],
      };
      setLists([...lists, newList]);
      setNewListName(""); // Clear input field
    }
  };

  // Add a task to general tasks or a specific list
  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      if (activeInboxTab === "tasks") {
        setTasks([...tasks, { id: Date.now(), title: newTask.trim(), completed: false }]);
      } else if (selectedListId) {
        setLists(
          lists.map((list) =>
            list.id === selectedListId
              ? { ...list, tasks: [...list.tasks, { id: Date.now(), title: newTask.trim(), completed: false }] }
              : list
          )
        );
      }
      setNewTask(""); // Clear input field
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = (listId, taskId) => {
    if (listId) {
      setLists(
        lists.map((list) =>
          list.id === listId
            ? {
                ...list,
                tasks: list.tasks.map((task) =>
                  task.id === taskId ? { ...task, completed: !task.completed } : task
                ),
              }
            : list
        )
      );
    } else {
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
    }
  };

  // Delete a task
  const deleteTask = (listId, taskId) => {
    if (listId) {
      setLists(
        lists.map((list) =>
          list.id === listId
            ? { ...list, tasks: list.tasks.filter((task) => task.id !== taskId) }
            : list
        )
      );
    } else {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  // Render content for the Inbox tab
  const renderInboxContent = () => {
    switch (activeInboxTab) {
      case "tasks":
        return (
          <div className="p-6 text-black">
            <h2 className="text-xl font-bold mb-4">Tasks</h2>
            <div className="flex items-center mb-4">
              <input
                type="text"
                placeholder="Add a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-grow p-2 border rounded mr-2"
              />
              <button
                onClick={handleAddTask}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Task
              </button>
            </div>
            <ul className="space-y-4">
              {tasks.length === 0 ? (
                <p className="text-gray-600">No tasks available. Add one!</p>
              ) : (
                tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between p-4 bg-gray-100 rounded shadow hover:bg-gray-200"
                  >
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => toggleTaskCompletion(null, task.id)}
                        className={`text-lg ${
                          task.completed ? "text-green-500" : "text-gray-500"
                        }`}
                      >
                        ✔
                      </button>
                      <span
                        className={`${
                          task.completed
                            ? "line-through text-gray-500"
                            : "text-black"
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteTask(null, task.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      🗑
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        );
      case "lists":
        return (
          <div className="p-6 text-black">
            <h2 className="text-xl font-bold mb-4">Lists</h2>
            <div className="flex items-center mb-4">
              <input
                type="text"
                placeholder="Add a new list..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="flex-grow p-2 border rounded mr-2"
              />
              <button
                onClick={handleAddList}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add List
              </button>
            </div>
            <ul className="space-y-4">
              {lists.length === 0 ? (
                <p className="text-gray-600">No lists available. Add one!</p>
              ) : (
                lists.map((list) => (
                  <li
                    key={list.id}
                    className={`p-4 bg-gray-100 rounded shadow hover:bg-gray-200 cursor-pointer ${
                      selectedListId === list.id ? "border-l-4 border-blue-500" : ""
                    }`}
                    onClick={() => setSelectedListId(list.id)}
                  >
                    {list.name}
                  </li>
                ))
              )}
            </ul>
            {selectedListId && renderListTasks(selectedListId)}
          </div>
        );
      case "today":
      case "next7days":
        return (
          <div className="p-6 text-black">
            <h2 className="text-xl font-bold mb-4">
              {activeInboxTab === "today" ? "Today" : "Next 7 Days"}
            </h2>
            <p className="text-gray-600">This view is not functional yet.</p>
          </div>
        );
      default:
        return null;
    }
  };

  // Render tasks for the selected list
  const renderListTasks = (listId) => {
    const selectedList = lists.find((list) => list.id === listId);
    if (!selectedList) return null;

    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Tasks for {selectedList.name}</h3>
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-grow p-2 border rounded mr-2"
          />
          <button
            onClick={handleAddTask}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Task
          </button>
        </div>
        <ul className="space-y-4">
          {selectedList.tasks.length === 0 ? (
            <p className="text-gray-600">No tasks in this list. Add one!</p>
          ) : (
            selectedList.tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between p-4 bg-gray-100 rounded shadow hover:bg-gray-200"
              >
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toggleTaskCompletion(listId, task.id)}
                    className={`text-lg ${
                      task.completed ? "text-green-500" : "text-gray-500"
                    }`}
                  >
                    ✔
                  </button>
                  <span
                    className={`${
                      task.completed ? "line-through text-gray-500" : "text-black"
                    }`}
                  >
                    {task.title}
                  </span>
                </div>
                <button
                  onClick={() => deleteTask(listId, task.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  🗑
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Sidebar */}
      <aside className="w-16 bg-gray-200 p-4 flex flex-col items-center space-y-4">
        <button
          className={`p-2 rounded ${
            activeMainTab === "inbox" ? "bg-blue-500 text-white" : "text-black"
          }`}
          onClick={() => setActiveMainTab("inbox")}
        >
          <FaInbox />
        </button>
        <button
          className={`p-2 rounded ${
            activeMainTab === "calendar" ? "bg-blue-500 text-white" : "text-black"
          }`}
          onClick={() => setActiveMainTab("calendar")}
        >
          <FaCalendarAlt />
        </button>
        <button
          className={`p-2 rounded ${
            activeMainTab === "search" ? "bg-blue-500 text-white" : "text-black"
          }`}
          onClick={() => setActiveMainTab("search")}
        >
          <FaSearch />
        </button>
      </aside>

      {/* Inbox Sidebar */}
      {activeMainTab === "inbox" && (
        <aside className="w-64 bg-white shadow-lg p-4 flex flex-col space-y-4">
          <h2 className="text-lg font-bold text-black">Inbox Sidebar</h2>
          <ul className="space-y-2">
            <li
              className={`cursor-pointer p-2 rounded ${
                activeInboxTab === "tasks" ? "bg-gray-200 text-black" : "hover:bg-gray-100 text-black"
              }`}
              onClick={() => setActiveInboxTab("tasks")}
            >
              Tasks
            </li>
            <li
              className={`cursor-pointer p-2 rounded ${
                activeInboxTab === "lists" ? "bg-gray-200 text-black" : "hover:bg-gray-100 text-black"
              }`}
              onClick={() => setActiveInboxTab("lists")}
            >
              Lists
            </li>
            <li
              className={`cursor-pointer p-2 rounded ${
                activeInboxTab === "today" ? "bg-gray-200 text-black" : "hover:bg-gray-100 text-black"
              }`}
              onClick={() => setActiveInboxTab("today")}
            >
              Today
            </li>
            <li
              className={`cursor-pointer p-2 rounded ${
                activeInboxTab === "next7days" ? "bg-gray-200 text-black" : "hover:bg-gray-100 text-black"
              }`}
              onClick={() => setActiveInboxTab("next7days")}
            >
              Next 7 Days
            </li>
          </ul>
        </aside>
      )}

      {/* Dynamic Content */}
      <main className="flex-grow bg-gray-50">{renderInboxContent()}</main>
    </div>
  );
};

export default FeaturesPage;

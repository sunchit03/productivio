// app/dashboard/page.jsx


"use client";

import { useState, useEffect } from "react";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { saveUser } from "../services/users";
import Sidebar from "../components/MainSidebar"; // Import the Sidebar Component
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage"
import TeamsPage from "./teams/page"
import { useRouter } from "next/navigation";

function Dashboard() {
  const { user, error, isLoading } = useUser();

  // State Variables
  const [activeMainTab, setActiveMainTab] = useState(localStorage.getItem("activeTab")); // Main Sidebar Tabs
  const [activeInboxTab, setActiveInboxTab] = useState("tasks"); // Inbox Sidebar Tabs
  const [tasks, setTasks] = useState([]); // General tasks
  const [lists, setLists] = useState([]); // Dynamic lists
  const [selectedListId, setSelectedListId] = useState(null); // Currently selected list for tasks
  const [newTask, setNewTask] = useState(""); // Task input field
  const [newListName, setNewListName] = useState(""); // List name input

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/api/auth/login");
    }
  }, [isLoading, user]);

  useEffect(() => {
    if (localStorage.getItem("activeTab") == "") {
      setActiveMainTab("inbox");
      localStorage.setItem("activeTab", "inbox");
    }
  }, [])

  useEffect(() => {
    async function init() {
      console.log(user);
      const data = await saveUser(user);
      if (data.success) {
        localStorage.setItem("userId", data.user._id);
      }
    }
    if (!isLoading && user) {
      init();
    }
  }, [user, isLoading]);
  

  useEffect(() => {
    if (isLoading) {
        //getUserTasks(user);
    }
  }, [isLoading]);

  // Redirect to login if not authenticated
  if (isLoading) return <Loading />;

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

  // Other task-handling functions like `toggleTaskCompletion` and `deleteTask` would go here...

  // Render content for the Inbox tab
  const renderInboxContent = () => {
    // Similar to your existing code for rendering tasks, lists, etc.
  };

  return (
    <>
      {user && (
        <>
          <div className="flex h-screen bg-gray-100">
          <Sidebar activeMainTab={activeMainTab} setActiveMainTab={setActiveMainTab} user={user} />

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
            <main className="flex-grow bg-gray-50">
              { activeMainTab === "teams" && (
                <TeamsPage/>
              )}
              { activeMainTab === "inbox" && (
                renderInboxContent()
            )}
            </main>
          </div>
        </>
      )}
    </>
  );
}

export default withPageAuthRequired(Dashboard, {
  onRedirecting: () => <Loading />,
  onError: error => <ErrorMessage>{error.message}</ErrorMessage>
});

// app/dashboard/page.jsx


"use client";

import { useState, useEffect } from "react";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { saveUser } from "../services/users";
import MainSidebar from "../components/MainSidebar"; // Import the Sidebar Component
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage"
import TeamsPage from "./teams/page"
import { useRouter } from "next/navigation";
import TaskPage from "./tasks/page";

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
      setActiveMainTab("task");
      localStorage.setItem("activeTab", "task");
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
          <MainSidebar activeMainTab={activeMainTab} setActiveMainTab={setActiveMainTab} user={user} />

            {/* Inbox Sidebar */}
            {activeMainTab === "task" && (
              <TaskPage />
              
            )}


            {/* Dynamic Content */}
            <main className="flex-grow bg-gray-50">
              { activeMainTab === "teams" && (
                <TeamsPage/>
              )}
              {/* { activeMainTab === "task" && (
                renderInboxContent()
              )} */}
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

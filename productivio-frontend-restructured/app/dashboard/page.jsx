// app/dashboard/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { saveUser } from "../services/users";
import MainSidebar from "../components/MainSidebar";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage"
import TeamsPage from "./teams/page"
import { useRouter } from "next/navigation";
import TaskPage from "./tasks/page";
import EisenhowerMatrix from "./eisenhowerMatrix/page";

function Dashboard() {
  const { user, error, isLoading } = useUser();

  // State Variables
  const [userId, setUserId] = useState(null);
  const [activeMainTab, setActiveMainTab] = useState(localStorage.getItem("activeTab")); // Main Sidebar Tabs
  const [taskBarCollapse, setTaskBarCollapse] = useState(false)

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      setActiveMainTab("task");
      localStorage.setItem("", data.user._id);
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
        setUserId(data.user._id);
      }
    }
    if (!isLoading && user) {
      init();
    }
  }, [user, isLoading]);

  if (isLoading) return <Loading />;

  return (
    <>
      {user && (
        <>
          <div className="flex h-screen bg-gray-100">
          <MainSidebar activeMainTab={activeMainTab} setActiveMainTab={setActiveMainTab} user={user} />

            {/* Tasks Page */}
            {activeMainTab === "task" ? (
              <TaskPage taskBarCollapse={taskBarCollapse} setTaskBarCollapse={setTaskBarCollapse} userId={userId}/>       
            ) 
            : 
            /* Calendar Page */
            activeMainTab === "calendar" ? (
              <main className="flex-grow bg-gray-50"></main>
            ) 
            :
            /* Pomodoro Page */
            activeMainTab === "pomodoro" ? (
              <main className="flex-grow bg-gray-50"></main>
            )
            :
            /* Eisenhower Matrix Page */
            activeMainTab === "matrix" ? (
              <main className="flex-grow bg-gray-50">
                <EisenhowerMatrix userId={userId}/>
              </main>
            )
            :
            /* Teams Page */
            activeMainTab === "teams" ? (
              <main className="flex-grow bg-gray-50">
              <TeamsPage/>
              </main>
            )
            :
            <></>
            }
            
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

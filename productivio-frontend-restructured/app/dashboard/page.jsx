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
import PomodoroPage from "@/app/dashboard/pomodoro/page";
import TaskPage from "./tasks/page";

function Dashboard() {
  const { user, error, isLoading } = useUser();

  // State Variables
  const [activeMainTab, setActiveMainTab] = useState(localStorage.getItem("activeTab")); // Main Sidebar Tabs

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


                {/* Dynamic Content */}
                <main className="flex-grow bg-gray-50">
                  { activeMainTab === "teams" && (
                      <TeamsPage/>
                  )}
                  { activeMainTab === "pomodoro" && (
                      <PomodoroPage/>
                  )}
                  { activeMainTab === "inbox" && (
                      renderInboxContent()
                  )}
                </main>
              </div>
            </>
        )}
      </>
            {/* Tasks Page */}
            {activeMainTab === "task" ? (
              <TaskPage />
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
              <main className="flex-grow bg-gray-50"></main>
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

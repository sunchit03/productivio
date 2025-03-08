// app/dashboard/page.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { saveUser } from "../services/users";
import MainSidebar from "../components/MainSidebar";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage"
import TeamsPage from "./teams/page"
import TeamPage from "./teams/team/page"
import { useRouter } from "next/navigation";
import TaskPage from "./tasks/page";
import EisenhowerMatrix from "./eisenhowerMatrix/page";
import CalendarPage from "./Calendar/page";
import { getJWT } from "@/app/utils/auth";

function Dashboard() {
  const { user, error, isLoading } = useUser();

  // State Variables
  const [userId, setUserId] = useState(null);
  const [activeMainTab, setActiveMainTab] = useState(localStorage.getItem("activeTab")); // Main Sidebar Tabs
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [taskBarCollapse, setTaskBarCollapse] = useState(false)
  const [membersSectionCollapse, setMembersSectionCollapse] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      setActiveMainTab("task");
      localStorage.setItem("", data.user._id);
      router.push("/api/auth/login");
    }

    if (typeof window !== "undefined" && window.innerWidth < 639) {
      setTaskBarCollapse(true);
      setMembersSectionCollapse(true);
    }
  }, [isLoading, user]);

  useEffect(() => {
    if (localStorage.getItem("activeTab") == "") {
      setActiveMainTab("task");
      localStorage.setItem("activeTab", "task");
    }
  }, [])

  useEffect(() => {
    const hasRun = useRef(false);
    async function init() {
      if (hasRun.current) return; // Prevent second execution
      hasRun.current = true;

      const token = await getJWT();
      if (!token) {
          console.error("No token available");
          return;
      }

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
          <MainSidebar 
            activeMainTab={activeMainTab} 
            setActiveMainTab={setActiveMainTab} 
            user={user} 
            selectedTeam={selectedTeam} 
            setSelectedTeam={setSelectedTeam}
          />

            {/* Tasks Page */}
            {activeMainTab === "task" ? (
              <TaskPage 
                taskBarCollapse={taskBarCollapse} 
                setTaskBarCollapse={setTaskBarCollapse} 
                user={user} 
                userId={userId}
              />       
            ) 
            : 
            /* Calendar Page */
            activeMainTab === "calendar" ? (
              <main className="flex-grow bg-gray-50">
                <CalendarPage userId={userId}/>
              </main>
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
            activeMainTab === "teams" && !selectedTeam ? (
              <main className="flex-grow bg-gray-50">
              <TeamsPage userId={userId} setSelectedTeam={setSelectedTeam}/>
              </main>
            )
            :
            activeMainTab === "teams" && selectedTeam ? (
              <main className="flex-grow bg-gray-50">
                <TeamPage 
                  selectedTeam={selectedTeam} 
                  setSelectedTeam={setSelectedTeam}
                  userId={userId}
                  membersSectionCollapse={membersSectionCollapse}
                  setMembersSectionCollapse={setMembersSectionCollapse}  
                />
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

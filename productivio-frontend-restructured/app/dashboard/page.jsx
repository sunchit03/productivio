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
import PomodoroPage from "./pomodoro/page";
// Importing StopWatch
import { useStopwatch } from 'react-timer-hook';
function Dashboard() {
  const { user, error, isLoading } = useUser();

  // Reference Variables
  const hasRun = useRef(false);

  // State Variables
  const [userId, setUserId] = useState(null);
  const [activeMainTab, setActiveMainTab] = useState(localStorage.getItem("activeTab")); // Main Sidebar Tabs
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [taskBarCollapse, setTaskBarCollapse] = useState(false)
  const [membersSectionCollapse, setMembersSectionCollapse] = useState(false);
  const stopwatch = useStopwatch({ autoStart: false }); // Initializing the stopwatch once

  // For milliseconds
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef(null);

  useEffect(() => {
    let rafId;

    const update = () => {
      if (stopwatch.isRunning && startTimeRef.current != null) {
        setElapsed(performance.now() - startTimeRef.current);
        rafId = requestAnimationFrame(update);
      }
    };

    if (stopwatch.isRunning) {
      startTimeRef.current = performance.now() - elapsed;
      rafId = requestAnimationFrame(update);
    }

    return () => cancelAnimationFrame(rafId);
  }, [stopwatch.isRunning]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.setElapsed = setElapsed;
      window.startTimeRef = startTimeRef;
    }
  }, []);
  
  // Setting up Laps
  const [laps, setLaps] = useState([]);

  const handleLap = (elapsed, type = "lap") => {
    if (type === "clear") {
      setLaps([]); // clear laps
    } else {
      setLaps((prev) => [...prev, elapsed]); // add a lap
    }
  };
  


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
    async function init() {
      if (hasRun.current) return; // Prevent second execution
      hasRun.current = true;
      
      setActiveMainTab("task");

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
              userId={userId}
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
              <main className="flex-grow bg-gray-50">
                <PomodoroPage userId={userId} stopwatch = {stopwatch} elapsed = {elapsed} laps={laps} handleLap={handleLap}/> 
              </main>
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
                  user={user}
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

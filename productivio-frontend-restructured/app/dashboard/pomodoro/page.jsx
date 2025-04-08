
"use client";
import Timer from "@/app/components/pomodoro/Timer";
import MainSidebar from "@/app/components/MainSidebar";
import SettingsContext from "@/app/components/pomodoro/SettingsContext";
import Overview from "@/app/components/pomodoro/Overview";
import { useState, useEffect } from "react";

export default function PomodoroPage() {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [showSettings, setShowSettings] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState("pomodoro");
  const [pomoCount, setPomoCount] = useState(0);
  // const [isLandscape, setIsLandscape] = useState(false);

  // // Check screen orientation on mount and resize
  // useEffect(() => {
  //   const checkOrientation = () => {
  //     setIsLandscape(window.innerWidth > window.innerHeight);
  //   };

  //   checkOrientation(); // Run once when mounted
  //   window.addEventListener("resize", checkOrientation);

  //   return () => window.removeEventListener("resize", checkOrientation);
  // }, []);

  return (
    <SettingsContext.Provider value={{ workMinutes, breakMinutes, setShowSettings }}>
      <div className="flex h-screen bg-gradient-to-b from-indigo-400/75 to-pink-200">
        {/* Sidebar Section */}
        <div className="w-[50px]">
          <MainSidebar activeMainTab={activeMainTab} setActiveMainTab={setActiveMainTab} />
        </div>

        {/* Middle Content: Timer */}
        <div className="flex flex-1 justify-center items-center">
          <Timer onPomoComplete={() => setPomoCount((prev) => prev + 1)} />
        </div>

        {/* Right Section: Overview - Visible on laptops and in landscape mode on phones */}
        {(/*isLandscape || */(typeof window !== "undefined" && window.innerWidth >= 768)) && (
          <div className="w-1/3 bg-white p-4 shadow-md">
            <Overview pomoCount={pomoCount} />
          </div>
        )}
      </div>
    </SettingsContext.Provider>
  );
}

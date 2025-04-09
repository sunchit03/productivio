"use client";
import Timer from "@/app/components/pomodoro/Timer";
import SettingsContext from "@/app/components/pomodoro/SettingsContext";
import Overview from "@/app/components/pomodoro/Overview";
import { useState, useEffect } from "react";

export default function PomodoroPage({ userId }) {
  const [main, setMain] = useState("pomo");
  const [workMinutes, setWorkMinutes] = useState(2);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [showSettings, setShowSettings] = useState(false);
  const [pomoCount, setPomoCount] = useState(0);
  const [isWideScreen, setIsWideScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth >= 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
      <div>
        <div className="w-full flex h-full px-5 overflow-hidden">
          {/* Middle Content: Timer / Stopwatch */}
          <div className={`${isWideScreen ? "w-3/5" : "w-full"} h-full`}>
            <div className="flex flex-row items-center justify-around my-4">
              <h1 className="ml-1 text-xl text-black font-semibold mb-4 flex-1">
                Pomodoro
              </h1>
              <div className="flex-1 flex justify-evenly">
                <button
                    className={`px-4 py-1 rounded-full bg-gray-100 hover:text-indigo-400 ${
                        main === "pomo"
                            ? "bg-indigo-50 text-indigo-400"
                            : "bg-gray-100 text-black/30"
                    }`}
                    onClick={() => setMain("pomo")}
                >
                  Pomo
                </button>
                <button
                    className={`px-4 py-1 rounded-full bg-gray-100 hover:text-indigo-400 ${
                        main === "stopwatch"
                            ? "bg-indigo-50 text-indigo-400"
                            : "bg-gray-100 text-black/30"
                    }`}
                    onClick={() => setMain("stopwatch")}
                >
                  Stopwatch
                </button>
              </div>
              <div className="flex-1"></div>
            </div>
            <div className="flex flex-1 justify-center items-center">
              {main === "pomo" ? (
                  <Timer
                      onPomoComplete={() => setPomoCount((prev) => prev + 1)}
                      userId={userId}
                  />
              ) : null}
            </div>
          </div>

          {/* Right Section: Overview */}
          {isWideScreen && (
              <div className="relative w-2/5 h-full">
                <div className="absolute w-[1px] h-dvh left-0 z-10 bg-purple-100"></div>
                <div className="w-full h-full pl-2 pt-2 flex flex-col justify-between">
                  <Overview pomoCount={pomoCount} />
                </div>
              </div>
          )}
        </div>
      </div>
  );
}

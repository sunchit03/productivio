"use client";
import { useState, useEffect } from "react";
import Timer from "@/app/components/pomodoro/Timer";
import PomoOverview from "@/app/components/pomodoro/PomoOverview";
import StopwatchOverview from "@/app/components/pomodoro/StopwatchOverview";
import Stopwatch from "@/app/components/pomodoro/Stopwatch";

export default function PomodoroPage({ userId, stopwatch, timer, elapsed, laps, handleLap, pomoStats }) {
  const [main, setMain] = useState('pomo'); // pomo or stopwatch



  return (
    <div className="w-full flex flex-row md:flex-col h-full px-5 md:px-0 overflow-hidden">

      {/* Middle Content: Timer / Stopwatch */}
      <div className="w-3/5 md:w-full h-full md:h-[50%] md:px-5">
        <div className="flex flex-row md:flex-col items-center justify-around my-4">
          <h1 className="ml-1 text-xl text-black font-semibold mb-4 flex-1">Pomodoro</h1>
          <div className="flex-1 flex justify-evenly">
            <button 
              className={`px-4 py-1 rounded-full bg-gray-100 hover:text-indigo-400 ${main === 'pomo' ? "bg-indigo-50 text-indigo-400" : "bg-gray-100 text-black/30"}`}
              onClick={() => setMain('pomo')}
            >
              Pomo
            </button>
            <button 
              className={`px-4 py-1 rounded-full bg-gray-100 hover:text-indigo-400 ${main === 'stopwatch' ? "bg-indigo-50 text-indigo-400" : "bg-gray-100 text-black/30"}`}
              onClick={() => setMain('stopwatch')}
            >
              Stopwatch
            </button>
          </div>
          <div className="flex-1"></div>
        </div>
        <div className="flex flex-1 justify-center items-center">
          {main === 'pomo' ?
            <Timer timer={timer} userId={userId} />
          :
            <Stopwatch {...{ ...stopwatch, elapsed, onLap: handleLap }} />
          }
        </div>
        
      </div>

      {/* Right Section: Overview - Visible on laptops and in landscape mode on phones */}
      <div className="relative w-2/5 md:w-full h-full md:h-[50%]">
        <div className="absolute w-[1px] h-dvh left-0 z-10 bg-purple-100 md:collapse"></div>
        <div className="w-full h-full pl-2 pt-2 flex flex-col justify-between">
          {main === 'pomo' ? 
            <PomoOverview pomoStats={pomoStats} />
          :
            <StopwatchOverview laps={laps} />
          }
        </div>
      </div>
    </div>
  );
}

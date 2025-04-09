import { useState, useEffect, useRef } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import PlayButton from "./PlayButton";
import PauseButton from "./PauseButton";
import StopButton from "./StopButton";
import SettingsModal from "./SettingsModal";
import "@szhsin/react-menu/dist/index.css";
import SettingsButton from "@/app/components/pomodoro/SettingsButton";

export default function Timer({ onPomoComplete, userId, timer }) {
    const [showSettings, setShowSettings] = useState(false);

  if (!timer) return null; // or a loading skeleton / fallback
    
  const {
    isPaused,
    isStopped,
    mode,
    key,
    secondsLeft,
    workMinutes,
    setWorkMinutes,
    breakMinutes,
    setBreakMinutes,
    switchMode,
    onPlay,
    onPause,
    onStop,
  } = timer;

  const [focusSeconds, setFocusSeconds] = useState(0);
    const [breakSeconds, setBreakSeconds] = useState(0);
    const [workAmounts, setWorkAmounts] = useState(0);
    const [breakAmounts, setBreakAmounts] = useState(0);

    const focusSecondsRef = useRef(focusSeconds);
    const breakSecondsRef = useRef(breakSeconds);
    const workAmountsRef = useRef(workAmounts);
    const breakAmountsRef = useRef(breakAmounts);
    const hasStartedRef = useRef(false);
    const startTimeRef = useRef(null);


    async function createSession({ focusSeconds, workAmounts }) {
        try {
            const response = await fetch("/api/pomodoro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    focusSeconds: focusSeconds.current,
                    userId,
                }),
            });

            const data = await response.json();
            console.log(data);
            localStorage.setItem("sessionId", data.session._id);

            console.log("Session Created:", data);
        } catch (error) {
            console.error("Error creating session:", error);
        }
    }

    let totalSeconds = mode === "work" ? workMinutes * 60 : breakMinutes * 60;
    const colors = mode === "work" ? ["#a78bfa", "#2c7a1d"] : ["#2c7a1d", "#8f304e"];

    useEffect(() => {
      totalSeconds = mode === "work" ? workMinutes * 60 : breakMinutes * 60;
    }, [workMinutes, breakMinutes])


  const percentage = Math.round((secondsLeft / totalSeconds) * 100);
  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if (seconds < 10) seconds = "0" + seconds;

  const circleSize = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 767) return 200;
      if (window.innerWidth > 952) return 350;
      return 210;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-[90%]">

      <CountdownCircleTimer
          size={circleSize()}
          strokeWidth={typeof window !== "undefined" && window.innerWidth >= 767 ? 20 : 15}
          key={key}
          isPlaying={!isPaused}
          duration={totalSeconds}
          colors={colors}
          colorsTime={[totalSeconds, 0]}
          onComplete={() => {
              switchMode();
              return { shouldRepeat: false };
          }}
      >
        {({ remainingTime }) => (
          <div className="timer text-indigo-400 text-4xl font-bold">
              {minutes}:{seconds}
          </div>
        )}
      </CountdownCircleTimer>

      <p className="mt-3 text-lg font-semibold" style={{ color: colors[0] }}>
        {mode === "work" ? "Work Time" : "Break Time"}
      </p>

      <div className="flex justify-center items-center gap-4 mt-5">
          {isStopped && isPaused &&
            <>
              <PlayButton onClick={onPlay} />
              <SettingsButton onClick={() => setShowSettings(true)}/>
            </>
          }

          {!isPaused && 
            <PauseButton onClick={onPause} />
          }

          {isPaused && !isStopped &&
            <>
              <PlayButton onClick={onPlay} />

              <StopButton 
                onClick={() => {
                  const now = Date.now();
                  const elapsedMs = now - startTimeRef.current;
                  const elapsedSec = Math.floor(elapsedMs / 1000);
                  startTimeRef.current = Date.now();
                  onStop()
                }} 
              />
            </>
          }
      </div>
        
        {showSettings && (
          <SettingsModal 
            workMinutes={workMinutes}
            setWorkMinutes={setWorkMinutes}
            breakMinutes={breakMinutes}
            setBreakMinutes={setBreakMinutes}
            closeModal={() => setShowSettings(false)} 
          />
        )}

    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import PlayButton from "./PlayButton";
import PauseButton from "./PauseButton";
import StopButton from "./StopButton";
import SettingsModal from "./SettingsModal";
import "@szhsin/react-menu/dist/index.css";
import SettingsButton from "@/app/components/pomodoro/SettingsButton";

export default function Timer({ onPomoComplete, userId, timer }) {
    // const [workMinutes, setWorkMinutes] = useState(25);
    // const [breakMinutes, setBreakMinutes] = useState(5);
    const [showSettings, setShowSettings] = useState(false);

    if (!timer) return null; // or a loading skeleton / fallback
    
  const {
    isPaused,
    mode,
    key,
    secondsLeft,
    workMinutes,
    breakMinutes,
    onPlay,
    onPause,
    onStop,
  } = timer;

  const [focusSeconds, setFocusSeconds] = useState(0);
    const [breakSeconds, setBreakSeconds] = useState(0);
    const [workAmounts, setWorkAmounts] = useState(0);
    const [breakAmounts, setBreakAmounts] = useState(0);

    const secondsLeftRef = useRef(secondsLeft);
    const focusSecondsRef = useRef(focusSeconds);
    const breakSecondsRef = useRef(breakSeconds);
    const workAmountsRef = useRef(workAmounts);
    const breakAmountsRef = useRef(breakAmounts);
    const isPausedRef = useRef(isPaused);
    const modeRef = useRef(mode);
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
                    currentMode: "work",
                    focusSeconds: focusSeconds.current,
                    assignedUser: userId,
                    workAmounts: workAmounts.current,
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

    const totalSeconds = mode === "work" ? workMinutes * 60 : breakMinutes * 60;
    const colors = mode === "work" ? ["#8f304e", "#2c7a1d"] : ["#2c7a1d", "#8f304e"];


  const percentage = Math.round((secondsLeft / totalSeconds) * 100);
  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if (seconds < 10) seconds = "0" + seconds;

  return (
    <div className="flex flex-col items-center justify-center h-[90vh]">
      {/* <CircularProgressbar
        key={keyId}
        value={percentage}
        text={`${minutes}:${seconds}`}
        styles={buildStyles({
          textColor: "#3c1361",
          pathColor: mode === "work" ? workColors : breakColors,
          tailColor: "rgba(255,255,255,.2)",
        })}
      /> */}

        <CountdownCircleTimer
            size={350}
            strokeWidth={40}
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

      {/* <p
        className="mt-3 text-lg font-semibold"
        style={{ color: mode === "work" ? workColors : breakColors }}
      >
        {mode === "work" ? "Work Time" : "Break Time"}
      </p> */}

      <p className="mt-3 text-lg font-semibold" style={{ color: colors[0] }}>
        {mode === "work" ? "Work Time" : "Break Time"}
    </p>

      <div className="flex justify-center items-center gap-4 mt-5">
        {isPaused ? (
          <PlayButton onClick={onPlay} />
        ) : (
          <PauseButton onClick={onPause} />
        )}
        <StopButton onClick={onStop} />
      </div>

        <div className="flex justify-center items-center gap-4 mt-5">
            {isPaused ? (
                <PlayButton onClick={() => {
                    if (!hasStartedRef.current) {
                        createSession();
                        hasStartedRef.current = true;
                    }
                    startTimeRef.current = Date.now();
                    onPlay()
                }} />
            ) : (
                <PauseButton onClick={() =>{
                    const now = Date.now();
                    onPause()
                    const elapsedMs = now - startTimeRef.current;
                    const elapsedSec = Math.floor(elapsedMs / 1000);
                    //setIsPaused(true)
                    startTimeRef.current = Date.now();
                    // stopSession({
                    //     focusSeconds: modeRef.current === "work" ? elapsedSec : 0,
                    //     breakSeconds: modeRef.current === "break" ? elapsedSec : 0
                    // });
                }}/>
            )}
            <StopButton onClick={() => {
                const now = Date.now();
                const elapsedMs = now - startTimeRef.current;
                const elapsedSec = Math.floor(elapsedMs / 1000);
                setIsPaused(true)
                startTimeRef.current = Date.now();

                createSession({
                    focusSeconds: modeRef.current === "work" ? elapsedSec : 0,
                    workAmounts: modeRef.current === "work" ? 1 : 0,
                });
            
                onStop()
                // setIsPaused(true);
                // setMode("work");
                // modeRef.current = "work";
                // setSecondsLeft(workMinutes * 60);
                // setKey((prevKey) => prevKey + 1);
            }} />


            <SettingsButton onClick={() => setShowSettings(true)}/>
        </div>
        
        {showSettings && (
        <SettingsModal closeModal={() => setShowSettings(false)} />
        )}

    </div>
  );
}

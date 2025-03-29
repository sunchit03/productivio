import { useContext, useState, useEffect, useRef } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import PlayButton from "./PlayButton";
import PauseButton from "./PauseButton";
import StopButton from "./StopButton";
import SettingsModal from "./SettingsModal";
import SettingsContext from "./SettingsContext";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import SettingsButton from "@/app/components/pomodoro/SettingsButton";

export default function Timer({ onPomoComplete }) {
    // Store settings state inside context
    const [workMinutes, setWorkMinutes] = useState(25);
    const [breakMinutes, setBreakMinutes] = useState(5);
    const [showSettings, setShowSettings] = useState(false);

    const [isPaused, setIsPaused] = useState(true);
    const [mode, setMode] = useState("work");
    const [key, setKey] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState(workMinutes * 60);
    const [sessionId, setSessionId] = useState(null); // Store session ID

    const secondsLeftRef = useRef(secondsLeft);
    const isPausedRef = useRef(isPaused);
    const modeRef = useRef(mode);
    const hasStartedRef = useRef(false);


    async function createSession(userId) {
        try {
            const response = await fetch("/api/pomodoro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentMode: "work",
                    focusSeconds: 0,
                    breakSeconds: 0,
                    assignedUser: localStorage.getItem("userId"),
                    workAmounts: 0,
                    breakAmounts: 0,
                }),
            });

            const data = await response.json();
            console.log("Session Created:", data);
        } catch (error) {
            console.error("Error creating session:", error);
        }
    }



    useEffect(() => {
        secondsLeftRef.current = workMinutes * 60;
        setSecondsLeft(secondsLeftRef.current);

        const interval = setInterval(() => {
            if (!isPausedRef.current) {
                tick();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [workMinutes, breakMinutes]);

    function tick() {
        if (secondsLeftRef.current > 0) {
            secondsLeftRef.current--;
            setSecondsLeft(secondsLeftRef.current);
        } else {
            switchMode();
        }
    }

    function switchMode() {
        const nextMode = modeRef.current === "work" ? "break" : "work";
        const nextSeconds = (nextMode === "work" ? workMinutes : breakMinutes) * 60;

        setMode(nextMode);
        modeRef.current = nextMode;
        setSecondsLeft(nextSeconds);
        secondsLeftRef.current = nextSeconds;
        setKey((prevKey) => prevKey + 1);

        if (nextMode === "break") {
            onPomoComplete();
        }
    }

    const totalSeconds = mode === "work" ? workMinutes * 60 : breakMinutes * 60;
    const colors = mode === "work" ? ["#A5B4FC", "#F2C8E0"] : ["#F2C8E0", "#A5B4FC"];

    return (
        <SettingsContext.Provider value={{
            workMinutes,
            breakMinutes,
            setWorkMinutes,
            setBreakMinutes
        }}>
            <div className="flex justify-center items-center overflow-hidden">
                <div className="w-1/3 h-1/3 flex flex-col items-center">
                    <CountdownCircleTimer
                        size={500}
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
                                {Math.floor(remainingTime / 60)}:{remainingTime % 60 < 10 ? "0" : ""}
                                {remainingTime % 60}
                            </div>
                        )}
                    </CountdownCircleTimer>

                    <p className="mt-3 text-lg font-semibold" style={{ color: colors[0] }}>
                        {mode === "work" ? "Work Time" : "Break Time"}
                    </p>

                    <div className="flex justify-center items-center gap-4 mt-5">
                        {isPaused ? (
                            <PlayButton onClick={() => {
                                if (!hasStartedRef.current) {
                                    createSession(); // Create session on first play
                                    hasStartedRef.current = true;
                                }
                                setIsPaused(false);
                            }} />
                        ) : (
                            <PauseButton onClick={() => setIsPaused(true)} />
                        )}
                        <StopButton onClick={() => {
                            setIsPaused(true);
                            isPausedRef.current = true;
                            setMode("work");
                            modeRef.current = "work";
                            setSecondsLeft(workMinutes * 60);
                            secondsLeftRef.current = workMinutes * 60;
                            setKey((prevKey) => prevKey + 1);
                        }}/>

                        <SettingsButton onClick={() => setShowSettings(true)}/>
                    </div>
                </div>

                {showSettings && (
                    <SettingsModal closeModal={() => setShowSettings(false)} />
                )}
            </div>
        </SettingsContext.Provider>
    );
}

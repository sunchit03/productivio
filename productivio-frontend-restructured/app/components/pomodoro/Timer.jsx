import { useState, useEffect, useRef } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import PlayButton from "./PlayButton";
import PauseButton from "./PauseButton";
import StopButton from "./StopButton";
import SettingsModal from "./SettingsModal";
import "@szhsin/react-menu/dist/index.css";
import SettingsButton from "@/app/components/pomodoro/SettingsButton";

export default function Timer({ onPomoComplete, userId }) {
    const [workMinutes, setWorkMinutes] = useState(25);
    const [breakMinutes, setBreakMinutes] = useState(5);
    const [showSettings, setShowSettings] = useState(false);

    const [isPaused, setIsPaused] = useState(true);
    const [mode, setMode] = useState("work");
    const [key, setKey] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState(workMinutes * 60);
    const [sessionId, setSessionId] = useState(null);
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

    async function loadPreviousSession() {
        const storedSessionId = localStorage.getItem("sessionId");
        if (!storedSessionId) return;

        try {
            const response = await fetch(`/api/pomodoro?sessionId=${storedSessionId}`);
            const data = await response.json();

            if (data?.session) {
                focusSecondsRef.current = data.session.focusSeconds || 0;
                breakSecondsRef.current = data.session.breakSeconds || 0;
                workAmountsRef.current = data.session.workAmounts || 0;
                breakAmountsRef.current = data.session.breakAmounts || 0;

                setFocusSeconds(focusSecondsRef.current);
                setBreakSeconds(breakSecondsRef.current);
                setWorkAmounts(workAmountsRef.current);
            }
        } catch (error) {
            console.error("Error loading previous session:", error);
        }
    }


    async function createSession() {
        try {
            const response = await fetch("/api/pomodoro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentMode: "work",
                    focusSeconds: focusSeconds.current,
                    breakSeconds: breakSeconds.current,
                    assignedUser: userId,
                    workAmounts: workAmounts.current,
                    breakAmounts: breakAmounts.current,
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

    async function stopSession({ focusSeconds, breakSeconds, workAmounts=0, breakAmounts=0 }) {
        try {
            const response = await fetch("/api/pomodoro", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sessionId: localStorage.getItem("sessionId"),
                    currentMode: modeRef.current,
                    focusSeconds,
                    breakSeconds,
                    workAmounts,
                    breakAmounts,
                }),
            });

            const data = await response.json();
            console.log("Session Updated:", data);
        } catch (error) {
            console.error("Error updating session:", error);
        }
    }


    useEffect(() => {
        loadPreviousSession();
    }, []);


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

            if (modeRef.current === "work") {
                focusSecondsRef.current++;
                setFocusSeconds(focusSecondsRef.current);
            } else {
                breakSecondsRef.current++;
                setBreakSeconds(breakSecondsRef.current);
            }
        } else {
            switchMode();
        }
    }


    function switchMode() {
        const nextMode = modeRef.current === "work" ? "break" : "work";
        const nextSeconds = (nextMode === "work" ? workMinutes : breakMinutes) * 60;if (modeRef.current === "work") {

            const updatedWork = workAmountsRef.current + 1;
            setWorkAmounts(updatedWork);
            workAmountsRef.current = updatedWork;

            console.log(workAmountsRef.current)
        } else {

            const updatedBreakCount = breakAmountsRef.current + 1;
            setBreakAmounts(updatedBreakCount);
            breakAmountsRef.current = updatedBreakCount;
        }

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
    const colors = mode === "work" ? ["#8f304e", "#2c7a1d"] : ["#2c7a1d", "#8f304e"];

    return (
        <div value={{
            workMinutes,
            breakMinutes,
            setWorkMinutes,
            setBreakMinutes
        }}>
            <div className="flex justify-center items-center overflow-hidden">
                <div className="w-1/3 h-1/3 flex flex-col items-center">
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
                                    createSession();
                                    hasStartedRef.current = true;
                                }
                                startTimeRef.current = Date.now();
                                setIsPaused(false);
                            }} />
                        ) : (
                            <PauseButton onClick={() =>{
                                const now = Date.now();
                                const elapsedMs = now - startTimeRef.current;
                                const elapsedSec = Math.floor(elapsedMs / 1000);
                                setIsPaused(true)
                                startTimeRef.current = Date.now();
                                stopSession({
                                    focusSeconds: modeRef.current === "work" ? elapsedSec : 0,
                                    breakSeconds: modeRef.current === "break" ? elapsedSec : 0
                                });
                            }}/>
                        )}
                        <StopButton onClick={() => {
                            const now = Date.now();
                            const elapsedMs = now - startTimeRef.current;
                            const elapsedSec = Math.floor(elapsedMs / 1000);
                            setIsPaused(true)
                            startTimeRef.current = Date.now();

                            stopSession({
                                focusSeconds: modeRef.current === "work" ? elapsedSec : 0,
                                breakSeconds: modeRef.current === "break" ? elapsedSec : 0,
                                workAmounts: modeRef.current === "work" ? 1 : 0,
                                breakAmounts: modeRef.current === "break" ? 1 : 0,
                            });

                            setIsPaused(true);
                            setMode("work");
                            modeRef.current = "work";
                            setSecondsLeft(workMinutes * 60);
                            setKey((prevKey) => prevKey + 1);
                        }} />


                        <SettingsButton onClick={() => setShowSettings(true)}/>
                    </div>
                </div>

                {showSettings && (
                    <SettingsModal closeModal={() => setShowSettings(false)} />
                )}
            </div>
        </div>
    );
}

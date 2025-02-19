"use client"
import Timer from "../../components/Pomodoro/Timer";
import Settings from "../../components/Pomodoro/Settings";
import { useState } from "react";
import SettingsContext from "../../components/Pomodoro/SettingsContext";

export default function PomodoroPage() {
    const [showSettings, setShowSettings] = useState(false);
    const [workMinutes, setWorkMinutes] = useState(45);
    const [breakMinutes, setBreakMinutes] = useState(15);

    return (
        <div className="flex h-screen">
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-2xl font-bold mb-4 text-indigo-300 text-center">Pomodoro Timer</h1>
                <SettingsContext.Provider value={{
                    showSettings,
                    setShowSettings,
                    workMinutes,
                    breakMinutes,
                    setWorkMinutes,
                    setBreakMinutes,
                }}>
                    {showSettings ? <Settings/> : <Timer/>}
                </SettingsContext.Provider>
            </div>

            <div className="md:w-96 border-l border-gray-300 bg-gray-100 resize-x overflow-auto">
            </div>
        </div>
    );
}

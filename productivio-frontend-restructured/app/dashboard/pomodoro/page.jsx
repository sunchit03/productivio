import Timer from "../../components/Pomodoro/Timer";
import Settings from "../../components/Pomodoro/Settings";
import {useState} from "react";
import SettingsContext from "../../components/Pomodoro/SettingsContext";
import TeamCard from "@/app/components/Teams/TeamCard";
import {FaPlus} from "react-icons/fa";
import CreateTeam from "@/app/components/Teams/CreateTeam";

export default function PomodoroPage() {

    const [showSettings, setShowSettings] = useState(false);
    const [workMinutes, setWorkMinutes] = useState(45);
    const [breakMinutes, setBreakMinutes] = useState(15);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4 text-black">Pomodoro Timer</h1>
            <div>
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
        </div>
    );
}

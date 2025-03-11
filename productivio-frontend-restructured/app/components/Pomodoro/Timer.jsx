import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import PlayButton from "./PlayButton";
import PauseButton from "./PauseButton";
import SettingsButton from "./SettingsButton";
import StopButton from "./StopButton";
import { useContext, useState } from "react";
import SettingsContext from "./SettingsContext";

//const workColors = ["#8B0000", "#B22222", "#DC143C", "#FF9999"]; // Dark red to pale red
//const breakColors = ["#BDFCC9", "#32CD32", "#228B22", "#006400"]; // Pale green to dark green

const workColors = ["#A5B4FC", "#F2C8E0"];
const breakColors = ["#F2C8E0", "#A5B4FC"];

const renderTime = ({ remainingTime }) => {
    const minutes = Math.floor(remainingTime / 60);
    let seconds = remainingTime % 60;
    if (seconds < 10) seconds = '0' + seconds;
    return (
        <div className="timer text-indigo-400 text-4xl font-bold">
            <div className="value">{minutes}:{seconds}</div>
        </div>
    );
};

export default function Timer() {
    const settingsInfo = useContext(SettingsContext);
    const [isPaused, setIsPaused] = useState(true);
    const [mode, setMode] = useState('work');
    const [key, setKey] = useState(0);

    const totalSeconds = mode === 'work'
        ? settingsInfo.workMinutes * 60
        : settingsInfo.breakMinutes * 60;

    const colors = mode === 'work' ? workColors : breakColors;

    const switchMode = () => {
        setMode(prevMode => prevMode === 'work' ? 'break' : 'work');
        setKey(prevKey => prevKey + 1); // Reset timer with a new key
    };

    return (
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
                    {renderTime}
                </CountdownCircleTimer>

                <p className="mt-3 text-lg font-semibold" style={{ color: colors[0] }}>
                    {mode === 'work' ? "Work Time" : "Break Time"}
                </p>

                <div className="flex justify-center items-center gap-4 mt-5">
                    {isPaused ? (
                        <PlayButton onClick={() => setIsPaused(false)} />
                    ) : (
                        <PauseButton onClick={() => setIsPaused(true)} />
                    )}
                    <StopButton onClick={() => {
                        setIsPaused(true);
                        setMode("work");
                        setKey(prevKey => prevKey + 1); // Reset timer
                    }}/>
                    <SettingsButton onClick={() => settingsInfo.setShowSettings(true)}/>
                </div>
            </div>
        </div>
    );
}

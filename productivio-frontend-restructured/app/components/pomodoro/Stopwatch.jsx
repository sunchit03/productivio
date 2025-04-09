import { useRef, useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Stopwatch({ seconds, minutes, hours, isRunning, start, pause, reset, elapsed, onLap }) {
  const strokeWidth = 14; // Balanced thickness
  const cycleDuration = 60;

  const displayMinutes = Math.floor((elapsed % 3600000) / 60000);
  const displaySeconds = Math.floor((elapsed % 60000) / 1000);
  const milliseconds = (() => {
    const ms = Math.floor((elapsed % 1000) / 10);
    return ms < 10 ? `0${ms}` : `${ms}`;
  })();

  const computedPercentage = ((minutes * 60 + seconds) % cycleDuration) / cycleDuration * 100;

  const [progressValue, setProgressValue] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);

  const prevSeconds = useRef(seconds);

  useEffect(() => {
    if (prevSeconds.current > seconds) {
      setCycleKey(prev => prev + 1);
    }
    prevSeconds.current = seconds;
    setProgressValue(computedPercentage);
  }, [seconds, computedPercentage]);

  return (
    <div className="flex flex-col items-center justify-center h-[90vh] w-full py-0">
      {/* Slightly bigger but not huge */}
      <div className="relative w-full max-w-[24rem] sm:max-w-[32rem] aspect-square transition-all duration-500">
        <CircularProgressbar
          key={cycleKey}
          value={progressValue}
          strokeWidth={strokeWidth}
          styles={buildStyles({
            pathColor: "#a78bfa",
            trailColor: "#ddd6f3",
            textColor: "#1f2937",
            pathTransitionDuration: 0.5,
          })}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl sm:text-5xl font-semibold text-gray-800 tabular-nums text-center">
            {hours > 0 ? `${String(hours).padStart(2, '0')}:` : ''}
            {String(displayMinutes).padStart(2, '0')}:
            {String(displaySeconds).padStart(2, '0')}.{milliseconds}
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-4 justify-center">
        {!isRunning && (minutes * 60 + seconds) === 0 && (
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-2 rounded-full shadow-lg transition duration-200 ease-in-out"
            onClick={() => {
              onLap(null, "clear");
              start();
            }}
          >
            Start
          </button>
        )}

        {isRunning && (
          <button
            className="bg-purple-400 hover:bg-purple-500 text-white px-8 py-2 rounded-full shadow-lg"
            onClick={() => onLap(elapsed)}
          >
            Lap
          </button>
        )}

        {isRunning && (
          <button
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-2 rounded-full shadow-lg transition duration-200 ease-in-out"
            onClick={pause}
          >
            Pause
          </button>
        )}

        {!isRunning && (minutes * 60 + seconds) > 0 && (
          <>
            <button
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-2 rounded-full shadow-lg transition duration-200 ease-in-out"
              onClick={start}
            >
              Continue
            </button>
            <button
              className="border border-purple-400 text-purple-400 hover:bg-purple-50 px-8 py-2 rounded-full shadow-md transition duration-200 ease-in-out"
              onClick={() => {
                reset(0, false);
                if (typeof window !== 'undefined' && window.setElapsed && window.startTimeRef) {
                  window.setElapsed(0);
                  window.startTimeRef.current = null;
                }
                setProgressValue(0);
                setCycleKey(prev => prev + 1);
              }}
            >
              End
            </button>
          </>
        )}
      </div>
    </div>
  );
}

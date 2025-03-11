// "use client";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";
// import PlayButton from "./PlayButton";
// import PauseButton from "./PauseButton";
// import StopButton from "./StopButton";
// import { useContext, useState, useEffect, useRef } from "react";
// import SettingsContext from "./SettingsContext";

// const red = "#d67d97";
// const green = "#bfd69d";

// export default function Timer() {
//   const settingsInfo = useContext(SettingsContext);
//   const [isPaused, setIsPaused] = useState(true);
//   const [mode, setMode] = useState("work"); // work/break/null
//   const [secondsLeft, setSecondsLeft] = useState(settingsInfo.workMinutes * 60);

//   const secondsLeftRef = useRef(secondsLeft);
//   const isPausedRef = useRef(isPaused);
//   const modeRef = useRef(mode);

//   function tick() {
//     if (secondsLeftRef.current > 0) {
//       secondsLeftRef.current--;
//       setSecondsLeft(secondsLeftRef.current);
//     } else {
//       switchMode();
//     }
//   }

//   function switchMode() {
//     const nextMode = modeRef.current === "work" ? "break" : "work";
//     const nextSeconds =
//       (nextMode === "work" ? settingsInfo.workMinutes : settingsInfo.breakMinutes) * 60;

//     setMode(nextMode);
//     modeRef.current = nextMode;

//     setSecondsLeft(nextSeconds);
//     secondsLeftRef.current = nextSeconds;
//   }

//   useEffect(() => {
//     secondsLeftRef.current = settingsInfo.workMinutes * 60;
//     setSecondsLeft(secondsLeftRef.current);

//     const interval = setInterval(() => {
//       if (!isPausedRef.current) {
//         tick();
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [settingsInfo]);

//   const totalSeconds =
//     mode === "work" ? settingsInfo.workMinutes * 60 : settingsInfo.breakMinutes * 60;
//   const percentage = Math.round((secondsLeft / totalSeconds) * 100);

//   const minutes = Math.floor(secondsLeft / 60);
//   let seconds = secondsLeft % 60;
//   if (seconds < 10) seconds = "0" + seconds;

//   return (
//     <div className="flex flex-col items-center justify-center h-full">
//       <CircularProgressbar
//         value={percentage}
//         text={`${minutes}:${seconds}`}
//         styles={buildStyles({
//           textColor: "#a5b3fa",
//           pathColor: mode === "work" ? red : green,
//           tailColor: "rgba(255,255,255,.2)",
//         })}
//       />
//       <p className="mt-3 text-lg font-semibold" style={{ color: mode === "work" ? red : green }}>
//         {mode === "work" ? "Work Time" : "Break Time"}
//       </p>

//       {/* Buttons aligned horizontally */}
//       <div className="flex justify-center items-center gap-4 mt-5">
//         {isPaused ? (
//           <PlayButton
//             onClick={() => {
//               setIsPaused(false);
//               isPausedRef.current = false;
//             }}
//           />
//         ) : (
//           <PauseButton
//             onClick={() => {
//               setIsPaused(true);
//               isPausedRef.current = true;
//             }}
//           />
//         )}
//         <StopButton
//           onClick={() => {
//             setIsPaused(true);
//             isPausedRef.current = true;
//             setMode("work");
//             modeRef.current = "work";
//             setSecondsLeft(settingsInfo.workMinutes * 60);
//             secondsLeftRef.current = settingsInfo.workMinutes * 60;
//           }}
//         />
//       </div>
//     </div>
//   );
// }
// "use client";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";
// import PlayButton from "./PlayButton";
// import PauseButton from "./PauseButton";
// import StopButton from "./StopButton";
// import { useContext, useState, useEffect, useRef } from "react";
// import SettingsContext from "./SettingsContext";

// const red = "#d67d97";
// const green = "#bfd69d";

// export default function Timer({ onPomoComplete }) {
//   const settingsInfo = useContext(SettingsContext);

//   // Timer State
//   const [isPaused, setIsPaused] = useState(true);
//   const [mode, setMode] = useState("work"); // work/break
//   const [secondsLeft, setSecondsLeft] = useState(settingsInfo.workMinutes * 60);

//   // Refs for Real-time Updates
//   const secondsLeftRef = useRef(secondsLeft);
//   const isPausedRef = useRef(isPaused);
//   const modeRef = useRef(mode);

//   useEffect(() => {
//     // Function to Switch Modes (Work ⇄ Break)
//     function switchMode() {
//       const nextMode = modeRef.current === "work" ? "break" : "work";
//       const nextSeconds = (nextMode === "work" ? settingsInfo.workMinutes : settingsInfo.breakMinutes) * 60;

//       setMode(nextMode);
//       modeRef.current = nextMode;

//       setSecondsLeft(nextSeconds);
//       secondsLeftRef.current = nextSeconds;

//       // Notify that a Pomodoro session is complete
//       if (nextMode === "break") {
//         onPomoComplete();
//       }
//     }

//     // Timer Function
//     function tick() {
//       if (secondsLeftRef.current > 0) {
//         secondsLeftRef.current--;
//         setSecondsLeft(secondsLeftRef.current);
//       } else {
//         switchMode();
//       }
//     }

//     // Start Interval
//     const interval = setInterval(() => {
//       if (!isPausedRef.current) {
//         tick();
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [settingsInfo]);

//   // Formatting Time
//   const totalSeconds = mode === "work" ? settingsInfo.workMinutes * 60 : settingsInfo.breakMinutes * 60;
//   const percentage = Math.round((secondsLeft / totalSeconds) * 100);
//   const minutes = Math.floor(secondsLeft / 60);
//   let seconds = secondsLeft % 60;
//   if (seconds < 10) seconds = "0" + seconds;

//   return (
//     <div className="flex flex-col items-center justify-center h-full">
//       <CircularProgressbar
//         value={percentage}
//         text={`${minutes}:${seconds}`}
//         styles={buildStyles({
//           textColor: "#a5b3fa",
//           pathColor: mode === "work" ? red : green,
//           tailColor: "rgba(255,255,255,.2)",
//         })}
//       />
//       <p className="mt-3 text-lg font-semibold" style={{ color: mode === "work" ? red : green }}>
//         {mode === "work" ? "Work Time" : "Break Time"}
//       </p>

//       {/* Buttons */}
//       <div className="flex justify-center items-center gap-4 mt-5">
//         {isPaused ? (
//           <PlayButton
//             onClick={() => {
//               setIsPaused(false);
//               isPausedRef.current = false;
//             }}
//           />
//         ) : (
//           <PauseButton
//             onClick={() => {
//               setIsPaused(true);
//               isPausedRef.current = true;
//             }}
//           />
//         )}
//         <StopButton
//           onClick={() => {
//             setIsPaused(true);
//             isPausedRef.current = true;
//             setMode("work");
//             modeRef.current = "work";
//             setSecondsLeft(settingsInfo.workMinutes * 60);
//             secondsLeftRef.current = settingsInfo.workMinutes * 60;
//           }}
//         />
//       </div>
//     </div>
//   );
// }
"use client";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import PlayButton from "./PlayButton";
import PauseButton from "./PauseButton";
import StopButton from "./StopButton";
import { useContext, useState, useEffect, useRef } from "react";
import SettingsContext from "./SettingsContext";

const red = "#d67d97";
const green = "#bfd69d";

export default function Timer({ onPomoComplete }) {
  const settingsInfo = useContext(SettingsContext);
  const [isPaused, setIsPaused] = useState(true);
  const [mode, setMode] = useState("work"); // work/break/null
  const [secondsLeft, setSecondsLeft] = useState(settingsInfo.workMinutes * 60);

  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);

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
    const nextSeconds =
      (nextMode === "work" ? settingsInfo.workMinutes : settingsInfo.breakMinutes) * 60;

    setMode(nextMode);
    modeRef.current = nextMode;

    setSecondsLeft(nextSeconds);
    secondsLeftRef.current = nextSeconds;

    // When a Pomodoro session completes, notify the parent component
    if (nextMode === "break") {
      onPomoComplete();
    }
  }

  useEffect(() => {
    secondsLeftRef.current = settingsInfo.workMinutes * 60;
    setSecondsLeft(secondsLeftRef.current);

    const interval = setInterval(() => {
      if (!isPausedRef.current) {
        tick();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [settingsInfo]);

  const totalSeconds =
    mode === "work" ? settingsInfo.workMinutes * 60 : settingsInfo.breakMinutes * 60;
  const percentage = Math.round((secondsLeft / totalSeconds) * 100);

  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if (seconds < 10) seconds = "0" + seconds;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <CircularProgressbar
        value={percentage}
        text={`${minutes}:${seconds}`}
        styles={buildStyles({
          textColor: "#a5b3fa",
          pathColor: mode === "work" ? red : green,
          tailColor: "rgba(255,255,255,.2)",
        })}
      />
      <p className="mt-3 text-lg font-semibold" style={{ color: mode === "work" ? red : green }}>
        {mode === "work" ? "Work Time" : "Break Time"}
      </p>

      {/* Buttons aligned horizontally */}
      <div className="flex justify-center items-center gap-4 mt-5">
        {isPaused ? (
          <PlayButton
            onClick={() => {
              setIsPaused(false);
              isPausedRef.current = false;
            }}
          />
        ) : (
          <PauseButton
            onClick={() => {
              setIsPaused(true);
              isPausedRef.current = true;
            }}
          />
        )}
        <StopButton
          onClick={() => {
            setIsPaused(true);
            isPausedRef.current = true;
            setMode("work");
            modeRef.current = "work";
            setSecondsLeft(settingsInfo.workMinutes * 60);
            secondsLeftRef.current = settingsInfo.workMinutes * 60;
          }}
        />
      </div>
    </div>
  );
}

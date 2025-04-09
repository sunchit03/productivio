import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import PlayButton from "./PlayButton";
import PauseButton from "./PauseButton";
import StopButton from "./StopButton";

const workColors = "#d67d97";
const breakColors = "#bfd69d";

export default function Timer({ timer }) {
  const {
    isPaused,
    mode,
    keyId,
    secondsLeft,
    workMinutes,
    breakMinutes,
    onPlay,
    onPause,
    onStop,
  } = timer;

  const totalSeconds = mode === "work" ? workMinutes * 60 : breakMinutes * 60;
  const percentage = Math.round((secondsLeft / totalSeconds) * 100);
  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if (seconds < 10) seconds = "0" + seconds;

  return (
    <div className="flex flex-col items-center justify-center h-[90vh]">
      <CircularProgressbar
        key={keyId}
        value={percentage}
        text={`${minutes}:${seconds}`}
        styles={buildStyles({
          textColor: "#3c1361",
          pathColor: mode === "work" ? workColors : breakColors,
          tailColor: "rgba(255,255,255,.2)",
        })}
      />
      <p
        className="mt-3 text-lg font-semibold"
        style={{ color: mode === "work" ? workColors : breakColors }}
      >
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
    </div>
  );
}

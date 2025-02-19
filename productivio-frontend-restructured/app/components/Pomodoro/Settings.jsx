import SettingsContext from "./SettingsContext";
import { useContext } from "react";
import BackButton from "./BackButton";

export default function Settings() {
    const settingsInfo = useContext(SettingsContext);

    return (
        <div style={{ textAlign: 'left' }}>
            <label className="text-indigo-300">Work: </label>
            <input
                type="number"
                value={settingsInfo.workMinutes}
                onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 1 && value <= 120) {
                        settingsInfo.setWorkMinutes(value);
                    }
                }}
                min={1}
                max={120}
                style={{
                    width: '50px',
                    marginLeft: '10px',
                    textAlign: 'center',
                    border: '1px solid #3b81f4',
                    borderRadius: '5px'
                }}
            />
            <span className="text-indigo-300"> :00</span>
            <br />
            <input
                type="range"
                className="slider"
                value={settingsInfo.workMinutes}
                onChange={(e) => settingsInfo.setWorkMinutes(Number(e.target.value))}
                min={1}
                max={120}
            />

            <br />

            <label className="text-indigo-300">Break: </label>
            <input
                type="number"
                value={settingsInfo.breakMinutes}
                onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 1 && value <= 120) {
                        settingsInfo.setBreakMinutes(value);
                    }
                }}
                min={1}
                max={120}
                style={{
                    width: '50px',
                    marginLeft: '10px',
                    textAlign: 'center',
                    border: '1px solid #3b81f4',
                    borderRadius: '5px',
                }}
            />
            <span className="text-indigo-300"> :00</span>
            <br />
            <input
                type="range"
                className="slider"
                value={settingsInfo.breakMinutes}
                onChange={(e) => settingsInfo.setBreakMinutes(Number(e.target.value))}
                min={1}
                max={120}
                color={"#a5b4fc"}
            />

            <br />
            <div style={{ marginTop: '20px' }}>
                <BackButton onClick={() => settingsInfo.setShowSettings(false)} />
            </div>
        </div>
    );
}

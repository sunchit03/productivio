import { useState } from "react";

export default function SettingsModal({ workMinutes, breakMinutes, setWorkMinutes, setBreakMinutes, closeModal }) {

    const [workTime, setWorkTime] = useState(workMinutes);
    const [breakTime, setBreakTime] = useState(breakMinutes);

    const handleSave = () => {
        setWorkMinutes(workTime);
        setBreakMinutes(breakTime);
        closeModal();
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-100 bg-opacity-40 z-50 pt-16 drop-shadow-xl">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4 text-black">Pomodoro Settings</h2>

                <label className="block mb-2 text-black">
                    Work Time (minutes):
                    <input
                        type="number"
                        value={workTime}
                        onChange={(e) => setWorkTime(Number(e.target.value))}
                        className="border w-full p-2 mt-1 text-black"
                    />
                </label>

                <label className="block mb-4 text-black">
                    Break Time (minutes):
                    <input
                        type="number"
                        value={breakTime}
                        onChange={(e) => setBreakTime(Number(e.target.value))}
                        className="border w-full p-2 mt-1 text-black"
                    />
                </label>

                <div className="flex justify-end gap-3">
                    <button onClick={closeModal} className="bg-gray-400 px-4 py-2 rounded text-black">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="bg-indigo-500 text-white px-4 py-2 rounded">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

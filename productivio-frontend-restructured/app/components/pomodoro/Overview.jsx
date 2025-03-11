
"use client";
import { useState, useEffect } from "react";

export default function Overview({ pomoCount }) {
  const [todayPomo, setTodayPomo] = useState(0);
  const [todayFocus, setTodayFocus] = useState(0);
  const [totalPomo, setTotalPomo] = useState(0);
  const [totalFocus, setTotalFocus] = useState(0);

  useEffect(() => {
    setTodayPomo(pomoCount);
    setTodayFocus(pomoCount * 25); // Each Pomodoro = 25 min
    setTotalPomo(pomoCount + 10); // Mock Data
    setTotalFocus((pomoCount + 10) * 25);
  }, [pomoCount]);

  return (
    <div className="w-full p-5">
      <h2 className="text-xl font-semibold text-gray-600 mb-3">Overview</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <p className="text-gray-600">Today's Pomo</p>
          <p className="text-2xl font-bold text-gray-800">{todayPomo}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <p className="text-gray-600">Today's Focus</p>
          <p className="text-2xl font-bold text-gray-800">{todayFocus}m</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <p className="text-gray-600">Total Pomo</p>
          <p className="text-2xl font-bold text-gray-800">{totalPomo}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <p className="text-gray-600">Total Focus Duration</p>
          <p className="text-2xl font-bold text-gray-800">{totalFocus}m</p>
        </div>
      </div>
    </div>
  );
}

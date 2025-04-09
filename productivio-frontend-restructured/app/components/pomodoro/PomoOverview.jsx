"use client";
import { useState, useEffect } from "react";

export default function PomoOverview({ pomoStats }) {
  const [todayPomo, setTodayPomo] = useState(0);
  const [todayFocus, setTodayFocus] = useState(0);
  const [totalPomo, setTotalPomo] = useState(0);
  const [totalFocus, setTotalFocus] = useState(0);

  useEffect(() => {
    if (pomoStats) {
      setTodayPomo(pomoStats.todayPomo);
      setTotalPomo(pomoStats.totalPomo);
      setTodayFocus(pomoStats.todayFocus);
      setTotalFocus(pomoStats.totalFocus);
    }
  }, [pomoStats]);

  const formatTime = (seconds) => {
    const totalMinutes = Math.floor(seconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}h ${paddedMinutes}m`;
  }

  return (
    <div className={`w-full p-2 transition-all duration-300`}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Overview</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-3">
        <div className="p-4 bg-gray-100 rounded-md shadow-sm transition-transform transform hover:scale-105">
          <p className="text-gray-600">Today's Pomo</p>
          <p className="text-3xl font-bold text-indigo-600">{formatTime(todayPomo)}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-md shadow-sm transition-transform transform hover:scale-105">
          <p className="text-gray-600">Today's Focus</p>
          <p className="text-3xl font-bold text-green-600">{formatTime(todayFocus)}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-md shadow-sm transition-transform transform hover:scale-105">
          <p className="text-gray-600">Total Pomo</p>
          <p className="text-3xl font-bold text-indigo-600">{formatTime(totalPomo)}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-md shadow-sm transition-transform transform hover:scale-105">
          <p className="text-gray-600">Total Focus Duration</p>
          <p className="text-3xl font-bold text-green-600">{formatTime(totalFocus)}</p>
        </div>

      </div>
      
    </div>
  );
}

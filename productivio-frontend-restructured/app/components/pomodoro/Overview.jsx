
"use client";
import { useState, useEffect } from "react";

export default function Overview({ pomoCount }) {
  const [todayPomo, setTodayPomo] = useState(0);
  const [todayFocus, setTodayFocus] = useState(0);
  const [totalPomo, setTotalPomo] = useState(0);
  const [totalFocus, setTotalFocus] = useState(0);

  useEffect(() => {
    const savedTotalPomo = localStorage.getItem("totalPomo");
    const savedTotalFocus = localStorage.getItem("totalFocus");

    if (savedTotalPomo) setTotalPomo(parseInt(savedTotalPomo));
    if (savedTotalFocus) setTotalFocus(parseInt(savedTotalFocus));
  }, []);

  useEffect(() => {
    setTodayPomo(pomoCount);
    setTodayFocus(pomoCount * 25);

    const newTotalPomo = pomoCount + totalPomo;
    const newTotalFocus = newTotalPomo * 25;

    setTotalPomo(newTotalPomo);
    setTotalFocus(newTotalFocus);

    localStorage.setItem("totalPomo", newTotalPomo);
    localStorage.setItem("totalFocus", newTotalFocus);
  }, [pomoCount]);

  return (
    <div className={`w-full p-2 transition-all duration-300`}>
      <div className="flex justify-between items-center cursor-pointer">
        <h2 className="text-xl font-bold text-gray-800">Overview</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
        <div className="p-4 bg-gray-100 rounded-md shadow-sm transition-transform transform hover:scale-105">
          <p className="text-gray-600">Today's Pomo</p>
          <p className="text-3xl font-bold text-indigo-600">{todayPomo}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-md shadow-sm transition-transform transform hover:scale-105">
          <p className="text-gray-600">Today's Focus</p>
          <p className="text-3xl font-bold text-green-600">{todayFocus}m</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-md shadow-sm transition-transform transform hover:scale-105">
          <p className="text-gray-600">Total Pomo</p>
          <p className="text-3xl font-bold text-indigo-600">{totalPomo}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-md shadow-sm transition-transform transform hover:scale-105">
          <p className="text-gray-600">Total Focus Duration</p>
          <p className="text-3xl font-bold text-green-600">{totalFocus}m</p>
        </div>
      </div>
    </div>
  );
}

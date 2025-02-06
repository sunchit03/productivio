import React from "react";
import { FaCalendarAlt, FaInbox, FaSearch, FaSignOutAlt, FaUser } from "react-icons/fa";

const Sidebar = ({ activeMainTab, setActiveMainTab, user, handleLogout }) => {
  return (
    <aside className="w-16 bg-gray-200 p-4 flex flex-col items-center space-y-4">
      <button
        className={`p-2 rounded ${
          activeMainTab === "inbox" ? "bg-blue-500 text-white" : "text-black"
        }`}
        onClick={() => setActiveMainTab("inbox")}
      >
        <FaInbox />
      </button>
      <button
        className={`p-2 rounded ${
          activeMainTab === "calendar" ? "bg-blue-500 text-white" : "text-black"
        }`}
        onClick={() => setActiveMainTab("calendar")}
      >
        <FaCalendarAlt />
      </button>
      <button
        className={`p-2 rounded ${
          activeMainTab === "search" ? "bg-blue-500 text-white" : "text-black"
        }`}
        onClick={() => setActiveMainTab("search")}
      >
        <FaSearch />
      </button>
      <button onClick={handleLogout} className="p-2 rounded bg-gray-200 hover:bg-gray-300 text-black">
        <FaSignOutAlt />
      </button>
      <button className="p-2 rounded bg-gray-200 hover:bg-gray-300 text-black">
        <FaUser /> {user?.nickname}
      </button>
    </aside>
  );
};

export default Sidebar;

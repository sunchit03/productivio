import React, { useState } from "react";
import { FaCalendarAlt, FaInbox, FaSearch, FaSignOutAlt, FaUser } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { IoMdNotifications } from "react-icons/io";
import NotificationsModal from "../components/NotificationsModal";
import { useRouter } from "next/navigation";

const MainSidebar = ({ activeMainTab, setActiveMainTab, user }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    window.location.href = "/api/auth/logout?federated";
    localStorage.setItem("userId", "")
    localStorage.setItem("activeTab", "");
  };

  const router = useRouter();

  return (
    <aside className="w-16 bg-gray-200 p-4 flex flex-col items-center space-y-4">
      <img
        src={user?.picture}
        alt="Profile"
        className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
        decode="async"
        data-testid="profile-picture"
      />
      <button
        className={`p-2 rounded ${
          activeMainTab === "task" ? "bg-blue-500 text-white" : "text-black"
        }`}
        onClick={() => {
          if (activeMainTab != "task") {
            router.push("/dashboard")
            setActiveMainTab("task")
            localStorage.setItem("activeTab", "task");
          }
        }}
      >
        <FaInbox />
      </button>
      <button
        className={`p-2 rounded ${
          activeMainTab === "calendar" ? "bg-blue-500 text-white" : "text-black"
        }`}
        onClick={() => {
          if (activeMainTab != "calendar") {
            router.push("/dashboard");
            setActiveMainTab("calendar");
            localStorage.setItem("activeTab", "calendar");
          }
        }}
      >
        <FaCalendarAlt />
      </button>
      <button
        className={`p-2 rounded ${
          activeMainTab === "search" ? "bg-blue-500 text-white" : "text-black"
        }`}
        onClick={() => {
          if (activeMainTab != "search") {
            router.push("/dashboard");
            setActiveMainTab("search");
            localStorage.setItem("activeTab", "search");
          }
        }}
      >
        <FaSearch />
      </button>
      <button onClick={() => handleLogout()} className="p-2 rounded bg-gray-200 hover:bg-gray-300 text-black">
        <FaSignOutAlt />
      </button>
      <button
        className={`p-2 rounded ${
          activeMainTab === "teams" ? "bg-blue-500 text-white" : "text-black"
        }`}
        onClick={() => {
          if (activeMainTab != "teams") {
            router.push("/dashboard");
            setActiveMainTab("teams");
            localStorage.setItem("activeTab", "teams");
          }
        }}
      >
        <RiTeamFill />
      </button>
      {/* Notifications Button */}
      <button 
        className="p-2 rounded text-black"
        onClick={() => setShowNotifications(true)}>
        <IoMdNotifications />
      </button>

      {/* Notifications Modal */}
      {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} notifications={[]} activities={[]} />}
    </aside>
  );
};

export default MainSidebar;

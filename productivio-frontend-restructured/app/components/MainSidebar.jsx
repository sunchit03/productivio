import React, { useState } from "react";
import { IoIosCheckbox } from "react-icons/io";
import { FaCalendarAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { MdTimer } from "react-icons/md";
import { PiGridFourFill } from "react-icons/pi";
import { RiTeamFill } from "react-icons/ri";
import { IoMdNotifications } from "react-icons/io";
import NotificationsModal from "../components/NotificationsModal";
import { useRouter } from "next/navigation";

const MainSidebar = ({ activeMainTab, setActiveMainTab, user }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    window.location.href = "/api/auth/logout?federated";
    localStorage.setItem("userId", "")
    localStorage.setItem("activeTab", "task");
  };

  const router = useRouter();

  return (
    <aside className="w-[50px] bg-gradient-to-b from-indigo-300 to-pink-200 p-4 flex flex-col items-center justify-between h-full">
      <div className="flex flex-col items-center space-y-4 flex-grow">
      <img
        src={user?.picture}
        alt="Profile"
        className="rounded-md img-fluid profile-picture mb-md-0"
        decode="async"
        data-testid="profile-picture"
      />
      <button
        className={`px-2 py-1 rounded ${
          activeMainTab === "task" ? "text-white/100" : "text-white/50 hover:text-white/75"
        }`}
        title="Task"
        onClick={() => {
          if (activeMainTab != "task") {
            router.push("/dashboard")
            setActiveMainTab("task")
            localStorage.setItem("activeTab", "task");
          }
        }}
      >
        <IoIosCheckbox size="1.4em"/>
      </button>
      <button
        className={`px-2 py-1 rounded ${
          activeMainTab === "calendar" ? "text-white/100" : "text-white/50 hover:text-white/75"
        }`}
        title="Calendar View"
        onClick={() => {
          if (activeMainTab != "calendar") {
            router.push("/dashboard");
            setActiveMainTab("calendar");
            localStorage.setItem("activeTab", "calendar");
          }
        }}
      >
        <FaCalendarAlt size="1.4em"/>
      </button>
      <button
        className={`px-2 py-1 rounded ${
          activeMainTab === "pomodoro" ? "text-white/100" : "text-white/50 hover:text-white/75"
        }`}
        title="Pomodoro"
        onClick={() => {
          if (activeMainTab != "pomodoro") {
            router.push("/dashboard");
            setActiveMainTab("pomodoro");
            localStorage.setItem("activeTab", "pomodoro");
          }
        }}
      >
        <MdTimer size="1.4em"/>
      </button>

      <button
        className={`px-2 py-1 rounded ${
          activeMainTab === "matrix" ? "text-white/100" : "text-white/50 hover:text-white/75"
        }`}
        title="Eisenhower Matrix"
        onClick={() => {
          if (activeMainTab != "matrix") {
            router.push("/dashboard");
            setActiveMainTab("matrix");
            localStorage.setItem("activeTab", "matrix");
          }
        }}
      >
        <PiGridFourFill size="1.4em"/>
      </button>
      
      <button
        className={`px-2 py-1 rounded ${
          activeMainTab === "teams" ? "text-white/100" : "text-white/50 hover:text-white/75"
        }`}
        title="Teams"
        onClick={() => {
          if (activeMainTab != "teams") {
            router.push("/dashboard");
            setActiveMainTab("teams");
            localStorage.setItem("activeTab", "teams");
          }
        }}
      >
        <RiTeamFill size="1.4em"/>
      </button>
      </div>
      
      <div className="flex flex-col items-center space-y-4 mt-auto">
      {/* Notifications Button */}
      <button 
        className="px-2 py-1 rounded text-white/50 hover:text-white/75"
        title="Notifications"
        onClick={() => setShowNotifications(true)}>
        <IoMdNotifications size="1.4em"/>
      </button>

      <button 
        onClick={() => handleLogout()} 
        className="px-2 py-1 rounded text-white/50 hover:text-white/75"
        title="Sign Out"
        >
        <FaSignOutAlt size="1.4em"/>
      </button>
      </div>

      {/* Notifications Modal */}
      {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} notifications={[]} activities={[]} />}

      
    </aside>
  );
};

export default MainSidebar;

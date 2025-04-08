import React, { useState, useEffect } from "react";
import { IoIosCheckbox } from "react-icons/io";
import { FaCalendarAlt, FaExclamationCircle, FaSignOutAlt, FaUser } from "react-icons/fa";
import { MdTimer } from "react-icons/md";
import { PiGridFourFill } from "react-icons/pi";
import { RiTeamFill } from "react-icons/ri";
import { IoMdNotifications } from "react-icons/io";
import NotificationsModal from "../components/NotificationsModal";
import { useRouter } from "next/navigation";
import { preLogOut } from "../utils/prelogout";
import { deleteAllNotifications, getUserNotifications, updateNotifications } from "../services/notifications";
import toast from "react-hot-toast";

const MainSidebar = ({ activeMainTab, setActiveMainTab, user, selectedTeam, setSelectedTeam, userId }) => {
  const [userPicture, setUserPicture] = useState(user?.picture || null);
  const [notifications, setNotifications] = useState([]);
  const [isNewNotification, setIsNewNotification] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    localStorage.removeItem("userId");
    localStorage.setItem("activeTab", "task");

    const clearToken = await preLogOut();
    if (!clearToken) {
      console.error("Failed to clear tokens on logout");
    }

    // window.location.href = "/api/auth/logout?federated";

    // Redirect to Auth0 logout URL (ensures session is cleared)
    window.location.href = `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/v2/logout?client_id=${process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}`)}`;
  };

  const router = useRouter();

  const fetchNotifications = async () => {
    const data = await getUserNotifications(userId);
    
    if (data.success) {
      console.log(data);
      setNotifications(data.notifications);
      setIsNewNotification(data.notifications.some(notification => notification.new));
    } else {
      toast.error("Failed to load notifications");
      setNotifications([]);
    }
  }

  const readNotifications = async () => {
    const data = await updateNotifications(userId);

    if (data.success) {
      setNotifications(prevNotifications => prevNotifications.map(notification => ({...notification, new: false})));
    } else {
      toast.error("Failed to mark notifications as read");
    }
  }

  const clearNotifications = async () => {
    const data = await deleteAllNotifications(userId);

    if (data.success) {
      setNotifications([]);
    } else {
      toast.error("Failed to mark notifications as read");
    }
  }

  useEffect(() => {
    if (user) {
      setUserPicture(user.picture);
    }
  
    if (userId) {
      fetchNotifications(); // Fetch immediately
  
      const interval = setInterval(() => {
        fetchNotifications();
      }, 300000); // 5 minutes (300,000ms)
  
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [user, userId]);

  return (
    <aside className="xs:hidden w-[50px] bg-gradient-to-b from-indigo-400/75 to-pink-200 p-4 flex flex-col items-center justify-between h-full">
      <div className="flex flex-col items-center space-y-4 flex-grow">
        {user ? (
          <img
          src={userPicture || "/assets/default-avatar.jpg"}
          alt="Profile"
          className="rounded-md img-fluid profile-picture mb-md-0"
          decode="async"
          data-testid="profile-picture"
          />
        ) : (
          <button
          className={`px-2 py-1 rounded text-white/50 hover:text-white/75`}
          title={user?.name || "Profile"}
        >
          <FaUser size="1.4em"/>
        </button>
        )}
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
          className={`sm:hidden px-2 py-1 rounded ${
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
              router.push("/dashboard/pomodoro");
              setActiveMainTab("pomodoro");
              localStorage.setItem("activeTab", "pomodoro");
            }
          }}
        >
          <MdTimer size="1.4em"/>
        </button>

        <button
          className={`sm:hidden px-2 py-1 rounded ${
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
            if (activeMainTab != "teams" || selectedTeam) {
              router.push("/dashboard");
              setActiveMainTab("teams");
              setSelectedTeam(null);
              localStorage.setItem("activeTab", "teams");
            }
          }}
        >
          <RiTeamFill size="1.4em"/>
        </button>
      </div>
      
      <div className="flex flex-col items-center space-y-4 mt-auto">
        <div className="relative">
          {/* Notifications Button */}
          <button
            className={`px-2 py-1 rounded ${
              showNotifications ? "text-white/100" : "text-white/50 hover:text-white/75"
            }`}
            title="Notifications"
            onClick={() => { setShowNotifications(prev => !prev); setIsNewNotification(false); readNotifications();}}>
            <IoMdNotifications size="1.4em"/>
          </button>
          <div className={`absolute -right-[1.5px] -top-1 text-indigo-400/90 text-sm/4 font-semibold ${isNewNotification ? 'visible' : 'invisible'}`}>
            <FaExclamationCircle size="1.2em"/>
          </div>
        </div>

        <button 
          onClick={() => handleLogout()} 
          className="px-2 py-1 rounded text-white/50 hover:text-white/75"
          title="Sign Out"
          >
          <FaSignOutAlt size="1.4em"/>
        </button>
      </div>

      {/* Notifications Modal */}
      {
        showNotifications && 
        <NotificationsModal 
          onClose={() => setShowNotifications(false)} 
          notifications={notifications}
          readNotifications={readNotifications}
          clearNotifications={clearNotifications}
        />
      }

      
    </aside>
  );
};

export default MainSidebar;

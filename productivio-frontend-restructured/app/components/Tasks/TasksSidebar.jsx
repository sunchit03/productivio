// app/components/TasksSidebar.jsx
import React, { useState, useEffect } from "react";
import { BsCalendar2Date, BsCalendar2Day } from "react-icons/bs";
import { FaExclamationCircle, FaUser } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { FiInbox, FiTrash2, FiCheckSquare  } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import NotificationsModal from "../NotificationsModal";
import SidebarListsDropdown from "./SidebarListsDropdown";
import { preLogOut } from "../../utils/prelogout";
import { getUserNotifications } from "../../services/notifications";
import toast from "react-hot-toast";

const TasksSidebar = ({ activeTab, setActiveTab, activeList, setActiveList = null, taskBarCollapse, setTaskBarCollapse, user, userId }) => {
  const [userPicture, setUserPicture] = useState(user?.picture || null);
  const [notifications, setNotifications] = useState([]);
  const [isNewNotification, setIsNewNotification] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const upperTabs = ["Today", "Next 7 Days", "Inbox"];
  const lowerTabs = ["Completed", "Trash"];

  const fetchNotifications = async () => {
    const data = await getUserNotifications(userId);
    
    if (data.success) {
      console.log(data);
      setNotifications(data.notifications);
      setIsNewNotification(notifications.includes(notification => notification.new === true))
    } else {
      toast.error("Failed to load notifications");
      setNotifications([]);
    }
  }

  useEffect(() => {
    if (user) {
    setUserPicture(user.picture);

      if (userId) {
        fetchNotifications();
      }
    }
  }, [user, userId]);

  const handleLogout = async () => {
    localStorage.removeItem("userId");
    localStorage.setItem("activeTab", "task");

    const clearToken = await preLogOut();
    if (!clearToken) {
      console.error("Failed to clear tokens on logout");
    }

    //window.location.href = "/api/auth/logout?federated";
    
    // Redirect to Auth0 logout URL (ensures session is cleared)
    window.location.href = `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/v2/logout?client_id=${process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}`)}`;
  };

  const renderButton = (tab) => {
    switch(tab) {
      case "Today": return <BsCalendar2Date />
      case "Next 7 Days": return <BsCalendar2Day />
      case "Inbox": return <FiInbox />
      case "Completed": return <FiCheckSquare />
      case "Trash": return <FiTrash2 />
    }
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    // Collapse sidebar on smaller screens
    if (typeof window !== "undefined" && window.innerWidth < 639) {
      setTaskBarCollapse(true);
    }
  };
  
  const createTabs = (tabs) => {
    return (
      <ul className="py-[14px]">
          {tabs.map((tab) => (
            <li key={tab} className="flex flex-col relative px-[10px]">
              
              {tab === "Lists" ? (
                <SidebarListsDropdown activeTab={activeTab} setActiveTab={setActiveTab} activeList={activeList} setActiveList={setActiveList} setTaskBarCollapse={setTaskBarCollapse} userId={userId}/>
              ) : (
                <button
                  onClick={() => handleTabClick(tab)}
                  className={`w-full text-left px-3 py-2 flex items-center rounded-md
                    ${activeTab === tab ? "bg-indigo-500/15" : "hover:bg-indigo-500/5"}`}
                >
                  <div className="mr-[8px] w-[18px] h-[18px] flex-none">{renderButton(tab)}</div>
                  <p className="text-sm font-normal flex-auto">{tab.charAt(0).toUpperCase() + tab.slice(1)}</p>
                </button>
              )}
            </li>
          ))}
      </ul>
    )
  }

  return (
    <div className={`sm:absolute sm:left-0 sm:z-30 transition-width duration-200 ease-linear relative bg-gradient-to-b from-indigo-100 to-pink-50 bg-white text-black h-screen flex flex-col justify-between overflow-y-auto
       ${taskBarCollapse ? "w-0" : "w-[310px] mdlg:w-[305px] md:w-[213px] sm:w-[300px] xs:w-[288px]"}`}>

      <div>
        <div className="hidden xs:flex justify-between items-center pt-4 px-2">
          {user ? (
            <img
            src={userPicture}
            alt="Profile"
            className="rounded-md img-fluid profile-picture mb-md-0 size-10"
            decode="async"
            data-testid="profile-picture"
            />
          ) : (
            <button
            className={`px-2 py-1 rounded text-black`}
            title={user?.name || "Profile"}
            >
              <FaUser size="1.4em"/>
            </button>
          )}

          <div className="flex items-center">
            <div className="relative">
              {/* Notifications Button */}
              <button 
                className="px-2 py-1 rounded text-black"
                title="Notifications"
                onClick={() => setShowNotifications(true)}>
                <IoMdNotificationsOutline  size="1.4em"/>
              </button>
              {isNewNotification && 
                <div className="absolute -right-[1.5px] -top-1 text-indigo-400/90 text-sm/4 font-semibold">
                  <FaExclamationCircle size="1.2em"/>
                </div>
              }
            </div>
    
            <button 
              onClick={() => handleLogout()} 
              className="px-2 py-1 rounded text-black"
              title="Sign Out"
              >
              <IoLogOutOutline size="1.4em"/>
            </button>
          </div>

          {/* Notifications Modal */}
          {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} notifications={notifications} />}
        </div>

        {createTabs(upperTabs)}
        <div className="w-4/5 h-[1px] bg-purple-950 place-self-center"></div>
        {createTabs(["Lists"])}
        <div className="w-4/5 h-[1px] bg-purple-950 place-self-center"></div>
      </div>

      {createTabs(lowerTabs)}
    </div>
  );
};

export default TasksSidebar;
// // app/components/TasksSidebar.jsx
import { useState } from "react";
import { BsCalendar2Date, BsCalendar2Day } from "react-icons/bs";
import { FiInbox, FiTrash2 , FiCheckSquare  } from "react-icons/fi";
import SidebarListsDropdown from "./SidebarListsDropdown";

const renderButton = (tab) => {
  switch(tab) {
    case "today":
      return <BsCalendar2Date />
      break;

    case "Next 7 Days":
      return <BsCalendar2Day />
      break;

    case "inbox":
      return <FiInbox />
      break;

    case "completed":
      return <FiCheckSquare />
      break;

    case "trash":
      return <FiTrash2 />
      break;
  }
}

const createTabs = (tabs, activeTab, setActiveTab, setActiveList = null) => {
  return (
    <ul className="py-[14px]">
        {tabs.map((tab) => (
          <li key={tab} className="flex flex-col relative px-[10px]">
            
            {tab === "lists" ? (
              <SidebarListsDropdown setActiveTab={setActiveTab} setActiveList={setActiveList} />
            ) : (
              <button
                onClick={() => setActiveTab(tab)}
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

const TasksSidebar = ({ activeTab, setActiveTab, activeList, setActiveList = null, taskBarCollapse }) => {
  const upperTabs = ["today", "Next 7 Days", "inbox"];
  const tabs = ["today", "Next 7 Days", "inbox", "lists", "completed", "trash"];
  const lowerTabs = ["completed", "trash"];

  return (
    <div className={`w-1/5 bg-gradient-to-b from-indigo-100 to-pink-50 bg-white text-black h-screen flex flex-col justify-between overflow-y-auto
      ${!taskBarCollapse ? "visible" : "hidden"}`}>

      <div>
      {createTabs(upperTabs, activeTab, setActiveTab)}

      <div className="w-4/5 h-[1px] bg-purple-950 place-self-center"></div>

      {createTabs(["lists"], activeTab, setActiveTab, setActiveList)}

      <div className="w-4/5 h-[1px] bg-purple-950 place-self-center"></div>

      </div>

      {createTabs(lowerTabs, activeTab, setActiveTab)}
    </div>
  );
};

export default TasksSidebar;
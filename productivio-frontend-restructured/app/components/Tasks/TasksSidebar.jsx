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

const createTabs = (tabs, setActiveTab, setActiveList = null) => {
  return (
    <ul className="py-[14px]">
        {tabs.map((tab) => (
          <li key={tab} className="flex flex-col relative px-[10px]">
            
            {tab === "lists" ? (
              <SidebarListsDropdown setActiveTab={setActiveTab} setActiveList={setActiveList} />
            ) : (
              <button
                onClick={() => setActiveTab(tab)}
                className="w-full text-left px-3 py-2 hover:bg-gradient-to-bl from-violet-100 to-fuchsia-100 hover:rounded-sm flex items-center"
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

const TasksSidebar = ({ setActiveTab, setActiveList = null }) => {
  const upperTabs = ["today", "Next 7 Days", "inbox"];
  const tabs = ["today", "Next 7 Days", "inbox", "lists", "completed", "trash"];
  const lowerTabs = ["completed", "trash"];

  return (
    <div className="bg-gradient-to-bl from-violet-50 to-fuchsia-50 w-56 bg-white text-black h-screen flex flex-col justify-between overflow-y-auto">

      <div>
      {createTabs(upperTabs, setActiveTab)}

      <div className="w-4/5 h-[1px] bg-purple-950 place-self-center"></div>

      {createTabs(["lists"], setActiveTab, setActiveList)}

      <div className="w-4/5 h-[1px] bg-purple-950 place-self-center"></div>

      </div>

      {createTabs(lowerTabs, setActiveTab)}
    </div>
  );
};

export default TasksSidebar;
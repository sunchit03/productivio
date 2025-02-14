// // app/components/TasksSidebar.jsx
import { useState } from "react";
import SidebarListsDropdown from "./SidebarListsDropdown";

const TasksSidebar = ({ setActiveTab }) => {
  const tabs = ["tasks", "lists", "today", "next7days", "completed", "trash"];
  const [hoveredTab, setHoveredTab] = useState(null);

  return (
    <div className="w-56 bg-white text-black h-screen p-4">
      <ul>
        {tabs.map((tab) => (
          <li key={tab} className="mb-2 flex flex-col relative"
              onMouseEnter={() => setHoveredTab(tab)}
              onMouseLeave={() => setHoveredTab(null)}>
            
            {tab === "tasks" ? (
              <div className="relative w-full">
                <button
                  onClick={() => setActiveTab(tab)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-200 flex justify-between items-center"
                >
                  Tasks
                </button>
              </div>
            ) : tab === "lists" ? (
              <SidebarListsDropdown setActiveTab={setActiveTab} />
            ) : (
              <button
                onClick={() => setActiveTab(tab)}
                className="w-full text-left px-3 py-2 hover:bg-gray-200"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksSidebar;
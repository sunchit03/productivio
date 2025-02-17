// app/components/TasksSidebar.jsx
import { BsCalendar2Date, BsCalendar2Day } from "react-icons/bs";
import { FiInbox, FiTrash2 , FiCheckSquare  } from "react-icons/fi";
import SidebarListsDropdown from "./SidebarListsDropdown";

const TasksSidebar = ({ activeTab, setActiveTab, activeList, setActiveList = null, taskBarCollapse, userId }) => {
  const upperTabs = ["Today", "Next 7 Days", "Inbox"];
  const lowerTabs = ["Completed", "Trash"];

  const renderButton = (tab) => {
    switch(tab) {
      case "Today": return <BsCalendar2Date />
      case "Next 7 Days": return <BsCalendar2Day />
      case "Inbox": return <FiInbox />
      case "Completed": return <FiCheckSquare />
      case "Trash": return <FiTrash2 />
    }
  }
  
  const createTabs = (tabs) => {
    return (
      <ul className="py-[14px]">
          {tabs.map((tab) => (
            <li key={tab} className="flex flex-col relative px-[10px]">
              
              {tab === "Lists" ? (
                <SidebarListsDropdown activeTab={activeTab} setActiveTab={setActiveTab} activeList={activeList} setActiveList={setActiveList} userId={userId}/>
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

  return (
    <div className={`w-1/5 bg-gradient-to-b from-indigo-100 to-pink-50 bg-white text-black h-screen flex flex-col justify-between overflow-y-auto
      ${!taskBarCollapse ? "visible" : "hidden"}`}>

      <div>
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
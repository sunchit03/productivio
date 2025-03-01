"use client";
import { useState } from "react";
import TasksSidebar from "../../components/Tasks/TasksSidebar";
import TasksView from "../../components/Tasks/TasksView";

export default function TaskPage( {taskBarCollapse, setTaskBarCollapse, user, userId} ) {
  const [selectedTab, setSelectedTab] = useState("Inbox");
  const [selectedList, setSelectedList] = useState({id: "", emoji: "", name: ""});

  const renderView = () => {
    switch (selectedTab) {
      case "Lists": 
        return <TasksView title={ selectedList.emoji + " " + selectedList.name } userId={userId} listId={selectedList.id} taskBarCollapse={taskBarCollapse} setTaskBarCollapse={setTaskBarCollapse} switchTab={selectedTab}/>
      default:
        return <TasksView title={selectedTab} userId={userId} taskBarCollapse={taskBarCollapse} setTaskBarCollapse={setTaskBarCollapse} switchTab={selectedTab}/>
    }
  };

  return (
    <div className={"sm:relative w-full flex h-full"}>
        <TasksSidebar activeTab={selectedTab} setActiveTab={setSelectedTab} activeList={selectedList} setActiveList={setSelectedList} taskBarCollapse={taskBarCollapse} setTaskBarCollapse={setTaskBarCollapse} user={user} userId={userId}/>
        <div className={`flex-grow h-full sm:w-full overflow-auto ${typeof window !== "undefined" && window.innerWidth < 639 && !taskBarCollapse ? "bg-black/10" : "bg-white"}`}>{renderView()}</div>
    </div>
  );
}

"use client";
import { useState } from "react";
import TasksSidebar from "../../components/Tasks/TasksSidebar";
import TasksView from "./views/TasksView";

export default function TaskPage( {taskBarCollapse, setTaskBarCollapse, userId} ) {
  const [selectedTab, setSelectedTab] = useState("Inbox");
  const [selectedList, setSelectedList] = useState({id: "", emoji: "", name: ""});

  const renderView = () => {
    switch (selectedTab) {
      case "Lists": 
        return <TasksView title={ selectedList.emoji + " " + selectedList.name } userId={userId} listId={selectedList.id} taskBarCollapse={taskBarCollapse} setTaskBarCollapse={setTaskBarCollapse}/>
      default:
        return <TasksView title={selectedTab} userId={userId} taskBarCollapse={taskBarCollapse} setTaskBarCollapse={setTaskBarCollapse}/>
    }
  };

  return (
    <>
        <TasksSidebar activeTab={selectedTab} setActiveTab={setSelectedTab} activeList={selectedList} setActiveList={setSelectedList} taskBarCollapse={taskBarCollapse} userId={userId}/>
        <div className="flex-grow bg-white overflow-auto">{renderView()}</div>
    </>
  );
}

"use client";
import { useState } from "react";
import { ListsProvider } from "../../context/ListsContext";
import TasksSidebar from "../../components/Tasks/TasksSidebar";
import TasksView from "./views/TasksView";

export default function TaskPage( {taskBarCollapse, setTaskBarCollapse} ) {
  const [selectedTab, setSelectedTab] = useState("inbox");
  const [selectedList, setSelectedList] = useState({id: "", emoji: "", name: ""});

  const renderView = () => {

    switch (selectedTab) {
      case "lists": return <TasksView title={ selectedList.emoji + " " + selectedList.name } listId={selectedList.id} taskBarCollapse={taskBarCollapse} setTaskBarCollapse={setTaskBarCollapse}/>
      case "today": return <TasksView title={"Today"} today={true} taskBarCollapse={taskBarCollapse} setTaskBarCollapse={setTaskBarCollapse}/>
      case "Next 7 Days": return <TasksView title={"Next 7 Days"} next7days={true} taskBarCollapse={taskBarCollapse} setTaskBarCollapse={setTaskBarCollapse}/>
      case "completed": return <TasksView title={"Completed"} completed={true} taskBarCollapse={taskBarCollapse} setTaskBarCollapse={setTaskBarCollapse}/>
      case "trash": return <TasksView title={"Trash"} trash={true} taskBarCollapse={taskBarCollapse} setTaskBarCollapse={setTaskBarCollapse}/>
      default: return <TasksView title={"Inbox"} inbox={true} taskBarCollapse={taskBarCollapse} setTaskBarCollapse={setTaskBarCollapse}/>
    }
  };

  return (
    <ListsProvider>
        <TasksSidebar activeTab={selectedTab} setActiveTab={setSelectedTab} activeList={selectedList} setActiveList={setSelectedList} taskBarCollapse={taskBarCollapse}/>
        <div className="flex-grow bg-white overflow-auto">{renderView()}</div>
    </ListsProvider>
  );
}

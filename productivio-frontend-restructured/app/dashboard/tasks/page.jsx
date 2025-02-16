"use client";
import { useState } from "react";
import { ListsProvider } from "../../context/ListsContext";
import TasksSidebar from "../../components/Tasks/TasksSidebar";
import TasksView from "./views/TasksView";

export default function TaskPage() {
  const [selectedTab, setSelectedTab] = useState("inbox");
  const [selectedList, setSelectedList] = useState({id: "", emoji: "", name: ""});

  const renderView = () => {

    switch (selectedTab) {
      case "lists": return <TasksView title={ selectedList.emoji + " " + selectedList.name } listId={selectedList.id} />
      case "today": return <TasksView title={"Today"} today={true} />;
      case "Next 7 Days": return <TasksView title={"Next 7 Days"} next7days={true} />;
      case "completed": return <TasksView title={"Completed"} completed={true}/>;
      case "trash": return <TasksView title={"Trash"} trash={true}/>;
      default: return <TasksView title={"Inbox"} inbox={true} />;
    }
  };

  return (
    <ListsProvider>
      {selectedTab !== "calendar" && selectedTab !== "teams" && (
        <TasksSidebar activeTab={selectedTab} setActiveTab={setSelectedTab} activeList={selectedList} setActiveList={setSelectedList} />
      )}
      <div className="flex-grow py-6 px-5 bg-white overflow-auto">{renderView()}</div>
    </ListsProvider>
  );
}

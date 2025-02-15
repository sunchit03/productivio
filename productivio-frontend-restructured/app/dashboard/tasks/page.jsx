"use client";
import { useState } from "react";
import { ListsProvider } from "../../context/ListsContext";
import { TasksProvider } from "../../context/TasksContext";
import TasksSidebar from "../../components/Tasks/TasksSidebar";
import TasksView from "./views/TasksView";

export default function TaskPage() {
  const [selectedTab, setSelectedTab] = useState("tasks");
  const [selectedList, setSelectedList] = useState({id: "", emoji: "", name: ""});

  const renderView = () => {

    switch (selectedTab) {
      case "lists": return <TasksView title={ selectedList.emoji + " " + selectedList.name } isList={true} listId={selectedList.id} />
      case "today": return <TasksView title={"Today"} todayOrNext={true} />;
      case "Next 7 Days": return <TasksView title={"Next 7 Days"} todayOrNext={true} />;
      case "completed": return <TasksView title={"Completed"} completedOrTrash={true}/>;
      case "trash": return <TasksView title={"Trash"} completedOrTrash={true}/>;
      default: return <TasksView title={"Inbox"} />;
    }
  };

  return (
    <ListsProvider>
      <TasksProvider>
          {selectedTab !== "calendar" && selectedTab !== "teams" && (
            <TasksSidebar setActiveTab={setSelectedTab} setActiveList={setSelectedList} />
          )}
          <div className="flex-grow p-6 bg-white overflow-auto">{renderView()}</div>
      </TasksProvider>
    </ListsProvider>
  );
}

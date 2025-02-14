// "use client";
// import { useState } from "react";
// import { TasksProvider } from "../context/TasksContext";
// import MainSidebar from "../components/MainSidebar";
// import TasksSidebar from "../components/TasksSidebar";
// import TasksView from "../views/TasksView";
// import ListsView from "../views/ListsView";
// import TodayTasks from "../views/TodayTasks";
// import NextSevenDays from "../views/NextSevenDays";
// import CompletedTasks from "../views/CompletedTasks";
// import TrashTasks from "../views/TrashTasks";

// export default function FeaturesPage() {
//   const [selectedTab, setSelectedTab] = useState("tasks");

//   const renderView = () => {
//     switch (selectedTab) {
//       case "lists": return <ListsView />;
//       case "today": return <TodayTasks />;
//       case "next7days": return <NextSevenDays />;
//       case "completed": return <CompletedTasks />;
//       case "trash": return <TrashTasks />;
//       default: return <TasksView />;
//     }
//   };

//   return (
//     <TasksProvider>
//       <div className="flex h-screen">
//         <MainSidebar setSelectedTab={setSelectedTab} />
//         {selectedTab !== "calendar" && selectedTab !== "search" && (
//           <TasksSidebar setActiveTab={setSelectedTab} />
//         )}
//         <div className="flex-grow p-6 overflow-auto">{renderView()}</div>
//       </div>
//     </TasksProvider>
//   );
// }
"use client";
import { useState } from "react";
import { ListsProvider } from "../../context/ListsContext";
import { TasksProvider } from "../../context/TasksContext";
import { useLists } from "../../context/ListsContext";
import TasksSidebar from "../../components/Tasks/TasksSidebar";
import TasksView from "./views/TasksView";
import ListsView from "./views/ListsView";
import TodayTasks from "./views/TodayTasks";
import NextSevenDays from "./views/NextSevenDays";
import CompletedTasks from "./views/CompletedTasks";
import TrashTasks from "./views/TrashTasks";

export default function TaskPage() {
  const [selectedTab, setSelectedTab] = useState("tasks");
  //const { activeList } = useLists();

  const renderView = () => {
    if (selectedTab.startsWith("list-")) {
      return <ListsView />; // ✅ Show ListsView for selected list
    }

    switch (selectedTab) {
      case "lists": return <ListsView />;
      case "today": return <TodayTasks />;
      case "next7days": return <NextSevenDays />;
      case "completed": return <CompletedTasks />;
      case "trash": return <TrashTasks />;
      default: return <TasksView />;
    }
  };

  return (
    <ListsProvider>
      <TasksProvider>
          {selectedTab !== "calendar" && selectedTab !== "teams" && (
            <TasksSidebar setActiveTab={setSelectedTab} />
          )}
          <div className="flex-grow p-6 bg-gray overflow-auto">{renderView()}</div>
      </TasksProvider>
    </ListsProvider>
  );
}

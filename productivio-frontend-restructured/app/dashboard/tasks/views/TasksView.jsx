// app/views/TasksView.jsx

import TaskItem from "../../../components/Tasks/TaskItem";
import TaskForm from "../../../components/Tasks/TaskForm";
import { useEffect, useState } from "react";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse } from "react-icons/tb";
import { RiProgress5Line } from "react-icons/ri";
import { BsTrash2 } from "react-icons/bs";
import { GiPapers } from "react-icons/gi";
import { FaPencilAlt } from "react-icons/fa";
import { getUserTasks } from "@/app/services/tasks";
import DetailTaskView from "@/app/components/Tasks/DetailTaskView";

const TasksView = ({
  title,
  listId = null,
  userId,
  taskBarCollapse,
  setTaskBarCollapse
}) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState({});

  let todayOrNext = title == "Today" || title == "Next 7 Days";
  let completedOrTrash = title == "Completed" || title == "Trash";

  const fetchTasks = async() => {
    try {
      const data = await getUserTasks(userId);

      if (!data) {
        setTasks([]);
        return;
      }

      let filteredTasks = data;
      const now = new Date();
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const next7Days = new Date();
      next7Days.setDate(now.getDate() + 7);
      next7Days.setHours(0, 0, 0, 0);

      switch (title) {
        case "Today": 
          filteredTasks = data.filter(task => {
            const dueDate = new Date(task.dueDate);
            return !task.isTrash && dueDate >= now && dueDate <= todayEnd;
          });
          break;

        case "Next 7 Days": 
          filteredTasks = data.filter(task => {
            const dueDate = new Date(task.dueDate);
            return !task.isTrash && dueDate > now && dueDate <= next7Days;
          });
          break;

        case "Inbox": 
          filteredTasks = data.filter(task => !task.isTrash && !task.list);
          break;

        case "Completed": 
          filteredTasks = data.filter(task => !task.isTrash && task.isCompleted);
          break;

        case "Trash": 
          filteredTasks = data.filter(task => task.isTrash);
          break;

        default:
          filteredTasks = data.filter(task => !task.isTrash && task.list === listId);
          break;
      }

      setTasks(filteredTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  
  useEffect(() => {
    todayOrNext = title == "Today" || title == "Next 7 Days";
    completedOrTrash = title == "Completed" || title == "Trash";

    if (userId) {
      fetchTasks();
    }
    setSelectedTask(null);
  }, [title, userId]);  


  const handleTaskSelection = (task) => { 
    if (selectedTask !== task) {
      setSelectedTask(task);
    }
  }

  const toggleTaskBarCollapse = () => {
    setTaskBarCollapse(!taskBarCollapse);
  }

  return (
    <div className="w-full flex h-full px-5">
      <div className="w-3/5">
        <div className="flex flex-row items-center">
          {!taskBarCollapse ?
            <TbLayoutSidebarLeftCollapse size={"1.5em"} className="text-gray-500 cursor-pointer font-thin" onClick={toggleTaskBarCollapse}/>
            :
            <TbLayoutSidebarRightCollapse  size={"1.5em"} className="text-gray-500 cursor-pointer font-thin" onClick={toggleTaskBarCollapse}/>
          }
          <h2 className="ml-1 text-xl text-black font-semibold my-4">{title}</h2>
        </div>
        {!completedOrTrash && (
          <TaskForm todayOrNext={todayOrNext} listId={listId} refresh={fetchTasks} userId={userId}/>
        )}
        <div className="mt-4 h-[calc(100vh-150px)] hover:overflow-y-auto relative">
          {tasks.length > 0 ? (
            tasks.map(task => { return (
              <div className="group pr-2" key={task._id}>
                <div className={`px-3 py-2 rounded-md ${ selectedTask == task ? "bg-purple-50 hover:bg-purple-100" : "hover:bg-gray-50"}`} 
                  onClick={() => handleTaskSelection(task)}>
                  <TaskItem task={task} refresh={fetchTasks} />
                </div>
                <div className="h-[1px] bottom-0 bg-purple-50 group-hover:invisible z-10"></div>
              </div>
            )})
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-black cursor-default">
              <div className="flex mb-2 items-center">
                {title == "Completed" ? (
                  <RiProgress5Line size={"4em"} className="text-violet-300" />       
                ) : title == "Trash" ? (
                  <BsTrash2 size={"4em"} className="text-violet-300"/>
                ) :
                  <>
                    <GiPapers size={"4em"} className="text-violet-200"/>
                    <FaPencilAlt size={"2em"} className="text-violet-900"/>
                  </>
                }
              </div>
              { title == "Completed" ? (
                <>
                  <span className="text-center text-base font-medium">No tasks completed yet</span>
                  <span className="text-center text-xs font-thin">Keep it up :&#41;</span>
                </>
              ) : title == "Trash" ? (
                <>
                  <span className="text-center text-base font-medium">Trash can is tidy</span>
                  <span className="text-center text-xs font-thin">No deleted tasks yet</span>
                </>
              ) : (
                <>
                  <span className="text-center text-base font-medium">No tasks</span>
                  <span className="text-center text-xs font-thin">Click the input box to add</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      {!completedOrTrash && (
      <div className="relative ml-5 w-2/5">
        <div className="absolute w-[1px] h-dvh left-0 z-10 bg-purple-50"></div>
        <DetailTaskView task={selectedTask} userId={userId} refresh={fetchTasks}/>
      </div>)};
  
    </div>
  );
};

export default TasksView;

// app/views/TasksView.jsx

import TaskItem from "../../../components/Tasks/TaskItem";
import TaskForm from "../../../components/Tasks/TaskForm";
import { useEffect, useState } from "react";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse  } from "react-icons/tb";
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

  let inbox = false;
  let today = false;
  let next7days = false;
  let completed = false;
  let trash = false;

  let todayOrNext = today || next7days;

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

      if (listId != null) {
        filteredTasks = data.filter(task => !task.isTrash && task.list === listId);
      } else if (today) {
        filteredTasks = data.filter(task => {
          const dueDate = new Date(task.dueDate);
          return !task.isTrash && dueDate >= now && dueDate <= todayEnd;
        });
      }
      else if (next7days) {
        filteredTasks = data.filter(task => {
          const dueDate = new Date(task.dueDate);
          return !task.isTrash && dueDate > now && dueDate <= next7Days;
        });
      }
      else if (completed) {
        filteredTasks = data.filter(task => !task.isTrash && task.isCompleted);
      } else if (trash) {
        filteredTasks = data.filter(task => task.isTrash);
      } else if (inbox) {
        filteredTasks = data.filter(task => !task.isTrash && !task.list);
      }

      setTasks(filteredTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  
  useEffect(() => {
    inbox = false;
    today = false;
    next7days = false;
    completed = false;
    trash = false;
    switch(title) {
      case "Today": today = true; break;
      case "Next 7 Days": next7days = true; break;
      case "Inbox": inbox = true; break;
      case "Completed": completed = true; break;
      case "Trash": trash = true; break;
    }
    todayOrNext = today || next7days;

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
        {!completed && !trash && (
          <TaskForm todayOrNext={todayOrNext} listId={listId} refresh={fetchTasks}/>
        )}
        <div className="mt-4 h-[calc(100vh-150px)] overflow-y-auto">
          {tasks.length > 0 ? (
            tasks.map(task => { return (
              <div className="group pr-2" key={task._id}>
                <div className={`px-3 py-2 rounded-md ${selectedTask == task ? "bg-purple-50 hover:bg-purple-50" : "hover:bg-gray-50"}`} 
                  onClick={() => handleTaskSelection(task)}>
                  <TaskItem task={task} />
                </div>
                <div className="h-[1px] bottom-0 bg-purple-50 group-hover:invisible z-10"></div>
              </div>
            )})
          ) : (
            <p className=" text-black mb-4">
              {listId != null ? "No tasks available in this list." : "No tasks available."}
            </p>
          )}
        </div>
      </div>
      
      <div className="relative ml-5 w-2/5">
        <div className="absolute w-[1px] h-dvh left-0 z-10 bg-purple-50"></div>
        <DetailTaskView task={selectedTask} />
      </div>
  
    </div>
  );
};

export default TasksView;

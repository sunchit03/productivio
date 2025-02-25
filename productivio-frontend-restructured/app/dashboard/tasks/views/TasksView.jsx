// app/views/TasksView.jsx

import TaskItem from "../../../components/Tasks/TaskItem";
import TaskForm from "../../../components/Tasks/TaskForm";
import { useEffect, useState } from "react";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse } from "react-icons/tb";
import { RiProgress5Line } from "react-icons/ri";
import { BsTrash2 } from "react-icons/bs";
import {updateTask} from "@/app/services/tasks"
import { GiPapers } from "react-icons/gi";
import { FaPencilAlt } from "react-icons/fa";
import { getUserTasks } from "@/app/services/tasks";
import DetailTaskView from "@/app/components/Tasks/DetailTaskView";
import {deleteTask} from "@/app/services/tasks"
import toast, { Toaster } from 'react-hot-toast';


const TasksView = ({
  title,
  listId = null,
  userId,
  taskBarCollapse,
  setTaskBarCollapse
}) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState({});
  // const [completedTasks, setCompletedTasks] = useState([]);

  let todayOrNext = title == "Today" || title == "Next 7 Days";
  let completedOrTrash = title == "Completed" || title == "Trash";

  const fetchTasks = async() => {
    try {
      const data = await getUserTasks(userId);

      if (!data) {
        setTasks([]);
        // setCompletedTasks([]);
        return;
      }

      let filteredTasks = data;
      // let completedFilteredTasks = [];
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
          // filteredTasks = data.filter(task => {
          //   const dueDate = new Date(task.dueDate);
          //   return !task.isTrash && !task.isCompleted && dueDate >= now && dueDate <= todayEnd;
          // });

          // completedFilteredTasks = data.filter(task => {
          //   const dueDate = new Date(task.dueDate);
          //   return !task.isTrash && task.isCompleted && dueDate >= now && dueDate <= todayEnd;
          // });
          break;

        case "Next 7 Days": 
          // filteredTasks = data.filter(task => {
          //   const dueDate = new Date(task.dueDate);
          //   return !task.isTrash && !task.isCompleted && dueDate >= now && dueDate <= next7Days;
          // });

          // completedFilteredTasks = data.filter(task => {
          //   const dueDate = new Date(task.dueDate);
          //   return !task.isTrash && task.isCompleted && dueDate >= now && dueDate <= next7Days;
          // });
          filteredTasks = data.filter(task => {
            const dueDate = new Date(task.dueDate);
            return !task.isTrash && dueDate >= now && dueDate <= next7Days;
          });
          break;

        case "Inbox": 
          filteredTasks = data.filter(task => !task.isTrash && !task.list);
          // filteredTasks = data.filter(task => !task.isTrash && !task.isCompleted && !task.list);
          // completedFilteredTasks = data.filter(task => !task.isTrash && task.isCompleted && !task.list)
          break;

        case "Completed": 
          filteredTasks = data.filter(task => !task.isTrash && task.isCompleted);
          break;

        case "Trash": 
          filteredTasks = data.filter(task => task.isTrash);
          break;

        default:
          filteredTasks = data.filter(task => !task.isTrash && task.list === listId);
          // filteredTasks = data.filter(task => !task.isTrash && !task.isCompleted && task.list === listId);
          // completedFilteredTasks = data.filter(task => !task.isTrash && task.isCompleted && task.list === listId);
          break;
      }

      setTasks(filteredTasks);
      // setCompletedTasks(completedFilteredTasks || []);
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

  const handleCheckBoxCheck = async (e, taskId, updatedCompletion) => {
    e.stopPropagation();
    try {
        const data = await updateTask(taskId, userId, { isCompleted: updatedCompletion });
        if (data.success) {
          console.log(data);
          setTasks(prevTasks => prevTasks.map(task => task._id === taskId ? {...task, isCompleted: updatedCompletion} : task));
            //Update tasks in state so both TaskItem & DetailTaskView reflect the change
            // if (updatedCompletion) {
            //     const completedTask = tasks.find(task => task._id === taskId);
            //     if(completedTask){
            //       setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId ));
            //       setCompletedTasks(prevTasks => [...prevTasks, completedTask]);
            //     }

            // } else {
            //     const incompletedTask = completedTasks.find(task => task._id === taskId);
            //     if(incompletedTask){
            //       setCompletedTasks(prevTasks => prevTasks.filter(task => task._id !== taskId ));
            //       setTasks(prevTasks => [...prevTasks, incompletedTask]);
            //     }
            // }
            //Update selectedTask if it's the one being changed
            if (selectedTask?._id === taskId) {
                setSelectedTask(prevTask => ({ ...prevTask, isCompleted: updatedCompletion }));
            }
        
       } else {
            console.log("Error in changing completed state of task:", data.error);
        }
    } catch (error) {
        console.error("Error updating task state:", error.message);
    }
};


  const handleEditTask = async(taskId, title, description) => {
    try{
      const data = await updateTask(taskId, userId, {title: title, description: (description === "" ? null : description)})
      if(data){
        setTasks(prevTasks => prevTasks.map(task => task._id === taskId ? {...task, title: title, description: (description === "" ? null : description)} : task));
      if(selectedTask?._id === taskId){
        setSelectedTask(prevTask=>({...prevTask, title: title, description: description}));
      }
    }
    else{
      console.log("Error updating task with title and description: ", data.error)}
    }catch(error){
      console.log("Error updating task: ", error.message);
      }
    }

  const handleTrashOrRestore = async(taskId, restore) => {
    try{
      console.log(taskId);
      const data = await updateTask(taskId, userId, {isTrash: restore})
      if(data){
        console.log(data);
        setTasks(prevTasks => prevTasks.filter(task => task._id != taskId));
        console.log(data);
      if(selectedTask?._id === taskId){
        setSelectedTask(null);
      }
    }
    else{
      console.log("Error while moving task to trash: ", data.error)}
    }catch(error){
      console.log("Error updating task: ", error.message);
      }
    }
  
    const handleTaskPriorityChange = async(taskId, setPriority) => {
      try{
        const data = await updateTask(taskId, userId, {priority: setPriority})
        if(data){
          setTasks(prevTasks => prevTasks.map(task => task._id === taskId ? {...task, priority: setPriority} : task));
        if(selectedTask?._id === taskId){
          setSelectedTask(prevTask=>({...prevTask, priority: setPriority}));
        }
      }
      else{
        console.log("Error while updating task to priority: ", data.error)}
      }catch(error){
        console.log("Error updating task priority: ", error.message);
        }
      }

  const handleDueDateUpdate = async(taskId, date) => {
    try{
      const data = await updateTask(taskId, userId, {dueDate: date})
      if(data){
        setTasks(prevTasks => prevTasks.map(task => task._id === taskId ? {...task, dueDate: date} : task));
      if(selectedTask?._id === taskId){
        setSelectedTask(prevTask=>({...prevTask, dueDate: date}));
        console.log(selectedTask);
      }
    }
    else{
      console.log("Error while updating task to new date: ", data.error)}
    }catch(error){
      console.log("Error updating task date: ", error.message);
      }
    }

  const handleDeleteTask = async(taskId, userId) => {
    try{
      const data = await deleteTask(taskId, userId)  
        if(data){
          setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId))
          toast("Task deleted successfully!");
        if(selectedTask._id === taskId){
          setSelectedTask(null);
        }
      }
      else{
        console.log("Error deleting selected task: ", data.error);
      }
    }catch(error){
    console.log("Error deleting task: ", error.message);
    }
  }
  
  return (
    <div className="w-full flex h-full px-5">
      <Toaster
          toastOptions={{
          removeDelay: 500,
          position: 'bottom-center',
          style: {
          backgroundColor: "#E6E6FA",
          padding: '16px',
          color: '#6A0DAD',
          textAlign: "center",
          },
          }}
      />
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
        <div className="mt-4 h-[calc(100vh-150px)] overflow-hidden hover:overflow-y-auto relative">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div className="group pr-2" key={task._id}>
                <div className={`px-3 py-2 rounded-md ${ selectedTask == task ? "bg-purple-50 hover:bg-purple-100" : "hover:bg-gray-50"}`} 
                  onClick={() => {handleTaskSelection(task)}}>
                  <TaskItem task={task} handleCheckBoxCheck={handleCheckBoxCheck} />
                </div>
                <div className="h-[1px] bottom-0 bg-purple-50 group-hover:invisible z-10"></div>
              </div> 
            )))
          : (
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
      <div className="relative ml-5 w-2/5">
      <div className="absolute w-[1px] h-dvh left-0 z-10 bg-purple-100"></div>
        {selectedTask && <DetailTaskView task={selectedTask} userId={userId} handleCheckBoxCheck={handleCheckBoxCheck} handleEditTask={handleEditTask} handleTrashOrRestore={handleTrashOrRestore} handleTaskPriorityChange={handleTaskPriorityChange} handleDueDateUpdate={handleDueDateUpdate} handleDeleteTask={handleDeleteTask}/>}
      </div>
    </div>
  );
};

export default TasksView;

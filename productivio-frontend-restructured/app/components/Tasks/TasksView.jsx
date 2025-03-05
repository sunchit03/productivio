// app/views/TasksView.jsx

import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";
import { useEffect, useState } from "react";
import { RiProgress5Line } from "react-icons/ri";
import { BsTrash2 } from "react-icons/bs";
import { GiPapers } from "react-icons/gi";
import { FaPencilAlt } from "react-icons/fa";
import { GoSidebarCollapse, GoSidebarExpand  } from "react-icons/go";
import { getTeamTasks, getUserTasks } from "@/app/services/tasks";
import DetailTaskView from "./DetailTaskView";
import { updateTask, deleteTask} from "@/app/services/tasks"
import toast, { Toaster } from 'react-hot-toast';


const TasksView = ({
  title,
  listId = null,
  teamId = null,
  userId,
  taskBarCollapse,
  setTaskBarCollapse,
  membersSectionCollapse,
  setMembersSectionCollapse
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

      if (teamId) {
        filteredTasks = data.filter(task => !task.isTrash && task.team === teamId);
      }
      else {
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
              return !task.isTrash && dueDate >= now && dueDate <= next7Days;
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
      }

      setTasks(filteredTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchTeamTasks = async() => {
    try {
      const data = await getTeamTasks(teamId);

      if (!data) {
        setTasks([]);
        return;
      }

      let filteredTasks = data.filter(task => !task.isTrash && !task.list);
      setTasks(filteredTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  useEffect(() => {
    todayOrNext = title == "Today" || title == "Next 7 Days";
    completedOrTrash = title == "Completed" || title == "Trash";

    if (teamId) {
      fetchTeamTasks();
    }

    if (userId) {
      fetchTasks();
    }
    setSelectedTask(null);
  }, [title, userId]); 

  const handleTaskSelection = (task) => { 
    if (selectedTask !== task) {
      setSelectedTask(task);
    }

    // Collapse sidebar on smaller screens
    if (typeof window !== "undefined" && window.innerWidth < 639) {
      teamId ? setMembersSectionCollapse(true) : setTaskBarCollapse(true);
    }
  }

  const toggleTaskBarCollapse = (e) => {
    e.stopPropagation();
    teamId ? setMembersSectionCollapse(!membersSectionCollapse) : setTaskBarCollapse(!taskBarCollapse);

    // Collapse detailed task view on smaller screens
    if (typeof window !== "undefined" && window.innerWidth < 639) {
      setSelectedTask(null);
    }
  }

  const handleCheckBoxCheck = async (e, taskId, updatedCompletion) => {
    e.stopPropagation();
    try {
        const data = await updateTask(taskId, userId, { isCompleted: updatedCompletion });
        if (data.success) {
          console.log(data);
          setTasks(prevTasks => prevTasks.map(task => task._id === taskId ? {...task, isCompleted: updatedCompletion} : task));

          //Update selectedTask if it's the one being changed
          if (selectedTask?._id === taskId) {
              setSelectedTask(prevTask => ({ ...prevTask, isCompleted: updatedCompletion }));
          }

          if (title === "Completed") {
            setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));

            if (selectedTask?._id === taskId) {
              setSelectedTask(null);
            }
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

  const handleTaskBarDismissal = () => {
    // Collapse task sidebar on smaller screens
    if (typeof window !== "undefined" && window.innerWidth < 639) {
      teamId ? setMembersSectionCollapse(true) : setTaskBarCollapse(true);
    }
  }
  
  return (
    <div className={`relative w-full flex h-full px-5 overflow-hidden`} onClick={handleTaskBarDismissal}>
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
      <div className="w-3/5 h-full mdlg:w-full">
        <div className="flex flex-row items-center">
          {(teamId ? !membersSectionCollapse : !taskBarCollapse) ?
            <GoSidebarExpand size={"1.3em"} className="text-gray-500 cursor-pointer font-thin" onClick={(e) => toggleTaskBarCollapse(e)}/>
            :
            <GoSidebarCollapse size={"1.3em"} className="text-gray-500 cursor-pointer font-thin" onClick={(e) => toggleTaskBarCollapse(e)}/>
          }
          <h2 className="ml-1 text-xl text-black font-semibold my-4">{title}</h2>
        </div>
        {!completedOrTrash && (
          <TaskForm 
            todayOrNext={todayOrNext} 
            listId={listId} 
            teamId={teamId} 
            refresh={fetchTasks} 
            userId={userId} 
            taskBarCollapse={taskBarCollapse}
            membersSectionCollapse={membersSectionCollapse}
          />
        )}
        <div className="mt-4 h-[calc(100vh-140px)] mdlg:w-[100%] overflow-hidden hover:overflow-y-auto relative">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div className="group pr-2" key={task._id}>
                <div className={`px-3 py-2 rounded-md ${ selectedTask?._id == task?._id ? "bg-purple-50 hover:bg-purple-100" : "hover:bg-gray-50"}`} 
                  onClick={(e) => {
                    if (typeof window !== "undefined" && window.innerWidth < 639) {
                      if (!taskBarCollapse || !membersSectionCollapse) {
                        teamId ? setMembersSectionCollapse(true) : setTaskBarCollapse(true);
                      }
                      else {
                        handleTaskSelection(task)
                      }
                    } else {
                      handleTaskSelection(task)
                    }
                  }
                }>
                  <TaskItem task={task} handleCheckBoxCheck={handleCheckBoxCheck} pageTitle={title}/>
                </div>
                <div className={`h-[1px] bottom-0 group-hover:invisible z-10 ${typeof window !== "undefined" && window.innerWidth < 639 && (teamId ? !membersSectionCollapse : !taskBarCollapse) ? "bg-gray-300/90" : "bg-purple-50"}`}></div>
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

      <div className={`relative ml-5 w-2/5 h-full xs:w-full sm:w-[80%] md:w-[75%] mdlg:w-[75%] mdlg:absolute mdlg:right-0 mdlg:bg-white mdlg:shadow-lg mdlg:rounded-lg  mdlg:z-10 ${selectedTask != null ? "mdlg:visible" : "mdlg:collapse" }`}>
      <div className="absolute w-[1px] h-dvh left-0 z-10 bg-purple-100 visible mdlg:invisible"></div>
        {selectedTask && 
          <div className="relative w-full h-full pl-2 pt-2 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}>
            <DetailTaskView 
            task={selectedTask} 
            userId={userId} 
            handleCheckBoxCheck={handleCheckBoxCheck} 
            handleEditTask={handleEditTask} 
            handleTrashOrRestore={handleTrashOrRestore} 
            handleTaskPriorityChange={handleTaskPriorityChange} 
            handleDueDateUpdate={handleDueDateUpdate} 
            handleDeleteTask={handleDeleteTask}
            setSelectedTask={setSelectedTask}
            pageTitle={title}
            />
          </div>
        }
      </div>
    </div>
  );
};

export default TasksView;

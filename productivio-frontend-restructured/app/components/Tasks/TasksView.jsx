// app/views/TasksView.jsx

import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";
import { useEffect, useState } from "react";
import { RiProgress5Line } from "react-icons/ri";
import { BsTextIndentLeft, BsTextIndentRight, BsTrash2 } from "react-icons/bs";
import { GiPapers } from "react-icons/gi";
import { FaPencilAlt } from "react-icons/fa";
import { PiExport } from "react-icons/pi";
import { getTeamTasks, getUserTasks } from "@/app/services/tasks";
import DetailTaskView from "./DetailTaskView";
import { updateTask, deleteTask} from "@/app/services/tasks"
import toast, { Toaster } from 'react-hot-toast';
// import { format, toZonedTime } from "date-fns-tz";
import { format} from "date-fns-tz";
import jsonToCsvExport from 'json-to-csv-export'
import { createNotification } from "@/app/services/notifications";


const TasksView = ({
  title,
  listId = null,
  teamId = null,
  userId,
  mongoUser,
  taskBarCollapse,
  teamMembers,
  setTaskBarCollapse,
  membersSectionCollapse,
  setMembersSectionCollapse
}) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

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
    else if (userId) {
      fetchTasks();
    }
    setSelectedTask(null);
  }, [title, userId]); 

  const handleTaskSelection = (task) => { 
    if (selectedTask !== task) {
      setSelectedTask(task);
      console.log(task);
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


  const formatUpdatedAtTime = (taskUpdatedAt) => {
    // Ensure taskUpdatedAt is valid
    if (!taskUpdatedAt) {
        console.warn("Skipping format: taskUpdatedAt is undefined or null");
        return "No timestamp available";
    }
    let dateObject;
    // Check if taskUpdatedAt is already a Date object
    if (taskUpdatedAt instanceof Date) {
        dateObject = taskUpdatedAt;
    } else if (typeof taskUpdatedAt === "string") {
        // Attempt to parse as a Date
        dateObject = new Date(taskUpdatedAt);
    } else {
        console.error("Invalid taskUpdatedAt type:", typeof taskUpdatedAt);
        return "Invalid Date";
    }
    // Validate the parsed Date
    if (isNaN(dateObject.getTime())) {
        console.error("Invalid Date Conversion:", taskUpdatedAt);
        return "Invalid Date";
    }
    // Define the target timezone for Toronto.
    const timeZone = "America/Toronto";
    // Format the date as "12 March 2025 | 16:53:44 EST"
    return format(dateObject, "dd MMMM yyyy | HH:mm:ss zzz", { timeZone });
};

  const handleCheckBoxCheck = async (e, taskId, updatedCompletion) => {
    e.stopPropagation();
    try {
        const data = await updateTask(taskId, userId, { isCompleted: updatedCompletion });
        if (data.success) {
          console.log(data);
          setTasks(prevTasks => prevTasks.map(task => task._id === taskId ? {...task, isCompleted: updatedCompletion, updatedBy: mongoUser, updatedAt: new Date()} : task));
          if (title === "Completed") {
            setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
            if (selectedTask?._id === taskId) {
              setSelectedTask(null);
            }
          }
        if(!completedOrTrash){
          if (selectedTask?._id === taskId) {
              setSelectedTask(prevTask => ({ ...prevTask, isCompleted: updatedCompletion, updatedBy: mongoUser, updatedAt: new Date()}));
          }
        }
       } else {
            console.log("Error in changing completed state of task:", data.error);
        }
    } catch (error) {
        console.error("Error updating task state:", error.message);
    }
};

const handleTaskAssignment = async(taskId, assignedTo) => {
  // get assigned to user (previous)
  const task = tasks.find(task => task._id === taskId);
  const prevUser = task.assignedTo;

  if (prevUser && prevUser._id !== assignedTo?._id && prevUser._id !== userId) {
    // send notification to prevUser (task-deallocate)
    let dataNotification = await createNotification (
      {
        title: `You have been de-assigned from the task: ${task.title} (${teamId && title})`, 
        type: 'task-deallocate', 
        receiverId: prevUser._id
      }
    )
    
    if (!dataNotification.success) {
      toast.error("Something went wrong, don't worry");
    }
  }
  const data = await updateTask(taskId, userId, {assignedTo: assignedTo?._id});
  if(data.success){
    //send notification to user (assignedTo) (task-allocate)
    
    if (assignedTo && assignedTo._id && assignedTo._id !== userId) {
      let dataNotification = await createNotification (
        {
          title: `You have been assigned a task: ${task.title} (${teamId && title})`, 
          type: 'task-allocate', 
          receiverId: assignedTo._id
        }
      )
      
      if (!dataNotification.success) {
        toast.error("Something went wrong, don't worry");
      }
    }

    setTasks(prevTasks => prevTasks.map(task => task._id === taskId ? {...task, assignedTo: assignedTo, updatedAt: new Date(), updatedBy: mongoUser} : task));

    if(selectedTask?._id === taskId){
      setSelectedTask(prevTask => ({...prevTask, assignedTo: assignedTo, updatedAt: new Date(), updatedBy: mongoUser}))
    }
  }
  else{
    console.log("Errorrrrrr!!!!!!!!");
  }

}


  const handleEditTask = async(taskId, title, description) => {
    try{
      const data = await updateTask(taskId, userId, {title: title, description: (description === "" ? null : description)})
      if(data){
        setTasks(prevTasks => prevTasks.map(task => task._id === taskId ? {...task, title: title, description: (description === "" ? null : description), updatedBy: mongoUser, updatedAt: new Date()} : task));
        toast.success("Task details updated!")
      if(selectedTask?._id === taskId){
        setSelectedTask(prevTask=>({...prevTask, title: title, description: description, updatedBy: mongoUser, updatedAt: new Date()}));
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
        setTasks(prevTasks => prevTasks.filter(task => task._id != taskId));
        if(restore === true){
        toast.success("Task moved to trash!")
        }
        else{
          toast.success("Task restored successfully!")
        }
      if(selectedTask?._id === taskId){
        setSelectedTask(null);
      }
    }
    else{
        console.log("Error while moving task to trash: ", data.error)
        if(restore === true){
          toast.error("Error while moving task to trash.")
          }
          else{
            toast.error("Error while restoring task from trash.")
          }
      }
    }catch(error){
      console.log("Error updating task: ", error.message);
      }
    }
  
    const handleTaskPriorityChange = async(taskId, setPriority) => {
      try{
        const data = await updateTask(taskId, userId, {priority: setPriority})
        if(data){
          setTasks(prevTasks => prevTasks.map(task => task._id === taskId ? {...task, priority: setPriority, updatedBy: mongoUser, updatedAat: new Date()} : task));
        if(selectedTask?._id === taskId){
          setSelectedTask(prevTask=>({...prevTask, priority: setPriority, updatedBy: mongoUser, updatedAat: new Date()}));
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
        setTasks(prevTasks => prevTasks.map(task => task._id === taskId ? {...task, dueDate: date, updatedBy: mongoUser, updatedAt: new Date()} : task));
      if(selectedTask?._id === taskId){
        setSelectedTask(prevTask=>({...prevTask, dueDate: date, updatedBy: mongoUser, updatedAt: new Date()}));
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
          toast.success("Task deleted successfully!");
        if(selectedTask._id === taskId){
          setSelectedTask(null);
        }
      }
      else{
        console.log("Error deleting selected task: ", data.error);
        toast.error("Error while deleting task.")
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

  const handleTasksExport = async () => {
    console.log("exporting");
    jsonToCsvExport({ data: tasks, filename: title + " Tasks" })
    toast.success("Tasks exported successfully!")
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
        <div className="flex items-center justify-between">
          <div className="flex flex-row items-center my-4">
            <div className="p-1 hover:bg-gray-100 hover:rounded-md">
              {(teamId ? !membersSectionCollapse : !taskBarCollapse) ?
                <BsTextIndentRight size={"1.5em"} className="text-gray-500 cursor-pointer font-thin" onClick={(e) => toggleTaskBarCollapse(e)}/>
                :
                <BsTextIndentLeft size={"1.5em"} className="text-gray-500 cursor-pointer font-thin" onClick={(e) => toggleTaskBarCollapse(e)}/>
              }
            </div>
            <h2 className="ml-1 text-xl text-black font-semibold">{title}</h2>
          </div>
          <div className={`p-1 hover:bg-gray-100 hover:rounded-md`}>
            <PiExport 
              size={"1.5em"} 
              title="Export to CSV"
              className={`text-gray-500 font-thin ${tasks.length === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`} 
              onClick={() => tasks.length > 0 && handleTasksExport} />
          </div>
        </div>
        {!completedOrTrash && (
          <TaskForm 
            pageTitle={title}
            todayOrNext={todayOrNext}
            listId={listId} 
            teamId={teamId} 
            refresh={teamId ? fetchTeamTasks : fetchTasks} 
            userId={userId} 
            taskBarCollapse={taskBarCollapse}
            membersSectionCollapse={membersSectionCollapse}
          />
        )}
        <div className="mt-4 h-[calc(100vh-140px)] mdlg:w-[100%] relative lg:overflow-y-auto overflow-y-hidden hover:overflow-y-auto">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div className="group pr-2" key={task._id}>
                <div className={`px-3 py-2 rounded-md ${ selectedTask?._id == task?._id ? "bg-purple-50 hover:bg-purple-100" : "hover:bg-gray-50"}`} 
                  onClick={(e) => {
                    if (typeof window !== "undefined" && window.innerWidth < 639) {
                      if ((!teamId && !taskBarCollapse) || (teamId && !membersSectionCollapse)) {
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
            handleTaskAssignment={handleTaskAssignment}
            pageTitle={title}
            userId={userId} 
            teamId={teamId}
            handleCheckBoxCheck={handleCheckBoxCheck}
            handleEditTask={handleEditTask} 
            handleTrashOrRestore={handleTrashOrRestore} 
            handleTaskPriorityChange={handleTaskPriorityChange} 
            handleDueDateUpdate={handleDueDateUpdate} 
            handleDeleteTask={handleDeleteTask}
            setSelectedTask={setSelectedTask}
            teamMembers={teamMembers}
            formatUpdatedAtTime={formatUpdatedAtTime}
            />
          </div>
        }
      </div>
    </div>
  );
};

export default TasksView;

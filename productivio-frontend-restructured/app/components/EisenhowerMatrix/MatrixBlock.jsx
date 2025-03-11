import { HiOutlinePlusSm } from "react-icons/hi";
import TaskItem from "../Tasks/TaskItem";
import DetailTaskView from "../Tasks/DetailTaskView";
import {updateTask} from "@/app/services/tasks"
import { useState, useEffect } from "react";
import {createTask} from "@/app/services/tasks"

const titleColorMap = {
    "Urgent & Important": "text-red-600",
    "Not Urgent & Important": "text-yellow-600",
    "Urgent & Unimportant": "text-blue-600",
    "Not Urgent & Unimportant": "text-green-600",
};

const MatrixBlock = ({tasks, title, refresh, userId, setTasks}) => {
const [addEditTaskModal,setAddEditTaskModal] = useState(false);
const [selectedTask, setSelectedTask] = useState(null); // Track the task being edited
// Extract text from JSX title prop
const textContent = title.props.children.filter(child => typeof child === "string").join(" ");
const textColor = titleColorMap[textContent] || "text-gray-800"; // Default color

const handleDefaultMatrixPriority = () => {
    let priority;
    switch(textColor){
        case "text-red-600":
            priority = "1";
            break;
        case "text-yellow-600":
            priority = "2";
            break;
        case "text-blue-600":
            priority = "3";
            break;
        default:
            priority="4";
            break;
    }
    return priority;
}

const handleDueDateUpdate = async(taskId, date) => {
    try{
        const data = await updateTask(taskId, userId, {dueDate: date})
        if(data){
        setTasks(prevTasks => prevTasks.map(task => task._id === taskId ? {...task, dueDate: date} : task));
        if(selectedTask?._id === taskId){
        setSelectedTask(prevTask=>({...prevTask, dueDate: date}));
        }
    }
    else{
        console.log("Error while updating task to new date: ", data.error)}
    }catch(error){
        console.log("Error updating task date: ", error.message);
        }
    }

const handleMatrixAddNewTask = async(userId, title, description, dueDate, selectedPriority) => {
    try{
        const data = await createTask({createdBy: userId, title: title, description: ((description.trim() === "" ? null : description)), dueDate: dueDate, priority: selectedPriority});
        if(data){
            setAddEditTaskModal(false);
            refresh();
        }
        else{
            console.log(`Error creating new task with title-${title}: `, data.error);
        }
    }catch(error){
        console.log("Error creating new task: ", error.message)
    }
}

const handleCheckBoxCheck = async (e, taskId, updatedCompletion) => {
e.stopPropagation();
try {
    const data = await updateTask(taskId, userId, { isCompleted: updatedCompletion });
    if (data.success) {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task._id === taskId ? { ...task, isCompleted: updatedCompletion } : task
            )
        );
        if (selectedTask?._id === taskId) {
            setSelectedTask(prevTask => ({ ...prevTask, isCompleted: updatedCompletion }));
        }
    } else {
        console.log("Error in changing completed state of task:", data.error);
    }
} catch (error) {
    console.error("Error updating task state:", error.message);}
};

const handleTrashOrRestore = async(taskId, restore) => {
    try{
      const data = await updateTask(taskId, userId, {isTrash: restore})
      if(data){
        setTasks(prevTasks => prevTasks.filter(task => task._id != taskId));
        setAddEditTaskModal(false);
        setSelectedTask(null);
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

const handleEditTask = async(taskId, title, description) => {
    try{
    const data = await updateTask(taskId, userId, {title: title, description: (description === "" ? null : description)})
    if(data){
        setTasks(prevTasks => prevTasks.map(task => task._id === taskId ? {...task, title: title, description: (description === "" ? null : description)} : task));
    if(selectedTask?._id === taskId){
        setSelectedTask(prevTask=>({...prevTask, title: title, description: description}));
    }
    setAddEditTaskModal(false);
    setSelectedTask(null);
    }
    else{
    console.log("Error updating task with title and description: ", data.error)}
    }catch(error){
    console.log("Error updating task: ", error.message);
    }
    }

const handleTaskSelection = (task) => { 
        if (selectedTask !== task) {
            setSelectedTask(task);
        }
    }

  useEffect(() => {
    if (userId) {
        setSelectedTask(null);
    }
  }, [userId]);

return(
    <div className= "group border rounded-md p-2 bg-white shadow-md h-[43vh] flex flex-col">
        <div className={`text-sm p-2 font-bold flex w-full justify-between items-center`}>
            <div className={`flex items-center gap-2 pb-1  ${textColor}`}>{title} </div>
            <div className="invisible group-hover:visible flex items-center">
                <button className={`hover:bg-gray-300 rounded-sm ${textColor}`} onClick={()=>{setAddEditTaskModal(true)}}>
                    <HiOutlinePlusSm size={20} />
                </button>
            </div>
            {addEditTaskModal &&
            <div className="fixed inset-0 bg-opacity-5 flex flex-col justify-center items-center z-50" onClick={()=>{setAddEditTaskModal(false); setSelectedTask(null)} }> 
                <div className="relative p-2 shadow-xl rounded-md bg-gray-50 min-w-[25%] max-w-[50%] min-h-[50%] md:min-w-[50%] md:min-h-[50%] sm:min-h-[50%] sm:min-w-[75%] flex flex-col justify-between z-50" onClick={(e) => e.stopPropagation()}>
                <DetailTaskView
                setSelectedTask={setSelectedTask}
                handleTrashOrRestore={handleTrashOrRestore}
                handleCheckBoxCheck={handleCheckBoxCheck}
                handleEditTask={handleEditTask}
                task={selectedTask}
                handleMatrixAddNewTask={handleMatrixAddNewTask}
                handleDueDateUpdate={handleDueDateUpdate}
                handleTaskPriorityChange={handleTaskPriorityChange}
                matrixBlockPriority={handleDefaultMatrixPriority}
                userId={userId}/>
                </div>
            </div>
            }

        </div>
        <div className={`${tasks.length === 0 ? "p-2 flex flex-1 justify-center items-center" :  "overflow-hidden hover:overflow-y-auto"}`}>
            {tasks.length > 0 ? (
                tasks.map(task => { return (
                <div className="group-task pr-2" key={task._id}>
                    <div className={`px-3 py-2 rounded-md ${selectedTask == task ? "bg-purple-100 hover:bg-purple-200" : "hover:bg-purple-50"}`} 
                    onClick={() => {handleTaskSelection(task); setAddEditTaskModal(true);}}>
                    <TaskItem handleCheckBoxCheck={handleCheckBoxCheck} task={task} />
                    </div>
                    <div className="h-[1px] bottom-0 bg-purple-50 group-task-hover:invisible z-10"></div>
                </div>
                )})
            ) : 
            (
                <span className="text-sm font-thin text-gray-400">No Tasks</span>
            )}
        </div>
    </div>
);

}
export default MatrixBlock;
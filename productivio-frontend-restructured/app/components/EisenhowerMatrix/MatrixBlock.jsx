
import { HiOutlinePlusSm } from "react-icons/hi";
import { RxDotsHorizontal } from "react-icons/rx";
import TaskItem from "../Tasks/TaskItem";
import EisenHowerTask from "./EisenhowerTask";


import { useState } from "react";

const titleColorMap = {
    "Urgent & Important": "text-red-600",
    "Not Urgent & Important": "text-yellow-600",
    "Urgent & Unimportant": "text-blue-600",
    "Not Urgent & Unimportant": "text-green-600",
  };

const MatrixBlock = ({tasks, title, refresh, userId}) => {
    const [addTaskModal,setAddTaskModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null); // Track the task being edited

      // Extract text from JSX title prop
    const textContent = title.props.children.filter(child => typeof child === "string").join(" ");
    const textColor = titleColorMap[textContent] || "text-gray-800"; // Default color


    return(
        <div className= "group-quad border rounded-md p-2 bg-white shadow-md h-[43vh] flex flex-col">
            <div className={`text-sm p-2 font-bold flex w-full justify-between items-center ${textColor}`}>
                <div className="flex items-center gap-2">
                    {title} 
                </div>
                <div className="invisible group-quad-hover:visible flex items-center gap-2">
                    <button className="hover:bg-gray-300 rounded-sm" onClick={()=>{setAddTaskModal(true)}}>
                        <HiOutlinePlusSm size={20} />
                    </button>
                    <button className="hover:bg-gray-300 rounded-sm" onClick={()=>{}}>
                        <RxDotsHorizontal size={20} />
                    </button>
                </div>

                {addTaskModal && 
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"> 
                    <EisenHowerTask
                    userId={userId}                 
                    onClose={() => {setAddTaskModal(false)}}
                    reloadTasks={refresh}/>
                </div>
                }

            </div>
            <div className="hover:overflow-y-auto relative">
                {tasks.length > 0 ? (
                    tasks.map(task => { return (
                    <div className="group-task pr-2" key={task._id}>
                        <div className={`px-3 py-2 rounded-md ${selectedTask == task ? "bg-purple-50 hover:bg-purple-50" : "hover:bg-gray-50"}`} 
                        onClick={() => handleTaskSelection(task)}>
                        <TaskItem task={task} />
                        </div>
                        <div className="h-[1px] bottom-0 bg-purple-50 group-task-hover:invisible z-10"></div>
                    </div>
                    )})
                ) : 
                (
                    <>
                        <span className="text-center text-base font-medium">No tasks</span>
                    </>
                )}
            </div>
        </div>
    );

}
export default MatrixBlock;
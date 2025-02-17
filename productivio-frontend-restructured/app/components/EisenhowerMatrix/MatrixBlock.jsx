
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
    const [isVisible, setIsVisible] = useState(false);

      // Extract text from JSX title prop
    const textContent = title.props.children.filter(child => typeof child === "string").join(" ");
    const textColor = titleColorMap[textContent] || "text-gray-800"; // Default color


    return(
        <div className= "border rounded-md p-2 bg-white hover:bg-gray-100 shadow-md h-70 flex flex-col"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}>
            <div className={`text-sm p-2 font-bold flex w-full justify-between items-center ${textColor}`}>
            <div className="flex items-center gap-2">
                {title} 
                </div>
            <div className="flex items-center gap-2">
                {isVisible && (
                    <button className="hover:bg-gray-300 rounded-sm" onClick={()=>{setAddTaskModal(true)}}><HiOutlinePlusSm size={20} /></button>
                )}
                    {addTaskModal && 
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"> 
                        <EisenHowerTask
                        userId={userId}                 
                        onClose={() => {setAddTaskModal(false)}}
                        reloadTasks={refresh}/>
                    </div>
                    }
                    
                {isVisible && (
                    <button className="hover:bg-gray-300 rounded-sm" onClick={()=>{}}> <RxDotsHorizontal size={20} /></button>
                )}
                </div>
                </div>
                <div className={`${tasks.length === 0 ? "p-2 flex flex-1 justify-center items-center" :  "overflow-hidden hover:overflow-y-auto"}`}>
                { tasks.length === 0 ? 
                (<p className="text-sm text-gray-500">
                    No tasks</p>
                ) : (tasks.map(task => (
                  //<div className="flex flex col" key={task._id}>
                  <div className="group pr-2" key={task._id}>
                    <div className= "px-3 py-2 rounded-md hover:bg-gray-200">
                    <TaskItem task={task}/>
                    </div>
                    <div className="h-[1px] bottom-0 bg-gray-200 group-hover:invisible z-10"></div>
                  </div>
                    )))}
                </div>
              </div>
    );

}
export default MatrixBlock;
import { useEffect, useState } from "react";
import { IoIosFlag } from "react-icons/io";
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";
import Calendar from 'react-calendar';
import { BsCalendar2Date } from "react-icons/bs";
import { IoCalendarOutline, IoClose } from "react-icons/io5";
import { GrClear } from "react-icons/gr";
import { RiDeleteBin5Line } from "react-icons/ri";
import toast from 'react-hot-toast';

const DetailTaskView = ( { task, userId, handleCheckBoxCheck, handleEditTask, handleTrashOrRestore, handleTaskPriorityChange, 
    handleDueDateUpdate, handleDeleteTask, defaultPriority, handleMatrixAddNewTask, matrixEditTask, setSelectedTask} ) => {

    const [completion, setCompletion] = useState(task?.isCompleted || matrixEditTask?.isCompleted || false);
    const [datePicker, setDatePicker] = useState(false);
    const [title, setTitle] = useState("");
    const [editModelVisible, setEditModelVisible] = useState(false);
    const [description, setDescription] = useState("");
    const [selectedPriority, setSelectedPriority] = useState(task?.priority || matrixEditTask?.priority || defaultPriority);
    const [dueDate, setDueDate] = useState(null);
    const [dueDateSelected, setDueDateSelected] = useState(false);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let initTaskTitle = task?.title;
    let initMatrixTitle = matrixEditTask?.title;
    let initTaskDescription = task?.description || "";
    let initMatrixDescription = matrixEditTask?.description || "";
    let taskIsEnable = task ? ((initTaskTitle !== title && title.trim() !== "")  || (initTaskDescription !== description)) : title.trim() !== "";
    let matrixEditTaskIsEnable = matrixEditTask ? ((initMatrixTitle !== title && title.trim() !== "") || (initMatrixDescription !== description)) : title.trim() !== "";

    const returnString = (dateVal) =>  {
        let now = new Date();
        now.setHours(0, 0, 0, 0);
        let date = dateVal.getDate().toString();
        let month = monthNames[dateVal.getMonth()];
        let year = dateVal.getFullYear();
        let dateString = `${date} ${month} ${year !== now.getFullYear() ? year.toString() : ""}`;
        return dateString;
      }
    
      const formatDate = (dateVal) => {
        if (!dateVal) return { dateText: "", color: "" };

        let taskDate = new Date(dateVal);
        let now = new Date();
        now.setHours(0, 0, 0, 0); // start from midnight 00:00:00
    
        const tempDateVal = new Date(taskDate);
        tempDateVal.setHours(0, 0, 0, 0);
    
        const todayEnd = new Date(now);
        todayEnd.setHours(23, 59, 59, 999);
    
    
        // Get yesterday’s date and set its time to midnight
        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
    
        //extract date month and year(ignores time)
        yesterday.setHours(0, 0, 0, 0);
        
        if (tempDateVal.getTime() < yesterday.getTime()) { 
          return { dateText: returnString(tempDateVal), color: "text-red-500" };
        }
    
        if (tempDateVal.getTime() === yesterday.getTime()) {
          return { dateText: "Yesterday", color: "text-red-500" };
        }
    
        if (tempDateVal.getTime() <= todayEnd.getTime() && tempDateVal.getTime() >= now.getTime()) {
          return { dateText: "Today", color: "text-indigo-500" };
        }
        
        let next7Days = new Date();
        next7Days.setDate(now.getDate() + 7);
        next7Days.setHours(0, 0, 0, 0);
      
        if (tempDateVal.getTime() <= next7Days.getTime() && tempDateVal.getTime() > now.getTime()) {
          return {dateText: dayNames[tempDateVal.getDay()], color: "text-indigo-500"};
        }
    
        return {dateText: returnString(tempDateVal), color: "text-indigo-500"};
      };

      const getPriorityColor = () => {
        switch (selectedPriority) {
            case '1': return "text-red-500"; // High
            case '2': return "text-yellow-500"; // Medium
            case '3': return "text-blue-500"; // Low
            case '4': return "text-teal-400"; // None       }
        };
    }

    useEffect(() => {
        if (task || matrixEditTask) {
            setTitle(task?.title || matrixEditTask?.title || "");
            setDescription(task?.description || matrixEditTask?.description || "");
            setSelectedPriority(task?.priority || matrixEditTask?.priority || selectedPriority);
            setCompletion(task?.isCompleted ?? matrixEditTask?.isCompleted ?? false);
    
            if (task?.dueDate || matrixEditTask?.dueDate) {
                setDueDateSelected(true);
                setDueDate(new Date(task?.dueDate || matrixEditTask?.dueDate));
            } else {
                setDueDate(null);
                setDueDateSelected(false);
            }
        }
    }, [task, matrixEditTask]);

    const handleDueDateSelection = (date) => {
        const updatedDate = new Date(date);
        updatedDate.setHours(23, 59, 59, 999); // 11:59:59 PM
        if(task || matrixEditTask){
            handleDueDateUpdate((task?._id ||matrixEditTask?._id), updatedDate);
        }
        setDueDate(updatedDate); //set new date
        setDueDateSelected(true);
    }

    const clearDueDate = () => {
        if(task || matrixEditTask){
            handleDueDateUpdate(task?._id || matrixEditTask?._id, null);
        }
        setDueDate(null);
        setDueDateSelected(false);
    }
    
    const handlePriorityChange = (priority) => {
        setSelectedPriority(priority);

        if(task || matrixEditTask){
        handleTaskPriorityChange((task?._id || matrixEditTask?._id), priority)
        }
    }

    const handleAddEditTask = () => {
        if(task){
            if(task.isTrash)
            {
                // task restored successfully
                handleTrashOrRestore(task._id, false);
                toast.remove();
                toast("Task restored successfully!")
            }
            else{
                handleEditTask(task._id, title, description);
            }
        }
        else if(matrixEditTask){
            handleEditTask(matrixEditTask._id, title, description);
        }
        else
            handleMatrixAddNewTask(userId, title, description, dueDate, selectedPriority, completion);
    }

    return ( 
        <div className={`${task ? `relative w-full h-full pl-2 pt-2 flex flex-col justify-between` : `p-2 shadow-xl rounded-md bg-gray-50 w-3/12 h-3/6 flex flex-col justify-between z-50`}`} 
            onClick={(e) => e.stopPropagation()}
        >
            <div>
            {/* topmost row of detailtask view - contains checkbox if task exists, calendar, date if task date exists, flag for priority */}
                <div className="flex items-center justify-between p-2 w-full">
                    <div className="flex items-center gx-2">
                        {task && 
                            <span className="cursor-pointer hidden mdlg:inline">
                                <IoClose size={"1.5em"} className="text-slate-400" onClick={() => setSelectedTask(null)}/>
                            </span>
                        }
                        {/* Checkbox */}
                        {(task || matrixEditTask) && (
                        (task?.isCompleted || matrixEditTask?.isCompleted) ? (
                            <MdCheckBox 
                            className={`cursor-pointer ${getPriorityColor()}`}
                            size={20} 
                            onClick={(e)=>handleCheckBoxCheck(e, (task?._id || matrixEditTask?._id), false)}
                            />
                        ) : (
                            <MdCheckBoxOutlineBlank
                            className={`cursor-pointer ${getPriorityColor()}`} 
                            size={20} 
                            onClick={(e)=>handleCheckBoxCheck(e, (task?._id || matrixEditTask?._id), true)}
                            />
                        )
                        )
                        }
                        {(task || matrixEditTask) && <span className="mx-1 text-gray-400">|</span>}
                        {(task && dueDateSelected) || (matrixEditTask && dueDateSelected) || dueDateSelected ?
                        <>
                            <div 
                            className={`flex items-center cursor-pointer p-1 hover:bg-gray-100 hover:rounded-md ${dueDate ? formatDate(dueDate).color : ""}`} 
                            onClick={() => setDatePicker((val) => !val)}
                            >
                            <BsCalendar2Date className="mr-1" size={19} />
                            {dueDate && <span className="text-sm mt-1">{formatDate(dueDate).dateText}</span>}
                            </div>

                            {/* Clear Date Button  */}
                            {datePicker && (
                            <GrClear 
                                className="cursor-pointer text-black" 
                                size={20} 
                                onClick={clearDueDate}
                            />
                            )}
                            </> : 
                            (
                            <div 
                            className={"flex items-center cursor-pointer p-1 text-gray-500 hover:bg-gray-100 hover:rounded-md "} 
                            onClick={() => setDatePicker((val) => !val)}
                            >
                            <IoCalendarOutline className="mr-1" size={20} />
                            <span className="text-sm mt-1">Due Date</span>
                            </div>
                            )
                        }
                        {/* Date Picker (Calendar) */}
                        {datePicker && (
                        <div className={task ? `absolute top-12 left-0 mt-2 z-50 bg-white shadow-lg p-2 border border-gray-300 rounded-md` :`absolute top-72 left-60 z-50 bg-gray-100 shadow-lg p-2 border border-gray-300 rounded-md`}>
                            <Calendar 
                            className="text-black" 
                            onChange={handleDueDateSelection} 
                            value={dueDate || null} 
                            />
                        </div>
                        )}
                    </div>

                    {/* Right Side: Priority Flag - Set priority */ }
                    <div className="relative p-1">
                        <Menu 
                        menuButton={
                            <MenuButton className="cursor-pointer">
                            <IoIosFlag size={20} className={`text-xl ${getPriorityColor()}`} />
                            </MenuButton>
                        }
                        transition
                        >
                        <MenuItem onClick={() => handlePriorityChange("1")}>
                            <IoIosFlag size={20} className="text-red-500 mr-2" /> High
                        </MenuItem>
                        <MenuItem onClick={() => handlePriorityChange("2")}>
                            <IoIosFlag size={20} className="text-yellow-500 mr-2" /> Medium
                        </MenuItem>
                        <MenuItem onClick={() => handlePriorityChange("3")}>
                            <IoIosFlag size={20} className="text-blue-500 mr-2" /> Low
                        </MenuItem>
                        <MenuItem onClick={() => handlePriorityChange("4")}>
                            <IoIosFlag size={20} className="text-green-500 mr-2" /> None
                        </MenuItem>
                        </Menu>
                    </div>
                </div>
                <div className={`h-[1px] w-full bottom-0 ${task ? "bg-purple-100" : "bg-gray-100"} z-10`}></div>
                {/* create two fields - to display title or description */}
                <div className="flex flex-col pt-2 gap-3">
                    <input
                        type = "text"
                        value={title}
                        placeholder="What would you like to do?"
                        onChange={(e)=> setTitle(e.target.value)}
                        className={`text-xl text-black text-base font-bold ${!task ? "bg-gray-50" : "bg-purple-50"}  p-1 rounded-sm focus:outline-none`}
                    />
                    <input
                        type = "text"
                        value={description || ""}
                        placeholder="Would you like to add task description?"
                        onChange={(e)=> setDescription(e.target.value)}
                        className={`text-sm text-gray-500 text-base font-thin ${!task ? "bg-gray-50" : "bg-purple-50"} p-1 rounded-sm focus:outline-none`}
                    />    
                </div>
            </div>
            {/* update button and  trash button*/}
            <div className="relative">
                <div className={`flex space-x-1 ${task ? "mb-2" : ""}`}>
                    {task && (
                        <button disabled={task.isTrash ? false : !taskIsEnable} 
                            onClick={handleAddEditTask} 
                            className={`flex-grow bottom-5 right-2 text-center font-thin p-2 rounded ${ (task.isTrash || taskIsEnable) ? "text-purple-600 bg-purple-100 hover:bg-purple-200" : "bg-purple-50 text-purple-300 cursor-not-allowed"}`}>
                            {task.isTrash ? "Restore" : "Update"}
                        </button>)}
                    {matrixEditTask && (
                        <button disabled={!matrixEditTaskIsEnable} 
                            onClick={handleAddEditTask} 
                            className={`flex-grow bottom-5 right-2 text-center p-2 rounded ${ matrixEditTaskIsEnable ? "text-gray-400 bg-gray-200 hover:bg-gray-300" : "bg-gray-200 text-gray-300 cursor-not-allowed"}`}>
                                Update
                        </button>)}
                        {(!task && !matrixEditTask) && (<button disabled={!taskIsEnable}
                            onClick={handleAddEditTask} 
                            className={`flex-grow bottom-5 right-2 text-center p-2 rounded ${ taskIsEnable ? "text-gray-400 bg-gray-200 hover:bg-gray-300" : "bg-gray-200 text-gray-300 cursor-not-allowed"}`}>
                            Create
                        </button>)}
                    { task && ( 
                        <div onClick={()=>{setEditModelVisible(true)}} className="cursor-pointer flex-shrink-0">
                            <RiDeleteBin5Line className="rounded text-purple-700 bg-purple-100 hover:bg-purple-200 p-2"  size={40}/>
                        </div>
                    )}
                </div>
            </div>
            {editModelVisible && (
                <div className="fixed inset-0 flex items-start justify-center bg-gray-900 bg-opacity-0 z-50 top-10 drop-shadow-xl">
                    <div className="xs:w-5/6 xssm:w-4/5 mdlg:w-3/5 bg-white p-6 rounded-md shadow-lg w-2/5">
                        <h2 className="text-lg font-semibold mb-4 text-black">{!task?.isTrash ? `Are you sure that you want to move task "${initTaskTitle}" to trash?` : `Are you sure you want to delete the task "${initTaskTitle}" permanently?`}</h2>           
                        <div className="flex justify-between mt-8">
                            <div className="flex-1"></div>
                                <div className="flex flex-1 justify-stretch">
                                    {!task.isTrash ? (
                                        <div className="flex flex-1 justify-stretch">   
                                            <button type= "button" onClick={()=>{setEditModelVisible(false)}} className="mr-2 px-4 py-2 flex-1 border border-gray-400 bg-white text-gray-500 rounded hover:bg-gray-100">
                                                No
                                            </button>                        
                                            <button type= "button" onClick={()=>{handleTrashOrRestore(task._id, true); setEditModelVisible(false); toast("Task moved to trash!")}} className="px-4 py-2 flex-1 bg-violet-500 text-white rounded hover:bg-violet-500/75">
                                                Yes
                                            </button>
                                            {/* moved to trash */}
                                        </div> 
                                        ) : (
                                        <div className="flex flex-1 justify-stretch">                               
                                            <button type= "button" onClick={()=>{setEditModelVisible(false)}} className="mr-2 px-4 py-2 flex-1 border border-gray-400 bg-white text-gray-500 rounded hover:bg-gray-100">
                                                Cancel
                                            </button>
                                            <button type= "button" onClick={(e)=>{handleDeleteTask(task._id, userId); setEditModelVisible(false);}} className="px-4 py-2 flex-1 bg-violet-500 text-white rounded hover:bg-violet-500/75">
                                                Delete
                                            </button>
                                            {/* delete the task permanently */}
                                        </div> 
                                    )}
                                </div>
                        </div>
                    </div>
                </div>
                )}
        </div>
    );
}

export default DetailTaskView;
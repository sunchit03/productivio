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
    handleDueDateUpdate, handleDeleteTask, matrixBlockPriority, handleMatrixAddNewTask, setSelectedTask, pageTitle=""} ) => {

    const [completion, setCompletion] = useState(task?.isCompleted || false);
    const [datePicker, setDatePicker] = useState(false);
    const [title, setTitle] = useState("");
    const [deleteModal, setDeleteModal] = useState(false);
    const [description, setDescription] = useState("");
    const [selectedPriority, setSelectedPriority] = useState(task?.priority || matrixBlockPriority);
    const [dueDate, setDueDate] = useState(null);
    const [dueDateSelected, setDueDateSelected] = useState(false);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let initTaskTitle = task?.title;
    let initTaskDescription = task?.description || "";
    let taskIsEnable = task ? ((initTaskTitle !== title && title.trim() !== "")  || (initTaskDescription !== description)) : title.trim() !== "";

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
        if(task){
            setTitle(task?.title || "");
            setDescription(task?.description || "");
            setSelectedPriority(task?.priority || selectedPriority);
            setCompletion(task?.isCompleted || false);
    
            if (task?.dueDate) {
                setDueDateSelected(true);
                setDueDate(new Date(task?.dueDate));
            } else {
                setDueDateSelected(false);
                setDueDate(null);
            }
        }
        else{
            setTitle("");
            setDueDateSelected(false);
            setDueDate(null);
        }
    }, [task]);

    const handleDueDateSelection = (date) => {
        const updatedDate = new Date(date);
        updatedDate.setHours(23, 59, 59, 999); // 11:59:59 PM
        if(task){
            handleDueDateUpdate(task?._id , updatedDate);
        }
        setDueDate(updatedDate); //set new date
        setDueDateSelected(true);
    }

    const clearDueDate = () => {
        if(task){
            handleDueDateUpdate(task?._id, null);
        }
        setDueDate(null);
        setDueDateSelected(false);
    }
    
    const handlePriorityChange = (priority) => {
        setSelectedPriority(priority);

        if(task){
        handleTaskPriorityChange(task?._id, priority)
        }
    }

    const handleAddEditTask = () => {
        if(task){
            if(pageTitle && pageTitle === "Trash")
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
        else
            handleMatrixAddNewTask(userId, title, description, dueDate, selectedPriority, completion);
    }

    return ( 
        <>
            <div>
            {/* topmost row of detailtask view - contains checkbox if task exists, calendar, date if task date exists, flag for priority */}
                <div className="flex items-center justify-between p-2 w-full">
                    <div className="flex items-center gx-2">
                        
                        {task && pageTitle !== "" &&
                        (<span className="cursor-pointer hidden mdlg:inline">
                            <IoClose size={"1.5em"} className="text-slate-400" onClick={() => setSelectedTask(null)}/>
                        </span>)
                        }
                        {/* Checkbox */}
                        {task && (
                        task?.isCompleted ? (
                            <MdCheckBox
                            size={20} 
                            className={pageTitle === "Trash" ? `cursor-not-allowed mr-2 text-gray-400` : `mr-2 cursor-pointer ${getPriorityColor()}`} 
                            onClick={pageTitle !== "Trash" ? (e)=>handleCheckBoxCheck(e, task?._id, false) : undefined}
                            />
                        ) : (
                            <MdCheckBoxOutlineBlank
                            size={20} 
                            className={pageTitle === "Trash" ? `cursor-not-allowed mr-2 text-gray-400` : `mr-2 cursor-pointer ${getPriorityColor()}`} 
                            onClick={pageTitle !== "Trash" ? (e)=>handleCheckBoxCheck(e, task?._id, true) : undefined}                            />
                        )
                        )
                        }
                        {task && <span className="mx-1 text-gray-400">|</span>}
                        {(task && dueDateSelected) || dueDateSelected ?
                        <>
                            <div
                            className={`flex items-center ${pageTitle === "Trash" ? "cursor-not-allowed" : "cursor-pointer hover:bg-gray-100 hover:rounded-md"} p-1 ${(dueDate && pageTitle !== "Trash") ? formatDate(dueDate).color : "text-gray-400"}`} 
                            onClick={() => setDatePicker((val) => !val)}
                            >
                            <BsCalendar2Date className="mr-1" size={19} />
                            {dueDate && <span className="text-sm mt-1">{formatDate(dueDate).dateText}</span>}
                            </div>

                            {/* Clear Date Button  */}
                            {datePicker && pageTitle !== "Trash" && (
                            <GrClear 
                                className="cursor-pointer text-gray-400" 
                                size={20} 
                                onClick={clearDueDate}
                            />
                            )}
                            </> : 
                            (
                            <div 
                            className={`flex items-center ${pageTitle === "Trash" ? "cursor-not-allowed" : "cursor-pointer hover:bg-gray-100 hover:rounded-md "} p-1 text-gray-500`} 
                            onClick={() => setDatePicker((val) => !val)}
                            >
                            <IoCalendarOutline className="mr-1" size={20} />
                            <span className="text-sm mt-1">Due Date</span>
                            </div>
                            )
                        }
                        {/* Date Picker (Calendar) */}
                        {datePicker && pageTitle !== "Trash" && (
                        <div className={task ? `absolute top-12 left-0 mt-2 z-50 bg-white shadow-lg p-2 border border-gray-300 rounded-md` :`absolute top-72 left-60 z-50 bg-gray-100 shadow-lg p-2 border border-gray-300 rounded-md`}>
                            <Calendar 
                            className="text-black" 
                            onChange={handleDueDateSelection} 
                            value={task ? dueDate : null} 
                            />
                        </div>
                        )}
                    </div>

                    {/* Right Side: Priority Flag - Set priority */ }
                    <div className="relative p-1">
                        <Menu
                        menuButton={
                            <MenuButton disabled={pageTitle === "Trash"} className={pageTitle === "Trash" ? `cursor-not-allowed` : `cursor-pointer`}>
                            <IoIosFlag size={20} className={`text-xl ${pageTitle === "Trash" ? "text-gray-400" : `${getPriorityColor()}`}`} />
                            </MenuButton>
                        }
                        > 
                        <>
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
                        </>
                        </Menu>
                    </div>
                </div>
                <div className="h-[1px] w-full bottom-0 bg-purple-100 z-10"></div>
                {/* create two fields - to display title or description */}
                <div className="flex flex-col pt-2 pr-1 gap-3">
                    <input
                        type = "text"
                        value={title}
                        placeholder="What would you like to do?"
                        onChange={(e)=> setTitle(e.target.value)}
                        disabled={pageTitle === "Trash"}
                        className={`${pageTitle === "Trash" ? "cursor-not-allowed" : ""} text-xl text-black font-bold  p-1 rounded-sm focus:outline-none`}
                    />
                    <article className="text-wrap w-full">
                        <textarea
                            type = "text"
                            value={description || ""}
                            placeholder="Would you like to add a task description?"
                            onChange={(e)=> setDescription(e.target.value)}
                            disabled={pageTitle === "Trash"}
                            className={`${pageTitle === "Trash" ? "cursor-not-allowed" : ""} resize-y w-full block text-sm text-gray-500 font-thin p-1 rounded-sm focus:outline-none`}
                            rows={3}
                        />  
                    </article>  
                </div>
            </div>
            {/* update button and  trash button*/}
            <div className="relative">
                <div className={`flex space-x-1 ${task ? "mb-2" : ""}`}>
                    {task && (
                        <button disabled={pageTitle && pageTitle === "Trash" ? false : !taskIsEnable} 
                            onClick={handleAddEditTask} 
                            className={`flex-grow bottom-5 right-2 text-center font-thin p-2 rounded ${ (pageTitle === "Trash" || taskIsEnable) ? "text-purple-600 bg-purple-100 hover:bg-purple-200" : "bg-purple-50 text-purple-300 cursor-not-allowed"}`}>
                            {pageTitle && pageTitle === "Trash" ? "Restore" : "Update"}
                        </button>)}
                        {!task && (<button disabled={!taskIsEnable}
                            onClick={handleAddEditTask} 
                            className={`flex-grow bottom-5 right-2 text-center p-2 rounded ${ taskIsEnable ? "text-gray-400 bg-gray-200 hover:bg-gray-300" : "bg-gray-200 text-gray-300 cursor-not-allowed"}`}>
                            Create
                        </button>)}
                    { task && ( 
                        <div onClick={()=>{setDeleteModal(true)}} className="cursor-pointer flex-shrink-0">
                            <RiDeleteBin5Line className="rounded text-purple-700 bg-purple-100 hover:bg-purple-200 p-2" size={40}/>
                        </div>
                    )}
                </div>
            </div>
            {deleteModal && (
                <div className="fixed inset-0 flex items-start justify-center bg-gray-900 bg-opacity-0 z-50 top-10 drop-shadow-xl">
                    <div className="xs:w-5/6 xssm:w-4/5 mdlg:w-3/5 bg-white p-6 rounded-md shadow-lg w-2/5">
                        <h2 className="text-lg font-semibold mb-4 text-black">{pageTitle === "Trash" ? `Delete Task?` : `Trash Task?`}</h2>   
                        <p className="text-black font-thin mb-2">{pageTitle !== "Trash" ? `Are you sure that you want to move task "${initTaskTitle}" to trash?` : `Are you sure you want to delete the task "${initTaskTitle}"?`}</p>        
                        <div className="flex justify-between mt-8">
                            <div className="flex-1"></div>
                                <div className="flex flex-1 justify-stretch">
                                    <div className="flex flex-1 justify-stretch">                               
                                        <button type= "button" onClick={()=>{setDeleteModal(false)}} className="mr-2 px-4 py-2 flex-1 border border-gray-400 bg-white text-gray-500 rounded hover:bg-gray-100">
                                            Cancel
                                        </button>
                                        <button type= "button" onClick={pageTitle === "Trash" ? ()=>{handleDeleteTask(task?._id, userId); setDeleteModal(false);} : ()=>{handleTrashOrRestore(task?._id, true); setDeleteModal(false);}} className="px-4 py-2 flex-1 bg-violet-500 text-white rounded hover:bg-violet-500/75">
                                            Delete
                                        </button>
                                        {/* delete the task permanently */}
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
                )}
        </>
    );
}

export default DetailTaskView;
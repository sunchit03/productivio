import { useEffect, useState } from "react";
import { IoIosFlag } from "react-icons/io";
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";
import Calendar from 'react-calendar';
import { BsCalendar2Date } from "react-icons/bs";
import { IoCalendarOutline, IoClose } from "react-icons/io5";
import { GrClear } from "react-icons/gr";
import { FaFileUpload } from "react-icons/fa";
import { RiDeleteBin5Line, RiFileDownloadFill } from "react-icons/ri";
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOption, ComboboxOptions, Label, Field} from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'


const DetailTaskView = ( { task, userId, handleCheckBoxCheck, handleEditTask, handleTrashOrRestore, handleTaskPriorityChange, 
    handleDueDateUpdate, handleDeleteTask, matrixBlockPriority, handleMatrixAddNewTask, setSelectedTask, pageTitle="", teamId, teamMembers, formatUpdatedAtTime, handleTaskAssignment} ) => {

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
    const [assignedToTeamMember, setAssignedToTeamMember] = useState(null);
    const [query, setQuery] = useState("");
    const [filteredMembers, setFilteredMembers] = useState(teamMembers);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // only Trigger this function when files are dropped
    const onDrop = useCallback((acceptedFiles) => {
        setUploadedFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
        console.log("Dropped files:", uploadedFiles);
        // Can make a POST call here to upload files
    }, [uploadedFiles]);

    const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'application/pdf': ['.pdf'],
            'image/html': ['.htm','.html'],
            'text/jpeg': ['.jpeg','.jpg']
          }
    })

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
            case '4': return "text-teal-400"; // None
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

    useEffect(() => {
        if (teamId && teamId !== null) {
            const filtered = teamMembers.filter(member =>
                member?.email.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredMembers(filtered.slice(0, 5));
        }
    
      }, [query, teamMembers]);

    useEffect(() => {
        if (teamId && task) {
            console.log(task.assignedTo);
            setAssignedToTeamMember((task.assignedTo !== "undefined" && task.assignedTo !== null) ? task.assignedTo : null)
            setQuery(task.assignedTo?.email || "");
        }
    }, [task, teamId])

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
            }
            else{
                handleEditTask(task._id, title, description);
            }
        }
        else
            handleMatrixAddNewTask(userId, title, description, dueDate, selectedPriority, completion);
    }

    const handleDeleteFile = (number) => {
        console.log(`delete delete delete!!!!!! ${number}`);
    }

    const handleDownloadFile = (number) => {
        console.log(`Downloaded file ${number}`);
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
                        <div className={(task && pageTitle !== "") || (teamId && teamId !== null) ? `absolute top-12 left-0 mt-2 z-50 bg-white shadow-lg p-2 border border-gray-300 rounded-md` :`absolute top-56 left-60 z-50 bg-gray-100 shadow-lg p-2 border border-gray-300 rounded-md`}>
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
                <div className="flex flex-col pt-2 pr-1 gap-4">
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
                    {uploadedFiles.length < 2 &&
                        <div disabled={pageTitle === "Trash"} {...getRootProps({className: pageTitle !== "Trash" ? "flex bg-purple-50 hover:bg-purple-100 hover: cursor-pointer w-full text-gray-500 font-thin items-center rounded-md p-2 text-md justify-center" : "cursor-not-allowed flex bg-gray-100 w-full text-gray-500 font-thin items-center rounded-md p-2 text-md justify-center"})}>
                        <input disabled={pageTitle === "Trash"} {...getInputProps()} />
                        {
                            <>
                                <span className="mr-1"><FaFileUpload /></span>  
                                <span>Click here to upload files</span>
                            </>                      
                        }
                        </div>}
                        {uploadedFiles.length > 0 && 
                        <div>
                            <h2 className="font-bold text-md mb-2 text-gray-400">Uploaded files:</h2>
                            <div>
                            {uploadedFiles.map((file, index) => (
                                <div key={index} className="flex items-center mb-2 p-2 w-full rounded-md text-gray-600 bg-gray-100 justify-between">

                                <span>{file.name}</span>
                                <div className="flex">
                                <RiFileDownloadFill disabled={pageTitle === "Trash"} className={`mr-2 ${pageTitle === "Trash" ? "cursor-not-allowed" : "cursor-pointer"}`} onClick= {pageTitle !== "Trash" ? () => handleDownloadFile(index) : () => console.log("Disabled upload!")} />
                                <RiDeleteBin5Line disabled={pageTitle === "Trash"} className= {pageTitle === "Trash" ? "cursor-not-allowed" : "cursor-pointer"} onClick={pageTitle !== "Trash" ? () => handleDeleteFile(index) : () => console.log("Disabled delete!")} />
                                </div>
                                </div>
                            ))}
                            </div>
                        </div>
                        }

                    {task && teamId && teamId !== null && (
                    <div className="grid grid-cols-5 grid-rows-4 gap-2">
                        <div className="col-span-2 text-gray-700 text-sm items-center">
                            <Field>
                                <Label className="font-bold">Assigned To:</Label>
                            </Field>
                        </div>
                        <div className="col-span-3">
                            <Combobox
                                value={assignedToTeamMember}
                                onChange={(selected) => { 
                                console.log(selected);
                                    if (selected !== "Unassigned" && (assignedToTeamMember === null || assignedToTeamMember?._id !== selected?._id)) {
                                        setAssignedToTeamMember(selected);
                                        // console.log("1   " + selected.email);
                                    } else if (selected === "Unassigned" && assignedToTeamMember !== null) {
                                        setAssignedToTeamMember(null);
                                        // console.log("2   " + selected);
                                    }
                                    handleTaskAssignment(task._id, selected === "Unassigned" ? null : selected)
                                }}
                                as="div" 
                                className="relative text-gray-700 font-thin"
                            >
                                <div className="relative w-full">
                                    <ComboboxInput
                                        className="w-full border rounded-lg py-1.5 pr-8 pl-3 text-sm text-gray-700"
                                        displayValue={(memberOpt) => memberOpt === "Unassigned" || assignedToTeamMember === null ? "Unassigned" :  memberOpt?.email || assignedToTeamMember?.email || ""}
                                        //value={query}
                                        placeholder="Select Team Member"
                                        onChange={(event) => setQuery(event.target.value)}
                                        // onBlur={() => setQuery(assignedToTeamMember?.email)}
                                        />
                                        <ComboboxButton className="absolute inset-y-0 right-0 px-2.5">
                                        <ChevronDownIcon onClick={() => setQuery("")} className="size-4 text-gray-700" />
                                    </ComboboxButton>
                                </div>

                                {/* Dropdown Options */}
                                <ComboboxOptions 
                                transition
                                className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300 max-h-60 overflow-auto transition duration-200 ease-in data-[leave]:data-[closed]:opacity-0">
                        
                                    <ComboboxOption 
                                        key={null}
                                        value={"Unassigned"} 
                                        className="group flex cursor-pointer items-center px-3 py-2 text-xs hover:bg-gray-100"
                                        >
                                        <CheckIcon className={`size-4 text-gray-700 ${assignedToTeamMember === null ? "opacity-100" : "opacity-0"}`} />
                                        <span className="text-gray-700 ml-2">Unassigned</span>
                                    </ComboboxOption>

                                    {filteredMembers.map((memberOpt) => (
                                    <ComboboxOption 
                                        key={memberOpt._id} 
                                        value={memberOpt} 
                                        className="group flex cursor-pointer items-center px-3 py-2 text-xs hover:bg-gray-100"
                                    >
                                        {/* opacity-0 group-aria-selected:opacity-100 */}
                                        <CheckIcon className={`size-4 text-gray-700 ${assignedToTeamMember?._id === memberOpt._id ? "opacity-100" : "opacity-0"}`} />
                                        <span className="text-gray-700 ml-2">{memberOpt.email}</span>
                                    </ComboboxOption>
                                    ))}
                                </ComboboxOptions>
                            </Combobox>
                        </div>
                        {/* <div className="grid grid-cols-3 gap-1 text-gray-700 text-sm items-center"> */}
                            <div className="col-span-2 font-bold text-gray-700 text-sm">Created By:</div>
                            <div className="col-span-3 font-thin text-gray-700 text-sm">{task?.createdBy?.email}</div>
                        {/* </div> */}
                        {/* <div className="grid grid-cols-2 gap-1 text-gray-700 text-sm items-center"> */}
                            <div className="col-span-2 font-bold text-gray-700 text-sm">Last Updated By:</div>
                            <div className="col-span-3 font-thin text-gray-700 text-sm">{task?.updatedBy?.email}</div>
                        {/* </div> */}
                        {/* <div className="grid grid-cols-2 gap-1 text-gray-700 text-sm items-center"> */}
                            <div className="col-span-2 font-bold text-gray-700 text-sm">Updated At:</div>
                            <div className="col-span-3 font-thin text-gray-700 text-sm">{formatUpdatedAtTime(task?.updatedAt)}</div>
                        {/* </div> */}
                    </div>)}
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
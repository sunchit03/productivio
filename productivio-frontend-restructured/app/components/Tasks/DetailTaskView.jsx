import { useEffect, useState } from "react";
import { IoIosFlag } from "react-icons/io";
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';
import Calendar from 'react-calendar';
import { BsCalendar2Date } from "react-icons/bs";
import { IoCalendarOutline } from "react-icons/io5";
import { GrClear } from "react-icons/gr";

const DetailTaskView = ( { task = null, userId, refresh } ) => {

    const [title, setTitle] = useState(task ? task.title : "What would you like to do?");
    const [description, setDescription] = useState(task ? task.description : "Would you like to add task description?");
    const [priority, setPriority] = useState(task ? task.priority : "4");
    const [dueDate, setDueDate] = useState(task? task.dueDate : new Date());
    const [dueDateSelecetd, setDueDateSelected] = useState(false);

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


    const handleTaskUpdate = () => {
        if (!title.trim() == "" &&  title.trim() !== task.title) {
          updateTask({ ...task, title });
        }
      };

    useEffect(()=>{
        if(task){
            setTitle(task.title);
            setDescription(task.description);
            setPriority(task.priority);
            if(task.dueDate){
                setDueDateSelected(true);
                setDueDate(task.dueDate);
            }
        }
    },[task])

    const getPriorityColor = () => {
        let color;
        switch (task.priority) {
          case '1':
            color = "text-rose-500";
            break;
    
          case '2':
            color = "text-amber-500";
            break;
    
          case '3':
            color = "text-blue-500";
            break;
    
          case '4':
            color = "text-teal-400";
            break;
        }
        return color;
    }

    const deleteTaskOnChecked = (taskId) => {

    }


    return ( 
        <div className="w-full h-full">
            <div className="flex justify-between items-center mt-5 mx-5 mb-2">
                <div className="flex items-center gx-2">
                    <button onClick={()=>{deleteTaskOnChecked(task._id),{}}}>
                        <MdCheckBoxOutlineBlank className={`mr-2 cursor-pointer ${getPriorityColor()}`} size={"1.5em"} /> 
                    </button>
                    <span className="absolute flex cursor-pointer text-base">
                        {dueDateSelecetd ?
                            <>
                                <div onClick={() => setDatePicker((val) => !val)}>
                                <span className={`hover:bg-gray-150 ${formatDate(task.dueDate).color}`}>
                                    <BsCalendar2Date className="mr-2"/>
                                    {formatDate(task.dueDate).dateText}
                                </span>
                                </div>
                                    { datePicker &&
                                        <GrClear className="ml-2" onClick={() => { setDueDate(""); setDueDateSelected(false); }}/>
                                    }
                            </>:<IoCalendarOutline onClick={() => setDatePicker((val) => !val)}/>}
                    </span>
                    {datePicker &&
                     <div className="absolute z-10 mt-1">
                        <Calendar className="text-black" onChange={handleDueDateSelection} value={dueDate} />
                     </div>
                    }
                </div>
            
            <span><IoIosFlag className={`cursor-pointer ${getPriorityColor()}`} size={"1.5em"} /></span>

        </div>
        <div className="h-[1px] w-full bottom-0 bg-purple-50 z-10"></div>
            <div className="flex flex-col w-full m-4 p-2">
                <div onClick={()=>isEditing(true)} className="cursor-pointer"></div>
                    {isEditing ? (
                        <input
                            type = "text"
                            value={title}
                            onChange={(e)=> setTitle(e.target.value)}
                            // onBlur={handleUpdate}
                            // onKeyDown={(e) => {
                            //   if (e.key === "Enter") handleUpdate();
                            // }}
                            className="text-lg text-black text-base font-bold bg-gray-100 p-1 rounded focus:outline-none focus:ring-1 focus:ring-violet-500"
                        />
                    ):(
                    <h2 className="text-lg text-black font-bold">{task ? task.title : title}</h2>)}
            </div>
        <div></div>
    </div>
    );
}

export default DetailTaskView;
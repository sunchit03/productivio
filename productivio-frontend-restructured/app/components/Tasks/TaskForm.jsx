// app/components/TaskForm.jsx
import { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import { BsCalendar2Date } from "react-icons/bs";
import { IoCalendarOutline } from "react-icons/io5";
import { GrClear } from "react-icons/gr";
import { createTask } from "@/app/services/tasks";

import 'react-calendar/dist/Calendar.css';

const TaskForm = ( {todayOrNext = false, listId = null, teamId = null, refresh, userId, taskBarCollapse, membersSectionCollapse } ) => {
  const [title, setTitle] = useState("");
  const [datePicker, setDatePicker] = useState(false);
  const [dueDate, setDueDate] = useState(null);
  const [dueDateSelected, setDueDateSelected] = useState(false);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    if (todayOrNext) {

      const today = new Date();
      today.setHours(23, 59, 59, 999);

      setDueDate(today);
      setDueDateSelected(true);
    } else {
      setDueDate(null);
      setDueDateSelected(false);
    }
    else{
      setDueDateSelected(false);
      setDueDate(null);
    }
  }, [todayOrNext]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (!dueDateSelected) {
      setDueDate(null)
    }

    try {
      let data = await createTask({
        title,
        createdBy: userId,
        listId,
        teamId,
        dueDate
      });

      if (data.success) {
        console.log("task is created!");
        refresh();
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }

    setDueDateSelected(false);
    setTitle("");
    setDueDate(null);
  };


  
  const returnString = (dateVal) =>  {
    let now = new Date();
    now.setHours(0, 0, 0, 0);
    let date = dateVal.getDate().toString();
    let month = monthNames[dateVal.getMonth()];
    let year = dateVal.getFullYear();
    let dateString = `${date} ${month} ${year !== now.getFullYear() ? year.toString() : ""}`;
    return dateString;
  }

  const formatDate = () => {
    if(!dueDate){
      return { dateText: "", color: "" };
    }
    let dateVal = new Date(dueDate);
    let now = new Date();
    now.setHours(0, 0, 0, 0); // start from midnight 00:00:00

    const tempDateVal = new Date(dateVal);
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

  const handleDueDateSelection = (date) => {
    const updatedDate = new Date(date);
    updatedDate.setHours(23, 59, 59, 999); // 11:59:59 PM

    setDueDate(updatedDate);
    setDueDateSelected(true);
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 w-full" >
      <div className="relative">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={todayOrNext ? '+ Add task to "Inbox"' : '+ Add task'}
          onKeyDown={(e) => {
          if (e.key === "Enter")
              handleSubmit;
          }}
          onClick={() => setDatePicker(false)}
          className={`py-2 px-3 pr-25 w-full text-base rounded font-weight:bold text-black ${typeof window !== "undefined" && window.innerWidth < 639 && (teamId ? !membersSectionCollapse : !taskBarCollapse) ? "bg-gray-300/90" : "bg-gray-50"} placeholder-gray-300 focus:outline-none focus:bg-white focus:ring-1 focus:ring-violet-500`}
        />
        <span 
          className="absolute inset-y-0 right-0 pr-2 flex items-center cursor-pointer text-base"
        >
          {
            dueDateSelected ? 
              <>
                <div className={`flex items-center ${formatDate().color}`} onClick={() => setDatePicker((val) => !val)}>
                  <BsCalendar2Date className="mr-2"/>
                  <span> 
                    {formatDate().dateText}
                  </span>
                </div>
                { datePicker &&
                  <GrClear className="ml-2 text-gray-600" onClick={() => { setDueDate(null); setDueDateSelected(false); }}/>
                }
              </>
              :
              <IoCalendarOutline className="text-gray-600" onClick={() => setDatePicker((val) => !val)}/>
          }
        </span>
        {datePicker &&
          <div className="absolute right-0 z-10 mt-1">
            <Calendar className="text-black" onChange={handleDueDateSelection} value={dueDate} />
          </div>
        }
      </div>
    </form>
  );
};

export default TaskForm;

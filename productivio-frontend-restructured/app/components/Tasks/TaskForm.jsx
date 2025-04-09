// app/components/TaskForm.jsx
import { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import { BsCalendar2Date } from "react-icons/bs";
import { IoCalendarOutline } from "react-icons/io5";
import { GrClear } from "react-icons/gr";
import { createTask } from "@/app/services/tasks";
import toast, { Toaster } from 'react-hot-toast';

import 'react-calendar/dist/Calendar.css';

const TaskForm = ( {todayOrNext = false, listId = null, teamId = null, refresh, userId, taskBarCollapse, membersSectionCollapse, pageTitle="", datePicker, setDatePicker} ) => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [dueDateSelected, setDueDateSelected] = useState(false);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']


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
  }, [todayOrNext]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if(pageTitle === "Today"){
      if(dueDateSelected){
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        
        const selectedDate = new Date(dueDate);
        selectedDate.setHours(23, 59, 59, 999);
        if(!(today.getTime() === selectedDate.getTime())){
          toast.success("Task is created in inbox tab!")
        }
        else{
          toast.success("Task created successfully!")
        }
      }
      else{
        setDueDate(null)
        toast.success("Task is created in inbox tab!")
      }
    }

    if(pageTitle === "Next 7 Days"){
      if(dueDateSelected){
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const selectedDate = new Date(dueDate);
      selectedDate.setHours(0, 0, 0, 0);

      const next7Days = new Date();
      next7Days.setDate(today.getDate() + 7)
      next7Days.setHours(23, 59, 59, 999)

      if(selectedDate.getTime() < today.getTime() || selectedDate.getTime() > next7Days.getTime()){
        toast.success("Task is created in inbox tab!")
      }
      else{
        toast.success("Task created successfully!")
      }
      }
      else{
        setDueDate(null)
        toast.success("Task is created in inbox tab!")
      }
    }

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
        if(pageTitle === "Inbox"){
          toast.success("Task created successfully!")
        }
        refresh();
      }
      else{
        toast.error("Error while creating task!")
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }

    if (todayOrNext) {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      setDueDate(today);
      setDueDateSelected(true);
      setTitle("");
    } else {
      setDueDate(null);
      setDueDateSelected(false);
      setTitle("");
    }
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
    now.setHours(0, 0, 0, 0);

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
    
    let tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
  
    if (tempDateVal.getTime() > todayEnd.getTime() && tempDateVal.getTime() <= tomorrow.getTime()) {
      return {dateText: "Tomorrow", color: "text-indigo-500"};
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
    <>
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
                  <div className={`p-1 flex items-center ${formatDate().color} hover:bg-gray-100 hover:rounded-md`} onClick={(e) => {e.stopPropagation(); setDatePicker((val) => !val)}}>
                    <BsCalendar2Date className="mr-1"/>
                    <span> 
                      {formatDate().dateText}
                    </span>
                  </div>
                  { datePicker &&
                    <span 
                      className="ml-2 p-2 hover:bg-gray-100 hover:rounded-md"
                      onClick={(e) => { setDueDate(null); setDueDateSelected(false); e.stopPropagation() }}
                    >
                      <GrClear className="text-gray-600"/>
                    </span>
                  }
                </>
                :
                <span 
                  className="ml-2 p-2 hover:bg-gray-100 hover:rounded-md"
                  onClick={(e) => {e.stopPropagation() ; setDatePicker((val) => !val)}}
                >
                  <IoCalendarOutline className="text-gray-600"/>
                </span>
            }
          </span>
          {datePicker &&
            <div className="absolute right-0 z-10 mt-1" onClick={(e)=> e.stopPropagation()}>
              <Calendar className="text-black" onChange={handleDueDateSelection} value={dueDate} />
            </div>
          }
        </div>
      </form>
    </>
  );
};

export default TaskForm;

// app/components/TaskForm.jsx
import { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import { BsCalendar2Date } from "react-icons/bs";
import { IoCalendarOutline } from "react-icons/io5";
import { GrClear } from "react-icons/gr";
import { createTask } from "@/app/services/tasks";

import 'react-calendar/dist/Calendar.css';

const TaskForm = ( {todayOrNext = false, listId = null, refresh, userId, taskBarCollapse } ) => {
  const [title, setTitle] = useState("");
  const [datePicker, setDatePicker] = useState(false);
  const [dueDate, setDueDate] = useState(null);
  const [dueDateSelected, setDueDateSelected] = useState(false);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  useEffect(() => {
    if (todayOrNext) {

      const today = new Date();
      today.setHours(23, 59, 59, 999);

      setDueDate(today);
      setDueDateSelected(true);
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
          className={`py-2 px-3 pr-25 w-full text-base rounded font-weight:bold text-black ${typeof window !== "undefined" && window.innerWidth < 639 && !taskBarCollapse ? "bg-gray-300/90" : "bg-gray-50"} placeholder-gray-300 focus:outline-none focus:bg-white focus:ring-1 focus:ring-violet-500`}
        />
        <span 
          className="absolute inset-y-0 right-0 pr-2 flex items-center cursor-pointer text-base text-black"
        >
          {
            dueDateSelected ? 
              <>
                <div className="flex items-center" onClick={() => setDatePicker((val) => !val)}>
                  <BsCalendar2Date className="mr-2"/>
                  <span> {dueDate.getFullYear() != new Date().getFullYear() ? 
                    dueDate.getDate().toString() + " " + monthNames[dueDate.getMonth()] + " " + dueDate.getFullYear().toString() 
                    : 
                    dueDate.getDate().toString() + " " + monthNames[dueDate.getMonth()]
                    } 
                  </span>
                </div>
                { datePicker &&
                  <GrClear className="ml-2" onClick={() => { setDueDate(null); setDueDateSelected(false); }}/>
                }
              </>
              :
              <IoCalendarOutline onClick={() => setDatePicker((val) => !val)}/>
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

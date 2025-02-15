// // app/components/TaskForm.jsx
import { useState } from "react";
import DatePicker from "react-datepicker";
import { createTask } from "@/app/services/tasks";

import "react-datepicker/dist/react-datepicker.css";


const TaskForm = ( {todayOrNext = false, listId = null, refresh } ) => {
  const [title, setTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !dueDate) return;

    try {
      let data = await createTask({
        title,
        createdBy: localStorage.getItem("userId"),
        list: listId,
        dueDate
      });

      if (data.success) {
        console.log("task is created!");
        refresh();
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }

    setTitle("");
    setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 w-96">
      <div className="relative">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={todayOrNext ? '+ Add task to "Inbox"' : '+ Add task'}
          className="py-2 px-3 w-full text-base rounded font-weight:bold text-black bg-gray-50 placeholder-gray-300 focus:outline-none focus:bg-white focus:ring-1 focus:ring-violet-500"
        />
        <span 
          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-sm"
        >
          <DatePicker
            showIcon
            toggleCalendarOnIconClick
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            
          />
        </span>
      </div>
      {/* <input
        type="datetime-local"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="ml-2 p-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
        Add Task
      </button> */}
    </form>
  );
};

export default TaskForm;

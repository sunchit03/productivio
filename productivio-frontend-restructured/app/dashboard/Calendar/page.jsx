"use client"

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";


import { getUserTasks, updateTask } from "@/app/services/tasks";

// Importing calendar icon


function CalendarPage({ userId }) {

  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async() => {
    try {
      const data = await getUserTasks(userId);

      if (!data) {
        setTasks([]);
        return;
      }

      setTasks(data);

      // Convert tasks to FullCalendar event format with enhanced styling
      const calendarTasks = data.filter(task => task.dueDate && !task.isTrash && !task.isCompleted);
      const calendarEvents = calendarTasks.map(task => ({
        title: task.title,
        start: task.dueDate,
        end: task.dueDate, // Multi-day task support (task.endDate)
        backgroundColor: getPriorityColor(task.priority),
        borderColor: "transparent",
        display: "block",
        allDay: true,
        extendedProps: {
          id: task._id,
        },
      }));

      setEvents(calendarEvents);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
    setSelectedTask(null);
  }, [userId]);  

  // Generate random colors for tasks but keep TickTick styles
  const getPriorityColor = (priority) => {
    let color;
    switch (priority) {
      case '1':
        color = "#ff2056";
        break;

      case '2':
        color = "#fd9a00";
        break;

      case '3':
        color = "#2b7fff";
        break;

      case '4':
        color = "#00d5be";
        break;
    }
    return color;
  }

  const handleEventClick = ({ event }) => {
    const task = tasks.find(task => task._id === event.extendedProps.id);
    if (selectedTask !== task) {
      setSelectedTask(task);
    }
    alert(task.dueDate);
  };

  const handleEventDrag = async (info) => {
    const task = tasks.find(task => task._id === info.event.extendedProps.id);
    const newDate = new Date(info.event.start);
    newDate.setHours(23, 59, 59, 999);

    const data = await updateTask(task._id, userId, { dueDate: newDate });
    if (data.success) {
      console.log("balle balle");
    }
  }

  return (
    <div className="p-4 sm:p-6 bg-white shadow-md rounded-lg max-w-full overflow-x-auto h-screen">
      <FullCalendar 
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} 
        initialView="dayGridMonth" 
        headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth"
        }}
        events = {events}
        eventClick={handleEventClick}
        editable={true} // Enable drag-and-drop
        eventResizableFromStart={true}
        eventDrop={handleEventDrag}
        height="100%"
        contentHeight="100%"
        eventContent={renderEventContent}
        eventClassNames="rounded-lg p-2 text-sm font-medium shadow-sm" // Styling improvement
        //titleClassNames="text-black font-bold text-lg"
      />
    </div>
  );
}



// Improved styling for events to match TickTick
function renderEventContent(eventInfo) {
  return (
    <div style={{
        height: "auto",
      backgroundColor: eventInfo.event.backgroundColor,
      color: "#FFF",
      padding: "2px",
      borderRadius: "8px",
      fontSize: "0.85rem",
      fontWeight: "600",
      whiteSpace: "normal",
      wordWrap: "break-word",
      //boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
      transition: "all 0.3s ease-in-out",
      cursor: "pointer",
      fontSize: "0.75rem"
    }}>
      {eventInfo.event.title}
    </div>
  );
}

export default CalendarPage;

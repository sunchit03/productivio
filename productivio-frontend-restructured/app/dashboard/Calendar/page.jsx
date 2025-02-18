import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";


import { getUserTasks } from "@/app/services/tasks";

// Importing calendar icon


function CalendarPage({ userId }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function getTasks() {
      if (userId) {
        const fetchedTasks = await getUserTasks(userId);
        setTasks(fetchedTasks);
      }
    }
    getTasks();
  }, [userId]);

  // Generate random colors for tasks but keep TickTick styles
  const getPriorityColor = (priority) => {
    let color;
    switch (priority) {
      case '1':
        color = "#E11D48";
        break;

      case '2':
        color = "#F59E0B";
        break;

      case '3':
        color = "#3B82F6";
        break;

      case '4':
        color = "#2DD4BF";
        break;
    }
    return color;
  }
 
  

  // Convert tasks to FullCalendar event format with enhanced styling
  const dateTasks = tasks.filter(task => task.dueDate && !task.isTrash && !task.isCompleted)
  const events = dateTasks.map(task => ({
    title: task.title,
    start: task.dueDate,
    end: task.dueDate, // Multi-day task support (task.endDate)
    backgroundColor: getPriorityColor(task.priority),
    borderColor: "transparent",
    display: "block",
    allDay: true,
    extendedProps: {
      description: task.description,
    },
  }));

  const handleEventClick = ({ event }) => {
    alert(`Task: ${event.title}\nDescription: ${event.extendedProps.description || "No description"}`);
  };

  return (
    <div className="p-4 sm:p-6 bg-white shadow-md rounded-lg max-w-full overflow-x-auto h-screen">
      <FullCalendar 
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} 
        initialView="dayGridMonth" 
        headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}
        events = {events}
        eventClick={handleEventClick}
        editable={true} // Enable drag-and-drop
        eventResizableFromStart={true}
        eventDrop={(info) => {
          alert(`Task moved to: ${info.event.start.toDateString()}`);
        }}
        height="100%"
        contentHeight="100%"
        //eventContent={renderEventContent}
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
      //padding: "",
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

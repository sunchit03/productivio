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
    switch (priority) {
      case 1:
        return "#FF0000"; // Red
      case 2:
        return "#D2691E"; // Brown Orange (Chocolate color)
      case 3:
        return "#4169E1"; // Dark Blue
      case 4:
        return "#008000"; // Green
      default:
        return "#808080"; // Default Gray for unassigned priority
    }
  };
  

  // Convert tasks to FullCalendar event format with enhanced styling
  const events = tasks.map(task => ({
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
        const events = {[
            { title: "Study Session", start: "2025-02-19T13:00:00", end: "2025-02-19T15:00:00", backgroundColor: getPriorityColor(1) },
            { title: "Yoga Session", start: "2025-02-18T16:00:00", end: "2025-02-18T17:00:00", backgroundColor: getPriorityColor(1) },
            { title: "Grocery Shopping", start: "2025-02-24T18:00:00", end: "2025-02-24T18:30:00", backgroundColor: getPriorityColor(2) },
            { title: "Doctor Appointment", start: "2025-02-27T17:00:00", end: "2025-02-27T18:30:00", backgroundColor: getPriorityColor(3) },
            { title: "Lunch with Friends", start: "2025-03-11T16:00:00", end: "2025-03-11T18:00:00", backgroundColor: getPriorityColor(3) },
            { title: "Complete Assignment", start: "2025-03-09T14:00:00", end: "2025-03-09T16:00:00", backgroundColor: getPriorityColor(2) },
            { title: "Doctor Appointment", start: "2025-03-07T15:00:00", end: "2025-03-07T15:30:00", backgroundColor: getPriorityColor(3) },
            { title: "Do Laundry", start: "2025-03-20T12:00:00", end: "2025-03-20T13:30:00", backgroundColor: getPriorityColor(4) },
            { title: "Lunch with Friends", start: "2025-03-18T18:00:00", end: "2025-03-18T18:30:00", backgroundColor: getPriorityColor(4) },
            { title: "Movie Night", start: "2025-03-18T15:00:00", end: "2025-03-18T17:00:00", backgroundColor: getPriorityColor(3) },
            { title: "Work on Report", start: "2025-02-26T11:00:00", end: "2025-02-26T12:30:00", backgroundColor: getPriorityColor(2) },
            { title: "Fix Bug", start: "2025-03-01T16:00:00", end: "2025-03-01T17:30:00", backgroundColor: getPriorityColor(2) },
            { title: "Lunch with Friends", start: "2025-03-07T17:00:00", end: "2025-03-07T18:00:00", backgroundColor: getPriorityColor(2) },
            { title: "Submit Project", start: "2025-03-14T14:00:00", end: "2025-03-14T16:00:00", backgroundColor: getPriorityColor(4) },
            { title: "Lunch with Friends", start: "2025-02-21T14:00:00", end: "2025-02-21T14:30:00", backgroundColor: getPriorityColor(1) },
            { title: "Do MATH200 A1", start: "2025-02-18T09:00:00", end: "2025-02-18T11:00:00", backgroundColor: getPriorityColor(1) },
            { title: "Movie Night", start: "2025-03-01T14:00:00", end: "2025-03-01T15:00:00", backgroundColor: getPriorityColor(4) },
            { title: "Prepare Presentation", start: "2025-03-12T18:00:00", end: "2025-03-12T19:30:00", backgroundColor: getPriorityColor(4) },
            { title: "Submit Project", start: "2025-03-03T09:00:00", end: "2025-03-03T10:30:00", backgroundColor: getPriorityColor(1) },
            { title: "Complete Assignment", start: "2025-03-16T16:00:00", end: "2025-03-16T17:30:00", backgroundColor: getPriorityColor(4) },
            { title: "Doctor Appointment", start: "2025-03-13T09:00:00", end: "2025-03-13T09:30:00", backgroundColor: getPriorityColor(4) },
            { title: "Plan Weekend Trip", start: "2025-03-20T15:00:00", end: "2025-03-20T15:30:00", backgroundColor: getPriorityColor(4) },
            { title: "Go Groceries", start: "2025-03-15T18:00:00", end: "2025-03-15T20:00:00", backgroundColor: getPriorityColor(4) },
            { title: "Complete Assignment", start: "2025-02-22T16:00:00", end: "2025-02-22T17:30:00", backgroundColor: getPriorityColor(4) },
            { title: "Study Session", start: "2025-02-20T11:00:00", end: "2025-02-20T12:30:00", backgroundColor: getPriorityColor(1) },
            { title: "Do Laundry", start: "2025-02-19T16:00:00", end: "2025-02-19T17:30:00", backgroundColor: getPriorityColor(3) },
            { title: "Practice Coding", start: "2025-02-21T18:00:00", end: "2025-02-21T19:00:00", backgroundColor: getPriorityColor(4) },
            { title: "Read a Book", start: "2025-02-21T12:00:00", end: "2025-02-21T13:00:00", backgroundColor: getPriorityColor(1) },
            { title: "Yoga Session", start: "2025-02-20T17:00:00", end: "2025-02-20T18:00:00", backgroundColor: getPriorityColor(4) },
            { title: "Exercise", start: "2025-03-06T11:00:00", end: "2025-03-06T12:00:00", backgroundColor: getPriorityColor(1) },
            { title: "Fix Bug", start: "2025-02-19T10:00:00", end: "2025-02-19T12:00:00", backgroundColor: getPriorityColor(4) }
          ]}
          
          
          
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
        titleClassNames="text-black font-bold text-lg"
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

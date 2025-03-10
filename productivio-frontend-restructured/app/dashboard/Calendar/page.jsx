"use client"

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import DetailTaskView from "@/app/components/Tasks/DetailTaskView";
import { getUserTasks, updateTask} from "@/app/services/tasks";

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

  // colors for tasks based on priority of task
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
  };

  const handleTrashOrRestore = async(taskId, restore) => {
    try{
      const data = await updateTask(taskId, userId, {isTrash: restore})
      if(data){
        setTasks(prevTasks => prevTasks.filter(task => task._id != taskId));
        setEvents(prevEvents => prevEvents.filter(event => event.extendedProps.id != taskId));
      if(selectedTask?._id === taskId){
        setSelectedTask(null);
      }
    }
    else{
      console.log("Error while moving task to trash: ", data.error)}
    }catch(error){
      console.log("Error updating task: ", error.message);
      }
    }

const handleEditTask = async(taskId, title, description) => {
  try{
      const data = await updateTask(taskId, userId, {title: title, description: (description === "" ? null : description)})
      if(data){
      setTasks(prevTasks => prevTasks.map(task => task._id === taskId ? {...task, title: title, description: description} : task));
      setEvents(prevEvents=>prevEvents.map(event => event.extendedProps.id === taskId ? {...event, title: title} : event))
      if(selectedTask?._id === taskId){
      setSelectedTask(prevTask=>({...prevTask, title: title, description: description}));
      }
      setSelectedTask(null);
  }
  else{
      console.log("Error updating task with title and description: ", data.error)}
  }catch(error){
      console.log("Error updating task: ", error.message);
      }
  }

  const handleTaskPriorityChange = async(taskId, setPriority) => {
    try{
      const data = await updateTask(taskId, userId, {priority: setPriority})
      if(data){
        setTasks(prevTasks => prevTasks.map(task => task._id === taskId ? {...task, priority: setPriority} : task));
        setEvents(prevEvents => prevEvents.map(event => event.extendedProps.id === taskId ? {...event, backgroundColor: getPriorityColor(setPriority)} : event));
      if(selectedTask?._id === taskId){
        setSelectedTask(prevTask=>({...prevTask, priority: setPriority}));
      }
    }
    else{
      console.log("Error while updating task to priority: ", data.error)}
    }catch(error){
      console.log("Error updating task priority: ", error.message);
      }
    }

const handleDueDateUpdate = async(taskId, date) => {
  try{
    const data = await updateTask(taskId, userId, {dueDate: date})
    if(data){
      setTasks(prevTasks => prevTasks.map(task => task._id === taskId ? {...task, dueDate: date} : task));
      setEvents(prevEvents => prevEvents.map(event => event.extendedProps.id === taskId ? {...event, start: date, end: date} : event));
    if(selectedTask?._id === taskId){
      setSelectedTask(prevTask=>({...prevTask, dueDate: date}));
    }
  }
  else{
    console.log("Error while updating task to new date: ", data.error)}
  }catch(error){
    console.log("Error updating task date: ", error.message);
    }
  }

  //calendar only display incomplete tasks
  const handleCheckBoxCheck = async (e, taskId, updatedCompletion) => {
    e.stopPropagation();
    try {
        const data = await updateTask(taskId, userId, { isCompleted: updatedCompletion });
        if (data.success) {
          setTasks(prevTasks => prevTasks.map(task => task._id === taskId ? {...task, isCompleted: updatedCompletion} : task));
          setEvents(setEvents => setEvents.filter(event => event.extendedProps.id !== taskId));
            if (selectedTask?._id === taskId) {
                setSelectedTask(prevTask => ({ ...prevTask, isCompleted: updatedCompletion }));
            }
          setSelectedTask(null);
       }else {
            console.log("Error in changing completed state of task:", data.error);
        }
    } catch (error) {
        console.error("Error updating task state:", error.message);
    }
};


  const handleEventDrag = async (info) => {
    const task = tasks.find(task => task._id === info.event.extendedProps.id);
    const newDate = new Date(info.event.start);
    newDate.setHours(23, 59, 59, 999);
    const data = await updateTask(task._id, userId, { dueDate: newDate });
    if (data.success) {
      setTasks(prevTasks => prevTasks.map(task => task._id === task._id ? {...task, dueDate: newDate} : task));
      setEvents(prevEvents => prevEvents.map(event => event.extendedProps.id === task._id ? {...event, start: newDate, end: newDate} : event));
    }
    else{
      console.log("Dragged calendar task dew date not updated!");
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
      />

      {selectedTask &&
      <div className="fixed inset-0 bg-opacity-5 flex flex-col justify-center items-center z-50" onClick={()=>{setSelectedTask(null)} }> 
      <div className="p-2 shadow-xl rounded-md bg-gray-50 min-w-[25%] max-w-[50%] min-h-[50%] md:min-w-[50%] md:min-h-[50%] sm:min-h-[50%] sm:min-w-[75%] flex flex-col justify-between z-50" onClick={(e) => e.stopPropagation()}>
      <DetailTaskView
        setSelectedTask={setSelectedTask}
        task={selectedTask}
        handleCheckBoxCheck={handleCheckBoxCheck}
        handleTaskPriorityChange={handleTaskPriorityChange}
        handleDueDateUpdate={handleDueDateUpdate}
        handleTrashOrRestore={handleTrashOrRestore}
        handleEditTask={handleEditTask}/>
        </div>
      </div>}
    </div>
  );
}

// Improved styling for events
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
      transition: "all 0.3s ease-in-out",
      cursor: "pointer",
      fontSize: "0.75rem"
    }}>
      {eventInfo.event.title}
    </div>
  );
}

export default CalendarPage;

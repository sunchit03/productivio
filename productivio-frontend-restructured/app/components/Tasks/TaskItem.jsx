// // app/components/TaskItem.jsx
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";

const TaskItem = ({ task, handleCheckBoxCheck, pageTitle = "" }) => {

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
    let dateVal = new Date(task.dueDate);
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


  return (
    <div className={`flex items-center justify-between relative`}>
      {/* Task Name */}
      <span className={"text-black text-base flex items-center"}>
        {task.isCompleted ? 
          <MdCheckBox 
            className={pageTitle === "Trash" ? `cursor-not-allowed mr-2 ${getPriorityColor()}` : `mr-2 cursor-pointer ${getPriorityColor()}`} 
            onClick={pageTitle !== "Trash" ? (e)=>handleCheckBoxCheck(e, task._id, false) : undefined}
          /> :
          <MdCheckBoxOutlineBlank 
          className={pageTitle === "Trash" ? `cursor-not-allowed mr-2 ${getPriorityColor()}` : `mr-2 cursor-pointer ${getPriorityColor()}`} 
          onClick={pageTitle !== "Trash" ? (e)=>handleCheckBoxCheck(e, task._id, true) : undefined}/> 
        }
        {task?.title || "Untitled Task"} {/* Ensures task title is displayed */}
      </span>
      <div className="text-black text-xs font-thin flex items-center">
        {pageTitle == "" && task.list && (
          <>
            <span className="mr-1">{task.list.emoji}</span>
            <span className="mr-1">{task.list.name}</span>
            {task.dueDate &&
              <span className="mr-1 text-purple-200">|</span>
            }
          </>
        )
        }
        {task.dueDate &&
          <span className={formatDate().color}>{formatDate().dateText}</span>
        }
      </div>
    </div>
  );
};

export default TaskItem;

// app/views/TasksView.jsx

import TaskItem from "../../../components/Tasks/TaskItem";
import TaskForm from "../../../components/Tasks/TaskForm";
import { useEffect, useState } from "react";
import { getUserTasks } from "@/app/services/tasks";

const TasksView = ({
  title,
  inbox = false,
  today = false, 
  next7days = false,
  completed = false, 
  trash = false,
  listId = null 
}) => {
  const [tasks, setTasks] = useState([]);
  let todayOrNext = today || next7days;

  const fetchTasks = async() => {
    try {
      const data = await getUserTasks(localStorage.getItem("userId"));

      let filteredTasks = data;
      const now = new Date();
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const next7Days = new Date();
      next7Days.setDate(now.getDate() + 7);

      if (listId != null) {
        filteredTasks = data.filter(task => !task.isTrash && task.list === listId);
      } else if (today) {
        filteredTasks = data.filter(task => {
          const dueDate = new Date(task.dueDate);
          return !task.isTrash && dueDate >= now && dueDate <= todayEnd;
        });
      }
      else if (next7days) {
        filteredTasks = data.filter(task => {
          const dueDate = new Date(task.dueDate);
          return !task.isTrash && dueDate > now && dueDate <= next7Days;
        });
      }
      else if (completed) {
        filteredTasks = data.filter(task => !task.isTrash && task.isCompleted);
      } else if (trash) {
        filteredTasks = data.filter(task => task.isTrash);
      } else if (inbox) {
        filteredTasks = data.filter(task => !task.isTrash && !task.list);
      }

      setTasks(filteredTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [inbox, today, next7days, completed, trash, listId]);

  return (
    <div className="w-full">
      <h2 className="text-xl text-black font-semibold mb-4">{title}</h2>
      {!completed && !trash && (
        <TaskForm todayOrNext={todayOrNext} listId={listId} refresh={fetchTasks}/>
      )}
      <div className="mt-4">
        {tasks.length > 0 ? (
          tasks.map((task) => <TaskItem key={task._id} task={task} />)
        ) : (
          <p className=" text-black  mb-4">
            {listId != null ? "No tasks available in this list." : "No tasks available."}
          </p>
        )}
      </div>
    </div>
  );
};

export default TasksView;

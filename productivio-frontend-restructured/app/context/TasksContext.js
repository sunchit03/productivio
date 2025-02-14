// // app/context/TasksContext.js
import { createContext, useContext, useState } from "react";

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Add Task Function
  const addTask = (task) => {
    setTasks([...tasks, { id: Date.now(), ...task }]);
  };

  // Open and Close Task Modal
  const openTaskModal = () => setIsTaskModalOpen(true);
  const closeTaskModal = () => setIsTaskModalOpen(false);

  return (
    <TasksContext.Provider value={{ tasks, addTask, isTaskModalOpen, openTaskModal, closeTaskModal }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);

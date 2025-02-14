// // app/views/TasksView.jsx

import { useTasks } from "../../../context/TasksContext";
import TaskItem from "../../../components/Tasks/TaskItem";
import TaskForm from "../../../components/Tasks/TaskForm";

const TasksView = () => {
  const { tasks } = useTasks();

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl text-black font-bold mb-4">All Tasks</h2>
      <TaskForm />
      <div className="mt-4">
        {tasks.length > 0 ? (
          tasks.map((task) => <TaskItem key={task.id} task={task} />)
        ) : (
          <p className=" text-black  mb-4">No tasks available.</p>
        )}
      </div>
    </div>
  );
};

export default TasksView;

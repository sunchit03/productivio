// app/views/CompletedTasks.jsx
import { useTasks } from "../../../context/TasksContext";
import TaskItem from "../../../components/Tasks/TaskItem";

const CompletedTasks = () => {
  const { tasks } = useTasks();
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl text-black font-bold mb-4">Completed Tasks</h2>
      {completedTasks.length > 0 ? (
        completedTasks.map((task) => <TaskItem key={task.id} task={task} />)
      ) : (
        <p className=" text-black mb-4">No completed tasks yet.</p>
      )}
    </div>
  );
};

export default CompletedTasks;

// // app/views/TodayTasks.jsx
import { useLists } from "../context/ListsContext";
import TaskItem from "../components/TaskItem";

const TodayTasks = () => {
  const { lists } = useLists();
  const today = new Date().setHours(0, 0, 0, 0); 

  // Get all tasks from all lists
  const todayTasks = lists.flatMap((list) =>
    list.tasks.filter((task) => new Date(task.dueDate).setHours(0, 0, 0, 0) === today)
  );

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold text-black mb-4">Today's Tasks</h2>
      {todayTasks.length > 0 ? (
        todayTasks.map((task) => <TaskItem key={task.id} task={task} listId={task.listId} />)
      ) : (
        <p className="text-black mb-4">No tasks due today.</p>
      )}
    </div>
  );
};

export default TodayTasks;

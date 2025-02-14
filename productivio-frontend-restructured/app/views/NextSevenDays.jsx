// // app/views/NextSevenDays.jsx
import { useTasks } from "../context/TasksContext";
import { useLists } from "../context/ListsContext";
import TaskItem from "../components/TaskItem";

const NextSevenDays = () => {
  const { tasks } = useTasks(); // Get regular tasks
  const { lists } = useLists();
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  // Get regular tasks due in the next 7 days
  const upcomingRegularTasks = tasks.filter((task) => {
    const dueDate = new Date(task.dueDate);
    return dueDate >= today && dueDate <= nextWeek;
  });

  // Get list-based tasks due in the next 7 days
  const upcomingListTasks = lists.flatMap((list) =>
    list.tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate <= nextWeek;
    })
  );

  // Merge both types of tasks
  const upcomingTasks = [...upcomingRegularTasks, ...upcomingListTasks];

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold text-black mb-4">Next 7 Days</h2>
      {upcomingTasks.length > 0 ? (
        upcomingTasks.map((task) => (
          <TaskItem key={task.id} task={task} listId={task.listId || null} />
        ))
      ) : (
        <p className=" text-black mb-4">No tasks due in the next 7 days.</p>
      )}
    </div>
  );
};

export default NextSevenDays;

// TasksSection.jsx
export default function TasksSection({ tasks }) {
    return (
      <div className="flex-1 p-4">
        <h2 className="text-xl font-bold mb-4">Tasks</h2>
        <ul>
          {tasks && tasks.map((task) => (
            <li key={task.id} className="p-2 border rounded mb-2">
              {task.title}
            </li>
          ))}
        </ul>
      </div>
    );
  }
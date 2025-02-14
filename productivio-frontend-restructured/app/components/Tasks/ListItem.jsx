// app/components/ListItem.jsx
import { useState } from "react";
import TaskItem from "./TaskItem"; 

const ListItem = ({ list }) => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");

  const addTaskToList = () => {
    if (!taskName) return;
    setTasks([...tasks, { id: Date.now(), title: taskName, completed: false }]);
    setTaskName("");
  };

  return (
    <div className="border p-4 rounded mb-4">
      <h3 className="font-bold mb-2">{list.name}</h3>
      <div className="mb-2">
      <input
  type="text"
  value={taskName}
  onChange={(e) => setTaskName(e.target.value)}
  placeholder="New task..."
  className="p-2 border rounded w-64 !text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
/>

        <button onClick={addTaskToList} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
          Add Task
        </button>
      </div>
      <div>
      {tasks.map((task) => (
  <TaskItem key={task.id} task={{ ...task, textColor: "text-black" }} />
))}
      </div>
    </div>
  );
};


export default ListItem;

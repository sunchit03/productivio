// app/views/TrashTasks.jsx
import { useState } from "react";

const TrashTasks = () => {
  const [deletedTasks, setDeletedTasks] = useState([]);

  const restoreTask = (task) => {
    setDeletedTasks(deletedTasks.filter((t) => t.id !== task.id));
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold text-black mb-4">Trash</h2>
      {deletedTasks.length > 0 ? (
        deletedTasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between bg-gray-100 p-3 rounded-md mb-2">
            <span>{task.title}</span>
            <button onClick={() => restoreTask(task)} className="text-blue-600">
              🔄 Restore
            </button>
          </div>
        ))
      ) : (
        <p className=" text-black mb-4">No deleted tasks.</p>
      )}
    </div>
  );
};

export default TrashTasks;

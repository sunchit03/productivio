import { ImBin } from "react-icons/im";

export default function TeamTaskCard({ task, admin, onDelete }) {
  
    return (
      <div
        className={`flex items-center justify-between p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition bg-red-500`}
      >
        <div>
          <h2 className="text-lg font-bold text-black">{task.title}</h2>
          {task.description && <p className="text-gray-600">{task.description}</p>}
        </div>
            {/* Delete Button (Visible Only for Admins) */}
            {admin && (
                <button 
                    onClick={() => onDelete(task._id)}
                    className="bg-white px-3 py-1 rounded hover:bg-gray-200 transition"
                >
                    <ImBin />
                </button>
            )}
      </div>
    );
  }
  
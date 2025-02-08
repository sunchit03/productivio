import { useState } from "react";

export default function CreateTeam({ onClose, refresh }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const handleCreateTeam = async () => {
    if (!title.trim()) return;

    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, title, description }),
      });

      if (res.ok) {
        onClose(); // Close modal on success
        refresh() // Refresh to show new team
      }
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4 text-black">Create New Team</h2>

        <input
          type="text"
          placeholder="Team Title"
          className="w-full border p-2 rounded mb-2 text-black"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Team Description"
          className="w-full border p-2 rounded mb-4 text-black"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end">
          <button className="bg-gray-300 px-4 py-2 rounded mr-2" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleCreateTeam}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

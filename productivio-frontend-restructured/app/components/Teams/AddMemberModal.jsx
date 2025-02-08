// AddMemberModal.jsx
import { useState } from "react";

export default function AddMemberModal({ onClose, onAdd }) {
    const [email, setEmail] = useState("");
    
    function handleSubmit() {
      onAdd(email);
      onClose();
    }
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-4 rounded">
          <h2 className="text-lg font-bold mb-2">Add Member</h2>
          <input 
            type="email" 
            placeholder="Enter email" 
            className="w-full p-2 border rounded mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="bg-blue-500 text-white p-2 rounded w-full" onClick={handleSubmit}>Add</button>
          <button className="mt-2 w-full p-2 border rounded" onClick={onClose}>Cancel</button>
        </div>
      </div>
    );
  }
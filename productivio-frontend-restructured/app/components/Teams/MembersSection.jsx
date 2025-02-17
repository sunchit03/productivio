// MembersSection.jsx
import { useState } from "react";
import AddMemberModal from "./AddMemberModal";

export default function MembersSection({ members, isAdmin, onRemove, onAdd }) {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <div className="w-64 bg-gray-300 p-4">
      <h2 className="text-lg font-bold mb-2 text-black">Members</h2>
      <input type="text" placeholder="Search..." className="w-full p-2 mb-2 border rounded" />
      <button className="w-full bg-red-500 text-black font-bold p-2 rounded" onClick={() => setShowModal(true)}>Add</button>
      <ul className="mt-4 h-screen">
        {members.map((member) => (
          <li key={member.id} className="flex justify-between items-center p-2 border-b">
            {member.email}
            {isAdmin && (
              <button onClick={() => onRemove(member.id)} className="text-red-500">...</button>
            )}
          </li>
        ))}
      </ul>
      {showModal && <AddMemberModal onClose={() => setShowModal(false)} onAdd={onAdd} />}
    </div>
  );
}
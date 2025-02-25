import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import AddMemberModal from "./AddMemberModal";

export default function MembersSection({ members, isAdmin, onRemove, onAdd, currentUserEmail }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-80 bg-gray-300 p-4">
      {/* Members Header with Add Icon */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-black">Members</h2>
        {isAdmin &&
          <button onClick={() => setShowModal(true)} className="text-blue-500 hover:text-blue-700">
            <FaUserPlus size={20} />
          </button>
        }
      </div>

      {/* Search Bar */}
      <input type="text" placeholder="Search..." className="w-full p-2 mb-2 border rounded" />

      {/* Members List */}
      <ul className="mt-4 space-y-3">
        {members.map((member) => (
          <li key={member.id} className="flex items-center justify-between p-2 border-b">
            {/* Profile Picture & Email */}
            <div className="flex items-center space-x-3">
              <img
                src={member.profilePicture || "/default-avatar.png"} // Use a default image if no profile picture
                alt={member.email}
                className="w-8 h-8 rounded-full border"
              />
              <span className="text-black">{member.email}</span>
            </div>

            {/* Admin Actions */}
            {isAdmin && (
              <button onClick={() => onRemove(member.id)} className="text-red-500 hover:text-red-700">
                ⋮
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Add Member Modal */}
      {showModal && <AddMemberModal onClose={() => setShowModal(false)} onAdd={onAdd} teamMembers={members} currentUserEmail={currentUserEmail}/>}
    </div>
  );
}

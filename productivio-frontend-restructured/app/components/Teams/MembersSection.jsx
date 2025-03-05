import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { IoChevronBackCircle } from "react-icons/io5";
import AddMemberModal from "./AddMemberModal";

export default function MembersSection({ members, isAdmin, onAdd, currentUserEmail, setSelectedTeam, membersSectionCollapse }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={`sm:absolute sm:left-0 sm:z-30 transition-width duration-200 ease-linear relative bg-gradient-to-b from-indigo-100 to-pink-50 bg-white text-black h-screen flex flex-col overflow-y-auto
     ${membersSectionCollapse ? "w-0" : "w-[310px] mdlg:w-[305px] md:w-[213px] sm:w-[300px] xs:w-[288px]"}`}>

      <div className="py-[14px] px-[10px]">
        {/* Members Header with Add Icon */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <IoChevronBackCircle className="mr-2 cursor-pointer" size={20} onClick={() => setSelectedTeam(null)} />
            <h2 className="text-lg font-bold text-black">Members</h2>
          </div>
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
            <li key={member._id} className="flex items-center justify-between p-2 border-b">
              {/* Profile Picture & Email */}
              <div className="flex items-center space-x-3">
                <img
                  src={member.profilePicture || "/assets/default-avatar.jpg"} // Use a default image if no profile picture
                  alt={member.email}
                  className="w-8 h-8 rounded-full border"
                />
                <span className="text-black">{member.email}</span>
              </div>

              {/* Admin Actions */}
              {isAdmin && (
                <button className="text-red-500 hover:text-red-700">
                  ⋮
                </button>
              )}
            </li>
          ))}
        </ul>

        {/* Add Member Modal */}
        {/* {showModal && <AddMemberModal onClose={() => setShowModal(false)} onAdd={onAdd} teamMembers={members} currentUserEmail={currentUserEmail}/>} */}
      </div>
    </div>
  );
}

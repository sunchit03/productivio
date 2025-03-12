import { useState, useEffect } from "react";
import { FaUser, FaUserPlus } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoChevronBackCircle, IoLogOutOutline } from "react-icons/io5";
import AddMemberModal from "./AddMemberModal";
import { addUserToTeam } from "@/app/services/teams";
import { addUserToTeam, deleteTeam, removeUserFromTeam, updateTeam } from "@/app/services/teams";
import { sendInvite } from "@/app/services/users";
import MembersSectionItem from "./MembersSectionItem";
import NotificationsModal from "../NotificationsModal";
import { preLogOut } from "../../utils/prelogout";
import LeaveTeamModal from "./LeaveTeamModal";


export default function MembersSection({ user, teamId, members, isAdmin, adminId, userId, setSelectedTeam, membersSectionCollapse, refresh }) {
  const [query, setQuery] = useState("");
  const [filteredMembers, setFilteredMembers] = useState(members);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [userPicture, setUserPicture] = useState(user?.picture || null);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
    setUserPicture(user.picture);
    }
  }, [user]);

  useEffect(() => {
    if (query === "") {
      console.log(members);
      setFilteredMembers(members);
    }
    else {
      const filtered = members.filter(member =>
        member.email.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
    
	}, [query]);

  useEffect(() => {
    setFilteredMembers(members)
  }, [members])

  const handleLogout = async () => {
    localStorage.removeItem("userId");
    localStorage.setItem("activeTab", "task");

    const clearToken = await preLogOut();
    if (!clearToken) {
      console.error("Failed to clear tokens on logout");
    }

    //window.location.href = "/api/auth/logout?federated";
    
    // Redirect to Auth0 logout URL (ensures session is cleared)
    window.location.href = `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/v2/logout?client_id=${process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}`)}`;
  };

  const addUser = async (newUser) => {
    const data = await addUserToTeam(teamId, userId, newUser);
    if (data.success) {
      console.log("addeddddddd");
      setShowAddModal(false);
      refresh();
    }
  }

  const inviteUser = async (email) => {
    if (invitations.includes(email)) {
      console.log('555');
      // email already sent
      return;
    }
    const data = await sendInvite(email);
    if (data.success) {
      setShowAddModal(false);
      setInvitations((prevState) => [...prevState, email]);
      // invite sent successfully
      console.log("email sentttt")
      setShowAddModal(false);
    } else {
      // something went wrong
      console.log("oh nooooo")
    }
  }

  const leaveTeam = async (newAdmin = null) => {

    if (newAdmin) {
      const data = await updateTeam(teamId, userId, {admin: newAdmin})

      if (data.success) {
        // new admin assigned
      } else {
        // something went wrong
      }
    }

    const data = await removeUserFromTeam(teamId, userId, userId, false);
    if (data.success) {
      setFilteredMembers(prevMembers => prevMembers.filter(prevMember => prevMember._id == userId))
      setSelectedTeam(null);
      setShowLeaveModal(false);
      // left team
    } else {
      // something went wrong
    }
  }

  const memberRemoval = async(memberId) => {
    const data = await removeUserFromTeam(teamId, userId, memberId, false);
    if (data.success) {
      setFilteredMembers(prevMembers => prevMembers.filter(prevMember => prevMember._id !== memberId))
      // removed from team
    } else {
      // something went wrong
    }
  }

  const deleteTeam = async () => {
    const data = await deleteTeam(teamId, userId);
    if(data.success){
      setSelectedTeam(null);
    }
    else{
      //something went wrong
    }
  }

  return (
    <div className={`sm:absolute sm:left-0 sm:z-30 transition-width duration-200 ease-linear relative bg-gradient-to-b from-indigo-100 to-pink-50 bg-white text-black h-screen flex flex-col overflow-y-auto
     ${membersSectionCollapse ? "w-0" : "w-[310px] mdlg:w-[305px] md:w-[213px] sm:w-[300px] xs:w-[288px]"}`}>

      <div className="hidden xs:flex justify-between items-center pt-4 px-2">
        {user ? (
          <img
          src={userPicture}
          alt="Profile"
          className="rounded-md img-fluid profile-picture mb-md-0 size-10"
          decode="async"
          data-testid="profile-picture"
          />
        ) : (
          <button
          className={`px-2 py-1 rounded text-black`}
          title={user?.name || "Profile"}
          >
            <FaUser size="1.4em"/>
          </button>
        )}

        <div className="flex items-center">
          {/* Notifications Button */}
          <button 
            className="px-2 py-1 rounded text-black"
            title="Notifications"
            onClick={() => setShowNotifications(true)}>
            <IoMdNotificationsOutline  size="1.4em"/>
          </button>
  
          <button 
            onClick={() => handleLogout()} 
            className="px-2 py-1 rounded text-black"
            title="Sign Out"
            >
            <IoLogOutOutline size="1.4em"/>
          </button>
        </div>

        {/* Notifications Modal */}
        {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} notifications={[]} activities={[]} />}
      </div>

      <div className="py-[14px] px-[10px]">
        {/* Members Header with Add Icon */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <IoChevronBackCircle className="mr-2 cursor-pointer" size={20} onClick={() => setSelectedTeam(null)} />
            <h2 className="text-lg font-bold text-black">Members</h2>
          </div>
          {isAdmin &&
            <button onClick={() => setShowAddModal(true)} className="text-blue-500 hover:text-blue-700">
              <FaUserPlus size={20} />
            </button>
          }
        </div>

        {/* Search Bar */}
        <input 
          type="text" 
          placeholder="Search..." 
          value={query}
				  onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-1 focus:ring-violet-500" />

        {/* Members List */}
        <div className="rounded-md">
          <ul>
            {
              filteredMembers.map((member) => (
                <MembersSectionItem 
                  key={member._id}
                  member={member}
                  isAdmin={isAdmin}
                  adminId={adminId}
                  userId={userId}
                  memberRemoval={memberRemoval}
                />
              ))
            }
          </ul>
        </div>

        {/* Add Member Modal */}
        {showAddModal && 
          <AddMemberModal 
            onClose={() => setShowAddModal(false)} 
            addUser={addUser} 
            inviteUser={inviteUser}
            teamMembers={members} 
            userId={userId}
          />
        }

        {showLeaveModal &&
          <LeaveTeamModal
            onClose={() => setShowLeaveModal(false)}
            leaveTeam={leaveTeam}
            isAdmin={isAdmin}
            members={members}
            deleteTeam={deleteTeam}
            userId={userId}
          />
        }
      </div>
    </div>
  );
}

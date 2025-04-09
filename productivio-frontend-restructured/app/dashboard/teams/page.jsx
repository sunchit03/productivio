"use client";
import { useState, useEffect } from "react";
import { IoAdd } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import TeamCard from "@/app/components/Teams/TeamCard";
import CreateOrEditTeam from "@/app/components/Teams/CreateOrEditTeam";
import { getUserTeams, updateTeam, deleteTeam } from "@/app/services/teams";
export default function TeamsPage({ userId, setSelectedTeam }) {

    const [teams, setTeams] = useState([]);
    const [addEditTeamModal, setAddEditTeamModal] = useState(false);

    useEffect(() => {
      if (userId) {
        setSelectedTeam(null);
        fetchTeams()
      }
    }, [userId])

    const fetchTeams = async() => {
      try{
        const data = await getUserTeams(userId);
        if (data) {
          setTeams(data);
          console.log(data);
        }
        else {
          console.log(`Unable to retrieve ${userId} teams: `, data.error);
        }
      } catch(error) {
        console.log("Unable to fetch teams: ", error.message);
      }
    }

    const editTeam = async(teamId, title, description) => {
      try{
        const data = await updateTeam(teamId, userId, {title, description});
          if (data) {
            console.log(data);
            setTeams(prevTeams => prevTeams.map(prevTeam => prevTeam._id === teamId ? {...prevTeam, title, description} : prevTeam))
            toast.success("Team updated successfully!")
          }
          else {
            console.log("Error while editing team: ", data.error);
            toast.error("Error updating team.")
          }
      } catch(error) {
        console.log("Error while editing team: ", error)
      }
    }

    const removeTeam = async(teamId) => {
      try{
        const data = await deleteTeam(teamId, userId);
        if (data) {
          setTeams(prevTeams => prevTeams.filter(prevTeam => prevTeam._id !== teamId))
          toast.success("Team deleted successfully!");
        }
        else {
          console.log("Error deleting team: ", data.error);
          toast.error("Error deleting team.");
        }
      }catch(error){
        console.log("Error while deleting team: ", error.message);
      }
    }

    return (
        <>
          <Toaster
            toastOptions={{
            removeDelay: 500,
            position: 'bottom-center',
            style: {
              backgroundColor: "#E6E6FA",
              padding: '16px',
              color: '#6A0DAD',
              textAlign: "center",
            },
          }}
          />
        <div className="p-4 bg-gradient-to-b from-indigo-100 to-pink-50 h-screen overflow-hidden"
          onClick={()=>{setAddEditTeamModal(false)}}>
          <div className="w-full flex items-center justify-between">
            <h1 className="ml-1 text-xl text-black font-semibold mb-4">My Teams</h1>
            <button
              className="bg-purple-700 p-4 text-sm text-white rounded-md shadow-lg hover:bg-purple-800 flex items-center"
              onClick={(e) => {e.stopPropagation(); setAddEditTeamModal(true);}}
            >
              <IoAdd className="mr-1" size={"1.5em"}/>
              <span>Create New Team</span>
            </button>
          </div>

            <div className="p-2 mt-2 flex flex-col w-full justify-start gap-2"></div>
          {teams.length === 0 ? (
            <p className="text-gray-600">You have no teams. Start by creating one!</p>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
              {teams.map((team) => (
                <TeamCard key={team._id} team={team} userId={userId} editTeam={editTeam} removeTeam={removeTeam} setSelectedTeam={setSelectedTeam}/>
              ))}
            </div>
          )}
    
          {/* Create Team Modal */}
          {addEditTeamModal && 
          <CreateOrEditTeam
            userId={userId}
            onClose={() => setAddEditTeamModal(false)} 
            refresh={fetchTeams}
          />}
          </div>
        </>
    );
}
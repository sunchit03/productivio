"use client";

import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import TeamCard from "@/app/components/Teams/TeamCard";
import CreateTeam from "@/app/components/Teams/CreateTeam";
import { getUserTeams } from "@/app/services/teams";

export default function TeamsPage({ userId, setSelectedTeam }) {

    const [teams, setTeams] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setSelectedTeam(null);
        fetchTeams()
    }, [userId])

    async function fetchTeams() {
      const data = await getUserTeams(userId);
      if (data) {
        setTeams(data);
      }
    }

    return (
        <div className="h-screen flex flex-col bg-gray-100 p-4 overflow-hidden">
          <h1 className="ml-1 text-xl text-black font-semibold mb-4">My Teams</h1>
          {teams.length === 0 ? (
            <p className="text-gray-600">You have no teams. Start by creating one!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {teams.map((team) => (
                <TeamCard key={team._id} team={team} setSelectedTeam={setSelectedTeam}/>
              ))}
            </div>
          )}
    
          {/* Floating Create Team Button */}
          <button
            className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600"
            onClick={() => setShowModal(true)}
          >
            <FaPlus size={24} />
          </button>
    
          {/* Create Team Modal */}
          {showModal && <CreateTeam onClose={() => setShowModal(false)} refresh={fetchTeams} />}
        </div>
    );
}
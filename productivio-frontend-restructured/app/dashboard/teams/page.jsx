"use client";

import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import TeamCard from "@/app/components/Teams/TeamCard";
import CreateTeam from "@/app/components/Teams/CreateTeam";

export default function TeamsPage() {

    const [teams, setTeams] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

    useEffect(() => {
        fetchTeams()
    }, [])

    async function fetchTeams() {
        try {
            const res = await fetch(`/api/teams?userId=${userId}`);
            const data = await res.json()
            
            if (data.success) {
                console.log(data)
                setTeams(data.teams)
                
            } else {
                console.error("Error fetching teams:", data.error);
            }

        } catch (error) {
            console.log("Error fetching teams: ", error);
        }
    }

    return (
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4 text-black">My Teams</h1>
          {teams.length === 0 ? (
            <p className="text-gray-600">You have no teams. Start by creating one!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {teams.map((team) => (
                <TeamCard key={team._id} team={team} />
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
// app/teams/team/page.jsx
"use client";
import { useState, useEffect } from "react";
import MembersSection from "@/app/components/Team/MembersSection";
import TasksView from "@/app/components/Tasks/TasksView";
import { getTeamData } from "@/app/services/teams";

export default function TeamPage({ selectedTeam, setSelectedTeam, user, userId, membersSectionCollapse, setMembersSectionCollapse }) {
    const [team, setTeam] = useState(null);
    const [members, setMembers] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
   
    async function fetchTeamDetails() {
        try {            
            const data = await getTeamData(selectedTeam._id, userId);
            if (data) {
                console.log("Team details:", data);

                setTeam(data);
                setIsAdmin(data.admin._id === userId);
                setMembers(data.members);
            }
        } catch (error) {
            console.error("Error fetching team data:", error.message);
        }
    }
    
    useEffect(() => {
        if(selectedTeam){
            fetchTeamDetails();
        }
    }, [selectedTeam, userId])

    return (
        <div className={"sm:relative w-full flex h-full"}>
            <MembersSection 
                teamId={selectedTeam?._id} 
                members={members} 
                isAdmin={isAdmin} 
                setSelectedTeam={setSelectedTeam} 
                membersSectionCollapse={membersSectionCollapse}
                user={user}
                userId={userId}
                refresh={fetchTeamDetails}
            />
        <div className={`flex-grow h-full sm:w-full overflow-auto ${typeof window !== "undefined" && window.innerWidth < 639 && !membersSectionCollapse ? "bg-black/10" : "bg-white"}`}>
            <TasksView 
                title={selectedTeam?.title} 
                userId={userId} 
                teamId={selectedTeam?._id} 
                setSelectedTeam={setSelectedTeam}
                membersSectionCollapse={membersSectionCollapse}
                setMembersSectionCollapse={setMembersSectionCollapse}
            />
        </div>
    </div>
    );
}

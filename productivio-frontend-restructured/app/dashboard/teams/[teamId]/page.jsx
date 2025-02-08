// app/teams/[teamId]/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { useParams } from "next/navigation";
import Sidebar from "@/app/components/MainSidebar";
import TasksSection from "@/app/components/Teams/TasksSection";
import MembersSection from "@/app/components/Teams/MembersSection";
import Loading from "@/app/components/Loading";
import { getOneTeam } from "@/app/services/teams";

function TeamPage() {
    const { user, error, isLoading } = useUser();
    const [activeMainTab, setActiveMainTab] = useState("team");

    const { teamId } = useParams();
    const [team, setTeam] = useState(null);
    const [isAdmin, setIsAdmin] =useState(false)

    useEffect(() => {
        if (!isLoading && !user) {
          router.push("/api/auth/login");
        }
      }, [isLoading, user]);

    useEffect(() => {
        async function fetchTeam() {
            const userId = localStorage.getItem("userId");
            const fetchedTeam = await getOneTeam(teamId, userId);
            setTeam(fetchedTeam);
            console.log(fetchedTeam)
            if (fetchedTeam && fetchedTeam.admin._id) {
                setIsAdmin(fetchedTeam.admin._id === localStorage.getItem("userId"));
            }
        }
        fetchTeam();
    }, [teamId]);

    if (!team) return <Loading />;

  return (
    <>
    {user && (
        <div className="flex h-screen bg-gray-100">
        <Sidebar activeMainTab={activeMainTab} setActiveMainTab={setActiveMainTab} user={user} />
        
        {/* Main Content */}
        <div className="flex flex-1">
        {/* Main Section - Tasks */}
            <div className="flex-1 p-6 bg-gray-100">
                <h1 className="text-2xl font-bold text-black">{team.title}</h1>
                <p className="text-gray-600">{team.description}</p>
                <TasksSection teamId={team.tasks} />
            </div>

            {/* Right Section - Members */}
            <MembersSection members={team.members} isAdmin={isAdmin}  />
        </div>
        </div>
    )}
    </>
    )
}

export default withPageAuthRequired(TeamPage, {
    onRedirecting: () => <Loading />,
    onError: error => <ErrorMessage>{error.message}</ErrorMessage>
  });

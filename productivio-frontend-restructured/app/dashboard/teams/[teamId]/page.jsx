// app/teams/[teamId]/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { useParams } from "next/navigation";
import Sidebar from "@/app/components/MainSidebar";
import MembersSection from "@/app/components/Teams/MembersSection";
import Loading from "@/app/components/Loading";

function TeamPage() {
    const { user, error, isLoading } = useUser();
    const [activeMainTab, setActiveMainTab] = useState("team");

    const { teamId } = useParams();
    const [team, setTeam] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [isAdmin, setIsAdmin] =useState(false)
    const [showModal, setShowModal] = useState(false);
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;


    useEffect(() => {
        if (!isLoading && !user) {
          router.push("/api/auth/login");
        }
      }, [isLoading, user]);
   
    async function fetchTeamDetails() {
        try {            
            const res = await fetch(`/api/team/${teamId}?userId=${userId}`);
            const data = await res.json();
            if (data.success) {
                console.log("Team details:", data.team);

                setTeam(data.team);
                setIsAdmin(data.team.admin._id === localStorage.getItem("userId"));
            }
            else {
                console.error("Error fetching team:", data.error);
            }
        } catch (error) {
            console.error("Error fetching team:", error.message);
        }
    }

    async function fetchTeamExistingTasks(){
        try{
            const res = await fetch(`/api/team/${teamId}/tasks?userId=${userId}`)
            const data = await res.json();
            if(data.success){
                console.log("Task details: ", data.tasks)
                setTasks(data.tasks)
                if (data.tasks.length === 0) {
                    console.log("No tasks available for this team.");
                }
            }
            else{
                console.error("Error fetching tasks:", data.error);
                return;
            }
        }catch(error){
            console.error("Error fetching tasks:", error.message)
        }
    }

    async function deleteTeamTask(taskId) {
        try{
            const res = await fetch(`/api/team/${teamId}/tasks?taskId=${taskId}`,{
                method: "DELETE"
            });
            console.log(`userId:  ${userId}, teamId: ${teamId}`)
            const data = await res.json();
            if (data.success) {
                console.log("Task deleted:", taskId);
                fetchTeamExistingTasks(); // Refresh task list after deletion
            } else {
                console.error("Error deleting task:", data.error);
            }
        }catch(error){
            console.log("Error deleting tasks: ", error.message)
        }
    }

    useEffect(() => {
        if(teamId){
        fetchTeamDetails();
        fetchTeamExistingTasks();
        }
    }, [teamId])

    if (!team) return <Loading />;

return (
    <>
        {user && (
            <div className="flex h-screen bg-gray-100 overflow-hidden">
                {/* Sidebar */}
                <Sidebar activeMainTab={activeMainTab} setActiveMainTab={setActiveMainTab} user={user} />

                {/* Main Content */}
                <div className="flex flex-1 h-full p-4 flex-col">
                    {/* Header */}
                    <div className="text-center p-6">
                        <h1 className="text-2xl font-bold text-black">{team.title}</h1>
                        <p className="text-gray-600">{team.description}</p>
                    </div>

                    {/* Task Section - Scrollable */}
                    <div className="flex flex-col bg-gray-200 rounded-lg shadow-md w-full max-h-[70vh] overflow-y-auto p-4">
                        <p className="text-2xl font-bold mb-4 mt-4 text-center">Tasks</p>

                        {/* Task List - Adds Spacing */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                            {tasks.length === 0 ? (
                                <p className="text-xl text-center font-bold mb-4">
                                    No tasks to display for {team.title} team.
                                </p>
                            ) : (
                                tasks.map((task) => (
                                    <TeamTaskCard admin={isAdmin} key={task._id} task={task} onDelete={deleteTeamTask}/>
                                ))
                            )}
                        </div>
                    </div>

                        {/* Fixed Add Task Button at Bottom of the Task Section */}
                        {isAdmin && (
                            <div className="sticky bottom-0 left-0 w-full pt-6 pl-6 pb-6 flex justify-end">
                                <button
                                    className="bg-red-500 text-black font-bold py-4 px-4 rounded-lg hover:bg-red-400"
                                    onClick={() => setShowModal(true)}
                                >
                                    Add Task
                                </button>
                            </div>
                        )}
                    {/* Modal for Adding Task */}
                    {showModal && (
                        <CreateTeamTask
                            userId={userId}
                            teamId={teamId}
                            onClose={() => setShowModal(false)}
                            refresh={fetchTeamExistingTasks}
                        />
                    )}
                </div>

                {/* Right Section - Members */}
                <MembersSection members={team.members} isAdmin={isAdmin} />
            </div>
        )}
    </>
);
}
export default withPageAuthRequired(TeamPage, {
    onRedirecting: () => <Loading />,
    onError: error => <ErrorMessage>{error.message}</ErrorMessage>
  });

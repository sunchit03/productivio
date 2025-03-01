// app/services/teams.js

export async function getUserTeams(userId) {
    try {
        const res = await fetch(`/api/teams/user/${userId}`);
        const data = await res.json()
        return data.teams;
    }   catch (error) {
        console.error("Error fetching user's teams:", error);
        return [];
    }
}

export async function getOneTeam(teamId, userId) {
    try {
        const res = await fetch(`/api/teams/${teamId}?userId=${userId}`);
        const data = await res.json();
        return data.team;
    } catch (error) {
        console.error("Error fetching team:", error);
        return {};
    }
}

export async function createTeam(admin, title, description) {
    try {
         const res = await fetch("/api/teams", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ admin, title, description }),
        });
        return await res.json();
    } catch (error) {
        console.error("Error creating team:", error);
        return { success: false };
    }
}

export async function deleteTeam(teamId, userId) {
    try{
        const res = await fetch(`/api/teams/${teamId}`,{
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
        });
        return await res.json();
    }catch(error){
        console.log("Error deleting the team: ", error);
    }
}

export async function updateTeam(teamId, userId, updatedTeam) {
    try{
        const res = await fetch(`/api/teams/${teamId}`,{
        method: "PATCH",
        headers: {"Content-type":"application/json"},
        body: JSON.stringify({userId, ...updatedTeam}),
        });
        return await res.json();
    }catch(error){
        console.log("Error while updating team: ", error)
    }
}
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

export async function getTeamData(teamId, userId) {
    try {
        const res = await fetch(`/api/teams/${teamId}?userId=${userId}`);
        const data = await res.json();
        return data.team;
    } catch (error) {
        console.error("Error fetching team data:", error);
        return {};
    }
}

export async function createTeam(userId, title, description) {
    let res;
    try {
         res = await fetch("/api/teams", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, title, description }),
        });
    } catch (error) {
        console.error("Error creating team:", error);
    }
    return res;
}
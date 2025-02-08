// app/utils/userAPI.js

export async function saveUser(user) {
    const res = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        connection: user.sub.split("|")[0], // e.g., "google-oauth2"
    }),
    });
    return res.json();
  }
  

// export const getUserTasks = async (user) => {
//     try {
//         const response = await fetch(`/api/user-tasks`, {
//             method: "GET",
//             headers: {
//             "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//             email: user.email,
//             connectionType: user.sub.split("|")[0], // e.g., "google-oauth2"
//             }),
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.error || "Failed to retrieve user's tasks from the database");
//         }

//         console.log("User's tasks retrieved from the database!");
//     } catch (error) {
//         console.error("Error retrieving user's tasks from the database:", error);
//     }
// }
  
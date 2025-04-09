// app/services/pomodoro.js

export const createSession = async (userId, focusSeconds) => {
  try {
    const response = await fetch("/api/pomodoro", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          focusSeconds,
          userId,
      }),
    });

    const data = await response.json();
    console.log(data);
    console.log("Session Created:", data);
    return data;
  } 
  catch (error) {
    console.error("Error creating session:", error);
    return null;
  }
}

export const getUserPomoStats = async (userId) => {
  try {
    const response = await fetch(`/api/pomodoro/user/${userId}`);
    const data = await response.json();
    return data.stats;
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    return null;
  }
}
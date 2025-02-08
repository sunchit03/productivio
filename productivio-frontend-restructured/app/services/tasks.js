// app/services/tasks.js

// Get All Tasks for a User
export const getUserTasks = async (userId) => {
  try {
    const response = await fetch(`/api/tasks/user/${userId}`);
    const data = await response.json();
    return data.tasks;
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    return [];
  }
};

// Get All Tasks for a Team
export const getTeamTasks = async (teamId) => {
  try {
    const response = await fetch(`/api/tasks/team/${teamId}`);
    const data = await response.json();
    return data.tasks;
  } catch (error) {
    console.error("Error fetching team tasks:", error);
    return [];
  }
};

// Get a specific task
export async function getTaskById(taskId) {
    try {
      const res = await fetch(`/api/tasks/${taskId}`);
      return await res.json();
    } catch (error) {
      console.error("Error fetching task:", error);
      return { success: false, error: error.message };
    }
  }

// Create a New Task (Individual or Team)
export const createTask = async (taskData) => {
  try {
    const response = await fetch(`/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating task:", error);
    return { success: false };
  }
};

// Delete a Task (Only Creator Can Delete)
export const deleteTask = async (taskId, userId) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error deleting task:", error);
    return { success: false };
  }
};

// Update a Task (Only Creator or Assigned User)
export const updateTask = async (taskId, userId, updatedData) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...updatedData }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating task:", error);
    return { success: false };
  }
};

// Mark a Task as Completed (Only Assigned User)
export const completeTask = async (taskId, userId) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}/complete`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error completing task:", error);
    return { success: false };
  }
};

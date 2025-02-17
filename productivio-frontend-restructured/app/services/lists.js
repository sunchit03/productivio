// app/services/lists.js

// Get All Lists for a User
export const getUserLists = async (userId) => {
    try {
      const response = await fetch(`/api/lists/user/${userId}`);
      const data = await response.json();
      return data.lists;
    } catch (error) {
      console.error("Error fetching user lists:", error);
      return [];
    }
};

// Create a New List
export const createList = async (listData) => {
    try {
      const response = await fetch(`/api/lists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listData),
      });
      return await response.json();
    } catch (error) {
      console.error("Error creating list:", error);
      return { success: false };
    }
  };
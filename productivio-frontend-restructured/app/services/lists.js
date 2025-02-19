// app/services/lists.js

// Get All Lists for a User
export const getUserLists = async (userId) => {
    try {
        if (!userId) return [];
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

// Delete a List
export const deleteList = async (listId, userId) => {
    try {
      const response = await fetch(`/api/lists/${listId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error deleting list:", error);
      return { success: false };
    }
  };
  
  // Update a List
  export const updateList = async (listId, userId, updatedData) => {
    try {
      const response = await fetch(`/api/lists/${listId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...updatedData }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error updating list:", error);
      return { success: false };
    }
  };
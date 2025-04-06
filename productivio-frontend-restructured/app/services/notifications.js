// app/services/notifications.js

// Get All Notifications for a User
export const getUserNotifications = async (userId) => {
    try {
      if (!userId) return [];
      const response = await fetch(`/api/notifications/user/${userId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user notifications:", error);
      return [];
    }
  };

// Create notification
export const createNotification = async (notificationData) => {
    try {
        const response = await fetch(`/api/notifications`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(notificationData)
        });
        return await response.json();
    } catch (error) {
        console.error("Error creating notification: ", error);
        return { success: false };
    }
}

// Mark notifications as read
export const updateNotifications = async (userId) => {
    try {
      const response = await fetch(`/api/notifications/user/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error updating notification:", error);
      return { success: false };
    }
  };

// Delete a Notification
export const deleteNotification = async (notificationsId, userId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationsId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error deleting notification:", error);
      return { success: false };
    }
  };

// Delete all Notifications for a User
export const deleteAllNotifications = async (userId) => {
    try {
      const response = await fetch(`/api/notifications/user/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error deleting notifications:", error);
      return { success: false };
    }
  };  
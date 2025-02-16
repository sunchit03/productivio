// NotificationsModal.jsx
import { useState } from "react";

export default function NotificationsModal({ onClose, notifications, activities }) {
    const [tab, setTab] = useState("notifications");
    
    return (
      <div className="fixed top-2 left-16 min-h-[70%] w-80 bg-white shadow-lg rounded-lg z-50">
        <div className="bg-white p-4 rounded ">
          <div className="flex justify-evenly">
            <button onClick={() => setTab("notifications")} className={tab === "notifications" ? "font-bold text-black" : "text-black"}>Notifications</button>
            <button onClick={() => setTab("activities")} className={tab === "activities" ? "font-bold text-black" : "text-black"}>Activity</button>
          </div>
          <div className="mt-4">
            {tab === "notifications" && (
              <ul>
                {notifications.map((n, i) => <li key={i} className="p-2 border-b">{n}</li>)}
              </ul>
            )}
            {tab === "activities" && (
              <ul>
                {activities.map((a, i) => <li key={i} className="p-2 border-b">{a}</li>)}
              </ul>
            )}
          </div>
          <button className="absolute inset-x-0 bottom-0 w-full p-2 border rounded text-black" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }
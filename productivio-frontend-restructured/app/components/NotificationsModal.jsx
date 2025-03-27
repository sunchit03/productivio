// NotificationsModal.jsx
import { useState } from "react";
import { GiMicrophone } from "react-icons/gi";
import NotificationItem from "./NotificationItem";

export default function NotificationsModal({ onClose, notifications }) {
    
    return (
      <div className="fixed top-2 left-16 min-h-[70%] w-80 bg-white shadow-lg rounded-lg z-50">
        <div className="bg-white p-4 rounded h-full">
          <div className="flex justify-evenly">
            <div className="font-bold text-black">Notifications</div>
          </div>
          <div className="mt-4">
            {notifications.length > 0 ? (
              <ul>
                {notifications.map((notification) => 
                  <NotificationItem notification={notification} />
                )}
              </ul>
            ):
            <div className="flex flex-col items-center justify-center h-full text-black cursor-default">
              <div className="flex mb-2 items-center">
                <GiMicrophone size={"4em"} className="text-violet-300" />   
              </div>
              <span className="text-center text-base font-medium">No notifications</span>
              <span className="text-center text-xs font-thin">Team related messages will appear here</span>    

            </div>
            }
          </div>
          <button className="absolute inset-x-0 bottom-0 w-full p-2 border rounded text-black" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }
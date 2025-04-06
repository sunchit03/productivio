// NotificationsModal.jsx
import { useState, useEffect } from "react";
import { IoClose  } from "react-icons/io5";
import { GrClearOption } from "react-icons/gr";
import { GiMicrophone } from "react-icons/gi";
import NotificationItem from "./NotificationItem";

export default function NotificationsModal({ onClose, notifications, readNotifications, clearNotifications }) {
  const [modalNotifications, setModalNotifications] = useState([]);

  useEffect(() => {
    setModalNotifications(notifications);
  }, [notifications.length])


  const handleNotificationsClear = () => {
    clearNotifications();
    setModalNotifications([]);
  }

  const handleModalClose = () => {
    if (modalNotifications.some(notification => notification.new)) {
      readNotifications();
    }
    onClose();
  }

  return (
    <div className="fixed top-2 left-16 h-[75%] w-80 bg-white shadow-xl rounded-lg z-50">
      <div className="bg-white p-4 rounded h-full">
        <div className="flex justify-between">
          <div className={`p-1 hover:bg-gray-100 hover:rounded-md`}>
            <IoClose size={"1.5em"} className={`text-gray-400 font-thin cursor-pointer`} onClick={handleModalClose} />
          </div>
          <div className="font-bold text-black">Notifications</div>
          <div className={`p-1 hover:bg-gray-100 hover:rounded-md`}>
            <GrClearOption size={"1.3em"} 
              title="Clear All"
              className={`text-gray-400 font-thin ${modalNotifications.length === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`} 
              onClick={handleNotificationsClear} 
            />
          </div>
        </div>
        <div className="mt-4 mb-2 h-[85%] lg:overflow-y-auto overflow-y-hidden hover:overflow-y-auto">
          {modalNotifications.length > 0 ? (
              modalNotifications.map((notification) => (
                <div className="group" key={notification._id}>
                  <NotificationItem key={notification._id} notification={notification} />
                  <div className={`h-[1px] bottom-0 group-hover:invisible z-10 bg-purple-50`}></div>
                </div>
              ))
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
      </div>
    </div>
  );
}
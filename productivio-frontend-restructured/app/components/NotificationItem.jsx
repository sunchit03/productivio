import { useState } from 'react';
import { MdAssignmentAdd, MdOutlineGroupOff  } from "react-icons/md";
import { BiTaskX } from "react-icons/bi";
import { LuUserRoundMinus, LuUserRoundPlus } from "react-icons/lu";
import { GrUserAdmin } from "react-icons/gr";


export default function NotificationItem({ notification }) {

    const iconType = (type) => {
        switch (type) {
            case 'task-allocate': return <MdAssignmentAdd />
            case 'task-deallocate': return <BiTaskX />
            case 'team-member-addition': return <LuUserRoundPlus />
            case 'team-member-removal': return <LuUserRoundMinus />
            case 'team-admin-assignment': return <GrUserAdmin />
            case 'team-deletion': return <MdOutlineGroupOff />
        }
    }

    return (
        <>
            <li key={notification._id} className="group flex items-center">
                <div className={`relative w-full px-3 py-2 flex justify-between rounded-md hover:bg-indigo-500/5`}>
                    <div className="w-full flex items-center">
                        <span>{iconType(notification.type)}</span>
                        <div className='flex flex-col'>
                            <span className="text-black">{notification.title}</span>
                        </div>
                    </div>
                </div>
            </li>
        </>
    )
}
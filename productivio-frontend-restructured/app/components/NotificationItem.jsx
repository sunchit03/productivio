import { useState } from 'react';
import { MdAssignmentAdd, MdOutlineGroupOff  } from "react-icons/md";
import { BiTaskX } from "react-icons/bi";
import { LuUserRoundMinus, LuUserRoundPlus } from "react-icons/lu";
import { GrUserAdmin } from "react-icons/gr";


export default function NotificationItem({ notification }) {

    const iconType = (type) => {
        switch (type) {
            case 'task-allocate': return <MdAssignmentAdd size={"2em"} className='text-violet-400'/>
            case 'task-deallocate': return <BiTaskX size={"2em"} className='text-violet-400'/>
            case 'team-member-addition': return <LuUserRoundPlus size={"2em"} className='text-violet-400'/>
            case 'team-member-removal': return <LuUserRoundMinus size={"2em"} className='text-violet-400'/>
            case 'team-admin-assignment': return <GrUserAdmin size={"2em"} className='text-violet-400'/>
            case 'team-deletion': return <MdOutlineGroupOff size={"2em"} className='text-violet-400'/>
        }
    }

    return (
        <>
            <li key={notification._id} className="group flex items-center">
                <div className={`relative w-full px-3 py-2 flex justify-between rounded-md hover:bg-indigo-500/5 ${notification.new && "bg-indigo-50"}`}>
                    <div className="w-full flex items-center">
                        <span className='mr-3'>{iconType(notification.type)}</span>
                        <div className='flex flex-col'>
                            <span className="text-black text-sm">{notification.title}</span>
                        </div>
                    </div>
                </div>
            </li>
        </>
    )
}
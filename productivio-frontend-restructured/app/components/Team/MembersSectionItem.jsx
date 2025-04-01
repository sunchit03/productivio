import { useState } from 'react';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import { FiMoreHorizontal } from "react-icons/fi";

import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';
import RemoveMemberModal from './RemoveMemberModal';
import InfoMemberModal from './InfoMemberModal';

export default function MembersSectionItem({ member, isAdmin, adminId, userId, memberRemoval }) {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    
  const removeMember = () => {
    memberRemoval(member._id);
    setIsRemoveModalOpen(false);
  }

  return (
    <>
      <li key={member._id} className="group flex items-center">
        <div className={`relative w-full text-left px-3 py-2 flex justify-between rounded-md hover:bg-indigo-500/5`}>
          {/* Profile Picture & Email */}
          <div className="w-full flex items-center">
            <img
              src={member.profilePicture || "/assets/default-avatar.jpg"} // Use a default image if no profile picture
              alt={member.email}
              className="w-8 h-8 rounded-full border mr-2"
            />
            <div className='flex flex-col'>
              <span className="text-black">{member.email}</span>
              <div className='flex flex-row'>
                {member._id === adminId &&
                        <small className="text-gray-500">Admin</small>
                }
                {member._id === adminId && member._id === userId &&
                        <small className="text-gray-500 mx-1">|</small>
                }
                {member._id === userId &&
                        <small className="text-gray-500">Myself</small>
                }
              </div>
            </div>
          </div>
          <div>
            <Menu 
              menuButton= {
                <MenuButton>
                  <FiMoreHorizontal className="absolute right-2 top-3 group-hover:visible invisible text-gray-400 hover:text-gray-900"/>
                </MenuButton>
              }
              key={'bottom'}
              direction={'bottom'}
              align={'start'}
              position={'anchor'}
              viewScroll={'initial'}
              arrow={false}
              gap={10}
              shift={0}
            >
              <MenuItem key={"Info"} onClick={() => setIsInfoModalOpen(true) }>Info</MenuItem>
              {/* {userId != member._id &&
                <MenuItem key={"Call"}>{"Call (Coming Soon)"}</MenuItem>
              } */}
              {isAdmin && userId !== member._id &&
                <MenuItem key={"Remove"} onClick={() => setIsRemoveModalOpen(true) }>Remove</MenuItem>
              }
            </Menu>
          </div>
                

        </div>
      </li>

        {/* Modal for removing a member */}
        {isRemoveModalOpen && 
          <RemoveMemberModal 
            member={member}
            onClose={() => setIsRemoveModalOpen(false)}
            removeMember={removeMember}
          />
        }

        {/* Modal for team member info */}
        {isInfoModalOpen && 
          <InfoMemberModal 
            member={member}
            onClose={() => setIsInfoModalOpen(false)}
          />
        }
    </>
  )
}
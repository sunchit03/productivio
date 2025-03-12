import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { HiCheck, HiChevronDown } from "react-icons/hi2";
import clsx from 'clsx';
import { useEffect, useState } from 'react';

export default function LeaveTeamModal({ onClose, leaveTeam, isAdmin, members, deleteTeam, userId }) {
  const [filteredMembers, setFilteredMembers] = useState(members);
  const [newAdmin, setNewAdmin] = useState(members.length >= 2 ? members[1]: null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (query.trim().length == 0) {
      const exceptMe = members.filter(member => member._id !== userId);
      setFilteredMembers(exceptMe);
    } else {
      const filtered = members.filter(member =>
        member._id !== userId && member?.email.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  }, [query])
  
    const handleLeaveTeam = (e) => {
      e.preventDefault();
  
      if (members.length == 1) {

        deleteTeam();

      } else {

        if (isAdmin) {

          if (!newAdmin) {
            return;
          }

          leaveTeam(newAdmin)
        }
        leaveTeam(null);
      }
    }
  
    return (
      <div className="fixed inset-0 flex items-start justify-center bg-gray-100 bg-opacity-40 z-50 pt-20 drop-shadow-xl">
        <div className="xs:w-5/6 xssm:w-4/5 mdlg:w-3/5 bg-white p-6 rounded-md shadow-lg w-2/5">
          <h2 className="text-lg font-semibold mb-4 text-black">Leave team?</h2>
          <form onSubmit={(e) => handleLeaveTeam(e)}>
            <label className="block text-black mb-2">
              <div className="mt-1">
                <span className="text-black">
                  Are you sure you want to leave the team?
                </span>
              </div>
            </label>

            {/* Conditional Messages */}
            {members.length === 1 && (
              <div>
                <span className="text-sm text-black">This team will be deleted.</span>
              </div>
            )}

            {members.length === 2 && isAdmin && (
              <div>
                <span className="text-sm text-black">"{members[1].email}" will be the new admin.</span>
              </div>
            )}

            {members.length > 2 && isAdmin && (
              <div>
                <span className="text-sm text-black">Select a new admin before leaving.</span>

                <div className="relative w-full">
                  <Combobox value={newAdmin} onChange={(value) => setNewAdmin(value)} onClose={() => setQuery('')}>
                    
                      <ComboboxInput
                        className='w-full mb-2 border rounded p-2 text-black focus:outline-none focus:ring-1 focus:ring-violet-500'
                        displayValue={(member) => member?.email}
                        onChange={(event) => setQuery(event.target.value)}
                      />
                      <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                        <HiChevronDown className="size-4 text-purple/60 group-data-[hover]:text-purple" />
                      </ComboboxButton>

                    <ComboboxOptions
                      // anchor="bottom"
                      className="absolute w-full border bg-gray-800 rounded-md text-gray-200 text-sm shadow-md overflow-auto"
                    >
                      {filteredMembers.map((member) => (
                        <ComboboxOption
                          key={member._id}
                          value={member}
                          className="group flex cursor-pointer items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-violet-500/25 data-[selected]:bg-violet-500/15"
                        >
                          <HiCheck className="invisible size-4 text-white group-data-[selected]:visible" />
                          <div className="text-sm/6 text-purple">{member.email}</div>
                        </ComboboxOption>
                      ))}
                    </ComboboxOptions>
                  </Combobox>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-4">
              <div className="flex-1"></div>
              <div className="flex flex-1 justify-stretch">
                <button type="button" 
                    onClick={onClose} 
                    className="mr-2 px-4 py-2 flex-1 border border-gray-400 bg-white text-gray-500 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 flex-1 bg-violet-500 text-white rounded hover:bg-violet-500/75">
                  Leave
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
  
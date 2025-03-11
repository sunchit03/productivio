import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Field, Label } from '@headlessui/react'
import { FcGoogle } from "react-icons/fc";
import { SiAuth0 } from "react-icons/si";
import { getAllUsers } from "@/app/services/users";
import { useEffect, useState } from "react";

export default function AddMemberModal({ onClose, addUser, inviteUser, teamMembers, userId }) {
  const [queryUserExists, setQueryUserExists] = useState(true);

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [query, setQuery] = useState('');

  const fetchAllUsers = async () => {
    const allUsers = await getAllUsers();
    if (allUsers) {
      console.log(allUsers);
      const filteredData = allUsers.filter(
        (user) => !teamMembers.some((member) => member._id === user._id) && user._id !== userId
      );      
      setUsers(filteredData);
      
    } else {
      setUsers([]);
    }
  }

  useEffect(() => {
    fetchAllUsers();
  }, [teamMembers.length]);

  useEffect(() => {
    if (query.trim().length < 4) {
      setFilteredUsers([]);
    } else {
      const filtered = users.filter(user =>
        user?.email.toLowerCase().includes(query.toLowerCase())
      );
      setQueryUserExists(filtered.length !== 0);
      setFilteredUsers(filtered.slice(0, 5));
    }

  }, [query, users.length]);

  
  async function handleUserAdd(e) {
    e.preventDefault();

    if (query.trim() === "") {
      // email cannot be empty
      return;
    }

    if (selectedUser === null) {
      // select a email
      return;
    }

    if (teamMembers.some((member) => member.email === selectedUser?.email)) {
      // already in the team
      return;
    }

    addUser(selectedUser);
  }

  async function handleUserInvite(e) {
    e.preventDefault();

    if (query.trim() === "") {
      // email cannot be empty
      console.log('111');
      return;
    }
    console.log(query);

    const regex = new RegExp("^[\\w.%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    if (!regex.test(query.trim())) {
      // enter a valid email
      console.log('222');
      return;
    }

    if (teamMembers.some((member) => member.email === query.trim())) {
      // already in the team
      console.log('333');
      return;
    }

    if (users.some((user) => user.email === query.trim())) {
      // something went wrong
      console.log('444');
      return;
    }

    inviteUser(query.trim().toLowerCase());
  }

  const connectionLogo = (connectionType) => {
    switch (connectionType) {
      case 'auth0':
        return <SiAuth0 className='text-orange-500'/>

      case 'google-oauth2':
        return <FcGoogle />;
    }
  }

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-gray-100 bg-opacity-40 pt-20 z-50 drop-shadow-xl">
      <div className="xs:w-5/6 xssm:w-4/5 mdlg:w-3/5 bg-white p-6 rounded-md shadow-lg w-2/5">
        <h2 className="text-xl font-bold mb-4 text-black">Add Member</h2>

        <form>
          <Field>
            <Label className="block text-black mb-2">
              <div className="relative w-full">
              <Combobox value={selectedUser} onChange={setSelectedUser}>
                <ComboboxInput
                  displayValue={queryUserExists ? (user) => user?.email: query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Enter email"
                  className="w-full mb-2 border rounded p-2 text-black focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
                <ComboboxOptions
                  className={`${filteredUsers.length === 0 && queryUserExists && 'invisible'} 
                  absolute w-full border bg-gray-800 rounded-md text-gray-200 text-sm shadow-md overflow-auto`}
                >
                  
                {query.length >= 4 && !queryUserExists && (
                  <ComboboxOption key={null} value={query} className="data-[focus]:bg-violet-500/25 p-2 cursor-pointer">
                    <span className="italic">"{query}"</span>
                  </ComboboxOption>
                )}
                  
                  {filteredUsers.map((user) => (
                    <ComboboxOption key={user._id} value={user} className="data-[focus]:bg-violet-500/25 border p-2 cursor-pointer flex items-center justify-between">
                      <span>{user.email}</span>
                      <span className='mr-1 p-1 bg-gray-100'>{connectionLogo(user.connection)}</span>
                    </ComboboxOption>
                    
                  ))}
                </ComboboxOptions>
              </Combobox>
              </div>
            </Label>
          </Field>

          <div className="flex justify-between mt-2">
            <div className="flex-1"></div>
            <div className="flex flex-1 justify-stretch">
              <button 
                type="button" 
                onClick={onClose} 
                className="mr-2 px-4 py-2 flex-1 border border-gray-400 bg-white text-gray-500 rounded hover:bg-gray-100">
                  Cancel
              </button>

              {(query.length === 0 || queryUserExists) ? (
                <button className="px-4 py-2 flex-1 bg-violet-500 text-white rounded hover:bg-violet-500/75"
                  onClick={(e) => handleUserAdd(e)}>
                    Add
                </button>
              ) : (
                <button className="px-4 py-2 flex-1 bg-violet-500 text-white rounded hover:bg-violet-500/75 text-sm"
                  onClick={(e) => handleUserInvite(e)}>
                    Send Invite
                </button>
              )
            }
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import { TbMoodWink2 } from "react-icons/tb";
import EmojiPicker from 'emoji-picker-react';
import { FaAngleRight, FaAngleDown } from "react-icons/fa6";
import { FiMoreHorizontal } from "react-icons/fi";
import { createList, deleteList, getUserLists, updateList } from "@/app/services/lists";

import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';

const SidebarListsDropdown = ({ activeTab, setActiveTab, activeList, setActiveList, userId }) => {
  const [lists, setLists] = useState([]);
  const [isListsDropdownOpen, setIsListsDropdownOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState({isOpen: false, isEdit: false, list: null});
  const [isListDeleteModalOpen, setIsListDeleteModalOpen] = useState({isOpen: false, list: null});
  const [isHovered, setIsHovered] = useState(false);
  const [newList, setNewList] = useState({ name: "", emoji: "" });
  const [showPicker, setShowPicker] = useState(false);

  const fetchLists = async () => {
    try {
      const data = await getUserLists(userId);

      if (!data) {
        setLists([]);
        return;
      }

      setLists(data);
    } catch(error) {
      console.error("Error fetching lists:", error);
    }
  }

  useEffect(() => {
    if (userId) {
      fetchLists()
    }
  }, [userId])

  const openListModal = (isEdit = false, list = {id: "", name: "", emoji: ""}) => {
    setNewList({ name: list.name, emoji: list.emoji }); 
    setShowPicker(false)
    setIsListModalOpen({isOpen: true, isEdit, list});
  };

  const closeListModal = () =>  setIsListModalOpen({isOpen: false, isEdit: false, list: null});

  const handleAddEditList = async (e, isEdit = false, list = null) => {
    e.preventDefault();
    if (!newList.name) return;

    try {
      let data;
      if (isEdit) {
        data = await updateList(list._id, userId, {name: newList.name, emoji: newList.emoji || "📁"});
      } else {
        data = await createList({name: newList.name, emoji: newList.emoji || "📁", createdBy: userId});
      }

      if (data.success) {
        console.log("List is created!");
        await fetchLists().then(() => {
          setActiveTab("Lists");
          setActiveList( {id: data.list._id, emoji: data.list.emoji, name: data.list.name});
        });
      }
    } catch (error) {
      console.error("Error creating list:", error);
    }

    setNewList({ name: "", emoji: "" });
    closeListModal();
  };

  const addEditListModal = (isEdit = false, list) => {
    return (
      <div className="fixed inset-0 flex items-start justify-center bg-gray-900 bg-opacity-0 z-50 top-10 drop-shadow-xl">
        <div className="bg-white p-6 rounded-md shadow-lg w-2/5">
          <h2 className="text-xl font-bold mb-4 text-black">
            {isEdit ? "Edit List" : "New List"}
          </h2>
          <form onSubmit={(e) => handleAddEditList(e, isEdit, list)}>
            <label className="block text-black mb-2">
              <div className="relative mt-1">
                <span 
                  onClick={() => setShowPicker((val) => !val)}
                  className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer text-xl"
                >
                  {newList.emoji === "" ? <TbMoodWink2 /> : newList.emoji}
                </span>
                <input
                  type="text"
                  value={newList.name}
                  onChange={(e) => setNewList({ ...newList, name: e.target.value })}
                  placeholder="Name"
                  className="w-full border rounded p-2 pl-10 text-black"
                  required
                  autoFocus
                />
                {showPicker && (
                  <div className="absolute z-10 mt-2 -mx-5">
                    <EmojiPicker
                      width={300}
                      height={350}
                      autoFocusSearch={true}
                      emojiStyle="google"
                      onEmojiClick={handleEmojiClick}
                      previewConfig={{ showPreview: false }}
                    />
                  </div>
                )}
              </div>
            </label>
            <div className="flex justify-between mt-4">
              <div className="flex-1"></div>
              <div className="flex flex-1 justify-stretch">
                <button type="button" onClick={closeListModal} className="mr-2 px-4 py-2 flex-1 border border-gray-400 bg-white text-gray-500 rounded hover:bg-gray-100">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 flex-1 bg-violet-500 text-white rounded hover:bg-violet-500/75">
                  {isEdit ? "Edit" : "Create"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const handleEmojiClick = (emojiData, _) => {
    setNewList({ ...newList, emoji: emojiData.emoji });
    setShowPicker(false);
  };

  const openDeleteModal = (list) => {
    setIsListDeleteModalOpen({isOpen: true, list});
  }

  const closeDeleteModal = () => {
    setIsListDeleteModalOpen({isOpen: false, list: null});
  }

  const handleDeleteList = async (e, listId) => {
    e.preventDefault();

    try {
      let data = await deleteList(listId, userId);

      if (data.success) {
        console.log("List is deleted!");
        fetchLists();

        if (activeList.id == listId) {
          setActiveList({});
          setActiveTab("Inbox");
        }
      }
    } catch (error) {
      console.error("Error deleting list:", error);
    }

    setIsListDeleteModalOpen(false, null);
  }

  const deleteListModal = (list = {id: "", emoji: "", name: ""}) => {
    return (
      <div className="fixed inset-0 flex items-start justify-center bg-gray-900 bg-opacity-0 z-50 top-10 drop-shadow-xl">
        <div className="bg-white p-6 rounded-md shadow-lg w-2/5">
          <h2 className="text-lg font-semibold mb-4 text-black">Delete list "{list.emoji} {list.name}"?</h2>
          <form onSubmit={(e) => handleDeleteList(e, list._id)}>
            <label className="block text-black mb-2">
              <div className="mt-1">
                <span className="text-black">
                  All tasks in the list will be deleted.
                </span>
              </div>
            </label>
            <div className="flex justify-between mt-4">
              <div className="flex-1"></div>
              <div className="flex flex-1 justify-stretch">
                <button type="button" onClick={closeDeleteModal} className="mr-2 px-4 py-2 flex-1 border border-gray-400 bg-white text-gray-500 rounded hover:bg-gray-100">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 flex-1 bg-violet-500 text-white rounded hover:bg-violet-500/75">
                  Delete
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
        <div className="flex justify-between hover:hover:bg-indigo-500/5 rounded-md">
          <button
            onClick={() => setIsListsDropdownOpen(!isListsDropdownOpen)}
            className="w-full text-left py-1 flex items-center"
          >
            { isHovered ? (
              <>
                <span>{isListsDropdownOpen ? 
                  <FaAngleDown size={"0.75em"} className="text-black/50 hover:text-black/100"/> 
                  : 
                  <FaAngleRight size={"0.75em"} className="text-black/50 hover:text-black/100"/> }
                </span>
                <span className="ml-1 text-xs font-semibold">Lists</span>
              </>
            ):
            <span className="ml-4 text-xs font-semibold">Lists</span>
            }
            
          </button>
          {isHovered &&
            <button
              onClick={() => openListModal()}
              className="text-black/50 hover:text-black/100 px-2 text-md"
            >
              +
            </button>
          }
        </div>
      {isListsDropdownOpen && (
        <div className="rounded-md">
          <ul>
            {lists.length > 0 ? (
              lists.map((list) => (
                <li key={list._id} className="group flex items-center cursor-pointer">
                  <div
                    className={`relative w-full text-left px-3 py-2 flex justify-between rounded-md 
                      ${activeTab === 'Lists' && activeList.id === list._id ? "bg-indigo-500/15" : "hover:bg-indigo-500/5"}`}
                  >
                    <div className="w-full flex items-center" 
                      onClick={() => {
                      setActiveTab('Lists');
                      setActiveList({id: list._id, emoji: list.emoji, name: list.name});
                    }}>
                      <span className="mr-[8px] flex-none self-center">{list.emoji}</span>
                      <p className="text-sm font-normal flex-auto truncate pr-4">{list.name}</p>
                    </div>

                    <div>
                      <Menu
                        menuButton=
                          {
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
                        <MenuItem key={"Edit"} onClick={() => openListModal(true, list)}>{"Edit"}</MenuItem>
                        <MenuItem key={"Delete"} onClick={() => openDeleteModal(list)}>{"Delete"}</MenuItem>
                      </Menu>
                    </div>

                  </div>
                </li>
              ))
            ) : (
              <div className="px-3 py-2 bg-gray-100/50 rounded-md text-gray-400 text-xs">Use lists to categorize and manage your tasks and notes</div>
            )}
          </ul>
        </div>
      )}

      {/* Modal for adding / editing a list */}
      {isListModalOpen.isOpen && addEditListModal(isListModalOpen.isEdit, isListModalOpen.list)}

      {/* Modal for deleting a list */}
      {isListDeleteModalOpen.isOpen && deleteListModal(isListDeleteModalOpen.list)}
    </div>
  );
};

export default SidebarListsDropdown;

import { useState } from "react";
import { TbMoodWink2 } from "react-icons/tb";
import EmojiPicker from 'emoji-picker-react';
import { FaAngleRight, FaAngleDown } from "react-icons/fa6";
import { useLists } from "../../context/ListsContext";

const SidebarListsDropdown = ({ setActiveTab, setActiveList }) => {
  const [isListsDropdownOpen, setIsListsDropdownOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [newList, setNewList] = useState({ name: "", emoji: "" });
  const [showPicker, setShowPicker] = useState(false);
  const { lists, addList, selectList } = useLists();

  const openListModal = () => {
    setNewList({ name: "", emoji: "" });
    setShowPicker(false)
    setIsListModalOpen(true)
  };
  const closeListModal = () =>  setIsListModalOpen(false);

  const handleEmojiClick = (emojiData, event) => {
    setNewList({ ...newList, emoji: emojiData.emoji });
    setShowPicker(false);
  };

  const handleAddList = (e) => {
    e.preventDefault();
    if (!newList.name) return;

    if (!newList.emoji) {
      addList({name: newList.name, emoji: "📁"});
    } else {
      addList(newList);
    }

    setNewList({ name: "", emoji: "" });
    closeListModal();
  };

  return (
    <div className="relative w-full" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <button
        onClick={() => setIsListsDropdownOpen(!isListsDropdownOpen)}
        className="w-full text-left py-1 hover:bg-gradient-to-bl from-violet-100 to-fuchsia-100 hover:rounded-sm flex items-center"
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
          onClick={openListModal}
          className="absolute right-3 top-0 text-black/50 hover:text-black/100 px-2 text-md"
        >
          +
        </button>
      }
      {isListsDropdownOpen && (
        <div className="rounded-md">
          <ul className="">
            {lists.length > 0 ? (
              lists.map((list) => (
                <li key={list.id} className="flex relative px-[10px]">
                  <button  
                    onClick={() => {
                      setActiveTab(`lists`);
                      setActiveList({id: list.id, emoji: list.emoji, name: list.name});
                      selectList(list.id);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gradient-to-bl from-violet-100 to-fuchsia-100 hover:rounded-sm flex items-center"
                  >
                    <span className="mr-[8px] w-[18px] h-[18px] flex-none">{list.emoji}</span>
                    <p className="text-sm font-normal flex-auto">{list.name}</p>
                  </button>
                </li>
              ))
            ) : (
              <div className="px-3 py-2 bg-gray-100 rounded-sm text-gray-400 text-xs">Use lists to categorize and manage your tasks and notes</div>
            )}
          </ul>
        </div>
      )}

      {/* Modal for adding a new list */}
      {isListModalOpen && (
        <div className="fixed inset-0 flex items-start justify-center bg-gray-900 bg-opacity-50 z-50 mt-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-2/5">
            <h2 className="text-xl font-bold mb-4 text-black">New List</h2>
            <form onSubmit={handleAddList}>
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
                        autoFocusSearch={false}
                        emojiStyle="google"
                        onEmojiClick={handleEmojiClick}
                        previewConfig={{ showPreview: false }}
                      />
                    </div>
                  )}
                </div>
              </label>
              <div className="flex justify-end mt-4">
                <button type="button" onClick={closeListModal} className="mr-2 px-4 py-2 bg-gray-400 text-white rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                  Add List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarListsDropdown;

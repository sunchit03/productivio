import { useState } from "react";
import { useLists } from "../../context/ListsContext";

const SidebarListsDropdown = ({ setActiveTab }) => {
  const [isListsDropdownOpen, setIsListsDropdownOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [newList, setNewList] = useState({ name: "", emoji: "📁" });
  const { lists, addList, selectList } = useLists();

  const openListModal = () => setIsListModalOpen(true);
  const closeListModal = () => setIsListModalOpen(false);

  const handleAddList = (e) => {
    e.preventDefault();
    if (!newList.name) return;
    addList(newList);
    setNewList({ name: "", emoji: "📁" });
    closeListModal();
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsListsDropdownOpen(!isListsDropdownOpen)}
        className="w-full text-left px-3 py-2 hover:bg-gray-200 flex justify-between items-center"
      >
        Lists
        <span className="ml-2">{isListsDropdownOpen ? "⇧" : "⇩"}</span>
      </button>
      <button
        onClick={openListModal}
        className="absolute right-3 top-2 text-black bg-white px-2 py-1 rounded-md text-sm transition-opacity duration-200"
      >
        +
      </button>
      {isListsDropdownOpen && (
        <div className="bg-white mt-1 p-2 rounded-md">
          {lists.length > 0 ? (
            lists.map((list) => (
              <button
                key={list.id}
                onClick={() => {
                  setActiveTab(`list-${list.id}`);
                  selectList(list.id);
                }}
                className="block w-full text-left px-3 py-2 hover:bg-gray-200 rounded-md flex items-center"
              >
                {list.emoji} <span className="ml-2">{list.name}</span>
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-gray-400">No lists yet.</p>
          )}
        </div>
      )}

      {/* Modal for adding a new list */}
      {isListModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-black">Create New List</h2>
            <form onSubmit={handleAddList}>
              <label className="block text-black mb-2">
                List Name:
                <input
                  type="text"
                  value={newList.name}
                  onChange={(e) => setNewList({ ...newList, name: e.target.value })}
                  className="w-full border rounded p-2 text-black mt-1"
                  required
                />
              </label>
              <label className="block text-black mb-2">
                Choose Emoji:
                <select
                  value={newList.emoji}
                  onChange={(e) => setNewList({ ...newList, emoji: e.target.value })}
                  className="w-full border rounded p-2 text-black mt-1"
                >
                  <option>📁</option>
                  <option>🎓</option>
                  <option>📅</option>
                  <option>💼</option>
                  <option>🏠</option>
                </select>
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

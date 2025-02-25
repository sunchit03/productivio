import { useState, useEffect } from "react";
import { FaAngleRight, FaAngleDown } from "react-icons/fa6";
import { createList, deleteList, getUserLists, updateList } from "@/app/services/lists";
import SidebarListItem from "./SidebarListItem";
import AddEditListModal from "./AddEditListModal";

const SidebarListsDropdown = ({ activeTab, setActiveTab, activeList, setActiveList, userId }) => {
  const [lists, setLists] = useState([]);
  const [isListsDropdownOpen, setIsListsDropdownOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState({isOpen: false, isEdit: false, list: null});
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

  const addEditList = async (isEdit = false, list = null) => {
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

    closeListModal();
  };

  const removeList = async (listId) => {
    try {
      let data = await deleteList(listId, userId);

      if (data.success) {
        console.log("List is deleted!");
        setLists(prevLists => prevLists.filter(prevList => prevList._id != listId))

        if (activeList.id == listId) {
          setActiveList({});
          setActiveTab("Inbox");
        }
      }
    } catch (error) {
      console.error("Error deleting list:", error);
    }
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

                <SidebarListItem 
                  key={list._id}
                  list={list} 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab}
                  activeList={activeList}
                  setActiveList={setActiveList}
                  openListModal={openListModal}
                  removeList={removeList}
                />
              ))
            ) : (
              <div className="px-3 py-2 bg-gray-100/50 rounded-md text-gray-400 text-xs">
                Use lists to categorize and manage your tasks and notes
              </div>
            )}
          </ul>
        </div>
      )}

      {/* Modal for adding / editing a list */}
      {isListModalOpen.isOpen && 
        <AddEditListModal 
          isEdit={isListModalOpen.isEdit} 
          list={isListModalOpen.list} 
          addEditList={addEditList}
          showPicker={showPicker}
          setShowPicker={setShowPicker}
          newList={newList}
          setNewList={setNewList}
          closeListModal={closeListModal} />
      }
    </div>
  );
};

export default SidebarListsDropdown;
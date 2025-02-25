import { useState } from 'react';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import { FiMoreHorizontal } from "react-icons/fi";


import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';


const SidebarListItem = ({ list, activeTab, setActiveTab, activeList, setActiveList, openListModal, removeList }) => {

    const [isListDeleteModalOpen, setIsListDeleteModalOpen] = useState(false);

    const handleDeleteList = (e) => {
        e.preventDefault();
    
        removeList(list._id);
    
        setIsListDeleteModalOpen(false);
      }


    const deleteListModal = () => {
        return (
          <div className="fixed inset-0 flex items-start justify-center bg-gray-900 bg-opacity-0 z-50 top-10 drop-shadow-xl">
            <div className="bg-white p-6 rounded-md shadow-lg w-2/5">
              <h2 className="text-lg font-semibold mb-4 text-black">Delete list "{list.emoji} {list.name}"?</h2>
              <form onSubmit={(e) => handleDeleteList(e)}>
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
                    <button type="button" 
                        onClick={() => setIsListDeleteModalOpen(false) } 
                        className="mr-2 px-4 py-2 flex-1 border border-gray-400 bg-white text-gray-500 rounded hover:bg-gray-100"
                    >
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
        <>
            <li key={list._id} className="group flex items-center cursor-pointer">
                <div className={`relative w-full text-left px-3 py-2 flex justify-between rounded-md 
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
                        <Menu menuButton= {
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
                            <MenuItem key={"Delete"} onClick={() => setIsListDeleteModalOpen(true) }>{"Delete"}</MenuItem>
                        </Menu>
                    </div>

                </div>
            </li>

            {/* Modal for deleting a list */}
            {isListDeleteModalOpen && deleteListModal()}
        </>
    )
}

export default SidebarListItem;
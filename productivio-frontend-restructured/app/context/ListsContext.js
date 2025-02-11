import { createContext, useContext, useState } from "react";

const ListsContext = createContext();

export const ListsProvider = ({ children }) => {
  const [lists, setLists] = useState([]);
  const [activeList, setActiveList] = useState(null);

  // Add a new list
  const addList = (list) => {
    const newList = { ...list, id: Date.now(), tasks: [] };
    setLists((prevLists) => [...prevLists, newList]);
  };

  // Select an active list
  const selectList = (listId) => {
    const foundList = lists.find((list) => list.id === listId);
    setActiveList(foundList || null);
  };

  // Add a task to the selected list
  const addTaskToList = (listId, task) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId ? { ...list, tasks: [...list.tasks, { ...task, id: Date.now() }] } : list
      )
    );
  };

  return (
    <ListsContext.Provider value={{ lists, addList, activeList, selectList, addTaskToList }}>
      {children}
    </ListsContext.Provider>
  );
};

export const useLists = () => useContext(ListsContext);

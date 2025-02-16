"use client";

import { useState, useEffect } from "react";
import { ImBin } from "react-icons/im";
import { FaEdit } from "react-icons/fa"; // Import edit icon
import EisenHowerTask from "@/app/components/EisenhowerMatrix/EisenhowerTask";


export default function EisenhowerMatrix() {

    const [tasks, setTasks] = useState([]);
    const [showModal,setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null); // Track the task being edited
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

    useEffect(() => {
        if(userId){
            fetchUserTasks();
        }
    }, [userId])

    async function fetchUserTasks() {
        try {
            const res = await fetch(`/api/user/tasks?userId=${userId}`);
            const data = await res.json();
    
            if (data.success) {
                console.log("Tasks fetched:", data.tasks);
                setTasks(data.tasks);
            } else {
                console.log("Tasks do not exist: ", data.error);
                setTasks([]);
            }
        } catch (error) {
            console.error("Error fetching tasks: ", error.message);
            setTasks([]);
        }
    }
    

    async function deleteTask(taskId) {
        try{
            const res = await fetch(`/api/user/tasks/${taskId}`, {
            method: "DELETE",
            headers: {"content-type":"application.json"},
            body: JSON.stringify({userId}),
        });
            const data = await res.json();
            if(data.success){
                console.log(data.tasks);
                fetchUserTasks();
            }
            else{
                console.log("Tasks not deleted: ", data.error);
            }
        }
        catch(error){
            console.error("Error fetching tasks after deleting: ", error.message);
        }
    }

    const handleTaskEdit = (task) => {
      setSelectedTask(task);
      setShowModal(true);
    }

    const urgentImportantTasks = tasks.filter(task => task.priority === "1");
    const notUrgentImportantTasks = tasks.filter(task => task.priority === "2");
    const urgentUnimportantTasks = tasks.filter(task => task.priority === "3");
    const notUrgentUnimportantTasks = tasks.filter(task => task.priority === "4");

    return (
      <div className="h-screen flex flex-col items-center bg-gray-100 p-4 overflow-hidden">
        <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full max-w-8xl h-[95vh] ">
          
          {/* Urgent & Important */}
          <div className="border rounded-lg p-4 bg-red-100 shadow-md overflow-y-auto">
            <h2 className="text-red-600 font-bold flex items-center">
              🔴 Urgent & Important
            </h2>
            <div className="flex flex-col gap-2 p-2">
            { urgentImportantTasks.length === 0 ? 
            (<p className="text-xl font-bold p-2 bg-white rounded-md">
                No Urgent and Important task's to display.</p>
            ) : (urgentImportantTasks.map(task => (
              <div className="flex items-center justify-between p-2 rounded-md shadow-md cursor-pointer hover:shadow-lg transition bg-white" key={task._id}>
                <span>📌 {task.title}</span>
                <div className="flex gap-2">
                    <button className="hover:bg-gray-300 p-1" onClick={() => deleteTask(task._id)}>
                        <ImBin />
                    </button>
                    <button className="hover:bg-gray-300 p-1" onClick={() => {handleTaskEdit(task)}}>
                        <FaEdit />
                    </button>
                </div>
              </div>
                )))}
            </div>
          </div>
          
  
          {/* Not Urgent & Important */}
          <div className="border rounded-lg p-4 bg-yellow-100 shadow-md">
            <h2 className="text-yellow-600 font-bold flex items-center">
              🟡 Not Urgent & Important
            </h2>
            <div className="flex flex-col gap-2 p-2">
            { notUrgentImportantTasks.length === 0 ? 
            (<p className="text-xl font-bold p-2 bg-white rounded-md">
                No Urgent and Important task's to display.</p>
            ) : (notUrgentImportantTasks.map(task => (
                <div className="text-md text-black p-2 bg-white rounded-md justify-between" key={task._id}>
                <span>{task.title}</span>
                <button className="hover:bg-gray-300" onClick={()=>{deleteTask(task._id)}}><ImBin/></button>
              </div>
                )))}
            </div>
          </div>
  
          {/* Urgent & Unimportant */}
          <div className="border rounded-lg p-4 bg-blue-100 shadow-md">
            <h2 className="text-blue-600 font-bold flex items-center">
              🔵 Urgent & Unimportant
            </h2>
            <div className="flex flex-col gap-2 p-2">
            { urgentUnimportantTasks.length === 0 ? 
            (<p className="text-xl font-bold p-2 bg-white rounded-md">
                No Urgent and Important task's to display.</p>
            ) : (urgentUnimportantTasks.map(task => (
                    <div className="text-md text-black p-2 bg-white rounded-md justify-between" key={task._id}>
                      <span>{task.title}</span>
                      <button className="hover:bg-gray-300" onClick={()=>{deleteTask(task._id)}}><ImBin/></button>
                    </div>
                )))}
            </div>
          </div>
  
          {/* Not Urgent & Unimportant */}
          <div className="border rounded-lg p-4 bg-green-100 shadow-md">
            <h2 className="text-green-600 font-bold flex items-center">
              🟢 Not Urgent & Unimportant
            </h2>
          <div className="flex flex-col gap-2 p-2">
            { notUrgentUnimportantTasks.length === 0 ? 
            (<p className="text-xl font-bold p-2 bg-white rounded-md">
                No Urgent and Important task's to display.</p>
            ) : (notUrgentUnimportantTasks.map(task => (
                <div className="text-md text-black p-2 bg-white rounded-md justify-between" key={task._id}>
                <span>{task.title}</span>
                <button className="hover:bg-gray-300" onClick={()=>{deleteTask(task._id)}}><ImBin/></button>
              </div>
                )))}
            </div>
          </div>
        </div>
  
        {/* Floating Add Task Button */}
        <button className="fixed bottom-6 right-6 bg-gray-300 p-4 rounded-full shadow-lg hover:bg-gray-100" onClick={()=>setShowModal(true)}>
          ➕
        </button>
        {showModal && 
            <EisenHowerTask                             
                userId={userId}
                onClose={() => {setShowModal(false), setSelectedTask(null)}}
                refresh={fetchUserTasks}
                task={selectedTask} /> //pass the task to be edited
        }
      </div>
    );
  }
  
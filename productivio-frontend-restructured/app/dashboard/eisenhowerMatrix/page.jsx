"use client";

import { useState, useEffect } from "react";
import { TbCircleNumber1Filled, TbCircleNumber2Filled, TbCircleNumber3Filled, TbCircleNumber4Filled} from "react-icons/tb";
import { getUserTasks } from "@/app/services/tasks";
import MatrixBlock from "../../components/EisenhowerMatrix/MatrixBlock"


export default function EisenhowerMatrix( {userId} ) {

    const [tasks, setTasks] = useState([]);

    const fetchTasks = async() => {
        try {
          const data = await getUserTasks(userId);
          setTasks(data);
          console.log(data);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      };
    
    useEffect(() => {
      if (userId) {
        fetchTasks();
      }
    }, [userId]);

    const urgentImportantTasks = tasks.filter(task => !task.isTrash && task.priority === "1");
    const notUrgentImportantTasks = tasks.filter(task => !task.isTrash && task.priority === "2");
    const urgentUnimportantTasks = tasks.filter(task => !task.isTrash && task.priority === "3");
    const notUrgentUnimportantTasks = tasks.filter(task => !task.isTrash && task.priority === "4");

    return (
      <div className="h-screen flex flex-col bg-gray-100 p-4 overflow-hidden">
        <div>
          <h1 className="mb-4 text-black text-left text-2xl font-bold" >Eisenhower Matrix</h1>
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-2 w-full max-w-8xl h-[90vh] ">
          <MatrixBlock
            title = {<><TbCircleNumber1Filled size={20} />Urgent & Important</>}
            tasks={urgentImportantTasks}
            refresh={fetchTasks}
            userId={userId}
            setTasks={setTasks}
          />
          <MatrixBlock
            title = {<><TbCircleNumber2Filled size={20} />Not Urgent & Important</>}
            tasks={notUrgentImportantTasks}
            refresh={fetchTasks}
            userId={userId}
            setTasks={setTasks}
          />
          <MatrixBlock
            title = {<><TbCircleNumber3Filled size={20}/>Urgent & Unimportant</>}
            tasks={urgentUnimportantTasks}
            refresh={fetchTasks}
            userId={userId}
            setTasks={setTasks}
          />
          <MatrixBlock
            title = {<><TbCircleNumber4Filled size={20}/>Not Urgent & Unimportant</>}
            tasks={notUrgentUnimportantTasks}
            refresh={fetchTasks}
            userId={userId}
            setTasks={setTasks}
          />
         </div> 
      </div>
    );
  }
  
import { IoIosFlag } from "react-icons/io";
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";

const DetailTaskView = ( { task } ) => {

    const getPriorityColor = () => {
        let color;
        switch (task.priority) {
          case '1':
            color = "text-rose-500";
            break;
    
          case '2':
            color = "text-amber-500";
            break;
    
          case '3':
            color = "text-blue-500";
            break;
    
          case '4':
            color = "text-teal-400";
            break;
        }
        return color;
    }

    const handleCheckBoxCheck = (e) => {
        task.isCompleted = !task.isCompleted;
        return (task.isCompleted)
    }

    return (
        task && 
    <div className="w-full h-full">
        <div className="flex justify-between items-center mt-5 mx-5 mb-2">
            <div className="flex items-center">
                {task.isCompleted ? 
                    <MdCheckBox className={`mr-2 cursor-pointer ${getPriorityColor()}`} size={"1.5em"} onClick={handleCheckBoxCheck}/> 
                    :
                    <MdCheckBoxOutlineBlank className={`mr-2 cursor-pointer ${getPriorityColor()}`} size={"1.5em"} onClick={handleCheckBoxCheck}/> 
                }
                <div>Date</div>
            </div>
            
            <span><IoIosFlag className={`cursor-pointer ${getPriorityColor()}`} size={"1.5em"} /></span>

        </div>
        <div className="h-[1px] w-full bottom-0 bg-purple-50 z-10"></div>
        <div className="m-4">
            <h2 className="text-lg text-black font-bold">{task.title}</h2>
        </div>
        <div></div>
    </div>
    );
}

export default DetailTaskView;
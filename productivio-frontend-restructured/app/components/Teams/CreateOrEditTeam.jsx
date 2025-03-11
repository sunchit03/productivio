import { createTeam} from "@/app/services/teams";
import { useState, useEffect } from "react";
import toast,{Toaster} from "react-hot-toast";

export default function CreateOrEditTeam({ onClose, refresh, userId, team, editTeam }) {
  const [title, setTitle] = useState(team ? team.title : "");
  const [description, setDescription] = useState(team ? (team.description ? team.description : "") : "");
  const initTeamTitle = team?.title || "";
  const initDescription = team?.description || "";
  const isEnable = team && ((title.trim() !== "" && initTeamTitle !== title) || initDescription !== description);

  const handleCreateTeam = async() => {
    try{
      const data = await createTeam(userId, title, description);
      if (data.success) {
        onClose();
        refresh(); 
      }
      else{
        console.error("Error while creating new team: ", data.error);
      }
    }catch(error){
      console.log("Error while creating new team: ", error.message);
    }
  };

  const handleEditTeam = async() => {
    description === "" ? null : description;
    editTeam(team._id, title, description);
    onClose();
  }


  useEffect(() => {
    if(team){
      setTitle(team.title || "")
      setDescription(team.description || "")
    }
  }, [team]);

  return (
    <>
      <Toaster
        toastOptions={{
        removeDelay: 500,
        position: 'bottom-center',
        style: {
        backgroundColor: "#E6E6FA",
        padding: '16px',
        color: '#6A0DAD',
        textAlign: "center",
        },
        }}
      />
    <div className="fixed inset-0 flex justify-center bg-gray-100 bg-opacity-30 pt-12">
      <div className="flex flex-col bg-white p-4 rounded-lg shadow-md w-2/5 h-2/5 xs:w-5/6 xs:h-1/3 xssm:w-4/5 mdlg:w-3/5 gap-2"
      onClick={(e)=>{e.stopPropagation()}}>
        <h2 className="text-xl font-semibold mb-2 text-black">{team ? `Edit Team - ${team.title}` : "Create New Team"}</h2>

        <input
          type="text"
          value={title}
          placeholder="Team Title"
          className="w-full border p-2 rounded text-black"
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          type="text"
          placeholder="Team Description"
          className="w-full border p-1 text-sm rounded text-black"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <div className="flex mt-2 justify-end">
          <button className="text-black font-thin bg-gray-100 px-3 py-3 rounded-sm mr-3 hover:bg-gray-300" 
          onClick={onClose}>
            Cancel
          </button>
          {team ? 
            (<button 
              disabled={!isEnable}
              className={`${isEnable ? "bg-purple-600 hover:bg-purple-700 cursor-pointer text-white" : "cursor-not-allowed bg-purple-300 text-gray-500"}   font-thin px-3 py-3 rounded-sm`}
              onClick={() => handleEditTeam(title, description)}>
                Update
            </button>
            )
            : 
            (<button 
              className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-white font-thin px-3 py-3 rounded-sm"
              onClick={title.trim() !== "" ? handleCreateTeam : ()=>toast("Enter a team title.")}>
                Create
            </button>
            )
          }
        </div>
      </div>
    </div>
    </>
  );
}

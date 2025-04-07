import { createTeam} from "@/app/services/teams";
import { useState, useEffect } from "react";
import toast,{Toaster} from "react-hot-toast";

export default function CreateOrEditTeam({ onClose, refresh, userId, team, editTeam}) {
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
        toast.success("New team created!") 
      }
      else{
        console.error("Error while creating new team: ", data.error);
        toast.success("Error while creating team.") 
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
    <div className="fixed inset-0 flex justify-center bg-gray-100 bg-opacity-30 pt-12" onClick={onClose}>
      <div className="flex flex-col bg-white p-4 rounded-lg shadow-md w-2/5 h-1/2 mdlg:w-3/5 xs:w-5/6 xs:h-1/3 xssm:w-4/5 gap-2"
      onClick={(e)=>{e.stopPropagation()}}>
        <h2 className="text-xl font-semibold mb-2 text-black">{team ? `Edit Team - ${team.title}` : "Create New Team"}</h2>

        <input
          type="text"
          value={title}
          placeholder="Team Title"
          className="w-full border p-2 rounded text-black focus:outline-none focus:ring-1 focus:ring-violet-500"
          onChange={(e) => setTitle(e.target.value)}
        />

        <article>
        <textarea
          type="text"
          placeholder="Team Description"
          className="w-full border p-1 text-sm rounded text-black focus:outline-none focus:ring-1 focus:ring-violet-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        </article>

        <div className="flex justify-between mt-4">
          <div className="flex-1"></div>
          <div className="flex flex-1 justify-stretch">
            <button className="mr-2 px-4 py-2 flex-1 border border-gray-400 bg-white text-gray-500 rounded hover:bg-gray-100" 
            onClick={onClose}>
              Cancel
            </button>
            {team ? 
              (<button 
                disabled={!isEnable}
                className={`${isEnable ? "bg-violet-500 hover:bg-violet-500/75 cursor-pointer" : "cursor-not-allowed bg-purple-300"} px-4 py-2 flex-1 text-white rounded`}
                onClick={() => handleEditTeam(title, description)}>
                  Update
              </button>
              )
              : 
              (<button 
                className="px-4 py-2 flex-1 bg-violet-500 text-white rounded hover:bg-violet-500/75"
                onClick={title.trim() !== "" ? handleCreateTeam : ()=>toast("Enter a team title.")}>
                  Create
              </button>
              )
            }
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

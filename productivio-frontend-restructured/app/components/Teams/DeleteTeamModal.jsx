export default function DeleteTeam({team, removeTeam, onClose}) {

    const handleDeleteTeam = async() => {
        removeTeam(team?._id);
        onClose();
    }

    return(
        <>
        <div className="fixed inset-0 flex items-start justify-center bg-gray-900 bg-opacity-0 z-50 top-10 drop-shadow-xl"
            onClick={onClose}>
            <div className="xs:w-5/6 xssm:w-4/5 mdlg:w-3/5 bg-white p-6 rounded-md shadow-lg w-2/5" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-semibold mb-4 text-black">Delete Team - "{team.title}"?</h2>   
                <p className="text-black font-thin mb-2">All the tasks and team members will be removed from "{team.title}" team.</p>        
                <div className="flex justify-between mt-8">
                    <div className="flex-1"></div>
                    <div className="flex flex-1 justify-stretch">
                        <div className="flex flex-1 justify-stretch">                               
                            <button type= "button" onClick={onClose} className="mr-2 px-4 py-2 flex-1 border border-gray-400 bg-white text-gray-500 rounded hover:bg-gray-100">
                                Cancel
                            </button>
                            <button type= "button" onClick={() => handleDeleteTeam()} className="px-4 py-2 flex-1 bg-violet-500 text-white rounded hover:bg-violet-500/75">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}


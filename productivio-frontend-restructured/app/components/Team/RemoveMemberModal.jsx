export default function RemoveMemberModal({ member, onClose, removeMember }) {
  
  const handleRemoveMember = (e) => {
    e.preventDefault();
    removeMember(member._id);
  }

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-gray-100 bg-opacity-40 z-50 pt-20 drop-shadow-xl">
      <div className="xs:w-5/6 xssm:w-4/5 mdlg:w-3/5 bg-white p-6 rounded-md shadow-lg w-2/5">
        <h2 className="text-lg font-semibold mb-4 text-black">Remove Member "{member.email}"?</h2>
        <form onSubmit={(e) => handleRemoveMember(e)}>
          <label className="block text-black mb-2">
            <div className="mt-1">
              <span className="text-black">
                This member will be removed from the team.
              </span>
            </div>
          </label>
          <div>
              <span className="text-sm text-black">Tasks assigned to this member will be now unassigned.</span>
          </div>
          <div className="flex justify-between mt-4">
            <div className="flex-1"></div>
            <div className="flex flex-1 justify-stretch">
              <button type="button" 
                  onClick={onClose} 
                  className="mr-2 px-4 py-2 flex-1 border border-gray-400 bg-white text-gray-500 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 flex-1 bg-violet-500 text-white rounded hover:bg-violet-500/75">
                Remove
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

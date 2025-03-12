import { TbMoodWink2 } from "react-icons/tb";
import EmojiPicker from 'emoji-picker-react';

const AddEditListModal = ( { isEdit = false, list, addEditList, showPicker, setShowPicker, newList, setNewList, closeListModal } ) => {

    const handleEmojiClick = (emojiData, _) => {
        setNewList({ ...newList, emoji: emojiData.emoji });
        setShowPicker(false);
    };

    const handleAddEditList = (e) => {
        e.preventDefault();

        if (!newList.name.trim()) return;

        addEditList(isEdit, list);

        setNewList({ name: "", emoji: "" });
    };

    return (
        <div className="fixed inset-0 flex items-start justify-center bg-gray-100 bg-opacity-40 z-50 pt-20 drop-shadow-xl">
            <div className="xs:w-5/6 xssm:w-4/5 mdlg:w-3/5 bg-white p-6 rounded-md shadow-lg w-2/5">
                <h2 className="text-xl font-bold mb-4 text-black">
                {isEdit ? "Edit List" : "Add List"}
                </h2>
                <form onSubmit={(e) => handleAddEditList(e)}>
                <label className="block text-black mb-2">
                    <div className="relative mt-1">
                    <span 
                        onClick={() => setShowPicker((val) => !val)}
                        className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer text-xl"
                    >
                        {newList.emoji === "" ? <TbMoodWink2 /> : newList.emoji}
                    </span>
                    <input
                        type="text"
                        value={newList.name}
                        onChange={(e) => setNewList({ ...newList, name: e.target.value })}
                        placeholder="Name"
                        className="w-full border rounded p-2 pl-10 text-black focus:outline-none focus:ring-1 focus:ring-violet-500"
                        autoFocus
                        onKeyDown={(e) => {
                        if (e.key === "Enter")
                            handleAddEditList(e);
                        }}
                    />
                    {showPicker && (
                        <div className="absolute z-10 mt-2 -mx-5">
                        <EmojiPicker
                            width={300}
                            height={350}
                            autoFocusSearch={true}
                            emojiStyle="google"
                            onEmojiClick={handleEmojiClick}
                            previewConfig={{ showPreview: false }}
                        />
                        </div>
                    )}
                    </div>
                </label>
                <div className="flex justify-between mt-4">
                    <div className="flex-1"></div>
                    <div className="flex flex-1 justify-stretch">
                    <button type="button" onClick={closeListModal} className="mr-2 px-4 py-2 flex-1 border border-gray-400 bg-white text-gray-500 rounded hover:bg-gray-100">
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 flex-1 bg-violet-500 text-white rounded hover:bg-violet-500/75">
                        {isEdit ? "Edit" : "Create"}
                    </button>
                    </div>
                </div>
                </form>
            </div>
        </div>
    )
}

export default AddEditListModal;
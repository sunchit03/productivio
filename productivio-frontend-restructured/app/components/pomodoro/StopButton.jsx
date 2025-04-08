import { FaStop } from "react-icons/fa";
export default function PlayButton(props) {
    return (
        <button {...props} className="bg-indigo-300 hover:bg-indigo-400 text-white p-3 rounded-full">
            <FaStop />
        </button>
    );
}

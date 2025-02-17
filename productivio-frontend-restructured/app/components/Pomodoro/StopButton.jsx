import { FaStop } from "react-icons/fa";
export default function PlayButton(props) {
    return (
        <button {...props} className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full">
            <FaStop />
        </button>
    );
}

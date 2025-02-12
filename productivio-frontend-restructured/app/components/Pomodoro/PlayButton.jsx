import { FaCirclePlay } from "react-icons/fa6";
export default function PlayButton(props) {
    return (
        <button {...props} className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full">
            <FaCirclePlay />
        </button>
    );
}

import { FaCirclePause } from "react-icons/fa6";
export default function PauseButton(props) {
    return (
        <button {...props} className="bg-indigo-300 hover:bg-indigo-400 text-white p-3 rounded-full">
            <FaCirclePause />
        </button>
    );
}

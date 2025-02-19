import { IoArrowBackCircleOutline } from "react-icons/io5";
export default function PlayButton(props) {
    return (
        <button {...props} className="bg-indigo-300 hover:bg-indigo-400 text-white p-3 rounded-full">
            <IoArrowBackCircleOutline />
        </button>
    );
}

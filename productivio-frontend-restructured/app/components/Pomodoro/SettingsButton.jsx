import { IoSettings } from "react-icons/io5";
export default function SettingsButton(props) {
  return (
      <button {...props} className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full">
          <IoSettings />
    </button>
  );
}

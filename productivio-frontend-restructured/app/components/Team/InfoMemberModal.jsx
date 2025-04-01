// InfoMemberModal.jsx
import { IoClose  } from "react-icons/io5";

export default function InfoMemberModal({ member, onClose }) {

    return (
        <div className="fixed inset-0 flex items-start justify-center bg-gray-100 bg-opacity-40 z-50 pt-20 drop-shadow-xl" onClick={onClose}>
        <div className="xs:w-5/6 xssm:w-4/5 mdlg:w-3/5 rounded-md shadow-lg w-2/5">
            <div className="relative bg-white rounded-2xl shadow-xl pt-16 pb-6 px-6 flex flex-col items-center text-center">
                <div className="absolute -top-12 w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
                  <img 
                    src={member.profilePicture || "/assets/default-avatar.jpg"} 
                    alt={member.email} 
                    className="w-full h-full object-cover rounded-full" 
                    />
                </div>
                <h3 className="text-lg font-bold text-purple-900 mb-2 mt-1">{member.email}</h3>
                <p className="text-md text-purple-700 mb-2">BOSS</p>
                <p className="text-md text-gray-600 mb-5">idk what to write, its 4:40 AM. too tired, about to sleep</p>
                {/* <div className="flex justify-center space-x-4 text-lg text-blue-600">
                  <a href={person.github} target="_blank"><FaGithub className='text-purple-900'/></a>
                  <a href={person.linkedin} target="_blank"><FaLinkedin className='text-purple-900'/></a>
                </div> */}
              </div>
        </div>
        </div>
  );
}
import { useRouter } from "next/navigation";
import { BiDotsHorizontal } from "react-icons/bi";
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import CreateOrEditTeam from "./CreateOrEditTeam";
import { useState } from "react";
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';

export default function TeamCard({ team, userId, editTeam, setSelectedTeam }) {
  const [addEditTeamModal, setAddEditTeamModal] = useState(false);

  // Function to extract the initials from the title
  const getInitials = (title) => {
    const words = title.toUpperCase().split(" ");

    if (words.length > 1) {
      if (words[0][0] && words[1][0]) {
        return words[0][0] + words[1][0];    // First letter of the first and second word
      } else {
        return 'UU'
      }
    } else {
      if (words[0][0]) {
        return words[0][0];    // Just the first letter if there's no second word
      } else {
        return 'U'
      }
    }
  };

  function getRandomColor() {
    const colors = ["blue", "red", "purple", "yellow", "green", "pink", "orange", "lime", "teal"];
    const index = Math.floor(Math.random() * colors.length);
    return `w-12 h-12 bg-${colors[index]}-500 text-white flex items-center justify-center rounded-full`
  }

  return (
    <div
      className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
      onClick={() => setSelectedTeam(team)}
    >
      <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Circular image with initials */}
        <div className={getRandomColor()}>
          <span className="text-lg font-bold">{getInitials(team.title)}</span>
        </div>

        {/* Team Title and Description */}
          <div>
            <h2 className="text-lg font-semibold text-black">{team.title}</h2>
            {team.description && (
              <p className="text-gray-600">{team.description}</p>
            )}
          </div>
      </div>

      {team.admin === userId && (
        <div>
            <Menu menuButton= {
                <MenuButton>
                    <BiDotsHorizontal size={24} className="flex items-center hover:bg-gray-300 rounded-sm p-1"/>
                </MenuButton>
            }
            key={'bottom'}
            direction={'bottom'}
            align={'start'}
            position={'anchor'}
            viewScroll={'initial'}
            arrow={false}
            gap={10}
            shift={0}
            >
                <MenuItem key={"Edit"} onClick={() => setAddEditTeamModal(true, team)}>{"Edit"}</MenuItem>
                {/* onClick={() => setIsListDeleteModalOpen(true) } */}
                <MenuItem key={"Delete"} >{"Delete"}</MenuItem>
            </Menu>
        </div>
      )}
        {addEditTeamModal && 
        <CreateOrEditTeam
          team={team}
          editTeam={editTeam}
          onClose={() => setAddEditTeamModal(false)}
        />}
      </div>
    </div>
  );
}

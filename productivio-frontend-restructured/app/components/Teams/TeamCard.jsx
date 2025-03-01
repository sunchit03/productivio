export default function TeamCard({ team, setSelectedTeam }) {

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
    </div>
  );
}

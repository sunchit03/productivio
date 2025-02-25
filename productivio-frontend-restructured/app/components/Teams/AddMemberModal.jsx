import { useState } from "react";

export default function AddMemberModal({ onClose, onAdd, teamMembers, currentUserEmail }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [userExists, setUserExists] = useState(null);

  async function handleSubmit() {
    setError(""); // Reset errors

    if (email === currentUserEmail) {
      setError("You cannot add yourself to the team.");
      return;
    }

    if (teamMembers.some((member) => member.email === email)) {
      setError("This user is already in the team.");
      return;
    }

    //if ()

    const exists = await isUser(email);

    if (exists == true) {
      onAdd(email); // Add existing user to team
      onClose();
    } else {
      setUserExists(false); // Show invite option
    }
  }

  async function handleInvite() {
    try {
      const res = await fetch("/api/users/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        alert("Invite sent successfully!");
        onClose();
      } else {
        setError("Failed to send invite. Try again.");
      }
    } catch (error) {
      console.error("Error sending invite:", error);
      setError("Something went wrong.");
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-4 rounded w-96">
        <h2 className="text-lg font-bold mb-2 text-black">Add Member</h2>

        <input
          type="email"
          placeholder="Enter email"
          className="w-full p-2 border rounded mb-2 text-black"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(""); // Reset error when typing
            setUserExists(null);
          }}
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {userExists === false ? (
          <button className="bg-green-500 text-white p-2 rounded w-full" onClick={handleInvite}>
            Send Invite
          </button>
        ) : (
          <button className="bg-blue-500 text-white p-2 rounded w-full" onClick={handleSubmit}>
            Add
          </button>
        )}

        <button className="mt-2 w-full p-2 border rounded text-black" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

import React, { useState } from "react";

function DeleteForms({ refreshUsers, refreshTeams, fetchTasks }) {
  const [userName, setUserName] = useState("");
  const [teamName, setTeamName] = useState("");

  async function deleteUser() {

    if (!userName.trim()) {
      alert("Username cannot be empty!");
      return;
    }    
    
    const res = await fetch("/users/deleteUserByName", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: userName }),
    });
    const data = await res.json();
    alert(data.message);

    if (res.ok) {
    setUserName(""); // clear the input

    // ✅ Add a short delay before refetch
    setTimeout(() => {
      refreshUsers();
      fetchTasks(); // also refresh tasks since deleted user might have assigned tasks
    }, 200);
  }
  }

  async function deleteTeam() {

    if (!teamName.trim()) {
      alert("Team name cannot be empty!");
      return;
    }    

    const res = await fetch("/teams/deleteTeamByName", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: teamName }),
    });
    
    const data = await res.json();
    alert(data.message);

    if (res.ok) {
    setTeamName(""); // clear field

    setTimeout(() => {
      refreshTeams();
    }, 200);
  }
  }

  return (
<div className="p-4 bg-gray-50 rounded-lg shadow-md">
  {/* Delete User Section */}
  <h2 className="text-xl font-semibold mb-4 text-gray-700">Delete User</h2>
  <input
    value={userName}
    onChange={(e) => setUserName(e.target.value)}
    placeholder="Username"
    className="w-full p-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
  />
  <button
    onClick={deleteUser}
    className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors mb-6"
  >
    Delete User
  </button>

  {/* Delete Team Section */}
  <h2 className="text-xl font-semibold mb-4 text-gray-700">Delete Team</h2>
  <input
    value={teamName}
    onChange={(e) => setTeamName(e.target.value)}
    placeholder="Team Name"
    className="w-full p-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
  />
  <button
    onClick={deleteTeam}
    className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors"
  >
    Delete Team
  </button>
</div>

  );
}

export default DeleteForms;



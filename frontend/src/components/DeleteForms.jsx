import React, { useState } from "react";

function DeleteForms({ role, refreshUsers, refreshTeams, fetchTasks }) {
  const [userName, setUserName] = useState("");
  const [teamName, setTeamName] = useState("");

  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingTeam, setLoadingTeam] = useState(false);

  // -------------------------------------------------------------
  // 🗑 DELETE USER (ADMIN ONLY)
  // -------------------------------------------------------------
  async function deleteUser() {
    if (!userName.trim()) {
      alert("Username cannot be empty!");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      return;
    }

    setLoadingUser(true);

    const res = await fetch("/users/delete", {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: userName }),
    });

    const data = await res.json();
    alert(data.message || data.error);
    setLoadingUser(false);

    if (res.ok) {
      setUserName("");
      refreshUsers();
      fetchTasks();
    }
  }

  // -------------------------------------------------------------
  // 🗑 DELETE TEAM (Normal users CAN delete IF they created it)
  // -------------------------------------------------------------
  async function deleteTeam() {
    if (!teamName.trim()) {
      alert("Team name cannot be empty!");
      return;
    }

    if (!window.confirm(`Delete team "${teamName}"?`)) {
      return;
    }

    setLoadingTeam(true);

    const res = await fetch("/teams/delete", {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: teamName }),
    });

    const data = await res.json();
    alert(data.message || data.error);
    setLoadingTeam(false);

    if (res.ok) {
      setTeamName("");
      refreshTeams();
    }
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-200">

      {/* DELETE USER (ADMIN ONLY) */}
      {role === "admin" && (
        <>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Delete User
          </h2>

          <div className="mb-6">
            <input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter username"
              className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
            />

            <button
              onClick={deleteUser}
              disabled={loadingUser}
              className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition-all ${
                loadingUser
                  ? "bg-red-300 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {loadingUser ? "Deleting..." : "Delete User"}
            </button>
          </div>

          <hr className="my-6 border-gray-300" />
        </>
      )}

      {/* DELETE TEAM (Everyone sees — backend controls permission) */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Delete Team</h2>

      <div>
        <input
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Enter team name"
          className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
        />

        <button
          onClick={deleteTeam}
          disabled={loadingTeam}
          className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition-all ${
            loadingTeam
              ? "bg-red-300 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {loadingTeam ? "Deleting..." : "Delete Team"}
        </button>
      </div>
    </div>
  );
}

export default DeleteForms;

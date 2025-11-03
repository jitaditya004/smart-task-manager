import React, { useState } from "react";

function TeamForm({ refresh }) {
  const [name, setName] = useState("");

  async function addTeam() {
    if (!name.trim()) {
      alert("Team name cannot be empty!");
      return;
    }

    const token = localStorage.getItem("token"); // ✅ Get token from login

    if (!token) {
      alert("You must be logged in to add a team!");
      return;
    }

    try {
      const res = await fetch("/teams/addTeam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ send token to backend
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      alert(data.message || data.error);

      if (res.ok) {
        setName("");
        setTimeout(() => refresh(), 200); // refresh list
      }
    } catch (err) {
      console.error("Error adding team:", err);
      alert("Something went wrong while adding the team. Please try again.");
    }
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Add Team</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Team Name"
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={addTeam}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Add Team
      </button>
    </div>
  );
}

export default TeamForm;

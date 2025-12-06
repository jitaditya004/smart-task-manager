import React, { useState } from "react";

function TeamForm({ refresh }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function addTeam() {
    if (!name.trim()) {
      alert("Team name cannot be empty!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/teams/add", {
        method: "POST",
        credentials: "include", // ⭐ REQUIRED for HttpOnly cookie auth
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      alert(data.message || data.error);

      setLoading(false);

      if (res.ok) {
        setName("");
        setTimeout(() => refresh(), 200);
      }
    } catch (err) {
      console.error("Error adding team:", err);
      alert("Something went wrong while adding the team. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Team</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter team name"
        className="w-full p-3 mb-5 rounded-lg border border-gray-300 
                   focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
      />

      <button
        onClick={addTeam}
        disabled={loading}
        className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition-all ${
          loading
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 hover:scale-[1.02]"
        }`}
      >
        {loading ? "Creating Team..." : "Add Team"}
      </button>
    </div>
  );
}

export default TeamForm;

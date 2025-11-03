import React, { useState, useEffect } from "react";

function TaskForm({ users, teams, refresh }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [teamId, setTeamId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [userId, setUserId] = useState(null); // ✅ Logged-in user's ID

  // ✅ Decode JWT to extract user ID (client-side)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.id);
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, []);

  async function addTask() {
    if (!title.trim() || !description.trim()) {
      alert("Title and Description cannot be empty!");
      return;
    }

    // ✅ If no team selected → personal task → auto-assign to self
    const finalAssignedTo = teamId ? assignedTo : userId;

    const res = await fetch("/tasks/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        title,
        description,
        assigned_to: finalAssignedTo,
        team_id: teamId || null,
        deadline: deadline || null,
      }),
    });

    const data = await res.json();
    alert(data.message || data.error);

    if (res.ok) {
      refresh();
      setTitle("");
      setDescription("");
      setAssignedTo("");
      setTeamId("");
      setDeadline("");
    }
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Add Task</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full p-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* 🧩 Show Assign dropdown only if team selected */}
      {teamId && (
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="w-full p-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Assign to...</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username}
            </option>
          ))}
        </select>
      )}

      <select
        value={teamId}
        onChange={(e) => setTeamId(e.target.value)}
        className="w-full p-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Personal task (no team)</option>
        {teams.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={addTask}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Add Task
      </button>
    </div>
  );
}

export default TaskForm;

import React, { useState } from "react";

function TaskForm({ users, teams, refresh, userId }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [teamId, setTeamId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState("medium");


  // 🧠 Create Task
  async function addTask() {

    if (!title.trim() || !description.trim()) {
      alert("Title and description are required!");
      return;
    }

    const finalAssignedTo = teamId ? assignedTo : userId;

    setLoading(true);

    const res = await fetch("/tasks/add", {
      method: "POST",
      credentials: "include", // ⭐ REQUIRED for HttpOnly cookies
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        assigned_to: finalAssignedTo,
        team_id: teamId || null,
        deadline: deadline ? new Date(deadline).toISOString() : null,
        priority
      }),
    });

    const data = await res.json();
    alert(data.message || data.error);

    setLoading(false);

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
  <div className="p-8 bg-white rounded-2xl shadow-xl border border-gray-200 space-y-5">

    <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
      ✅ Create a New Task
    </h2>

    {/* Title */}
    <input
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Task Title"
      className="w-full p-3 rounded-lg border border-gray-300 
                 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
    />

    {/* Description */}
    <textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Task Description"
      rows={3}
      className="w-full p-3 rounded-lg border border-gray-300 
                 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm resize-none"
    />

    {/* Priority */}
    <div>
      <label className="text-sm font-semibold text-gray-700 block mb-1">
        Priority
      </label>
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full p-3 rounded-lg border border-gray-300 
                   focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </select>
    </div>

    {/* Team Dropdown */}
    <div>
      <label className="text-sm font-semibold text-gray-700 block mb-1">
        Team (optional)
      </label>
      <select
        value={teamId}
        onChange={(e) => setTeamId(e.target.value)}
        className="w-full p-3 rounded-lg border border-gray-300 
                   focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
      >
        <option value="">Personal Task</option>
        {teams.map((t) => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>
    </div>

    {/* Assign to user */}
    {teamId && (
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-1">
          Assign To
        </label>
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
        >
          <option value="">Select user</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.username}</option>
          ))}
        </select>
      </div>
    )}

    {/* Deadline */}
    <div>
      <label className="text-sm font-semibold text-gray-700 block mb-1">
        Deadline
      </label>
      <input
        type="datetime-local"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="w-full p-3 rounded-lg border border-gray-300 
                   focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
      />
    </div>

    {/* Submit Button */}
    <button
      onClick={addTask}
      disabled={loading}
      className={`w-full py-3 rounded-xl text-white font-semibold shadow-md transition-all ${
        loading
          ? "bg-indigo-300 cursor-not-allowed"
          : "bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02]"
      }`}
    >
      {loading ? "Adding Task..." : "Add Task"}
    </button>

  </div>
);

}

export default TaskForm;

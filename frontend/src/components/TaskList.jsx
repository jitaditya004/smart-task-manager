import React, { useState } from "react";

function TaskList({ tasks, refresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  async function updateStatus(id, status) {
    const token = localStorage.getItem("token");

    await fetch("/tasks/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, status }),
    });

    refresh();
  }

  async function deleteTask(id) {
    const token = localStorage.getItem("token");

    await fetch("/tasks/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });

    refresh();
  }

  // 🧠 Filtered task list
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Tasks</h2>

      {/* 🔍 Search and Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border p-2 rounded focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
        >
          <option value="All">All</option>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </select>
      </div>

      <ul className="space-y-3">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">
            No tasks match your search or filter.
          </p>
        ) : (
          filteredTasks.map((t) => {
            const deadline = t.deadline
              ? new Date(t.deadline).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A";

            return (
              <li
                key={t.id}
                className="p-3 bg-white rounded-md shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div className="text-gray-700 text-sm">
                  <span className="font-semibold">{t.id}</span> - {t.title} ::{" "}
                  {t.description}
                  <span className="block md:inline">
                    {" "}
                    | Assigned: {t.assigned_to || "N/A"}
                  </span>
                  <span className="block md:inline">
                    {" "}
                    | Status: {t.status}
                  </span>
                  <span className="block md:inline">
                    {" "}
                    | Deadline: {deadline}
                  </span>
                </div>

                <div className="mt-2 md:mt-0 flex gap-2">
                  {/* 🟢 Toggle Status */}
                  <button
                    onClick={() =>
                      updateStatus(
                        t.id,
                        t.status === "done" ? "pending" : "done"
                      )
                    }
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                      t.status === "done"
                        ? "bg-yellow-500 text-white hover:bg-yellow-600"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {t.status === "done"
                      ? "↩️ Mark as Pending"
                      : "✅ Mark as Done"}
                  </button>

                  {/* 🔴 Delete Task */}
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-sm"
                  >
                    ❌ Delete
                  </button>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

export default TaskList;

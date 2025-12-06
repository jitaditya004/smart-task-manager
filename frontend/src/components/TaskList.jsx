import React, { useState } from "react";

function TaskList({ tasks, refresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // ----------------------------
  // 🔄 Update Task Status
  // ----------------------------
  async function updateStatus(id, status) {
    await fetch("/tasks/update", {
      method: "PUT",
      credentials: "include", // ⭐ REQUIRED for HttpOnly cookies
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });

    refresh();
  }

  // ----------------------------
  // 🗑 Delete Task
  // ----------------------------
  async function deleteTask(id) {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    await fetch("/tasks/delete", {
      method: "DELETE",
      credentials: "include", // ⭐ send cookie for auth
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    refresh();
  }

  // ----------------------------
  // 🧠 Search + Filter Logic
  // ----------------------------
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Task List</h2>

      {/* 🔍 Search + Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 shadow-sm"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 shadow-sm"
        >
          <option value="All">All</option>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </select>
      </div>

      {/* ========================== */}
      {/* 📝 Task Cards */}
      {/* ========================== */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500 text-center text-sm">
            No tasks match your search.
          </p>
        ) : (
          filteredTasks.map((t) => {
            const deadline = t.deadline
              ? new Date(t.deadline).toLocaleDateString("en-GB")
              : "No deadline";

            const isDone = t.status === "done";

            return (
              <div
                key={t.id}
                className={`p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 
                            rounded-xl shadow-sm hover:shadow-md transition-all
                            border-l-8 
                            ${
                              t.priority === "urgent"
                                ? "border-red-600"
                                : t.priority === "high"
                                ? "border-orange-500"
                                : t.priority === "medium"
                                ? "border-blue-600"
                                : "border-gray-400"
                            }`}
              >

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                  {/* 🔹 TASK DETAILS */}
                  <div className="text-gray-700 ">
                    <div className="text-lg font-semibold">{t.title}</div>
                    <div className="text-xs font-semibold text-gray-600 mt-1">
                      Priority: {t.priority.toUpperCase()}
                    </div>

                    <div className="text-sm opacity-80 mb-1 break-words whitespace-normal">
                      {t.description}
                    </div>


                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-1">

                      <span>
                        <strong>Assigned:</strong> {t.assigned_to || "N/A"}
                      </span>

                      {/* 🔖 Status Badge */}
                      <span
                        className={`px-2 py-1 rounded-md text-white ${
                          isDone ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      >
                        {isDone ? "Completed" : "Pending"}
                      </span>

                      <span>
                        <strong>Deadline:</strong> {deadline}
                      </span>
                    </div>
                  </div>

                  

                  {/* 🔘 ACTION BUTTONS */}
                  <div className="flex gap-2">

                    {/* Toggle Status */}
                    <button
                      onClick={() =>
                        updateStatus(
                          t.id,
                          isDone ? "pending" : "done"
                        )
                      }
                      className={`px-4 py-2 text-sm rounded-lg font-medium text-white shadow transition-all ${
                        isDone
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {isDone ? "Mark Pending" : "Mark Done"}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteTask(t.id)}
                      className="px-4 py-2 text-sm rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white shadow transition-all"
                    >
                      Delete
                    </button>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default TaskList;

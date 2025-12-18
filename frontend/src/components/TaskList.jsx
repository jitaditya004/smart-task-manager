import React, { useState } from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


function TaskList({ tasks, refresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [prioritySort, setPrioritySort] = useState("none");

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



  //Upload Files
  async function uploadFile(taskId, file) {
    const formData = new FormData();
    formData.append("attachment", file);

    const res = await fetch(`/tasks/attachments/${taskId}`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await res.json();
    alert(data.message);
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
//filters as soon as we type.


  // ------- PRIORITY SORT ORDER -------
  const priorityRank = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1
  };

  // ------- SORT BY PRIORITY -------
  let sortedTasks = [...filteredTasks];

  if (prioritySort === "high-to-low") {
    sortedTasks.sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority]);
  } else if (prioritySort === "low-to-high") {
    sortedTasks.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
  }


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

        <select
          value={prioritySort}
          onChange={(e) => setPrioritySort(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 shadow-sm"
        >
          <option value="none">Sort By Priority</option>
          <option value="high-to-low">High → Low</option>
          <option value="low-to-high">Low → High</option>
        </select>

      </div>

      {/* ========================== */}
      {/* 📝 Task Cards */}
      {/* ========================== */}
      <div className="space-y-4">
        {sortedTasks.length === 0 ? (
          <p className="text-gray-500 text-center text-sm">
            No tasks match your search.
          </p>
        ) : (
          sortedTasks.map((t) => {
            const deadline = t.deadline
              ? new Date(t.deadline).toLocaleDateString("en-GB")
              : "No deadline";

            const isDone = t.status === "done";

            //to show 
          return (
              <div
                key={t.id}
                className={`p-5 bg-white rounded-2xl shadow-md  hover:shadow-lg transition-all
                  border-l-8 
                  ${
                    ((t.priority ?? "") + "").trim().toLowerCase() === "urgent"
                      ? "border-red-600"
                      : ((t.priority ?? "") + "").trim().toLowerCase() === "high"
                      ? "border-orange-500"
                      : ((t.priority ?? "") + "").trim().toLowerCase() === "medium"
                      ? "border-blue-600"
                      : "border-gray-400"
                  }`}
              >
                <div className="flex flex-col gap-4">

                  {/* ✅ TITLE + PRIORITY */}
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-800  break-words ">
                        {t.title}
                      </h3>
                      <p className="text-sm text-gray-600 break-words mt-1">
                        {t.description}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 ml-auto px-3 py-1 text-xs font-bold rounded-full text-white ${
                        t.priority === "urgent"
                          ? "bg-red-600"
                          : t.priority === "high"
                          ? "bg-orange-500"
                          : t.priority === "medium"
                          ? "bg-blue-600"
                          : "bg-gray-400"
                      }`}
                    >
                      {t.priority.toUpperCase()}
                    </span>
                  </div>

                  {/* ✅ META INFO */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span><b>Assigned:</b> {t.assigned_to || "N/A"}</span>
                    <span><b>Deadline:</b> {deadline}</span>

                    <span
                      className={`px-2 py-1 rounded-md text-white ${
                        isDone ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    >
                      {isDone ? "Completed" : "Pending"}
                    </span>
                  </div>

                  {/* ✅ ATTACHMENTS */}
                  {t.attachments && t.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-2">
                      {t.attachments.map((file) => (
                        <div key={file.id} className="flex items-center gap-2">

                          {file.file_type.startsWith("image") && (
                            <div className="flex flex-col items-center gap-1">

                              {/* ✅ IMAGE PREVIEW IN SAME TAB */}
                              <img
                                src={`${BACKEND_URL}/${file.file_path}`}
                                className="h-20 w-20 object-cover rounded-md border cursor-pointer hover:scale-105 transition"
                                alt={file.file_name}
                                onClick={() => window.open(`${BACKEND_URL}/${file.file_path}`,"_blank")}
                              />

                              {/* ✅ DOWNLOAD IMAGE */}
                              <a
                                href={`${BACKEND_URL}/tasks/download/${file.id}`}
                                className="text-xs text-blue-600 underline"
                              >
                                ⬇ Download
                              </a>


                            </div>
                          )}


                          {file.file_type === "application/pdf" && (
                            <div className="flex flex-col items-center gap-1">

                              {/* ✅ OPEN PDF IN NEW TAB */}
                              <a
                                href={`${BACKEND_URL}/${file.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 text-xs bg-red-600 text-white rounded-md"
                              >
                                📄 Open PDF
                              </a>

                              {/* ✅ DOWNLOAD PDF */}
                              <a
                                href={`${BACKEND_URL}/tasks/download/${file.id}`}
                                className="text-xs text-blue-600 underline"
                              >
                                ⬇ Download
                              </a>


                            </div>
                          )}


                        </div>
                      ))}
                    </div>
                  )}

                  {/* ✅ FILE UPLOAD */}
                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2 text-sm bg-gray-100 rounded-lg cursor-pointer border hover:bg-gray-200">
                      📎 Upload
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        hidden
                        onChange={(e) => uploadFile(t.id, e.target.files[0])}
                      />
                    </label>
                  </div>

                  {/* ✅ ACTION BUTTONS */}
                  <div className="flex gap-3 pt-2">

                    <button
                      onClick={() =>
                        updateStatus(
                          t.id,
                          isDone ? "pending" : "done"
                        )
                      }
                      className={`px-4 py-2 text-sm rounded-lg font-medium text-white shadow ${
                        isDone
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {isDone ? "Mark Pending" : "Mark Done"}
                    </button>

                    <button
                      onClick={() => deleteTask(t.id)}
                      className="px-4 py-2 text-sm rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white shadow"
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

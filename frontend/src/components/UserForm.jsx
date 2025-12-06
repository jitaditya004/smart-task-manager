import React, { useState } from "react";

function UserForm({ refresh, user }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🚫 If the logged-in user is NOT admin, hide this entire UI
  if (user?.role !== "admin") {
    return null; // completely hide form for non-admins
  }

  async function addUser() {
    if (!username.trim() || !password.trim()) {
      alert("Username and password cannot be empty!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/users/add", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      alert(data.message || data.error);

      setLoading(false);

      if (res.ok) {
        setUsername("");
        setPassword("");
        setTimeout(refresh, 200);
      }
    } catch (err) {
      console.error("Error adding user:", err);
      alert("Something went wrong while adding user.");
      setLoading(false);
    }
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create User</h2>

      {/* Username */}
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="w-full p-3 mb-4 rounded-lg border border-gray-300 
                   focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
      />

      {/* Password */}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-3 mb-6 rounded-lg border border-gray-300 
                   focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
      />

      {/* Button */}
      <button
        onClick={addUser}
        disabled={loading}
        className={`w-full py-3 rounded-lg text-white font-semibold transition-all shadow-md ${
          loading
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 hover:scale-[1.02]"
        }`}
      >
        {loading ? "Creating User..." : "Add User"}
      </button>
    </div>
  );
}

export default UserForm;

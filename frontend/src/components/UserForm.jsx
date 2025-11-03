import React, { useState } from "react";

function UserForm({ refresh }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  //!password.trim(),,,,add later
  async function addUser() {
    if(!username.trim() ){
      alert("Username and password cannot be empty!");
      return;
    }

    
    try {
      const res = await fetch("/users/addUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      alert(data.message || data.error);

      if (res.ok) {
        setUsername("");
        setPassword("");

        // Small delay before re-fetching
        setTimeout(() => {
          refresh();
        }, 200);
      }
    } catch (err) {
      console.error("Error adding user:", err);
      alert("Something went wrong while adding user.");
    }
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Add User</h2>
      
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="w-full p-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      
      <button
        onClick={addUser}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Add User
      </button>
    </div>
  );
}

export default UserForm;

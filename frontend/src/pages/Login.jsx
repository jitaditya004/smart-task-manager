import React, { useState } from "react";

function Login({ onLoginSuccess, onSwitchToSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  // ⭐ Clean input before sending
  const cleanedData = {
    username: username.trim(),
    password: password.trim(),
  };

  try {
    const res = await fetch("/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cleanedData), // ⭐ send cleaned inputs
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("✅ Login successful!");
      setTimeout(() => onLoginSuccess(), 300);
    } else {
      setMessage(data.message || "❌ Invalid username or password");
    }
  } catch (err) {
    console.error("Login error:", err);
    setMessage("❌ Network error. Please try again.");
  }

  setLoading(false);
}


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-96 border border-gray-200">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 shadow-sm"
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 shadow-sm"
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all shadow-md ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02]"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="text-center text-sm mt-3 text-gray-700">{message}</p>
        )}

        {/* Switch to Signup */}
        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={onSwitchToSignup}
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;

import React, { useState } from "react";
import { apifetch } from "../api/api";

function Signup({ onSignupSuccess, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

      // ⭐ Clean data BEFORE sending to backend
    const cleanedData = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
    };


    try {
      const res = await apifetch("/auth/signup", {
        method: "POST",
        credentials: "include", // ⭐ keeps future-proof (cookies, CORS)
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("🎉 Account created successfully! Please login.");
        setTimeout(() => onSignupSuccess(), 600); // smooth transition
      } else {
        setMessage(data.message || "❌ Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setMessage("❌ Network error. Try again.");
    }

    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 w-96"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
          Create Account
        </h2>

        {/* Message */}
        {message && (
          <p className="text-center text-sm mb-4 text-gray-700">{message}</p>
        )}

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-4 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          required
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />

        {/* Signup Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition-all ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02]"
          }`}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        {/* Switch to Login */}
        <p className="text-sm text-center mt-5 text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}

export default Signup;

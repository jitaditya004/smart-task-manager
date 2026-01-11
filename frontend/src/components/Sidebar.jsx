import React, { useState } from "react";
import { Menu, X, User, Users, LogOut } from "lucide-react";
import { apifetch } from "../api/api";

function Sidebar({ activeView, setActiveView, user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // 🔐 Secure logout using HttpOnly cookie
  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      await apifetch("/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      // Redirect user to login page
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Something went wrong while logging out!");
    }

    setLoggingOut(false);
  }

  // Close sidebar on mobile when selecting a view
  function handleSelect(view) {
    setActiveView(view);
    setIsOpen(false);
  }

  return (
    <div className="relative">

      {/* 🌟 Floating Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-3 rounded-full bg-white backdrop-blur-md shadow-lg border border-gray-200 hover:scale-105 transition-all"
      >
        {isOpen ? (
          <X size={24} className="text-gray-700" />
        ) : (
          <Menu size={24} className="text-gray-700" />
        )}
      </button>

      {/* 🌈 Sidebar Container */}
      <div
        className={`fixed top-0 left-0 h-full z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          width: "260px",
          background:
            "linear-gradient(145deg, rgba(79,70,229,0.95), rgba(147,51,234,0.95), rgba(236,72,153,0.95))",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* 🏷️ Header */}
        <div className="mt-16 mb-6 text-center text-white font-extrabold text-2xl tracking-wider drop-shadow-md">
          Task Manager
        </div>

        {/* 📁 Menu Items */}
        <div className="flex flex-col space-y-3 px-4">

          {/* Personal */}
          <button
            className={`flex items-center gap-3 p-3 rounded-xl text-white font-medium transition-all ${
              activeView === "personal"
                ? "bg-white/25 shadow-inner shadow-white/20"
                : "hover:bg-white/15"
            }`}
            onClick={() => handleSelect("personal")}
          >
            <User size={20} />
            <span>Personal</span>
          </button>

          {/* Team */}
          <button
            className={`flex items-center gap-3 p-3 rounded-xl text-white font-medium transition-all ${
              activeView === "team"
                ? "bg-white/25 shadow-inner shadow-white/20"
                : "hover:bg-white/15"
            }`}
            onClick={() => handleSelect("team")}
          >
            <Users size={20} />
            <span>Team</span>
          </button>
        </div>

        
            
        {/* 🚪 Logout Button */}
        <div className="absolute bottom-6 w-full px-4 ">
           {/* 👤 Logged-in User */}
          <div className="mt-4 mb-2 ">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/20 text-white">
              <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center font-bold uppercase">
                {user?.username?.[0]}
              </div>

              <div className="flex flex-col text-left">
                <span className="font-semibold">
                  {user?.username}
                </span>
                <span className="text-sm ">
                  {user?.email}
                </span>
                <span className="text-xs opacity-80">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className={`flex items-center justify-center gap-2 w-full p-3 rounded-xl text-white font-semibold shadow-lg transition-all ${
              loggingOut
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 hover:scale-[1.02]"
            }`}
          >
            <LogOut size={20} />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

import React, { useState } from "react";
import { Menu, X, User, Users, LogOut } from "lucide-react";

function Sidebar({ activeView, setActiveView, onLogout }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      {/* 🌟 Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 left-4 z-50 p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:opacity-90 transition-all"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 🌈 Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full text-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          width: "250px",
          background:
            "linear-gradient(135deg, #4f46e5 0%, #9333ea 50%, #ec4899 100%)",
        }}
      >
        {/* 🏷️ Sidebar Header */}
        <div className="mt-14 mb-6 text-center font-bold text-xl tracking-wide">
          Task Manager
        </div>

        {/* 📁 Menu Buttons */}
        <div className="flex flex-col space-y-2 px-4">
          <button
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              activeView === "personal"
                ? "bg-white/20 shadow-inner"
                : "hover:bg-white/10"
            }`}
            onClick={() => setActiveView("personal")}
          >
            <User size={20} />
            <span>Personal</span>
          </button>

          <button
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              activeView === "team"
                ? "bg-white/20 shadow-inner"
                : "hover:bg-white/10"
            }`}
            onClick={() => setActiveView("team")}
          >
            <Users size={20} />
            <span>Team</span>
          </button>
        </div>

        {/* 🚪 Logout Button */}
        <div className="absolute bottom-6 w-full px-4">
          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg transition-all shadow-md"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

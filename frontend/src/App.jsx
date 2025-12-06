import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import PersonalView from "./views/PersonalView.jsx";
import TeamView from "./views/TeamView.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import "./style.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [dataChanged, setDataChanged] = useState(false);
  const [activeView, setActiveView] = useState("personal");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showSignup, setShowSignup] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);


  // -------------------------------------------------------------
  // 🔐 CHECK AUTH SESSION (Cookie-based)
  // -------------------------------------------------------------
useEffect(() => {
  async function checkSession() {
    try {
      const res = await fetch("/auth/check", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        console.log("AUTH CHECK RESULT:", data);

        setCurrentUser(data.user); // <-- Save admin/user info
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error(err);
      setIsLoggedIn(false);
    } finally {
      setCheckingAuth(false);
    }
  }

  checkSession();
}, []);


  // -------------------------------------------------------------
  // 🧲 FETCH TASKS / USERS / TEAMS (Cookie included auto)
  // -------------------------------------------------------------
  useEffect(() => {
    if (isLoggedIn) {
      fetchTasks();
      fetchUsers();
      fetchTeams();
    }
  }, [dataChanged, isLoggedIn]);

  async function fetchTasks() {
    try {
      const res = await fetch("/tasks", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch tasks");

      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchUsers() {
    try {
      const res = await fetch("/users", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchTeams() {
    try {
      const res = await fetch("/teams", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch teams");

      const data = await res.json();
      setTeams(data);
    } catch (err) {
      console.error(err);
    }
  }

  // -------------------------------------------------------------
  // 🚪 LOGOUT — Clear HttpOnly cookie on backend
  // -------------------------------------------------------------
  async function handleLogout() {
    try {
      await fetch("/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    setIsLoggedIn(false);
  }

  // -------------------------------------------------------------
  // ⏳ Show Loading Screen While Checking Session
  // -------------------------------------------------------------
  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-700">
        <div className="text-xl font-semibold">Checking session...</div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 🔑 Show Login / Signup Pages
  // -------------------------------------------------------------
  if (!isLoggedIn) {
    return showSignup ? (
      <Signup
        onSignupSuccess={() => setShowSignup(false)}
        onSwitchToLogin={() => setShowSignup(false)}
      />
    ) : (
      <Login
        onLoginSuccess={() => setIsLoggedIn(true)}
        onSwitchToSignup={() => setShowSignup(true)}
      />
    );
  }

  // -------------------------------------------------------------
  // 🏡 MAIN LOGGED-IN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {activeView === "personal" ? (
          <PersonalView
            tasks={tasks}
            users={users}
            teams={teams}
            refresh={() => setDataChanged(!dataChanged)}
            user={currentUser}
          />
        ) : (
          <TeamView
            tasks={tasks}
            users={users}
            teams={teams}
            refresh={() => setDataChanged(!dataChanged)}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
}

export default App;

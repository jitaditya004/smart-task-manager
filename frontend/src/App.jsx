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
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchTasks();
      fetchUsers();
      fetchTeams();
    }
  }, [dataChanged, isLoggedIn]);

async function fetchTasks() {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("/tasks", {
      headers: { Authorization: `Bearer ${token}` },
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
    const token = localStorage.getItem("token");
    const res = await fetch("/users", {
      headers: { Authorization: `Bearer ${token}` },
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
    const token = localStorage.getItem("token");
    const res = await fetch("/teams", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch teams");
    const data = await res.json();
    setTeams(data);
  } catch (err) {
    console.error(err);
  }
}


  // 🧩 Logout function
  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  }

  // 🧭 Page switch logic
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

  // ✅ Main dashboard after login
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={handleLogout}
      />
      <div className="flex-1 p-6 overflow-auto">
        {activeView === "personal" ? (
          <PersonalView
            tasks={tasks}
            users={users}
            teams={teams}
            refresh={() => setDataChanged(!dataChanged)}
          />
        ) : (
          <TeamView
            tasks={tasks}
            users={users}
            teams={teams}
            refresh={() => setDataChanged(!dataChanged)}
          />
        )}
      </div>
    </div>
  );
}

export default App;

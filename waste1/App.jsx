import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import UserForm from "./components/UserForm.jsx";
import TeamForm from "./components/TeamForm.jsx";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import DeleteForms from "./components/DeleteForms.jsx";
import PersonalView from "./views/PersonalView.jsx";
import TeamView from "./views/TeamView.jsx";
import "./style.css"; // Tailwind imports

function App() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [dataChanged, setDataChanged] = useState(false);
  const [activeView, setActiveView] = useState("personal");


  useEffect(() => {
    fetchTasks();
    fetchUsers();
    fetchTeams();
  }, [dataChanged]);

  async function fetchTasks() {
    try {
    const res = await fetch("/tasks");
    if (!res.ok) throw new Error("Failed to fetch tasks");
    const data = await res.json();
    setTasks(data);
  } catch (err) {
    console.error(err);
  }
  }

  async function fetchUsers() {
    try {
    const res = await fetch("/users");
    if (!res.ok) throw new Error("Failed to fetch users");
    const data = await res.json();
    setUsers(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchTeams() {
    try {
    const res = await fetch("/teams");
    if (!res.ok) throw new Error("Failed to fetch teams");
    const data = await res.json();
    setTeams(data);
  } catch (err) {
    console.error(err);
  }

  }

  return (
    
     


    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-100 p-8">
      {/* Header */}
      <h1 className="text-5xl font-extrabold text-center text-indigo-900 mb-12 drop-shadow-lg">
        Smart Task Manager
      </h1>

      {/* User and Team Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          {/* 🔁 When user added, toggle dataChanged */}
          <UserForm refresh={() => setDataChanged(!dataChanged)} />
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <TeamForm refresh={() => setDataChanged(!dataChanged)} />
        </div>
      </div>

      {/* Delete Forms */}
      <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-12">
        <DeleteForms
          refreshUsers={() => setDataChanged(!dataChanged)}
          refreshTeams={() => setDataChanged(!dataChanged)}
          fetchTasks={() => setDataChanged(!dataChanged)}
        />
      </div>

      {/* Task Form */}
      <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-12">
        <TaskForm
          users={users}
          teams={teams}
          refresh={() => setDataChanged(!dataChanged)}
        />
      </div>

      {/* Task List */}
      <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Tasks</h2>
        <TaskList tasks={tasks} refresh={() => setDataChanged(!dataChanged)} />
      </div>
    </div>
  );
}

export default App;

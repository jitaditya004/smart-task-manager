import UserForm from "../components/UserForm";
import TeamForm from "../components/TeamForm";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import DeleteForms from "../components/DeleteForms";

export default function TeamView({ tasks, users, teams, refresh }) {
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <h2 className="text-3xl font-bold text-indigo-900 mb-6">
        👥 Team Collaboration
      </h2>

      {/* User & Team Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <UserForm refresh={refresh} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <TeamForm refresh={refresh} />
        </div>
      </div>

      {/* Delete Forms */}
      <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
        <DeleteForms
          refreshUsers={refresh}
          refreshTeams={refresh}
          fetchTasks={refresh}
        />
      </div>

      {/* Task Creation */}
      <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
        <TaskForm users={users} teams={teams} mode="team" refresh={refresh} />
      </div>

      {/* Task List */}
      <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
        <h3 className="text-2xl font-semibold text-indigo-900 mb-4">
          Team Tasks
        </h3>
        <TaskList tasks={tasks} mode="team" refresh={refresh} />
      </div>
    </div>
  );
}

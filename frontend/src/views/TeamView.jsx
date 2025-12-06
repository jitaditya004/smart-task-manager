import UserForm from "../components/UserForm";
import TeamForm from "../components/TeamForm";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import DeleteForms from "../components/DeleteForms";

export default function TeamView({ tasks, users, teams, refresh, currentUser }) {
  const isAdmin = currentUser?.role === "admin";

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-6 px-4">

      {/* Page Title */}
      <h2 className="text-3xl font-extrabold text-indigo-900 tracking-tight">
        👥 Team Collaboration Dashboard
      </h2>

      {/* User & Team Management */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* CREATE USER — ONLY ADMIN */}
        {isAdmin && (
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100">
            <h3 className="text-xl font-semibold text-indigo-800 mb-4">
              Create User
            </h3>
            <UserForm refresh={refresh} user={currentUser}/>
          </div>
        )}

        {/* CREATE TEAM — ALWAYS VISIBLE */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100">
          <h3 className="text-xl font-semibold text-indigo-800 mb-4">
            Create Team
          </h3>
          <TeamForm refresh={refresh} />
        </div>
      </section>

      {/* DELETE USER & TEAM */}

      <section className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100">
        <h3 className="text-xl font-semibold text-red-600 mb-4">
          Delete Users / Teams
        </h3>

        <DeleteForms
          role={currentUser.role}
          refreshUsers={refresh}
          refreshTeams={refresh}
          fetchTasks={refresh}
            // <-- Pass admin flag
        />
      </section>

      {/* Task Creation */}
      <section className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100">
        <h3 className="text-xl font-semibold text-indigo-800 mb-4">
          Create Team Task
        </h3>
        <TaskForm users={users} teams={teams} mode="team" refresh={refresh} />
      </section>

      {/* Task List */}
      <section className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100">
        <h3 className="text-2xl font-semibold text-indigo-900 mb-4">
          Team Tasks
        </h3>
        <TaskList tasks={tasks} mode="team" refresh={refresh} />
      </section>

    </div>
  );
}

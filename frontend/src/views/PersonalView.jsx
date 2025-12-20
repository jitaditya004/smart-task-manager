import UserForm from "../components/UserForm";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

//users and user are different by the way
export default function PersonalView({ tasks, users, teams, refresh, user }) {

  // // ✅ HARD SAFETY GUARD — prevents white screen on first load
  // if (!user) {
  //   return (
  //     <div className="max-w-3xl mx-auto py-10 text-center text-gray-600">
  //       Loading your dashboard...
  //     </div>
  //   );
  // }


  //testing delete it
  console.log("PERSONAL VIEW USER:", user);

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-6 px-4">

      {/* Page Title */}
      <h2 className="text-3xl font-extrabold text-indigo-900 tracking-tight">
        🧍 Your Personal Dashboard
      </h2>

      {/* ADMIN-ONLY — Create User Section */}
      {user?.role === "admin" && (
        <section className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100">
          <h3 className="text-xl font-semibold text-indigo-800 mb-4">
            👑 Admin — Create User
          </h3>
          <UserForm refresh={refresh} user={user} />
        </section>
      )}

      {/* Add Task Section */}
      <section className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100">
        <h3 className="text-xl font-semibold text-indigo-800 mb-4">
          Add a New Task
        </h3>
        <TaskForm users={users} teams={teams} refresh={refresh} mode="personal" />
      </section>

      {/* Task List Section */}
      <section className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100">
        <h3 className="text-xl font-semibold text-indigo-800 mb-4">
          Your Tasks
        </h3>
        <TaskList tasks={tasks} refresh={refresh} mode="personal" />
      </section>
    </div>
  );
}

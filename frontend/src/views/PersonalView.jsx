import UserForm from "../components/UserForm";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

export default function PersonalView({ tasks, users, teams, refresh }) {
  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <h2 className="text-3xl font-bold text-indigo-900 mb-6">
        🧍 Personal To-Do List
      </h2>

      {/* Add User (for single user setup) */}
      <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
        <h3 className="text-xl font-semibold text-indigo-800 mb-4">
          Add Yourself
        </h3>
        <UserForm refresh={refresh} />
      </div>

      {/* Add Task */}
      <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
        <TaskForm users={users} teams={teams} mode="personal" refresh={refresh} />
      </div>

      {/* Task List */}
      <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
        <h3 className="text-xl font-semibold text-indigo-800 mb-4">
          Your Tasks
        </h3>
        <TaskList tasks={tasks} mode="personal" refresh={refresh} />
      </div>
    </div>
  );
}

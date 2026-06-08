import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md text-center max-w-sm w-full mx-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard 🏠
        </h1>
        
        {/* Step 7 Requirement: Display welcome message */}
        <h2 className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          Welcome <span className="font-semibold text-blue-600">{user?.name}</span>
        </h2>

        {/* Step 7 Requirement: Logout button */}
        <button
          onClick={logout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

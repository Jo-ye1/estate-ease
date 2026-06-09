import { Link } from "react-router-dom";
import { Bell, Search, Sun, Moon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext"; // 👈 Connect right to the custom theme hook

export default function Navbar() {
  const { token, logout } = useAuth();
  const { theme, toggleTheme } = useTheme(); // 👈 Pull theme properties out cleanly

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 transition-colors duration-200">
      
      {/* Search Field Area */}
      <div className="flex items-center gap-2 border rounded-lg px-3 py-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <Search size={18} className="text-slate-400" />
        <input
          placeholder="Search..."
          className="outline-none bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400"
        />
      </div>

      {/* Navigation Grouping */}
      <div className="flex items-center gap-6">
        <nav className="flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
          
          {/* Always Visible Base Public Links */}
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
            Home
          </Link>
          <Link to="/properties" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
            Properties
          </Link>

          {/* Conditional Navigation States based on user login */}
          {token ? (
            <>
              <Link to="/favorites" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                Favorites
              </Link>
              <Link to="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                Dashboard
              </Link>
              <Link to="/profile" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                Profile
              </Link>
              <button
                type="button"
                onClick={logout}
                className="text-red-500 hover:text-red-600 font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="px-4 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold shadow-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Action Controls Segment */}
        <div className="flex items-center gap-4 border-l pl-4 border-slate-200 dark:border-slate-800">
          
          {/* ⚡ THEME TOGGLE BUTTON */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer text-slate-700 dark:text-slate-300"
            aria-label="Toggle layout theme"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4 text-slate-700" />
            ) : (
              <Sun className="w-4 h-4 text-yellow-400" />
            )}
          </button>

          <Bell className="text-slate-500 dark:text-slate-400 w-5 h-5 cursor-pointer hover:text-slate-700 dark:hover:text-white" />
          
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm select-none">
            E
          </div>
        </div>

      </div>
    </header>
  );
}

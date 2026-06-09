import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Search } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  // ⚡ Live Token Listener state synchronization layer
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Automatically forces the navbar links to scan for session storage updates on route changes
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [location]);

  // A6 — Automated Logout handling execution
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null); // Instantly clears local layout listener state
    window.location.href = "/";
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b flex items-center justify-between px-6">
      {/* Brand Search Bar Segment */}
      <div className="flex items-center gap-2 border rounded-lg px-3 py-2 border-slate-200 dark:border-slate-800">
        <Search size={18} className="text-slate-400" />
        <input
          placeholder="Search..."
          className="outline-none bg-transparent text-sm text-slate-900 dark:text-white"
        />
      </div>

      <div className="flex items-center gap-6">
        {/* Navigation Links Group */}
        <nav className="flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link 
            to="/add-property" 
            className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
          >
            Add Property
          </Link>

          {/* Conditional Actions View Interpolation Block */}
          {token ? (
            <>
              <Link 
                to="/dashboard" 
                className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
              >
                Dashboard
              </Link>

              <Link 
                to="/profile" 
                className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
              >
                Profile
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 font-semibold transition-colors cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
              >
                Sign In
              </Link>

              <Link 
                to="/signup" 
                className="px-4 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Profile Avatar & Notifications Section */}
        <div className="flex items-center gap-4 border-l pl-4 border-slate-200 dark:border-slate-800">
          <Bell className="text-slate-500 dark:text-slate-400 w-5 h-5 cursor-pointer hover:text-slate-700" />

          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm select-none">
            E
          </div>
        </div>
      </div>
    </header>
  );
}

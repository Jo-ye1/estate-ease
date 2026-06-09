import { Link } from "react-router-dom";
import { Bell, Search } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b flex items-center justify-between px-6">
      <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
        <Search size={18} />
        <input
          placeholder="Search..."
          className="outline-none bg-transparent"
        />
      </div>

      <div className="flex items-center gap-6">
        {/* Navigation Links Group */}
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link 
            to="/add-property" 
            className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
          >
            Add Property
          </Link>
          <Link 
            to="/dashboard" 
            className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
          >
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-4 border-l pl-4 border-slate-200 dark:border-slate-800">
          <Bell />

          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
            E
          </div>
        </div>
      </div>
    </header>
  );
}

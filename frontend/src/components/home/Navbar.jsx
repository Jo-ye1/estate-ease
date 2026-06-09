import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="w-full border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-20 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600"
          >
            Estate Ease
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/properties" className="hover:text-blue-600 transition-colors">Property</Link>
            <Link to="/about" className="hover:text-blue-600 transition-colors">About</Link>
            <Link to="/review" className="hover:text-blue-600 transition-colors">Review</Link>
            
            {/* Step Requirement: Added Favorites Navigation Route Link */}
            <Link to="/favorites" className="text-red-500 hover:text-red-600 font-semibold transition-colors flex items-center gap-1">
              ❤️ Favorites
            </Link>
            
            <Link to="#" className="hover:text-blue-600 transition-colors">Blog</Link>
            <Link to="#" className="hover:text-blue-600 transition-colors">Contact</Link>
          </nav>

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg border text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Sign In
            </Link>

            <Link
              to="/signup"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

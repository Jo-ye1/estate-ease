import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Sun,
  Moon,
  Menu,
  X,
  LayoutDashboard,
  PlusSquare,
  User,
  LogOut,
  Heart,
  Shield,
  Layers,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const { user, logout, token } = useAuth();
  const { theme, setTheme } = useTheme();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentUser =
    user || JSON.parse(localStorage.getItem("user") || "null");

  const userRole = currentUser?.role || "user";

  const isOwnerPanel =
    userRole === "seller" ||
    userRole === "owner" ||
    userRole === "admin";

  const isSuperAdmin = userRole === "super_admin";

  const profileAvatarSrc = (() => {
    const dbAvatar =
      currentUser?.avatar ||
      currentUser?.profilePic ||
      currentUser?.image ||
      "";

    if (!dbAvatar) return "";

    return dbAvatar.startsWith("http")
      ? dbAvatar
      : `http://localhost:5000${dbAvatar}`;
  })();

  const displayUserName = currentUser?.name || "User";
  const displayUserEmail =
    currentUser?.email || "user@example.com";
  const firstInitial =
    displayUserName.charAt(0).toUpperCase();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    setMobileOpen(false);
    logout();
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-[1320px] mx-auto px-4 h-[74px] flex items-center justify-between">
        <Link
          to="/"
          className="font-black text-lg tracking-tight text-blue-600 no-underline"
        >
          EstateEase
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-bold">
          <Link to="/">Home</Link>
          <Link to="/properties">Properties</Link>
          <Link to="/about">About</Link>

          {token && (
            <>
              <Link to="/favorites">Favorites</Link>
              <Link to="/inbox">Inbox</Link>
            </>
          )}
        </nav>

        <div
          className="flex items-center gap-3 relative"
          ref={dropdownRef}
        >
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {theme === "light" ? (
              <Moon size={16} />
            ) : (
              <Sun size={16} />
            )}
          </button>

          {token ? (
            <div className="relative">
              <button
                onClick={() =>
                  setDropdownOpen(!dropdownOpen)
                }
                className="w-10 h-10 rounded-full overflow-hidden bg-blue-600 text-white font-black"
              >
                {profileAvatarSrc ? (
                  <img
                    src={profileAvatarSrc}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  firstInitial
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-14 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-black text-sm">
                      {displayUserName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {displayUserEmail}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <User size={16} />
                    Profile
                  </Link>

                  {isOwnerPanel && (
                    <>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <LayoutDashboard size={16} />
                        Owner Dashboard
                      </Link>

                      <Link
                        to="/leads"
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <Layers size={16} />
                        Leads
                      </Link>

                      <Link
                        to="/add-property"
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <PlusSquare size={16} />
                        Add Property
                      </Link>
                    </>
                  )}

                  {isSuperAdmin && (
                    <>
                      <Link
                        to="/admin-dashboard"
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <Shield size={16} />
                        Super Admin Panel
                      </Link>

                      <Link
                        to="/admin/matrix-settings"
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <Layers size={16} />
                        Matrix Settings
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-t"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">Login</Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-xl"
              >
                Join
              </Link>
            </div>
          )}

          <button
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
            className="md:hidden"
          >
            {mobileOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
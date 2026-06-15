import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const { user, logout, token } = useAuth();
  const { theme, setTheme } = useTheme();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const currentUser =
    user || JSON.parse(localStorage.getItem("user") || "null");

  const userId = currentUser?._id || currentUser?.id || "guest";

  const profileAvatarSrc = (() => {
    const dbAvatar =
      currentUser?.avatar ||
      currentUser?.profilePic ||
      currentUser?.image ||
      "";

    if (!dbAvatar) {
      return "";
    }

    return dbAvatar.startsWith("http")
      ? dbAvatar
      : `http://localhost:5000${dbAvatar}`;
  })();

  const displayUserName = currentUser?.name || "User";
  const displayUserEmail = currentUser?.email || "user@example.com";
  const firstInitial = displayUserName.charAt(0).toUpperCase();

  const userRole = currentUser?.role || "user";

  const handleLogoutActionExecution = async () => {
    setDropdownOpen(false);

    try {
      logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  };

  const isActiveRoute = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b w-full">
      <div className="max-w-[1320px] mx-auto px-4 h-[70px] flex items-center justify-between">

        <Link to="/" className="font-black text-blue-600">
          🏠 EstateEase
        </Link>

        <nav className="hidden md:flex gap-6 text-sm font-semibold">
          <Link className={isActiveRoute("/") ? "text-blue-600" : ""} to="/">
            Home
          </Link>
          <Link
            className={isActiveRoute("/properties") ? "text-blue-600" : ""}
            to="/properties"
          >
            Properties
          </Link>
          <Link
            className={isActiveRoute("/about") ? "text-blue-600" : ""}
            to="/about"
          >
            About
          </Link>

          {token && (
            <Link
              className={isActiveRoute("/favorites") ? "text-red-500" : ""}
              to="/favorites"
            >
              Favorites
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3" ref={dropdownRef}>
          <button onClick={toggleTheme}>
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <NotificationDropdown />

          {token ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold overflow-hidden"
              >
                {profileAvatarSrc ? (
                  <img
                    src={profileAvatarSrc}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  firstInitial
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-12 bg-white dark:bg-slate-900 border rounded-xl w-56">
                  <div className="p-3 border-b">
                    <p className="font-bold">{displayUserName}</p>
                    <p className="text-xs">{displayUserEmail}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block p-3"
                  >
                    Profile
                  </Link>

                  {(userRole === "seller" ||
                    userRole === "owner" ||
                    userRole === "admin") && (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="block p-3"
                      >
                        Dashboard
                      </Link>

                      <Link
                        to="/add-property"
                        onClick={() => setDropdownOpen(false)}
                        className="block p-3"
                      >
                        Add Property
                      </Link>
                    </>
                  )}

                  {userRole === "super_admin" && (
                    <>
                      <Link
                        to="/admin-dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="block p-3"
                      >
                        Admin Panel
                      </Link>

                      <Link
                        to="/admin/matrix-settings"
                        onClick={() => setDropdownOpen(false)}
                        className="block p-3"
                      >
                        Settings
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogoutActionExecution}
                    className="w-full text-left p-3 text-red-600 border-t"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Join</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

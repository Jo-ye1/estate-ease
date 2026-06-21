import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation, NavLink, } from "react-router-dom";
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
  MessageSquare, 
  Sparkles, 
  Activity,
  AlertOctagon, 
  CreditCard,
  TrendingUp,
  ShieldCheck,
  BarChart3 ,
  DollarSign ,
  Terminal,
  ShieldAlert
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import NotificationDropdown from "./NotificationDropdown";
import AgentStatusToggle from "./AgentStatusToggle";


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
  <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-900/60 transition-colors duration-200">
    <div className="max-w-[1320px] mx-auto px-4 md:px-6 h-[74px] flex items-center justify-between">
      
      {/* 1. Left Side: Professional Bold Brand Logo */}
      <div className="flex-1 flex justify-start">
        <Link
          to="/"
          className="font-extrabold text-xl tracking-tight text-blue-600 dark:text-blue-500 no-underline hover:opacity-90 transition-opacity"
        >
          EstateEase
        </Link>
      </div>

      {/* 2. Middle Section: Clean Semibold Center NavLinks */}
      <nav className="hidden md:flex items-center gap-8 h-full text-[14px] font-semibold flex-1 justify-center">
        {[
          { path: "/", label: "Home" },
          { path: "/properties", label: "Properties" },
          { path: "/about", label: "About" },
          ...(token ? [
            { path: "/favorites", label: "Favorites" },
            { path: "/inbox", label: "Inbox" }
          ] : [])
        ].map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `transition-colors duration-150 no-underline tracking-wide ${
                isActive 
                  ? "text-blue-600 dark:text-blue-400 font-bold" 
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* 3. Right Side: Balanced Actions Group */}
      <div className="flex-1 flex justify-end items-center gap-4">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer transition-colors"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {(user?.role?.toLowerCase() === "agency" || user?.role?.toLowerCase() === "agent") && (
          <AgentStatusToggle />
        )}

        {token ? (
          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            <NotificationDropdown />

            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full overflow-hidden bg-blue-600 text-white font-black text-xs cursor-pointer border-none outline-none flex items-center justify-center transition-all hover:scale-105 shadow-xs"
              >
                {profileAvatarSrc ? (
                  <img
                    src={profileAvatarSrc}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="uppercase">{firstInitial}</span>
                )}
              </button>
  

                {dropdownOpen && (
                  <div className="absolute right-0 top-14 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden text-slate-800 dark:text-slate-100 transition-colors duration-200 z-50">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                      <p className="font-black text-sm text-slate-900 dark:text-white truncate">
                        {displayUserName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {displayUserEmail}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <User size={14} />
                      Profile
                    </Link>

                    {String(user?.role).toLowerCase() === "user" && (
                      <>
                        <Link
                          to="/favorites"
                          className="flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-t border-slate-100 dark:border-slate-800/60"
                        >
                          <Heart size={14} />
                          Favorites
                        </Link>
                        <Link
                          to="/inbox"
                          className="flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-t border-slate-100 dark:border-slate-800/60"
                        >
                          <MessageSquare size={14} />
                          Inbox Chat
                        </Link>
                        <button
                          type="button"
                          onClick={() => navigate("/pricing")}
                          className="w-full flex items-center gap-3 p-3 text-left text-xs font-black uppercase tracking-wider text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800 border-t border-slate-100 dark:border-slate-800/60 transition-colors"
                        >
                          <Sparkles size={14} />
                          Become a Seller
                        </button>
                      </>
                    )}

                    {String(user?.role).toLowerCase() === "seller" && (
                      <>
                        <Link
                          to="/seller-dashboard"
                          className="flex items-center gap-3 p-3 text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-t border-slate-100 dark:border-slate-800/60 transition-colors"
                        >
                          <LayoutDashboard size={14} />
                          Seller Dashboard
                        </Link>
                        <Link
                          to="/add-property"
                          className="flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-t border-slate-100 dark:border-slate-800/60"
                        >
                          <PlusSquare size={14} />
                          Add Property
                        </Link>
                        <Link
                          to="/leads"
                          className="flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-t border-slate-100 dark:border-slate-800/60"
                        >
                          <Layers size={14} />
                          My Leads
                    </Link>
                    <Link
                      to="/dashboard/revenue"
                      className="flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-t border-slate-100 dark:border-slate-800/60"
                    >
                      <TrendingUp size={14} className="text-emerald-500" />
                      My Revenue
                    </Link>
                    <Link
                      to="/dashboard/market-insights"
                      className="flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-t border-slate-100 dark:border-slate-800/60"
                    >
                      <Sparkles size={14} className="text-blue-500" />
                      Market Insights
                    </Link>
                    <Link
                      to="/billing"
                      className="flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-t border-slate-100 dark:border-slate-800/60"
                    >
                      <CreditCard size={14} />
                      Billing Dashboard
                    </Link>
                  </>
                )}

                                 {/* 🟢 TIER 3: CHIEF OPERATIONS MODERATOR ADMIN VIEW LINKS */}
                {String(user?.role).toLowerCase() === "admin" && (
                  <>
                    <Link
                      to="/admin-dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 p-3 text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-t border-slate-100 dark:border-slate-800/60 transition-colors"
                    >
                      <Shield size={14} />
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/admin/properties-control"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-t border-slate-100 dark:border-slate-800/60"
                    >
                      <Layers size={14} />
                      Property Moderation
                    </Link>
                    <Link
                      to="/admin/kyc-verification"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-t border-slate-100 dark:border-slate-800/60"
                    >
                      <ShieldCheck size={14} className="text-blue-500" />
                      KYC Verification Desk
                    </Link>
                    <Link
                      to="/admin/alerts"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-wider text-rose-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-t border-slate-100 dark:border-slate-800/60"
                    >
                      <ShieldAlert size={14} />
                      Incident Alerts
                    </Link>
                  </>
                )}

                {/* 🟢 TIER 4: INFRASTRUCTURE SYSTEM SUPER ADMIN VIEW LINKS */}
                {String(user?.role).toLowerCase() === "super_admin" && (
                  <>
                    <Link
                      to="/super-admin-dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 p-3 text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-t border-slate-100 dark:border-slate-800/60 transition-colors"
                    >
                      <Shield size={14} />
                      Super Dashboard
                    </Link>
                    <Link
                      to="/admin/matrix-settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-t border-slate-100 dark:border-slate-800/60"
                    >
                      <Layers size={14} />
                      Fix Landing Pages CMS
                    </Link>
                    <Link
                      to="/admin/properties-control"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-t border-slate-100 dark:border-slate-800/60"
                    >
                      <Layers size={14} />
                      Global Controls
                    </Link>
                    <Link
                      to="/admin/kyc-verification"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-t border-slate-100 dark:border-slate-800/60"
                    >
                      <ShieldCheck size={14} className="text-blue-500" />
                      KYC Verification Desk
                    </Link>
                    <Link
                      to="/admin/alerts"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-wider text-rose-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-t border-slate-100 dark:border-slate-800/60"
                    >
                      <ShieldAlert size={14} />
                      Incident Alerts
                    </Link>
                    <Link
                      to="/admin/system-health"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-t border-slate-100 dark:border-slate-800/60"
                    >
                      <Activity size={14} />
                      Security Logs
                    </Link>
                    <Link
                      to="/admin/audit-logs"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 p-3 text-xs font-black uppercase tracking-wider text-purple-500 hover:bg-slate-50 dark:hover:bg-slate-800 border-t border-slate-100 dark:border-slate-800/60 transition-colors"
                    >
                      <Terminal size={14} />
                      Immutable Security Logs
                    </Link>
                  </>
                )}

                {/* 🟢 NEW CORPORATE ATTACHMENT: TIER 5: BUSINESS BROKERAGE OWNER ACCOUNT VIEW */}
                {String(user?.role).toLowerCase() === "agency" && (
                  <>
                    <Link
                      to="/agency-dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 p-3 text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-t border-slate-100 dark:border-slate-800/60 transition-colors"
                    >
                      <LayoutDashboard size={14} />
                      Agency Console
                    </Link>
                    
                    <Link
                      to="/add-property"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-t border-slate-100 dark:border-slate-800/60"
                    >
                      <PlusSquare size={14} />
                      Add Property
                    </Link>
                    
                  </>
                )}


                                {/* 🟢 AGENT TIERS WORKSPACE: Automatically visible to invited sub-agents */}
                {String(user?.role).toLowerCase() === "agent" && (
                  <>
                    <Link
                      to="/agent-dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 p-3 text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-t border-slate-100 dark:border-slate-800/60 transition-colors animate-pulse"
                    >
                      <LayoutDashboard size={14} />
                      Agent Workspace Panel
                    </Link>
                    <Link
                      to="/leads"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-t border-slate-100 dark:border-slate-800/60"
                    >
                      <Layers size={14} />
                      My Assigned Leads
                    </Link>
                  </>
                )}

                <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3 text-left text-xs font-black uppercase tracking-wider text-rose-500 hover:bg-rose-500/10 border-t border-slate-100 dark:border-slate-800/60 transition-colors cursor-pointer border-0 bg-transparent"
                    >
                      <LogOut size={14} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors no-underline">Login</Link>
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl shadow-xs transition-colors no-underline"
              >
                Join
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden bg-transparent border-0 cursor-pointer text-slate-700 dark:text-slate-200 p-1 flex items-center justify-center"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>
      </div>
    </header>
  );
}
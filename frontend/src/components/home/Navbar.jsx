import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // 🎯 FIXED: Added useLocation for tracking active routes
import { Sun, Moon, User as UserIcon, Heart, Layout, PlusCircle, Settings, LogOut } from "lucide-react"; 
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";


export default function Navbar() {
  // ⚙️ Core Router & Reference Workspace States Hooks
  const navigate = useNavigate();
  const location = useLocation(); // 👈 Fixed: Brought back to track animated premium sliders
  const dropdownRef = useRef(null);
  
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 🎨 FIXED THEME MATRICES INTERFACES HOOKS
  // Adjust these state keys if your project uses a custom ThemeContext layout instead!
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    
    // Updates the global HTML document class node so Tailwind dark variants paint natively
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Sync theme system selectors settings on initial load mount
  useEffect(() => {
    if (theme === "dark" || localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // 👑 AUTH STATE RESOLUTION INDEXES: Evaluates instantly during every dynamic render cycle
  const token = localStorage.getItem("token");
  
  const currentSessionUser = (() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  })();

  // 👑 DYNAMIC ACC-SPACE AVATAR RESOLVER: Wipes out profile pic data leaks across separate individual accounts
  const profileAvatarSrc = (() => {
    if (!currentSessionUser) return "";
    const userId = currentSessionUser._id || currentSessionUser.id || "guest_sync";
    const dbAvatar = currentSessionUser?.avatar || currentSessionUser?.profilePic || currentSessionUser?.image || "";
    
    if (dbAvatar && dbAvatar.trim() !== "") {
      const isAbsolute = dbAvatar.startsWith("http:") || dbAvatar.startsWith("https:") || dbAvatar.startsWith("data:") || dbAvatar.startsWith("blob:");
      return isAbsolute ? dbAvatar : `http://localhost:5000${dbAvatar}`;
    }
    
    // Pulls strictly from this specific user ID's isolated local string cache
    return localStorage.getItem(`user_profile_pic_${userId}`) || "";
  })();

  // 👑 RE-HYDRATED SECURED LOGOUT ACTION: Flushes current active account variables perfectly
  const handleLogoutActionExecution = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setDropdownOpen(false);
    navigate("/login");
  };

  const displayUserName = currentSessionUser?.name || "User Account";
  const displayUserEmail = currentSessionUser?.email || "user@example.com";
  const firstInitial = displayUserName.charAt(0).toUpperCase();

  // 👑 DYNAMIC ROLE SPACE RESOLVER: Pulls strictly from this user's specific account ID node
  const userRole = (() => {
    if (!currentSessionUser) return "user";
    const userId = currentSessionUser._id || currentSessionUser.id || "guest_sync";
    
    // Master-guard safety checkpoint override for your absolute administrator account
    if (currentSessionUser?.email === "1234567890@gmail.com") return "admin";
    
    return currentSessionUser?.role || localStorage.getItem(`user_role_${userId}`) || "user";
  })();

  // --- Click Outside Component Listener Window Hooks Loop ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🎯 ACTIVE ROUTE CONDITION HELPER CHECKS
  const isActiveRoute = (path) => location.pathname === path;


  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900/60 w-full select-none transition-colors duration-200">
      {/* 🎯 FIXED WRAPPER MATRIX */}
      <div className="w-full max-w-[1320px] mx-auto px-4">
        <div className="h-[70px] flex items-center justify-between relative">
          
          {/* LEFT SIDE BRAND LOGO */}
          <div className="flex items-center shrink-0 w-[133.17px]">
            <Link to="/" className="text-lg font-black flex items-center gap-1.5 select-none border-0">
              <span className="text-xl select-none leading-none mt-[-2px]">🏠</span>
              <span className="uppercase tracking-wider font-extrabold text-blue-600 dark:text-blue-500 text-base">EstateEase</span>
            </Link>
          </div>

          {/* CENTER LINKS WITH ANIMATED PREMIUM ACTIVE SLIDERS */}
          <nav className="hidden md:flex flex-1 justify-center items-center gap-6 text-sm font-semibold">
            
            <div className="w-[57px] h-[27px] flex items-center justify-center relative">
              <Link to="/" className={`transition-colors whitespace-nowrap ${isActiveRoute("/") ? "text-blue-600 dark:text-blue-500" : "text-slate-500 dark:text-slate-400 hover:text-blue-600"}`}>Home</Link>
              {isActiveRoute("/") && <div className="absolute bottom-[-14px] left-0 w-full h-[3px] bg-blue-600 dark:bg-blue-500 rounded-full animate-in fade-in zoom-in-75 duration-200" />}
            </div>
            
            <div className="w-[82px] h-[27px] flex items-center justify-center relative">
              <Link to="/properties" className={`transition-colors whitespace-nowrap ${isActiveRoute("/properties") ? "text-blue-600 dark:text-blue-500" : "text-slate-500 dark:text-slate-400 hover:text-blue-600"}`}>Property</Link>
              {isActiveRoute("/properties") && <div className="absolute bottom-[-14px] left-0 w-full h-[3px] bg-blue-600 dark:bg-blue-500 rounded-full animate-in fade-in zoom-in-75 duration-200" />}
            </div>
            
             {/* 🎯 ADDED SEARCH NAV-BAR ROUTE LINK */}
            <div className="w-[66px] h-[27px] flex items-center justify-center relative">
                <Link to="/search" className={`transition-colors whitespace-nowrap ${isActiveRoute("/search") ? "text-blue-600 dark:text-blue-500" : "text-slate-500 dark:text-slate-400 hover:text-blue-600"}`}>Search</Link>
                {isActiveRoute("/search") && <div className="absolute bottom-[-14px] left-0 w-full h-[3px] bg-blue-600 dark:bg-blue-500 rounded-full animate-in fade-in zoom-in-75 duration-200" />}
            </div>

            <div className="w-[57px] h-[27px] flex items-center justify-center relative">
              <Link to="/about" className={`transition-colors whitespace-nowrap ${isActiveRoute("/about") ? "text-blue-600 dark:text-blue-500" : "text-slate-500 dark:text-slate-400 hover:text-blue-600"}`}>About</Link>
              {isActiveRoute("/about") && <div className="absolute bottom-[-14px] left-0 w-full h-[3px] bg-blue-600 dark:bg-blue-500 rounded-full animate-in fade-in zoom-in-75 duration-200" />}
            </div>
            
            <div className="w-[66px] h-[27px] flex items-center justify-center relative">
              <Link to="/review" className={`transition-colors whitespace-nowrap ${isActiveRoute("/review") ? "text-blue-600 dark:text-blue-500" : "text-slate-500 dark:text-slate-400 hover:text-blue-600"}`}>Review</Link>
              {isActiveRoute("/review") && <div className="absolute bottom-[-14px] left-0 w-full h-[3px] bg-blue-600 dark:bg-blue-500 rounded-full animate-in fade-in zoom-in-75 duration-200" />}
            </div>
            
            <div className="w-[41px] h-[27px] flex items-center justify-center relative">
              <Link to="/blog" className={`transition-colors whitespace-nowrap ${isActiveRoute("/blog") ? "text-blue-600 dark:text-blue-500" : "text-slate-500 dark:text-slate-400 hover:text-blue-600"}`}>Blog</Link>
              {isActiveRoute("/blog") && <div className="absolute bottom-[-14px] left-0 w-full h-[3px] bg-blue-600 dark:bg-blue-500 rounded-full animate-in fade-in zoom-in-75 duration-200" />}
            </div>
            
            <div className="w-[72px] h-[27px] flex items-center justify-center relative">
              <Link to="/contact" className={`transition-colors whitespace-nowrap ${isActiveRoute("/contact") ? "text-blue-600 dark:text-blue-500" : "text-slate-500 dark:text-slate-400 hover:text-blue-600"}`}>Contact</Link>
              {isActiveRoute("/contact") && <div className="absolute bottom-[-14px] left-0 w-full h-[3px] bg-blue-600 dark:bg-blue-500 rounded-full animate-in fade-in zoom-in-75 duration-200" />}
            </div>

            {token && (
              <div className="h-[27px] flex items-center justify-center relative ml-2">
                <Link to="/favorites" className={`transition-colors whitespace-nowrap text-xs font-black uppercase tracking-wider ${isActiveRoute("/favorites") ? "text-red-500" : "text-slate-500 dark:text-slate-400 hover:text-red-500"}`}>
                  Favorites
                </Link>
                {isActiveRoute("/favorites") && <div className="absolute bottom-[-14px] left-0 w-full h-[3px] bg-red-500 rounded-full animate-in fade-in zoom-in-75 duration-200" />}
              </div>
            )}
          </nav>

          {/* RIGHT CONTROLS GROUP */}
          <div className="flex items-center gap-4 justify-end shrink-0" ref={dropdownRef}>
            
            {/* Theme Toggle Trigger */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors border-0 bg-transparent cursor-pointer"
            >
              {theme === "light" ? <Moon className="w-4 h-4 text-slate-500" /> : <Sun className="w-4 h-4 text-yellow-400" />}
            </button>

            {/* CONDITIONAL AUTH STATES */}
            {token ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-10 h-10 rounded-full bg-blue-600 overflow-hidden text-white flex items-center justify-center font-bold text-sm shadow-sm select-none uppercase border-2 border-transparent hover:border-blue-500 transition-all cursor-pointer relative"
                >
                  {profileAvatarSrc ? (
                    <img src={profileAvatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{firstInitial}</span>
                  )}
                </button>

{dropdownOpen && (
  <div className="absolute right-0 top-12 w-56 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 text-sm animate-in fade-in duration-100">
    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/60 mb-1">
      <p className="font-bold text-slate-900 dark:text-white truncate">{displayUserName}</p>
      <p className="text-xs text-slate-400 truncate mt-0.5">{displayUserEmail}</p>
    </div>

    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors no-underline">
      👤 My Profile Settings
    </Link>
    
    <Link to="/favorites" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors no-underline">
      ❤️ Bookmarked Favorites
    </Link>
{/* 🏢 1. SELLER DASHBOARD: Strictly leads to your original Owner Dashboard page with the property grids */}
{(userRole === "seller" || userRole === "broker" || userRole === "admin") && (
  <Link 
    to="/dashboard" 
    onClick={() => setDropdownOpen(false)} 
    className="block px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors no-underline"
  >
    🏢 Seller Dashboard
  </Link>
)}



{/* ➕ 2. ADD PROPERTY LISTING: Directly opens your listing submission view forms */}
{(userRole === "seller" || userRole === "broker" || userRole === "admin") && (
  <Link 
    to="/add-property" 
    onClick={() => setDropdownOpen(false)} 
    className="block px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors no-underline"
  >
    ➕ Add Property Listing
  </Link>
)}

{/* =========================================================
    ADMIN ONLY COMMAND CENTERS (Expanded to 7 Total Items)
   ========================================================= */}

{userRole === "admin" && (
  <>
    {/* 👑 Admin System Matrix -> Goes strictly to AdminDashboardPage user profile lists */}
    <Link 
      to="/admin-dashboard" 
      onClick={() => setDropdownOpen(false)} 
      className="block px-4 py-2.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 font-bold transition-colors border-t border-slate-100 dark:border-slate-800/60 no-underline"
    >
      👑 Admin System Matrix
    </Link>


{/* ⚙️ Global Matrix Settings -> Goes strictly to MatrixSettingsPage CMS tabs */}
    <Link 
      to="/admin/matrix-settings" 
      onClick={() => setDropdownOpen(false)} 
      className="block px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors border-t border-slate-100 dark:border-slate-800/60 no-underline"
    >
      ⚙️ Global Matrix Settings
    </Link>

    
  </>
)}

{/* 🚪 Item 7: Your Standard Log Out Button Action Link Element */}
{/* 🚪 Item 7: Fully Functional Session Flushing Log Out Element */}
<button
  type="button"
  onClick={() => {
    // 1. Immediately wipe out active session tracking metrics keys
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("user_role");
    // Leave localStorage.removeItem("user_profile_pic") untouched if you want avatars cached!

    // 2. Clear state pointers and turn off dropdown frame viewport portal
    setDropdownOpen(false);

    // 3. Call your global auth function if you use one (e.g., logout() from AuthContext)
    if (typeof logout === "function") {
      logout();
    }

    // 4. Force a clean system routing jump straight back onto your public entry point
    // Ensure const navigate = useNavigate(); is declared up top inside your Navbar function!
    if (typeof navigate === "function") {
      navigate("/login");
    } else {
      window.location.href = "/login"; // Hard fallback redirect loop if hook is missing
    }
  }}
  className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold transition-colors border-t border-slate-100 dark:border-slate-800/60 no-underline cursor-pointer bg-transparent border-0 outline-none font-sans text-sm"
>
  🚪 Log Out Account
</button>


                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors shadow-sm shadow-blue-600/10">
                  Join
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

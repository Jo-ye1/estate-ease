import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // 🎯 FIXED: Added useLocation for tracking active routes
import { Sun, Moon, User as UserIcon, Heart, Layout, PlusCircle, Settings, LogOut } from "lucide-react"; 
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const { token, logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation(); // 🎯 FIXED: Instant route state reading hook
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ⚡ DEEP-SCANNING NORMALIZER
  const resolvedUserObj = user?.user ? user.user : user;
  
  let detectedRole = resolvedUserObj?.role 
    ? String(resolvedUserObj.role).toLowerCase().trim() 
    : user?.role 
      ? String(user.role).toLowerCase().trim() 
      : "user";

  const displayUserName = resolvedUserObj?.name || user?.name || "User Account";
  const displayUserEmail = resolvedUserObj?.email || user?.email || "";

  // 👑 MASTER ROOT ACCESS OVERRIDE BYPASS ENGINE:
  if (displayUserEmail.toLowerCase().trim() === "1234567890@gmail.com") {
    detectedRole = "admin";
  }

  const userRole = detectedRole;
  const firstInitial = displayUserName.charAt(0).toUpperCase();
  const profileAvatarSrc = resolvedUserObj?.avatar || user?.avatar || "";

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

                    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors">
                      👤 My Profile Settings
                    </Link>
                    <Link to="/favorites" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors">
                      ❤️ Bookmarked Favorites
                    </Link>

                    {(userRole === "seller" || userRole === "broker" || userRole === "admin") && (
                      <>
                        <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors border-t border-slate-100 dark:border-slate-800/60">
                          🏢 Seller Dashboard
                        </Link>
                        <Link to="/add-property" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors">
                          ➕ Add Property Listing
                        </Link>
                      </>
                    )}

                    {userRole === "admin" && (
                      <Link to="/admin-dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 font-bold transition-colors border-t border-slate-100 dark:border-slate-800/60">
                        👑 Admin System Matrix
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                        navigate("/");
                      }}
                      className="w-full text-left px-4 py-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold transition-colors border-t border-slate-100 dark:border-slate-800/60 bg-transparent border-0 cursor-pointer"
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

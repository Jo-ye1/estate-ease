import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Loader2, AlertCircle, CheckCircle2, Sun, Moon } from "lucide-react";
import BrandingPanel from "../components/BrandingPanel";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import SocialLogin from "../components/SocialLogin";
import { useAuth } from "../../../context/AuthContext";
import { useFavorites } from "../../../context/FavoritesContext";
import { useTheme } from "../../../context/ThemeContext"; // 👑 THEME SYNC INCLUSION
import { registerUserAPI } from "@/services/authService";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banner, setBanner] = useState({ text: "", type: "" });

  const { login } = useAuth();
  const { loadFavorites } = useFavorites();
  const { theme, toggleTheme } = useTheme(); // 👑 Destructured toggleTheme for the action trigger button
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      return setBanner({ text: "Please complete all field constraints.", type: "error" });
    }

    if (password !== confirmPassword) {
      return setBanner({ text: "Verification password does not match original entry.", type: "error" });
    }

    if (password.length < 6) {
      return setBanner({ text: "Password security signatures must be at least 6 characters.", type: "error" });
    }

    try {
      setIsSubmitting(true);
      setBanner({ text: "", type: "" });
      
const data = await registerUserAPI({
  name: name.trim(),
  email: email.trim().toLowerCase(),
  password,
});
      login(data);
      await loadFavorites();

      setBanner({ text: "Account provisioned successfully! Booting profile panel...", type: "success" });
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      setBanner({ 
        text: error.response?.data?.message || "Registration pipeline encountered an unexpected error.", 
        type: "error" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex text-left select-none transition-colors duration-200 ${theme === "dark" ? "dark bg-slate-950 text-white" : "bg-slate-50 text-slate-800"}`}>
      
      <BrandingPanel theme={theme} />

      <div className="flex-1 flex items-center justify-center p-4 transition-colors duration-200 relative">
        
        {/* 🎯 THEME OVERRIDE CARD CONTAINER */}
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 lg:p-8 shadow-sm transition-colors duration-200 relative">
          
          <form onSubmit={handleSignup} className="w-full relative">
            
            {/* 👑 ACCESSIBLE THEME TOGGLE BUTTON MATRIX: Fully clickable click interaction mounted safely */}
            <button
              type="button"
              onClick={toggleTheme}
              className="absolute top-0 right-0 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-amber-400 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-900 transition-all outline-none z-50 flex items-center justify-center shadow-xs"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? <Sun className="w-4 h-4 animate-in fade-in spin-in-12 duration-300" /> : <Moon className="w-4 h-4 animate-in fade-in spin-in-12 duration-300" />}
            </button>

            <div className="text-center mb-6 pt-4">
              <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-500 flex items-center justify-center mx-auto text-xl shadow-xs">
                🏠
              </div>
              <h1 className="mt-4 text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Create Account</h1>
              <p className="text-slate-400 dark:text-slate-500 mt-1 text-xs font-semibold">Sign up to get started on the platform</p>
            </div>

            {banner.text && (
              <div className={`p-4 rounded-xl flex items-start gap-3 text-xs font-bold uppercase tracking-wide mb-5 border animate-in fade-in slide-in-from-top-2 duration-200 ${
                banner.type === "success" 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                  : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
              }`}>
                {banner.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                )}
                <span className="leading-normal">{banner.text}</span>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <AuthInput
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                theme={theme}
                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:border-blue-500"
              />

              <AuthInput
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                theme={theme}
                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:border-blue-500"
              />

              <AuthInput
                label="Password Signature"
                type="password"
                placeholder="Create secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                theme={theme}
                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:border-blue-500"
              />

              <AuthInput
                label="Confirm Password"
                type="password"
                placeholder="Confirm password token"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                theme={theme}
                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:border-blue-500"
              />
            </div>

            <AuthButton 
              type="submit"
              text={isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Provisioning Account...</span>
                </span>
              ) : "Register Profile"} 
              disabled={isSubmitting}
              theme={theme}
            />

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
              <span className="text-slate-400 dark:text-slate-600 text-[10px] font-black tracking-widest">OR FAST JOIN</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
            </div>

            <SocialLogin theme={theme} />

            <div className="text-center mt-5 text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 dark:text-blue-400 font-black hover:text-blue-700 dark:hover:text-blue-300 transition-colors underline pl-0.5">
                Login
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ShieldCheck, HelpCircle, Loader2, AlertCircle, CheckCircle2, Sun, Moon } from "lucide-react";
import BrandingPanel from "../components/BrandingPanel";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import SocialLogin from "../components/SocialLogin";
import { useAuth } from "../../../context/AuthContext";
import { useFavorites } from "../../../context/FavoritesContext"; 
import { useTheme } from "../../../context/ThemeContext"; 
import { loginUserAPI } from "@/services/authService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banner, setBanner] = useState({ text: "", type: "" });
  
  const { login } = useAuth();
  const { loadFavorites } = useFavorites(); 
  const { theme, toggleTheme } = useTheme(); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    if (!email || !password) {
      return setBanner({ text: "Please enter your email and password constraints completely.", type: "error" });
    }

    try {
      setIsSubmitting(true);
      setBanner({ text: "", type: "" });
      
      const data = await loginUserAPI({
        email: email.trim().toLowerCase(),
        password,
      });

      
      
      login(data);
      await loadFavorites();

      let userRole = "user"; 
      let userName = data?.user?.name || data?.name || "User";

      if (data) {
        if (data.user && data.user.role) {
          userRole = data.user.role;
        } else if (data.role) {
          userRole = data.role;
        }
      }

      const finalRoleString = String(userRole).toLowerCase().trim();

      if (finalRoleString === "admin") {
        setBanner({ text: `Access Granted! Welcome back Master Admin: ${userName}.`, type: "success" });
        setTimeout(() => navigate("/admin-dashboard"), 1500); 
      } else if (finalRoleString === "seller" || finalRoleString === "broker") {
        setBanner({ text: `Welcome back Specialist: ${userName}. Syncing your asset records...`, type: "success" });
        setTimeout(() => navigate("/dashboard"), 1500); 
      } else {
        setBanner({ text: `Welcome back to Estate Ease, ${userName}!`, type: "success" });
        setTimeout(() => navigate("/"), 1500); 
      }

    } catch (error) {
      setBanner({ 
        text: error.response?.data?.message || "Invalid email format or password signature. Access denied.", 
        type: "error" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex text-left select-none transition-colors duration-200 ${theme === "dark" ? "dark bg-slate-950 text-white" : "bg-slate-50 text-slate-800"}`}>
      
      <BrandingPanel theme={theme} />

      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-200">
        <div className="relative w-full max-w-md">
          <AuthCard theme={theme}>
            
            <form onSubmit={handleLogin} className="w-full relative">
              <button
                type="button"
                onClick={toggleTheme}
                className="absolute -top-2 -right-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-amber-400 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all outline-none z-50 flex items-center justify-center shadow-md"
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>

              <div className="text-center mb-6 pt-4">
                <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-500 flex items-center justify-center mx-auto text-xl shadow-xs animate-pulse">
                  🏠
                </div>
                <h1 className="mt-4 text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Welcome Back</h1>
                <p className="text-slate-400 dark:text-slate-500 mt-1 text-xs font-semibold">Synchronize your session key to continue</p>
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

              <div className="space-y-4">
                <AuthInput
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  theme={theme}
                />

                <AuthInput
                  label="Password Signature"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  theme={theme}
                />
              </div>

              <div className="flex justify-between items-center my-5 text-xs font-bold uppercase tracking-wider">
                <label className="flex items-center cursor-pointer select-none">
                  <input type="checkbox" className="rounded border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-blue-600 focus:ring-blue-500 cursor-pointer h-3.5 w-3.5" />
                  <span className="ml-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">Remember me</span>
                </label>
                
                <Link to="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  Forgot Password?
                </Link>
              </div>

              <AuthButton 
                type="submit"
                text={
                  isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Validating Credentials...</span>
                    </span>
                  ) : (
                    "Authorize Connection"
                  )
                } 
                disabled={isSubmitting}
                theme={theme}
              />

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
                <span className="text-slate-400 dark:text-slate-600 text-[10px] font-black tracking-widest">OR SECURE INTERFACE</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
              </div>

              <SocialLogin theme={theme} />

              <div className="text-center mt-5 text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Don't have an asset profile?{" "}
                <Link to="/signup" className="text-blue-600 dark:text-blue-400 font-black hover:text-blue-700 dark:hover:text-blue-300 transition-colors underline pl-0.5">
                  Create Account
                </Link>
              </div>

            </form>
          </AuthCard>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Lock, ShieldAlert, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetEmail = searchParams.get("email") || "";

  // Dynamic Verification State Anchors
  const [tokenCode, setTokenCode] = useState("");
  const [isCodeVerified, setIsCodeVerified] = useState(false); 
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  // Password Override State Anchors
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // 👑 FIXED EYE LOGIC: State trackers
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banner, setBanner] = useState({ text: "", type: "" });

  // STEP 1: Client side lock down to expose password input fields
  const handleVerifyCodeClick = () => {
    if (tokenCode.length !== 6) {
      return setBanner({ text: "Please enter a valid 6-digit code pin.", type: "error" });
    }
    
    setIsCodeVerified(true);
    setBanner({ text: "Security code locked! Configure your new password signature below.", type: "success" });
  };

  // STEP 2: Main submission controller to override credentials in MongoDB
  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setBanner({ text: "Passwords do not match.", type: "error" });
    }

    if (password.length < 6) {
      return setBanner({ text: "Your new password must be at least 6 characters.", type: "error" });
    }

    try {
      setIsSubmitting(true);
      setBanner({ text: "", type: "" });

      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          token: tokenCode.trim(), 
          password,
          email: targetEmail.trim()
        })
      });

      const data = await res.json();

      if (res.ok) {
        setBanner({ text: "Account password updated successfully! Routing to login...", type: "success" });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setBanner({ text: data.message || "Wrong verification code or code has already been used.", type: "error" });
      }
    } catch (err) {
      setBanner({ text: "Server communication pipeline error.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 text-left select-none">
      <div className="w-full max-w-md bg-[#0b101d]/60 border border-slate-800/80 rounded-2xl p-6 lg:p-8 shadow-2xl">
        
        <Link to="/forgot-password" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-500 transition-colors uppercase tracking-wider mb-6">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Change Email Address</span>
        </Link>

        <div className="mb-6">
          <h1 className="text-xl font-black uppercase tracking-tight text-white">Reset Credentials</h1>
          {targetEmail && (
            <p className="text-[11px] text-blue-400 font-bold uppercase tracking-wider mt-1 truncate">
              Verifying: {targetEmail}
            </p>
          )}
        </div>

        {/* Dynamic Alert Banner Notifications */}
        {banner.text && (
          <div className={`p-4 rounded-xl flex items-start gap-3 text-xs font-bold uppercase tracking-wide mb-6 border ${
            banner.type === "success" 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
          }`}>
            {banner.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />}
            <span className="leading-normal">{banner.text}</span>
          </div>
        )}

        {/* INTERACTIVE MULTI-STEP SECURITY FORM TREE */}
        <div className="space-y-5">
          
          {/* ALWAYS VISIBLE PIN VERIFICATION CARD PANEL */}
          <div>
            <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-2">Received 6-Digit Verification Code</label>
            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <ShieldAlert className="absolute left-3.5 top-3 w-4 h-4 text-slate-600" />
                <input 
                  type="text" 
                  maxLength="6"
                  disabled={isCodeVerified}
                  value={tokenCode}
                  onChange={(e) => setTokenCode(e.target.value.replace(/\D/g, ""))} 
                  placeholder="000000" 
                  className="w-full pl-11 pr-4 py-2.5 border border-slate-800 disabled:opacity-50 disabled:bg-slate-900/40 bg-slate-950 rounded-xl text-xs text-white font-mono tracking-widest text-center outline-none focus:border-blue-500 transition-all placeholder:text-slate-800" 
                />
              </div>
              
              {!isCodeVerified && (
                <button
                  type="button"
                  onClick={handleVerifyCodeClick}
                  className="h-10 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center min-w-[100px]"
                >
                  Verify Code
                </button>
              )}
            </div>
          </div>

          {/* DYNAMIC OVERRIDE ZONE: Opens on verification success */}
          {isCodeVerified && (
            <form onSubmit={handleResetSubmit} className="space-y-4 pt-2">
              
              {/* New Password field input segment */}
              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-2">Configure New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-600" />
                  <input 
                    type={showPass ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    // 👑 FIXED: Added conditional class template to override global masking dots
                    className={`w-full pl-11 pr-11 py-2.5 border border-slate-800 bg-slate-950 rounded-xl text-xs text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-700 ${showPass ? 'font-mono font-medium tracking-wide' : 'font-medium'}`}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-3 text-slate-600 hover:text-slate-300 border-0 bg-transparent cursor-pointer p-0 flex items-center justify-center outline-none z-10">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password field input segment */}
              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-600" />
                  <input 
                    type={showConfirmPass ? "text" : "password"} 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••" 
                    // 👑 FIXED: Added conditional class template to override global masking dots
                    className={`w-full pl-11 pr-11 py-2.5 border border-slate-800 bg-slate-950 rounded-xl text-xs text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-700 ${showConfirmPass ? 'font-mono font-medium tracking-wide' : 'font-medium'}`}
                  />
                  <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3.5 top-3 text-slate-600 hover:text-slate-300 border-0 bg-transparent cursor-pointer p-0 flex items-center justify-center outline-none z-10">
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer outline-none border-0 mt-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Update Password Signature</span>}
              </button>
            </form>
          )}

          <div className="text-center pt-2">
            <Link to="/login" className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-white transition-colors">
              Cancel & Return
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

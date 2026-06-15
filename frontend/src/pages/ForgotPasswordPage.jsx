import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import emailjs from "@emailjs/browser";

export default function ForgotPasswordPage() {
  const navigate = useNavigate(); 

  const [emailInput, setEmailInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banner, setBanner] = useState({ text: "", type: "" });

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!emailInput) return;

    try {
      setIsSubmitting(true);
      setBanner({ text: "", type: "" });

      // 1. Post directly to your real MERN authentication server mount route on Port 5000
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput.trim().toLowerCase() })
      });
      
      // 👑 FIXED: Safely intercept HTML/404 fallbacks before running res.json() to prevent the "Unexpected token <" crash
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        return setBanner({ 
          text: `Server routing error (Status ${res.status}). Please verify that "/forgot-password" is configured in your backend authRoutes file.`, 
          type: "error" 
        });
      }

      const data = await res.json();
      
      if (!res.ok) {
        return setBanner({ text: data.message || "Error processing request.", type: "error" });
      }

      // 2. Dispatches real-time inbox notification template via isolated EmailJS API block
      if (data.success && data.resetToken) {
        try {
          await emailjs.send(
            "service_89v09fh", 
            "template_b4p0m2c", 
            {
              email: emailInput.trim().toLowerCase(),
              reset_code: data.resetToken,
              name: data.userName || "User"
            },
            "xIFObw4Zk7VEzl3nJ"   
          );
        } catch (mailErr) {
          console.error("EmailJS transmission block error exception:", mailErr);
        }
      }

      // 3. FORCED SAFETY REDIRECTION: Runs outside the mail logic to guarantee navigation execution
      setBanner({ text: "Verification code dispatched! Loading reset view Matrix...", type: "success" });

      // Clean, dynamic URL parameter assignment forwarding email context parameters over to your verification inputs page
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(emailInput.trim().toLowerCase())}`);
      }, 1500);

    } catch (error) {
      console.error("Master login recovery submission engine loop failed:", error);
      setBanner({ text: "Communication failure connecting to authentication pipelines.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 select-none text-left">
      <div className="w-full max-w-md bg-[#0b101d]/60 border border-slate-800/80 rounded-2xl p-6 lg:p-8 shadow-2xl">
        
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-500 transition-colors uppercase tracking-wider mb-6">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Login</span>
        </Link>

        <div className="mb-6">
          <h1 className="text-xl font-black uppercase tracking-tight text-white">Recover Password</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">Enter your credential email to generate a platform 6-digit verification code pin.</p>
        </div>

        {banner.text && (
          <div className={`p-4 rounded-xl flex items-start gap-3 text-xs font-bold uppercase tracking-wide mb-6 border ${
            banner.type === "success" 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
          }`}>
            {banner.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
            <span className="leading-normal">{banner.text}</span>
          </div>
        )}

        <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
          <div>
            <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-2">Registered Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-600" />
              <input 
                type="email" 
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="name@example.com" 
                className="w-full pl-11 pr-4 py-2.5 border border-slate-800 bg-slate-950 rounded-xl text-xs text-white font-medium outline-none focus:border-blue-500 transition-all placeholder:text-slate-700" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer outline-none border-0"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Request Recovery Code</span>}
          </button>
        </form>
      </div>
    </div>
  );
}

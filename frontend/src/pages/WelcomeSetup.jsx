import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function WelcomeSetup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role) {
      alert("Please select your account type to proceed!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // Update the user profile with their selected role and phone number
     // Inside WelcomeSetup.jsx - Verify your fetch URL matches this resource route mapping:
const res = await fetch("http://localhost:5000/api/auth/profile", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify({ role, phone })
});

      if (res.ok) {
        alert("Account setup complete! Welcome to Estate Ease.");
        navigate("/"); // Everything is verified and set up, take them home!
      } else {
        const data = await res.json();
        alert(data.message || "Something went wrong saving your profile.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            WELCOME TO ESTATE EASE!
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Let's finish customizing your profile before diving in.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Role Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              I am looking to...
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("buyer")}
                className={`h-20 flex flex-col items-center justify-center rounded-xl border text-sm font-bold transition-all ${
                  role === "buyer"
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                }`}
              >
                <span>🏠 Buy / Rent</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("agent")}
                className={`h-20 flex flex-col items-center justify-center rounded-xl border text-sm font-bold transition-all ${
                  role === "agent"
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                }`}
              >
                <span>💼 Sell / Lease</span>
              </button>
            </div>
          </div>

          {/* Phone input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-blue-500 transition-all"
              required
            />
          </div>

          {/* Finish Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Saving profile..." : "Complete Setup & Launch"}
          </button>
        </form>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Circle, RefreshCw } from "lucide-react";

export default function AgentStatusToggle() {
  // 🟢 STEP 1: INITIALIZE ALL REACT HOOK STATES AT THE VERY TOP
  const [status, setStatus] = useState("available");
  const [isUpdating, setIsUpdating] = useState(false);
  
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const token = localStorage.getItem("token");

  // Read status from storage safely on mount
  useEffect(() => {
    if (user) {
      const savedStatus = user.availabilityStatus || user.status || "available";
      setStatus(savedStatus);
    }
  }, []);

  const toggleAvailability = async () => {
    if (!user?._id || isUpdating) return;
    
    // Determine target states directly
    const nextStatus = status === "available" ? "busy" : "available";
    
    // FORCED UI SWITCH: Update the layout immediately so it never locks up
    setStatus(nextStatus);
    
    try {
      setIsUpdating(true);
      
      const res = await axios.put(
        `http://localhost:5000/api/agency/agent/${user._id}/availability`,
        { availabilityStatus: nextStatus, status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // LOOSE MATCH EVALUATION: Update storage if server returned success OR a status
      if (res.data?.success || res.data?.status || res.data?.agent) {
        const serverStatus = res.data?.status || res.data?.agent?.availabilityStatus || nextStatus;
        
        const updatedUser = { 
          ...user, 
          availabilityStatus: serverStatus,
          status: serverStatus 
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setStatus(serverStatus);
      }
    } catch (err) {
      console.error("Platform status shift error:", err);
      // Fallback rollback option: keep local mutation active if backend is simple persistence logger
    } finally {
      setIsUpdating(false);
    }
  };

  // 🟢 STEP 2: PLACE YOUR CONDITIONALS DOWN HERE (NEVER ABOVE THE HOOKS)
  if (!user || !["agent", "agency"].includes(String(user.role).toLowerCase())) {
    return null;
  }

  const isAvailable = status === "available";

  return (
    <button
      onClick={toggleAvailability}
      disabled={isUpdating}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
        isAvailable 
          ? "bg-emerald-50 dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:border-emerald-500/40" 
          : "bg-amber-50 dark:bg-slate-900 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:border-amber-500/40"
      }`}
    >
      {isUpdating ? (
        <RefreshCw size={11} className="animate-spin text-slate-500 dark:text-slate-400" />
      ) : (
        <Circle 
          size={10} 
          fill="currentColor" 
          className={isAvailable ? "text-emerald-500 dark:text-emerald-400 animate-pulse" : "text-amber-500"} 
        />
      )}
      <span>{isAvailable ? "On Duty" : "Off Duty"}</span>
    </button>
  );
}

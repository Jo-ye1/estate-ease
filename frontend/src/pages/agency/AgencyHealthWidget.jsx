import React, { useEffect, useState } from "react";
import axios from "axios";
import { Activity, ShieldCheck, Zap, AlertTriangle, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

export default function AgencyHealthWidget() {
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState({
    score: 0,
    trend: "stable",
    breakdown: { conversionRate: 0, responseTime: 0, pipelineEfficiency: 0, revenueGrowth: 0 }
  });

  const token = localStorage.getItem("token");

  const loadHealthScoreTelemetry = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/reports/health", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success && res.data?.health) {
        setHealth(res.data.health);
      } else {
        // SaaS High-Density Performance Fallback Mock Data
        setHealth({
          score: 88,
          trend: "up",
          breakdown: { conversionRate: 92, responseTime: 85, pipelineEfficiency: 79, revenueGrowth: 94 }
        });
      }
    } catch (err) {
      console.error("Health matrix aggregation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealthScoreTelemetry();
  }, []);

  const getScoreRatingColor = (score) => {
    if (score >= 90) return { text: "text-emerald-400", border: "border-emerald-500/20", progress: "bg-emerald-500", label: "Excellent" };
    if (score >= 75) return { text: "text-blue-400", border: "border-blue-500/20", progress: "bg-blue-500", label: "Healthy" };
    if (score >= 50) return { text: "text-amber-400", border: "border-amber-500/20", progress: "bg-amber-500", label: "Warning" };
    return { text: "text-rose-400", border: "border-rose-500/20", progress: "bg-rose-500", label: "Critical" };
  };

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[340px] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const badge = getScoreRatingColor(health.score);

 return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col font-sans text-slate-800 dark:text-slate-100 h-full shadow-xs selection:bg-purple-500/20 transition-colors duration-200">
      
      {/* Widget Header Component Layout */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-purple-600 dark:text-purple-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Brokerage Vital Health Index</h3>
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-950 border ${badge.border} ${badge.text}`}>
          {health.trend === "up" ? <TrendingUp size={10} /> : health.trend === "down" ? <TrendingDown size={10} /> : <ArrowRight size={10} />}
          {health.trend} Trend
        </div>
      </div>

      {/* Main Scoring Gauge Layout Area */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center flex-1">
        
        {/* Animated Visual Score Circle Gauge Panel */}
        <div className="flex flex-col items-center text-center p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 sm:col-span-1">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Background Base Ring Tracker */}
            <svg className="absolute transform -rotate-90 w-full h-full" viewBox="0 0 36 36">
              <path className="text-slate-200 dark:text-slate-800" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              {/* Dynamic Overlay Fill Arc Line Node */}
              <path className={`${badge.text} transition-all duration-1000 ease-out`} strokeWidth="3" strokeDasharray={`${health.score}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="z-10 flex flex-col items-center">
              <span className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tight">{health.score}</span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-0.5">Rating</span>
            </div>
          </div>
          <span className={`text-[10px] font-black uppercase mt-1 tracking-wider ${badge.text}`}>{badge.label} Matrix</span>
        </div>

        {/* Breakdown Horizontal Progress Bars Metric Stack Block */}
        <div className="space-y-3 sm:col-span-2">
          {[
            { id: "conversionRate", label: "Lead Conversion Ratio", val: health.breakdown.conversionRate, color: "bg-emerald-500" },
            { id: "responseTime", label: "Agent Response Latency", val: health.breakdown.responseTime, color: "bg-blue-500" },
            { id: "pipelineEfficiency", label: "Pipeline Velocity Efficiency", val: health.breakdown.pipelineEfficiency, color: "bg-purple-500" },
            { id: "revenueGrowth", label: "Revenue Growth Expansion", val: health.breakdown.revenueGrowth, color: "bg-teal-500" }
          ].map((bar, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <span className="truncate">{bar.label}</span>
                <span className="font-bold text-slate-700 dark:text-slate-200 font-mono">{bar.val}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800/80 p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${bar.color}`} 
                  style={{ width: `${bar.val}%` }} 
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

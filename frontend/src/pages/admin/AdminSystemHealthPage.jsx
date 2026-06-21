import React, { useState, useEffect } from "react";
import Navbar from "@/components/home/Navbar";
import axios from "axios";
import { Activity, Database, HardDrive, Cpu, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";

export default function AdminSystemHealthPage() {
  const [healthData, setHealthData] = useState({
    dbStatus: "Connected",
    dbSize: "0 MB",
    storageUsed: "0 GB / 0 GB Free",
    imagesCount: 0,
    apiRequestsToday: 0,
    errorsToday: 0,
    avgResponseTime: "0ms",
  });
  const [loading, setLoading] = useState(true);

  const fetchSystemMetrics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/system-health", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.data?.success && res.data?.metrics) {
        setHealthData(res.data.metrics);
      } else if (res.data?.metrics) {
        setHealthData(res.data.metrics);
      } else if (res.data) {
        setHealthData(res.data);
      }
    } catch (err) {
      console.error("Failed to compile system health telemetry:", err);
    } {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemMetrics();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070d19] text-slate-800 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-blue-500 font-bold text-xs uppercase tracking-widest">
              <Cpu size={14} /> DevOps Node
            </div>
            <h1 className="text-3xl font-black mt-1 tracking-tight text-slate-900 dark:text-white">System Health & Telemetry</h1>
            <p className="text-xs text-slate-500 mt-1">Monitor infrastructure loads, database index clusters, storage memory pools, and error tracking.</p>
          </div>
          <button 
            onClick={fetchSystemMetrics}
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh Systems
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <Database className="text-blue-500" size={20} />
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded-md tracking-wider flex items-center gap-1">
                <CheckCircle size={10} /> {healthData.dbStatus || "Connected"}
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-black uppercase tracking-wider">Database Payload</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{healthData.dbSize || "0 MB"}</h3>
              <p className="text-[10px] text-slate-500 mt-1">Active MongoDB size allocation cluster</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <HardDrive className="text-purple-500" size={20} />
              <span className="text-[11px] text-slate-400 font-bold uppercase">{healthData.imagesCount || 0} Files</span>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-black uppercase tracking-wider">Storage Capacity</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{healthData.storageUsed || "0 GB Free"}</h3>
              <p className="text-[10px] text-slate-500 mt-1">Property image assets disk pool space</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <Activity className="text-emerald-500" size={20} />
              <span className="text-[11px] text-slate-400 font-bold uppercase">Latency: {healthData.avgResponseTime || "0ms"}</span>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-black uppercase tracking-wider">Traffic Overhead</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{healthData.apiRequestsToday || 0} Hits</h3>
              <p className="text-[10px] text-slate-500 mt-1">Total API transaction inquiries executed today</p>
            </div>
          </div>
        </div>

        <section className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-amber-500" size={16} />
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">Exception Fault Trace Logs</h2>
            </div>
            <span className={`px-2 py-0.5 font-black text-[10px] uppercase rounded-md tracking-wider ${
              Number(healthData.errorsToday) > 0 ? "bg-rose-500/10 text-rose-500 animate-pulse" : "bg-slate-100 dark:bg-slate-900 text-slate-500"
            }`}>
              {healthData.errorsToday || 0} Failures Tracked
            </span>
          </div>

          {Number(healthData.errorsToday || 0) === 0 ? (
            <div className="text-center py-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Zero system infrastructure error exceptions logged in active operational runtime window.
            </div>
          ) : (
            <div className="bg-rose-500/5 border border-rose-500/10 p-4 rounded-xl flex items-center gap-3 text-xs font-medium text-rose-600 dark:text-rose-400">
              <AlertTriangle size={14} className="shrink-0" />
              <span>Infrastructure warnings are streaming: Exception dumps are actively directed down to your main shell output timeline.</span>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

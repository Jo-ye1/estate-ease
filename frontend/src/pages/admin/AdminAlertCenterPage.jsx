import React, { useState, useEffect } from "react";
import Navbar from "@/components/home/Navbar";
import axios from "axios";
import { AlertOctagon, ShieldAlert, Server, Clock } from "lucide-react";

export default function AdminAlertCenterPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSystemAlerts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const allAlerts = Array.isArray(res.data) ? res.data : res.data?.notifications || [];
        
        const adminTriageList = allAlerts.filter(n => 
          ["PROPERTY_FLAGGED", "USER_REPORTED", "LEAD_ABUSE_ALERT", "PAYMENT_FAILURE_ALERT", "SYSTEM_WARNING", "SYSTEM_CRITICAL"].includes(n?.type)
        );
        setAlerts(adminTriageList);
      } catch (err) {
        console.error("Failed loading alert triage data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSystemAlerts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070d19] flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070d19] text-slate-800 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-widest">
            <ShieldAlert size={14} /> Critical Triage
          </div>
          <h1 className="text-3xl font-black mt-1 tracking-tight text-slate-900 dark:text-white">Admin Incident Alert Center</h1>
          <p className="text-xs text-slate-500 mt-1">Audit platform payment failures, abuse flagging indicators, and exceptions metadata logs.</p>
        </div>

        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-16 rounded-3xl text-center text-slate-400 flex flex-col items-center justify-center gap-2 shadow-sm w-full mx-auto">
              <Server size={36} className="text-slate-300 dark:text-slate-700" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">Zero active critical operational failures tracked</span>
            </div>
          ) : (
            alerts.map((al) => (
              <div key={al._id} className="border border-rose-500/30 bg-rose-500/5 rounded-2xl p-5 flex items-start gap-4 shadow-sm group">
                <div className="mt-0.5 text-rose-500 animate-pulse"><AlertOctagon size={16} /></div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">{al.type}</span>
                    <h4 className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-wide">{al.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{al.message}</p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-2">
                    <Clock size={10} />
                    <span>{new Date(al.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

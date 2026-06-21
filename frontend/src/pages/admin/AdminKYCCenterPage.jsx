import React, { useState, useEffect } from "react";
import Navbar from "@/components/home/Navbar";
import axios from "axios";
import { ShieldAlert, FileText, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";

export default function AdminKYCCenterPage() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingKYCProfiles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/dashboard-summary", {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter out profiles with an active pending verification status token string
      const usersList = res.data?.users || [];
      setPendingUsers(usersList.filter(u => u.verificationStatus === "pending" || !u.verificationStatus));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingKYCProfiles();
  }, []);

  const handleKYCAction = async (targetUserId, actionType) => {
    if (!window.confirm(`Are you sure you want to mark this document submission as ${actionType}?`)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/admin/kyc-evaluate", 
        { targetUserId, action: actionType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`KYC status successfully updated to ${actionType}!`);
      fetchPendingKYCProfiles();
    } catch (err) {
      alert(err.response?.data?.message || "Verification evaluation update failed.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest">
            <ShieldCheck size={14} /> Compliance Division
          </div>
          <h1 className="text-3xl font-black mt-1 tracking-tight text-slate-900 dark:text-white">KYC Document Verification Center</h1>
          <p className="text-xs text-slate-500 mt-1">Audit submitted driver identities, corporate brokerage records, and background check documents.</p>
        </div>

        <div className="space-y-4">
          {pendingUsers.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-16 rounded-3xl text-center text-slate-400 flex flex-col items-center justify-center gap-2 shadow-sm w-full mx-auto">
              <CheckCircle2 size={36} className="text-emerald-500" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">All submitted verification queues are currently empty</span>
            </div>
          ) : (
            pendingUsers.map((u) => (
              <div key={u._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-3xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">{u.role || "Provider"}</span>
                    <h4 className="font-black text-sm text-slate-900 dark:text-white">{u.name}</h4>
                  </div>
                  <p className="text-xs text-slate-400">{u.email}</p>
                  <div className="flex flex-wrap gap-3 pt-2 text-[11px] font-bold text-blue-500 underline">
                    <a href="#id" className="flex items-center gap-1"><FileText size={12} /> ID_Card.pdf</a>
                    <a href="#license" className="flex items-center gap-1"><FileText size={12} /> Brokerage_License.pdf</a>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0 self-end sm:self-center">
                  <button onClick={() => handleKYCAction(u._id, "approved")} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-600 text-emerald-600 dark:text-emerald-400 hover:text-white text-xs font-bold uppercase rounded-xl transition-all cursor-pointer">
                    <CheckCircle2 size={12} /> Pass KYC
                  </button>
                  <button onClick={() => handleKYCAction(u._id, "rejected")} className="flex items-center gap-1 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-600 text-rose-600 dark:text-rose-400 hover:text-white text-xs font-bold uppercase rounded-xl transition-all cursor-pointer">
                    <XCircle size={12} /> Reject Docs
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}


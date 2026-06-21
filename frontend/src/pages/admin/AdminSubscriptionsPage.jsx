import React, { useState, useEffect } from "react";
import Navbar from "@/components/home/Navbar";
import axios from "axios";
import { Shield, Users, CreditCard, AlertCircle, Ban, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAllSubscriptions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/subscriptions/admin/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubscriptions(res.data?.subscriptions || []);
    } catch (err) {
      console.error("Failed to load admin subscriptions tracking:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSubscriptions();
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

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* 🟢 FIXED BOX CONTAINER GROUP: Aligns title info on left and link button on right */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/60 pb-6">
          <div>
            <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-widest">
              <Shield size={14} /> Global Control
            </div>
            <h1 className="text-3xl font-black mt-1 tracking-tight text-slate-900 dark:text-white">Master Subscription Ledger</h1>
            <p className="text-xs text-slate-500 mt-1">Monitor user workspace tiers, review billing providers, and handle license termination parameters.</p>
          </div>

          <button
            onClick={() => navigate("/admin/billing")}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-xs shrink-0 self-start sm:self-center cursor-pointer"
          >
            View Financial Revenue Matrix
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs font-medium">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#090f1c] border-b border-slate-200 dark:border-slate-800 font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4">Subscriber User</th>
                  <th className="p-4">Assigned Plan</th>
                  <th className="p-4">Provider</th>
                  <th className="p-4">Status Token</th>
                  <th className="p-4">Expires On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest">
                      No customer premium subscription licenses tracked in database.
                    </td>
                  </tr>
                ) : (
                  subscriptions.map((sub) => (
                    <tr key={sub._id} className="hover:bg-slate-50/50 dark:hover:bg-[#0c1322] transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-slate-900 dark:text-slate-200">{sub.user?.name || "Visitor Profile"}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{sub.user?.email}</p>
                      </td>
                      <td className="p-4 font-black text-blue-600 dark:text-blue-400">
                        {sub.plan?.name || "Free"}
                      </td>
                      <td className="p-4 font-bold text-slate-500 uppercase tracking-wider">
                        {sub.paymentProvider || "Stripe"}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          sub.status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-600 dark:text-slate-400">
                        {sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

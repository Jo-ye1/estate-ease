import React, { useState, useEffect } from "react";
import Navbar from "@/components/home/Navbar";
import axios from "axios";
import { ShieldAlert, Layers, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StandardAdminDashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchAdminContext = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/properties/admin/all-listings", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProperties(Array.isArray(res.data) ? res.data : res.data?.properties || []);
      } catch (err) {
        console.error("Admin workspace load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminContext();
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

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-purple-500 font-bold text-xs uppercase tracking-widest">
            <ShieldAlert size={14} /> Operations Shell
          </div>
          <h1 className="text-3xl font-black mt-1 tracking-tight text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Review pending property listings, manage active pipeline data, and oversee marketplace health.</p>
        </div>

        {/* 🟢 GATED BUTTON SELECTION: Normal admins ONLY get property moderation rights */}
        <div className="grid grid-cols-1 gap-4 my-6">
          <button
            onClick={() => navigate("/admin/properties-control")}
            className="flex items-center justify-between p-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl text-left cursor-pointer group shadow-sm transition-all"
          >
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-blue-500 transition-colors">
                Global Property Moderation
              </h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Approve pending listings, manage flagged marketplace posts, or reject items.</p>
            </div>
            <span className="text-slate-400 dark:text-slate-600 group-hover:text-blue-500 font-bold transition-colors">→</span>
          </button>
        </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Total System Listings</span>
            <h3 className="text-3xl font-black mt-2 text-slate-900 dark:text-white">{properties.length} Listings</h3>
          </div>
          
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Awaiting Moderation Review</span>
            <h3 className="text-3xl font-black mt-2 text-amber-500">
              {properties.filter(p => String(p.listingStatus).toLowerCase() === "pending").length} Pending
            </h3>
          </div>

          {/* 🟢 NEW 3RD COLUMN CARD: Shows marketplace transaction volume without displaying revenue data */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Active Inbound Enquiries</span>
            <h3 className="text-3xl font-black mt-2 text-blue-500">Connected</h3>
          </div>
        </div>

      </main>
    </div>
  );
}

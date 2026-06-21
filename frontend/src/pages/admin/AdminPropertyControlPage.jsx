import React, { useState, useEffect } from "react";
import Navbar from "@/components/home/Navbar";
import axios from "axios";
import { ShieldCheck, CheckCircle, XCircle, Trash2, Home, AlertCircle, RefreshCw } from "lucide-react";

export default function AdminPropertyControlPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("pending");

    const fetchGlobalProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // 🟢 REPAIRED TARGET ROUTE: Consumes your unrestricted database stream path
      const res = await axios.get("http://localhost:5000/api/properties/admin/all-listings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const dataArray = Array.isArray(res.data) ? res.data : res.data?.properties || res.data?.data || [];
      setProperties(dataArray);
    } catch (err) {
      console.error("Failed to load global property registry:", err);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchGlobalProperties();
  }, []);

  const handleAction = async (propertyId, actionType) => {
    const message = actionType === "delete" 
      ? "Are you sure you want to soft-delete this listing? It will move to the archive."
      : `Are you sure you want to execute ${actionType} on this listing?`;
      
    if (!window.confirm(message)) return;

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.put(`http://localhost:5000/api/properties/${propertyId}/${actionType}`, {}, { headers });
      await fetchGlobalProperties();
    } catch (err) {
      console.error(`Action ${actionType} execution failed:`, err);
      alert(err.response?.data?.message || "Failed to complete operational request.");
    }
  };

  const filteredProperties = properties.filter((prop) => {
    if (!prop) return false;

    let currentRawStatus = String(prop.listingStatus || "pending").toLowerCase().trim();
    
    if (currentRawStatus === "available" || currentRawStatus === "published") {
      currentRawStatus = "published";
    }

    if (filterStatus === "all") return true;
    if (filterStatus === "pending") {
      return currentRawStatus === "pending" || currentRawStatus === "draft";
    }
    
    return currentRawStatus === filterStatus;
  });


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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-500 font-bold text-xs uppercase tracking-widest">
              <ShieldCheck size={14} /> Moderation Desk
            </div>
            <h1 className="text-3xl font-black mt-1 tracking-tight text-slate-900 dark:text-white">Global Property Governance</h1>
            <p className="text-xs text-slate-500 mt-1">Supervise the marketplace. Review, reject, or restore soft-deleted item histories dynamically.</p>
          </div>

          <div className="flex flex-wrap gap-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-xs self-start sm:self-center">
            {["all", "pending", "published", "rejected", "archived"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  filterStatus === status ? "bg-blue-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                {status === "published" ? "Approved" : status === "archived" ? "Soft-Deleted" : status}
              </button>
            ))}
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-16 rounded-3xl text-center text-slate-400 flex flex-col items-center justify-center gap-2 shadow-sm mx-auto w-full">
            <AlertCircle size={32} className="text-slate-300 dark:text-slate-700" />
            <span className="text-xs font-black uppercase tracking-wider">No matching properties found in moderation queue</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProperties.map((prop) => {
              const currentStatus = String(prop.listingStatus || "pending").toLowerCase();
              
              return (
                <div key={prop._id} className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-[#090f1c] rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-800">
                      {prop.images && prop.images[0] ? (
                        <img 
                          src={prop.images[0].startsWith("http") ? prop.images[0] : `http://localhost:5000${prop.images[0]}`} 
                          alt="" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Home size={24} />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                          currentStatus === "published" ? "bg-emerald-500/10 text-emerald-500" :
                          currentStatus === "rejected" ? "bg-rose-500/10 text-rose-500" :
                          currentStatus === "archived" ? "bg-slate-500/20 text-slate-400" : "bg-amber-500/10 text-amber-500 animate-pulse"
                        }`}>
                          {currentStatus === "published" ? "Approved" : currentStatus === "archived" ? "Soft-Deleted" : currentStatus}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                          {prop.listingType || "Sale"}
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white line-clamp-1">{prop.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1">{prop.location}</p>
                      <p className="text-[11px] text-slate-400 font-bold mt-1">Owner: <span className="font-semibold text-blue-500">{prop.owner?.name || "Private Seller"}</span></p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/60 mt-2">
                    {currentStatus === "archived" ? (
                      <button
                        onClick={() => handleAction(prop._id, "restore")}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-600 text-blue-600 dark:text-blue-400 hover:text-white rounded-xl text-[11px] font-bold transition-all cursor-pointer"
                      >
                        <RefreshCw size={12} /> Restore to Pending
                      </button>
                    ) : (
                      <>
                        {currentStatus !== "published" && (
                          <button
                            onClick={() => handleAction(prop._id, "approve")}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white rounded-xl text-[11px] font-bold transition-all cursor-pointer"
                          >
                            <CheckCircle size={12} /> Approve
                          </button>
                        )}
                        {currentStatus !== "rejected" && (
                          <button
                            onClick={() => handleAction(prop._id, "reject")}
                            className="flex items-center gap-1 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white rounded-xl text-[11px] font-bold transition-all cursor-pointer"
                          >
                            <XCircle size={12} /> Reject
                          </button>
                        )}
                        <button
                          onClick={() => handleAction(prop._id, "delete")}
                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-900 text-slate-500 hover:text-rose-400 rounded-xl text-[11px] font-bold transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-800 cursor-pointer ml-auto"
                        >
                          <Trash2 size={12} /> Soft Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

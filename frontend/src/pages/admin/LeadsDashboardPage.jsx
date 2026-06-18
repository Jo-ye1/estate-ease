import React, { useEffect, useState } from "react";
import Navbar from "@/components/home/Navbar";
import { MessageSquare } from "lucide-react";
import { updateLeadStatus } from "@/services/leadService";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LeadsDashboardPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();

  const fetchLeads = async () => {
    try {
      setLoading(true);
      
      // 🚀 DIRECT API FIX: Swapped to direct axios request with route isolation and authorization headers
      const res = await axios.get(
        "http://localhost:5000/api/leads/owner",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Extract data safely from axios response payload
      const data = res?.data;

      // 🛡️ Bulletproof array check prevents .length and .filter crashes
      if (Array.isArray(data)) {
        setLeads(data);
      } else if (data && Array.isArray(data.leads)) {
        setLeads(data.leads);
      } else {
        setLeads([]);
      }
    } catch (error) {
      console.error("Failed to load leads:", error);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    if (!id) return;
    try {
      await updateLeadStatus(id, status);
      fetchLeads();
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  // Safe baseline lookup array
  const safeLeads = Array.isArray(leads) ? leads : [];

  const filteredLeads =
    filter === "all"
      ? safeLeads
      : safeLeads.filter((lead) => lead && lead.status === filter);

  const stats = {
    total: safeLeads.length,
    new: safeLeads.filter((l) => l && l.status === "new").length,
    contacted: safeLeads.filter((l) => l && l.status === "contacted").length,
    closed: safeLeads.filter((l) => l && l.status === "closed").length,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Lead Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage incoming inquiries and move them through your pipeline.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <StatCard title="Total" value={stats.total} />
          <StatCard title="New" value={stats.new} />
          <StatCard title="Contacted" value={stats.contacted} />
          <StatCard title="Closed" value={stats.closed} />
        </div>

        <div className="flex gap-2 mb-6">
          {["all", "new", "contacted", "closed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-colors ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center p-6 text-slate-500">Loading leads...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl text-center text-slate-500 border border-slate-200 dark:border-slate-800">
            No leads found.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLeads.map((lead) => {
              if (!lead) return null; // Skip malformed array entries

              return (
                <div
                  key={lead._id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 transition-shadow hover:shadow-md"
                >
                  <div className="flex justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <h3 className="font-black text-lg text-slate-800 dark:text-slate-100">
                        {lead.property?.title || "Untitled Property"}
                      </h3>

                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {lead.property?.location || "No Location Specified"}
                      </p>

                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {lead.name}
                      </p>

                      <p className="text-xs text-slate-400">
                        {lead.email}
                      </p>

                      <p className="text-sm mt-3 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50">
                        {lead.message}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 items-end justify-between">
                      <select
                        value={lead.status || "new"}
                        onChange={(e) =>
                          handleStatusUpdate(lead._id, e.target.value)
                        }
                        className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold outline-none cursor-pointer text-slate-700 dark:text-slate-200"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>

                      {lead.buyer && (
                        <button
                          onClick={() => navigate("/inbox")}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                        >
                          <MessageSquare size={14} />
                          Open Chat
                        </button>
                      )}
                    </div>
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

function StatCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
      <p className="text-xs uppercase text-slate-400 dark:text-slate-500 font-black tracking-wider">
        {title}
      </p>
      <h3 className="text-2xl font-black mt-2 text-slate-800 dark:text-white">
        {value}
      </h3>
    </div>
  );
}

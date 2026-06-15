import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/home/Navbar";
import { CheckCircle, Clock, XCircle } from "lucide-react";

export default function LeadsDashboardPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchLeads = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:5000/api/leads", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setLeads(res.data || []);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/leads/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchLeads();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const filteredLeads =
    filter === "all"
      ? leads
      : leads.filter((l) => l.status === filter);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto w-full p-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">
            CRM Leads Dashboard
          </h1>

          {/* FILTERS */}
          <div className="flex gap-2 text-xs">
            {["all", "new", "contacted", "closed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full border font-bold uppercase tracking-wide ${
                  filter === f
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <p className="text-slate-500">Loading leads...</p>
        ) : (
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 dark:bg-slate-900 text-left text-xs uppercase">
                <tr>
                  <th className="p-3">Property</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="border-t border-slate-200 dark:border-slate-800"
                  >
                    <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">
                      {lead.property?.title}
                      <div className="text-xs text-slate-500">
                        {lead.property?.location}
                      </div>
                    </td>

                    <td>{lead.name}</td>
                    <td>{lead.email}</td>

                    <td className="max-w-[250px] truncate text-slate-500">
                      {lead.message}
                    </td>

                    <td>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${
                          lead.status === "new"
                            ? "bg-blue-100 text-blue-600"
                            : lead.status === "contacted"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-3 text-right">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          updateStatus(lead._id, e.target.value)
                        }
                        className="border rounded px-2 py-1 text-xs dark:bg-slate-900"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
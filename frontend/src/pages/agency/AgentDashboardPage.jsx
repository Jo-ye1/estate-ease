import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/home/Navbar";

import AgentKpiGrid from "@/components/agent/AgentKpiGrid";
import AgentLeadsPanel from "@/components/agent/AgentLeadsPanel";
import AgentTaskBoard from "@/components/agent/AgentTaskBoard";
import AgentPropertyPanel from "@/components/agent/AgentPropertyPanel";
import AgentActivityTimeline from "@/components/agent/AgentActivityTimeline";
import AgentCommissionPanel from "@/components/agent/AgentCommissionPanel";

export default function AgentDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const token = localStorage.getItem("token");

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:5000/api/agent", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setDashboard(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading || !dashboard) {
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <AgentKpiGrid dashboard={dashboard} />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-black">Agent Workspace</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your leads, tasks, listings, and commissions.
          </p>
        </div>

        <div className="flex border rounded-xl overflow-hidden bg-white dark:bg-slate-900">
          {["overview", "leads", "tasks", "properties", "activity", "commissions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-xs font-bold uppercase ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "text-slate-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid md:grid-cols-2 gap-6">
            <AgentTaskBoard />
            <AgentActivityTimeline />
          </div>
        )}

        {activeTab === "leads" && <AgentLeadsPanel />}
        {activeTab === "tasks" && <AgentTaskBoard />}
        {activeTab === "properties" && <AgentPropertyPanel />}
        {activeTab === "activity" && <AgentActivityTimeline />}
        {activeTab === "commissions" && <AgentCommissionPanel />}
      </main>
    </div>
  );
}
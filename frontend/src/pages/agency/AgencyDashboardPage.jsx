import React, { useState, useEffect } from "react";
import Navbar from "@/components/home/Navbar";
import axios from "axios";
import { 
  Briefcase, Layers, UserCheck, MessageSquare, ChevronRight, 
  CheckCircle, ShieldCheck, Building2, X, FileText, Percent, 
  AlertTriangle, Trophy, Activity, TrendingUp, CheckSquare, Clock, ShieldAlert,
  BarChart3, DollarSign, Users, Settings
} from "lucide-react";
import DashboardKpiGrid from "./DashboardKpiGrid";
import CriticalAlertsPanel from "./CriticalAlertsPanel";
import LiveLeaderboard from "./LiveLeaderboard";
import LoadBalancingRadar from "./LoadBalancingRadar";
import AgencyHealthWidget from "./AgencyHealthWidget";
import PipelineKanban from "./PipelineKanban";
import ReportsDashboardPage from "./ReportsDashboardPage";
import CommissionDashboardPage from "@/pages/CommissionDashboardPage";

export default function AgencyDashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [activeTab, setActiveTab] = useState("telemetry");
  
  const [setupForm, setSetupForm] = useState({ name: "", licenseNumber: "", commissionRate: "5" });
  const [inviteEmail, setInviteEmail] = useState("");
  const [allocationForm, setAllocationForm] = useState({ leadId: "", agentId: "" });

  const token = localStorage.getItem("token");

  const fetchAgencyContextData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/agency/team-intelligence", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(res.data?.metrics || res.data || null);
    } catch (err) {
      console.error("Agency data load fallback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencyContextData();
  }, []);

  const handleCreateAgency = async (e) => {
    e.preventDefault();
    if (!setupForm.name || !setupForm.licenseNumber) {
      alert("Please complete all required verification fields.");
      return;
    }
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/agency/onboard-firm", setupForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Brokerage firm profile initialized successfully!");
      setShowSetupModal(false);
      fetchAgencyContextData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed initializing brokerage profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleInviteAgent = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      alert("Please enter a valid email address.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/agency/onboard-agent", 
        { agentEmail: inviteEmail }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message || "Agent onboarded successfully!");
      setInviteEmail("");
      fetchAgencyContextData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to onboard agent.");
    }
  };

  const handleLeadDelegation = async (e) => {
    e.preventDefault();
    if (!allocationForm.leadId || !allocationForm.agentId) return;
    try {
      await axios.put("http://localhost:5000/api/agency/assign-lead", allocationForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Lead delegated cleanly to your agent workspace!");
      setAllocationForm({ leadId: "", agentId: "" });
      fetchAgencyContextData();
    } catch (err) {
      alert(err.response?.data?.message || "Delegation failed.");
    }
  };

  if (loading && !analytics) {
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased transition-colors duration-200 flex flex-col">
      <Navbar />
      
      {/* Dynamic Global Metrics Ticker */}
      <DashboardKpiGrid metrics={{
        totalAgents: analytics?.agentsCount || 0,
        onlineAgents: analytics?.onlineAgentsCount || 0,
        availableAgents: analytics?.availableAgentsCount || 0,
        propertiesManaged: analytics?.propertiesManagedCount || 0,
        openLeads: analytics?.totalLeadsCount || 0,
        closedDeals: analytics?.closedDealsCount || 0,
        monthlyRevenue: analytics?.monthlyRevenue || 0,
        pendingCommission: analytics?.pendingCommission || 0,
        pendingTasks: analytics?.pendingTasksCount || 0
      }} />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6 flex-1 w-full">
        
        {/* Core Administrative Workspace Header */}
        <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-900 pb-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Agency Central Command</h1>
            <p className="text-xs text-slate-500 mt-1">Unified operational control desk managing pipeline funnels, roster task workloads, and gross ledger commissions.</p>
          </div>
          <button
            onClick={() => setShowSetupModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
          >
            Setup Brokerage Profile
          </button>
        </div>

        {/* 🛠️ Modernized Consolidated Navigation Tab Deck */}
        <div className="flex flex-wrap border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold uppercase tracking-wider rounded-xl overflow-hidden p-0.5 shadow-xs">
          {[
            { id: "telemetry", label: "Executive Summary", icon: Activity },
            { id: "pipeline", label: "Deal Kanban Pipeline", icon: Layers },
            { id: "reports", label: "Performance Reports", icon: BarChart3 },
            { id: "commissions", label: "Commission Splits Ledger", icon: DollarSign },
            { id: "workload", label: "Team Roster Analytics", icon: Users },
            { id: "management", label: "Operations Workspace", icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 text-center transition-all rounded-lg cursor-pointer ${activeTab === tab.id ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40"}`}
            >
              <tab.icon size={13} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Context Multi-View Rendering Engines Mapping */}
        <div className="transition-all duration-150">
          
          {activeTab === "telemetry" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Quadrant Column Area */}
            <div className="lg:col-span-2">
              <LoadBalancingRadar roster={analytics?.radarData} />
            </div>

            {/* Right Quadrant Column: Only holds Critical Alerts now */}
            <div className="lg:col-span-1 space-y-6">
              <CriticalAlertsPanel alerts={analytics?.alertsData} />
              {/* 🟢 REMOVED: AgencyHealthWidget block completely cleared from here */}
            </div>

            {/* Bottom Row Layout View */}
            <div className="lg:col-span-3">
              <LiveLeaderboard standings={analytics?.leaderboardData} />
            </div>
          </div>
        )}


          {activeTab === "pipeline" && (
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950 p-2">
              <PipelineKanban />
          </div>

          )}

          {activeTab === "reports" && (
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <ReportsDashboardPage />
            </div>
          )}

          {activeTab === "commissions" && (
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <CommissionDashboardPage />
            </div>
          )}

                    {activeTab === "workload" && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-3xs">
              <div className="flex items-center gap-2 mb-5 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-white">Team Roster Performance Analytics</h3>
              </div>
              <div className="w-full overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
                <table className="w-full text-left border-collapse text-xs md:text-sm min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wide">
                      <th className="py-3 pl-4">Account Member</th>
                      <th>Roster Role</th>
                      <th>Live Workload</th>
                      <th className="text-right pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!analytics?.team || analytics.team.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-xs text-slate-400 font-medium">No active sub-agents registered under your brokerage roster yet.</td>
                      </tr>
                    ) : (
                      analytics.team.map((member, i) => (
                        <tr key={i} className="border-b border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                          <td className="py-4 pl-4 font-bold">{member.name || "Field Agent"}</td>
                          <td className="uppercase text-[10px] font-bold text-blue-500">{member.role || "agent"}</td>
                          <td>{member.assignedLeads || 0} Active Leads</td>
                          <td className="text-right pr-4">
                            <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">Verified Matrix Member</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "management" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-3xs">
                <h3 className="font-black text-xs uppercase tracking-wider text-slate-400 mb-4">Invite Agent to Brokerage</h3>
                <form onSubmit={handleInviteAgent} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Target Account Email</label>
                    <input
                      type="email" placeholder="Enter agent registration email..." value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer">Onboard Field Worker</button>
                </form>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-3xs">
                <h3 className="font-black text-xs uppercase tracking-wider text-slate-400 mb-4">Delegate Lead Assignment</h3>
                <form onSubmit={handleLeadDelegation} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Target Lead ID</label>
                      <input
                        type="text" placeholder="Paste lead document ID..." value={allocationForm.leadId} onChange={(e) => setAllocationForm({ ...allocationForm, leadId: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Target Agent ID</label>
                      <input
                        type="text" placeholder="Paste user agent ID..." value={allocationForm.agentId} onChange={(e) => setAllocationForm({ ...allocationForm, agentId: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer">Assign Workload</button>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>

      {showSetupModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-md w-full rounded-2xl shadow-2xl overflow-hidden p-6 relative">
            <button onClick={() => setShowSetupModal(false)} className="absolute right-4 top-4 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"><X size={16} /></button>
            <div className="flex items-center gap-2 mb-4"><Building2 className="text-blue-500" size={20} /><h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Initialize Brokerage Firm</h3></div>
            <form onSubmit={handleCreateAgency} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Corporate Firm Name</label>
                <input type="text" placeholder="Enter official brokerage name..." value={setupForm.name} onChange={(e) => setSetupForm({ ...setupForm, name: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Regulatory License Number</label>
                <input type="text" placeholder="Enter real estate license reference..." value={setupForm.licenseNumber} onChange={(e) => setSetupForm({ ...setupForm, licenseNumber: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Company Commission Rate Split (%)</label>
                <input type="number" placeholder="Enter default percent split (e.g., 5)..." value={setupForm.commissionRate} onChange={(e) => setSetupForm({ ...setupForm, commissionRate: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100" />
              </div>
              <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-md transition-all cursor-pointer">Onboard Firm Registry</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

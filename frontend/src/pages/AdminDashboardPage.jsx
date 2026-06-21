import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, Users, User, Layers, History, ShieldCheck, Terminal } from "lucide-react";
import Navbar from "@/components/home/Navbar";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [dashboardData, setDashboardData] = useState({
    users: [],
    metrics: {},
    monthlyUsersGrowth: [],
    monthlyPropertyGrowth: [],
    monthlyLeadGrowth: [],
    propertyStatusDistribution: [],
    roleDistribution: [],
    leadFunnel: [],
  });
  const [loading, setLoading] = useState(true);

  const [auditLogs, setAuditLogs] = useState([]);

  const token = localStorage.getItem("token");

  const fetchAllUsers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/admin/dashboard-summary",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const auditRes = await axios.get("http://localhost:5000/api/audit", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setAuditLogs(Array.isArray(auditRes.data?.logs) ? auditRes.data.logs : auditRes.data || []);

      setDashboardData(response.data);
    } catch (error) {
      console.error("Failed to fetch admin dashboard users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAllUsers();
  }, []);

  const handleRoleToggle = async (userId, newRole) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchAllUsers();
    } catch (error) {
      console.error("Failed updating role:", error);
    }
  };

  const handleAccountPurge = async (userId, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${name}?`
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setDashboardData(prev => ({
        ...prev,
        users: (prev.users || []).filter((user) => user._id !== userId)
      }));
    } catch (error) {
      console.error("Failed deleting user:", error);
    }
  };

  const userGrowthData = (dashboardData.monthlyUsersGrowth || []).map((item) => ({
    month: item._id ? `${item._id.month}/${item._id.year}` : "N/A",
    users: item.totalUsers || 0,
  }));

  const propertyGrowthData = (dashboardData.monthlyPropertyGrowth || []).map((item) => ({
    month: item._id ? `${item._id.month}/${item._id.year}` : "N/A",
    properties: item.totalProperties || 0,
  }));

  const leadGrowthData = (dashboardData.monthlyLeadGrowth || []).map((item) => ({
    month: item._id ? `${item._id.month}/${item._id.year}` : "N/A",
    leads: item.totalLeads || 0,
  }));

  const propertyStatusData = (dashboardData.propertyStatusDistribution || []).map((item) => ({
    name: item._id || "Unknown",
    value: item.total || 0,
  }));

  const roleDistributionData = (dashboardData.roleDistribution || []).map((item) => ({
    name: item._id || "Unknown",
    value: item.total || 0,
  }));

  const leadFunnelData = (dashboardData.leadFunnel || []).map((item) => ({
    name: item._id || "Unknown",
    value: item.total || 0,
  }));



  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col">
      <Navbar />

      <section className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        <div className="w-full mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <span className="text-[10px] font-black tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded uppercase flex items-center gap-1.5 w-fit">
              <ShieldAlert className="w-3 h-3" />
              SECURITY MONITOR
            </span>

            <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white mt-1">
              Platform Accounts & User Profiles
            </h1>

            <p className="text-xs text-slate-400 mt-0.5">
              Manage users and roles across the platform.
            </p>
          </div>

          <Link
            to="/admin/matrix-settings"
            className="flex items-center gap-2 bg-blue-600 text-white font-bold text-xs rounded-xl px-4 py-2"
          >
            <Layers className="w-4 h-4" />
            Matrix Settings
          </Link>
        </div>


{/* SYSTEM METRICS */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

  {/* Total Users */}
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between">
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        Total Users
      </p>
      <h2 className="text-2xl font-black mt-2 text-slate-800 dark:text-white">
        {dashboardData?.metrics?.globalUsersCount || 0}
      </h2>
    </div>

    <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center">
      <Users className="w-5 h-5 text-blue-600" />
    </div>
  </div>

  {/* Total Listings */}
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between">
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        Total Listings
      </p>
      <h2 className="text-2xl font-black mt-2 text-slate-800 dark:text-white">
        {dashboardData?.metrics?.globalListingsCount || 0}
      </h2>
    </div>

    <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center">
      <Layers className="w-5 h-5 text-emerald-600" />
    </div>
  </div>

  {/* Total Leads */}
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between">
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        Total Leads
      </p>
      <h2 className="text-2xl font-black mt-2 text-slate-800 dark:text-white">
        {dashboardData?.metrics?.globalLeadsCount || 0}
      </h2>
    </div>

    <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center">
      <ShieldAlert className="w-5 h-5 text-purple-600" />
    </div>
  </div>

</div>



{/* ANALYTICS GRID */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 text-left">

  {/* Users Growth */}
  <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
    <div className="flex justify-between items-start gap-4 mb-4">
      <div className="flex flex-col gap-0.5">
        <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-200 uppercase tracking-tight">Users Growth</h3>
        <p className="text-[11px] text-slate-400 dark:text-zinc-500">Timeline tracking new account registrations across the ecosystem matrix.</p>
      </div>
      <span className="text-xs font-mono font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded-md shrink-0">
        {userGrowthData.reduce((acc, curr) => acc + (curr.users || 0), 0)}
      </span>
    </div>
    <ResponsiveContainer width="100%" height={230}>
      <LineChart data={userGrowthData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
        <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
        <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>

  {/* Properties Growth */}
  <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
    <div className="flex justify-between items-start gap-4 mb-4">
      <div className="flex flex-col gap-0.5">
        <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-200 uppercase tracking-tight">Properties Growth</h3>
        <p className="text-[11px] text-slate-400 dark:text-zinc-500">Monthly velocity of newly added real estate assets inside the database.</p>
      </div>
      <span className="text-xs font-mono font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded-md shrink-0">
        {propertyGrowthData.reduce((acc, curr) => acc + (curr.properties || 0), 0)}
      </span>
    </div>
  
    <ResponsiveContainer width="100%" height={230}>
      <BarChart data={propertyGrowthData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
        <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
        <Bar dataKey="properties" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Leads Growth */}
  <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
    <div className="flex justify-between items-start gap-4 mb-4">
      <div className="flex flex-col gap-0.5">
        <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-200 uppercase tracking-tight">Lead Growth</h3>
        <p className="text-[11px] text-slate-400 dark:text-zinc-500">Volume tracking inbound buyer transactions generated monthly.</p>
      </div>
      <span className="text-xs font-mono font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded-md shrink-0">
        {leadGrowthData.reduce((acc, curr) => acc + (curr.leads || 0), 0)}
      </span>
    </div>
    <ResponsiveContainer width="100%" height={230}>
      <LineChart data={leadGrowthData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
        <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
        <Line type="monotone" dataKey="leads" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>

  {/* Property Status */}
<div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 mb-10 text-left">
  <div className="flex justify-between items-start gap-4 mb-6">
    <div className="flex flex-col gap-0.5">
      <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-200 uppercase tracking-tight">Property Status</h3>
      <p className="text-[11px] text-slate-400 dark:text-zinc-500">Operational asset allocation breakdown grouped by listing parameter rules.</p>
    </div>
    <span className="text-xs font-mono font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded-md shrink-0">
      {propertyStatusData.reduce((acc, curr) => acc + (curr.value || 0), 0)}
    </span>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
    <div className="md:col-span-6 w-full h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={propertyStatusData}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            paddingAngle={2}
          >
            {(propertyStatusData || []).map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={["#10b981", "#f59e0b", "#e11d48", "#3b82f6", "#8b5cf6"][index % 5]}
              />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>

    <div className="md:col-span-6 flex flex-col gap-2 justify-center w-full">
      <span className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 block mb-1">
        Inventory Ledger
      </span>
      {(propertyStatusData || []).map((item, index) => (
        <div 
          key={index} 
          className="flex items-center justify-between bg-white dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60 px-4 py-2.5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-2.5 h-2.5 rounded-full shrink-0" 
              style={{ backgroundColor: ["#10b981", "#f59e0b", "#e11d48", "#3b82f6", "#8b5cf6"][index % 5] }} 
            />
            <span className="text-sm font-bold capitalize text-slate-700 dark:text-zinc-300">
              {item.name}
            </span>
          </div>
          <span className="text-xs font-mono font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md min-w-[24px] text-center">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  </div>
</div>

{/* Role Distribution */}
<div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 text-left">
  <div className="flex justify-between items-start gap-4 mb-6">
    <div className="flex flex-col gap-0.5">
      <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-200 uppercase tracking-tight">
        Role Distribution
      </h3>
      <p className="text-[11px] text-slate-400 dark:text-zinc-500">
        User ecosystem composition matrix by privilege accounts.
      </p>
    </div>
    <span className="text-xs font-mono font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded-md shrink-0">
      {(roleDistributionData || []).reduce((acc, curr) => acc + (curr.value || 0), 0)}
    </span>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
    
    {/* 📊 PIE CHART AREA */}
    <div className="md:col-span-6 w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={roleDistributionData}
            dataKey="value"
            nameKey="name"
            outerRadius={75}
            paddingAngle={2}
          >
            {(roleDistributionData || []).map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={["#6366f1", "#ec4899", "#14b8a6", "#f43f5e", "#8b5cf6"][index % 5]}
              />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* 📋 ACCOUNT PRIVILEGE LEDGER AREA */}
    <div className="md:col-span-6 flex flex-col gap-2 justify-center w-full">
      <span className="text-[9px] font-mono font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 block mb-1">
        Account Ledger
      </span>
      {(roleDistributionData || []).map((item, index) => (
        <div 
          key={index} 
          className="flex items-center justify-between bg-white dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60 px-3.5 py-2 rounded-xl"
        >
          <div className="flex items-center gap-2.5">
            <div 
              className="w-2.5 h-2.5 rounded-full shrink-0" 
              style={{ backgroundColor: ["#6366f1", "#ec4899", "#14b8a6", "#f43f5e", "#8b5cf6"][index % 5] }} 
            />
            <span className="text-xs font-mono font-black uppercase text-slate-700 dark:text-zinc-300">
              {item.name}
            </span>
          </div>
          <span className="text-xs font-mono font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md min-w-[22px] text-center">
            {item.value}
          </span>
        </div>
      ))}
    </div>

  </div>
</div>


  {/* Lead Funnel */}
  <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
    <div className="flex justify-between items-start gap-4 mb-4">
      <div className="flex flex-col gap-0.5">
        <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-200 uppercase tracking-tight">Lead Funnel</h3>
        <p className="text-[11px] text-slate-400 dark:text-zinc-500">Granular tracking of client pipelines from registration blocks to closure.</p>
      </div>
      <span className="text-xs font-mono font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded-md shrink-0">
        {leadFunnelData.reduce((acc, curr) => acc + (curr.value || 0), 0)}
      </span>
    </div>
    <ResponsiveContainer width="100%" height={230}>
      <BarChart data={leadFunnelData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
        <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
        <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]}>
          {(leadFunnelData || []).map((entry, index) => (
            <Cell key={`cell-${index}`} fill={["#3b82f6", "#10b981", "#f59e0b", "#ec4899"][index % 4]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>

</div>


        {/* 🟢 LIVE AUDIT LOG TIMELINE GRID INSERT */}
        <section className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-md mb-8 transition-colors">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
            <History size={16} className="text-blue-500" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Live System Audit Log Timeline
            </h2>
          </div>

          {auditLogs.length === 0 ? (
            <div className="text-center py-10 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              No recent administrative actions recorded.
            </div>
          ) : (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {auditLogs.map((log) => {
                const isApproval = log.action === "PROPERTY_APPROVED";
                const isRejection = log.action === "PROPERTY_REJECTED";

                return (
                  <div key={log._id} className="flex items-start gap-4 p-3 bg-slate-50/50 dark:bg-[#090f1c] rounded-xl border border-slate-200/60 dark:border-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                    <div className="mt-0.5">
                      <History size={14} className={isApproval ? "text-emerald-500" : isRejection ? "text-rose-500" : "text-blue-500"} />
                    </div>
                    
                    <div className="flex-1 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-300">{log.actor?.name || "System Admin"}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 mx-2">executed</span>
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          isApproval ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                          isRejection ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        }`}>
                          {log.action}
                        </span>
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">{log.message || `${log.targetType} modified`}</p>
                      </div>
                      
                      <span className="text-[11px] font-bold text-slate-400 dark:text-slate-600 shrink-0">
                        {log.createdAt ? new Date(log.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "N/A"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

{/* 🟢 EXECUTIVE SYSTEM SHORTCUT MODULES INSERT */}
          {/* 🛡️ COMPLIANCE CONTROLS GATEWAYS RIBBON BLOCK */}
          <div className="flex flex-wrap gap-3 mt-4">
            <Link
              to="/admin/kyc-verification"
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <ShieldCheck size={14} />
              Launch KYC Verification Desk
            </Link>
            
            {user?.role === "super_admin" && (
              <Link
                to="/admin/audit-logs"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Terminal size={14} />
                Inspect Security Audit Ledger
              </Link>
            )}
          </div>



                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 my-6">
          <button
            onClick={() => navigate("/admin/properties-control")}
            className="flex items-center justify-between p-4 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl transition-all text-left cursor-pointer group shadow-2xs"
          >
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-blue-400 transition-colors">
                Global Property Moderation
              </h4>
              <p className="text-[11px] mt-1 text-slate-700 dark:text-slate-300 leading-normal">
                Approve pending listings, manage flagged posts, or delete items globally.
              </p>
            </div>
            <span className="text-slate-400 dark:text-slate-600 group-hover:text-blue-500 font-bold transition-colors">→</span>
          </button>

          <button
            onClick={() => navigate("/admin/subscriptions")}
            className="flex items-center justify-between p-4 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl transition-all text-left cursor-pointer group shadow-2xs"
          >
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-purple-400 transition-colors">
                Manage User Subscriptions
              </h4>
              <p className="text-[11px] mt-1 text-slate-700 dark:text-slate-300 leading-normal">
                Review active subscriber tiers, license keys, and account thresholds.
              </p>
            </div>
            <span className="text-slate-400 dark:text-slate-600 group-hover:text-purple-500 font-bold transition-colors">→</span>
          </button>

          <button
            onClick={() => navigate("/admin/billing")}
            className="flex items-center justify-between p-4 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl transition-all text-left cursor-pointer group shadow-2xs"
          >
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-emerald-400 transition-colors">
                Platform Financial Revenue
              </h4>
              <p className="text-[11px] mt-1 text-slate-700 dark:text-slate-300 leading-normal">
                Audit macro company income intake margins and transactional receipts.
              </p>
            </div>
            <span className="text-slate-400 dark:text-slate-600 group-hover:text-emerald-400 font-bold transition-colors">→</span>
          </button>

          <button
            onClick={() => navigate("/admin/system-health")}
            className="flex items-center justify-between p-4 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl transition-all text-left cursor-pointer group shadow-2xs"
          >
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-amber-400 transition-colors">
                System Infrastructure Health
              </h4>
              <p className="text-[11px] mt-1 text-slate-700 dark:text-slate-300 leading-normal">
                Monitor MongoDB cluster size, API server throughput, and fault metrics.
              </p>
            </div>
            <span className="text-slate-400 dark:text-slate-600 group-hover:text-amber-500 font-bold transition-colors">→</span>
          </button>

          <button
            onClick={() => navigate("/admin/matrix-settings")}
            className="flex items-center justify-between p-4 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl transition-all text-left cursor-pointer group shadow-2xs"
          >
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-purple-400 transition-colors">
                Fix Front Landing Pages
              </h4>
              <p className="text-[11px] mt-1 text-slate-700 dark:text-slate-300 leading-normal">
                Configure layout text assets, tweak hero backgrounds, and modify global platform widgets.
              </p>
            </div>
            <span className="text-slate-400 dark:text-slate-600 group-hover:text-purple-500 font-bold transition-colors">→</span>
          </button>
        </div>


        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6">
          <div className="flex items-center gap-2 mb-5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Users className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-white">
              User Registry
            </h3>
          </div>

          {loading ? (
            <p className="text-sm text-slate-500">Loading users...</p>
          ) : (
            <div className="w-full overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
              <table className="w-full text-left border-collapse text-xs md:text-sm min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                    <th className="py-3 pl-4">ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th className="text-right pr-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {dashboardData.users.map((account) => (
                    <tr
                      key={account._id}
                      className="border-b border-slate-100 dark:border-slate-800"
                    >
                      <td className="py-4 pl-4 font-mono text-xs">
                        {account._id}
                      </td>

                      <td>{account.name}</td>

                      <td>{account.email}</td>

                      <td className="py-4">
                        {account.role === "super_admin" ? (
                          <span className="px-2.5 py-1 bg-purple-500/10 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-800/60 text-purple-600 dark:text-purple-400 text-[10px] font-black rounded-md uppercase tracking-wider">
                            Super Admin
                          </span>
                        ) : (
                          <select
                            value={account.role || "user"}
                            onChange={(e) =>
                              handleRoleToggle(account._id, e.target.value)
                            }
                            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-slate-800 dark:text-slate-200 text-xs font-medium outline-none focus:border-blue-500 transition-colors"
                          >
                            <option value="user" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">User</option>
                            <option value="seller" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Seller</option>
                            <option value="admin" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Admin</option>
                            <option value="agent" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Agent</option>
                            <option value="agency" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Agency</option>
                          </select>
                        )}
                      </td>

                      <td className="py-4 text-right pr-4">
                        {account.role !== "super_admin" ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleAccountPurge(account._id, account.name)
                            }
                            className="inline-flex items-center justify-center h-8 px-4 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[11px] font-bold uppercase tracking-wider shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer outline-none"
                          >
                            Delete
                          </button>
                        ) : (
                          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 tracking-wide bg-slate-100/60 dark:bg-slate-800/40 px-3 py-1 rounded-full">
                            System Protected
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

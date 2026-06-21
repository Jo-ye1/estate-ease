import React from "react";
import { Users, Wifi, Building, Activity, FileText, CheckCircle, DollarSign, Clock, AlertCircle } from "lucide-react";

export default function DashboardKpiGrid({ metrics }) {
  const safeMetrics = {
    totalAgents: 0,
    onlineAgents: 0,
    availableAgents: 0,
    propertiesManaged: 0,
    openLeads: 0,
    closedDeals: 0,
    monthlyRevenue: 0,
    pendingCommission: 0,
    pendingTasks: 0,
    ...metrics
  };

  const cards = [
    { label: "Total Agents", val: safeMetrics.totalAgents, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
    { label: "Online Agents", val: safeMetrics.onlineAgents, icon: Wifi, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { label: "Available Agents", val: safeMetrics.availableAgents, icon: CheckCircle, color: "text-teal-500", bg: "bg-teal-500/10 border-teal-500/20" },
    { label: "Properties Managed", val: safeMetrics.propertiesManaged, icon: Building, color: "text-indigo-500", bg: "bg-indigo-500/10 border-indigo-500/20" },
    { label: "Open Leads", val: safeMetrics.openLeads, icon: Activity, color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20" },
    { label: "Closed Deals", val: safeMetrics.closedDeals, icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/20" },
    { label: "Monthly Revenue", val: `$${Number(safeMetrics.monthlyRevenue).toLocaleString()}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { label: "Pending Comm.", val: `$${Number(safeMetrics.pendingCommission).toLocaleString()}`, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" },
    { label: "Pending Tasks", val: safeMetrics.pendingTasks, icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-500/10 border-rose-500/20" },
  ];

return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3 p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      {cards.map((c, i) => (
        <div key={i} className="flex flex-col justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">{c.label}</span>
            <div className={`p-1.5 rounded-lg border shrink-0 ${c.bg} ${c.color}`}>
              <c.icon size={12} />
            </div>
          </div>
          <div className="text-base font-black tracking-tight text-slate-900 dark:text-white mt-3 truncate">{c.val}</div>
        </div>
      ))}
    </div>
  );
}

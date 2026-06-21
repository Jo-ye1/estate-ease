import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, AreaChart, Area, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, BarChart3, PieChart as PieIcon, DollarSign, Target, Activity, ShieldAlert, Award, ChevronUp, ChevronDown } from "lucide-react";
import ForecastChartsWidget from "./ForecastChartsWidget";
import AgencyHealthWidget from "./AgencyHealthWidget";

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"];

export default function ReportsDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    pipeline: { totalLeads: 0, activeValue: 0, lanes: [] },
    revenue: { grossGTV: 0, agentPayouts: 0, monthlyTrend: [] },
    conversion: { globalRate: 0, speedDays: 0, sources: [] }
  });
  
  const token = localStorage.getItem("token");

  const loadReportingMatrixData = async () => {
    try {
      setLoading(true);
      const [pipelineRes, commissionRes, healthRes] = await Promise.all([
        axios.get("http://localhost:5000/api/reports/pipeline", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:5000/api/reports/commission", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:5000/api/reports/health", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setMetrics({
        pipeline: pipelineRes.data?.metrics || {
          totalLeads: 156,
          activeValue: 4230000,
          lanes: [
            { name: "New", volume: 45 },
            { name: "Contacted", volume: 32 },
            { name: "Viewing", volume: 24 },
            { name: "Negotiation", volume: 18 },
            { name: "Offer", volume: 12 },
            { name: "Contract", volume: 10 },
            { name: "Closed", volume: 15 }
          ]
        },
        revenue: commissionRes.data?.metrics || {
          grossGTV: 142000,
          agentPayouts: 104000,
          monthlyTrend: [
            { month: "Jan", revenue: 23000, deals: 4 },
            { month: "Feb", revenue: 31000, deals: 6 },
            { month: "Mar", revenue: 28000, deals: 5 },
            { month: "Apr", revenue: 42000, deals: 9 },
            { month: "May", revenue: 38000, deals: 7 },
            { month: "Jun", revenue: 51000, deals: 11 }
          ]
        },
        conversion: healthRes.data?.metrics || {
          globalRate: 14.5,
          speedDays: 18,
          sources: [
            { name: "Property Form", value: 65 },
            { name: "Landing Pages", value: 45 },
            { name: "Direct Referral", value: 28 },
            { name: "Organic Search", value: 18 }
          ]
        }
      });
    } catch (err) {
      console.error("Failed fetching live reporting parameters:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportingMatrixData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6 flex-1 w-full">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-900 pb-5">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl">Corporate Reports & Analytics</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Unified performance metrics aggregating CRM pipelines, closed revenue volumes, and conversion velocities.</p>
          </div>
          <button 
            onClick={loadReportingMatrixData}
            className="px-4 py-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer text-slate-800 dark:text-white"
          >
            Refresh Telemetry
          </button>
        </div>

        {/* High-Impact Executive KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Gross Revenue Volume", val: `$${metrics.revenue.grossGTV.toLocaleString()}`, icon: DollarSign, change: "+12.4%", up: true, desc: "Total brokerage earnings split", color: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/10" },
            { label: "Pipeline Asset Value", val: `$${metrics.pipeline.activeValue.toLocaleString()}`, icon: TrendingUp, change: "+8.2%", up: true, desc: "Active transaction configurations", color: "text-blue-600 dark:text-blue-400", border: "border-blue-500/10" },
            { label: "Global Win Ratio", val: `${metrics.conversion.globalRate}%`, icon: Target, change: "-0.5%", up: false, desc: "Lead-to-closure transition rate", color: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-500/10" },
            { label: "Avg Cycle Velocity", val: `${metrics.conversion.speedDays} Days`, icon: Activity, change: "-3 Days", up: true, desc: "Average milestone closing speed", color: "text-amber-600 dark:text-amber-400", border: "border-amber-500/10" }
          ].map((card, i) => (
            <div key={i} className={`bg-white dark:bg-slate-900/60 border border-slate-200 dark:${card.border} p-4 rounded-xl flex flex-col justify-between shadow-xs`}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">{card.label}</span>
                <div className={`p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg ${card.color}`}>
                  <card.icon size={14} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{card.val}</h3>
                <span className={`text-[10px] font-bold flex items-center ${card.up ? "text-emerald-500" : "text-rose-500"}`}>
                  {card.up ? <ChevronUp size={10} /> : <ChevronDown size={10} />} {card.change}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Analytics Visualization Quadrants */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart 1: Pipeline Conversion Volume */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl lg:col-span-2 flex flex-col shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={14} className="text-blue-500 dark:text-blue-400" />
              <h3 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300 tracking-wider">Pipeline Stage Load Balancing</h3>
            </div>
            <div className="flex-1 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.pipeline.lanes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" dark:stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "var(--tw-shared-bg, #ffffff)", borderColor: "#e2e8f0", borderRadius: "12px", fontSize: "11px" }}
                    itemStyle={{ color: "#0f172a" }}
                  />
                  <Bar dataKey="volume" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* FIXED PLACEMENT: EMBEDS THE VITAL HEALTH SCORE CIRCULAR GAUGE COMPONENT RIGHT HERE */}
          <div className="lg:col-span-1">
            <AgencyHealthWidget />
          </div>

          {/* Chart 2: Lead Acquisition Sources Breakdown & Intelligence Cards Wrapper */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {/* Left Quadrant Cell: Lead Mix Donut Chart (Spans 1 Column) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl md:col-span-1 flex flex-col justify-between shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <PieIcon size={14} className="text-purple-500 dark:text-purple-400" />
                <h3 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300 tracking-wider">Lead Source Quality Mix</h3>
              </div>
              <div className="flex-1 min-h-[160px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={metrics.conversion?.sources || []} cx="50%" cy="50%" innerRadius={50} outerRadius={65} paddingAngle={4} dataKey="value">
                      {(metrics.conversion?.sources || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "var(--tw-shared-bg, #ffffff)", borderColor: "#e2e8f0", borderRadius: "12px", fontSize: "11px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4 text-[10px]">
                {(metrics.conversion?.sources || []).map((src, index) => (
                  <div key={index} className="flex items-center gap-1.5 p-1.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60 rounded-lg">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-slate-500 dark:text-slate-400 truncate flex-1">{src.name}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{src.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Quadrant Cell: Horizontal Intelligence Insights Cards (Spans 2 Columns) */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Conversion Target Rate", val: `${metrics.conversion?.globalRate || 14.5}%`, desc: "Lead-to-deal conversion performance tracking indicator node.", color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400", badge: "Top 10% Market" },
                { label: "Average Realized Deal Velocity", val: `${metrics.conversion?.speedDays || 24} Days`, desc: "Average time window tracked from inbound inquiry to closure.", color: "text-blue-600 bg-blue-500/10 border-blue-500/20 dark:text-blue-400", badge: "-3d Improvement" },
                { label: "Primary Top Producer Staff", val: metrics.revenue?.topAgent || "eyassu melese", desc: "Roster field executive holding the maximum closed splits GTV volume.", color: "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400", badge: "Brokerage MVP" }
              ].map((card, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-700">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-wider block">{card.label}</span>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mt-1">{card.val}</h3>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full border text-[8px] font-bold uppercase tracking-wide shrink-0 ${card.color}`}>
                      {card.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-3 border-t border-slate-100 dark:border-slate-800/60 pt-2.5 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>

                    {/* Chart 3: Financial Revenue & Growth Curve */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl lg:col-span-3 flex flex-col shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-emerald-500 dark:text-emerald-400" />
                <h3 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300 tracking-wider">Monthly Revenue Growth & Closures Curve</h3>
              </div>
              <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-black text-emerald-600 dark:text-emerald-400 uppercase">SaaS Ledger Track</span>
            </div>
            <div className="flex-1 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.revenue.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" dark:stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                  <YAxis yAxisId="left" stroke="#64748b" fontSize={10} />
                  <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--tw-shared-bg, #ffffff)", borderColor: "#e2e8f0", borderRadius: "12px", fontSize: "11px" }} />
                  <Legend wrapperStyle={{ fontSize: "10px", pt: 10 }} />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" name="Gross Split Revenue ($)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line yAxisId="right" type="monotone" dataKey="deals" name="Deals Finalized (Qty)" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="4 4" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Predictive Forecasting Area Bounds */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl lg:col-span-3 flex flex-col shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-blue-500 dark:text-blue-400" />
                <h3 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300 tracking-wider">Predictive Revenue Growth & Pipeline Curves</h3>
              </div>
              <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded font-black text-blue-500 dark:text-blue-400 uppercase">Confidence Matrix</span>
            </div>
            <div className="flex-1 min-h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { period: "Jul 26", predictiveUpper: 48000, predictiveLower: 38000, currentActual: 42000 },
                  { period: "Aug 26", predictiveUpper: 58000, predictiveLower: 44000, currentActual: 51000 },
                  { period: "Sep 26", predictiveUpper: 64000, predictiveLower: 50000, currentActual: null },
                  { period: "Oct 26", predictiveUpper: 72000, predictiveLower: 55000, currentActual: null },
                  { period: "Nov 26", predictiveUpper: 85000, predictiveLower: 61000, currentActual: null },
                  { period: "Dec 26", predictiveUpper: 98000, predictiveLower: 70000, currentActual: null }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" dark:stroke="#1e293b" />
                  <XAxis dataKey="period" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--tw-shared-bg, #ffffff)", borderColor: "#e2e8f0", borderRadius: "12px", fontSize: "11px" }} />
                  <Legend wrapperStyle={{ fontSize: "10px", pt: 10 }} />
                  <Area type="monotone" dataKey="predictiveUpper" stroke="none" fill="#3b82f6" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="predictiveLower" stroke="none" fill="#3b82f6" fillOpacity={0.1} />
                  <Line type="monotone" dataKey="currentActual" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} connectNulls />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


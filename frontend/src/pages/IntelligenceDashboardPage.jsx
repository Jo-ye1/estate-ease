import React, { useState, useEffect } from "react";
import Navbar from "@/components/home/Navbar";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { TrendingUp, Users, DollarSign, LayoutDashboard } from "lucide-react";

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#ef4444"];

export default function IntelligenceDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/intelligence/demand-trends", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "You do not have access to this intelligence telemetry.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-6 rounded-2xl text-center max-w-md">
            <h3 className="font-black text-amber-800 dark:text-amber-400 text-lg">Premium Intelligence Feature</h3>
            <p className="text-sm text-slate-500 mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Format data for Recharts bedroom group bars
  const bedroomChartData = (data?.topBedrooms || []).map(item => ({
    name: item._id === null || item._id === 0 ? "Any Beds" : `${item._id} Beds`,
    searches: item.total
  }));

  // Format data for Recharts price band pie
  const priceChartData = (data?.topPriceRanges || []).map(item => ({
    name: item._id === "0-Any" || item._id === "null-null" ? "No Limit" : `${item._id} USD`,
    value: item.total
  }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Demand Intelligence</h1>
            <p className="text-sm text-slate-500 mt-1">Real-time macro user behavior data analytics generated directly from buyer search parameters.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          {/* Chart Card 1: Most Searched Bedroom Counts */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-6">
              <Users size={16} className="text-blue-500" />
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Target Bedroom Layout Demand</h2>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bedroomChartData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Bar dataKey="searches" radius={[8, 8, 0, 0]}>
                    {bedroomChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart Card 2: Most Searched Price Bands */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-6">
              <DollarSign size={16} className="text-emerald-500" />
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Searched Pricing Budget Spreads</h2>
            </div>
            <div className="h-64 w-full flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priceChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name }) => name}
                  >
                    {priceChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

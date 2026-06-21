import React, { useState, useEffect } from "react";
import Navbar from "@/components/home/Navbar";
import axios from "axios";
import { Sparkles } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

export default function MarketInsightsPage() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const compileMarketAnalysis = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/properties/admin/all-listings", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const properties = Array.isArray(res.data) ? res.data : [];

        // Dynamic aggregation calculator
        const categories = ["house", "apartment", "villa", "office", "land", "hotel"];
        const metricsMap = categories.map((cat) => {
          const matchingItems = properties.filter(p => String(p.propertyCategory).toLowerCase() === cat);
          const avgPrice = matchingItems.length === 0 ? 0 : 
            matchingItems.reduce((acc, curr) => acc + (curr.pricing?.salePrice || curr.pricing?.monthlyRent || curr.pricing?.dailyRate || 0), 0) / matchingItems.length;

          return {
            category: cat.toUpperCase(),
            avgPrice: Math.round(avgPrice) || 12,
            listingsCount: matchingItems.length
          };
        });

        setChartData(metricsMap);
      } catch (err) {
        console.error("Market data gathering error:", err);
      } finally {
        setLoading(false);
      }
    };
    compileMarketAnalysis();
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
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div>
          <div className="flex items-center gap-2 text-blue-500 font-bold text-xs uppercase tracking-widest">
            <Sparkles size={14} /> Market Intelligence
          </div>
          <h1 className="text-3xl font-black mt-1 tracking-tight text-slate-900 dark:text-white">Local Valuation & Categories Intelligence</h1>
          <p className="text-xs text-slate-500 mt-1">Review average cross-category listing competitive metrics and benchmark your regional portfolio pricing.</p>
        </div>

        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-6">Average Asset Valuations vs. Active Marketplace Inventory</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.2} />
                <XAxis dataKey="category" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip />
                <Legend />
                <Bar name="Average Valuation ($)" dataKey="avgPrice" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar name="Active Competition Inventory" dataKey="listingsCount" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}

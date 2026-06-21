import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "@/lib/api";
import {
  Building2,
  Heart,
  Sparkles,
  LayoutDashboard,
  PlusCircle,
  Search,
  User,
  Shield,
  Edit,
  Trash2,
  Calendar,
  Layers,
  ChevronRight,
  ChevronLeft,
  History as HistoryIcon,
  MessageSquare,
  Users,          
  CheckCircle,    
  TrendingUp     
} from "lucide-react";

import {
  getMyProperties,
  deleteProperty,
  updatePropertyStatus,
} from "../services/propertyService";
import { useFavorites } from "@/context/FavoritesContext";
import Navbar from "@/components/home/Navbar";
import { getDashboardData } from "@/services/dashboardServices";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import PropertyAnalyticsPanel from "./dashboard/PropertyAnalyticsPanel.jsx";
import AdminPropertyControlPage from "./admin/AdminPropertyControlPage";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState("overview");
  const userRole = JSON.parse(localStorage.getItem("user"))?.role || "user";

  const [properties, setProperties] = useState([]);
  const { favorites } = useFavorites();
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const [dashboardData, setDashboardData] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalLeads: 0,
    convertedLeads: 0,
    conversionRate: 0,
    totalRevenue: 0,
    topProperties: [],
    monthlyLeadGrowth: [],
    monthlyConversions: [],
    propertyStatusDistribution: []
  });

  const leadGrowthData = (analytics?.monthlyLeadGrowth || []).map((item) => ({
    month: item?._id ? `${item._id.month}/${item._id.year}` : "N/A",
    leads: item?.totalLeads || 0,
  }));

  const conversionTrendData = (analytics?.monthlyConversions || []).map((item) => ({
    month: item?._id ? `${item._id.month}/${item._id.year}` : "N/A",
    converted: item?.converted || 0,
  }));

  const propertyStatusData = (analytics?.propertyStatusDistribution || []).map((item) => ({
    name: item?._id || "Unknown",
    value: item?.count || 0,
  }));

  const STATUS_COLORS = [
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#3b82f6",
    "#6b7280",
  ];
 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const getDisplayPrice = (property) => {
    if (!property?.pricing) return 0;
    if (property.listingType === "sale") return property.pricing.salePrice || property.price || 0;
    if (property.listingType === "rent") return property.pricing.monthlyRent || property.price || 0;
    if (property.listingType === "hotel") return property.pricing.dailyRate || property.price || 0;
    return property.price || 0;
  };

  const loadProperties = async () => {
    try {
      const data = await getMyProperties();
      const sorted = (data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setProperties(sorted);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const myPropertiesData = await getMyProperties();
        const sortedProperties = (myPropertiesData || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setProperties(sortedProperties);

        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/analytics/owner", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const resData = await response.json();
          
          setAnalytics({
            totalLeads: resData.totalLeads || resData.metrics?.globalLeadsCount || 0,
            convertedLeads: resData.convertedLeads || 0,
            conversionRate: resData.conversionRate || 0,
            totalRevenue: resData.totalRevenue || 0,
            topProperties: resData.topProperties || [],
            monthlyLeadGrowth: resData.monthlyLeadGrowth || resData.leads || [],
            monthlyConversions: resData.monthlyConversions || [],
            propertyStatusDistribution: resData.propertyStatusDistribution || resData.listings || []
          });
        }
      } catch (error) {
        console.error("Dashboard hydration conflict:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  useEffect(() => {
    const currentUrlTabValue = searchParams.get("tab");

    if (currentUrlTabValue === "matrix") {
      setActiveTab("site-matrix");
    } else {
      setActiveTab("overview");
    }
  }, [searchParams]);

  const handleStatusChange = async (id, status) => {
    try {
      await updatePropertyStatus(id, status);
      await loadProperties();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this property listing?")) {
      return;
    }

    try {
      await deleteProperty(id);

      const updatedList = properties.filter(
        (property) => property._id !== id
      );

      setProperties(updatedList);

      const maxPagesRemaining =
        Math.ceil(updatedList.length / itemsPerPage) || 1;

      if (currentPage > maxPagesRemaining) {
        setCurrentPage(maxPagesRemaining);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredProperties =
    statusFilter === "all"
      ? properties
      : properties.filter(
          (property) => property.listingStatus === statusFilter
        );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const paginatedList = filteredProperties.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage) || 1;

  const latestProperty =
    filteredProperties.length > 0 ? filteredProperties[0] : null;

  if (loading) {
    return (
      <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-40">
          <LayoutDashboard className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  const statusColors = {
    draft: "bg-yellow-500 text-white",
    published: "bg-green-600 text-white",
    archived: "bg-gray-500 text-white",
    sold: "bg-red-600 text-white",
    closed: "bg-black text-white",
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200 pb-24 flex flex-col select-none">
      <Navbar />

      <section className="max-w-[1320px] mx-auto w-full px-4 pt-12 flex-1 flex flex-col justify-start">
        {/* Header Section */}
        <div className="mb-10 text-left">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full mb-3 block w-max">
            Management Hub
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Owner Dashboard
          </h1>
          <div className="w-16 h-[2px] bg-blue-600 dark:bg-blue-400 rounded-full mt-3" />
        </div>
        {/* 📊 METRICS INFOGRAPHIC PLATES - PERFECT 7-COLUMN ALIGNMENT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-12 w-full">
          
          {/* Card 1: Total Listings */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/50 p-5 rounded-2xl shadow-xs flex items-center justify-between text-left">
            <div>
              <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest">Total Listings</p>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mt-2 tracking-tight">{properties.length}</h2>
            </div>
            <div className="w-10 h-10 bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center rounded-xl shrink-0 ml-2">
              <Building2 className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Total Favorites */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/50 p-5 rounded-2xl shadow-xs flex items-center justify-between text-left">
            <div>
              <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest">Total Favorites</p>
              <h2 className="text-2xl font-black text-red-500 mt-2 tracking-tight">{favorites.length}</h2>
            </div>
            <div className="w-10 h-10 bg-red-500/10 text-red-500 flex items-center justify-center rounded-xl shrink-0 ml-2">
              <Heart className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3: Latest Property */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/50 p-5 rounded-2xl shadow-xs flex items-center justify-between text-left">
            <div className="min-w-0 flex-1 flex flex-col justify-center">
              <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Latest Property</p>
              {latestProperty ? (
                <div className="space-y-0.5 mt-1">
                  <h2 className="text-xs font-black text-slate-800 dark:text-white truncate tracking-tight leading-tight">
                    {latestProperty.title}
                  </h2>
                  <p className="text-blue-600 dark:text-blue-400 font-extrabold text-[11px]">
                    ${getDisplayPrice(latestProperty).toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 font-medium italic mt-2">No active assets</p>
              )}
            </div>
            <div className="w-10 h-10 bg-amber-500/10 text-amber-500 flex items-center justify-center rounded-xl shrink-0 ml-2 self-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          {/* Card 4: Total Leads */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/50 p-5 rounded-2xl shadow-xs flex items-center justify-between text-left">
            <div>
              <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest">Total Leads</p>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mt-2 tracking-tight">
                {analytics?.totalLeads ?? 0}
              </h2>
            </div>
            <div className="w-10 h-10 bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center rounded-xl shrink-0 ml-2">
              <Users className="w-4 h-4" />
            </div>
          </div>

           {/* Card 5: Closed Deals */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/50 p-5 rounded-2xl shadow-xs flex items-center justify-between text-left">
            <div>
              <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest">Closed Deals</p>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mt-2 tracking-tight">
                {analytics?.convertedLeads ?? 0}
              </h2>
            </div>
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center rounded-xl shrink-0 ml-2">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>

          {/* Card 6: Conversion Rate */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/50 p-5 rounded-2xl shadow-xs flex items-center justify-between text-left">
            <div>
              <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest">Conv. Rate</p>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mt-2 tracking-tight text-ellipsis overflow-hidden">
                {analytics?.conversionRate ?? 0}%
              </h2>
            </div>
            <div className="w-10 h-10 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center rounded-xl shrink-0 ml-1">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          {/* Card 7: Revenue */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/50 p-5 rounded-2xl shadow-xs flex items-center justify-between text-left">
            <div>
              <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest">Revenue</p>
              <h2 className="text-2xl font-black text-emerald-500 mt-2 tracking-tight">
                ${analytics?.revenue?.toLocaleString() ?? "0"}
              </h2>
            </div>
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 flex items-center justify-center rounded-xl shrink-0 ml-2">
              <span>💰</span>
            </div>
          </div>
        </div>

  <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 mb-10">
  <h3 className="text-sm font-black mb-6 text-slate-900 dark:text-white">
    Lead Growth
  </h3>

  <div className="w-full h-[300px]">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={leadGrowthData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="leads"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>

{/* ================= MONTHLY CONVERSION TREND RATE CHART PANEL ================= */}
<div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 mb-8 text-left min-h-[360px] w-full">
  <div className="flex justify-between items-start mb-6">
    <div>
      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
        Monthly Conversion Trend
      </h3>
      <p className="text-xs text-slate-400 dark:text-zinc-500">
        Percentage yield tracking closed deal completions over time.
      </p>
    </div>
    <span className="text-xs font-mono font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md">
      {analytics.conversionRate || 0}% Overall
    </span>
  </div>

  <div className="w-full h-[260px] block relative">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart 
        data={(analytics.monthlyConversionTrend || analytics.monthlyConversions || []).map(item => ({
          month: item._id ? `${item._id.month}/${item._id.year}` : "N/A",
          rate: Number((item.conversionRate !== undefined ? item.conversionRate : (item.converted || 0)).toFixed(1))
        }))}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
        <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" />
        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
        <Line 
          type="monotone" 
          dataKey="rate" 
          stroke="#10b981" 
          strokeWidth={3} 
          dot={{ fill: '#10b981', r: 4 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>



<div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 mb-10 text-left">
  <div className="flex justify-between items-start gap-4 mb-6">
    <div className="flex flex-col gap-1">
      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
        Property Status Distribution
      </h3>
      <p className="text-xs text-slate-400 dark:text-zinc-500">
        Operational inventory summary by active status counts inside the cloud database.
      </p>
    </div>
    <span className="text-xs font-mono font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded-md shrink-0">
      {propertyStatusData.reduce((acc, curr) => acc + (curr.value || 0), 0)}
    </span>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
    {/* 📊 PIE CHART SIDE (Clean look: labels removed from the pie itself) */}
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
            {propertyStatusData.map((entry, index) => (
              <Cell
                key={index}
                fill={STATUS_COLORS[index % STATUS_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* 📋 INVENTORY LEDGER SIDE */}
    <div className="md:col-span-6 flex flex-col gap-2 justify-center w-full">
      <span className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 block mb-1">
        Inventory Ledger
      </span>
      {propertyStatusData.map((item, index) => (
        <div 
          key={index} 
          className="flex items-center justify-between bg-white dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60 px-4 py-2.5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-2.5 h-2.5 rounded-full shrink-0" 
              style={{ backgroundColor: STATUS_COLORS[index % STATUS_COLORS.length] }} 
            />
            <span className="text-sm font-bold capitalize text-slate-700 dark:text-zinc-300">
              {item.name}
            </span>
          </div>
          <span className="text-xs font-mono font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-md min-w-[24px] text-center">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  </div>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <button
            onClick={() => navigate("/admin/properties-control")}
            className="flex items-center justify-between p-4 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl transition-all text-left cursor-pointer group shadow-2xs"
          >
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-blue-500 transition-colors">
                Global Property Moderation
              </h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Approve pending listings, manage flagged posts, or delete items globally.</p>
            </div>
            <span className="text-slate-400 dark:text-slate-600 group-hover:text-blue-500 font-bold transition-colors">→</span>
          </button>

</div>



        {/* MAIN PANEL CONTENT SPLIT ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
          
          {/* LEFT PANELS COLUMN: MAIN DATA GRIDS FEED */}
          <div className="lg:col-span-8 space-y-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left border-b border-slate-100 dark:border-slate-900 pb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-400" />
                <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Your Properties</h2>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xs cursor-pointer"
              >
                <option value="all">All listings</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
                <option value="sold">Sold</option>
                <option value="closed">Closed</option>
              </select>
            </div>

                                    {paginatedList.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/40 w-full flex flex-col items-center justify-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">No workspace records detected</p>
              </div>
                        ) : (
              <div className="space-y-8 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full justify-items-center sm:justify-items-start">
                  {paginatedList.map((property) => (
                    /* 🟢 FIXED: Swapped h-[385px] for dynamic min-h-[420px] and removed top-level overflow limits */
                    <div key={property._id} className="w-full max-w-[312px] min-h-[420px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl flex flex-col justify-between shadow-xs hover:shadow-sm transition-all duration-200 group text-left relative">
                      <div>
                        {/* Keep image clipping safe with local overflow-hidden */}
                        <div className="relative h-44 w-full bg-slate-950 overflow-hidden shrink-0 rounded-t-2xl border-b border-slate-100 dark:border-slate-800/20">
                          <img
                            src={
                              property.images?.length > 0
                                ? property.images[0].startsWith("http")
                                  ? `${property.images[0]}?t=${new Date(property.updatedAt).getTime()}`
                                  : `http://localhost:5000${property.images[0]}?t=${new Date(property.updatedAt).getTime()}`
                                : "/placeholder.jpg"
                            }
                            alt={property.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />

                          <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider shadow-xs ${statusColors[property.listingStatus] || "bg-slate-500 text-white"}`}>
                            {property.listingStatus || "Draft"}
                          </span>
                        </div>

                        <div className="p-4">
                          <h3 className="font-bold text-sm text-slate-800 dark:text-white tracking-tight line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {property.title}
                          </h3>
                          <p className="text-slate-400 dark:text-slate-500 text-[10.5px] font-medium mt-1 truncate tracking-wide">
                            {property.location || "Location unlisted"}
                          </p>
                          <p className="text-blue-600 dark:text-blue-500 font-black text-sm mt-3 leading-none">
                            ${getDisplayPrice(property).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Bottom actions and analytics container panel wrapper */}
                      <div className="p-3.5 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col gap-2 shrink-0 rounded-b-2xl">
                        <select
                          value={property.listingStatus || "draft"}
                          onChange={(e) => handleStatusChange(property._id, e.target.value)}
                          className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-[11px] bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                          <option value="sold">Sold</option>
                          <option value="closed">Closed</option>
                        </select>

                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            to={`/edit-property/${property._id}`}
                            className="flex items-center justify-center gap-1 text-center text-[11px] font-bold py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors no-underline bg-white dark:bg-slate-900 shadow-2xs"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(property._id)}
                            className="flex items-center justify-center gap-1 text-center text-[11px] font-bold py-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 border-0 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>

                        {/* 🟢 Renders fully now without cutting out because parent constraints are open */}
                        <PropertyAnalyticsPanel propertyId={property._id} />

                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 pt-6 mt-4 w-full border-t border-slate-100 dark:border-slate-800/60">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-0 outline-none"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    
                    <div className="text-xs font-mono font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Page {currentPage} of {totalPages}
                    </div>              
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-0 outline-none"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

                    {/* RIGHT SIDEBAR PANEL COLUMN: OPERATIONS SHORTCUTS BAR */}
          <div className="lg:col-span-4 space-y-6 w-full text-left">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-4">Quick Navigation</h3>
              
              <div className="flex flex-col gap-1">
                {userRole === "admin" && (
                  <Link
                    to="/dashboard?tab=matrix"
                    className="flex items-center justify-between text-xs font-bold p-3 text-blue-600 dark:text-blue-400 hover:bg-blue-500/5 rounded-xl no-underline transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Shield className="w-4 h-4" />
                      <span>Admin System Matrix</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                )}

                <Link
                  to="/add-property"
                  className="flex items-center justify-between text-xs font-bold p-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl no-underline transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <PlusCircle className="w-4 h-4 text-slate-400" />
                    <span>Add New Property</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  to="/leads"
                  className="flex items-center justify-between text-xs font-bold p-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl no-underline transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-slate-400" />
                    <span>Lead Management</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  to="/properties"
                  className="flex items-center justify-between text-xs font-bold p-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl no-underline transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>Explore Market Feed</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  to="/inbox"
                  className="flex items-center justify-between text-xs font-bold p-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl no-underline transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                    <span>Inbox</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  to="/favorites"
                  className="flex items-center justify-between text-xs font-bold p-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl no-underline transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-slate-400" />
                    <span>Your Bookmarks</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center justify-between text-xs font-bold p-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl no-underline transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Account Profile Settings</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </div>

            {/* RECENT ACTIVITY TIMELINE */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <HistoryIcon className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Recent Activity</h3>
              </div>

              <div className="space-y-3.5">
                {properties.slice(0, 4).map((item) => (
                  <div key={item._id} className="flex items-start justify-between gap-3 text-xs border-b border-slate-100 dark:border-slate-800/40 pb-2.5 last:border-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 dark:text-white truncate tracking-tight">{item.title}</p>
                      <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide mt-0.5">
                        Status: {item.listingStatus || "Draft"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded-md shrink-0">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 📈 TOP PERFORMING PROPERTIES PANEL */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-4">
                Top Performing Properties
              </h3>

              <div className="space-y-3">
                {analytics?.topProperties && analytics.topProperties.length > 0 ? (
                  analytics.topProperties.map((property, index) => (
                    <div
                      key={property._id || index}
                      className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 last:border-b-0 last:pb-0"
                    >
                      <div>
                        <p className="font-bold text-xs text-slate-800 dark:text-white truncate max-w-[220px]">
                          #{index + 1} {property.title}
                        </p>
                        <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                          {property.totalLeads || 0} leads
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium italic py-1">
                    No lead data logged yet
                  </p>
                )}
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
};

export default DashboardPage;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  CheckCircle,
  TrendingUp,
  Layers,
  Heart,
  ChevronRight,
  Home
} from "lucide-react";

import Navbar from "@/components/home/Navbar";
import { useFavorites } from "@/context/FavoritesContext";

import {
  getMyProperties,
  deleteProperty,
  updatePropertyStatus,
} from "@/services/propertyService";

import PropertyAnalyticsPanel from "../dashboard/PropertyAnalyticsPanel";

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

const SellerDashboardPage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalLeads: 0,
    convertedLeads: 0,
    conversionRate: 0,
    totalRevenue: 0,
    topProperties: [],
    monthlyLeadGrowth: [],
    monthlyConversions: [],
    propertyStatusDistribution: [],
  });

  const { favorites } = useFavorites();
  const [loading, setLoading] = useState(true);

  const STATUS_COLORS = [
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#3b82f6",
    "#6b7280",
  ];

  const loadProperties = async () => {
    try {
      const data = await getMyProperties();
      setProperties(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        await loadProperties();

        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/analytics/owner",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAnalytics({
            totalLeads: data.totalLeads || 0,
            convertedLeads: data.convertedLeads || 0,
            conversionRate: data.conversionRate || 0,
            totalRevenue: data.totalRevenue || 0,
            topProperties: data.topProperties || [],
            monthlyLeadGrowth: data.monthlyLeadGrowth || [],
            monthlyConversions: data.monthlyConversions || [],
            propertyStatusDistribution: data.propertyStatusDistribution || [],
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to archive this property?")) return;
    try {
      await deleteProperty(id);
      loadProperties();
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updatePropertyStatus(id, status);
      loadProperties();
    } catch (error) {
      console.error(error);
    }
  };

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black mb-8 text-slate-900 dark:text-white">
          Seller Dashboard
        </h1>

        {/* Metrics Card Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 mb-10">
          <MetricCard
            title="Listings"
            value={properties.length}
            icon={<Building2 className="text-blue-500" />}
          />
          <MetricCard
            title="Leads"
            value={analytics.totalLeads}
            icon={<Layers className="text-purple-500" />}
          />
          <MetricCard
            title="Closed"
            value={analytics.convertedLeads}
            icon={<CheckCircle className="text-emerald-500" />}
          />
          <MetricCard
            title="Revenue"
            value={`$${analytics.totalRevenue}`}
            icon={<TrendingUp className="text-emerald-500" />}
          />
          <MetricCard
            title="Conversion"
            value={`${analytics.conversionRate}%`}
            icon={<TrendingUp className="text-blue-500" />}
          />
          <MetricCard
            title="Favorites"
            value={favorites.length}
            icon={<Heart className="text-rose-500" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Lead Growth Chart */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h2 className="font-black mb-4 text-slate-900 dark:text-white">Lead Growth</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.monthlyLeadGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="_id.month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Line dataKey="totalLeads" stroke="#3b82f6" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Property Status Chart */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h2 className="font-black mb-4 text-slate-900 dark:text-white">
              Property Status Distribution
            </h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.propertyStatusDistribution}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                  >
                    {analytics.propertyStatusDistribution.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Navigation Panel */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs mb-10">
          <h2 className="font-black mb-4 text-slate-900 dark:text-white">Quick Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickLink to="/add-property" title="Add Property" />
            <QuickLink to="/leads" title="My Leads" />
            <QuickLink to="/owner/leads" title="Pipeline Center" />
            <QuickLink to="/billing" title="Billing Dashboard" />
            <QuickLink to="/pricing" title="Pricing Plans" />
            <QuickLink to="/inbox" title="Inbox Chat" />
            <QuickLink to="/favorites" title="Favorites" />
            <QuickLink to="/profile" title="Profile Settings" />
            <QuickLink to="/dashboard/revenue" title="Revenue & Earnings" />
            <QuickLink to="/dashboard/market-insights" title="Market Insights Matrix" />           
          </div>
        </div>

        {/* Properties Matrix Collection */}
        <div>
          <h2 className="text-xl font-black mb-6 text-slate-900 dark:text-white">
            My Properties
          </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((property) => {
              const currentStatus = String(property.listingStatus || "pending").toLowerCase();
              const currentRenewalStatus = String(property.renewalStatus || "active").toLowerCase();
              const isApproved = currentStatus === "published";
              const isExpiringSoon = isApproved && currentRenewalStatus === "due";

              return (
                <div
                  key={property._id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-slate-400">
                      {property.images?.[0] ? (
                        <img
                          src={property.images[0].startsWith("http") ? property.images[0] : `http://localhost:5000${property.images[0]}`}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      ) : (
                        <Home size={32} />
                      )}
                    </div>

                    <h3 className="font-black mt-4 text-slate-900 dark:text-white text-base truncate">
                      {property.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {property.location}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md ${
                        isExpiringSoon
                          ? "bg-amber-500/10 text-amber-500 animate-pulse border border-amber-500/20" :
                        isApproved 
                          ? "bg-emerald-500/10 text-emerald-500" :
                        currentStatus === "rejected" 
                          ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"
                      }`}>
                        {isExpiringSoon ? "Expiring Soon (Due)" : isApproved ? "Approved Live" : currentStatus}
                      </span>
                    </div>

                    <select
                      className="w-full mt-4 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 bg-slate-50 dark:bg-slate-950 text-xs font-bold outline-none cursor-pointer text-slate-800 dark:text-slate-200"
                      value={property.listingStatus}
                      onChange={(e) => handleStatusChange(property._id, e.target.value)}
                    >
                      <option value="draft">Draft (Hidden)</option>
                      <option value="published">Submit / Publish</option>
                      <option value="archived">Archive (Soft Delete)</option>
                      <option value="sold">Mark as Sold</option>
                      <option value="closed">Closed</option>
                    </select>

                    {/* 🟢 RENEWAL INTERACTION GATEWAY: Shows up to instantly reactivate expired or archived items */}
                    {(currentStatus === "expired" || currentStatus === "archived") && (
                      <button
                        type="button"
                        onClick={async () => {
                          if (!window.confirm("Would you like to extend this listing for 30 more days and submit it for moderation review?")) return;
                          try {
                            const token = localStorage.getItem("token");
                            await axios.put(`http://localhost:5000/api/properties/${property._id}/renew`, {}, {
                              headers: { Authorization: `Bearer ${token}` }
                            });
                            if (typeof loadProperties === "function") await loadProperties();
                          } catch (err) {
                            console.error("Renewal processing failed:", err);
                            alert(err.response?.data?.message || "Failed to renew listing.");
                          }
                        }}
                        className="w-full mt-3 flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                      >
                        Renew Listing (Extend 30 Days)
                      </button>
                    )}
                  </div>

                  <div>
                    <div className="flex gap-2 mt-4">
                      <Link
                        to={`/edit-property/${property._id}`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-2.5 text-center text-xs font-black uppercase tracking-wider transition-colors shadow-2xs"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(property._id)}
                        className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl p-2.5 text-xs font-black uppercase tracking-wider transition-colors shadow-2xs cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                      <PropertyAnalyticsPanel propertyId={property._id} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>
    </div>
  );
};

const MetricCard = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-2xs transition-colors duration-200">
    <div>
      <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">
        {title}
      </p>
      <h2 className="text-2xl font-black mt-1 text-slate-900 dark:text-white">
        {value}
      </h2>
    </div>
    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {icon}
    </div>
  </div>
);

const QuickLink = ({ to, title }) => (
  <Link
    to={to}
    className="border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 rounded-xl p-4 flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-950 transition-all shadow-3xs"
  >
    {title}
    <ChevronRight size={14} className="text-slate-400" />
  </Link>
);

export default SellerDashboardPage;

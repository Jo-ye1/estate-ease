import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { 
  Building2, 
  Heart, 
  Sparkles, 
  Edit3, 
  Trash2, 
  LayoutDashboard, 
  Zap, 
  History, 
  FileText,
  Home,
  ShieldAlert 
} from "lucide-react";

import { getMyProperties, deleteProperty } from "../services/propertyService";
import { getFavorites } from "../services/favoriteServices"; 
import Navbar from "@/components/home/Navbar"; 
import AdminSettingsDashboard from './AdminSettingsDashboard'; 


const DashboardPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // 👑 CORE CONTENT VIEW SWITCHER (Defaults to your core system stats view)
  const [activeTab, setActiveTab] = useState('overview');
  const userRole = localStorage.getItem('user_role') || localStorage.getItem('role') || 'user';

  const [properties, setProperties] = useState([]);
  const [favCount, setFavCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🎯 PAGINATION STATE HOOK LOGIC (3x3 Grid Split System)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; 

  // 👑 RUNTIME LISTENER: Detect and catch URL ?tab=matrix routing parameter events
  useEffect(() => {
    const currentUrlTabValue = searchParams.get('tab');
    if (currentUrlTabValue === 'matrix') {
      setActiveTab('site-matrix');
    } else {
      setActiveTab('overview');
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchDashboardStatsData = async () => {
      try {
        setLoading(true);
        const [myPropertiesData, favoritesData] = await Promise.all([
          getMyProperties(),
          getFavorites()
        ]);
        
        const sortedProperties = (myPropertiesData || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setProperties(sortedProperties);
        setFavCount(Array.isArray(favoritesData) ? favoritesData.length : 0);
      } catch (error) {
        console.error("Error loading dashboard metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStatsData();
  }, []);

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this property listing?")) {
      return;
    }

    try {
      await deleteProperty(id);
      alert("Property removed successfully!");
      const updatedList = properties.filter((property) => property._id !== id);
      setProperties(updatedList);
      
      const maxPagesRemaining = Math.ceil(updatedList.length / itemsPerPage) || 1;
      if (currentPage > maxPagesRemaining) {
        setCurrentPage(maxPagesRemaining);
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert(error.response?.data?.message || "Failed to remove listing.");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  const paginatedList = properties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(properties.length / itemsPerPage) || 1;

  if (loading) {
    return (
      <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-200 flex flex-col select-none">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-32 text-center">
          <div className="text-xs font-bold text-slate-400 dark:text-slate-600 animate-pulse uppercase tracking-widest flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 animate-spin text-blue-600" />
            <span>Loading Dashboard Insights...</span>
          </div>
        </div>
      </div>
    );
  }

  const latestProperty = properties.length > 0 ? properties[0] : null;

  return (
    // 🎯 TARGET SPEC MULTI-THEME OVERRIDE CANVAS
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen select-none text-left transition-colors duration-200 pb-24 flex flex-col">
      
      <Navbar />

      {/* 🎯 MAIN CANVASES FRAMEWORK ENVELOPE */}
      <section className="max-w-[1320px] mx-auto w-full px-4 pt-12 flex-1 flex flex-col justify-start">
        
        {/* LEFT FLUSH HEADER COMPONENT ROW WITH ACCENT LINE */}
        <div className="mb-10 relative inline-block w-full">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full mb-3 block w-max">
            Operations Panel
          </span>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-white tracking-tight pb-2">
            Owner <span className="text-blue-600 dark:text-blue-500">Dashboard</span>
          </h1>
          
          {/* 🎯 FIXED SUBTITLE: Swapped the formatting to block with clean leading properties to kill the line strike-through bug completely */}
          <p className="text-slate-400 dark:text-slate-500 text-xs font-medium tracking-wide mt-1 block leading-normal select-text">
            Manage operations, track listing engagement metrics, and access system shortcuts
          </p>
          
          <div className="w-24 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full mt-4" />
        </div>

        {/* 📊 STATISTICS GRID PANEL ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 w-full">
          {/* Stat Box 1 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div className="text-left">
              <p className="text-slate-400 dark:text-slate-500 font-bold text-[10.5px] uppercase tracking-widest">Total Listings</p>
              <p className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-white mt-2 tracking-tight">{properties.length}</p>
            </div>
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center rounded-xl text-blue-600 dark:text-blue-500 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          {/* Stat Box 2 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div className="text-left">
              <p className="text-slate-400 dark:text-slate-500 font-bold text-[10.5px] uppercase tracking-widest">Total Favorites</p>
              <p className="text-3xl lg:text-4xl font-black text-red-500 mt-2 tracking-tight">{favCount}</p>
            </div>
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center rounded-xl text-red-500 shrink-0">
              <Heart className="w-5 h-5" />
            </div>
          </div>

          {/* Stat Box 3 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex items-center justify-between sm:col-span-2 lg:col-span-1">
            <div className="text-left min-w-0 flex-1">
              <p className="text-slate-400 dark:text-slate-500 font-bold text-[10.5px] uppercase tracking-widest">Latest Property</p>
              {latestProperty ? (
                <>
                  <p className="text-sm font-black text-slate-800 dark:text-white mt-2 truncate max-w-[240px] tracking-tight">
                    {latestProperty.title}
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 font-bold text-xs mt-1 truncate">
                    ${latestProperty.price?.toLocaleString()} • <span className="text-slate-400 font-medium normal-case">{latestProperty.location}</span>
                  </p>
                </>
              ) : (
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium italic mt-3">No active marketplace assets</p>
              )}
            </div>
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center rounded-xl text-amber-500 shrink-0 ml-4">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* MAIN TWO-COLUMN SPLIT CONTAINER GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
          
          {/* LEFT COLUMN PANEL: LIVE OPERATIONS LISTINGS FEED */}
          <div className="lg:col-span-8 space-y-6 w-full">
            <div className="flex items-center gap-2 text-left mb-2">
              <Building2 className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Your Published Properties</h2>
            </div>
            
            {properties.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-900/40 w-full shadow-xs flex flex-col items-center justify-center">
                <p className="text-sm text-slate-400 dark:text-slate-500 font-bold mb-2">You haven't listed any properties yet</p>
                <Link to="/add-property" className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider hover:underline flex items-center gap-1">
                  <span>List a Property Now</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            ) : (
              <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full justify-items-center sm:justify-items-start">
                  {paginatedList.map((property) => (
                    <div key={property._id} className="w-full max-w-[380px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm transition-all duration-300 hover:shadow-md group">
                      <div>
                        <div className="relative h-44 w-full bg-slate-950 overflow-hidden shrink-0">
                          <img
                            src={property.images && property.images.length > 0 ? property.images : "/placeholder.jpg"}
                            alt={property.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md shadow-xs">
                            {property.type}
                          </div>
                        </div>

                        <div className="p-4 text-left">
                          <h3 className="font-bold text-sm text-slate-800 dark:text-white tracking-tight line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{property.title}</h3>
                          <p className="text-slate-400 dark:text-slate-500 text-[11px] font-medium mt-1 truncate tracking-wide max-w-[210px]">{property.location}</p>
                          <p className="text-blue-600 dark:text-blue-500 font-black text-base mt-3.5 leading-none">
                            ${property.price?.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/20 p-3.5 gap-3">
                        <button 
                          type="button"
                          onClick={() => navigate(`/edit-property/${property._id}`)}
                          className="w-full h-8.5 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-extrabold py-1.5 rounded-xl text-[10.5px] uppercase tracking-wider bg-white dark:bg-slate-800 transition-all cursor-pointer text-center shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleDeleteClick(property._id)}
                          className="w-full h-8.5 border border-red-200 dark:border-red-900/40 text-red-600 hover:text-white font-extrabold py-1.5 rounded-xl text-[10.5px] uppercase tracking-wider bg-red-500/5 hover:bg-red-600 dark:hover:bg-red-600 transition-all cursor-pointer text-center shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* COMPACT NUMERIC PAGINATION NAVIGATION PORTS */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/60 w-full select-none">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => {
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="h-8 px-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-40 font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed select-none shadow-xs"
                    >
                      &larr; Prev
                    </button>

                    {Array.from({ length: totalPages }).map((_, index) => {
                      const pageNum = index + 1;
                      const isSelected = currentPage === pageNum;

                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => {
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`w-8 h-8 font-black text-xs transition-all border rounded-xl cursor-pointer select-none flex items-center justify-center ${
                            isSelected
                              ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10"
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-950/40"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => {
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="h-8 px-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-40 font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed select-none shadow-xs"
                    >
                      Next &rarr;
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

{/* 📄 RIGHT COLUMN PANEL: QUICK ACTIONS & TIMELINE SIDEBAR */}
<div className="lg:col-span-4 space-y-6 w-full text-left">
  <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
    <div className="flex items-center gap-2 mb-5 border-b border-slate-100 dark:border-slate-800/60 pb-3">
      <Zap className="w-4 h-4 text-blue-600 dark:text-blue-500" />
      <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-white">Quick Shortcuts</h3>
    </div>
    <div className="flex flex-col gap-3">
      
      {/* 👑 NEW ADMIN CHANNELS ACCESS POINT MODULE */}
      {userRole === "admin" && (
        <Link 
          to="/dashboard?tab=matrix" 
          className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-md text-center flex items-center justify-center h-10 border-0 cursor-pointer no-underline mb-1"
        >
          👑 Open Admin System Matrix
        </Link>
      )}

      <Link to="/add-property" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-600/10 text-center flex items-center justify-center h-10 border-0 cursor-pointer no-underline">
        + Add Property Listing
      </Link>
      
      <Link to="/search" className="w-full py-2.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all border border-slate-200 dark:border-slate-800 text-center flex items-center justify-center h-10 cursor-pointer no-underline">
        Open Search Engine
      </Link>

      <Link to="/properties" className="w-full py-2.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all border border-slate-200 dark:border-slate-800 text-center flex items-center justify-center h-10 cursor-pointer no-underline">
        View Catalog Listings
      </Link>
      
      <Link to="/favorites" className="w-full py-2.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all border border-slate-200 dark:border-slate-800 text-center flex items-center justify-center h-10 cursor-pointer no-underline">
        View Bookmarked Pool
      </Link>
      
      <Link to="/profile" className="w-full py-2.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all border border-slate-200 dark:border-slate-800 text-center flex items-center justify-center h-10 cursor-pointer no-underline">
        Configure Account Settings
      </Link>
    </div>
  </div>


            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <History className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-white">Recent Activity</h3>
              </div>
            <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
                {properties.length > 0 ? (
                  properties.slice(0, 4).map((item) => (
                    <div key={item._id} className="flex gap-3 text-xs border-b border-slate-100 dark:border-slate-800/60 pb-3 last:border-0 last:pb-0 items-start">
                      <div className="w-8 h-8 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center rounded-lg text-blue-600 dark:text-blue-500 shrink-0">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800 dark:text-slate-100 leading-tight">Listing Document Generated</p>
                        <p className="text-slate-400 dark:text-slate-500 mt-0.5 font-medium truncate max-w-[190px]">{item.title}</p>
                        <p className="text-slate-400 dark:text-slate-600 text-[9px] font-bold uppercase mt-1 tracking-wide">{new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold italic py-4 text-center">No recent activity logs recorded.</p>
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

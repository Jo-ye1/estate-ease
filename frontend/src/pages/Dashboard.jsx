import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
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
  History as HistoryIcon
} from "lucide-react";

import {
  getMyProperties,
  deleteProperty,
  updatePropertyStatus,
} from "../services/propertyService";
import { useFavorites } from "@/context/FavoritesContext";
import Navbar from "@/components/home/Navbar";



const DashboardPage = () => {
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState("overview");
  const userRole =
    localStorage.getItem("user_role") ||
    localStorage.getItem("role") ||
    "user";

  const [properties, setProperties] = useState([]);
  const { favorites } = useFavorites();
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const getDisplayPrice = (property) => {
    if (!property?.pricing) return 0;

    if (property.listingType === "sale") {
      return property.pricing.salePrice || property.price || 0;
    }

    if (property.listingType === "rent") {
      return property.pricing.monthlyRent || property.price || 0;
    }

    if (property.listingType === "hotel") {
      return property.pricing.dailyRate || property.price || 0;
    }

    return property.price || 0;
  };

  const loadProperties = async () => {
    try {
      const data = await getMyProperties();

      const sorted = (data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

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
      } catch (error) {
        console.error(error);
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

        {/* 📊 METRICS INFOGRAPHIC PLATES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 w-full">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-xs flex items-center justify-between text-left">
            <div>
              <p className="text-slate-400 dark:text-slate-500 font-bold text-[10.5px] uppercase tracking-widest">Total Listings</p>
              <h2 className="text-3xl font-black text-slate-800 dark:text-white mt-2 tracking-tight">{properties.length}</h2>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center rounded-xl shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-xs flex items-center justify-between text-left">
            <div>
              <p className="text-slate-400 dark:text-slate-500 font-bold text-[10.5px] uppercase tracking-widest">Total Favorites</p>
              <h2 className="text-3xl font-black text-red-500 mt-2 tracking-tight">{favorites.length}</h2>
            </div>
            <div className="w-12 h-12 bg-red-500/10 text-red-500 flex items-center justify-center rounded-xl shrink-0">
              <Heart className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-xs flex items-center justify-between text-left sm:col-span-2 lg:col-span-1">
            <div className="min-w-0 flex-1">
              <p className="text-slate-400 dark:text-slate-500 font-bold text-[10.5px] uppercase tracking-widest">Latest Property</p>
              {latestProperty ? (
                <>
                  <h2 className="text-sm font-black text-slate-800 dark:text-white mt-2 truncate tracking-tight">{latestProperty.title}</h2>
                  <p className="text-blue-600 dark:text-blue-400 font-bold text-xs mt-0.5">
                    ${getDisplayPrice(latestProperty).toLocaleString()}
                  </p>
                </>
              ) : (
                <p className="text-xs text-slate-400 font-medium italic mt-3">No active assets</p>
              )}
            </div>
            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 flex items-center justify-center rounded-xl shrink-0 ml-4">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
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
                    <div key={property._id} className="w-full max-w-[312px] h-[385px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-sm transition-all duration-200 group text-left">
                      <div>
                        <div className="relative h-44 w-full bg-slate-950 overflow-hidden shrink-0 border-b border-slate-100 dark:border-slate-800/20">
                          <img
                            src={
                              property.images?.length > 0
                                ? property.images[0].startsWith("http")
                                  ? property.images[0]
                                  : `http://localhost:5000${property.images[0]}`
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

                      <div className="p-3.5 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col gap-2 shrink-0">
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
                {/* 🛡️ CHANGED: Using HistoryIcon to eliminate browser constructor crashes */}
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

          </div>

        </div>
      </section>
    </div>
  );
};

export default DashboardPage;

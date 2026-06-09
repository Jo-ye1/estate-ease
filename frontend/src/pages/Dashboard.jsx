import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyProperties, deleteProperty } from "../services/propertyService";
import { getFavorites } from "../services/favoriteServices"; 

const DashboardPage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [favCount, setFavCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStatsData = async () => {
      try {
        setLoading(true);
        const [myPropertiesData, favoritesData] = await Promise.all([
          getMyProperties(),
          getFavorites()
        ]);
        
        // 🛠️ B4 — Sort listings by 'createdAt' descending so properties[0] is always the absolute newest
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
      setProperties(properties.filter((property) => property._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert(error.response?.data?.message || "Failed to remove listing.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <h2 className="text-xl font-medium text-slate-400 animate-pulse">Loading Dashboard Insights...</h2>
      </div>
    );
  }

  // 🛠️ B4 — Accessing index 0 directly extracts the most recent listing due to our sort order above
  const latestProperty = properties.length > 0 ? properties[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen bg-slate-950">
      
      {/* Dashboard Top Header Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-white">Owner Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Manage, update, or remove your published properties</p>
        </div>
        <Link
          to="/add-property"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl shadow-lg transition-all duration-200 text-center"
        >
          + Add New Property
        </Link>
      </div>

      {/* 📊 STATISTICS GRID PANEL ROW */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        
        {/* Stat Box 1: Total Listings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex items-center justify-between">
          <div>
            <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Total Listings</p>
            <p className="text-4xl font-extrabold text-white mt-2">{properties.length}</p>
          </div>
          <div className="text-3xl bg-blue-950/40 p-3 rounded-xl border border-blue-900/40">🏢</div>
        </div>

        {/* Stat Box 2: Total Favorites */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex items-center justify-between">
          <div>
            <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Total Favorites</p>
            <p className="text-4xl font-extrabold text-red-500 mt-2">{favCount}</p>
          </div>
          <div className="text-3xl bg-red-950/20 p-3 rounded-xl border border-red-900/20">❤️</div>
        </div>

        {/* Stat Box 3: B4 — Latest Property Card Snapshot */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Latest Property</p>
            {latestProperty ? (
              <p className="text-lg font-bold text-white mt-2 truncate max-w-[240px]">
                {latestProperty.title}
              </p>
            ) : (
              <p className="text-sm text-slate-500 italic mt-2">No active assets</p>
            )}
          </div>
          {latestProperty && (
            <p className="text-blue-400 font-semibold text-xs mt-1">
              ${latestProperty.price?.toLocaleString()} • {latestProperty.location}
            </p>
          )}
        </div>

      </div>

      {/* Main Listings Display Feed Segment */}
      <h2 className="text-2xl font-bold text-white mb-6">Your Live Operations Feed</h2>
      
      {properties.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <p className="text-xl text-slate-400 font-medium mb-2">You haven't listed any properties yet</p>
          <Link to="/add-property" className="text-blue-500 hover:underline font-semibold">List a Property Now &rarr;</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property._id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg">
              
              <div>
                <div className="relative h-48 w-full bg-slate-950">
                  <img
                    src={property.images?.[0] || "/placeholder.jpg"}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm border border-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-md font-medium capitalize">
                    {property.type}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-xl text-white line-clamp-1">{property.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">{property.location}</p>
                  <p className="text-blue-500 font-bold text-lg mt-3">
                    ${property.price?.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* 🛠️ B5 — PROPERTY OWNER CONTROLS (Edit & Delete Buttons) */}
              <div className="grid grid-cols-2 border-t border-slate-800 bg-slate-900/50 p-4 gap-3">
                <button 
                  type="button"
                  onClick={() => navigate(`/edit-property/${property._id}`)}
                  className="w-full border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium py-2 rounded-xl text-sm bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer text-center"
                >
                  Edit
                </button>
                
                <button 
                  type="button"
                  onClick={() => handleDeleteClick(property._id)}
                  className="w-full border border-red-900/50 hover:border-red-500 text-red-400 hover:text-white font-medium py-2 rounded-xl text-sm bg-red-950/20 hover:bg-red-600 transition-colors cursor-pointer text-center"
                >
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

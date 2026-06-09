import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyProperties, deleteProperty } from "../services/propertyService";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getMyProperties();
        setProperties(data || []);
      } catch (error) {
        console.error("Error loading dashboard listings:", error);
      } bits: {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // ==========================================
  // FUNCTIONAL HANDLER: DELETE FROM DATABASE
  // ==========================================
  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this property listing?")) {
      return;
    }

    try {
      await deleteProperty(id);
      alert("Property removed successfully!");
      // Filter local state so the deleted card disappears from the grid instantly
      setProperties(properties.filter((property) => property._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert(error.response?.data?.message || "Failed to remove listing.");
    }
  };

  if (loading) {
    return <h2 className="p-10 text-center text-xl font-medium text-slate-400">Loading Dashboard...</h2>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-white">Owner Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Manage, update, or remove your published properties</p>
        </div>
        <Link
          to="/add-property"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl shadow-lg transition-all duration-200"
        >
          + Add New Property
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md mb-10 w-fit min-w-[200px]">
        <p className="text-slate-400 font-medium text-sm uppercase tracking-wider">Active Listings</p>
        <p className="text-4xl font-extrabold text-white mt-2">{properties.length}</p>
      </div>

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

              <div className="grid grid-cols-2 border-t border-slate-800 bg-slate-900/50 p-4 gap-3">
                {/* EDIT BUTTON: Future update page route binding placeholder */}
                <button 
                  type="button"
                  onClick={() => alert("Edit view routing configuration can be added here!")}
                  className="w-full border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium py-2 rounded-xl text-sm bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Edit
                </button>
                
                {/* DELETE BUTTON: Linked to live database removal */}
                <button 
                  type="button"
                  onClick={() => handleDeleteClick(property._id)}
                  className="w-full border border-red-900/50 hover:border-red-500 text-red-400 hover:text-white font-medium py-2 rounded-xl text-sm bg-red-950/20 hover:bg-red-600 transition-colors"
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

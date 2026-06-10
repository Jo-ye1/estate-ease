import { useEffect, useState } from "react";
import { getProperties } from "../services/propertyService";
import PropertyCard from "@/components/home/PropertyCard";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPropertiesData = async () => {
      try {
        setLoading(true);
        const data = await getProperties();
        setProperties(data || []);
      } catch (error) {
        console.error("Failed to load platform marketplace listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPropertiesData();
  }, []);

  // 🛠️ C6 — LOADING STATE: Render a grid of 6 glowing skeleton cards instead of a blank screen
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen bg-slate-950">
        <h1 className="text-4xl font-bold mb-8 text-white">All Properties</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((skeletonId) => (
            <div key={skeletonId} className="rounded-xl border border-slate-800 bg-slate-900 h-80 animate-pulse flex items-center justify-center text-slate-600 font-medium">
              Loading listing parameters...
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen bg-slate-950">
      <h1 className="text-4xl font-bold mb-2 text-white">All Properties</h1>
      <p className="text-slate-400 text-sm mb-8">Browse through all active real estate opportunities</p>

      {/* 🛠️ C7 — EMPTY STATE: Friendly fallback block when no properties exist */}
      {properties.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
          <h2 className="text-xl font-bold text-slate-300 mb-2">No properties found.</h2>
          <p className="text-sm text-slate-500">There are currently no active listings published on the marketplace.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property._id} item={property} />
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { getProperties } from "@/services/propertyService";
import PropertyCard from "./PropertyCard";

export default function PropertyDeals() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties();
        setProperties(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-slate-50 dark:bg-slate-950 py-16 text-center border-t border-b border-slate-100 dark:border-slate-900/60">
        <h2 className="text-xl font-bold text-slate-400 animate-pulse">Loading deals...</h2>
      </div>
    );
  }

  const featuredDeals = properties.slice(0, 8);

  return (
    // 🎯 FIXED OVERALL BACKGROUND: Spans 100% full-width (w-full) with edge-to-edge gray borders and a consistent slate tint!
    <section className="w-full bg-slate-50 dark:bg-slate-950 border-t border-b border-slate-100 dark:border-slate-900/60 py-16 select-none transition-colors duration-200">
      
      {/* 🎯 INNER BOUNDING BOX: Keeps the layout centered at exactly 1320px with side margins to breathe */}
      <div className="max-w-[1320px] mx-auto px-6 text-left">
        
        {/* POPULAR HEADERS HEADER TITLE ROW PANEL */}
        <div className="mb-10 relative inline-block">
          <h2 className="text-2xl lg:text-3xl font-black text-slate-800 dark:text-white tracking-tight pb-3">
            Popular Property <span className="text-blue-600 dark:text-blue-500">Deals</span>
          </h2>
          <div className="absolute bottom-0 left-0 w-[45px] h-[3px] bg-blue-600 dark:bg-blue-500 rounded-full shadow-sm" />
        </div>

        {/* 📊 THE UNIFIED 4×2 CAROUSEL GRID MATRICES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8 justify-items-center">
          {featuredDeals.map((property) => (
            <PropertyCard
              key={property._id}
              item={property}
            />
          ))}
        </div>

        {/* BOTTOM NAV MAIN ACTION VIEW MORE REDIRECT COMPONENT BUTTON */}
        <div className="w-full flex justify-center items-center mt-12">
          <button
            type="button"
            onClick={() => window.location.href = '/properties'}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer border-0 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-0.5 duration-200"
          >
            <span>View More</span>
            <span className="text-sm font-light select-none leading-none mt-[-2px]">→</span>
          </button>
        </div>

      </div>
    </section>
  );
}

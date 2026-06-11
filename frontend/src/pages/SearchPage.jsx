import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, MapPin, SlidersHorizontal, Sliders, Layers, HelpCircle } from "lucide-react"; // 🎯 MODERNIZED: Swapped text emojis for premium vectors
import { getProperties } from "../services/propertyService";
import PropertyCard from "../components/home/PropertyCard";
import Navbar from "@/components/home/Navbar"; // 🎯 MODULAR: Integrated core shell header

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Local interactive filter form controls synchronizer states
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    type: searchParams.get("type") || "All",
    bedrooms: searchParams.get("bedrooms") || "All",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });

  useEffect(() => {
    const executeQueryPipeline = async () => {
      try {
        setLoading(true);
        const queryPayload = {};
        
        // Only append parameters if they contain valid values to keep URL strings short
        if (searchParams.get("search")) queryPayload.search = searchParams.get("search");
        if (searchParams.get("location")) queryPayload.location = searchParams.get("location");
        if (searchParams.get("type")) queryPayload.type = searchParams.get("type");
        if (searchParams.get("bedrooms")) queryPayload.bedrooms = searchParams.get("bedrooms");
        if (searchParams.get("minPrice")) queryPayload.minPrice = searchParams.get("minPrice");
        if (searchParams.get("maxPrice")) queryPayload.maxPrice = searchParams.get("maxPrice");

        const data = await getProperties(queryPayload);
        setProperties(data || []);
      } catch (err) {
        console.error("Search execution failed:", err);
      } finally {
        setLoading(false);
      }
    };

    executeQueryPipeline();
  }, [searchParams]);

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFiltersSubmit = (e) => {
    e.preventDefault();
    const newParams = {};
    
    Object.keys(filters).forEach((key) => {
      if (filters[key] && filters[key] !== "All") {
        newParams[key] = filters[key];
      }
    });
    
    setSearchParams(newParams); // Instantly re-triggers the database query injection hook above
  };

  return (
    // 🎯 TARGET SPEC MULTI-THEME OVERRIDE CANVAS
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen select-none text-left transition-colors duration-200 pb-24 flex flex-col">
      
      <Navbar />

      {/* 🎯 MAIN CANVASES FRAMEWORK ENVELOPE: Locked precisely to your global 1320px constraints */}
      <section className="max-w-[1320px] mx-auto w-full px-4 pt-12 flex-1 flex flex-col justify-start">
        
        {/* LEFT FLUSH HEADER COMPONENT ROW WITH ACCENT LINE */}
        <div className="mb-10 relative inline-block max-w-max">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full mb-3 block w-max">
            Query Interface
          </span>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-white tracking-tight pb-3">
            Marketplace <span className="text-blue-600 dark:text-blue-500">Search Engine</span>
          </h1>
          <div className="absolute bottom-0 left-0 w-1/4 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full" />
        </div>

        {/* Advanced Filtration Form Row Sidebar/Banner Container */}
        {/* 🛠️ UPGRADED PANELS: Swapped hard dark sheets for crisp white layers matching your properties filters view config */}
        <form 
          onSubmit={applyFiltersSubmit} 
          className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 shadow-sm w-full items-end"
        >
          <div>
            <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Search Keyword</label>
            <input 
              type="text" 
              name="search" 
              value={filters.search} 
              onChange={handleInputChange} 
              placeholder="e.g. Modern, Pool..." 
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all" 
            />
          </div>
          
          <div>
            <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Location City</label>
            <input 
              type="text" 
              name="location" 
              value={filters.location} 
              onChange={handleInputChange} 
              placeholder="e.g. New York, London..." 
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all" 
            />
          </div>
          
          <div>
            <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Property Type</label>
            <select 
              name="type" 
              value={filters.type} 
              onChange={handleInputChange} 
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-700 dark:text-slate-200 font-bold outline-none focus:border-blue-500 cursor-pointer transition-colors"
            >
              <option value="All">All Categories</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Hotel">Hotel</option>
              <option value="Warehouse">Warehouse</option>
            </select>
          </div>
          
          <div>
            <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Bedrooms</label>
            <select 
              name="bedrooms" 
              value={filters.bedrooms} 
              onChange={handleInputChange} 
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-700 dark:text-slate-200 font-bold outline-none focus:border-blue-500 cursor-pointer transition-colors"
            >
              <option value="All">Any Count</option>
              <option value="1">1 Bed</option>
              <option value="2">2 Beds</option>
              <option value="3">3 Beds</option>
              <option value="4">4+ Beds</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Min Price ($)</label>
              <input 
                type="number" 
                name="minPrice" 
                value={filters.minPrice} 
                onChange={handleInputChange} 
                placeholder="Min" 
                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 transition-all" 
              />
            </div>
            <div>
              <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Max Price ($)</label>
              <input 
                type="number" 
                name="maxPrice" 
                value={filters.maxPrice} 
                onChange={handleInputChange} 
                placeholder="Max" 
                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 transition-all" 
              />
            </div>
          </div>
          
          <div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-widest py-3 rounded-xl transition-all shadow-md shadow-blue-600/10 cursor-pointer flex items-center justify-center gap-1.5 h-10 border-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Apply Filters</span>
            </button>
          </div>
        </form>
        {/* Query Yield Results Map Layout Section */}
        {loading ? (
          /* 🛠️ UPGRADED LOADING SKELETONS: Styled as 4 matching columns matching the properties directory grid blueprints */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full justify-items-center">
            {[1, 2, 3, 4].map((s) => (
              <div 
                key={s} 
                className="w-full max-w-[380px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 h-80 animate-pulse flex flex-col items-center justify-center p-6 text-slate-400 dark:text-slate-600 font-bold text-xs uppercase tracking-widest rounded-2xl shadow-xs"
              >
                <Sliders className="w-5 h-5 mb-2 text-slate-300 dark:text-slate-700 animate-spin" />
                <span>Executing Pipeline Query...</span>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          /* Empty Search Notification Shell Block Layout */
          <div className="text-center py-24 border border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-900/40 shadow-sm max-w-[600px] w-full mx-auto my-auto flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center rounded-xl text-slate-400 dark:text-slate-500 mb-4 shadow-sm">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight">No Properties Found</h2>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-1 max-w-[260px] leading-relaxed">
              Zero dataset attributes match those parameters inside MongoDB collections. Try refining your filters.
            </p>
          </div>
        ) : (
          /* 📊 MULTI-COLUMN RESPONSIVE LAYOUT MATRIX GRID (grid-cols-1 sm:grid-cols-2 lg:grid-cols-4) */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center sm:justify-items-start w-full">
            {properties.map((item) => (
              <PropertyCard key={item._id} item={item} />
            ))}
          </div>
        )}

      </section>
    </div>
  );
}

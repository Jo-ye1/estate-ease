import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Home as HomeIcon, ChevronDown, DollarSign, Layers } from "lucide-react";
import heroBg from "../../assets/hero-bg.jpg";


const REAL_LOCATIONS = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Miami, FL",
  "San Francisco, CA",
  "Seattle, WA",
  "Austin, TX",
  "Boston, MA"
];

const PROPERTY_TYPES = [
  { label: "All Categories", slug: "All" },
  { label: "House", slug: "house" },
  { label: "Apartment", slug: "apartment" },
  { label: "Villa", slug: "villa" },
  { label: "Hotel Block", slug: "hotel" },
  { label: "Office Space", slug: "office" },
  { label: "Commercial Land", slug: "land" }
];

export default function Hero() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sale");
  const [searchQuery, setSearchQuery] = useState({ location: "", propertyCategory: "All", maxPrice: "" });
  
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);

  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const typeDropdownRef = useRef(null);

  const handleLocationInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery({ ...searchQuery, location: value });

    if (value.trim().length > 0) {
      const matched = REAL_LOCATIONS.filter((loc) =>
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocations(matched);
      setShowSuggestions(true);
    } else {
      setFilteredLocations([]);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
        setShowTypeDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const executeHeroSearchSubmit = (e) => {
    e.preventDefault();
    const parameters = new URLSearchParams();
    
    if (activeTab) parameters.set("listingType", activeTab);
    if (searchQuery.location) parameters.set("location", searchQuery.location);
    if (searchQuery.propertyCategory !== "All") parameters.set("propertyCategory", searchQuery.propertyCategory);
    if (searchQuery.maxPrice) parameters.set("maxPrice", searchQuery.maxPrice);
    
    navigate(`/properties?${parameters.toString()}`);
  };

  const selectedTypeLabel = PROPERTY_TYPES.find(t => t.slug === searchQuery.propertyCategory)?.label || "All Categories";

  return (
  <section className="max-w-[1320px] mx-auto px-4 my-12 select-none relative">
    {/* 🎯 FIXED: Removed overflow-hidden from the banner container box to prevent clipping */}
    <div className="relative w-full h-[620px] rounded-[32px] bg-slate-950 flex items-center px-12 lg:px-20">      
      
      {/* 📷 BACKGROUND IMAGE LAYER WITH MATCHING MATCHING ROUNDED CORNERS */}
      <div className="absolute inset-0 w-full h-full z-0 rounded-[32px] overflow-hidden">
        <img 
          src={heroBg} 
          alt="Premium Building Facade" 
          className="absolute inset-0 w-full h-full object-cover object-center z-0" 
        />
        <div className="absolute inset-0 bg-slate-950/60 dark:bg-slate-950/80 z-0" />
      </div>

      <div className="relative z-30 w-full max-w-[680px] flex flex-col justify-center">
        
        <div className="text-left">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 dark:text-blue-300 bg-blue-500/20 px-3 py-1.5 rounded-md mb-2 inline-block shadow-xs">
            Premium Corporate Real Estate
          </span>
          
          <h1 className="text-5xl lg:text-[56px] font-black tracking-tight leading-[1.1] mt-6 text-white">
            Find Your Best <br />
            <span className="text-blue-400 dark:text-blue-500">Real Estate</span>
          </h1>

          <p className="text-xs lg:text-sm text-slate-300 dark:text-slate-400 font-medium leading-relaxed mt-6 max-w-[480px]">
            Discover premium active workspaces, commercial lands, residential modules, and exclusive stay hotel suites managed cleanly via our integrated database node architecture.
          </p>
        </div>

        <div className="h-[65px]" />

        <div className="relative w-full max-w-[655px]">
          
          <div className="flex gap-1 absolute -top-[36px] left-0 z-20">
            <button
              type="button"
              onClick={() => setActiveTab("sale")}
              className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-t-xl transition-all border-0 cursor-pointer ${
                activeTab === "sale"
                  ? "bg-blue-600 text-white shadow-md" 
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400"
              }`}
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("rent")}
              className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-t-xl transition-all border-0 cursor-pointer ${
                activeTab === "rent"
                  ? "bg-blue-600 text-white shadow-md" 
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400"
              }`}
            >
              Rent
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("hotel")}
              className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-t-xl transition-all border-0 cursor-pointer ${
                activeTab === "hotel"
                  ? "bg-blue-600 text-white shadow-md" 
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400"
              }`}
            >
              Hotel Stay
            </button>
          </div>

          <form 
            onSubmit={executeHeroSearchSubmit} 
            className="w-full bg-white/10 dark:bg-slate-950/25 backdrop-blur-md border border-white/20 dark:border-slate-800/40 p-2.5 rounded-2xl rounded-tl-none flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xl relative z-20"
          >
            
            <div 
              className="w-full md:flex-1 h-[46px] bg-white dark:bg-slate-900 rounded-xl px-3 flex items-center justify-between gap-2 shadow-sm border border-slate-100 dark:border-slate-800/80 relative" 
              ref={suggestionRef}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <MapPin size={14} className="text-slate-400 shrink-0" />
                <div className="w-full text-left">
                  <label className="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">Location</label>
                  <input 
                    type="text" 
                    placeholder="Enter address city..." 
                    value={searchQuery.location} 
                    onChange={handleLocationInputChange}
                    onFocus={() => searchQuery.location.trim().length > 0 && setShowSuggestions(true)}
                    className="w-full text-xs font-bold text-slate-800 dark:text-slate-100 bg-transparent outline-none mt-0.5 truncate placeholder-slate-400 border-0 p-0" 
                  />
                </div>
              </div>
              <ChevronDown size={12} className="text-slate-400 shrink-0 pointer-events-none" />
              
              {showSuggestions && filteredLocations.length > 0 && (
                <div className="absolute left-0 right-0 top-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-40 overflow-y-auto z-50 py-1 text-xs text-left w-full">
                  {filteredLocations.map((loc, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setSearchQuery({ ...searchQuery, location: loc });
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border-0 bg-transparent text-slate-700 dark:text-slate-300 font-bold"
                    >
                      📍 {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div 
              className="w-full md:flex-1 h-[46px] bg-white dark:bg-slate-900 rounded-xl px-3 flex items-center justify-between gap-2 shadow-sm border border-slate-100 dark:border-slate-800/80 relative cursor-pointer" 
              ref={typeDropdownRef}
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Layers size={14} className="text-slate-400 shrink-0" />
                <div className="w-full text-left">
                  <label className="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">Property Type</label>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5 truncate">
                    {selectedTypeLabel}
                  </div>
                </div>
              </div>
              <ChevronDown size={12} className="text-slate-400 shrink-0 pointer-events-none" />
              
              {showTypeDropdown && (
                /* 🎯 FIXED: Adjusted sizing to match individual column parameters width perfectly */
                <div className="absolute left-0 w-full top-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-48 overflow-y-auto z-50 py-1 text-xs text-left">
                  {PROPERTY_TYPES.map((type, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchQuery({ ...searchQuery, propertyCategory: type.slug });
                        setShowTypeDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border-0 bg-transparent text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5"
                    >
                      <span>🏢</span>
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full md:flex-1 h-[46px] bg-white dark:bg-slate-900 rounded-xl px-3 flex items-center justify-between gap-2 shadow-sm border border-slate-100 dark:border-slate-800/80 relative">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <DollarSign size={14} className="text-slate-400 shrink-0" />
                <div className="w-full text-left">
                  <label className="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">Price Range</label>
                  <input 
                    type="number" 
                    name="maxPrice"
                    placeholder="Max Budget ($)" 
                    value={searchQuery.maxPrice}
                    onChange={(e) => setSearchQuery({ ...searchQuery, maxPrice: e.target.value })}
                    className="w-full text-xs font-bold text-slate-800 dark:text-slate-100 bg-transparent outline-none mt-0.5 truncate placeholder-slate-400 border-0 p-0" 
                  />
                </div>
              </div>
              <ChevronDown size={12} className="text-slate-400 shrink-0 pointer-events-none" />
            </div>
            
            <button
              type="submit"
              className="w-full md:w-auto h-[46px] px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer border-0 shadow-md shadow-blue-600/20 shrink-0"
            >
              <Search size={14} />
              <span>Search</span>
            </button>

          </form>
        </div>
      </div>
    </div>
  </section>
);
}
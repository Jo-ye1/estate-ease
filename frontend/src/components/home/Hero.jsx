import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Home as HomeIcon, DollarSign, ChevronDown } from "lucide-react";
import heroBg from "../../assets/hero-bg.jpg";

// 📍 REAL LOCATION DATA DICTIONARY
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

// 🏢 PROPERTY TYPE OPTIONS DICTIONARY
const PROPERTY_TYPES = ["All", "House", "Apartment", "Villa"];

export default function Hero() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Buy");
  const [searchQuery, setSearchQuery] = useState({ location: "", type: "All", maxPrice: "" });
  
  // 🗺️ Location Auto-Suggestion States
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);

  // 🏢 Custom Property Dropdown Menu States
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const typeDropdownRef = useRef(null);

  // Monitor location text input adjustments to suggest real locations dynamically
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

  // Close suggestion and type dropdown dialog panels when clicking outside
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
    if (searchQuery.location) parameters.set("location", searchQuery.location);
    if (searchQuery.type !== "All") parameters.set("type", searchQuery.type);
    if (searchQuery.maxPrice) parameters.set("maxPrice", searchQuery.maxPrice);
    navigate(`/properties?${parameters.toString()}`);
  };


  
 return (
  <section className="max-w-[1320px] mx-auto px-4 my-12 select-none relative">
    
    {/* 🏢 MAIN BANNER CONTAINER: Fixed to exactly 620px height */}
<div className="relative w-full h-[620px] rounded-[32px] overflow-hidden bg-slate-950 flex items-center px-12 lg:px-20">      
      {/* 📷 BACKGROUND IMAGE LAYER */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img 
      src={heroBg} 
      alt="Premium Building Mockup Facade" 
     className="absolute inset-0 w-full h-full object-cover object-center z-0" 
      />
<div className="absolute inset-0 bg-slate-950/40 z-0" /></div>

      {/* 🏢 LEFT ALIGNED CONTENT PANEL */}
      <div className="relative z-10 w-full max-w-[680px] flex flex-col justify-center">
        
        {/* Subtitle Badge */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md shadow-sm">
            A Vision for Your Life
          </span>
          
          {/* Headline: Scaled text sizes for a prominent 1320x620 frame */}
<h1 className="text-5xl lg:text-[56px] font-black tracking-tight leading-[1.1] mt-6 text-white relative z-10">
  Find Your Best <br />
  <span className="text-blue-400">Real Estate</span>
</h1>

<p className="text-sm text-slate-200 font-medium leading-relaxed mt-6 max-w-[480px] relative z-10">
  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit...
</p>

        </div>

        {/* Spacer before the search block */}
        <div className="h-[50px]" />

        {/* 🔍 FLOATING SEARCH PIPELINE CAPSULE */}
        <div className="relative w-full max-w-[655px]">
          
          {/* Active Switch Tab Labels Bar */}
          <div className="flex gap-1 absolute -top-[32px] left-0 z-20">
            {["Buy", "Sell", "Rent"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab === "Sell" ? "List" : tab)}
                className={`px-6 py-2 text-xs font-bold rounded-t-xl transition-all border-0 cursor-pointer ${
                  (activeTab === tab || (activeTab === "List" && tab === "Sell"))
                    ? "bg-blue-600 text-white shadow-md" 
                    : "bg-white text-slate-600 border border-b-0 border-slate-200"
                }`}
              >
                {tab === "Sell" ? "Sell" : tab}
              </button>
            ))}
          </div>

          {/* 🎯 SOLID RECTANGULAR SEARCH MATRIX: Changed to solid white background with uniform padding */}
          {/* 🔍 GLASSY TRAY OVERLAY CONTAINER */}
<form 
  onSubmit={executeHeroSearchSubmit} 
  className="w-full bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-xl rounded-tl-none flex items-center justify-between gap-3 shadow-2xl relative z-10"
>
  
  {/* 🏢 FIELD 1: STANDALONE WHITE CARD BLOCK */}
  <div 
    className="flex-1 h-[46px] bg-white rounded-lg px-3 flex items-center justify-between gap-2 shadow-sm border border-slate-100 relative" 
    ref={suggestionRef}
  >
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <MapPin size={14} className="text-slate-400 shrink-0" />
      <div className="w-full text-left">
        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-wider leading-none">Location</label>
        <input 
          type="text" 
          placeholder="Location" 
          value={searchQuery.location} 
          onChange={handleLocationInputChange}
          onFocus={() => searchQuery.location.trim().length > 0 && setShowSuggestions(true)}
          className="w-full text-xs font-bold text-slate-800 bg-transparent outline-none mt-0.5 truncate placeholder-slate-400 border-0 p-0" 
        />
      </div>
    </div>
    <span className="text-[9px] text-slate-400 pointer-events-none select-none shrink-0">▼</span>
    
    {showSuggestions && filteredLocations.length > 0 && (
      <div className="absolute left-0 right-0 top-13 bg-white border border-slate-200 rounded-lg shadow-xl max-h-40 overflow-y-auto z-50 py-1 text-xs text-slate-700">
        {filteredLocations.map((loc, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setSearchQuery({ ...searchQuery, location: loc });
              setShowSuggestions(false);
            }}
            className="w-full text-left px-3 py-2 hover:bg-slate-50 cursor-pointer border-0 bg-transparent text-slate-700"
          >
            📍 {loc}
          </button>
        ))}
      </div>
    )}
  </div>
  
  {/* 🏢 FIELD 2: STANDALONE WHITE CARD BLOCK */}
  <div 
    className="flex-1 h-[46px] bg-white rounded-lg px-3 flex items-center justify-between gap-2 shadow-sm border border-slate-100 relative" 
    ref={typeDropdownRef}
  >
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <HomeIcon size={14} className="text-slate-400 shrink-0" />
      <div className="w-full text-left">
        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-wider leading-none">Property Type</label>
        <button
          type="button"
          onClick={() => setShowTypeDropdown(!showTypeDropdown)}
          className="w-full text-xs font-bold text-slate-800 bg-transparent outline-none flex items-center justify-between cursor-pointer border-0 p-0 text-left mt-0.5"
        >
          <span className="truncate">{searchQuery.type === "All" ? "Property" : searchQuery.type}</span>
        </button>
      </div>
    </div>
    <span className="text-[9px] text-slate-400 pointer-events-none select-none shrink-0">▼</span>
    
    {showTypeDropdown && (
      <div className="absolute left-0 right-0 top-[50px] bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1 text-xs text-slate-700 overflow-hidden">
        {PROPERTY_TYPES.map((typeOption) => (
          <button
            key={typeOption}
            type="button"
            onClick={() => {
              setSearchQuery({ ...searchQuery, type: typeOption });
              setShowTypeDropdown(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors border-0 bg-transparent"
          >
            {typeOption}
          </button>
        ))}
      </div>
    )}
  </div>

  {/* 🏢 FIELD 3: STANDALONE WHITE CARD BLOCK */}
  <div className="flex-1 h-[46px] bg-white rounded-lg px-3 flex items-center justify-between gap-2 shadow-sm border border-slate-100 relative">
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <span className="text-slate-400 font-bold text-xs shrink-0">$</span>
      <div className="w-full text-left">
        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-wider leading-none">Price</label>
        <input 
          type="text" 
          placeholder="Price" 
          className="w-full text-xs font-bold text-slate-800 bg-transparent outline-none mt-0.5 truncate placeholder-slate-400 border-0 p-0" 
        />
      </div>
    </div>
    <span className="text-[9px] text-slate-400 pointer-events-none select-none shrink-0">▼</span>
  </div>
  
  {/* 🔍 BLUE TARGET ACTION BUTTON */}
  <button
    type="submit"
    className="h-[46px] px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer border-0 shadow-md shadow-blue-600/20 shrink-0"
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
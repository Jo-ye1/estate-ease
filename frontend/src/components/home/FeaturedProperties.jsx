import { useEffect, useState } from "react";
import { getProperties } from "@/services/propertyService";

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        
        // Step A: Load your standard backend server database array list
        const dbData = await getProperties();
        const baseProperties = Array.isArray(dbData) ? dbData : [];
        
        // Step B: 👑 MULTI-SOURCE SYNC: Pull your Add Property Wizard creations from browser memory
        const storedProperties = localStorage.getItem("estate_ease_properties");
        const cachedProperties = storedProperties ? JSON.parse(storedProperties) : [];
        
        // Step C: Combine both collections cleanly to feed into your horizontal carousel track
        setProperties([...cachedProperties, ...baseProperties]);
      } catch (error) {
        console.error("Failed to load featured properties:", error);
        
        // Safe local storage fallback if network is offline
        const storedProperties = localStorage.getItem("estate_ease_properties");
        if (storedProperties) setProperties(JSON.parse(storedProperties));
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const fallbackProperties = [
    { _id: "f1", title: "A Modern House Accentuates", location: "4059 Waterview Texico, NM 88135", price: 850, status: "For Sale", images: [] },
    { _id: "f2", title: "Capital Hill Residence in New Your", location: "1758 Lake Floyd Circle, DE 19707", price: 1050, status: "For Sale", images: [] },
    { _id: "f3", title: "A Modern House Accentuates", location: "3994 Jewell Road, MN 55402", price: 1200, status: "For Sale", images: [] },
    { _id: "f4", title: "Premium Luxury Villa Concept", location: "102 Barrington Court, AR 72601", price: 2400, status: "For Rent", images: [] }
  ];

  const activeList = properties.length > 0 ? properties : fallbackProperties;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, activeList.length - 3) : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= activeList.length - 3 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <section className="w-full bg-slate-50 dark:bg-slate-950 py-16 text-left border-t border-b border-slate-100 dark:border-slate-900/60">
        <div className="max-w-[1320px] mx-auto px-4">
          <div className="w-full h-[375px] bg-slate-200/60 dark:bg-slate-900 animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-slate-50 dark:bg-slate-950 border-t border-b border-slate-100 dark:border-slate-900/60 py-16 select-none transition-colors duration-200">
      
      {/* 🎯 TARGET CONTAINER WIDTH (1320px row layout canvas envelope) */}
      <div className="max-w-[1320px] mx-auto px-4 text-left">
        
        {/* LEFT FLUSH HEADER COMPONENT ROW WITH ACCENT LINE */}
        <div className="mb-10 relative inline-block max-w-max text-left">
          <h2 className="text-2xl lg:text-3xl font-black text-slate-800 dark:text-white tracking-tight pb-3">
            Featured <span className="text-blue-600 dark:text-blue-500">Properties</span>
          </h2>
          <div className="absolute bottom-0 left-0 w-2/3 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full" />
        </div>

        {/* HORIZONTAL CAROUSEL WINDOW CONTAINER */}
        <div className="overflow-hidden w-full relative">
          <div 
            className="flex gap-6 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (424 + 24)}px)` }}
          >
            {activeList.map((item) => {
              
              // 👑 FIXED: Intercept single string parameters (item.image) and plural database lists (item.images) cleanly!
              const displayImage = (() => {
                const rawImage = item.image || (item.images && item.images.length > 0 ? item.images[0] : "");
                if (rawImage && rawImage.trim() !== "") {
                  return rawImage.startsWith("http") || rawImage.startsWith("data:") ? rawImage : `http://localhost:5000${rawImage}`;
                }
                return "https://unsplash.com";
              })();

              const listingStatus = item.status || "For Sale";

              return (
                <div
                  key={item._id || item.id}
                  className="w-[424px] h-[375px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-4.5 flex flex-col justify-between shadow-[0_4px_25px_rgba(0,0,0,0.01)] dark:shadow-black/10 shrink-0 group cursor-pointer hover:shadow-md transition-shadow duration-300 rounded-2xl"
                >
                  <div className="w-[388px] h-[225px] overflow-hidden bg-slate-100 dark:bg-slate-950 shrink-0 mx-auto rounded-xl">
                    <img
                      src={displayImage}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://unsplash.com";
                      }}
                    />
                  </div>

                  {/* TWO-COLUMN DETAILS DATA DECK ROW */}
                  <div className="w-[388px] flex justify-between gap-4 mt-3 items-stretch mx-auto pb-1">
                    
                    {/* LEFT TEXT FIELD METADATA STRINGS */}
                    <div className="flex flex-col justify-between flex-1 min-w-0 text-left">
                      <div>
                        <div className="w-[281px] h-[23px] flex items-center overflow-hidden">
                          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 tracking-tight leading-none truncate group-hover:text-blue-600 transition-colors uppercase">
                            {item.title}
                          </h3>
                        </div>

                        <div className="w-[239px] h-[19px] flex items-center gap-1 mt-1 text-slate-400 dark:text-slate-500 overflow-hidden">
                          <span className="text-[10px] shrink-0 leading-none">📍</span>
                          <p className="text-[10.5px] font-bold uppercase truncate tracking-wide leading-none text-slate-400">
                            {item.location || item.address || "Location not provided"}
                          </p>
                        </div>
                      </div>

                      <div className="w-[96px] h-[16px] flex items-center gap-0.5 text-amber-400 text-[11px] mt-2 select-none overflow-hidden leading-none shrink-0">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <span key={idx} className="leading-none">★</span>
                        ))}
                      </div>
                    </div>

                    {/* RIGHT BADGES & VALUES ACTIONS LAYER */}
                    <div className="flex flex-col justify-between items-end shrink-0">
                      
                      <div className="w-[65px] h-[18px] flex items-center justify-center bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-100/40 dark:border-emerald-900/30 overflow-hidden rounded-md">
                        <span className="text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-wider leading-none">
                          {listingStatus}
                        </span>
                      </div>

                      <div className="min-w-[110px] w-auto h-[27px] flex items-center justify-end overflow-hidden">
                        <span className="text-base font-black text-slate-800 dark:text-white leading-none whitespace-nowrap">
                          ${item.price ? item.price.toLocaleString() : "0"}
                        </span>
                      </div>

                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* SLIDER CONTROLLER BUTTON ARROWS PANEL */}
        <div className="w-full flex justify-center items-center gap-6 mt-10">
          <button
            type="button"
            onClick={handlePrev}
            className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800/80 text-blue-600 dark:text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800 font-bold text-sm flex items-center justify-center transition-colors bg-white dark:bg-slate-900 shadow-sm cursor-pointer border-0 outline-none"
          >
            ◀
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800/80 text-blue-600 dark:text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800 font-bold text-sm flex items-center justify-center transition-colors bg-white dark:bg-slate-900 shadow-sm cursor-pointer border-0 outline-none"
          >
            ▶
          </button>
        </div>

      </div>
    </section>
  );
}

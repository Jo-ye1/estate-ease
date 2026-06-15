import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import { getProperties } from "@/services/propertyService";

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const dbData = await getProperties();
        const baseProperties = Array.isArray(dbData) ? dbData : [];
        
        const storedProperties = localStorage.getItem("estate_ease_properties");
        const cachedProperties = storedProperties ? JSON.parse(storedProperties) : [];
        
        setProperties([...cachedProperties, ...baseProperties]);
      } catch (error) {
        console.error("Failed to load featured properties:", error);
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
    { _id: "f2", title: "Capital Hill Residence in New York", location: "1758 Lake Floyd Circle, DE 19707", price: 1050, status: "For Sale", images: [] },
    { _id: "f3", title: "A Modern House Accentuates", location: "3994 Jewell Road, MN 55402", price: 1200, status: "For Sale", images: [] }
  ];

  const activeList = properties.length > 0 ? properties : fallbackProperties;
  const maxIndex = Math.max(0, activeList.length - 3);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <section className="w-full bg-slate-50 dark:bg-slate-950 py-16 text-left border-t border-b border-slate-100 dark:border-slate-900/60">
        <div className="max-w-[1320px] mx-auto px-4">
          <div className="w-full h-[375px] bg-slate-200/60 dark:bg-slate-900 animate-pulse rounded-2xl" />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-slate-50 dark:bg-slate-950 border-t border-b border-slate-100 dark:border-slate-900/60 py-16 select-none text-left transition-colors duration-200">
      <div className="max-w-[1320px] mx-auto px-4 text-left">
        
        {/* HEADER SECTION ROW */}
        <div className="mb-10 relative inline-block max-w-max text-left">
          <h2 className="text-2xl lg:text-3xl font-black text-slate-800 dark:text-white tracking-tight pb-3">
            Featured <span className="text-blue-600 dark:text-blue-500">Properties</span>
          </h2>
          <div className="absolute bottom-0 left-0 w-2/3 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full" />
        </div>

        {/* HORIZONTAL CAROUSEL MASK WINDOW */}
        <div className="overflow-hidden w-full relative">
          <div 
            className="flex transition-transform duration-500 ease-in-out w-full"
            style={{ 
              transform: `translateX(-${currentIndex * (100 / Math.min(3, activeList.length)) === 0 ? 0 : currentIndex * (100 / 3)}%)`
            }}
          >
            {activeList.map((item) => {
              const displayImage = (() => {
                const rawImage = item.image || (item.images && item.images.length > 0 ? item.images[0] : "");
                if (rawImage && typeof rawImage === 'string' && rawImage.trim() !== "") {
                  return rawImage.startsWith("http") || rawImage.startsWith("data:") ? rawImage : `http://localhost:5000${rawImage}`;
                }
                return "https://unsplash.com";
              })();

              const listingStatus = item.status || "For Sale";

              return (
                <div
                  key={item._id || item.id}
                  className="w-full sm:w-1/2 lg:w-1/3 p-3 shrink-0 box-border block"
                >
                  {/* 👑 FIXED CONTENT LAYOUT CARD WRAPPER CONTAINER */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 flex flex-col justify-between shadow-[0_4px_25px_rgba(0,0,0,0.01)] dark:shadow-black/10 h-[395px] rounded-2xl hover:shadow-md transition-shadow duration-300 relative">
                    
                    {/* 📷 FIXED LINK IMAGE VIEWPORT BOX OVERLAY FRAME */}
                    <div className="w-full h-[210px] overflow-hidden bg-slate-100 dark:bg-slate-950 shrink-0 rounded-xl relative">
                      <Link 
                        to={`/properties/${item._id || item.id}`}
                        className="absolute inset-0 block w-full h-full z-20"
                      >
                        <img
                          src={displayImage}
                          alt={item.title || "Featured Asset"}
                          loading="lazy"
                          className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-103"
                          onError={(e) => {
                            e.currentTarget.src = "https://unsplash.com";
                          }}
                        />
                      </Link>
                    </div>

                    {/* DETAILS TEXT FIELDS LAYER */}
                    <div className="w-full flex flex-col gap-2 mt-3 text-left">
                      <div className="w-full h-[22px] flex items-center overflow-hidden">
                        <Link to={`/properties/${item._id || item.id}`} className="no-underline hover:underline block truncate w-full">
                          <h3 className="font-black text-sm text-slate-800 dark:text-slate-100 tracking-tight leading-none truncate hover:text-blue-600 transition-colors uppercase">
                            {item.title}
                          </h3>
                        </Link>
                      </div>

                      <div className="w-full h-[18px] flex items-center gap-1 text-slate-400 dark:text-slate-500 overflow-hidden">
                        <span className="text-[10px] shrink-0 leading-none">📍</span>
                        <p className="text-[10.5px] font-bold uppercase truncate tracking-wide leading-none text-slate-400 dark:text-slate-500">
                          {item.location || item.address || "Location not provided"}
                        </p>
                      </div>

                      <div className="w-full h-[1px] bg-slate-100 dark:bg-slate-800/40 my-1" />

                      <div className="w-full grid grid-cols-2 items-center mt-0.5">
                        <div className="flex items-center gap-2 justify-start min-w-0">
                          <div className="px-1.5 h-[18px] flex items-center justify-center bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-100/40 dark:border-emerald-900/30 overflow-hidden rounded-md shrink-0">
                            <span className="text-emerald-600 dark:text-emerald-400 text-[8.5px] font-black uppercase tracking-wider leading-none">
                              {listingStatus}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5 text-amber-400 text-[9px] select-none leading-none shrink-0">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <span key={idx} className="leading-none">★</span>
                            ))}
                          </div>
                        </div>

                        <div className="w-full flex items-center justify-end overflow-visible">
                          <span className="text-base font-black text-blue-600 dark:text-blue-500 leading-none whitespace-nowrap tracking-tight">
                            ${item.price ? Number(item.price).toLocaleString() : "0"}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DIRECTIONAL CONTROLS BUTTON TRACK */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button 
            type="button"
            onClick={handlePrev}
            className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-0 outline-none"
          >
            ←
          </button>
          <button 
            type="button"
            onClick={handleNext}
            className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-0 outline-none"
          >
            →
          </button>
        </div>

      </div>
    </section>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Building2, Hotel, Palmtree, Warehouse, Briefcase, Globe } from "lucide-react"; 
import { getProperties } from "@/services/propertyService";

export default function PropertyTypes() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(1);
  
  const [counts, setCounts] = useState({ House: 0, Apartment: 0, Hotel: 0, Villa: 0, Office: 0, Land: 0 });

  useEffect(() => {
    const calculateLiveInventoryMetrics = async () => {
      try {
        let dbData = [];
        try { dbData = await getProperties(); } catch (e) {}
        const baseProperties = Array.isArray(dbData) ? dbData : [];

        const storedProperties = localStorage.getItem("estate_ease_properties");
        const cachedProperties = storedProperties ? JSON.parse(storedProperties) : [];

        const totalCollection = [...cachedProperties, ...baseProperties];

        const metricsMap = totalCollection.reduce((acc, item) => {
          const categoryField = item.propertyCategory || item.type || "";
          const currentType = categoryField.toUpperCase();
          
          if (currentType === "HOUSE") acc.House += 1;
          if (currentType === "APARTMENT") acc.Apartment += 1;
          if (currentType === "HOTEL") acc.Hotel += 1;
          if (currentType === "VILLA") acc.Villa += 1;
          if (currentType === "OFFICE") acc.Office += 1;
          if (currentType === "LAND") acc.Land += 1;
          return acc;
        }, { House: 0, Apartment: 0, Hotel: 0, Villa: 0, Office: 0, Land: 0 });

        setCounts(metricsMap);
      } catch (err) {
        console.error("Failed to compute dynamic property category totals:", err);
      }
    };
    calculateLiveInventoryMetrics();
  }, []);

  const formatsList = [
    { label: "House", count: `${counts.House} Listings`, icon: Home, slug: "house" },
    { label: "Apartment", count: `${counts.Apartment} Listings`, icon: Building2, slug: "apartment" },
    { label: "Villa", count: `${counts.Villa} Listings`, icon: Palmtree, slug: "villa" },
    { label: "Hotel Block", count: `${counts.Hotel} Listings`, icon: Hotel, slug: "hotel" }, 
    { label: "Office Space", count: `${counts.Office} Listings`, icon: Briefcase, slug: "office" },
    { label: "Commercial Land", count: `${counts.Land} Listings`, icon: Globe, slug: "land" },
  ];

  return (
    <section className="max-w-[1320px] mx-auto px-4 my-16 select-none text-left">
      <div className="w-full flex flex-col relative bg-transparent transition-colors duration-200">
        
        <div className="mb-12 relative inline-block max-w-max">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight pb-3">
            Property <span className="text-blue-600 dark:text-blue-500">Types</span>
          </h2>
          <div className="absolute bottom-0 left-0 w-3/4 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 py-6">
          {formatsList.map((category, index) => {
            const IconComponent = category.icon;

            return (
              <div 
                key={index} 
                onClick={() => navigate(`/properties?search=${category.slug}`)}
                className="flex flex-col items-center justify-center text-center cursor-pointer group bg-transparent transform hover:-translate-y-0.5 duration-200"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-b from-white to-slate-50/60 dark:from-slate-800 dark:to-slate-900/60 flex items-center justify-center border border-slate-100 dark:border-slate-800/80 shadow-[0_16px_32px_rgba(11,79,185,0.04)] dark:shadow-[0_16px_32px_rgba(0,0,0,0.3)] relative group-hover:border-blue-500/40 transition-colors">
                  <IconComponent className="w-7 h-7 text-blue-600 dark:text-blue-400 stroke-[1.8] filter drop-shadow-[0_2px_4px_rgba(11,79,185,0.1)] group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none" />
                </div>
                
                <h4 className="font-bold text-xs mt-4 text-slate-800 dark:text-slate-200 tracking-tight">
                  {category.label}
                </h4>
                
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 px-3 py-0.5 rounded-full mt-2 tracking-wide shadow-xs group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {category.count}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center items-center gap-1.5 mt-10">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSlide(idx)}
              className={`transition-all duration-300 cursor-pointer border-0 p-0 flex items-center justify-center outline-none ${
                activeSlide === idx 
                  ? "w-2.5 h-2.5 bg-blue-600 rotate-45" 
                  : "w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"
              }`}
              style={{ borderRadius: activeSlide === idx ? '0px' : '50%' }}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

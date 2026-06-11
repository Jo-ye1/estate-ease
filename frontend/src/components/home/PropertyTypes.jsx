import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Building2, Hotel, BedDouble, Warehouse } from "lucide-react"; 

export default function PropertyTypes() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(1);

  const formatsList = [
    { label: "Private House", count: "360 Listing", icon: Home, slug: "House" },
    { label: "Apartment", count: "265 Listing", icon: Building2, slug: "Apartment" },
    { label: "Exclusive Hotel", count: "480 Listing", icon: Hotel, slug: "Hotel" }, 
    { label: "Private Room", count: "102 Listing", icon: BedDouble, slug: "Villa" },
    { label: "Warehouse", count: "136 Listing", icon: Warehouse, slug: "Warehouse" },
  ];

  return (
    // 🎯 WRAPPER ENVELOPE: Standardized to sit flush inside your 1320px grid layout
    <section className="max-w-[1320px] mx-auto px-4 my-16 select-none text-left">
      
      <div className="w-full flex flex-col relative bg-transparent transition-colors duration-200">
        
        {/* HEADER SECTION ROW WITH ACCENT LINE */}
        <div className="mb-12 relative inline-block max-w-max">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight pb-3">
            Property <span className="text-blue-600 dark:text-blue-500">Types</span>
          </h2>
          <div className="absolute bottom-0 left-0 w-3/4 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full" />
        </div>

        {/* ITEMS DECK */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 py-6">
          {formatsList.map((category, index) => {
            const IconComponent = category.icon;

            return (
              <div 
                key={index} 
                onClick={() => navigate(`/properties?type=${category.slug}`)}
                className="flex flex-col items-center justify-center text-center cursor-pointer group bg-transparent"
              >
                {/* 🎯 STATIC GLOWING LAYER: Fixed shadows to match your goal reference without requiring any active hover triggers */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-b from-white to-slate-50/60 dark:from-slate-800 dark:to-slate-900/60 flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-[0_16px_32px_rgba(11,79,185,0.08)] dark:shadow-[0_16px_32px_rgba(0,0,0,0.4)] relative">
                  
                  {/* 🎯 SHARP BLUE VECTORS: Clean modern lines with high readability */}
                  <IconComponent className="w-8 h-8 text-blue-600 dark:text-blue-400 stroke-[1.8] filter drop-shadow-[0_2px_4px_rgba(11,79,185,0.1)]" />
                  
                  {/* Frosted Layer Decal */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none" />
                </div>
                
                <h4 className="font-bold text-[14px] mt-5 text-slate-800 dark:text-slate-200 tracking-tight">
                  {category.label}
                </h4>
                
                <span className="text-[10.5px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 px-3.5 py-1 rounded-full mt-2.5 tracking-wide shadow-xs">
                  {category.count}
                </span>
              </div>
            );
          })}
        </div>

        {/* DOT INDICATOR CONTROLS */}
        <div className="flex justify-center items-center gap-1.5 mt-10">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSlide(idx)}
              className={`transition-all duration-300 cursor-pointer border-0 p-0 flex items-center justify-center ${
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

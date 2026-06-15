import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import api from "@/lib/api";

// 🎯 HELPER COMPONENT FOR ANIMATED COUNTER METRICS
function AnimatedCount({ target, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    // Extract only the raw integer characters from strings like "4800+" or "15M+"
    const cleanTarget = target ? target.replace(/[^0-9]/g, "") : "0";
    const end = parseInt(cleanTarget, 10) || 0;
    if (start === end) {
      setCount(end);
      return;
    }

    const duration = 1500;
    const increment = Math.ceil(end / (duration / 16)) || 1; 
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <span className="text-2xl lg:text-3xl font-black text-blue-600 dark:text-blue-500 tracking-tight">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function WhyChooseUs() {
  const [loading, setLoading] = useState(true);

  // --- 1. Dynamic Content State Pools ---
  const [chooseHeading, setChooseHeading] = useState("We Are Offering The Best Real Estate Deals");
  const [chooseP1, setChooseP1] = useState("Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat.");
  const [chooseP2, setChooseP2] = useState("Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae.");
  const [chooseImage, setChooseImage] = useState("");
  
  const [statYears, setStatYears] = useState("12");
  const [statCustomers, setStatCustomers] = useState("4800");
  const [statCapital, setStatCapital] = useState("15");

  const [dealsBullets, setDealsBullets] = useState([
    "A building with only one room and typically a steep pointy roof.",
    "A vehicle on wheels that has a permanent residence attached to it.",
    "Performing financial analysis and valuation of properties.",
    "Someone who examines buildings and works with appraisers.",
    "A dwelling typically made of raw materials such as bamboo, mud, and clay."
  ]);

  // --- 2. 👑 LIVE MERN API CONTENT HYDRATION LAYER ---
  useEffect(() => {
    const fetchLandingDealsData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/admin-settings/home-cms");
        
        if (data) {
          if (data.chooseHeading) setChooseHeading(data.chooseHeading);
          if (data.chooseP1) setChooseP1(data.chooseP1);
          if (data.chooseP2) setChooseP2(data.chooseP2);
          
          if (data.statYears) setStatYears(data.statYears);
          if (data.statCustomers) setStatCustomers(data.statCustomers);
          if (data.statCapital) setStatCapital(data.statCapital);
          
          if (data.bullets && Array.isArray(data.bullets) && data.bullets.length > 0) {
            setDealsBullets(data.bullets);
          }

          if (data.chooseImage && data.chooseImage.trim() !== "") {
            setChooseImage(data.chooseImage.startsWith("http") || data.chooseImage.startsWith("data:")
              ? data.chooseImage 
              : `http://localhost:5000${data.chooseImage}`
            );
          }
        }
      } catch (err) {
        console.warn("Express server unreachable, loading local configurations fallback...", err);
        // Resilient Fallback mapping from client cache records
        setChooseHeading(localStorage.getItem('home_choose_heading') || "We Are Offering The Best Real Estate Deals");
        setChooseP1(localStorage.getItem('home_choose_p1') || "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat.");
        setChooseP2(localStorage.getItem('home_choose_p2') || "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae.");
        
        const savedImage = localStorage.getItem('home_choose_image');
        if (savedImage) setChooseImage(savedImage);

        setStatYears(localStorage.getItem('home_stat_years') || "12");
        setStatCustomers(localStorage.getItem('home_stat_customers') || "4800");
        setStatCapital(localStorage.getItem('home_stat_capital') || "15");

        const savedBullets = localStorage.getItem('home_choose_bullets');
        if (savedBullets) setDealsBullets(JSON.parse(savedBullets));
      } finally {
        setLoading(false);
      }
    };
    fetchLandingDealsData();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-[1259px] mx-auto px-4 my-20 text-center select-none">
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 animate-pulse">Hydrating Landing Deals...</div>
      </div>
    );
  }

  const inlineStats = [
    { target: statYears, suffix: "+", label: "Years Experience" },
    { target: statCustomers, suffix: "+", label: "Happy Customers" },
    { target: statCapital, suffix: "M+", label: "Capital Managed" }
  ];

  return (
    // 🎯 TARGET CANVAS WIDTH (1259px layout envelope)
    <section className="max-w-[1259px] mx-auto px-4 my-20 select-none text-left">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative">
        
        {/* LEFT COLUMN: HEADINGS & BULLET ARROWS */}
        <div className="flex flex-col justify-center order-2 lg:order-1">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-500 mb-3 block">
            Why Choose Us
          </span>
          
          <h2 className="text-3xl lg:text-[38px] font-black tracking-tight leading-[1.15] text-slate-800 dark:text-white max-w-[500px]">
            {chooseHeading}
          </h2>
          
          <div className="text-xs text-slate-400 dark:text-slate-500 space-y-3 mt-6 max-w-[560px] font-medium leading-relaxed">
            {chooseP1 && <p>{chooseP1}</p>}
            {chooseP2 && <p>{chooseP2}</p>}
          </div>

          {/* 📊 INTEGRATED LIVE COUNTER METRICS STRIP */}
          <div className="grid grid-cols-3 gap-4 border-t border-b border-slate-100 dark:border-slate-900/80 py-5 mt-6 max-w-[560px]">
            {inlineStats.map((stat, index) => (
              <div key={index} className="flex flex-col text-left">
                <AnimatedCount target={stat.target} suffix={stat.suffix} />
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1 leading-none">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* ARROW LIST WRAPPER */}
          <div className="mt-6 space-y-3.5 max-w-[560px]">
            {dealsBullets.map((bullet, idx) => (
              <div key={idx} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-xs font-bold tracking-tight">
                <span className="text-blue-600 dark:text-blue-500 text-xs shrink-0 font-light select-none">➔</span>
                <p className="truncate">{bullet}</p>
              </div>
            ))}
          </div>

          {/* TARGET MATCHED BUTTON */}
          <div className="mt-10">
            <Link
              to="/properties"
              className="px-6 h-[40px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center border-0 shadow-md shadow-blue-600/10 cursor-pointer no-underline w-max"
            >
              View More
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: CORNER SLANTED HOUSE IMAGE COMPONENT */}
        <div className="relative flex justify-end items-center p-6 pr-0 order-1 lg:order-2">
          {/* Fixed pattern background decals anchored precisely right behind the container edge */}
          <div className="absolute left-10 bottom-[-24px] w-32 h-44 opacity-20 bg-[radial-gradient(#0b4fb9_1.5px,transparent_1.5px)] [background-size:12px_12px]" />
          
          <div className="relative w-full max-w-[480px] h-[440px] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-800/80 z-10 bg-slate-100 dark:bg-slate-900">
            <img
              src={chooseImage || "https://unsplash.com"}
              alt="Luxury Architecture Facade"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.src = "https://unsplash.com";
              }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
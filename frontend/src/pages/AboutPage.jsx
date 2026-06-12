import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import { ShieldCheck, Eye, Users, ArrowRight } from "lucide-react"; 
import Navbar from "@/components/home/Navbar"; 

export default function AboutPage() {
  // --- 1. Pull live LocalStorage strings directly into reactive states instantly ---
  const [heading, setHeading] = useState(() => localStorage.getItem('about_heading') || "About the Estate Ease Engine");
  const [subheading, setSubheading] = useState(() => localStorage.getItem('about_subheading') || "We are redefining how clients interact with corporate real-estate ecosystems.");
  const [paragraph, setParagraph] = useState(() => localStorage.getItem('about_paragraph') || "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.");
  
  // Pull Base64 top hero banner photo string directly from browser memory
  const [heroImage, setHeroImage] = useState(() => localStorage.getItem('about_hero_image') || "https://unsplash.com");

  // Pull dynamic matrix pillars array from local memory
  const [pillars, setPillars] = useState(() => {
    const saved = localStorage.getItem('about_pillars');
    return saved ? JSON.parse(saved) : [
      { title: "Absolute Transparency", text: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit." },
      { title: "Verified Property Pools", text: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis." },
      { title: "Client-First Operations", text: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit." }
    ];
  });

  // Pull active expert advisory council grid from browser local memory
  const [executiveTeam, setExecutiveTeam] = useState(() => {
    const saved = localStorage.getItem('about_advisors');
    return saved ? JSON.parse(saved) : [
      { name: "Sarah Jenkins", role: "Principal Managing Broker", tag: "Commercial", image: "https://unsplash.com" },
      { name: "David Vance", role: "Acquisitions Director", tag: "Luxury Deals", image: "https://unsplash.com" }
    ];
  });

  // --- 2. Live Runtime Listener: Sync values instantly if modified ---
  useEffect(() => {
    const handleStorageUpdate = () => {
      setHeading(localStorage.getItem('about_heading') || "About the Estate Ease Engine");
      setSubheading(localStorage.getItem('about_subheading') || "We are redefining how clients interact with corporate real-estate ecosystems.");
      setParagraph(localStorage.getItem('about_paragraph') || "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium...");
      setHeroImage(localStorage.getItem('about_hero_image') || "https://unsplash.com");
      
      const savedPillars = localStorage.getItem('about_pillars');
      if (savedPillars) setPillars(JSON.parse(savedPillars));
      
      const savedAdvisors = localStorage.getItem('about_advisors');
      if (savedAdvisors) setExecutiveTeam(JSON.parse(savedAdvisors));
    };

    // Listen to updates across different tabs or save events natively
    window.addEventListener('storage', handleStorageUpdate);
    
    // Also perform an initial verification load cycle on mount
    handleStorageUpdate();

    return () => window.removeEventListener('storage', handleStorageUpdate);
  }, []);

  const getPillarIcon = (index) => {
    const icons = [
      <Eye className="w-5 h-5 text-blue-600 dark:text-blue-500" />,
      <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-500" />,
      <Users className="w-5 h-5 text-blue-600 dark:text-blue-500" />
    ];
    return icons[index % icons.length];
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen transition-colors duration-200 pb-24 text-left select-none">
      <Navbar />

      <div className="max-w-[1320px] mx-auto px-4 pt-12 lg:pt-16">
        
        {/* SECTION 1: HEADER TEXT BLOCK */}
        <div className="mb-14 relative inline-block max-w-max">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full mb-3 block w-max">
            Our Company Story
          </span>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-white tracking-tight pb-3">
            {heading}
          </h1>
          <div className="absolute bottom-0 left-0 w-1/3 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full" />
        </div>

        {/* SECTION 2: WORKSPACE SUMMARY SPLIT ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="w-full h-[340px] lg:h-[460px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-3 shadow-xs rounded-3xl">
            <div className="w-full h-full bg-slate-100 dark:bg-slate-950 overflow-hidden rounded-2xl">
              {/* 👑 Loads your top section hero image text string cleanly */}
              <img 
                src={heroImage} 
                alt="Estate Ease Workspace" 
                className="w-full h-full object-cover grayscale-[10%] dark:grayscale-0"
              />
            </div>
          </div>

          <div className="space-y-6 text-left max-w-[580px] lg:pl-4">
            <h2 className="text-xl lg:text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-snug">
              {subheading}
            </h2>
            <div className="space-y-4 text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">
              <p>{paragraph}</p>
            </div>
            <div className="pt-4">
              <Link
                to="/properties"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2 shadow-md shadow-blue-500/10 rounded-xl border-0 cursor-pointer no-underline"
              >
                <span>Explore Active Listings</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        </div>

        {/* SECTION 3: CORE VALUATION GRID */}
        <div className="w-full mb-24">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-8 text-center lg:text-left">
            Our Foundation Standards
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 shadow-xs rounded-2xl min-h-[200px] flex flex-col justify-start">
                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 flex items-center justify-center rounded-xl mb-4 shrink-0">
                  {getPillarIcon(idx)}
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-2">
                  {pillar.title || "Standard Metric"}
                </h4>
                <p className="text-slate-400 dark:text-slate-500 text-xs font-medium leading-relaxed">
                  {pillar.text || "Description context awaiting updates..."}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: EXCLUSIVE LIVE TEAM GRID */}
        <div className="w-full">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-8 text-center lg:text-left">
            Expert Advisory Council
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {executiveTeam.map((member, index) => (
              <div key={index} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs group flex flex-col">
                
                               {/* 👑 Loads the advisor's Base64 profile string dynamically */}
                <div className="relative w-full h-[260px] bg-slate-100 dark:bg-slate-950 overflow-hidden shrink-0">
                  <img 
                    src={member.image || "https://unsplash.com"} 
                    alt={member.name || "Council Member"} 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-3 left-3 bg-white/95 dark:bg-slate-900/90 text-blue-600 dark:text-blue-400 font-black tracking-wider uppercase text-[9px] px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-800">
                    {member.tag || member.badge || "COUNCIL"}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-black text-base text-slate-800 dark:text-white tracking-tight">
                      {member.name || "Awaiting Update"}
                    </h4>
                    <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 tracking-wide mt-1">
                      {member.role || "Executive Board Advisor"}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/60">
                    <a 
                      href={member.linkedin || "https://linkedin.com"} 
                      target="_blank" 
                      rel="noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 dark:bg-slate-950 dark:hover:bg-slate-800 text-[10px] font-black uppercase tracking-wider border-0 no-underline cursor-pointer transition-colors"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

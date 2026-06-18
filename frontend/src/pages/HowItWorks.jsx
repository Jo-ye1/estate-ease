import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MessageSquare, Key, ArrowRight,HelpCircle, Sliders } from "lucide-react";
import Navbar from "@/components/home/Navbar";
import axios from "axios";

// Helper map to match string names with Lucide components dynamically
const iconRegistry = {
  Search: <Search className="w-5 h-5 text-blue-500" />,
  MessageSquare: <MessageSquare className="w-5 h-5 text-blue-500" />,
  Key: <Key className="w-5 h-5 text-blue-500" />,
  HelpCircle: <HelpCircle className="w-5 h-5 text-blue-500" />,
  Sliders: <Sliders className="w-5 h-5 text-blue-500" />
};

export default function HowItWorks() {
  const [heroBadge, setHeroBadge] = useState("OPERATIONAL FRAMEWORK");
  const [heroTitle, setHeroTitle] = useState("Understanding the Estate Ease Engine");
  const [heroDesc, setHeroDesc] = useState("We have eliminated traditional friction from real-estate interactions.");
  const [ctaTitle, setCtaTitle] = useState("Ready to try it live?");
  const [ctaDesc, setCtaDesc] = useState("Skip the manual documentation pipelines. Jump straight into view active availability.");
  const [sectionBadge, setSectionBadge] = useState("OUR WORKFLOW");
  const [sectionTitle, setSectionTitle] = useState("How It Works");
  const [processSteps, setProcessSteps] = useState([]);

  useEffect(() => {
    const fetchWorkflowData = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/admin-settings/workflow");
        if (data) {
          if (data.heroBadge) setHeroBadge(data.heroBadge);
          if (data.heroTitle) setHeroTitle(data.heroTitle);
          if (data.heroDesc) setHeroDesc(data.heroDesc);
          if (data.ctaTitle) setCtaTitle(data.ctaTitle);
          if (data.ctaDesc) setCtaDesc(data.ctaDesc);
          if (data.sectionBadge) setSectionBadge(data.sectionBadge);
          if (data.sectionTitle) setSectionTitle(data.sectionTitle);
          if (data.steps) setProcessSteps(data.steps);
        }
      } catch (err) {
        console.error("Workflow content hydration failed:", err);
      }
    };
    fetchWorkflowData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      <Navbar />

      <main className="max-w-[1320px] mx-auto px-6 pt-24 pb-20">
        
        {/* HERO INTRO CONTENT BOX LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-b border-slate-200 dark:border-slate-800/60 pb-16 w-full">
          <div className="lg:col-span-7 text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              {heroBadge}
            </span>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white mt-4 mb-6 leading-tight">
              {heroTitle}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-[540px] text-sm font-medium leading-relaxed">
              {heroDesc}
            </p>
          </div>
          
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/60 p-8 rounded-2xl text-left shadow-xs">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-2">{ctaTitle}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">
              {ctaDesc}
            </p>
            <Link 
              to="/search" 
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition-all duration-200 group shadow-lg shadow-blue-600/10"
            >
              Explore Active Listings
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* STEP-BY-STEP RENDER MATRIX CARDS BLOCK */}
        <div className="mt-16 text-left">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-500">
            {sectionBadge}
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1 mb-10">
            {sectionTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {processSteps.map((step, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-8 rounded-2xl flex flex-col justify-between shadow-xs transition-all duration-200 hover:border-blue-500/50"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center rounded-xl shrink-0">
                      {iconRegistry[step.iconName] || iconRegistry.Search}
                    </div>
                    <span className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 px-2.5 py-1 rounded-md">
                      {step.tag}
                    </span>
                  </div>
                  
                  <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed tracking-wide">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

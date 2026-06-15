import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import { ShieldCheck, Eye, Users, ArrowRight, History, BarChart3, Globe, Award } from "lucide-react"; 
import Navbar from "@/components/home/Navbar"; 
import api from "@/lib/api"; 

export default function AboutPage() {
  const [heading, setHeading] = useState("About the Estate Ease Engine");
  const [subheading, setSubheading] = useState("Redefining corporate real-estate ecosystems.");
  const [paragraph, setParagraph] = useState("Loading platform data profiles context lines from MongoDB Atlas backend server infrastructure...");
  const [heroImage, setHeroImage] = useState("https://unsplash.com");

  const [pillars, setPillars] = useState([]);
  const [historyTimeline, setHistoryTimeline] = useState([]);
  const [executiveTeam, setExecutiveTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveMernCmsContent = async () => {
      try {
        setLoading(true);
        const response = await api.get("/admin-settings/about");
        const data = response.data;

        if (data) {
          if (data.heading) setHeading(data.heading);
          if (data.subheading) setSubheading(data.subheading);
          if (data.paragraph) setParagraph(data.paragraph);
          
          if (data.heroImage) {
            setHeroImage(data.heroImage.startsWith("http") || data.heroImage.startsWith("data:")
              ? data.heroImage 
              : `http://localhost:5000${data.heroImage}`
            );
          }
          
          if (data.pillars && data.pillars.length > 0) setPillars(data.pillars);
          
          if (data.historyTimeline && data.historyTimeline.length > 0) {
            setHistoryTimeline(data.historyTimeline);
          } else if (data.history && data.history.length > 0) {
            setHistoryTimeline(data.history);
          }
          
          if (data.advisors) setExecutiveTeam(data.advisors);
        }
      } catch (err) {
        console.warn("Express backend API offline, falling back safely onto browser local memory keys.", err);
        setHeading(localStorage.getItem('about_heading') || "About the Estate Ease Engine");
        setSubheading(localStorage.getItem('about_subheading') || "We are redefining how clients interact with corporate real-estate ecosystems.");
        setParagraph(localStorage.getItem('about_paragraph') || "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium...");
        setHeroImage(localStorage.getItem('about_hero_image') || "https://unsplash.com");
        
        const savedPillars = localStorage.getItem('about_pillars');
        if (savedPillars) setPillars(JSON.parse(savedPillars));

        const savedHistory = localStorage.getItem('about_history');
        if (savedHistory) setHistoryTimeline(JSON.parse(savedHistory));

        const savedAdvisors = localStorage.getItem('about_advisors');
        if (savedAdvisors) setExecutiveTeam(JSON.parse(savedAdvisors));
      } finally {
        setLoading(false);
      }
    };
    fetchLiveMernCmsContent();
  }, []);

  const getPillarIcon = (index) => {
    const icons = [
      <Eye className="w-5 h-5 text-blue-600 dark:text-blue-500" />,
      <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-500" />,
      <Users className="w-5 h-5 text-blue-600 dark:text-blue-500" />
    ];
    return icons[index % icons.length];
  };

  if (loading) {
    return (
      <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-200 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-32">
          <div className="text-xs font-mono font-bold text-slate-400 dark:text-slate-600 animate-pulse uppercase tracking-widest">Hydrating corporate CMS metrics loop from MongoDB...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen transition-colors duration-200 pb-24 text-left select-none">
      <Navbar />

      <div className="max-w-[1320px] mx-auto px-4 pt-12 lg:pt-16 space-y-24">
        
        <div className="relative inline-block max-w-max">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full mb-3 block w-max">
            Our Company Story
          </span>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-white tracking-tight pb-3">
            {heading}
          </h1>
          <div className="absolute bottom-0 left-0 w-1/3 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="w-full h-[340px] lg:h-[460px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-3 shadow-xs rounded-3xl">
            <div className="w-full h-full bg-slate-100 dark:bg-slate-950 overflow-hidden rounded-2xl">
              <img src={heroImage} alt="Workspace Banner" className="w-full h-full object-cover grayscale-[5%] hover:grayscale-0 transition-all duration-300" />
            </div>
          </div>

          <div className="space-y-6 text-left max-w-[580px] lg:pl-4">
            <h2 className="text-xl lg:text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-snug">
              {subheading}
            </h2>
            <div className="space-y-4 text-slate-400 dark:text-slate-400 text-xs font-medium leading-relaxed">
              <p>{paragraph}</p>
            </div>
            <div className="pt-2">
              <Link to="/properties" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2 shadow-md shadow-blue-500/10 rounded-xl border-0 no-underline cursor-pointer">
                <span>Explore Active Listings</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {pillars.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            {pillars.map((pillar, index) => (
              <div key={pillar._id || index} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-2xl shadow-xs text-left">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                  {getPillarIcon(index)}
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight uppercase">{pillar.title || "Core Value"}</h3>
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-2 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        )}

        {historyTimeline.length > 0 && (
          <div className="pt-8">
            <div className="mb-10 text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full mb-2 inline-block">Our Journey</span>
              <h2 className="text-xl lg:text-2xl font-black tracking-tight text-slate-900 dark:text-white">Milestones & History</h2>
            </div>
            <div className="space-y-6 relative border-l-2 border-slate-200 dark:border-slate-800 pl-6 ml-2">
              {historyTimeline.map((item, index) => (
                <div key={item._id || index} className="relative text-left">
                  <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-blue-600 border-4 border-slate-50 dark:border-slate-950" />
                  <span className="text-xs font-black font-mono text-blue-600 dark:text-blue-400 bg-blue-500/5 px-2 py-0.5 rounded-md">{item.year}</span>
                  <h4 className="text-sm font-black mt-2 text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1 leading-relaxed max-w-2xl">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {executiveTeam.length > 0 && (
          <div className="pt-8">
            <div className="mb-10 text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full mb-2 inline-block">Leadership Team</span>
              <h2 className="text-xl lg:text-2xl font-black tracking-tight text-slate-900 dark:text-white">Executive Advisors</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {executiveTeam.map((advisor, index) => {
                const avatarUrl = advisor.image 
                  ? advisor.image.startsWith("http") ? advisor.image : `http://localhost:5000${advisor.image}`
                  : "https://unsplash.com";
                return (
                  <div key={advisor._id || index} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-3 rounded-2xl text-center shadow-2xs group">
                    <div className="w-full h-44 bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden mb-3">
                      <img src={avatarUrl} alt={advisor.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-white truncate px-1">{advisor.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mt-0.5">{advisor.role || "Advisor"}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

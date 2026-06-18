import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import { 
  ShieldCheck, 
  Eye, 
  Users, 
  ArrowRight, 
  History, 
  BarChart3, 
  Globe, 
  Award, 
  Calendar 
} from "lucide-react";

import Navbar from "@/components/home/Navbar"; 
import api from "@/lib/api";

const LinkedInIcon = ({ className = "w-4 h-4" }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

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
            if (data.heroImage.startsWith("http") || data.heroImage.startsWith("data:")) {
              setHeroImage(data.heroImage);
            } else {
              const apiBase = api.defaults.baseURL || "http://localhost:5000";
              const cleanedBase = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;
              const cleanedRoute = data.heroImage.startsWith("/") ? data.heroImage : `/${data.heroImage}`;
              setHeroImage(`${cleanedBase}${cleanedRoute}`);
            }
          }
          
          if (data.pillars && data.pillars.length > 0) setPillars(data.pillars);
console.log("History Data:", data.history);

setHistoryTimeline(
  Array.isArray(data.history)
    ? data.history
    : []
);
          
          if (data.advisors) setExecutiveTeam(data.advisors);
        }
      } catch (err) {
        console.warn("Express backend API offline, falling back safely onto browser local memory keys.", err);
        setHeading(localStorage.getItem('about_heading') || "About the Estate Ease Engine");
        setSubheading(localStorage.getItem('about_subheading') || "We are redefining how clients interact with corporate real-estate ecosystems.");
        setParagraph(localStorage.getItem('about_paragraph') || "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium...");
        
        const cachedImg = localStorage.getItem('about_hero_image');
        setHeroImage(cachedImg && cachedImg !== "https://unsplash.com" ? cachedImg : "https://unsplash.com");
        
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
      <Eye className="w-5 h-5 text-blue-400" />,
      <ShieldCheck className="w-5 h-5 text-blue-400" />,
      <Users className="w-5 h-5 text-blue-400" />
    ];
    return icons[index % icons.length];
  };

  if (loading) {
    return (
      <div className="w-full bg-slate-950 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-32">
          <div className="text-xs font-mono font-bold text-slate-600 animate-pulse uppercase tracking-widest">Hydrating corporate CMS metrics loop from MongoDB...</div>
        </div>
      </div>
    );
  }

    return (
    <div className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen pb-24 text-left select-none transition-colors duration-200">
      <Navbar />

      <div className="max-w-[1320px] mx-auto px-4 pt-12 lg:pt-16 space-y-24">
        
        <div className="relative inline-block max-w-max">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full mb-3 block w-max">
            Our Company Story
          </span>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight pb-3">
            {heading}
          </h1>
          <div className="absolute bottom-0 left-0 w-1/3 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="w-full h-[340px] lg:h-[460px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-3 shadow-xs rounded-3xl">
            <div className="w-full h-full bg-slate-100 dark:bg-slate-950 overflow-hidden rounded-2xl">
              <img src={heroImage} alt="Workspace Banner" className="w-full h-full object-cover grayscale-[5%] hover:grayscale-0 transition-all duration-300" />
            </div>
          </div>

          <div className="space-y-6 text-left max-w-[580px] lg:pl-4">
            <h2 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              {subheading}
            </h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-400 text-xs font-medium leading-relaxed">
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
              <div key={pillar._id || index} className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-xs text-left transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700/80">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                  {getPillarIcon(index)}
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight uppercase">{pillar.title || "Core Value"}</h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {pillar.text || pillar.description || ""}
                </p>           
              </div>
            ))}
          </div>
        )}  

        {historyTimeline.length > 0 && (
          <div className="space-y-10">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
              <span className="text-[11px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full mb-3 inline-block">
                Our Journey
              </span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Milestones & History
              </h2>
            </div>
            
            <div className="relative pl-6 space-y-8 before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-[2px] before:bg-gradient-to-b before:from-blue-500/50 before:to-slate-200 dark:before:to-slate-800">
              {historyTimeline.map((milestone, idx) => (
                <div key={milestone._id || idx} className="relative flex flex-col sm:flex-row sm:items-start gap-4 group">
                  
                  <div className="absolute -left-[21px] top-1.5 w-6 h-6 bg-slate-50 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 z-10 group-hover:border-blue-600 dark:group-hover:border-blue-400 transition-colors duration-300 shadow-sm">
                    <Calendar className="w-3 h-3" />
                  </div>
                  
                  <div className="flex-1 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-800 rounded-xl p-4 sm:p-5 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-900/80">
                    <div className="flex flex-col gap-1 mb-2">
                      <span className="font-black text-blue-600 dark:text-blue-400 text-base">
                        {milestone.year || "2026"}
                      </span>
                      {(milestone.title || milestone.eventTitleHeadline) && (
                        <h4 className="text-slate-800 dark:text-white font-bold text-sm tracking-tight">
                          {milestone.title}
                        </h4>
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-xs font-medium leading-relaxed">
                      {milestone.body || "No description provided."}
                    </p>
                  </div>
                  
                </div>
              ))}
            </div>
          </div>
        )}

        {executiveTeam.length > 0 && (
          <div className="space-y-10">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full mb-3 inline-block">
                Leadership Team
              </span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Executive Advisors
              </h2>
            </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {executiveTeam.map((advisor, index) => {
                const advisorImage = advisor.image 
                  ? (advisor.image.startsWith("http") || advisor.image.startsWith("data:") 
                      ? advisor.image 
                      : `${api.defaults?.baseURL || "http://localhost:5000"}${advisor.image.startsWith("/") ? "" : "/"}${advisor.image}`)
                  : "https://unsplash.com";

                return (
                  <div 
                    key={advisor._id || index} 
                    className="relative bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 flex flex-col items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:bg-slate-100 dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700/80 hover:shadow-xl hover:shadow-blue-950/20 group overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="w-full flex flex-col items-center text-center">
                      <div className="relative w-24 h-24 mb-4 shrink-0">
                        <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 group-hover:border-blue-500/50 transition-colors duration-300 flex items-center justify-center">
                          <img 
                            src={advisorImage} 
                            alt={advisor.name || "Advisor"} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          />
                        </div>
                      </div>
                      
                      {(advisor.tag || advisor.domainTag) && (
                        <span className="text-[9px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800/80 mb-3">
                          {advisor.tag || advisor.domainTag}
                        </span>
                      )}

                      <h3 className="text-base font-bold text-slate-800 dark:text-white tracking-tight truncate max-w-full">
                        {advisor.name || "Advisor Name"}
                      </h3>
                      
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1 uppercase tracking-wider truncate max-w-full">
                        {advisor.role || advisor.corporateRole || "Executive"}
                      </p>
                    </div>

                    {(advisor.linkedin || advisor.linkedinUrl) && (
                      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/60 w-full flex justify-center">
                        <a 
                          href={advisor.linkedin || advisor.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-blue-950/40 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-blue-600 hover:border-blue-500/30 transition-all duration-200"
                          aria-label="LinkedIn Profile"
                        >
                          <LinkedInIcon className="w-4 h-4" />
                        </a>
                      </div>
                    )}

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

import React from "react";
import { Link } from "react-router-dom"; 
// 🎯 FIXED: Removed 'Linkedin' which was causing your dependency package version error
import { ShieldCheck, Eye, Users, ArrowRight, Mail } from "lucide-react"; 
import Navbar from "@/components/home/Navbar"; 

export default function AboutPage() {
  const values = [
    {
      title: "Absolute Transparency",
      desc: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur.",
      icon: <Eye className="w-6 h-6 text-blue-600 dark:text-blue-500" />
    },
    {
      title: "Verified Property Pools",
      desc: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam nisi ut.",
      icon: <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-500" />
    },
    {
      title: "Client-First Operations",
      desc: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae.",
      icon: <Users className="w-6 h-6 text-blue-600 dark:text-blue-500" />
    }
  ];

  const executiveTeam = [
    {
      name: "Sarah Jenkins",
      role: "Principal Managing Broker",
      image: "https://unsplash.com",
      badge: "Commercial"
    },
    {
      name: "David Vance",
      role: "Acquisitions Director",
      image: "https://unsplash.com",
      badge: "Luxury Deals"
    },
    {
      name: "Michael Sterling",
      role: "Legal Council Compliance",
      image: "https://unsplash.com",
      badge: "Asset Audit"
    }
  ];

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen select-none text-left transition-colors duration-200 pb-24">
      <Navbar />

      <div className="max-w-[1320px] mx-auto px-4 pt-12 lg:pt-16">
        
        {/* SECTION 1: HEADER TEXT BLOCK */}
        <div className="mb-14 relative inline-block max-w-max">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full mb-3 block w-max">
            Our Company Story
          </span>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-white tracking-tight pb-3">
            About the <span className="text-blue-600 dark:text-blue-500">Estate Ease</span> Engine
          </h1>
          <div className="absolute bottom-0 left-0 w-1/3 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full" />
        </div>

        {/* SECTION 2: SUMMARY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="w-full h-[340px] lg:h-[460px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.02)] rounded-3xl">
            <div className="w-full h-full bg-slate-100 dark:bg-slate-950 overflow-hidden rounded-2xl">
              <img 
                src="https://unsplash.com" 
                alt="Estate Ease Workspace" 
                className="w-full h-full object-cover grayscale-[10%] dark:grayscale-0"
              />
            </div>
          </div>

          <div className="space-y-6 text-left max-w-[580px] lg:pl-4">
            <h2 className="text-xl lg:text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-snug">
              We are redefining how clients interact with corporate real-estate ecosystems.
            </h2>
            <div className="space-y-4 text-slate-400 dark:text-slate-500 text-xs font-medium leading-relaxed">
              <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
              <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.</p>
            </div>
            <div className="pt-4">
              <Link
                to="/properties"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2 shadow-md shadow-blue-600/10 rounded-xl border-0 cursor-pointer"
              >
                <span>Explore Active Listings</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        </div>

        {/* SECTION 3: CORE VALUATION */}
        <div className="w-full mb-24">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-8 leading-none text-center lg:text-left">
            Our Foundation Standards
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {values.map((val, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 shadow-sm rounded-2xl min-h-[220px] h-auto transition-all duration-300 hover:shadow-md">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center rounded-xl mb-5 shrink-0">
                  {val.icon}
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-white tracking-tight leading-none mb-3">
                  {val.title}
                </h4>
                <p className="text-slate-400 dark:text-slate-500 text-xs font-medium leading-relaxed line-clamp-4">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: EXCLUSIVE TEAM GRID */}
        <div className="w-full">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-8 leading-none text-center lg:text-left">
            Expert Advisory Council
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {executiveTeam.map((member, index) => (
              <div key={index} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm group hover:shadow-md transition-all duration-300 flex flex-col">
                <div className="relative w-full h-[260px] bg-slate-100 dark:bg-slate-950 overflow-hidden shrink-0">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-3 left-3 bg-white/95 dark:bg-slate-900/90 text-blue-600 dark:text-blue-400 font-black tracking-wider uppercase text-[9px] px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-800">
                    {member.badge}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between text-left">
                  <div>
                    <h4 className="font-black text-base text-slate-800 dark:text-white tracking-tight leading-none">
                      {member.name}
                    </h4>
                    <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 tracking-wide mt-1.5 leading-none">
                      {member.role}
                    </p>
                  </div>
                  {/* 🎯 FIXED SOCIAL BUTTON ROW: Replaced missing package icon link with ultra-compatible bold text buttons */}
                  <div className="flex items-center gap-2 mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/60">
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 dark:bg-slate-950 dark:hover:bg-slate-800 text-[10px] font-black uppercase tracking-wider border-0 no-underline cursor-pointer">
                      LinkedIn
                    </a>
                    <button type="button" className="p-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 dark:bg-slate-950 dark:hover:bg-slate-800 border-0 cursor-pointer">
                      <Mail className="w-3.5 h-3.5" />
                    </button>
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

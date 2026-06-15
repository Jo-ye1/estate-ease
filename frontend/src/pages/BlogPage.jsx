import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react';
import Navbar from "@/components/home/Navbar";

export default function BlogPage() {
  // --- 1. Dynamic states linked directly to browser storage memory ---
  const [journalTitle, setJournalTitle] = useState(() => localStorage.getItem('blog_title') || "The Estate Ease Journal");
  const [journalSub, setJournalSub] = useState(() => localStorage.getItem('blog_subheading') || "Stay up to date with professional market insights, broker methodologies, and regulatory tutorials.");
  const [searchQuery, setSearchQuery] = useState("");

  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('blog_posts');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: "Redefining Urban Spaces: The Rise of Sustainable Architecture",
        category: "ARCHITECTURE",
        date: "2026-05-12",
        readTime: "5 MIN READ",
        excerpt: "Explore how contemporary real estate developers are leveraging smart materials and ecological grid panels to create self-sustaining housing modules.",
        image: "https://unsplash.com"
      },
      {
        id: 2,
        title: "Navigating Escrow: A First-Time Home Buyer's Blueprint",
        category: "GUIDES",
        date: "2026-05-28",
        readTime: "7 MIN READ",
        excerpt: "Demystifying complex transaction pipelines, database routing verification logs, and closing fees parameters to protect your upcoming capital placements.",
        image: "https://unsplash.com"
      },
      {
        id: 3,
        title: "Widescreen Interiors: Maximizing Tiny Luxury Formats",
        category: "INTERIOR DESIGN",
        date: "2026-06-02",
        readTime: "4 MIN READ",
        excerpt: "Learn the professional layout secrets used by luxury developers to make compact studio modules stretch visually open using layout symmetry.",
        image: "https://unsplash.com"
      }
    ];
  });

  // --- 2. Live Runtime Synchronization Hook ---
  useEffect(() => {
    const syncBlogMemory = () => {
      setJournalTitle(localStorage.getItem('blog_title') || "The Estate Ease Journal");
      setJournalSub(localStorage.getItem('blog_subheading') || "Stay up to date with professional market insights, broker methodologies, and regulatory tutorials.");
      const savedPosts = localStorage.getItem('blog_posts');
      if (savedPosts) setPosts(JSON.parse(savedPosts));
    };

    window.addEventListener('storage', syncBlogMemory);
    syncBlogMemory(); 
    return () => window.removeEventListener('storage', syncBlogMemory);
  }, []);

  // --- 3. Filter entries based on the search query input ---
  const filteredPosts = posts.filter(post => 
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen select-none text-left transition-colors duration-200 pb-24">
      <Navbar />

      <div className="max-w-[1320px] mx-auto px-4 pt-12 lg:pt-16">
        
        {/* HEADER BRAND BLOCK ROW */}
        <div className="mb-10 text-left">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full mb-3 block w-max">
            Insights & Media
          </span>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-white tracking-tight">
            {journalTitle}
          </h1>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {journalSub}
          </p>
        </div>

        {/* INTERACTIVE SEARCH FILTER BAR SUB-TOOLBAR */}
        <div className="max-w-md mb-12 relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search journal archives or categorization tags..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
          />
        </div>

        {/* ACTIVE DYNAMIC COMPONENT CARDS GRID MATRIX DISPLAY PANEL */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 text-xs font-mono font-bold text-slate-400 dark:text-slate-600 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/40">
            No journal article matches found inside browser storage index parameters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.01)] group hover:shadow-md transition-all duration-300 flex flex-col h-full">
                
                {/* Visual Thumbnail Cover Banner Box */}
                <div className="relative w-full h-[200px] bg-slate-100 dark:bg-slate-950 overflow-hidden shrink-0 border-b border-slate-100 dark:border-slate-800/60">
                  <img 
                    src={post.image || "https://unsplash.com"} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-[101%] transition-all duration-300"
                    onError={(e) => { e.target.src = "https://unsplash.com"; }}
                  />
                  <span className="absolute bottom-3 left-3 bg-white/95 dark:bg-slate-900/90 text-blue-600 dark:text-blue-500 font-black tracking-wider uppercase text-[8.5px] px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-800/80 shadow-xs">
                    {post.category || "MEDIA"}
                  </span>
                </div>

                {/* Body Content Description Area */}
                <div className="p-5 flex-1 flex flex-col justify-between text-left space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wide">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                    </div>
                    
                    <h3 className="font-black text-base text-slate-800 dark:text-white tracking-tight leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors line-clamp-2 min-h-[44px]">
                      {post.title || "Untitled Document Node"}
                    </h3>
                    
                    <p className="text-slate-400 dark:text-slate-500 text-xs font-medium leading-relaxed line-clamp-3 min-h-[54px]">
                      {post.excerpt || "Article context overview parameters awaiting manager synchronization..."}
                    </p>
                  </div>

                  {/* Read Document Dynamic Link Trigger */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60">
                    {/* 👑 FIXED DEEP LINKING: Converted from an un-routed static button into a clean, single-page client router Link endpoint */}
                    <Link 
                      to={`/blog/${post.id}`} 
                      className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 no-underline flex items-center gap-1.5 transition-colors cursor-pointer outline-none"
                    >
                      <span>Read Full Document</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
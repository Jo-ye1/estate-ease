import React, { useState } from "react";
import Navbar from "@/components/home/Navbar"; 

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Market Trends", "Property Tips", "Investment", "Interior Design"];

  // 🎯 FIXED: Locked down ultra-stable, high-density real estate image assets directly in data definition
  const articles = [
    {
      id: 1,
      title: "10 Critical Things to Check Before Buying a Suburban Home",
      category: "Property Tips",
      date: "June 10, 2026",
      readTime: "5 min read",
      summary: "Sed ut perspiciatis unde omnis iste natus voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi.",
      image: "https://unsplash.com"
    },
    {
      id: 2,
      title: "Real Estate Market Analytics: Expected Trends for the Coming Year",
      category: "Market Trends",
      date: "June 04, 2026",
      readTime: "8 min read",
      summary: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur magni dolores eos qui ratione sequi nesciunt.",
      image: "https://unsplash.com"
    },
    {
      id: 3,
      title: "How to Maximize Your ROI on Luxury Apartment Flipping",
      category: "Investment",
      date: "May 28, 2026",
      readTime: "6 min read",
      summary: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?",
      image: "https://unsplash.com"
    },
    {
      id: 4,
      title: "Minimalist Interior Designs That Raise Property Value Fast",
      category: "Interior Design",
      date: "May 15, 2026",
      readTime: "4 min read",
      summary: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat.",
      image: "https://unsplash.com"
    }
  ];

  const filteredArticles = activeCategory === "All" 
    ? articles 
    : articles.filter(art => art.category === activeCategory);

  const featuredArticle = articles[0];

  return (
    // 🎯 TARGET SYSTEM ENVELOPE WIDTH MATRIX
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen select-none text-left transition-colors duration-200">
      
      <Navbar />

      <div className="max-w-[1320px] mx-auto px-4 py-16">
        
        {/* HEADER BADGE & TITLE */}
        <div className="mb-10 relative inline-block max-w-max">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full mb-3 block w-max">
            Our Articles
          </span>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight pb-3">
            Estate Ease <span className="text-blue-600 dark:text-blue-500">Insights Blog</span>
          </h1>
          <div className="absolute bottom-0 left-0 w-1/3 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full" />
        </div>

        {/* CATEGORIES BUTTONS BAR PANEL */}
        <div className="flex items-center gap-2 overflow-x-auto pb-6 mb-12 scrollbar-none border-b border-slate-100 dark:border-slate-900/60">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-tight transition-all border cursor-pointer shrink-0 ${
                activeCategory === cat
                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10"
                  : "bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FEATURED BANNER COMPONENT */}
        {activeCategory === "All" && (
          <div className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 mb-16 group cursor-pointer">
            {/* 🛠️ FIXED: Added base bg-slate-200 dark:bg-slate-950 layer to act as static fallback shield block */}
            <div className="w-full h-[280px] lg:h-[360px] overflow-hidden bg-slate-200 dark:bg-slate-950 rounded-xl relative">
              <img 
                src={featuredArticle.image} 
                alt={featuredArticle.title} 
                className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500 relative z-10"
                loading="eager"
              />
            </div>
            <div className="flex flex-col justify-between py-2 text-left">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  <span className="text-blue-600 dark:text-blue-400">{featuredArticle.category}</span>
                  <span>•</span>
                  <span>{featuredArticle.date}</span>
                  <span>•</span>
                  <span>{featuredArticle.readTime}</span>
                </div>
                <h2 className="text-xl lg:text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {featuredArticle.title}
                </h2>
                <p className="text-slate-400 dark:text-slate-500 text-xs font-medium leading-relaxed max-w-[500px]">
                  {featuredArticle.summary}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-blue-600 dark:text-blue-500 font-extrabold text-xs uppercase tracking-wide">
                <span>Read Article</span>
                <span className="text-sm font-light leading-none mt-[-2px]">→</span>
              </div>
            </div>
          </div>
        )}

        {/* PRIMARY SUB-DECKS CARDS GRID LAYER */}
        {filteredArticles.length === 0 ? (
          <p className="text-center text-slate-400 italic text-sm py-12">No articles found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[420px] p-4 group cursor-pointer"
              >
                <div>
                  {/* 🛠️ FIXED: Static solid background box wrapper keeps layout anchored perfectly during asset data transfer streams */}
                  <div className="w-full h-[180px] overflow-hidden bg-slate-200 dark:bg-slate-950 rounded-xl relative">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 relative z-10"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="px-1 text-left">
                    <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mt-4">
                      <span className="text-blue-600 dark:text-blue-400">{article.category}</span>
                      <span>•</span>
                      <span>{article.date}</span>
                    </div>
                    
                    <h3 className="font-bold text-sm text-slate-800 dark:text-white tracking-tight leading-snug line-clamp-2 mt-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3 mt-4 px-1">
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">{article.readTime}</span>
                  <div className="text-blue-600 dark:text-blue-500 font-extrabold text-[11px] uppercase tracking-wide flex items-center gap-1">
                    <span>Read</span>
                    <span className="text-xs font-light leading-none">→</span>
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

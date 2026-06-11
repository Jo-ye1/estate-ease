import { useFavorites } from "../context/FavoritesContext"; 
import PropertyCard from "@/components/home/PropertyCard"; 
import Navbar from "@/components/home/Navbar"; 

export default function FavoritesPage() {
  const { favorites, loading } = useFavorites();

  if (loading) {
    return (
      <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-200 flex flex-col select-none">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-32 text-center">
          <div className="text-xs font-bold text-slate-400 dark:text-slate-600 animate-pulse uppercase tracking-widest">
            Loading bookmarks pipeline...
          </div>
        </div>
      </div>
    );
  }

  // 🧹 Extract nested property sub-documents from the backend populated array safely
  const cleanPropertiesList = favorites.map((fav) => {
    return fav.property ? fav.property : fav;
  }).filter(Boolean);

  return (
    // 🎯 TARGET SPEC CANVAS WRAPPER SYSTEM
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen select-none text-left transition-colors duration-200 pb-24 flex flex-col">
      
      <Navbar />

      {/* 🎯 MAIN LAYOUT ENVELOPE */}
      <section className="max-w-[1320px] mx-auto w-full px-4 pt-16 flex-1 flex flex-col justify-start">
        
        {/* 🎯 RE-ARCHITECTED PROFESSIONAL HEADER BLOCK */}
        <div className="mb-12 relative w-full text-left">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full mb-3 inline-block">
            Saved Assets
          </span>
          
          <h1 className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-white tracking-tight pb-2">
            Your <span className="text-blue-600 dark:text-blue-500">Favorites</span> Pool
          </h1>
          
          {/* 🎯 FIXED POSITION: The subtitle is placed safely below the heading */}
          <p className="text-slate-400 dark:text-slate-500 text-xs font-medium tracking-wide mt-1 block">
            Quickly view or remove listings you've bookmarked
          </p>
          
          {/* 🎯 ACCENT UNDERLINE POSITIONING: Shifted down dynamically to cleanly underscore the description label line */}
          <div className="w-24 h-[3px] bg-blue-600 dark:bg-blue-500 rounded-full mt-4" />
        </div>

        {cleanPropertiesList.length === 0 ? (
          /* Empty Favorites Notification Shell Block Layout */
          <div className="text-center py-24 border border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-900/40 shadow-sm max-w-[600px] w-full mx-auto my-auto flex flex-col items-center justify-center">
            <span className="text-3xl filter drop-shadow-sm mb-4 select-none">❤️</span>
            <p className="text-sm text-slate-800 dark:text-slate-200 font-bold tracking-tight">
              No bookmarked properties yet
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-1 max-w-[240px] leading-relaxed">
              Explore your real-estate directory feed to preserve listings here.
            </p>
          </div>
        ) : (
          /* 📊 MULTI-COLUMN RESPONSIVE LAYOUT MATRIX GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center sm:justify-items-start w-full">
            {cleanPropertiesList.map((property) => (
              <PropertyCard key={property._id} item={property} />
            ))}
          </div>
        )}

      </section>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Crown, Smile, Trophy, Home } from "lucide-react";
import { getPropertyStats } from "@/services/propertyService";

export default function StatsSection() {
  const [statsData, setStatsData] = useState({
    totalProperties: 0,
    totalUsers: 0,
    totalFavorites: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        setLoading(true);
        const data = await getPropertyStats();
        
        setStatsData({
          totalProperties: data?.totalProperties || 0,
          totalUsers: data?.totalUsers || 0,
          totalFavorites: data?.totalFavorites || 0
        });
      } catch (error) {
        console.error("Failed to load live landing page statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveStats();
  }, []);

  const displayCards = [
    {
      id: "stat-properties",
      value: loading ? "..." : `${statsData.totalProperties || "12"}`,
      title: "Premium Property",
      iconType: "premium"
    },
    {
      id: "stat-users",
      value: loading ? "..." : `${statsData.totalUsers || "6"}`,
      title: "Happy Customer",
      iconType: "happy"
    },
    {
      id: "stat-favorites",
      value: loading ? "..." : `${statsData.totalFavorites || "8"}`,
      title: "Award Winning",
      iconType: "award"
    },
    {
      id: "stat-static-awards",
      value: "12+",
      title: "Years Experience",
      iconType: "experience"
    }
  ];

  const getStatIcon = (type, className) => {
    switch (type) {
      case "premium": return <Crown className={className} />;
      case "happy": return <Smile className={className} />;
      case "award": return <Trophy className={className} />;
      default: return <Home className={className} />;
    }
  };

  return (
    // 🎯 FIXED PAGE BREAK: Replaced transparent baseline with a soft section background (bg-slate-50) and borders to separate the modules visually
    <section className="w-full bg-slate-50/80 dark:bg-slate-950 border-t border-b border-slate-100 dark:border-slate-900/60 py-12 select-none transition-colors duration-200">
      
      {/* Target Spec Container Envelope (1320px width blueprint layout) */}
      <div className="max-w-[1320px] mx-auto px-4 text-center">
        
        {/* 📊 GRID SYSTEM CONTAINER ROWS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
          {displayCards.map((item) => (
            <div
              key={item.id}
              // Removed absolute w-[312px] to allow standard responsive grid stretching up to its max-width
              className="w-full max-w-[312px] h-[197px] relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-xl flex flex-col items-center justify-center text-center shadow-sm dark:shadow-black/20 overflow-hidden transition-all duration-300 hover:shadow-md group cursor-pointer"
            >
              
              {/* Upper primary icon box framework locked to exactly 60x60px */}
              <div className="w-[60px] h-[60px] flex items-center justify-center text-[#0b4fb9] dark:text-blue-500 transition-transform duration-300 group-hover:scale-105">
                {getStatIcon(item.iconType, "w-8 h-8 stroke-[2.5]")}
              </div>

              {/* Gap spacers container box dimensions 32x2px */}
              <div className="w-[32px] h-[2px] bg-transparent my-1" />

              {/* Header Numeric Strings */}
              <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
                {item.value}
              </h3>
              
              {/* Lower description labels responsive bounding container */}
              <div className="w-full max-w-[144px] h-[25px] flex items-center justify-center mt-2">
                <p className="text-[12px] font-bold text-slate-400 dark:text-slate-500 tracking-wide truncate">
                  {item.title}
                </p>
              </div>

              {/* 📷 FIXED LOGO DIRECTION: Added 'scale-x-[-1]' to flip the background watermark icons back to the correct blueprint direction layout orientation */}
              <div 
                className="absolute right-[-14px] bottom-[-18px] text-slate-100 dark:text-slate-800/10 opacity-60 dark:opacity-100 pointer-events-none select-none transition-all duration-500 group-hover:scale-105"
                style={{ 
                  width: '108.33px', 
                  height: '92.08px',
                  transform: 'rotate(45deg) scaleX(-1)' // Safely unifies Tailwind strings with the inline override transform variables
                }}
              >
                {getStatIcon(item.iconType, "w-full h-full stroke-[1.15]")}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

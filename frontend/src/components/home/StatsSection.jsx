import { useEffect, useState } from "react";
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
          totalProperties: data.totalProperties || 0,
          totalUsers: data.totalUsers || 0,
          totalFavorites: data.totalFavorites || 0
        });
      } catch (error) {
        console.error("Failed to load live landing page statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveStats();
  }, []);

  // Assemble structural card array map data matching your design layout smoothly
  const displayCards = [
    {
      id: "stat-properties",
      value: loading ? "..." : `${statsData.totalProperties}`,
      title: "Active Properties Listed",
    },
    {
      id: "stat-users",
      value: loading ? "..." : `${statsData.totalUsers}`,
      title: "Verified System Accounts",
    },
    {
      id: "stat-favorites",
      value: loading ? "..." : `${statsData.totalFavorites}`,
      title: "Total User Bookmarks",
    },
    {
      id: "stat-static-awards",
      value: "12+",
      title: "National Agency Awards", // Remaining pure branding parameters stay safely static
    }
  ];

  return (
    <section className="py-20 bg-slate-900 border-t border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {displayCards.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800/60 border border-slate-700/40 p-8 rounded-2xl text-center shadow-md transition-all duration-200 hover:border-slate-600/60"
            >
              <h3 className="text-4xl font-black text-blue-500 tracking-tight">
                {item.value}
              </h3>

              <p className="mt-2 text-slate-400 font-medium text-sm">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

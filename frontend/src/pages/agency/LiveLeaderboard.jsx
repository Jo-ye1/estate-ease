import React from "react";
import { Trophy, Medal, Star, TrendingUp } from "lucide-react";

export default function LiveLeaderboard({ standings }) {
  const defaultStandings = standings || [
    { rank: 1, name: "John Doe", revenue: 92000, conversion: 94 },
    { rank: 2, name: "Sarah Jenkins", revenue: 84000, conversion: 91 },
    { rank: 3, name: "Alex Mercer", revenue: 67000, conversion: 85 }
  ];

  const getRankBadge = (rank) => {
    if (rank === 1) return <Trophy size={14} className="text-amber-500 dark:text-amber-400" />;
    if (rank === 2) return <Medal size={14} className="text-slate-400" />;
    return <Star size={14} className="text-amber-600" />;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col h-full shadow-xs transition-colors duration-200">
      <div className="flex items-center gap-2 mb-4">
        <Trophy size={16} className="text-amber-600 dark:text-amber-500" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Live Agent Leaderboard</h3>
      </div>
      <div className="space-y-2.5 flex-1 overflow-y-auto">
        {defaultStandings.map((agent, idx) => (
          <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-slate-400 dark:text-slate-500 w-4 text-center">#{agent.rank}</span>
              <div className="text-xs">
                <div className="font-bold text-slate-800 dark:text-white flex items-center gap-1">
                  {agent.name} {getRankBadge(agent.rank)}
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block mt-0.5">Conversion rate: {agent.conversion}%</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">${agent.revenue.toLocaleString()}</span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wide">Gross GTV</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

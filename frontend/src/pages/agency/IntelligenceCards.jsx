import React from "react";
import { TrendingUp, Clock, Users, ArrowUpRight, Zap, Award } from "lucide-react";

export default function IntelligenceCards({ metrics }) {
  const cards = [
    {
      title: "Conversion Target Rate",
      value: `${metrics?.conversionRate || 14.5}%`,
      desc: "Lead-to-deal conversion performance tracking indicator.",
      icon: TrendingUp,
      badge: "Top 10% Market",
      badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      title: "Average Deal Velocity",
      value: `${metrics?.closingSpeedDays || 24} Days`,
      desc: "Average time window tracked from inbound inquiry to closure.",
      icon: Clock,
      badge: "-3d Improvement",
      badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20"
    },
    {
      title: "Primary Top Producer",
      value: metrics?.topAgentName || "eyassu melese",
      desc: "Roster staff member holding the highest closed transaction volume.",
      icon: Award,
      badge: "Brokerage MVP",
      badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-1">
      {cards.map((card, i) => (
        <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between shadow-xs transition-all hover:border-slate-700">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-wider">{card.title}</h4>
              <h3 className="text-lg font-black text-white tracking-tight">{card.value}</h3>
            </div>
            <div className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wide shrink-0 ${card.badgeColor}`}>
              {card.badge}
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 border-t border-slate-800/60 pt-2.5 leading-relaxed">
            {card.desc}
          </p>
        </div>
      ))}
    </div>
  );
}

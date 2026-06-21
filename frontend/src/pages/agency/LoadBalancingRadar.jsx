import React from "react";
import { Activity, UserCheck } from "lucide-react";

export default function LoadBalancingRadar({ roster }) {
  const defaultRoster = roster || [
    { agentName: "Agent Mike Ross", capacity: 88, status: "max" },
    { agentName: "Agent Rachel Zane", capacity: 22, status: "assign_target" }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col h-full shadow-xs transition-colors duration-200">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={16} className="text-blue-600 dark:text-blue-500" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Load Balancing Radar</h3>
      </div>
      <div className="space-y-4 flex-1 overflow-y-auto">
        {defaultRoster.map((agent, idx) => {
          const isTarget = agent.status === "assign_target";
          return (
            <div key={idx} className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700 dark:text-slate-300">{agent.agentName}</span>
                <span className={`font-mono text-[10px] font-black uppercase tracking-wider ${isTarget ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-500"}`}>
                  [{agent.capacity}% Capacity]
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-950 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800/80 p-0.5">
                <div 
                  className={`h-full rounded-md transition-all duration-500 ${isTarget ? "bg-emerald-500" : "bg-amber-500"}`} 
                  style={{ width: `${agent.capacity}%` }} 
                />
              </div>
              {isTarget && (
                <span className="text-[9px] text-emerald-600/90 dark:text-emerald-400/90 font-black uppercase tracking-wider flex items-center gap-1 mt-1">
                  <UserCheck size={10} /> recommended assignment target channel
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

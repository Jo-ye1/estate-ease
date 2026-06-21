import React from "react";
import { AlertTriangle, ShieldAlert, Clock, UserCheck } from "lucide-react";

export default function CriticalAlertsPanel({ alerts }) {
  const defaultAlerts = alerts || [
    { type: "overdue", msg: "Overdue Follow-up: Agent Mike / Lead Sarah", meta: "Delayed 72 Hours" },
    { type: "dispute", msg: "Dispute Logged: Property #1094 Escrow Account", meta: "Legal Review Pending" },
    { type: "capacity", msg: "Target Alert: Branch West operational capacity at 45%", meta: "Under-allocated Load" }
  ];

  const getAlertStyle = (type) => {
    if (type === "dispute") return { icon: ShieldAlert, color: "text-rose-600 dark:text-rose-500", bg: "bg-rose-500/10 border-rose-500/20" };
    if (type === "overdue") return { icon: Clock, color: "text-amber-600 dark:text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" };
    return { icon: AlertTriangle, color: "text-blue-600 dark:text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" };
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col h-full shadow-xs transition-colors duration-200">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={16} className="text-rose-600 dark:text-rose-500" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Critical Alerts & Triage</h3>
      </div>
      <div className="space-y-3 flex-1 overflow-y-auto">
        {defaultAlerts.map((alert, idx) => {
          const style = getAlertStyle(alert.type);
          return (
            <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl flex items-start gap-3">
              <div className={`p-1.5 rounded-lg border shrink-0 ${style.bg} ${style.color}`}>
                <style.icon size={14} />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200 leading-normal">{alert.msg}</p>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono block">{alert.meta}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

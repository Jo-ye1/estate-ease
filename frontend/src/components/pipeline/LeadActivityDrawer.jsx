import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Clock, CheckCircle2, UserCheck, MessageSquare, ArrowRightLeft, FileUp } from "lucide-react";

export default function LeadActivityDrawer({ leadId, onClose }) {
  const [feed, setFeed] = useState({ today: [], yesterday: [], older: [] });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTimelineFeed = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/leads/${leadId}/timeline-feed`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data?.success && res.data?.feed) {
          setFeed(res.data.feed);
        }
      } catch (err) {
        console.error("Failed loading activity feed logs:", err);
      } finally {
        setLoading(false);
      }
    };
    if (leadId) fetchTimelineFeed();
  }, [leadId]);

  const getActionIcon = (action) => {
    const act = String(action).toLowerCase();
    if (act.includes("assign")) return <UserCheck size={14} className="text-teal-500 dark:text-teal-400" />;
    if (act.includes("stage") || act.includes("moved")) return <ArrowRightLeft size={14} className="text-blue-500 dark:text-blue-400" />;
    if (act.includes("note")) return <MessageSquare size={14} className="text-amber-500 dark:text-amber-400" />;
    if (act.includes("file") || act.includes("document")) return <FileUp size={14} className="text-purple-500 dark:text-purple-400" />;
    return <CheckCircle2 size={14} className="text-emerald-500 dark:text-emerald-400" />;
  };

  const renderSection = (title, items) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="space-y-3">
        <h4 className="text-[10px] uppercase tracking-wider font-black text-slate-400 dark:text-slate-500">{title}</h4>
        <div className="relative border-l border-slate-200 dark:border-slate-800 ml-2 space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="relative pl-6 text-xs">
              <div className="absolute -left-3.5 top-0.5 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full">
                {getActionIcon(item.action)}
              </div>
              <div className="font-bold text-slate-800 dark:text-slate-200">{item.action}</div>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{item.description}</p>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 block mt-1 flex items-center gap-1">
                <Clock size={10} /> {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col font-sans text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/40">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-blue-600 dark:text-blue-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">Activity Live Feed</h3>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer">
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-6">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (!feed.today?.length && !feed.yesterday?.length && !feed.older?.length) ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-20">No recent tracking parameters logged.</p>
        ) : (
          <>
            {renderSection("Today", feed.today)}
            {renderSection("Yesterday", feed.yesterday)}
            {renderSection("Older Activities", feed.older)}
          </>
        )}
      </div>
    </div>
  );
}

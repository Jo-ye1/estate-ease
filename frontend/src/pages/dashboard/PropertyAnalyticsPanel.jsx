import React, { useEffect, useState } from "react";
import { getPropertyAnalytics, getPropertySLA } from "@/services/propertyAnalyticsService";
import { Eye, Heart, UserCheck, Flame } from "lucide-react"; // 🟢 Functional anchors for high scannability

const PropertyAnalyticsPanel = ({ propertyId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [sla, setSla] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const analyticsData = await getPropertyAnalytics(propertyId);
        const slaData = await getPropertySLA(propertyId);
        setAnalytics(analyticsData);
        setSla(slaData);
      } catch (err) {
        console.error("Failed to load embedded summary indicators:", err);
      }
    };
    load();
  }, [propertyId]);

  if (!analytics) return null;

  return (
    // 🟢 TRANSFORMED: Renders as a single compact row of high-density micro-badges to prevent clipping
    <div className="flex items-center justify-between gap-1 w-full pt-3 border-t border-slate-100 dark:border-slate-800/60 mt-3">
      <MicroBadge 
        icon={<Eye className="w-3 h-3 text-blue-500" />} 
        label="Views" 
        value={analytics.views} 
      />
      <MicroBadge 
        icon={<Heart className="w-3 h-3 text-red-500" />} 
        label="Favs" 
        value={analytics.favorites} 
      />
      <MicroBadge 
        icon={<UserCheck className="w-3 h-3 text-emerald-500" />} 
        label="Leads" 
        value={analytics.leadRequests} 
      />
      <MicroBadge 
        icon={<Flame className="w-3 h-3 text-amber-500" />} 
        label="Conv" 
        value={`${analytics.conversionRate || 0}%`} 
      />
    </div>
  );
};

const MicroBadge = ({ icon, label, value }) => (
  // 🟢 COMPACT STYLING: Scaled down with text-[10px] bounding boxes to sit inside card limits comfortably
  <div className="flex flex-col items-center justify-center flex-1 bg-slate-50 dark:bg-slate-950/40 py-1 px-1.5 rounded-lg border border-slate-100 dark:border-slate-800/50 min-w-0">
    <div className="flex items-center gap-1 min-w-0">
      {icon}
      <span className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200 truncate">
        {value ?? "0"}
      </span>
    </div>
    <p className="text-[8.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">
      {label}
    </p>
  </div>
);

export default PropertyAnalyticsPanel;

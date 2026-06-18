import React, {
  useEffect,
  useState,
} from "react";
import {
  getPropertyAnalytics,
  getPropertySLA,
} from "@/services/propertyAnalyticsService";

const PropertyAnalyticsPanel = ({
  propertyId,
}) => {
  const [analytics, setAnalytics] =
    useState(null);

  const [sla, setSla] =
    useState(null);

  useEffect(() => {
    const load = async () => {
      const analyticsData =
        await getPropertyAnalytics(
          propertyId
        );

      const slaData =
        await getPropertySLA(propertyId);

      setAnalytics(analyticsData);
      setSla(slaData);
    };

    load();
  }, [propertyId]);

  if (!analytics || !sla)
    return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Metric
        label="Views"
        value={analytics.views}
      />
      <Metric
        label="Favorites"
        value={analytics.favorites}
      />
      <Metric
        label="Leads"
        value={analytics.leadRequests}
      />
      <Metric
        label="Conversion"
        value={`${analytics.conversionRate}%`}
      />
      <Metric
        label="Days On Market"
        value={analytics.daysOnMarket}
      />
      <Metric
        label="First Lead"
        value={formatMs(
          sla.timeToFirstLead
        )}
      />
      <Metric
        label="Publish Speed"
        value={formatMs(
          sla.timeToPublish
        )}
      />
      <Metric
        label="Close Speed"
        value={formatMs(
          sla.timeToClose
        )}
      />
    </div>
  );
};

const Metric = ({
  label,
  value,
}) => (
  <div className="bg-white p-4 rounded-xl border">
    <p className="text-xs text-gray-400">
      {label}
    </p>
    <h3 className="font-bold text-lg">
      {value ?? "-"}
    </h3>
  </div>
);

const formatMs = (ms) => {
  if (!ms) return "-";

  const days = Math.floor(
    ms / (1000 * 60 * 60 * 24)
  );

  return `${days} days`;
};

export default PropertyAnalyticsPanel;
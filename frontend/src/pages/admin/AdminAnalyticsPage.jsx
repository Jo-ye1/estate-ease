import { useEffect, useState } from "react";
import Navbar from "@/components/home/Navbar";
import { getAnalytics } from "@/services/analyticsServices";


export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      const data = await getAnalytics();
      setAnalytics(data);
    };

    loadAnalytics();
  }, []);

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black mb-8">
          Analytics Dashboard
        </h1>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h4 className="text-slate-500 text-sm">
              Total Leads
            </h4>
            <p className="text-3xl font-black mt-2">
              {analytics.totalLeads}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h4 className="text-slate-500 text-sm">
              Conversion Rate
            </h4>
            <p className="text-3xl font-black mt-2">
              {analytics.conversionRate}%
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h4 className="text-slate-500 text-sm">
              Top Properties
            </h4>
            <p className="text-3xl font-black mt-2">
              {analytics.topProperties.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h4 className="text-slate-500 text-sm">
              Owner Performance
            </h4>
            <p className="text-3xl font-black mt-2">
              {analytics.ownerPerformance.length}
            </p>
          </div>
        </div>

        {/* Top Properties */}
        <div className="bg-white rounded-2xl p-6 mb-10 shadow">
          <h2 className="text-xl font-bold mb-4">
            Top Properties Analytics
          </h2>

          {analytics.topProperties.map((property) => (
            <div
              key={property._id}
              className="flex justify-between border-b py-3"
            >
              <span>{property.title}</span>
              <span>{property.totalLeads} leads</span>
            </div>
          ))}
        </div>

        {/* Owner Performance */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-xl font-bold mb-4">
            Owner Performance Analytics
          </h2>

          {analytics.ownerPerformance.map((owner) => (
            <div
              key={owner._id}
              className="flex justify-between border-b py-3"
            >
              <span>{owner.name}</span>
              <span>{owner.totalLeads} leads</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
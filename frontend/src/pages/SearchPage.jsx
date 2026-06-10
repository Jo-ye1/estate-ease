import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProperties } from "../services/propertyService";
import PropertyCard from "@/components/home/PropertyCard";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const locationParam = searchParams.get("location") || "";
  const typeParam = searchParams.get("type") || "";
  const bedroomsParam = searchParams.get("bedrooms") || "";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const queryPayload = {};
        if (locationParam) queryPayload.location = locationParam;
        if (typeParam) queryPayload.type = typeParam;
        if (bedroomsParam) queryPayload.bedrooms = bedroomsParam;
        if (minPriceParam) queryPayload.minPrice = minPriceParam;
        if (maxPriceParam) queryPayload.maxPrice = maxPriceParam;

        const data = await getProperties(queryPayload);
        setProperties(data || []);
      } catch (error) {
        console.error("Search query execution failed:", error);
      } bits: {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [locationParam, typeParam, bedroomsParam, minPriceParam, maxPriceParam]);

  // 🛠️ C6 — LOADING STATE: Render a grid of glowing skeleton placeholders during search execution
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen bg-slate-950">
        <h1 className="text-4xl font-bold mb-8 text-white">Search Results</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((skeletonId) => (
            <div key={skeletonId} className="rounded-xl border border-slate-800 bg-slate-900 h-80 animate-pulse flex items-center justify-center text-slate-600 font-medium">
              Filtering options...
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen bg-slate-950">
      <div className="mb-8 border-b border-slate-800 pb-5">
        <h1 className="text-4xl font-bold text-white">Search Results</h1>
        <p className="text-blue-500 font-semibold mt-2 text-lg">
          {properties.length} {properties.length === 1 ? "Listing" : "Listings"} Found Matching Criteria
        </p>
      </div>

      {/* 🛠️ C7 — EMPTY STATE: Explicit handling when search parameters return 0 matching items */}
      {properties.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
          <h2 className="text-xl font-bold text-slate-300 mb-2">No properties found.</h2>
          <p className="text-sm text-slate-500">Try broadening your parameters or exploring different search keywords.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property._id} item={property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;

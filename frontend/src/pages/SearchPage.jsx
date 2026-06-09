import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProperties } from "../services/propertyService";
import PropertyCard from "@/components/home/PropertyCard";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Extract variables out from URL query parameters dynamically
  const locationParam = searchParams.get("location") || "";
  const typeParam = searchParams.get("type") || "";
  const bedroomsParam = searchParams.get("bedrooms") || "";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        
        // Assemble the query payload dynamically for our updated Axios service call
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
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [locationParam, typeParam, bedroomsParam, minPriceParam, maxPriceParam]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <h2 className="text-xl font-medium text-slate-400 animate-pulse">Filtering matching property listings...</h2>
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

      {properties.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
          <p className="text-xl text-slate-400 font-medium mb-2">No listings found matching those filter selections.</p>
          <p className="text-sm text-slate-500">Try broadening your parameters or exploring different locations.</p>
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

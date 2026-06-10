import { useEffect, useState } from "react";
import { getProperties } from "@/services/propertyService";
import PropertyCard from "./PropertyCard"; // Reuses your unified card engine with live favorite states

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getProperties();
        setProperties(data || []);
      } catch (error) {
        console.error("Failed to load featured properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold mb-12 text-slate-900 dark:text-white">Featured Properties</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((skeletonId) => (
            <div key={skeletonId} className="rounded-2xl border border-slate-800 bg-slate-900 h-96 animate-pulse flex items-center justify-center text-slate-600 font-medium">
              Loading featured asset...
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Slice the next 3 properties from the database (items 3 to 6) so it doesn't repeat the exact same "Latest Deals" cards above it
  const middleFeaturedList = properties.slice(3, 6).length > 0 
    ? properties.slice(3, 6) 
    : properties.slice(0, 3); // Fallback to first 3 if database has low item count

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <h2 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">Featured Properties</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-12">Handpicked exclusive listings premium verified by our agents</p>

      {middleFeaturedList.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-900/10">
          <p className="text-slate-400">No premium featured listings published yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {middleFeaturedList.map((property) => (
            <PropertyCard key={property._id} item={property} />
          ))}
        </div>
      )}
    </section>
  );
}

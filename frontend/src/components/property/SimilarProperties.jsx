import { useEffect, useState } from "react";
import { getProperties } from "@/services/propertyService";
import PropertyCard from "../properties/PropertyCard"; // Verify this import path points to your PropertyCard file

export default function SimilarProperties({ currentId }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties();
        setProperties(data || []);
      } catch (error) {
        console.log("Error loading similar listings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (loading) return <p className="text-gray-400 mt-4 text-sm animate-pulse">Loading similar listings...</p>;

  // Filters out the property the user is currently viewing using MongoDB's ._id string representation
  const similar = properties
    .filter((p) => p._id !== currentId)
    .slice(0, 3);

  // If there are no other alternative listings inside the backend, display a helpful inline fallback status text block
  if (similar.length === 0) {
    return (
      <section className="mt-20">
        <h2 className="text-3xl font-bold mb-6 text-white">Similar Properties</h2>
        <p className="text-gray-500 italic text-base">No alternative listings available at this time.</p>
      </section>
    );
  }

  return (
    <section className="mt-20">
      <h2 className="text-3xl font-bold mb-8 text-white">
        Similar Properties
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {similar.map((property) => (
          <PropertyCard
            key={property._id}
            property={property}
          />
        ))}
      </div>
    </section>
  );
}

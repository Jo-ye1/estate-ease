import { useEffect, useState } from "react";
import { getProperties } from "@/services/propertyService";
import PropertyCard from "./PropertyCard";

export default function PropertyDeals() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties();
        setProperties(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (loading) return <h2 className="p-10 text-center text-white">Loading deals...</h2>;

  // Grab the first 3 properties to display as featured deals
  const featuredDeals = properties.slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">Latest Property Deals</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        {featuredDeals.map((property) => (
          <PropertyCard
            key={property._id}
            item={property} // 👈 FIXED: Changed 'property={property}' to 'item={property}'
          />
        ))}
      </div>
    </section>
  );
}

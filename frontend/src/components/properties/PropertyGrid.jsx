import PropertyCard from "./PropertyCard";

export default function PropertyGrid({
  properties,
}) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property._id}
          property={property}
        />
      ))}
    </div>
  );
}

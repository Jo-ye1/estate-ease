import { featuredProperties } from "@/data/featuredProperties";

export default function FeaturedProperties() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <h2 className="text-4xl font-bold mb-12">
        Featured Properties
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {featuredProperties.map((property) => (
          <div
            key={property.id}
            className="overflow-hidden rounded-2xl border bg-card"
          >
            <img
              src={property.image}
              alt={property.title}
              className="h-60 w-full object-cover"
            />

            <div className="p-5">
              <h3 className="text-xl font-bold">
                {property.title}
              </h3>

              <p className="text-muted-foreground">
                {property.location}
              </p>

              <p className="text-blue-500 font-bold mt-3">
                {property.price}
              </p>

              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
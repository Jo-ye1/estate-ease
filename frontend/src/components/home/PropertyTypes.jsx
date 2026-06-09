const properties = [
  "Private House",
  "Apartment",
  "Exclusive Hotel",
  "Private Room",
  "Warehouse",
];

export default function PropertyTypes() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-4xl font-bold mb-12">
        Property Types
      </h2>

      <div className="grid md:grid-cols-5 gap-6">
        {properties.map((item) => (
          <div
            key={item}
            className="
              border
              rounded-2xl
              p-6
              text-center
              hover:shadow-lg
              transition
            "
          >
            <div className="text-4xl mb-4">
              🏠
            </div>

            <h3 className="font-semibold">
              {item}
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              100+ Listings
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
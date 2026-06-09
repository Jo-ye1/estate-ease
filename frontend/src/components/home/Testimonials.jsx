import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <h2 className="text-5xl font-bold text-center mb-16">
        What Our Clients Say
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((client) => (
          <div
            key={client.id}
            className="border rounded-2xl p-6"
          >
            <h3 className="font-bold text-xl">
              {client.name}
            </h3>

            <p className="text-blue-500 mb-4">
              {client.role}
            </p>

            <p className="text-slate-500">
              "{client.review}"
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
import { stats } from "@/data/stats";

export default function StatsSection() {
  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800 p-8 rounded-2xl text-center"
            >
              <h3 className="text-4xl font-bold text-blue-500">
                {item.value}
              </h3>

              <p className="mt-2 text-slate-400">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
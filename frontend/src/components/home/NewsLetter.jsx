export default function Newsletter() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <div className="rounded-3xl bg-blue-600 p-12 text-white">
        <h2 className="text-4xl font-bold mb-4">
          Subscribe To Get Latest News
        </h2>

        <p className="mb-8">
          Get updates about properties,
          investments and market trends.
        </p>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 rounded-xl px-4 py-3 text-black"
          />

          <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}
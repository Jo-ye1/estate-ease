export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div
        className="
          rounded-3xl
          overflow-hidden
          h-[500px]
          relative
          bg-cover
          bg-center
        "
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1400')",
        }}
      >
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 p-12 text-white">
          <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
            A Vision For Your Life
          </span>

          <h1 className="mt-6 text-6xl font-bold max-w-xl">
            Find Your Best Real Estate
          </h1>

          <p className="mt-4 max-w-lg">
            Discover properties that match your
            lifestyle and investment goals.
          </p>
        </div>
      </div>
    </section>
  );
}
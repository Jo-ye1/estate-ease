import aboutImg from "@/assets/about-house.jpg";

export default function AboutUs() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <img
            src={aboutImg}
            alt="About Us"
            className="rounded-3xl shadow-xl"
          />
        </div>

        <div>
          <p className="text-blue-500 font-semibold mb-2">
            ABOUT US
          </p>

          <h2 className="text-5xl font-bold mb-6">
            We Are The Best And Trusted
            Real Estate Agent
          </h2>

          <p className="text-slate-500 mb-8">
            Estate Ease helps people find
            verified properties quickly and
            safely. We focus on transparency,
            trust, and simplicity.
          </p>

          <div className="space-y-4">
            <div>✅ Trusted Agents</div>
            <div>✅ Verified Properties</div>
            <div>✅ Easy Buying Process</div>
          </div>

          <button className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-xl">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
import chooseImg from "@/assets/modern-house.jpg";

export default function WhyChooseUs() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-blue-500 font-semibold mb-2">
            WHY CHOOSE US
          </p>

          <h2 className="text-5xl font-bold mb-6">
            We Offer The Best
            Real Estate Deals
          </h2>

          <ul className="space-y-5">
            <li>✅ Professional Agents</li>
            <li>✅ Safe Transactions</li>
            <li>✅ Verified Listings</li>
            <li>✅ Fast Customer Support</li>
          </ul>
        </div>

        <div>
          <img
            src={chooseImg}
            alt=""
            className="rounded-3xl shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}
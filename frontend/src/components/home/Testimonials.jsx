import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(1); 

  useEffect(() => {
    const fetchLiveReviews = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/testimonials");
        setReviews((data || []).slice(0, 3));
      } catch (err) {
        console.error("Failed loading backend customer reviews:", err);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveReviews();
  }, []);

  if (loading) {
    return (
      <div className="max-w-[1305px] mx-auto px-4 my-16 text-center">
        <div className="text-sm font-bold text-slate-400 animate-pulse">Loading customer feedback...</div>
      </div>
    );
  }

  const fallbackReviews = [
    { _id: "f1", quote: "Incredibly smooth experience from start to finish! I found a great apartment, bookmarked my favorites, and reached out to the owner directly through the site. Everything worked perfectly.", user: { name: "Christopher J. Larson", role: "user" }, stars: 5 },
    { _id: "f2", quote: "Estate Ease is hands down the best property platform I've used. Sleek design, fast search metrics, and fantastic user experience. 10/10!", user: { name: "Derrick P. Boudreaux", role: "user" }, stars: 5 },
    { _id: "f3", quote: "As a broker, this platform has completely transformed how I manage my listings. The dashboard is intuitive, uploading property data is lightning-fast, and the inquiry leads come straight to my inbox without any hassle. A...", user: { name: "Stanley S. Nesbitt", role: "user" }, stars: 5 }
  ];

  const displayList = reviews.length >= 3 ? reviews : fallbackReviews;

  return (
    <section className="max-w-[1305px] mx-auto px-4 my-16 select-none text-left">
      
      {/* LEFT FLUSH HEADER COMPONENT ROW WITH ACCENT LINE */}
      <div className="mb-12 relative inline-block max-w-max">
        <h2 className="text-2xl lg:text-3xl font-black text-slate-800 dark:text-white tracking-tight pb-3">
          What Our <span className="text-blue-600 dark:text-blue-500">Client</span> Says
        </h2>
        <div className="absolute bottom-0 left-0 w-2/3 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full" />
      </div>

      {/* 📊 GRID PATTERN STRUCTURE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center items-center">
        {displayList.map((client, index) => {
          const isActive = activeSlide === index;
          const reviewerName = client.user?.name || "Verified Customer";
          const reviewerRole = client.user?.role || "user";
          const firstLetter = reviewerName.charAt(0).toUpperCase();

          return (
            <div
              key={client._id || index}
              onClick={() => setActiveSlide(index)}
              className={`relative rounded-2xl p-6 flex flex-col justify-between w-full max-w-[380px] h-[340px] transition-all duration-300 cursor-pointer overflow-hidden border bg-white ${
                isActive
                  ? "border-blue-600 dark:border-blue-500 shadow-[0_20px_50px_rgba(11,79,185,0.04)] dark:shadow-black/40 scale-[1.02] z-10"
                  : "border-slate-200/80 dark:border-slate-800/40 opacity-70 hover:opacity-100"
              }`}
            >
              
              <div className="relative z-10 text-left">
                {/* 🎯 FIXED AVATAR GEOMETRY: Changed from a circle to a clean rounded rectangle (rounded-xl) */}
                <div className={`w-12 h-12 rounded-xl text-white font-black text-sm flex items-center justify-center uppercase shadow-sm mb-4 shrink-0 transition-all ${
                  isActive ? "bg-blue-600 scale-[1.02]" : "bg-slate-300 dark:bg-slate-700"
                }`}>
                  {firstLetter}
                </div>

                {/* Quote Text Element */}
                <div className="w-full max-w-[336px] h-[72px] overflow-hidden flex items-start">
                  <p className={`text-[11.5px] font-medium leading-[1.6] tracking-wide line-clamp-4 transition-colors ${
                    isActive ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-500"
                  }`}>
                    "{client.quote || client.text}"
                  </p>
                </div>
              </div>

              {/* Quote Mark Watermark decal */}
              <div className={`absolute right-6 top-12 font-serif font-black select-none pointer-events-none z-0 text-7xl transition-colors ${
                isActive ? "text-slate-100 dark:text-slate-800/10" : "text-slate-100/40 dark:text-slate-800/5"
              }`}>
                ”
              </div>

              <div className="w-full flex flex-col items-center z-10 mt-2">
                {/* Card Divider Line */}
                <div className="w-full max-w-[348px] h-[1px] bg-slate-100 dark:bg-slate-800/40 mb-4 select-none pointer-events-none" />

                {/* Lower User Meta Layer */}
                <div className="w-full flex items-end justify-between px-1">
                  <div className="text-left flex flex-col justify-end min-w-0">
                    <div className="w-full max-w-[159px] h-[22px] flex items-center overflow-hidden">
                      <h4 className={`font-bold text-[13px] tracking-tight truncate leading-none transition-colors ${
                        isActive ? "text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"
                      }`}>
                        {reviewerName}
                      </h4>
                    </div>
                    <div className="w-full max-w-[101px] h-[19px] flex items-center overflow-hidden mt-0.5">
                      <p className={`text-[10px] font-black tracking-wide uppercase transition-colors ${
                        isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"
                      }`}>
                        {reviewerRole}
                      </p>
                    </div>
                  </div>

                  {/* Stars Matrix Grid */}
                  <div className={`w-full max-w-[96px] h-[16px] flex items-center justify-end gap-0.5 text-amber-400 text-[11px] mb-0.5 overflow-hidden transition-opacity ${
                    isActive ? "opacity-100" : "opacity-40"
                  }`}>
                    {Array.from({ length: client.stars || 5 }).map((_, idx) => (
                      <span key={idx} className="select-none leading-none">★</span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Pagination Slider Indicator Diamonds Track */}
      <div className="flex justify-center items-center gap-2 mt-12">
        {[0, 1, 2].map((idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveSlide(idx)}
            className={`transition-all duration-300 cursor-pointer border-0 p-0 flex items-center justify-center ${
              activeSlide === idx 
                ? "w-2.5 h-2.5 bg-blue-600 dark:bg-blue-500 rotate-45" 
                : "w-1.5 h-1.5 bg-slate-300 dark:bg-slate-700"
            }`}
            style={{ borderRadius: activeSlide === idx ? '0px' : '50%' }}
          />
        ))}
      </div>

    </section>
  );
}

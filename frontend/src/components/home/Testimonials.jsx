import React, { useEffect, useState } from "react";
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
    { 
      _id: "f1", 
      quote: "Incredibly smooth experience from start to finish! I found a great apartment, bookmarked my favorites, and reached out to the owner directly through the site. Everything worked perfectly.", 
      user: { 
        id: "660c1ad2e", 
        name: "Christopher J. Larson", 
        role: "user",
        avatar: "https://unsplash.com" 
      }, 
      stars: 5 
    },
    { 
      _id: "f2", 
      quote: "Estate Ease is hands down the best property platform I've used. Sleek design, fast search metrics, and fantastic user experience. 10/10!", 
      user: { 
        id: "660c1b48f", 
        name: "Derrick P. Boudreaux", 
        role: "user",
        avatar: "https://unsplash.com"
      }, 
      stars: 5 
    },
    { 
      _id: "f3", 
      quote: "As a broker, this platform has completely transformed how I manage my listings. The dashboard is intuitive, uploading property data is lightning-fast, and the inquiry leads come straight to my inbox without any hassle.", 
      user: { 
        id: "660c23a1a", 
        name: "Stanley S. Nesbitt", 
        role: "broker",
        avatar: "https://unsplash.com"
      }, 
      stars: 5 
    }
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
          const reviewerId = client.user?.id || client.user?._id || "fallback";

          // Intercept Image Path dynamically
          const finalAvatarSrc = (() => {
            const rawAvatar = client.user?.avatar || client.user?.profilePic || client.user?.image;
            if (rawAvatar && rawAvatar.trim() !== "") {
              return rawAvatar.startsWith("http") ? rawAvatar : `http://localhost:5000${rawAvatar}`;
            }
            return localStorage.getItem(`user_profile_pic_${reviewerId}`) || "";
          })();

          return (
            <div
              key={client._id || index}
              onClick={() => setActiveSlide(index)}
              // 🎨 COLOR FIXED: Changed border values to remain readable, rich, and balanced in Light Mode
              className={`relative rounded-2xl p-6 flex flex-col justify-between w-full max-w-[380px] h-[340px] transition-all duration-300 cursor-pointer overflow-hidden border ${
                isActive
                  ? "bg-white dark:bg-slate-900 border-blue-600 dark:border-blue-500 shadow-[0_20px_40px_rgba(59,130,246,0.06)] dark:shadow-black/40 scale-[1.02] z-10 opacity-100"
                  : "bg-white dark:bg-slate-900/60 border-slate-300 dark:border-slate-800/80 opacity-60 hover:opacity-90"
              }`}
            >
              
              <div className="relative z-10 text-left">
                {/* 📷 IMAGE FORMATTING FIXED: Added 'w-full h-full object-cover rounded-xl' properties to lock aspect ratio */}
                <div className={`w-12 h-12 rounded-xl overflow-hidden shadow-xs mb-4 shrink-0 transition-all flex items-center justify-center border ${
                  isActive 
                    ? "bg-slate-100 dark:bg-slate-800 border-blue-500/30 ring-2 ring-blue-500/20" 
                    : "bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800"
                }`}>
                  {finalAvatarSrc ? (
                    <img 
                      src={finalAvatarSrc} 
                      alt={reviewerName} 
                      className="w-full h-full object-cover object-center rounded-xl" // 👈 Fixed: Stops picture squishing completely
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML = `<span class="font-black text-sm text-slate-700 dark:text-slate-300 uppercase">${firstLetter}</span>`;
                      }}
                    />
                  ) : (
                    <span className="font-black text-sm text-slate-500 dark:text-slate-400 uppercase">{firstLetter}</span>
                  )}
                </div>

                {/* Quote Text Element */}
                <div className="w-full max-w-[336px] h-[110px] overflow-hidden flex items-start">
                  {/* 🎨 TEXT COLORING FIXED: Boosted visibility from washed-out slates to solid dark grays/whites */}
                  <p className={`text-[12px] font-medium leading-[1.6] tracking-wide line-clamp-5 transition-colors ${
                    isActive ? "text-slate-800 dark:text-slate-200" : "text-slate-600 dark:text-slate-400"
                  }`}>
                    "{client.quote || client.text}"
                  </p>
                </div>
              </div>

              {/* Quote Mark Watermark decal */}
              <div className={`absolute right-6 top-12 font-serif font-black select-none pointer-events-none z-0 text-7xl transition-colors ${
                isActive ? "text-slate-100/80 dark:text-slate-800/10" : "text-slate-100/30 dark:text-slate-800/5"
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
                      {/* 🎨 TEXT COLORING FIXED: Increased contrast signature */}
                      <h4 className={`font-bold text-[13px] tracking-tight truncate leading-none transition-colors ${
                        isActive ? "text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400"
                      }`}>
                        {reviewerName}
                      </h4>
                    </div>
                    <div className="w-full max-w-[101px] h-[19px] flex items-center overflow-hidden mt-0.5">
                      <p className={`text-[10px] font-black tracking-wide uppercase transition-colors ${
                        isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-500"
                      }`}>
                        {reviewerRole}
                      </p>
                    </div>
                  </div>

                  {/* Stars Matrix Grid */}
                  <div className={`w-full max-w-[96px] h-[16px] flex items-center justify-end gap-0.5 text-amber-400 text-[11px] mb-0.5 overflow-hidden transition-opacity ${
                    isActive ? "opacity-100" : "opacity-50"
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

      {/* Pagination Slider Indicator Track */}
      <div className="flex justify-center items-center gap-2 mt-12">
        {[0, 1, 2].map((idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveSlide(idx)}
            className={`transition-all duration-300 cursor-pointer border-0 p-0 flex items-center justify-center outline-none ${
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

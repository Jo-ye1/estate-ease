import React, { useState, useEffect } from "react";
import Navbar from "@/components/home/Navbar";
import api from "@/lib/api";

export default function AboutUs() {
  const [openAccordion, setOpenAccordion] = useState(0);
  const [loading, setLoading] = useState(true);

  // --- 1. Dynamic State Property Pools (Hydrates from MongoDB Atlas HomeCms Model) ---
  const [aboutHeading, setAboutHeading] = useState("We Are The Best And Trusted Real Estate Agent");
  const [aboutP1, setAboutP1] = useState("Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat.");
  const [aboutP2, setAboutP2] = useState("Sed ut perspiciatis unde omnis iste natus voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae.");
  const [aboutImage, setAboutImage] = useState("");
  const [accordionItems, setAccordionItems] = useState([
    {
      title: "Sed ut perspiciatis unde omnis ?",
      content: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores ratione voluptatem sequi nesciunt."
    },
    {
      title: "Quis autem vel eum iure reprehenderit ?",
      content: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?"
    },
    {
      title: "Sed ut perspiciatis unde omnis..?",
      content: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum."
    }
  ]);

  // --- 2. 👑 LIVE MERN API CONTENT HYDRATION LAYER ---
  useEffect(() => {
    const fetchLandingAboutData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/admin-settings/home-cms");
        
        if (data) {
          if (data.aboutHeading) setAboutHeading(data.aboutHeading);
          if (data.aboutP1) setAboutP1(data.aboutP1);
          if (data.aboutP2) setAboutP2(data.aboutP2);
          
          if (data.accordions && Array.isArray(data.accordions) && data.accordions.length > 0) {
            // Map Mongoose schema property sub-keys (q, a) into matching title/content labels seamlessly
            const formattedAccordions = data.accordions.map(item => ({
              title: item.q || "Untitled Query Standard",
              content: item.a || "No description copy provided."
            }));
            setAccordionItems(formattedAccordions);
          }

          if (data.aboutImage && data.aboutImage.trim() !== "") {
            setAboutImage(data.aboutImage.startsWith("http") || data.aboutImage.startsWith("data:")
              ? data.aboutImage 
              : `http://localhost:5000${data.aboutImage}`
            );
          }
        }
      } catch (err) {
        console.warn("Express backend server unreachable, maintaining local backup states...", err);
        // Fallback strategy from local memory parameters
        setAboutHeading(localStorage.getItem('home_about_heading') || "We Are The Best And Trusted Real Estate Agent");
        setAboutP1(localStorage.getItem('home_about_p1') || "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat.");
        setAboutP2(localStorage.getItem('home_about_p2') || "Sed ut perspiciatis unde omnis iste natus voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae.");
        
        const savedImage = localStorage.getItem('home_about_image');
        if (savedImage) setAboutImage(savedImage);

        const savedAccordions = localStorage.getItem('home_about_accordions');
        if (savedAccordions) {
          const parsed = JSON.parse(savedAccordions);
          setAccordionItems(parsed.map(item => ({ title: item.q, content: item.a })));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchLandingAboutData();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-[1259px] mx-auto px-4 my-16 text-center select-none">
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 animate-pulse">Hydrating Landing Grid Modules...</div>
      </div>
    );
  }

  return (
    // 🎯 TARGET CANVAS WIDTH (1259px layout envelope)
    <section className="max-w-[1259px] mx-auto px-4 my-16 select-none text-left">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative">
        
        {/* LEFT COLUMN: HOUSE IMAGE WITH DYNAMIC FALLBACK AND DECAL OVERLAYS */}
        <div className="relative flex justify-start items-center p-6 pl-0">
          {/* Dotted pattern graphic sitting subtly tucked behind the image frame */}
          <div className="absolute left-[-20px] top-12 w-32 h-44 opacity-20 bg-[radial-gradient(#0b4fb9_1.5px,transparent_1.5px)] [background-size:12px_12px]" />
          
          <div className="relative w-full max-w-[460px] h-[480px] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-800/80 z-10 bg-slate-100 dark:bg-slate-900">
            <img
              src={aboutImage || "https://unsplash.com"}
              alt="About Us Portfolio"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.src = "https://unsplash.com";
              }}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: REFINED TYPOGRAPHY & BLUE CHECK ACCORDIONS */}
        <div className="flex flex-col justify-center text-left">

          <div className="w-full block relative mb-4">
            <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-500 pb-2 block">
              About Us
            </span>
            {/* 🎯 TARGET ALIGNED LEFT ACCENT LINE STRETCH */}
            <div className="absolute bottom-0 left-0 w-[45px] h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full" />
          </div>
                  
          {/* MAIN HEADLINES */}
          <h2 className="text-3xl lg:text-[38px] font-black tracking-tight leading-[1.15] text-slate-800 dark:text-white mt-4 max-w-[500px]">
            {aboutHeading}
          </h2>
          
          <div className="text-xs text-slate-400 dark:text-slate-500 space-y-3 mt-6 max-w-[560px] font-medium leading-relaxed">
            {aboutP1 && <p>{aboutP1}</p>}
            {aboutP2 && <p>{aboutP2}</p>}
          </div>

          {/* ACCORDION PILES DRAWER ELEMENT CONTAINER */}
          <div className="mt-8 space-y-3.5 max-w-[560px]">
            {accordionItems.map((item, index) => {
              const isOpen = openAccordion === index;
              return (
                <div 
                  key={index}
                  className="w-full bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm transition-all duration-200"
                >
                  {/* Accordion row trigger button */}
                  <button
                    type="button"
                    onClick={() => setOpenAccordion(isOpen ? -1 : index)}
                    className="w-full flex items-center justify-between p-4 text-left border-0 bg-transparent cursor-pointer outline-none"
                  >
                    <div className="flex items-center gap-3">
                      {/* Blue circular frame icon container */}
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border text-[9px] font-black transition-all ${
                        isOpen 
                          ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-600/20" 
                          : "bg-blue-50/50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400"
                      }`}>
                        ✓
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 tracking-tight">
                        {item.title}
                      </span>
                    </div>
                    {/* Vertically centered arrow dropdown handle */}
                    <span className="text-[8px] text-slate-400 transition-transform duration-200 flex items-center h-full -mt-[1px]" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      ▼
                    </span>
                  </button>

                  <div 
                    className="transition-all duration-300 overflow-hidden"
                    style={{ height: isOpen ? 'auto' : '0px', opacity: isOpen ? 1 : 0 }}
                  >
                    <div className="px-12 pb-4 pt-1 border-t border-slate-50 dark:border-slate-800 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
                      {item.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
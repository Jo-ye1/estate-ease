import React, { useState, useEffect } from 'react';
import { Save, Upload, ImageIcon, Info, ShieldCheck, HelpCircle } from 'lucide-react';
import api from "@/lib/api";

export default function HomeManager() {
  const [activeSubTab, setActiveSubTab] = useState("about_us");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- MODULE 1: ABOUT US CONTENT STATES ---
  const [aboutHeading, setAboutHeading] = useState("We Are The Best And Trusted Real Estate Agent");
  const [aboutP1, setAboutP1] = useState("");
  const [aboutP2, setAboutP2] = useState("");
  const [aboutImage, setAboutImage] = useState("");
  const [accordions, setAccordions] = useState([
    { q: "Sed ut perspiciatis unde omnis ?", a: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit." },
    { q: "Quis autem vel eum iure reprehenderit ?", a: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis." },
    { q: "Sed ut perspiciatis unde omnis..?", a: "Quis autem vel eum iure reprehenderit qui in ea voluptate." }
  ]);

  // --- MODULE 2: WHY CHOOSE US CONTENT STATES ---
  const [chooseHeading, setChooseHeading] = useState("We Are Offering The Best Real Estate Deals");
  const [chooseP1, setChooseP1] = useState("");
  const [chooseP2, setChooseP2] = useState("");
  const [chooseImage, setChooseImage] = useState("");
  const [statYears, setStatYears] = useState("12+");
  const [statCustomers, setStatCustomers] = useState("4,800+");
  const [statCapital, setStatCapital] = useState("15M+");
  const [bullets, setBullets] = useState([
    "A building with only one room and typically a steep pointy roof.",
    "A vehicle on wheels that has a permanent residence attached to it.",
    "Performing financial analysis and valuation of properties.",
    "Someone who examines buildings and works with appraisers.",
    "A dwelling typically made of raw materials such as bamboo, mud, and clay."
  ]);

  // --- FETCH PRE-EXISTING DATA FROM MONGODB ATLAS ON MOUNT ---
  useEffect(() => {
    const fetchHomeCMSData = async () => {
      try {
        const { data } = await api.get("/admin-settings/home-cms");
        if (data) {
          if (data.aboutHeading) setAboutHeading(data.aboutHeading);
          if (data.aboutP1) setAboutP1(data.aboutP1);
          if (data.aboutP2) setAboutP2(data.aboutP2);
          if (data.aboutImage) setAboutImage(data.aboutImage);
          if (data.accordions && data.accordions.length > 0) setAccordions(data.accordions);
          
          if (data.chooseHeading) setChooseHeading(data.chooseHeading);
          if (data.chooseP1) setChooseP1(data.chooseP1);
          if (data.chooseP2) setChooseP2(data.chooseP2);
          if (data.chooseImage) setChooseImage(data.chooseImage);
          if (data.statYears) setStatYears(data.statYears);
          if (data.statCustomers) setStatCustomers(data.statCustomers);
          if (data.statCapital) setStatCapital(data.statCapital);
          if (data.bullets && data.bullets.length > 0) setBullets(data.bullets);
        }
      } catch (err) {
        console.warn("Backend API cold-load, parsing LocalStorage storage caches memory channels instead.", err);
        setAboutHeading(localStorage.getItem('home_about_heading') || "We Are The Best And Trusted Real Estate Agent");
        setAboutP1(localStorage.getItem('home_about_p1') || "");
        setAboutP2(localStorage.getItem('home_about_p2') || "");
        setAboutImage(localStorage.getItem('home_about_image') || "");
        setChooseHeading(localStorage.getItem('home_choose_heading') || "We Are Offering The Best Real Estate Deals");
        setChooseP1(localStorage.getItem('home_choose_p1') || "");
        setChooseP2(localStorage.getItem('home_choose_p2') || "");
        setChooseImage(localStorage.getItem('home_choose_image') || "");
        setStatYears(localStorage.getItem('home_stat_years') || "12+");
        setStatCustomers(localStorage.getItem('home_stat_customers') || "4,800+");
        setStatCapital(localStorage.getItem('home_stat_capital') || "15M+");
      }
    };
    fetchHomeCMSData();
  }, []);

  // --- IMAGE TO BASE64 FILE CONVERTERS ---
  const handleImageConversion = (targetSetter, e) => {
    const file = e.target.files;
    if (!file || file.length === 0) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      targetSetter(reader.result);
    };
    reader.readAsDataURL(file[0]);
  };

  // --- 👑 REWRITTEN UNIFIED SAVE HANDLER ---
  const handleSaveHomepageCMS = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      const homeCmsPayload = {
        aboutHeading,
        aboutP1,
        aboutP2,
        aboutImage,
        accordions: accordions.map(acc => ({ q: acc.q, a: acc.a })), 
        chooseHeading,
        chooseP1,
        chooseP2,
        chooseImage,
        statYears,
        statCustomers,
        statCapital,
        bullets
      };

      await api.put("/admin-settings/home-cms", homeCmsPayload);

      // Local storage backup synchronization
      localStorage.setItem('home_about_heading', aboutHeading);
      localStorage.setItem('home_about_p1', aboutP1);
      localStorage.setItem('home_about_p2', aboutP2);
      localStorage.setItem('home_about_image', aboutImage);
      localStorage.setItem('home_about_accordions', JSON.stringify(accordions));
      localStorage.setItem('home_choose_heading', chooseHeading);
      localStorage.setItem('home_choose_p1', chooseP1);
      localStorage.setItem('home_choose_p2', chooseP2);
      localStorage.setItem('home_choose_image', chooseImage);
      localStorage.setItem('home_stat_years', statYears);
      localStorage.setItem('home_stat_customers', statCustomers);
      localStorage.setItem('home_stat_capital', statCapital);
      localStorage.setItem('home_choose_bullets', JSON.stringify(bullets));

      alert("Homepage Content configurations saved successfully onto MongoDB Atlas server datastore!");
    } catch (err) {
      console.error("Home CMS Sync Error:", err);
      alert("Failed to synchronize layout arrays with backend servers.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardBgClass = "bg-white dark:bg-[#0a101d] border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-2xl text-left shadow-xs space-y-5";
  const inputClass = "w-full bg-slate-50 dark:bg-[#111927] border border-slate-200 dark:border-gray-800 text-slate-900 dark:text-white rounded-xl p-3 text-sm font-medium outline-none focus:border-blue-500 transition-colors";
  const labelClass = "block text-xs font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-1.5 text-left";

  return (
    <form onSubmit={handleSaveHomepageCMS} className="space-y-6 w-full text-left">
      
      {/* SECTION SUB-TAB NAV CONTROL BAR ROW SELECTOR */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800/60 pb-2 w-full">
        {["about_us", "why_choose_us"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveSubTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-0 cursor-pointer ${
              activeSubTab === tab ? "bg-blue-600 text-white shadow-xs" : "bg-transparent text-slate-400 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            {tab === "about_us" ? "About Us Segment" : "Why Choose Us Segment"}
          </button>
        ))}
      </div>

      {/* SUB-TAB 1: ABOUT US CONFIGURATION BOARD */}
      {activeSubTab === "about_us" && (
        <div className={cardBgClass}>
          <div className="border-b border-slate-100 dark:border-slate-800/40 pb-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-500" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-200">01 / Landing About Us Configuration Matrix</h4>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
            <div className="lg:col-span-4 flex flex-col gap-2 w-full">
              <label className={labelClass}>Landscaping Context Image</label>
              <label className="w-full h-44 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer relative overflow-hidden group bg-slate-50 dark:bg-slate-950/20 hover:border-blue-500 transition-colors">
                {aboutImage ? (
                  <>
                    <img src={aboutImage} alt="About Us Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-bold uppercase tracking-wider">Change Image</div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-slate-400 font-bold text-[10px] uppercase gap-1">
                    <ImageIcon className="w-5 h-5 text-blue-500" />
                    <span>Choose Image Asset</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleImageConversion(setAboutImage, e)} className="hidden" />
              </label>
            </div>

 <div className="lg:col-span-8 space-y-4 w-full">
              <div>
                <label className={labelClass}>Section Blueprint Heading Title</label>
                <input type="text" value={aboutHeading} onChange={e => setAboutHeading(e.target.value)} className={inputClass} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Paragraph Content Block 01</label>
                  <textarea rows="4" value={aboutP1} onChange={e => setAboutP1(e.target.value)} className={inputClass + " resize-none text-xs leading-relaxed"} placeholder="Et harum quidem rerum facilis est et expedita distinctio..." />
                </div>
                <div>
                  <label className={labelClass}>Paragraph Content Block 02</label>
                  <textarea rows="4" value={aboutP2} onChange={e => setAboutP2(e.target.value)} className={inputClass + " resize-none text-xs leading-relaxed"} placeholder="Sed ut perspiciatis unde omnis iste natus voluptatem..." />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/40 space-y-3 w-full">
            <label className={labelClass}>Interactive Checked Accordions Array (3 Slots)</label>
            {accordions.map((acc, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200 dark:border-gray-800 w-full">
                <input type="text" value={acc.q || acc.title || ""} onChange={e => { const updated = [...accordions]; updated[idx].q = e.target.value; setAccordions(updated); }} className={inputClass + " text-xs font-bold"} placeholder="Accordion Title Trigger Query" />
                <input type="text" value={acc.a || acc.content || ""} onChange={e => { const updated = [...accordions]; updated[idx].a = e.target.value; setAccordions(updated); }} className={inputClass + " text-xs"} placeholder="Accordion Expanded Content Answer" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: WHY CHOOSE US CONFIGURATION BOARD */}
      {activeSubTab === "why_choose_us" && (
        <div className={cardBgClass}>
          <div className="border-b border-slate-100 dark:border-slate-800/40 pb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-200">02 / Landing Why Choose Us Configuration Matrix</h4>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
            <div className="lg:col-span-4 flex flex-col gap-2 w-full">
              <label className={labelClass}>Slanted Accent House Image</label>
              <label className="w-full h-44 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer relative overflow-hidden group bg-slate-50 dark:bg-slate-950/20 hover:border-emerald-500 transition-colors">
                {chooseImage ? (
                  <>
                    <img src={chooseImage} alt="Choose Us Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-bold uppercase tracking-wider">Change Image</div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-slate-400 font-bold text-[10px] uppercase gap-1"><ImageIcon className="w-5 h-5 text-emerald-500" /><span>Choose Image Asset</span></div>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleImageConversion(setChooseImage, e)} className="hidden" />
              </label>
            </div>

            <div className="lg:col-span-8 space-y-4 w-full">
              <div>
                <label className={labelClass}>Section Blueprint Heading Title</label>
                <input type="text" value={chooseHeading} onChange={e => setChooseHeading(e.target.value)} className={inputClass} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Paragraph Content Block 01</label>
                  <textarea rows="3" value={chooseP1} onChange={e => setChooseP1(e.target.value)} className={inputClass + " resize-none text-xs leading-relaxed"} />
                </div>
                <div>
                  <label className={labelClass}>Paragraph Content Block 02</label>
                  <textarea rows="3" value={chooseP2} onChange={e => setChooseP2(e.target.value)} className={inputClass + " resize-none text-xs leading-relaxed"} />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 w-full">
                <div><label className={labelClass}>Experience Badge</label><input type="text" value={statYears} onChange={e => setStatYears(e.target.value)} className={inputClass + " text-center font-black font-mono text-blue-500"} /></div>
                <div><label className={labelClass}>Customers Count</label><input type="text" value={statCustomers} onChange={e => setStatCustomers(e.target.value)} className={inputClass + " text-center font-black font-mono text-blue-500"} /></div>
                <div><label className={labelClass}>Capital Value</label><input type="text" value={statCapital} onChange={e => setStatCapital(e.target.value)} className={inputClass + " text-center font-black font-mono text-blue-500"} /></div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/40 space-y-3 w-full">
            <label className={labelClass}>Feature Attribute Bullet List Description Phrases (5 Slots)</label>
            {bullets.map((bullet, idx) => (
              <div key={idx} className="relative flex items-center w-full">
                <span className="absolute left-3 font-mono text-xs font-black text-slate-400">0{idx+1} •</span>
                <input type="text" value={bullet} onChange={e => { const updated = [...bullets]; updated[idx] = e.target.value; setBullets(updated); }} className={inputClass + " pl-12 text-xs font-semibold"} placeholder="Enter bullet point descriptive phrase context..." />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex justify-end w-full">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-blue-500/10 border-0 cursor-pointer outline-none"
        >
          {isSubmitting ? "TRANSMITTING CMS NODES..." : "Push Homepage CMS Updates to MongoDB Atlas →"}
        </button>
      </div>

    </form>
  );
}
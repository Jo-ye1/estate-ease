import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Info, History, Users } from 'lucide-react';
import api from "@/lib/api"; 

export default function AboutManager() {
  const [activeSubTab, setActiveSubTab] = useState("history");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    heading: "",
    subheading: "",
    paragraph: "",
    heroImage: "",
    pillars: [],
    history: [],
    advisors: []
  });

  useEffect(() => {
    const fetchCurrentCMSData = async () => {
      try {
        const { data } = await api.get("/admin-settings/about");
        if (data) {
          setFormData({
            heading: data.heading || "About the Estate Ease Engine",
            subheading: data.subheading || "Redefining corporate real-estate ecosystems.",
            paragraph: data.paragraph || "",
            heroImage: data.heroImage || "",
            pillars: data.pillars || [],
            history: data.history || [],
            advisors: data.advisors || []
          });
        }
      } catch (err) {
        console.warn("Express backend offline, utilizing local storage fallback configurations.", err);
        setFormData({
          heading: localStorage.getItem('about_heading') || "About the Estate Ease Engine",
          subheading: localStorage.getItem('about_subheading') || "Redefining corporate real-estate ecosystems.",
          paragraph: localStorage.getItem('about_paragraph') || "",
          heroImage: localStorage.getItem('about_hero_image') || "",
          pillars: localStorage.getItem('about_pillars') ? JSON.parse(localStorage.getItem('about_pillars')) : [],
          history: localStorage.getItem('about_history') ? JSON.parse(localStorage.getItem('about_history')) : [],
          advisors: localStorage.getItem('about_advisors') ? JSON.parse(localStorage.getItem('about_advisors')) : []
        });
      }
    };
    fetchCurrentCMSData();
  }, []);



  const updateArrayField = (sectionKey, index, fieldKey, incomingValue) => {
    const freshSectionArray = [...formData[sectionKey]];
    freshSectionArray[index] = {
      ...freshSectionArray[index],
      [fieldKey]: incomingValue
    };
    setFormData({
      ...formData,
      [sectionKey]: freshSectionArray
    });
  };

  const handleMediaUpload = (sectionKey, index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (index !== null && index !== undefined) {
        updateArrayField(sectionKey, index, "image", reader.result);
      } else {
        setFormData(prev => ({ ...prev, [sectionKey]: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

const handleFormSubmission = async (e) => {
  e.preventDefault();
  try {
    setIsSubmitting(true);

    localStorage.setItem('about_heading', formData.heading);
    localStorage.setItem('about_subheading', formData.subheading);
    localStorage.setItem('about_paragraph', formData.paragraph);
    localStorage.setItem('about_hero_image', formData.heroImage);
    localStorage.setItem('about_pillars', JSON.stringify(formData.pillars));
    localStorage.setItem('about_history', JSON.stringify(formData.history));
    localStorage.setItem('about_advisors', JSON.stringify(formData.advisors));

    const { data } = await api.put("/admin-settings/about", {
      heading: formData.heading,
      subheading: formData.subheading,
      paragraph: formData.paragraph,
      heroImage: formData.heroImage,
      pillars: formData.pillars,
      advisors: formData.advisors,
      history: formData.history
    });
    
    if (data) {
      setFormData(prev => ({
        ...prev,
        heading: data.heading || prev.heading,
        subheading: data.subheading || prev.subheading,
        paragraph: data.paragraph || prev.paragraph,
        heroImage: data.heroImage || prev.heroImage,
        pillars: data.pillars || [],
        advisors: data.advisors || [],
        history: data.history || []
      }));
    }
    
    alert("CMS Parameters saved permanently to MongoDB Atlas!");
  } catch (err) {
    console.error("CMS deployment structural failure:", err);
    alert("Failed to save configuration parameters.");
  } finally {
    setIsSubmitting(false);
  }
};



  const cardBgClass = "bg-white dark:bg-[#0a101d] border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-2xl text-left shadow-xs";
  const inputClass = "w-full bg-slate-50 dark:bg-[#111927] border border-slate-200 dark:border-gray-800 text-slate-900 dark:text-white rounded-xl p-3 text-sm font-medium outline-none focus:border-blue-500 transition-colors";
  const labelClass = "block text-xs font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-1.5 text-left";



  return (
    <form onSubmit={handleFormSubmission} className="space-y-6 w-full">
      
      {/* SECTION 1: STANDALONE BASE META HEADER INPUT VALUES + MISSING IMAGE COVER PICKER */}
      <div className={cardBgClass}>
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 dark:border-slate-800/40">
          <h3 className="font-bold text-sm uppercase tracking-wider text-blue-600 dark:text-blue-500 flex items-center gap-1.5">
            <Info className="w-4 h-4" /> About Matrix Configuration Headers
          </h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 📸 HERO IMAGE BANNER CANVA UPLOADER PICKER PORTAL */}
          <div className="lg:col-span-4 flex flex-col gap-2 w-full">
            <label className={labelClass}>Main Hero Background Banner</label>
            <label className="w-full h-[154px] border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer relative overflow-hidden group bg-slate-50 dark:bg-slate-950/20 hover:border-blue-500 transition-colors">
              {formData.heroImage ? (
                <>
                  <img src={formData.heroImage} alt="Hero Banner Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-bold uppercase tracking-wider">Change Cover Image</div>
                </>
              ) : (
                <div className="flex flex-col items-center text-slate-400 font-bold uppercase tracking-widest text-[9px] gap-1 select-none">
                  <span>Upload Cover Image</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={(e) => handleMediaUpload("heroImage", null, e)} className="hidden" />
            </label>
          </div>

          {/* STANDALONE INPUT STRINGS DECK FIELDS */}
          <div className="lg:col-span-8 space-y-4 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Main Hero Title Headline</label>
                <input type="text" value={formData.heading} onChange={e => setFormData({...formData, heading: e.target.value})} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Sub-Header Mission Summary Label</label>
                <input type="text" value={formData.subheading} onChange={e => setFormData({...formData, subheading: e.target.value})} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Primary Descriptive Narrative Paragraph Block Copy</label>
              <textarea rows="4" value={formData.paragraph} onChange={e => setFormData({...formData, paragraph: e.target.value})} className={inputClass + " resize-none text-xs leading-relaxed"} />
            </div>
          </div>
        </div>

      </div>
      {/* SUB-TABS INTERACTIVE NAV BAR CONTROL ROW SELECTOR */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800/60 pb-2 w-full">
        {["pillars", "history", "council"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveSubTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-0 cursor-pointer ${
              activeSubTab === tab 
                ? "bg-blue-600 text-white shadow-xs" 
                : "bg-transparent text-slate-400 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            {tab === "pillars" && "Standards Pillars"}
            {tab === "history" && "History Milestones"}
            {tab === "council" && "Advisory Council"}
          </button>
        ))}
      </div>

      {/* --- SUB-TAB 1: PILLARS FOUNDATION GRID CONTROLLER --- */}
      {activeSubTab === "pillars" && (
        <div className="bg-white dark:bg-[#0a101d] border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl space-y-4 text-left">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Core Valuation Foundation Standards</h4>
            <button type="button" onClick={() => setFormData({...formData, pillars: [...formData.pillars, { title: "", text: "" }]})} className="text-xs font-black uppercase text-blue-600 dark:text-blue-500 bg-transparent border-0 cursor-pointer outline-none">+ Append Standard</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formData.pillars.map((pillar, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50/50 dark:bg-slate-950/20 text-left relative group">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 font-mono">STANDARD BADGE #0{idx+1}</span>
                  <button type="button" onClick={() => setFormData({...formData, pillars: formData.pillars.filter((_, i) => i !== idx)})} className="text-slate-400 hover:text-red-500 border-0 bg-transparent cursor-pointer outline-none transition-colors">Purge</button>
                </div>
                <div className="space-y-2">
                  <input type="text" value={pillar.title || ""} onChange={e => updateArrayField("pillars", idx, "title", e.target.value)} className={inputClass + " font-bold text-xs"} placeholder="Standard Title" />
                  <textarea rows="3" value={pillar.text || ""} onChange={e => updateArrayField("pillars", idx, "text", e.target.value)} className={inputClass + " text-xs resize-none leading-relaxed"} placeholder="Description summary text..." />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

{activeSubTab === "history" && (
  <div className="bg-white dark:bg-[#0a101d] border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl space-y-4 text-left">
    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Corporate Timeline Development Logs</h4>
      <button 
        type="button" 
        onClick={() => setFormData({ ...formData, history: [{ year: "2026", title: "", body: "" }, ...formData.history] })} 
        className="text-xs font-black uppercase text-blue-600 dark:text-blue-500 bg-transparent border-0 cursor-pointer outline-none"
      >
        + Append History Event
      </button>
    </div>
    <div className="space-y-4">
      {formData.history.map((event, idx) => (
        <div key={idx} className="p-5 rounded-xl border border-slate-200 dark:border-gray-800 bg-slate-50/40 dark:bg-slate-950/10 text-left relative flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-full sm:w-24 shrink-0">
            <label className={labelClass}>Year</label>
            <input 
              type="text" 
              value={event.year || ""} 
              onChange={e => updateArrayField("history", idx, "year", e.target.value)} 
              className={inputClass + " text-center font-black text-blue-600 dark:text-blue-400 font-mono"} 
              placeholder="e.g. 2026" 
            />
          </div>
          <div className="flex-1 w-full space-y-3">
            <div className="flex justify-between items-center w-full gap-4">
              <div className="w-full">
                <label className={labelClass}>Event Title Headline</label>
                <input 
                  type="text" 
                  value={event.title || ""} 
                  onChange={e => updateArrayField("history", idx, "title", e.target.value)} 
                  className={inputClass} 
                  placeholder="Milestone name" 
                />
              </div>
              <button 
                type="button" 
                onClick={() => setFormData({ ...formData, history: formData.history.filter((_, i) => i !== idx) })} 
                className="mt-6 text-xs text-slate-400 hover:text-red-500 font-bold border-0 bg-transparent cursor-pointer outline-none transition-colors shrink-0"
              >
                Purge
              </button>
            </div>
            <div>
              <label className={labelClass}>Event Long Description Narrative</label>
              <textarea 
                rows="2" 
                value={event.body || ""} 
                onChange={e => updateArrayField("history", idx, "body", e.target.value)} 
                className={inputClass + " text-xs resize-none leading-relaxed"} 
                placeholder="What occurred during this operational cycle interval?" 
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}



      {/* --- SUB-TAB 3: EXPERT ADVISORY COUNCIL CONTROLLER --- */}
      {activeSubTab === "council" && (
        <div className="bg-white dark:bg-[#0a101d] border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl space-y-4 text-left">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Expert Advisory Council Matrix Array</h4>
            <button 
              type="button" 
              onClick={() => setFormData({...formData, advisors: [...formData.advisors, { name: "", role: "", tag: "COUNCIL", linkedin: "", image: "" }]})} 
              className="text-xs font-black uppercase text-blue-600 dark:text-blue-500 bg-transparent border-0 cursor-pointer outline-none"
            >
              + Append Profile Council Node
            </button>
          </div>
          <div className="space-y-6">
            {formData.advisors.map((adv, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-slate-200 dark:border-gray-800 bg-slate-50/30 dark:bg-[#111927]/30 text-left relative flex flex-col md:flex-row gap-6 items-start">
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, advisors: formData.advisors.filter((_, i) => i !== idx)})} 
                  className="absolute top-4 right-4 text-xs font-bold text-slate-400 hover:text-red-500 border-0 bg-transparent cursor-pointer outline-none transition-colors"
                >
                  Purge Council Card
                </button>
                <div className="w-full md:w-32 flex flex-col gap-2 shrink-0">
                  <label className={labelClass}>Profile Asset</label>
                  <label className="w-full aspect-square border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer relative overflow-hidden group bg-white dark:bg-slate-950/40 hover:border-blue-500 transition-colors">
                    {adv.image ? (
                      <>
                        <img src={adv.image} alt="Avatar Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[9px] text-white font-bold uppercase tracking-wider">Swap Avatar</div>
                      </>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight text-center px-1">Upload File</span>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => handleMediaUpload("advisors", idx, e)} className="hidden" />
                  </label>
                </div>
                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 md:pt-0">
                  <div>
                    <label className={labelClass}>Advisor Name</label>
                    <input type="text" value={adv.name || ""} onChange={e => updateArrayField("advisors", idx, "name", e.target.value)} className={inputClass} placeholder="Full Legal Name" />
                  </div>
                  <div>
                    <label className={labelClass}>Corporate Assignment Role</label>
                    <input type="text" value={adv.role || ""} onChange={e => updateArrayField("advisors", idx, "role", e.target.value)} className={inputClass} placeholder="Assignment designation" />
                  </div>
                  <div>
                    <label className={labelClass}>Domain Tag Badge</label>
                    <input type="text" value={adv.tag || ""} onChange={e => updateArrayField("advisors", idx, "tag", e.target.value.toUpperCase())} className={inputClass} placeholder="e.g. COMMERCIAL" />
                  </div>
                  <div>
                    <label className={labelClass}>LinkedIn Endpoint URL</label>
                    <input type="text" value={adv.linkedin || ""} onChange={e => updateArrayField("advisors", idx, "linkedin", e.target.value)} className={inputClass} placeholder="https://linkedin.com..." />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- MASTER ACTION BAR: GLOBAL SUBMIT TO MONGO BACKEND ROUTERS --- */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex justify-end w-full">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-blue-500/10 border-0 cursor-pointer outline-none disabled:opacity-50"
        >
          {isSubmitting ? "SYNCING DATA MATRIX..." : "Push About CMS Updates to MongoDB Atlas →"}
        </button>
      </div>

    </form>
  );
}

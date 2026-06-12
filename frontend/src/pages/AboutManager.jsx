import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Upload, ImageIcon } from 'lucide-react';

export default function AboutManager({ darkMode }) {
  // --- 1. State Pools initialized cleanly with LocalStorage fallbacks ---
  const [heading, setHeading] = useState(() => localStorage.getItem('about_heading') || "About the Estate Ease Engine");
  const [subheading, setSubheading] = useState(() => localStorage.getItem('about_subheading') || "");
  const [paragraph, setParagraph] = useState(() => localStorage.getItem('about_paragraph') || "");
  const [heroImage, setHeroImage] = useState(() => localStorage.getItem('about_hero_image') || "");
  
  const [pillars, setPillars] = useState(() => {
    const saved = localStorage.getItem('about_pillars');
    return saved ? JSON.parse(saved) : [{ title: "", text: "" }, { title: "", text: "" }, { title: "", text: "" }];
  });

  const [advisors, setAdvisors] = useState(() => {
    const saved = localStorage.getItem('about_advisors');
    return saved ? JSON.parse(saved) : [];
  });

  // --- 2. 👑 THE LOCALSTORAGE SAVE HANDLERS (No Axios, No Multer, Pure Local Sync) ---
  const saveMainText = (e) => {
    e.preventDefault();
    localStorage.setItem('about_heading', heading);
    localStorage.setItem('about_subheading', subheading);
    localStorage.setItem('about_paragraph', paragraph);
    localStorage.setItem('about_hero_image', heroImage); // Stores the Base64 String
    alert("Introduction text and Hero banner asset saved to browser memory!");
  };

  const savePillars = (e) => {
    e.preventDefault();
    localStorage.setItem('about_pillars', JSON.stringify(pillars));
    alert("Foundation standards matrix saved to browser memory!");
  };

  const saveAdvisors = (e) => {
    e.preventDefault();
    localStorage.setItem('about_advisors', JSON.stringify(advisors));
    alert("Expert Advisory Council synchronized cleanly inside browser storage!");
  };

  // --- 3. 👑 FILE TO BASE64 PERMANENT TEXT CONVERTERS ---
  const handleHeroImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setHeroImage(reader.result); // 💡 This converts the file into a pure string like "data:image/jpeg;base64,..."
    };
    reader.readAsDataURL(file);
  };

  const handleAdvisorImageUpload = (idx, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...advisors];
      updated[idx].image = reader.result; // 💡 Converts advisor avatar to pure string code
      setAdvisors(updated);
    };
    reader.readAsDataURL(file);
  };

  const handlePillarChange = (idx, field, val) => {
    const updated = [...pillars];
    updated[idx][field] = val;
    setPillars(updated);
  };

  const handleAdvisorChange = (idx, field, val) => {
    const updated = [...advisors];
    updated[idx][field] = val;
    setAdvisors(updated);
  };

  const cardBgClass = "bg-white dark:bg-[#0a101d] border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-2xl mb-8 shadow-xs";
  const innerBoxBgClass = "p-4 rounded-xl border bg-slate-50/50 border-slate-200 dark:bg-[#111927]/50 dark:border-gray-800";
  const inputClass = "w-full bg-slate-50 dark:bg-[#111927] border border-slate-200 dark:border-gray-800 text-slate-900 dark:text-white rounded-xl p-3 text-sm font-medium outline-none focus:border-blue-500 transition-colors";
  const labelClass = "block text-xs font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2 text-left";

  return (
    <div className="space-y-10">
      
      {/* 01 / INTRODUCTION BLOCK FORM */}
      <form onSubmit={saveMainText} className={cardBgClass}>
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-gray-800 pb-4">
          <div className="text-left">
            <h3 className="font-bold text-sm uppercase tracking-wider text-blue-600 dark:text-blue-500">01 / Introduction Layout</h3>
            <p className="text-xs text-slate-400">Configure global intro copy statements and workspace media cards</p>
          </div>
          <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border-0 cursor-pointer transition-all">
            <Save className="w-3.5 h-3.5" /> Save Section
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 flex flex-col gap-2">
            <label className={labelClass}>Top Section Workspace Banner Image</label>
            <label className="w-full h-44 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer relative overflow-hidden group bg-slate-50 dark:bg-slate-950/20 hover:border-blue-500 transition-colors">
              {heroImage ? (
                <>
                  <img src={heroImage} alt="About banner" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] text-white font-bold uppercase tracking-wider gap-1">
                    <Upload className="w-4 h-4" /> Change Image
                  </div>
                </>
              ) : (
                <>
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Upload Workspace Media</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="hidden" />
            </label>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div>
              <label className={labelClass}>Main Heading Title</label>
              <input type="text" value={heading} onChange={e => setHeading(e.target.value)} className={inputClass} placeholder="About Page Headline" />
            </div>
            <div>
              <label className={labelClass}>Subheading Core Summary</label>
              <input type="text" value={subheading} onChange={e => setSubheading(e.target.value)} className={inputClass} placeholder="Bold summary tagline" />
            </div>
            <div>
              <label className={labelClass}>Supporting Narrative Copy</label>
              <textarea rows="3" value={paragraph} onChange={e => setParagraph(e.target.value)} className={inputClass} placeholder="Full background story context..." />
            </div>
          </div>
        </div>
      </form>

      {/* 02 / FOUNDATION STANDARDS PILLARS */}
      <form onSubmit={savePillars} className={cardBgClass}>
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-gray-800 pb-4">
          <div className="text-left">
            <h3 className="font-bold text-sm uppercase tracking-wider text-emerald-600 dark:text-emerald-500">02 / Foundation Standards</h3>
            <p className="text-xs text-slate-400">Manage titles and description cards triple grid</p>
          </div>
          <button type="submit" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border-0 cursor-pointer transition-all">
            <Save className="w-3.5 h-3.5" /> Save Pillars
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pillars.map((pillar, idx) => (
            <div key={idx} className={innerBoxBgClass}>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-500 block mb-2 text-left">Standard Badge #0{idx+1}</span>
              <input type="text" value={pillar.title || ''} onChange={e => handlePillarChange(idx, 'title', e.target.value)} className={inputClass + " mb-2"} placeholder="Pillar Title" />
              <textarea rows="3" value={pillar.text || ''} onChange={e => handlePillarChange(idx, 'text', e.target.value)} className={inputClass} placeholder="Description Context" />
            </div>
          ))}
        </div>
      </form>

      {/* 03 / COUNCIL MATRIX ARRAY */}
      <form onSubmit={saveAdvisors} className={cardBgClass}>
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-gray-800 pb-4">
          <div className="text-left">
            <h3 className="font-bold text-sm uppercase tracking-wider text-indigo-600 dark:text-indigo-500">03 / Expert Advisory Council Grid</h3>
            <p className="text-xs text-slate-400">Create entries, upload real profile picture assets, and organize links</p>
          </div>
          <button type="submit" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border-0 cursor-pointer transition-all">
            <Save className="w-3.5 h-3.5" /> Synchronize Council
          </button>
        </div>

        <div className="space-y-6">
          {advisors.map((advisor, idx) => (
            <div key={idx} className="p-5 rounded-2xl border relative transition-all bg-slate-50/30 dark:bg-[#111927]/30 border-slate-200 dark:border-gray-800">
              <button type="button" onClick={() => setAdvisors(advisors.filter((_, i) => i !== idx))} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors cursor-pointer border-0 bg-transparent outline-none">
                <Trash2 className="w-4 h-4" />
              </button>
              
              <span className="text-xs font-mono text-slate-400 font-bold tracking-widest block mb-4 text-left">PROFILE INSTANCE NODE #0{idx+1}</span>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                
                {/* 👑 LOCALSTORAGE BASE64 FILE SELECTOR IMAGE AVATAR CARD */}
                <div className="md:col-span-3 flex flex-col items-center justify-center gap-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 self-start">Profile Asset</label>
                  <label className="w-full aspect-square border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer relative overflow-hidden group bg-slate-50 dark:bg-slate-950/20 hover:border-blue-500">
                    {advisor.image ? (
                      <>
                        <img 
                          src={advisor.image} 
                          alt="advisor" 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] text-white font-bold uppercase tracking-wider gap-1">
                          <Upload className="w-4 h-4" /> Swap Avatar
                        </div>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-5 h-5 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Upload file</span>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => handleAdvisorImageUpload(idx, e)} className="hidden" />
                  </label>
                </div>

                {/* TEXT LAYER METADATA GRID PANEL (9 Columns Remaining) */}
                <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Advisor Name</label>
                    <input type="text" value={advisor.name || ''} onChange={e => handleAdvisorChange(idx, 'name', e.target.value)} className={inputClass} placeholder="Full Legal Name" />
                  </div>
                  <div>
                    <label className={labelClass}>Corporate Assignment Role</label>
                    <input type="text" value={advisor.role || ''} onChange={e => handleAdvisorChange(idx, 'role', e.target.value)} className={inputClass} placeholder="e.g. Acquisitions Director" />
                  </div>
                  <div>
                    <label className={labelClass}>Visual Domain Tag</label>
                    <input type="text" value={advisor.tag || ''} onChange={e => handleAdvisorChange(idx, 'tag', e.target.value)} className={inputClass} placeholder="e.g. COMMERCIAL" />
                  </div>
                  <div>
                    <label className={labelClass}>LinkedIn URL Endpoint</label>
                    <input type="text" value={advisor.linkedin || ''} onChange={e => handleAdvisorChange(idx, 'linkedin', e.target.value)} className={inputClass} placeholder="https://linkedin.com..." />
                  </div>
                </div>

              </div>

              {/* Card Removal Sub-Toolbar Row Element */}
              <div className="pt-4 mt-4 border-t border-slate-200/40 dark:border-slate-800/40 flex justify-end">
                <button
                  type="button"
                  onClick={() => setAdvisors(advisors.filter((_, i) => i !== idx))}
                  className="px-3 py-1.5 bg-red-500/10 hover:bg-red-600 border border-red-200 dark:border-red-900/40 text-red-600 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 outline-none"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Purge Council Card</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Action Button Trigger Link to Append an Advisor Object Configuration Node */}
        <div className="pt-4 mt-6 border-t border-slate-200 dark:border-slate-800/60 flex justify-between items-center">
          <button
            type="button"
            onClick={() => setAdvisors([...advisors, { name: "", role: "", tag: "", linkedin: "", image: "" }])}
            className="flex items-center gap-2 text-xs font-extrabold tracking-wider text-blue-600 dark:text-blue-500 hover:text-blue-700 uppercase bg-blue-50 dark:bg-blue-950/40 border-0 px-4 py-2.5 rounded-xl cursor-pointer transition-all outline-none"
          >
            <Plus className="w-4 h-4" /> Append Profile Matrix Card
          </button>
        </div>
      </form>

    </div>
  );
}

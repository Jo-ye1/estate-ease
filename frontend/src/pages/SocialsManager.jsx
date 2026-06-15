import React, { useState, useEffect } from "react";
// 🎯 FIXED: Removed brand dependencies to prevent external library export errors
import { Save, Globe, FileText, CheckCircle } from "lucide-react";

export default function SocialsManager() {
  const [settings, setSettings] = useState({
    footerText: "",
    facebookUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    instagramUrl: "",
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 👑 BACKEND DUAL PIPELINE CONNECTION: Fetch live configurations from DB on mount
  useEffect(() => {
    const loadLiveDatabaseSettings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/settings/footer");
        if (response.ok) {
          const data = await response.json();
          setSettings({
            footerText: data.footerText || "",
            facebookUrl: data.facebookUrl || "",
            linkedinUrl: data.linkedinUrl || "",
            twitterUrl: data.twitterUrl || "",
            instagramUrl: data.instagramUrl || "",
          });
        }
      } catch (e) {
        console.error("Failed fetching configurations:", e);
      }
    };
    loadLiveDatabaseSettings();
  }, []);

  const handleInputChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setIsSaved(false);

      // 👑 LIVE API POST TRANSMISSION
const response = await fetch("http://localhost:5000/api/settings/footer", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(settings),
});
      if (response.ok) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (err) {
      console.error("Failed pushing updates to MongoDB server context:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 p-6 lg:p-10 text-left transition-colors duration-200">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 border-b border-slate-200 dark:border-slate-900 pb-4">
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Footer & Socials <span className="text-blue-600 dark:text-blue-500">Manager</span>
          </h1>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
            Dynamically update branding scripts, typography hooks, and social platform matrices directly on the live system database.
          </p>
        </div>

        {isSaved && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center gap-3 text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-top-2 duration-200">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Database data streams synchronized successfully!</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">Identity Context</h3>
            </div>
            <div>
              <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Footer Description Summary</label>
              <textarea name="footerText" required value={settings.footerText} onChange={handleInputChange} placeholder="Write your company summary statement here..." className="w-full h-24 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 resize-none leading-relaxed transition-colors" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Globe className="w-4 h-4 text-blue-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">Social Media Links</h3>
            </div>
            
            {/* 🎯 FIXED: Rendered via bulletproof custom SVG paths */}
            <div>
              <label className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/></svg> 
                Facebook URL
              </label>
              <input type="url" name="facebookUrl" value={settings.facebookUrl} onChange={handleInputChange} placeholder="https://facebook.com" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 transition-colors" />
            </div>
            
            {/* 🎯 FIXED: Rendered via bulletproof custom SVG paths */}
            <div>
              <label className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                <svg className="w-3.5 h-3.5 text-blue-700" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg> 
                LinkedIn URL
              </label>
              <input type="url" name="linkedinUrl" value={settings.linkedinUrl} onChange={handleInputChange} placeholder="https://linkedin.com" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 transition-colors" />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2"><span className="font-mono text-slate-800 dark:text-white font-black text-xs lowercase">X</span> Platform URL</label>
              <input type="url" name="twitterUrl" value={settings.twitterUrl} onChange={handleInputChange} placeholder="https://x.com" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 transition-colors" />
            </div>
            
            {/* 🎯 FIXED: Rendered via bulletproof custom SVG paths */}
            <div>
              <label className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                <svg className="w-3.5 h-3.5 text-pink-600" fill="currentColor" viewBox="0 0 24 24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6m12.4 2.75a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-1.5 0v-.5a.75.75 0 0 1 .75-.75M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg> 
                Instagram URL
              </label>
              <input type="url" name="instagramUrl" value={settings.instagramUrl} onChange={handleInputChange} placeholder="https://instagram.com" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 transition-colors" />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border-0 outline-none">
            {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Commit Global Updates</span><Save className="w-3.5 h-3.5" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
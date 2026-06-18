import React, { useState, useEffect } from 'react';
import { Save, Sliders } from 'lucide-react';
import axios from 'axios';

export default function WorkflowManager() {
  const [heroBadge, setHeroBadge] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroDesc, setHeroDesc] = useState("");
  const [ctaTitle, setCtaTitle] = useState("");
  const [ctaDesc, setCtaDesc] = useState("");
  const [sectionBadge, setSectionBadge] = useState("");
  const [sectionTitle, setSectionTitle] = useState("");
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    const loadWorkflowManagerData = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/admin-settings/workflow");
        if (data) {
          setHeroBadge(data.heroBadge || "");
          setHeroTitle(data.heroTitle || "");
          setHeroDesc(data.heroDesc || "");
          setCtaTitle(data.ctaTitle || "");
          setCtaDesc(data.ctaDesc || "");
          setSectionBadge(data.sectionBadge || "");
          setSectionTitle(data.sectionTitle || "");
          setSteps(data.steps || []);
        }
      } catch (err) {
        console.error("Failed to load workflow parameters from server:", err);
      }
    };
    loadWorkflowManagerData();
  }, []);

  const handleSaveMetadata = async (e) => {
    e.preventDefault();
    try {
      const payload = { heroBadge, heroTitle, heroDesc, ctaTitle, ctaDesc, sectionBadge, sectionTitle };
      await axios.post("http://localhost:5000/api/admin-settings/workflow/meta", payload);
      alert("Workflow Metadata Updated inside MongoDB!");
    } catch (err) {
      alert("Meta sync error: " + err.message);
    }
  };

  const handleStepFieldMutation = (id, field, value) => {
    setSteps(steps.map(step => step.id === id ? { ...step, [field]: value } : step));
  };

  const handleSaveAllSteps = async (e) => {
    e.preventDefault();
    try {
      for (const step of steps) {
        await axios.put(`http://localhost:5000/api/admin-settings/workflow/steps/${step.id}`, {
          tag: step.tag,
          title: step.title,
          desc: step.desc,
          iconName: step.iconName
        });
      }
      alert("All process sequence steps successfully saved to MongoDB!");
    } catch (err) {
      alert("Steps saving error: " + err.message);
    }
  };

  const inputClass = "w-full bg-slate-50 dark:bg-[#111927] border border-slate-200 dark:border-gray-800 text-slate-900 dark:text-white rounded-xl p-3 text-sm font-medium outline-none focus:border-blue-500 transition-colors";
  const labelClass = "block text-xs font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2 text-left";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-[1320px] mx-auto p-4 text-left">
      
      {/* LEFT COLUMN PANEL: Headings & Intro Metadata Fields */}
      <div className="lg:col-span-5 space-y-6 w-full">
        <form onSubmit={handleSaveMetadata} className="bg-white dark:bg-[#0a101d] border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-2xl space-y-4 shadow-xs">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
            Intro Info Text Fields
          </h3>
          
          <div>
            <label className={labelClass}>Hero Top Badge</label>
            <input value={heroBadge} onChange={(e) => setHeroBadge(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Main Hero Title Text</label>
            <input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Hero Sub-Description Context</label>
            <textarea rows="3" value={heroDesc} onChange={(e) => setHeroDesc(e.target.value)} className={`${inputClass} resize-none`} />
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4">
            <label className={labelClass}>CTA Card Title</label>
            <input value={ctaTitle} onChange={(e) => setCtaTitle(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>CTA Subtext Description</label>
            <input value={ctaDesc} onChange={(e) => setCtaDesc(e.target.value)} className={inputClass} />
          </div>

          <button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border-0 shadow-xs">
            <Save className="w-3.5 h-3.5" />
            <span>Save Meta Headers</span>
          </button>
        </form>
      </div>

      {/* RIGHT COLUMN PANEL: Steps Matrix Modifier Cards */}
      <div className="lg:col-span-7 space-y-6 w-full">
        <form onSubmit={handleSaveAllSteps} className="bg-white dark:bg-[#0a101d] border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-2xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Step Grid Parameters
            </h3>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer border-0 flex items-center gap-1.5 shadow-xs">
              <Save className="w-3.5 h-3.5" />
              Save Step Array
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Section Workflow Badge</label>
              <input value={sectionBadge} onChange={(e) => setSectionBadge(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Section Workflow Heading</label>
              <input value={sectionTitle} onChange={(e) => setSectionTitle(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className="space-y-4 mt-6">
            {steps.map((step) => (
              <div key={step.id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-gray-800 rounded-xl space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Step Label Tag</label>
                    <input value={step.tag} onChange={(e) => handleStepFieldMutation(step.id, 'tag', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Card Heading Title</label>
                    <input value={step.title} onChange={(e) => handleStepFieldMutation(step.id, 'title', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Icon Component Key</label>
                    <select value={step.iconName || "Search"} onChange={(e) => handleStepFieldMutation(step.id, 'iconName', e.target.value)} className={`${inputClass} cursor-pointer`}>
                      <option value="Search">Search Glass</option>
                      <option value="MessageSquare">Bubble Chat</option>
                      <option value="Key">Access Key</option>
                      <option value="HelpCircle">Question</option>
                      <option value="Sliders">Adjustment Controls</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Workflow Description Context</label>
                  <input value={step.desc} onChange={(e) => handleStepFieldMutation(step.id, 'desc', e.target.value)} className={inputClass} />
                </div>
              </div>
            ))}
          </div>
        </form>
      </div>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Shield } from 'lucide-react';

export default function TermsManager() {
  // --- 1. State Hooks initialized natively with LocalStorage data or defaults ---
  const [sectionHeading, setSectionHeading] = useState(() => localStorage.getItem('terms_heading') || "Terms of Service & Privacy Policy");
  const [sectionSub, setSectionSub] = useState(() => localStorage.getItem('terms_subheading') || "Review our verified corporate rules, asset tracking legal codes, and safety procedures.");
  
  const [legalIntegrityTitle, setLegalIntegrityTitle] = useState(() => localStorage.getItem('terms_integrity_title') || "LEGAL INTEGRITY");
  const [integrityPoint1, setIntegrityPoint1] = useState(() => localStorage.getItem('terms_integrity_p1') || "Your database profiles data arrays utilize localized environment layer encryptions natively.");
  const [integrityPoint2, setIntegrityPoint2] = useState(() => localStorage.getItem('terms_integrity_p2') || "Terms apply automatically to all system operators upon creating an app routing session token.");

  const [protocols, setProtocols] = useState(() => {
    const saved = localStorage.getItem('terms_protocols');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        numLabel: "01",
        title: "Data Indexation & Verification Protocol",
        content: "When listing properties on EstateEase, operators grant our servers a global license to map, store, and distribute metadata documents. We enforce severe penalties, including total account purges from MongoDB collection structures, if pricing variables contain false data strings."
      },
      {
        id: 2,
        numLabel: "02",
        title: "User Authenticity & Profile Security",
        content: "You are solely responsible for protecting your session token parameters. Password updates modified inside your Account Profile suite hash natively inside database tiers. Master Admins reserve the right to audit and manage permissions to prevent system exploitation bugs."
      },
      {
        id: 3,
        numLabel: "03",
        title: "Closing Settlements & Fees",
        content: "Marketplace values represent gross asset dimensions. Transaction clearing parameters executed via verified broker panels are governed under local regulatory real estate escrow codes. Processing settlement closures triggers platform event history log generation automatically."
      }
    ];
  });

  // --- 2. Pure LocalStorage Save Operations ---
  const handleUpdateGlobalMeta = (e) => {
    e.preventDefault();
    localStorage.setItem('terms_heading', sectionHeading);
    localStorage.setItem('terms_subheading', sectionSub);
    alert("Terms Component Global Context Synchronized!");
  };

  const handleUpdateAllProtocols = (e) => {
    e.preventDefault();
    localStorage.setItem('terms_protocols', JSON.stringify(protocols));
    alert("All Compliance Clause Statement Tiers written inside browser memory!");
  };

  const handleUpdateSidebarCard = (e) => {
    e.preventDefault();
    localStorage.setItem('terms_integrity_title', legalIntegrityTitle);
    localStorage.setItem('terms_integrity_p1', integrityPoint1);
    localStorage.setItem('terms_integrity_p2', integrityPoint2);
    alert("Legal Integrity Static Utility Panel Saved!");
  };

  const handleAddNewProtocol = () => {
    const totalCount = protocols.length + 1;
    const nextStringNum = totalCount < 10 ? `0${totalCount}` : `${totalCount}`;
    setProtocols([...protocols, {
      id: Date.now(),
      numLabel: nextStringNum,
      title: "New Protocol Definition Header Statement",
      content: ""
    }]);
  };

  const handleFieldChange = (id, field, value) => {
    setProtocols(protocols.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  // 🎨 FIXED ADAPTIVE THEME DESIGN SYSTEM CLASSES
  const cardBgClass = "bg-white dark:bg-[#0a101d] border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-2xl mb-6 shadow-xs";
  const inputClass = "w-full bg-slate-50 dark:bg-[#111927] border border-slate-200 dark:border-gray-800 text-slate-900 dark:text-white rounded-xl p-3 text-sm font-medium outline-none focus:border-blue-500 transition-colors";
  const labelClass = "block text-xs font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2 text-left";

  return (
    <div className="space-y-6 w-full">
      
      {/* Top Block: Section Level Copy Global Header Values Setup */}
      <form onSubmit={handleUpdateGlobalMeta} className={cardBgClass}>
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 dark:border-gray-800/40">
          <div className="text-left">
            <h3 className="font-bold text-sm uppercase tracking-wider text-blue-600 dark:text-blue-500">Terms Context Metadata</h3>
          </div>
          <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border-0 cursor-pointer transition-all">
            <Save className="w-3.5 h-3.5" /> Commit Headers
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Section Blueprint Heading Title</label>
            <input type="text" value={sectionHeading} onChange={e => setSectionHeading(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Subheading Descriptions Copy</label>
            <input type="text" value={sectionSub} onChange={e => setSectionSub(e.target.value)} className={inputClass} />
          </div>
        </div>
      </form>

      {/* Two-Column Grid Setup: Left Clauses (8-Cols), Right Info Card (4-Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        
        {/* Left Column Workspace Side: Dynamic List Clause Field Editor Rows */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Compliance Clauses Stack Grid</h4>
            <button 
              type="button" 
              onClick={handleAddNewProtocol}
              className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-500 hover:opacity-80 flex items-center gap-1 border-0 bg-transparent cursor-pointer outline-none"
            >
              <Plus className="w-3.5 h-3.5" /> Append Protocol Block
            </button>
          </div>

          <form onSubmit={handleUpdateAllProtocols} className="space-y-4">
            {protocols.map((protocol, idx) => (
              <div key={protocol.id} className="bg-white dark:bg-[#0a101d] border border-slate-200/60 dark:border-slate-800/80 p-5 rounded-2xl text-left relative">
                
                <div className="flex justify-between items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800/20">
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={protocol.numLabel || ''} 
                      onChange={e => handleFieldChange(protocol.id, 'numLabel', e.target.value)}
                      className="w-10 bg-transparent text-center font-mono font-bold text-blue-600 dark:text-blue-500 text-sm border-0 border-b border-slate-300 dark:border-gray-700 focus:border-blue-500 outline-none" 
                    />
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-bold">INDEX SEED</span>
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={() => setProtocols(protocols.filter(p => p.id !== protocol.id))}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors border-0 bg-transparent cursor-pointer outline-none"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className={labelClass}>Clause Title Headline</label>
                    <input 
                      type="text" 
                      value={protocol.title || ''} 
                      onChange={e => handleFieldChange(protocol.id, 'title', e.target.value)} 
                      className={inputClass} 
                      placeholder="Clause Heading Title"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Clause Body ContentParagraph</label>
                    <textarea 
                      rows="4" 
                      value={protocol.content || ''} 
                      onChange={e => handleFieldChange(protocol.id, 'content', e.target.value)} 
                      className={inputClass + " resize-none"} 
                      placeholder="Enter specific policy clause body context sentences..." 
                    />
                  </div>
                </div>

              </div>
            ))}

            <button type="submit" className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md border-0 cursor-pointer">
              <Save className="w-4 h-4" /> Synchronize All Policy Compliance Clauses
            </button>
          </form>
        </div>

            {/* Right Column Sidebar Workspace Side: Legal Integrity Visual Card Form */}
        <form onSubmit={handleUpdateSidebarCard} className={`${cardBgClass} lg:col-span-4 h-fit space-y-4`}>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-400 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Sidebar Info Widget
            </h4>
            <p className="text-[10px] text-slate-400">Edit static right column visual tips card</p>
          </div>

          <div>
            <label className={labelClass}>Sidebar Card Title</label>
            <input type="text" value={legalIntegrityTitle} onChange={e => setLegalIntegrityTitle(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Bullet Pointer Statement 01</label>
            <textarea rows="3" value={integrityPoint1} onChange={e => setIntegrityPoint1(e.target.value)} className={inputClass + " resize-none"} />
          </div>

          <div>
            <label className={labelClass}>Bullet Pointer Statement 02</label>
            <textarea rows="3" value={integrityPoint2} onChange={e => setIntegrityPoint2(e.target.value)} className={inputClass + " resize-none"} />
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md border-0 cursor-pointer">
            Save Card Panel Data
          </button>
        </form>

      </div>
    </div>
  );
}

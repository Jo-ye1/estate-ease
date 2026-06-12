import React, { useState, useEffect } from 'react';
import { HelpCircle, Save, Plus, Trash2 } from 'lucide-react';

export default function FaqManager() {
  // --- 1. State Hooks initialized natively with LocalStorage data or defaults ---
  const [faqTitle, setFaqTitle] = useState(() => localStorage.getItem('faq_title') || "Frequently Asked Questions");
  const [faqSub, setFaqSub] = useState(() => localStorage.getItem('faq_subheading') || "Get instant architectural answers regarding real estate workflows and engine routing.");

  const [faqItems, setFaqItems] = useState(() => {
    const saved = localStorage.getItem('faq_items');
    return saved ? JSON.parse(saved) : [
      {
        id: 201,
        q: "How do I verify a property listing's credentials?",
        a: "Credentials trace automatically through real-time distributed broker network ledgers. Submit a document payload verification task request from your node dashboard to instantiate scanning logs."
      },
      {
        id: 202,
        q: "What are the brokerage fees for closing real estate deals?",
        a: "Closing settlement fee variables calculate dynamically based on platform localized regional brackets. Standard corporate operations trace at roughly 1.8% to 2.4% metrics margins."
      }
    ];
  });

  // --- 2. Pure LocalStorage Save Operations ---
  const handleUpdateMainMeta = (e) => {
    e.preventDefault();
    localStorage.setItem('faq_title', faqTitle);
    localStorage.setItem('faq_subheading', faqSub);
    alert("FAQ Container Context Synced Globally in browser memory!");
  };

  const handleSaveAllFaqs = (e) => {
    e.preventDefault();
    localStorage.setItem('faq_items', JSON.stringify(faqItems));
    alert("All active FAQ accordion items successfully synchronized!");
  };

  const handleInsertBlankAccordion = () => {
    setFaqItems([...faqItems, {
      id: Date.now(),
      q: "New Placeholder Question Header Matrix?",
      a: ""
    }]);
  };

  const handleFieldMutation = (id, propertyKey, incomingValue) => {
    setFaqItems(faqItems.map(item => item.id === id ? { ...item, [propertyKey]: incomingValue } : item));
  };

  const handleDeleteRow = (id) => {
    const updated = faqItems.filter(f => f.id !== id);
    setFaqItems(updated);
    localStorage.setItem('faq_items', JSON.stringify(updated));
  };

  // 🎨 FIXED ADAPTIVE THEME DESIGN SYSTEM CLASSES
  const cardBgClass = "bg-white dark:bg-[#0a101d] border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-2xl mb-6 shadow-xs";
  const inputClass = "w-full bg-slate-50 dark:bg-[#111927] border border-slate-200 dark:border-gray-800 text-slate-900 dark:text-white rounded-xl p-3 text-sm font-medium outline-none focus:border-blue-500 transition-colors";
  const labelClass = "block text-xs font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2 text-left";

  return (
    <div className="w-full">
      {/* Top Block: FAQ Section Layout Global Header Values Setup */}
      <form onSubmit={handleUpdateMainMeta} className={cardBgClass}>
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 dark:border-gray-800/40">
          <div className="text-left">
            <h3 className="font-bold text-sm uppercase tracking-wider text-blue-600 dark:text-blue-500 flex items-center gap-1">
              <HelpCircle className="w-4 h-4" /> FAQ Component Controls
            </h3>
          </div>
          <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border-0 cursor-pointer transition-all">
            <Save className="w-3.5 h-3.5" /> Commit Section Copy
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Main Segment Title Text</label>
            <input type="text" value={faqTitle} onChange={e => setFaqTitle(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Supporting Matrix Subtext Message Info</label>
            <input type="text" value={faqSub} onChange={e => setFaqSub(e.target.value)} className={inputClass} />
          </div>
        </div>
      </form>

      {/* Accordion Line Row Item Management Framework Grid Header */}
      <div className="flex justify-between items-center mb-4 mt-8 text-left">
        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider">Dynamic Accordion Registry Matrix</h4>
          <p className="text-xs text-slate-400">Manage entries and update your public accordion grid loops collectively</p>
        </div>
        <button
          type="button"
          onClick={handleInsertBlankAccordion}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all hover:opacity-90 border-0 cursor-pointer flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Mount Accordion Slot
        </button>
      </div>

      <form onSubmit={handleSaveAllFaqs} className="space-y-4">
        {faqItems.map((item, keyIndex) => (
          <div key={item.id} className={cardBgClass + " text-left relative"}>
            <div className="flex justify-between items-center gap-4 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800/20">
              <span className="font-mono text-xs text-slate-400 dark:text-slate-500 font-bold tracking-widest">ROW LOOP OBJECT ITEM #0{keyIndex + 1}</span>
              
              <button
                type="button"
                onClick={() => handleDeleteRow(item.id)}
                className="text-slate-400 hover:text-red-500 p-1 transition-colors border-0 bg-transparent cursor-pointer outline-none"
                title="Purge row entry context parameters completely"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className={labelClass}>Interactive Accordion Trigger Question Title text</label>
                <input 
                  type="text" 
                  value={item.q || ''} 
                  onChange={e => handleFieldMutation(item.id, 'q', e.target.value)} 
                  className={inputClass} 
                  placeholder="e.g. What happens if listing attributes error out?"
                />
              </div>
              <div>
                <label className={labelClass}>Accordion Expanded Reveal Answer Content Box copy</label>
                <textarea 
                  rows="3" 
                  value={item.a || ''} 
                  onChange={e => handleFieldMutation(item.id, 'a', e.target.value)} 
                  className={inputClass + " resize-none"} 
                  placeholder="Provide precise data response metrics summary layouts..."
                />
              </div>
            </div>
          </div>
        ))}

        <button type="submit" className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md border-0 cursor-pointer">
          <Save className="w-4 h-4" /> Synchronize All FAQ Accordion Items
        </button>
      </form>

    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
// 👑 FIXED: Added missing Search, ChevronDown, and MessageSquare icons to clear your ReferenceErrors!
import { Search, ChevronDown, MessageSquare } from 'lucide-react';
import Navbar from "@/components/home/Navbar";

export default function FAQPage() {
  // --- 1. State Hooks initialized natively with LocalStorage data or defaults ---
  const [faqTitle, setFaqTitle] = useState(() => localStorage.getItem('faq_title') || "Frequently Asked Questions");
  const [faqSub, setFaqSub] = useState(() => localStorage.getItem('faq_subheading') || "Get instant architectural answers regarding real estate workflows and engine routing");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const [faqData, setFaqData] = useState(() => {
    const saved = localStorage.getItem('faq_items');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        q: "How do I verify a property listing's credentials?",
        a: "All properties must pass our strict regulatory verification pipeline. Sellers submit official deed documents through their dashboard module, which our licensed corporate brokers audit within a 24-hour turnaround parameter before the asset is indexed live."
      },
      {
        id: 2,
        q: "What are the brokerage fees for closing real estate deals?",
        a: "EstateEase establishes a transparent operational marketplace grid. Buyers face zero index routing charges, while certified brokers/sellers operate under a fixed 2.5% transaction settlement framework variable upon closing escrow loops."
      },
      {
        id: 3,
        q: "Can I transition my account from a standard Buyer to a Broker?",
        a: "Absolutely. Navigate directly into your Profile Account Settings menu and submit your operational credential documentation under the account authorization options tab. Our core registry panel adjusts permission levels instantly upon approval."
      },
      {
        id: 4,
        q: "How does the bookmarked favorites pool synchronize?",
        a: "Your favorited assets sync continuously through our global Context API matrix directly onto your MongoDB cloud clusters. This guarantees that listings you bookmark on high-resolution widescreen layout terminals load instantly across your mobile devices."
      },
      {
        id: 5,
        q: "What happens if a property listing has incorrect metadata coordinates?",
        a: "Platform data integrity is our highest priority. Administrators can instantly access the System Control Matrix spreadsheet grid panel to purge violating documents or suspend accounts that repeatedly violate input guidelines."
      }
    ];
  });

  // --- 2. Live Memory Synchronizer Listener: Tracks cross-tab modifications ---
  useEffect(() => {
    const syncFaqPageMemory = () => {
      setFaqTitle(localStorage.getItem('faq_title') || "Frequently Asked Questions");
      setFaqSub(localStorage.getItem('faq_subheading') || "Get instant architectural answers regarding real estate workflows and engine routing");
      
      const savedItems = localStorage.getItem('faq_items');
      if (savedItems) setFaqData(JSON.parse(savedItems));
    };

    window.addEventListener('storage', syncFaqPageMemory);
    syncFaqPageMemory(); // Initial verification lifecycle lookup on page mount

    return () => window.removeEventListener('storage', syncFaqPageMemory);
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // --- 3. Filter entries dynamically matching query inputs ---
  const filteredFaqs = faqData.filter(item => 
    item.q?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.a?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen select-none text-left transition-colors duration-200 pb-24 flex flex-col">
      <Navbar />

      <section className="max-w-[1320px] mx-auto w-full px-4 pt-16 flex-1 flex flex-col justify-start">
        
        {/* SECTION 1: DYNAMIC HEADER COPIES CONTAINER */}
        <div className="mb-10 relative inline-block w-full">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full mb-3 block w-max">
            Information Matrix
          </span>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-white tracking-tight pb-3">
            {faqTitle.includes("Questions") ? (
              <>
                {faqTitle.split("Questions")[0]}
                <span className="text-blue-600 dark:text-blue-500">Questions</span>
                {faqTitle.split("Questions")[1]}
              </>
            ) : (
              faqTitle
            )}
          </h1>
          <p className="text-slate-400 dark:text-slate-500 text-xs font-medium mt-1 leading-none">
            {faqSub}
          </p>
          <div className="w-24 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full mt-4" />
        </div>

        {/* SEARCH BAR DECK INPUT INPUT BOX */}
        <div className="w-full max-w-[600px] mb-12 relative flex items-center">
          <input
            type="text"
            placeholder="Search questions or listing keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-11 py-3.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs text-slate-700 dark:text-slate-200 font-medium outline-none focus:border-blue-500 transition-colors shadow-xs"
          />
          <Search className="absolute left-4 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
        </div>

        {/* ACCORDION MATRIX CONTAINER TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          
          {/* Left Side: Dynamic Accordion Panels (Spans 8 columns) */}
          <div className="lg:col-span-8 space-y-4 w-full">
            {filteredFaqs.length === 0 ? (
              <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold italic py-8 text-center bg-white dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                No matching documentation criteria found inside browser storage.
              </p>
            ) : (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div 
                    key={faq.id || idx}
                    className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-xs overflow-hidden transition-all duration-200 text-left"
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(idx)}
                      className="w-full px-6 py-4.5 flex items-center justify-between gap-4 border-0 bg-transparent text-left cursor-pointer select-none outline-none"
                    >
                      <span className={`text-sm font-black transition-colors ${isOpen ? "text-blue-600 dark:text-blue-400" : "text-slate-800 dark:text-slate-100"}`}>
                        {faq.q}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-600" : ""}`} />
                    </button>
                    
                    {/* Animated Accordion Body expansion panel slots */}
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[500px] border-t border-slate-100 dark:border-slate-800/50" : "max-h-0"}`}>
                      <p className="p-6 text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed bg-slate-50/40 dark:bg-slate-950/10">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Side: Support Action Context Widgets (Spans 4 columns) */}
          <div className="lg:col-span-4 space-y-6 w-full text-left">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-white">Still Need Help?</h3>
              </div>
              <p className="text-slate-400 dark:text-slate-500 text-xs font-medium leading-relaxed mb-5">
                Can't find an answer here? Route your dynamic parameter criteria over to our main Help Center form.
              </p>
              <Link 
                to="/contact?purpose=help" 
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-md text-center flex items-center justify-center h-10 border-0 cursor-pointer no-underline"
              >
                Connect With Help Desk
              </Link>
            </div>
          </div>

        </div>

      </section>
    </div>
  );
}

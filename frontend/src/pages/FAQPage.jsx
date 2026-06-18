import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import { Search, ChevronDown, MessageSquare } from 'lucide-react';
import Navbar from "@/components/home/Navbar";
import axios from "axios"; // 🟢 Added to pull content dynamically from your server

export default function FAQPage() {
  const [faqTitle, setFaqTitle] = useState("Frequently Asked Questions");
  const [faqSub, setFaqSub] = useState("Get instant architectural answers regarding real estate workflows and engine routing");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const [faqData, setFaqData] = useState([]);

  // --- 🟢 LIVE BACKEND DATA CONTENT SYNCHRONIZATION LOOP ---
  useEffect(() => {
    const fetchFaqDetailsFromDatabase = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin-settings/faq");
        const doc = response.data;
        
        if (doc) {
          if (doc.title) setFaqTitle(doc.title);
          if (doc.subheading) setFaqSub(doc.subheading);
          
          // Sync your backend array directly into your rendering loop grid state
          if (doc.faqItems && doc.faqItems.length > 0) {
            setFaqData(doc.faqItems);
          }
        }
      } catch (err) {
        console.error("Content hydration failed, falling back to static local storage profiles:", err);
        const saved = localStorage.getItem('faq_items');
        if (saved) setFaqData(JSON.parse(saved));
      }
    };

    fetchFaqDetailsFromDatabase();
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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

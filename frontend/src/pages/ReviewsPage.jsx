import React, { useState, useEffect } from "react";
import { Star, MessageSquare, Filter, Building2, User, Send, CheckCircle2, TrendingUp, Award, Users } from "lucide-react";
import Navbar from "@/components/home/Navbar";

export default function ReviewsPage() {
  // --- 1. Core State Hydration Pools ---
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem("real_estate_reviews");
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: "Christopher J. Larson",
        role: "Property Owner",
        propertyType: "VILLA",
        rating: 5,
        date: "2026-05-12",
        comment: "The asset tokenization and verification pipeline on EstateEase is unmatched. My luxury penthouse listing was vetted, approved, and indexed live by certified brokers within 24 hours. Escrow closing fee models are clear, and communication channels stay perfectly encrypted.",
        userPic: ""
      },
      {
        id: 2,
        name: "Sarah Connor",
        role: "Verified Buyer",
        propertyType: "APARTMENT",
        rating: 5,
        date: "2026-05-28",
        comment: "As a first-time home buyer, navigating property registries felt terrifying until I synchronized my favorites pool here. The fast search filters allowed me to isolate verified apartment dimensions instantly. Highly recommended workflow!",
        userPic: ""
      },
      {
        id: 3,
        name: "Stanley S. Nesbitt",
        role: "Licensed Broker",
        propertyType: "PENTHOUSE",
        rating: 4,
        date: "2026-06-04",
        comment: "Managing my client inventory grids through the broker operations panel has transformed my daily conversions. Inquiry leads drop directly into my dashboard matrix. Deducted one star only because I want multi-currency supports next update.",
        userPic: ""
      }
    ];
  });

  // Interactive UI Filtering States
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Review Input Form Submission States
  const [newReview, setNewReview] = useState({ name: "", role: "Buyer", propertyType: "VILLA", rating: 5, comment: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Sync state mutations cleanly back inside browser cache matrices
  useEffect(() => {
    localStorage.setItem("real_estate_reviews", JSON.stringify(reviews));
  }, [reviews]);

  // --- 2. Dynamic Metric Aggregators calculations ---
  const totalCount = reviews.length;
  const averageRating = (reviews.reduce((acc, curr) => acc + curr.rating, 0) / (totalCount || 1)).toFixed(1);
  
  const villaCount = reviews.filter(r => r.propertyType === "VILLA").length;
  const apartmentCount = reviews.filter(r => r.propertyType === "APARTMENT").length;
  const penthouseCount = reviews.filter(r => r.propertyType === "PENTHOUSE").length;

  // --- 3. Submission Handler Loop ---
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) return alert("Please populate all text criteria slots.");

    const submission = {
      id: Date.now(),
      name: newReview.name.trim(),
      role: newReview.role,
      propertyType: newReview.propertyType,
      rating: parseInt(newReview.rating),
      date: new Date().toISOString().split("T")[0],
      comment: newReview.comment.trim(),
      userPic: localStorage.getItem("user_profile_pic") || "" // Inherit current logged avatar string natively
    };

    setReviews([submission, ...reviews]);
    setFormSubmitted(true);
    setNewReview({ name: "", role: "Buyer", propertyType: "VILLA", rating: 5, comment: "" });
    setTimeout(() => setFormSubmitted(false), 4000);
  };

  // --- 4. Content Filtering Grid Analyzer ---
  const filteredReviews = reviews.filter(review => {
    const matchesFilter = selectedFilter === "ALL" || review.propertyType === selectedFilter;
    const matchesSearch = review.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          review.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const cardBgClass = "bg-white dark:bg-[#0a101d] border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm text-left";
  const inputClass = "w-full bg-slate-50 dark:bg-[#111927] border border-slate-200 dark:border-gray-800 text-slate-900 dark:text-white rounded-xl p-3 text-sm font-medium outline-none focus:border-blue-500 transition-colors";
  const labelClass = "block text-xs font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-1.5 text-left";

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen transition-colors duration-200 pb-24 text-left select-none flex flex-col">
      <Navbar />

      <main className="max-w-[1320px] mx-auto w-full px-4 pt-16 space-y-12 flex-1">
        
        {/* ROW 1: HEADER CONTROLS PLOT */}
        <div className="relative inline-block max-w-max border-b border-slate-200 dark:border-slate-800 pb-4 w-full">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full mb-3 block w-max">
            PLATFORM REPUTATION INDEX
          </span>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-white tracking-tight">
            Client Experiences & Asset Audits
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
            Trace validated platform feedback data metrics across our global buyer networks, broker operations channels, and property listings.
          </p>
        </div>

        {/* ROW 2: ADVANCED INSIGHTS METRICS ANALYSIS ANCHOR BANNER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          <div className="bg-white dark:bg-[#0a101d] border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0"><Award className="w-6 h-6" /></div>
            <div><p className="text-2xl font-black leading-tight text-blue-600 dark:text-blue-500">{averageRating} ★</p><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Aggregate Score</p></div>
          </div>
          <div className="bg-white dark:bg-[#0a101d] border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0"><MessageSquare className="w-6 h-6" /></div>
            <div><p className="text-2xl font-black leading-tight text-indigo-600 dark:text-indigo-400">{totalCount}</p><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Total Submissions</p></div>
          </div>
          <div className="bg-white dark:bg-[#0a101d] border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0"><TrendingUp className="w-6 h-6" /></div>
            <div><p className="text-2xl font-black leading-tight text-emerald-600 dark:text-emerald-500">99.4%</p><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Satisfaction Rate</p></div>
          </div>
          <div className="bg-white dark:bg-[#0a101d] border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0"><Users className="w-6 h-6" /></div>
            <div><p className="text-2xl font-black leading-tight text-purple-600 dark:text-purple-400">4,820+</p><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Platform Transmissions</p></div>
          </div>
        </div>

        {/* ROW 3: TWO-COLUMN WORKSPACE BLOCK MATRIX CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          
          {/* LEFT 8-COLUMNS SLOTS: SEARCH, CATEGORY SUB-FILTERS AND FEEDBACK GRID LIST */}
          <div className="lg:col-span-8 space-y-6 w-full">
            
                      {/* Search + Category Filter Toolbar panel */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-4 rounded-xl shadow-xs w-full">
              <div className="relative w-full sm:max-w-xs flex items-center">
                <Filter className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Filter keywords, roles, sender..." className="w-full bg-slate-50 dark:bg-[#111927] border border-slate-200 dark:border-gray-800 text-slate-800 dark:text-white rounded-lg py-2 pl-9 pr-3 text-xs font-semibold outline-none focus:border-blue-500" />
              </div>
              
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto justify-start sm:justify-end py-1">
                {["ALL", "VILLA", "APARTMENT", "PENTHOUSE"].map(type => (
                  <button key={type} onClick={() => setSelectedFilter(type)} className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider uppercase border-0 cursor-pointer transition-all ${selectedFilter === type ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                    {type} {type === "VILLA" && `(${villaCount})`} {type === "APARTMENT" && `(${apartmentCount})`} {type === "PENTHOUSE" && `(${penthouseCount})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Card Feed Loop Engine */}
            {filteredReviews.length === 0 ? (
              <div className="py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center text-xs font-mono font-bold text-slate-400">
                No matching property verification feedback entries recorded inside active views.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map((rev) => {
                  const initialChar = rev.name.charAt(0).toUpperCase();
                  const savedPic = localStorage.getItem(`user_profile_pic_${rev.id}`);
                  const finalAvatar = rev.userPic || savedPic || "";

                  return (
                    <div key={rev.id} className="bg-white dark:bg-[#0a101d] border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 text-left">
                      <div className="flex items-start gap-4">
                        {/* Perfect aspect-ratio center-cropped Avatar element wrapper box */}
                        <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800 flex items-center justify-center bg-slate-100 dark:bg-slate-800 shadow-xs">
                          {finalAvatar ? (
                            <img 
                              src={finalAvatar} 
                              alt={rev.name} 
                              className="w-full h-full object-cover object-center rounded-xl" 
                              onError={(e) => { 
                                e.target.style.display = 'none'; 
                                e.target.parentNode.innerHTML = `<span class="font-black text-xs text-slate-500 uppercase">${initialChar}</span>`; 
                              }} 
                            />
                          ) : (
                            <span className="font-black text-xs text-slate-500 dark:text-slate-400 uppercase">{initialChar}</span>
                          )}
                        </div>

                        <div className="space-y-1 min-w-0 text-left flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-1">
                            <h4 className="font-black text-sm text-slate-800 dark:text-slate-100 truncate">{rev.name}</h4>
                            <div className="flex items-center gap-1 font-mono text-[10px] font-bold text-slate-400">
                              <span>{rev.date}</span>
                              <span>•</span>
                              <span className="text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded text-[9px] font-black tracking-wider uppercase flex items-center gap-1"><Building2 className="w-2.5 h-2.5" />{rev.propertyType}</span>
                            </div>
                          </div>
                          <p className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wide leading-none">{rev.role}</p>
                        </div>
                      </div>

                      <p className="text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-300 text-left">
                        "{rev.comment}"
                      </p>

                      <div className="w-full flex items-center justify-end gap-0.5 pt-2 border-t border-slate-100/60 dark:border-slate-800/40 text-amber-400 text-xs">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < rev.rating ? "opacity-100" : "opacity-20 select-none"}>★</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT 4-COLUMNS SLOTS: HIGH-UTILITY INTERACTIVE FEEDBACK TRANSACTION FORM */}
          <div className="lg:col-span-4 w-full">
            <div className={cardBgClass}>
              <div className="border-b border-slate-100 dark:border-gray-800 pb-3 mb-4 flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-white">Submit Catalog Appraisal</h3>
              </div>

              {formSubmitted ? (
                <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-200">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-3" />
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white">Transaction Logged Successfully</h4>
                  <p className="text-[10px] font-semibold text-slate-400 mt-1 max-w-[200px]">Your user appraisal metrics have successfully written into the active registry display stack.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4 text-left">
                  <div>
                    <label className={labelClass}>Your Full Legal Name</label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                      <input required type="text" value={newReview.name} onChange={e => setNewReview({...newReview, name: e.target.value})} placeholder="e.g. Eyassu Melese" className={inputClass + " pl-10"} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Platform Assignment</label>
                      <select value={newReview.role} onChange={e => setNewReview({...newReview, role: e.target.value})} className={inputClass + " font-bold py-2.5 cursor-pointer bg-white dark:bg-slate-900"}>
                        {["Buyer", "Seller (Owner)", "Licensed Broker", "Administrator"].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Property Typology</label>
                      <select value={newReview.propertyType} onChange={e => setNewReview({...newReview, propertyType: e.target.value})} className={inputClass + " font-bold py-2.5 cursor-pointer bg-white dark:bg-slate-900"}>
                        {["VILLA", "APARTMENT", "HOUSE", "PENTHOUSE"].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Score Appraisal (Stars)</label>
                    <select value={newReview.rating} onChange={e => setNewReview({...newReview, rating: e.target.value})} className={inputClass + " font-black text-amber-500 text-xs py-2.5 cursor-pointer bg-white dark:bg-slate-900"}>
                      {[5, 4, 3, 2, 1].map(num => (
                        <option key={num} value={num}>
                          {Array(num).fill("★").join("")} ({num} Stars)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Detailed Review Copy Context</label>
                    <textarea required rows="4" value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})} placeholder="Describe platform transactions speed, layout responsiveness, catalog metrics, or support channel efficiency parameters..." className={inputClass + " resize-none text-xs leading-relaxed"} />
                  </div>

                  <button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-blue-500/5 flex items-center justify-center gap-2 border-0 cursor-pointer">
                    <span>Transmit Review Node</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
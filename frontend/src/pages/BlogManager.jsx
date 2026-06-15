import React, { useState } from 'react';
import { Save, Plus, Trash2, Upload, ImageIcon, BookOpen } from 'lucide-react';

export default function BlogManager() {
  const [journalTitle, setJournalTitle] = useState(() => localStorage.getItem('blog_title') || "The Estate Ease Journal");
  const [journalSub, setJournalSub] = useState(() => localStorage.getItem('blog_subheading') || "Stay up to date with professional market insights, broker methodologies, and regulatory tutorials.");
  
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('blog_posts');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: "Redefining Urban Spaces: The Rise of Sustainable Architecture",
        category: "ARCHITECTURE",
        date: "2026-05-12",
        readTime: "5 MIN READ",
        excerpt: "Explore how contemporary real estate developers are leveraging smart materials and ecological grid panels.",
        content: "Detailed sustainable architecture article copy parameter block placeholder context...",
        image: ""
      }
    ];
  });

  const handleSaveHeaders = (e) => {
    e.preventDefault();
    localStorage.setItem('blog_title', journalTitle);
    localStorage.setItem('blog_subheading', journalSub);
    alert("Journal header parameters saved to browser memory!");
  };

  const handleSaveAllPosts = (e) => {
    e.preventDefault();
    localStorage.setItem('blog_posts', JSON.stringify(posts));
    alert("All articles and detailed text content structures synchronized!");
  };

  const handleCardImageUpload = (idx, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...posts];
      updated[idx].image = reader.result;
      setPosts(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleFieldChange = (idx, field, value) => {
    const updated = [...posts];
    updated[idx][field] = value;
    setPosts(updated);
  };

  const handleCreateBlankArticle = () => {
    setPosts([
      ...posts,
      {
        id: Date.now(),
        title: "",
        category: "NEW CATEGORY",
        date: new Date().toISOString().split('T')[0],
        readTime: "5 MIN READ",
        excerpt: "",
        content: "", // Initial empty text field channel
        image: ""
      }
    ]);
  };

  const cardBgClass = "bg-white dark:bg-[#0a101d] border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-2xl mb-8 shadow-xs";
  const inputClass = "w-full bg-slate-50 dark:bg-[#111927] border border-slate-200 dark:border-gray-800 text-slate-900 dark:text-white rounded-xl p-3 text-sm font-medium outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400";
  const labelClass = "block text-xs font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2 text-left";

  return (
    <div className="space-y-10 w-full text-left">
      
      <form onSubmit={handleSaveHeaders} className={cardBgClass}>
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-gray-800 pb-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-blue-600 dark:text-blue-500 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Journal Header Context
          </h3>
          <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border-0 cursor-pointer transition-all">
            <Save className="w-3.5 h-3.5" /> Save Headers
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Journal Base Title</label>
            <input type="text" value={journalTitle} onChange={e => setJournalTitle(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Subheading Index Synopses</label>
            <input type="text" value={journalSub} onChange={e => setJournalSub(e.target.value)} className={inputClass} />
          </div>
        </div>
      </form>

      <div className="flex justify-between items-center mb-4 mt-8">
        <div>
          <h4 className="font-black text-sm uppercase tracking-wider">Active Published Articles Grid ({posts.length})</h4>
          <p className="text-xs text-slate-400">Insert custom attributes, dates, full details, and upload binary cover cards</p>
        </div>
        <button
          type="button"
          onClick={handleCreateBlankArticle}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all hover:opacity-95 flex items-center gap-1 border-0 cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" /> Mount New Document Card
        </button>
      </div>

      <form onSubmit={handleSaveAllPosts} className="space-y-6">
        {posts.map((post, idx) => (
          <div key={post.id} className="bg-white dark:bg-[#0a101d] border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-2xl text-left relative">
            <button 
              type="button" 
              onClick={() => setPosts(posts.filter(p => p.id !== post.id))} 
              className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors cursor-pointer border-0 bg-transparent outline-none"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono text-slate-400 font-bold tracking-widest block mb-4">ARTICLE SLOT INSTANCE #0{idx+1}</span>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              <div className="lg:col-span-3 flex flex-col gap-2">
                <label className={labelClass}>Card Cover Image</label>
                <label className="w-full aspect-[4/3] border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer relative overflow-hidden group bg-slate-50 dark:bg-slate-950/20 hover:border-blue-500 transition-colors">
                  {post.image ? (
                    <>
                      <img src={post.image} alt="cover thumbnail" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] text-white font-bold uppercase tracking-wider gap-1">
                        <Upload className="w-4 h-4" /> Swap Thumbnail
                      </div>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select File</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={(e) => handleCardImageUpload(idx, e)} className="hidden" />
                </label>
              </div>

              <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Category / Tag Name</label>
                  <input type="text" value={post.category || ''} onChange={e => handleFieldChange(idx, 'category', e.target.value.toUpperCase())} className={inputClass} placeholder="e.g. GUIDES" />
                </div>
                <div>
                  <label className={labelClass}>Publication Date</label>
                  <input type="date" value={post.date || ''} onChange={e => handleFieldChange(idx, 'date', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Computed Reading Time</label>
                  <input type="text" value={post.readTime || ''} onChange={e => handleFieldChange(idx, 'readTime', e.target.value.toUpperCase())} className={inputClass} placeholder="e.g. 7 MIN READ" />
                </div>
                <div className="sm:col-span-3">
                  <label className={labelClass}>Article Headline Title</label>
                  <input type="text" value={post.title || ''} onChange={e => handleFieldChange(idx, 'title', e.target.value)} className={inputClass} placeholder="Enter article headline text..." />
                </div>
                <div className="sm:col-span-3">
                  <label className={labelClass}>Short Index Page Excerpt Summary</label>
                  <textarea rows="2" value={post.excerpt || ''} onChange={e => handleFieldChange(idx, 'excerpt', e.target.value)} className={inputClass + " resize-none text-xs"} placeholder="Enter short catalog preview summary text..." />
                </div>
                
                {/* 👑 NEW: HIGH UTILITY FULL TEXT CONTENT ARCHITECTURE SLOT */}
                <div className="sm:col-span-3">
                  <label className={labelClass}>Full Detailed Article Body Copy Content</label>
                  <textarea rows="6" value={post.content || ''} onChange={e => handleFieldChange(idx, 'content', e.target.value)} className={inputClass + " resize-none text-xs leading-relaxed"} placeholder="Type or paste the complete expanded article content text body context details here..." />
                </div>
              </div>

            </div>
          </div>
        ))}

        <button type="submit" className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 border-0 cursor-pointer outline-none">
          <Save className="w-4 h-4" /> Synchronize All Journal Matrix Cards
        </button>
      </form>
</div>
);
}
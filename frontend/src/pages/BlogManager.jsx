import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Upload, ImageIcon, BookOpen } from 'lucide-react';
import api from "@/lib/api";

export default function BlogManager() {
  const [journalTitle, setJournalTitle] = useState("");
  const [journalSub, setJournalSub] = useState("");
  const [posts, setPosts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadBlog();
  }, []);

  const loadBlog = async () => {
    try {
      const { data } = await api.get("/admin-settings/blog");
      if (data) {
        setJournalTitle(data.journalTitle || "The Estate Ease Journal");
        setJournalSub(data.journalSub || "Stay up to date with professional market insights, broker methodologies, and regulatory tutorials.");
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error("Failed to load blog database archives:", err);
    }
  };

  const handleSaveAllJournalCMS = async (e) => {
    if (e) e.preventDefault();
    try {
      setIsSubmitting(true);
      const { data } = await api.put("/admin-settings/blog", {
        journalTitle,
        journalSub,
        posts
      });
      if (data) {
        setJournalTitle(data.journalTitle || "");
        setJournalSub(data.journalSub || "");
        setPosts(data.posts || []);
        alert("Journal parameters saved permanently to MongoDB Atlas!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to synchronize journal configurations.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(p => p.id !== postId && p._id !== postId));
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
        id: `temp-${Date.now()}`,
        title: "",
        category: "NEW CATEGORY",
        date: new Date().toISOString().split('T')[0],
        readTime: "5 MIN READ",
        excerpt: "",
        content: "",
        image: ""
      }
    ]);
  };

  const cardBgClass = "bg-white dark:bg-[#0a101d] border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-2xl mb-8 shadow-xs";
  const inputClass = "w-full bg-slate-50 dark:bg-[#111927] border border-slate-200 dark:border-gray-800 text-slate-900 dark:text-white rounded-xl p-3 text-sm font-medium outline-none focus:border-blue-500 transition-colors placeholder:text-slate-400";
  const labelClass = "block text-xs font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2 text-left";



  return (
  <div className="space-y-10 w-full text-left">
    
    <form onSubmit={handleSaveAllJournalCMS} className="space-y-10">
      
      <div className={cardBgClass}>
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-gray-800 pb-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-blue-600 dark:text-blue-500 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Journal Header Context
          </h3>
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
      </div>

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

      <div className="space-y-6">
        {posts.map((post, idx) => (
          <div key={post.id || post._id || idx} className="bg-white dark:bg-[#0a101d] border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-2xl text-left relative">
            <button 
              type="button" 
              onClick={() => handleDeletePost(post.id || post._id)} 
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
                
                <div className="sm:col-span-3">
                  <label className={labelClass}>Full Detailed Article Body Copy Content</label>
                  <textarea rows="6" value={post.content || ''} onChange={e => handleFieldChange(idx, 'content', e.target.value)} className={inputClass + " resize-none text-xs leading-relaxed"} placeholder="Type or paste the complete expanded article content text body context details here..." />
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 disabled:from-slate-700 disabled:to-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 border-0 cursor-pointer outline-none">
        <Save className="w-4 h-4" /> {isSubmitting ? "Synchronizing Matrix Parameters..." : "Push Journal CMS Updates to MongoDB Atlas"}
      </button>

    </form>
  </div>
);
}
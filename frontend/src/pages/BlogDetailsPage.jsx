import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, ChevronLeft } from 'lucide-react';
import Navbar from "@/components/home/Navbar";

export default function BlogDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams(); // 👑 Extracts the active route post id parameter straight from the URL string
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Try to read the article from passed router state envelope context first
    if (location.state?.article) {
      setArticle(location.state.article);
      setLoading(false);
      return;
    }

    // 2. 👑 THE COMPANION MULTI-SOURCE SYNC: If no state exists, query your database storage pool directly using the URL ID token!
    try {
      const savedPostsStr = localStorage.getItem('blog_posts');
      if (savedPostsStr) {
        const allPosts = JSON.parse(savedPostsStr);
        // Find matching entry whether the stored key id is a string code token or pure integer count parameter
        const matchedPost = allPosts.find(p => String(p.id) === String(id));
        if (matchedPost) {
          setArticle(matchedPost);
        }
      }
    } catch (err) {
      console.error("Failed to parse local blog storage pools during direct route linking:", err);
    } finally {
      setLoading(false);
    }
  }, [id, location.state]);

  if (loading) {
    return (
      <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-200 flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-xs font-mono font-bold text-slate-400 dark:text-slate-600 animate-pulse uppercase tracking-widest">
          Searching article archives index...
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen text-center py-20 flex flex-col justify-between select-none">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-sm font-bold text-slate-400">Journal article tracking token mismatch.</p>
          <button onClick={() => navigate('/blog')} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold border-0 cursor-pointer outline-none shadow-xs">
            Return to Journal Index
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 min-h-screen transition-colors duration-200 pb-24 text-left flex flex-col justify-between">
      <div className="w-full flex flex-col">
        <Navbar />

        <main className="max-w-[800px] mx-auto w-full px-4 pt-12 space-y-6 text-left">
          
          <Link to="/blog" className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-blue-600 no-underline transition-colors outline-none mb-2">
            <ChevronLeft className="w-4 h-4" /> Back to Journal Index
          </Link>

          <div className="space-y-3 text-left">
            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-widest">{article.category}</span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight pt-1">{article.title}</h1>
            
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 pt-2 border-b border-slate-200/40 dark:border-slate-800/40 pb-4">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {article.date}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {article.readTime}</span>
            </div>
          </div>

          {article.image && (
            <div className="w-full h-[320px] sm:h-[420px] bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 overflow-hidden rounded-2xl shadow-xs">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover object-center" />
            </div>
          )}

          {/* RENDERS TEXT CONTENT PARAMETERS */}
          <article className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium space-y-4 pt-4 whitespace-pre-line text-justify max-w-full overflow-hidden">
            {article.content || article.excerpt}
          </article>

        </main>
      </div>
    </div>
  );
}
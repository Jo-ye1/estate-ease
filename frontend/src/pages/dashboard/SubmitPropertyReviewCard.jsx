import React, { useState } from "react";
import axios from "axios";
import { Star, MessageSquare } from "lucide-react";

export default function SubmitPropertyReviewCard({ targetUserId, propertyId, onReviewSuccess }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleReviewSubmission = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/profile/submit-review", 
        { targetUserId, propertyId, rating, reviewText: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Feedback logged! Ratings averages recalculated smoothly.");
      setText("");
      if (typeof onReviewSuccess === "function") onReviewSuccess();
    } catch (err) {
      alert(err.response?.data?.message || "Failed uploading review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs max-w-2xl mt-8">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={16} className="text-blue-500" />
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Leave Transaction Feedback</h3>
      </div>

      <form onSubmit={handleReviewSubmission} className="space-y-4">
        <div>
          <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1">Score Evaluation Tier</label>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((starValue) => (
              <button
                type="button"
                key={starValue}
                onClick={() => setRating(starValue)}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                <Star size={18} fill={starValue <= rating ? "#f59e0b" : "transparent"} className={starValue <= rating ? "text-amber-500" : "text-slate-300 dark:text-slate-700"} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1">Share Your Written Experience</label>
          <textarea 
            rows="3"
            placeholder="Type your authentic closing transaction write-up notes here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50 dark:bg-slate-950 text-xs font-semibold outline-none text-slate-800 dark:text-slate-200 leading-relaxed resize-none"
          />
        </div>

        <button 
          type="submit" 
          disabled={submitting}
          className="px-4 py-2.5 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50"
        >
          {submitting ? "Processing..." : "Publish Review"}
        </button>
      </form>
    </div>
  );
}

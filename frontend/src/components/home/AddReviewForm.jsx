import { useState } from "react";
import api from "../../lib/api";

export default function AddReviewForm({ onReviewAdded }) {
  const [quote, setQuote] = useState("");
  const [stars, setStars] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quote.trim()) return alert("Please type your feedback message first.");

    try {
      setSubmitting(true);
      await api.post("/testimonials", { quote: quote.trim(), stars });
      alert("Thank you! Your verified review has been published directly to the database.");
      setQuote("");
      setStars(5);
      if (onReviewAdded) onReviewAdded(); // Triggers live feed reload
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl mt-12">
      <h3 className="text-lg font-bold text-white mb-1">Leave Platform Feedback</h3>
      <p className="text-xs text-slate-400 mb-4">Share your experience using the Estate Ease marketplace network</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Star Rating</label>
          <select 
            value={stars} 
            onChange={(e) => setStars(Number(e.target.value))}
            className="bg-slate-950 border border-slate-700 text-yellow-400 text-sm px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold cursor-pointer"
          >
            <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
            <option value="4">⭐⭐⭐⭐ 4 Stars</option>
            <option value="3">⭐⭐⭐ 3 Stars</option>
            <option value="2">⭐⭐ 2 Stars</option>
            <option value="1">⭐ 1 Star</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Your Review</label>
          <textarea 
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            required
            placeholder="Estate Ease made tracking my favorites and listing properties incredibly fast..."
            className="w-full h-24 px-4 py-2.5 text-sm border border-slate-700 bg-slate-950 text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <button 
          type="submit" 
          disabled={submitting} 
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold py-2.5 rounded-xl text-sm transition-all cursor-pointer shadow-md"
        >
          {submitting ? "Publishing Review..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}

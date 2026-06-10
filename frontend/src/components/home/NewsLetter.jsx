import { useState } from "react";
import { subscribeToNewsletter } from "@/services/authService"; // 👈 Connects right to your new network service

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribeSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return alert("Please enter a valid email address first.");
    }

    // Quick structural syntax validation safeguard checks
    if (!email.includes("@") || !email.includes(".")) {
      return alert("Please enter a properly formatted email syntax (e.g., user@test.com).");
    }

    try {
      setIsSubmitting(true);
      
      // Fires the clean string parameter down to your new database lead system
      const response = await subscribeToNewsletter(email.trim());
      
      alert(response.message || "Subscription successful! Thank you.");
      setEmail(""); // Instantly wipes out input field state on success
    } catch (error) {
      console.error("Newsletter pipeline error:", error);
      alert(error.response?.data?.message || "Subscription process encountered an issue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <div className="rounded-3xl bg-blue-600 p-12 text-white shadow-xl">
        <h2 className="text-4xl font-bold mb-4">
          Subscribe To Get Latest News
        </h2>

        <p className="mb-8 text-blue-100 font-medium">
          Get real-time automated updates about hot property deals, investments, and market trends.
        </p>

        {/* Form component tracking wrappers safely prevent default reload clicks */}
        <form onSubmit={handleSubscribeSubmit} className="flex flex-col md:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            disabled={isSubmitting}
            className="flex-1 rounded-xl px-5 py-3 text-slate-900 bg-white placeholder-slate-400 outline-none focus:ring-4 focus:ring-blue-400/50 transition-all font-medium disabled:opacity-80"
          />

          <button 
            type="submit"
            disabled={isSubmitting}
            className="bg-white hover:bg-slate-100 disabled:bg-slate-100/70 text-blue-600 px-8 py-3 rounded-xl font-bold transition-all shadow-md cursor-pointer select-none text-center min-w-[140px]"
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}

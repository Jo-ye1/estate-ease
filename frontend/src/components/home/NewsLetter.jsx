import { useState } from "react";
import { subscribeToNewsletter } from "@/services/authService";
// TARGET ASSET imported directly into the code
import heroImg from "@/assets/home.png"; 

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribeSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return alert("Please enter a valid email address first.");
    }

    if (!email.includes("@") || !email.includes(".")) {
      return alert("Please enter a properly formatted email syntax (e.g., user@test.com).");
    }

    try {
      setIsSubmitting(true);
      const response = await subscribeToNewsletter(email.trim());
      alert(response.message || "Subscription successful! Thank you.");
      setEmail(""); 
    } catch (error) {
      console.error("Newsletter pipeline error:", error);
      alert(error.response?.data?.message || "Subscription process encountered an issue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // 🎯 GLOBAL LAYOUT ENVELOPE: Locked to exactly max-w-[1320px] 
    // Added margin-top to give the overflowing roof clean breathing room from the section above it
    <section className="max-w-[1320px] mx-auto px-4 mt-24 mb-16 select-none text-left relative">
      
      {/* 🏢 MAIN SECTOR BACKDROP LAYER: Locked strictly to 373px height with overflow-visible turned on */}
      <div className="w-full h-[373px] rounded-[32px] bg-[#e6f2ff] dark:bg-slate-900/40 border border-blue-100/50 dark:border-slate-800/80 flex items-center justify-between px-12 lg:px-20 relative overflow-visible transition-colors duration-200">
        
        {/* 📋 LEFT BLOCK TEXT PANEL: Budgeted exactly to the target 614x231px layout specifications */}
        <div className="w-[614px] h-[231px] flex flex-col justify-between relative z-10 text-left py-1">
          
          {/* Target Blueprint Headline Typography - FIXED: Added tracking-tight */}
          <h2 className="text-3xl lg:text-[40px] font-black tracking-tight leading-[1.2] text-[#0b4fb9] dark:text-blue-400">
            Subscribe to get the latest <br />
            news for you!
          </h2>

          {/* White capsule input matrix form tray - FIXED: Scaled height and padding dynamically for balanced heft */}
          <form 
            onSubmit={handleSubscribeSubmit} 
            className="w-full bg-white dark:bg-slate-950 p-2 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 shadow-sm min-h-[56px]"
          >
            <div className="flex-1 h-[44px] px-3 flex items-center min-w-0">
              <input 
                type="email" 
                placeholder="Enter your email..." 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full text-xs font-bold text-slate-800 dark:text-white bg-transparent outline-none truncate placeholder-slate-400 dark:placeholder-slate-600 border-0 p-0 target-email-fix input-override" 
              />
            </div>
            
            {/* Deep corporate blue submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-[44px] px-6 bg-[#0b4fb9] hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-xs tracking-wide rounded-lg transition-colors flex items-center justify-center cursor-pointer border-0 shrink-0 shadow-sm min-w-[100px] disabled:opacity-80"
            >
              {isSubmitting ? "..." : "Subscribe"}
            </button>
          </form>

        </div>

        {/* 📷 RIGHT BLOCK COVER IMAGE HOUSING LAYER: Sized exactly to the target 491x435px blueprint parameters */}
        {/* OVERFLOW RESTORED: Positioned absolutely to extend perfectly beyond the top and bottom of the parent layout box */}
        <div 
          className="absolute right-4 lg:right-16 bottom-[-1px] overflow-visible pointer-events-none select-none z-20 hidden md:block"
          style={{ width: "491px", height: "435px" }}
        >
          <img 
            src={heroImg} 
            alt="Featured Suburban Asset Element Clipart" 
            className="w-full h-full object-contain object-bottom filter drop-shadow-[0_25px_40px_rgba(0,0,0,0.08)]"
          />
        </div>

      </div>
    </section>
  );
}

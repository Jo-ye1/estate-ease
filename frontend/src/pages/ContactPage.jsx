import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, Clock } from "lucide-react";
import Navbar from "@/components/home/Navbar"; // Imports your unified layout shell header

export default function ContactPage() {
  // Form submission and validation state handlers
  const [formData, setFormData] = useState({ email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      // Simulating database API network submission loop
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setIsSent(true);
      setFormData({ email: "", subject: "", message: "" });
    } catch (err) {
      console.error("Contact form delivery matrix failure:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: <Phone className="w-5 h-5 text-blue-500" />,
      title: "Brokerage Hotlines",
      detail: "+1 (555) 234-5678",
      subtext: "Mon-Fri • 9:00 AM - 6:00 PM"
    },
    {
      icon: <Mail className="w-5 h-5 text-blue-500" />,
      title: "Support Channels",
      detail: "operations@estateease.com",
      subtext: "24 hour typical queue turnaround"
    },
    {
      icon: <MapPin className="w-5 h-5 text-blue-500" />,
      title: "Corporate HQ",
      detail: "742 Evergreen Terrace",
      subtext: "Suite 400 • New York, NY"
    }
  ];

  return (
    // 🎯 TARGET SPEC MULTI-THEME OVERRIDE CANVAS (1320px layout envelope)
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen select-none text-left transition-colors duration-200 pb-24 flex flex-col">
      
      {/* Structural layout header */}
      <Navbar />

      <section className="max-w-[1320px] mx-auto w-full px-4 pt-24 pb-16 flex-1 flex flex-col justify-start">
        
        {/* SECTION 1: HEADER TEXT BLOCK WITH DECORATIVE UNDERLINE */}
        <div className="mb-14 relative inline-block max-w-max">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full mb-3 block w-max">
            Get In Touch
          </span>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-white tracking-tight pb-3">
            Contact the <span className="text-blue-600 dark:text-blue-500">Estate Ease</span> Registry
          </h1>
          <div className="absolute bottom-0 left-0 w-1/3 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full" />
        </div>

        {/* SECTION 2: TWO-COLUMN PROFESSIONAL COMBOS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start w-full">
          
          {/* Left Column Side: Direct Connection Channels Meta Indicators */}
          <div className="lg:col-span-5 space-y-6 w-full">
            <div className="max-w-[420px]">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight mb-3">
                Reach out to our global asset specialists
              </h2>
              <p className="text-slate-400 dark:text-slate-500 text-xs font-medium leading-relaxed">
                Have verified listing credentials you want to index? Our certified brokers stand ready to expedite your property routing configuration.
              </p>
            </div>

            {/* Rendered Direct Method Cards */}
            <div className="space-y-4 pt-4">
              {contactMethods.map((method, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm"
                >
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl shrink-0">
                    {method.icon}
                  </div>
                  <div className="min-w-0 text-left">
                    <h4 className="font-bold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide leading-none mb-1.5">
                      {method.title}
                    </h4>
                    <p className="font-extrabold text-sm text-slate-800 dark:text-slate-100 truncate tracking-tight">
                      {method.detail}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-[10.5px] font-medium text-slate-400 dark:text-slate-500">
                      <Clock className="w-3 h-3 text-slate-300 dark:text-slate-700" />
                      <span>{method.subtext}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column Side: Corporate Form Dispatch Portal */}
          <div className="lg:col-span-7 w-full">
            <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 lg:p-8 shadow-sm relative overflow-hidden">
              
              {isSent ? (
                /* Success Feedback Module Block */
                <div className="py-12 flex flex-col items-center justify-center text-center animate-fadeIn">
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center rounded-full mb-4 shadow-sm">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">
                    Message Dispatched Successfully
                  </h3>
                  <p className="text-slate-400 dark:text-slate-500 text-xs font-medium mt-1.5 max-w-[290px] leading-relaxed">
                    Our verified agency router has prioritized your inquiry loop. Check your inbox shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSent(false)}
                    className="mt-6 px-5 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                /* Functional Form Layout Layer */
                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                        Your Email Address
                      </label>
                      <input 
                        type="email" 
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="name@example.com" 
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-medium" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                        Inquiry Subject
                      </label>
                      <input 
                        type="text" 
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Listing Verification / Partnership" 
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-medium" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                      Detailed Message
                    </label>
                    <textarea 
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Specify property ID details or broker support request guidelines..." 
                      className="w-full h-36 px-4 py-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all resize-none font-medium leading-relaxed" 
                    />
                  </div>
                  {/* 🎯 FIXED & FULLY CLOSED BUTTON LAYER CONTAINER */}
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/60 text-white py-3 rounded-xl font-extrabold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-blue-600/10 h-11"
                  >
                    {isSubmitting ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Transmit Message Loop</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>

      </section>
    </div>
  );
}

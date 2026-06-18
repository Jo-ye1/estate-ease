import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Mail, Phone, MapPin, Send, CheckCircle, Clock } from "lucide-react";
import Navbar from "@/components/home/Navbar";
import axios from "axios"; // 🟢 Added to establish your real-time content delivery sync

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const purposeParam = searchParams.get("purpose") || "general";

  // --- 1. Reactive State Trackers initialized with static base template defaults ---
  const [phone, setPhone] = useState("+1 (555) 234-5678");
  const [hours, setHours] = useState("Mon-Fri • 9:00 AM - 6:00 PM");
  const [email, setEmail] = useState("operations@estateease.com");
  const [emailSub, setEmailSub] = useState("24 hour typical queue turnaround");
  const [address, setAddress] = useState("742 Evergreen Terrace");
  const [suite, setSuite] = useState("Suite 400 • New York, NY");

  const [formData, setFormData] = useState({ email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const pageConfigs = {
    general: {
      badge: "Get In Touch",
      title: "Contact the Estate Ease Registry",
      desc: "Have verified listing credentials you want to index? Our certified brokers stand ready to expedite your property routing configuration.",
      subjectPlaceholder: "Listing Verification / Partnership Inquiry",
      messagePlaceholder: "Specify property ID details or broker support request guidelines..."
    },
    questions: {
      badge: "Help & Support",
      title: "Frequently Asked Questions Desk",
      desc: "Can't find an absolute clear answer in our standards documentation? Submit your query criteria straight to our tier-1 support network queue.",
      subjectPlaceholder: "Question regarding platform marketplace functionality",
      messagePlaceholder: "Type your questions here clearly so our team can resolve them..."
    },
    help: {
      badge: "Helping Center",
      title: "Operational Assistance & Support",
      desc: "Encountering a bug or require help managing your seller account profile? Connect immediately with our asset operations department.",
      subjectPlaceholder: "Account Configuration Support / Technical Issue",
      messagePlaceholder: "Describe the operational hurdle or error you are facing in detail..."
    },
    career: {
      badge: "Careers",
      title: "Join the Real Estate Innovation Team",
      desc: "Want to partner with our brokers and expand our property ecosystems? We are constantly scanning for passionate real-estate operators.",
      subjectPlaceholder: "Broker Application / Engineering Career Interest",
      messagePlaceholder: "Tell us about your background experience and why you want to scale Estate Ease..."
    }
  };

  const currentConfig = pageConfigs[purposeParam] || pageConfigs.general;

  // --- Live Server Data Content Synchronization Engine ---
  useEffect(() => {
    const syncWithBackendMatrix = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin-settings/contact");
        const matrix = response.data;
        
        if (matrix) {
          setPhone(matrix.phone || matrix.hotline || "+1 (555) 234-5678"); // 🟢 FIXED
          setHours(matrix.hours || "Mon-Fri • 9:00 AM - 6:00 PM");
          setEmail(matrix.email || "operations@estateease.com");
          setEmailSub(matrix.emailSub || "24 hour typical queue turnaround");
          setAddress(matrix.address || "742 Evergreen Terrace");
          setSuite(matrix.suite || "Suite 400 • New York, NY");
        }
      } catch (err) {
        console.error("Content hydration failed, falling back to local memory tracks:", err);
      }
    };

    syncWithBackendMatrix();
  }, []);



  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      subject: currentConfig.subjectPlaceholder
    }));
  }, [purposeParam, currentConfig.subjectPlaceholder]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const savedMsg = localStorage.getItem('contact_received_messages');
      const existingMessages = savedMsg ? JSON.parse(savedMsg) : [];

      const newTransmission = {
        id: Date.now(),
        sender: formData.email,
        date: new Date().toISOString().split('T')[0],
        message: `[${formData.subject}] - ${formData.message}`
      };

      localStorage.setItem('contact_received_messages', JSON.stringify([newTransmission, ...existingMessages]));

      setIsSent(true);
      setFormData({ email: "", subject: currentConfig.subjectPlaceholder, message: "" });
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
      detail: phone,
      subtext: hours
    },
    {
      icon: <Mail className="w-5 h-5 text-blue-500" />,
      title: "Support Channels",
      detail: email,
      subtext: emailSub
    },
    {
      icon: <MapPin className="w-5 h-5 text-blue-500" />,
      title: "Corporate HQ",
      detail: address,
      subtext: suite
    }
  ];

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen select-none text-left transition-colors duration-200 pb-24 flex flex-col">
      <Navbar />

      <section className="max-w-[1320px] mx-auto w-full px-4 pt-24 pb-16 flex-1 flex flex-col justify-start">
        
        <div className="mb-14 relative inline-block w-full">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full mb-3 block w-max">
            {currentConfig.badge}
          </span>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-white tracking-tight pb-3">
            {currentConfig.title}
          </h1>
          <div className="w-24 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full mt-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          
          <div className="lg:col-span-5 space-y-6 w-full">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed max-w-md">
              {currentConfig.desc}
            </p>

            <div className="space-y-4 pt-4">
              {contactMethods.map((method, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-xs"
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

          <div className="lg:col-span-7 w-full">
            <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 lg:p-8 shadow-xs relative overflow-hidden">
              
              {isSent ? (
                /* Success Feedback Module Block */
                <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-200">
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center rounded-full mb-4 shadow-sm">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">
                    Message Dispatched Successfully
                  </h3>
                  <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold mt-1 max-w-xs leading-relaxed">
                    Your inquiry payload hash string has successfully locked inside our administrator listening loop matrix queue.
                  </p>
                  <button 
                    type="button" 
                    onClick={() => setIsSent(false)}
                    className="mt-6 px-4 py-2 text-xs font-extrabold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-colors border-0 cursor-pointer"
                  >
                    Transmit Another Message
                  </button>
                </div>
              ) : (
                /* Standard Contact Submission Form Fields Grid */
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">
                      Your Email Address
                    </label>
                    <input 
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      className="w-full bg-slate-50 dark:bg-[#111927] border border-slate-200 dark:border-gray-800 text-slate-900 dark:text-white rounded-xl p-3 text-sm font-medium outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">
                      Detailed Subject
                    </label>
                    <input 
                      required
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Specify core topic"
                      className="w-full bg-slate-50 dark:bg-[#111927] border border-slate-200 dark:border-gray-800 text-slate-900 dark:text-white rounded-xl p-3 text-sm font-medium outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">
                      Message Context
                    </label>
                    <textarea 
                      required
                      rows="5"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={currentConfig.messagePlaceholder}
                      className="w-full bg-slate-50 dark:bg-[#111927] border border-slate-200 dark:border-gray-800 text-slate-900 dark:text-white rounded-xl p-3 text-sm font-medium outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 border-0 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? "TRANSMITTING DATA..." : "TRANSMIT MESSAGE LOOP"}</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Save, Phone, Mail, MapPin, MessageSquare, Trash2, ArrowUpRight } from 'lucide-react';

export default function ContactManager() {
  // --- 1. State Hooks initialized natively with LocalStorage data or defaults ---
  const [phone, setPhone] = useState(() => localStorage.getItem('contact_phone') || "+1 (555) 234-5678");
  const [hours, setHours] = useState(() => localStorage.getItem('contact_hours') || "Mon-Fri - 9:00 AM - 6:00 PM");
  const [email, setEmail] = useState(() => localStorage.getItem('contact_email') || "operations@estateease.com");
  const [emailSub, setEmailSub] = useState(() => localStorage.getItem('contact_email_sub') || "24 hour typical queue turnaround");
  const [address, setAddress] = useState(() => localStorage.getItem('contact_address') || "742 Evergreen Terrace");
  const [suite, setSuite] = useState(() => localStorage.getItem('contact_suite') || "Suite 400 - New York, NY");

  // --- 2. Live Inbox Listener Pipeline for Received User Messages ---
  const [receivedMessages, setReceivedMessages] = useState(() => {
    const savedMsg = localStorage.getItem('contact_received_messages');
    return savedMsg ? JSON.parse(savedMsg) : [
      { id: 101, sender: "investor@alpha.com", date: "2026-06-11", message: "Requesting compliance records validation packet for asset tokenization sequence array indices." },
      { id: 102, sender: "brokerage@prime.io", date: "2026-06-10", message: "Interested in establishing secondary structural routing hooks to standard pool structures." }
    ];
  });

  // --- 3. Pure LocalStorage Save Operations ---
  const handleUpdateContactDetails = (e) => {
    e.preventDefault();
    localStorage.setItem('contact_phone', phone);
    localStorage.setItem('contact_hours', hours);
    localStorage.setItem('contact_email', email);
    localStorage.setItem('contact_email_sub', emailSub);
    localStorage.setItem('contact_address', address);
    localStorage.setItem('contact_suite', suite);
    alert("Public Core Contact Matrix Fully Updated inside browser memory!");
  };

  const handlePurgeMessage = (id) => {
    if (!window.confirm("Are you certain you want to remove this message transmission from the inbox log?")) return;
    const updatedMessages = receivedMessages.filter(msg => msg.id !== id);
    setReceivedMessages(updatedMessages);
    localStorage.setItem('contact_received_messages', JSON.stringify(updatedMessages));
  };

  // 🎨 FIXED ADAPTIVE THEME DESIGN SYSTEM CLASSES: Matches any page theme seamlessly
  const formCardClass = "bg-white dark:bg-[#0a101d] border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-2xl shadow-xs";
  const fieldGroupClass = "p-4 rounded-xl border border-dashed border-slate-200 dark:border-gray-800 bg-slate-50/40 dark:bg-slate-950/10 text-left";
  const inputClass = "w-full bg-slate-50 dark:bg-[#111927] border border-slate-200 dark:border-gray-800 text-slate-900 dark:text-white rounded-xl p-3 text-sm font-medium outline-none focus:border-blue-500 transition-colors";
  const labelClass = "block text-xs font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2 text-left";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
      
      {/* LEFT 5-COLUMNS LAYOUT Panel: Editable Content Channels Node Inputs */}
      <form onSubmit={handleUpdateContactDetails} className={`${formCardClass} lg:col-span-5 self-start space-y-6`}>
        <div className="text-left">
          <h3 className="font-bold text-sm uppercase tracking-wider text-blue-600 dark:text-blue-500">Contact Channels Data</h3>
          <p className="text-xs text-slate-400">Manage display elements for public registry widgets</p>
        </div>

        <div className="space-y-4">
          <div className={fieldGroupClass}>
            <label className="flex items-center gap-2 text-xs font-black text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">
              <Phone className="w-3.5 h-3.5" /> Hotline Infrastructure
            </label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass + " mb-2"} placeholder="Telephone" />
            <input type="text" value={hours} onChange={e => setHours(e.target.value)} className={inputClass} placeholder="Availability Window" />
          </div>

          <div className={fieldGroupClass}>
            <label className="flex items-center gap-2 text-xs font-black text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">
              <Mail className="w-3.5 h-3.5" /> Support Queues
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass + " mb-2"} placeholder="Email Endpoint" />
            <input type="text" value={emailSub} onChange={e => setEmailSub(e.target.value)} className={inputClass} placeholder="Response Metrics Meta" />
          </div>

          <div className={fieldGroupClass}>
            <label className="flex items-center gap-2 text-xs font-black text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">
              <MapPin className="w-3.5 h-3.5" /> Corporate HQ Address
            </label>
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} className={inputClass + " mb-2"} placeholder="Address Row 1" />
            <input type="text" value={suite} onChange={e => setSuite(e.target.value)} className={inputClass} placeholder="Address Row 2" />
          </div>
        </div>

        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border-0 cursor-pointer shadow-md shadow-blue-500/5">
          <Save className="w-4 h-4" /> Save Contact Metrics
        </button>
      </form>

      {/* RIGHT 7-COLUMNS LAYOUT PANEL: Interactive Received Form Messages Box */}
      <div className={`${formCardClass} lg:col-span-7 space-y-6 flex flex-col`}>
        <div className="text-left">
          <h3 className="font-bold text-sm uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Transmit Message Loop Listener
          </h3>
          <p className="text-xs text-slate-400">View live system context submissions generated via public forms</p>
        </div>

        {receivedMessages.length === 0 ? (
          <div className="text-center py-16 text-xs font-mono font-bold text-slate-400 dark:text-slate-600 border border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl bg-slate-50/20 w-full">
            No dynamic message iterations detected inside transaction stack queue loop.
          </div>
        ) : (
          <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1 w-full">
            {receivedMessages.map((msg) => (
              <div key={msg.id} className="p-4 rounded-xl border relative transition-all bg-slate-50/50 dark:bg-[#111927]/40 border-slate-200 dark:border-gray-800/70 hover:bg-slate-100/40 dark:hover:bg-[#111927]/70 text-left">
                <button 
                  type="button"
                  onClick={() => handlePurgeMessage(msg.id)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors border-0 bg-transparent cursor-pointer outline-none"
                  title="Purge iteration data from inbox view"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2 text-[11px]">
                  <span className="font-black text-blue-600 dark:text-blue-400 flex items-center gap-0.5 font-mono truncate max-w-[240px]">
                    FROM: {msg.sender} <ArrowUpRight className="w-3 h-3" />
                  </span>
                  <span className="text-slate-400 font-mono hidden sm:inline">|</span>
                  <span className="text-slate-400 font-mono">{msg.date}</span>
                  <span className="text-slate-400 font-mono hidden sm:inline">|</span>
                  <span className="text-slate-400 font-mono">ID: #{msg.id}</span>
                </div>
                <p className="text-xs font-semibold leading-relaxed tracking-wide text-slate-500 dark:text-slate-400">{msg.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

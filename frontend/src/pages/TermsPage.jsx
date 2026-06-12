import React, { useState, useEffect } from "react";
import { ShieldCheck, CheckCircle, Scale } from "lucide-react";
import Navbar from "@/components/home/Navbar";

export default function TermsPage() {
  // --- 1. Dynamic State Headers Hooks connected natively to Browser Memory ---
  const [sectionHeading, setSectionHeading] = useState(() => localStorage.getItem('terms_heading') || "Terms of Service & Privacy Policy");
  const [sectionSub, setSectionSub] = useState(() => localStorage.getItem('terms_subheading') || "Review our verified corporate rules, asset tracking legal codes, and safety procedures");
  
  const [legalIntegrityTitle, setLegalIntegrityTitle] = useState(() => localStorage.getItem('terms_integrity_title') || "Legal Integrity");
  const [integrityPoint1, setIntegrityPoint1] = useState(() => localStorage.getItem('terms_integrity_p1') || "Your database profiles data arrays utilize localized environment layer encryptions natively.");
  const [integrityPoint2, setIntegrityPoint2] = useState(() => localStorage.getItem('terms_integrity_p2') || "Terms apply automatically to all system operators upon creating an app routing session token.");

  // --- 2. Dynamic Compliance Chapters Array State ---
  const [complianceSections, setComplianceSections] = useState(() => {
    const saved = localStorage.getItem('terms_protocols');
    return saved ? JSON.parse(saved) : [
      {
        numLabel: "01",
        title: "Data Indexation & Verification Protocol",
        content: "When listing properties on EstateEase, operators grant our servers a global license to map, store, and distribute metadata documents. We enforce severe penalties, including total account purges from MongoDB collection structures, if pricing variables contain false data strings."
      },
      {
        numLabel: "02",
        title: "User Authenticity & Profile Security",
        content: "You are solely responsible for protecting your session token parameters. Password updates modified inside your Account Profile suite hash natively inside database tiers. Master Admins reserve the right to audit and manage permissions to prevent system exploitation bugs."
      },
      {
        numLabel: "03",
        title: "Closing Settlements & Fees",
        content: "Marketplace values represent gross asset dimensions. Transaction clearing parameters executed via verified broker panels are governed under local regulatory real estate escrow codes. Processing settlement closures triggers platform event history log generation automatically."
      }
    ];
  });

  // --- 3. Live Storage Listener: Sync instantly across open browser tabs ---
  useEffect(() => {
    const syncTermsPageMemory = () => {
      setSectionHeading(localStorage.getItem('terms_heading') || "Terms of Service & Privacy Policy");
      setSectionSub(localStorage.getItem('terms_subheading') || "Review our verified corporate rules, asset tracking legal codes, and safety procedures");
      setLegalIntegrityTitle(localStorage.getItem('terms_integrity_title') || "Legal Integrity");
      setIntegrityPoint1(localStorage.getItem('terms_integrity_p1') || "Your database profiles data arrays utilize localized environment layer encryptions natively.");
      setIntegrityPoint2(localStorage.getItem('terms_integrity_p2') || "Terms apply automatically to all system operators upon creating an app routing session token.");
      
      const savedProtocols = localStorage.getItem('terms_protocols');
      if (savedProtocols) setComplianceSections(JSON.parse(savedProtocols));
    };

    window.addEventListener('storage', syncTermsPageMemory);
    syncTermsPageMemory(); // Execution cycle checkpoint update lookup on initial load mount

    return () => window.removeEventListener('storage', syncTermsPageMemory);
  }, []);

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen select-none text-left transition-colors duration-200 pb-24 flex flex-col">
      <Navbar />

      <section className="max-w-[1320px] mx-auto w-full px-4 pt-16 flex-1 flex flex-col justify-start">
        
        {/* SECTION 1: DYNAMIC HEADER TEXT BLOCK */}
        <div className="mb-14 relative inline-block w-full">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full mb-3 block w-max">
            Compliance Standards
          </span>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-white tracking-tight pb-3">
            {sectionHeading.includes("Privacy Policy") ? (
              <>
                {sectionHeading.split("Privacy Policy")[0]}
                <span className="text-blue-600 dark:text-blue-500">Privacy Policy</span>
                {sectionHeading.split("Privacy Policy")[1]}
              </>
            ) : (
              sectionHeading
            )}
          </h1>
          <p className="text-slate-400 dark:text-slate-500 text-xs font-medium mt-1 leading-none">
            {sectionSub}
          </p>
          <div className="w-24 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full mt-4" />
        </div>

        {/* TWO-COLUMN EXECUTIVE FLOW GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start w-full">
          
          {/* Left Side: Dynamic Compliance Chapters Deck (Spans 8 columns) */}
          <div className="lg:col-span-8 space-y-8 w-full">
            {complianceSections.map((sec, index) => (
              <div 
                key={sec.id || index}
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm text-left flex gap-5 items-start animate-in fade-in duration-200"
              >
                {/* Numeric Indicator Capsule */}
                <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-sm select-none shrink-0">
                  {sec.numLabel || `0${index + 1}`}
                </div>
                <div className="space-y-2 min-w-0">
                  <h3 className="font-black text-sm text-slate-800 dark:text-white tracking-tight leading-tight">
                    {sec.title || "Untitled Clause Parameter"}
                  </h3>
                  <p className="text-slate-400 dark:text-slate-400 text-xs font-medium leading-relaxed">
                    {sec.content || "Compliance statement copy context empty..."}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side: Security Seals Verification Box (Spans 4 columns) */}
          <div className="lg:col-span-4 space-y-6 w-full text-left">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <Scale className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-white">
                  {legalIntegrityTitle}
                </h3>
              </div>
              <ul className="space-y-3.5 text-slate-400 dark:text-slate-500 text-xs font-medium leading-relaxed list-none pl-0">
                {integrityPoint1 && (
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{integrityPoint1}</span>
                  </li>
                )}
                {integrityPoint2 && (
                  <li className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span>{integrityPoint2}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

        </div>

      </section>
    </div>
  );
}

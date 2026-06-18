import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Heart } from "lucide-react"; 
import { getProperties } from "../../services/propertyService";  // Dynamic asset query pool

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  // 👑 LIVE DATA SYNCHRONIZATION HOOK: Pulls from admin configurations instantly
  const [contactData, setContactData] = useState({
    email: "operations@estateease.com",
    phone: "+251 (905) 57 366 1",
    address: "742 Evergreen Terrace, Suite 400 - New York, NY"
  });

  // 👑 SOCIALS & TEXT HOOK: Manages text scripts and platform links dynamically
  const [dynamicSocials, setDynamicSocials] = useState({
    footerText: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur magni dolores eos qui ratione.",
    facebookUrl: "https://facebook.com",
    linkedinUrl: "https://linkedin.com",
    twitterUrl: "https://twitter.com",
    instagramUrl: "https://instagram.com",
  });

  useEffect(() => {
    const fetchLiveFooterMetrics = async () => {
      try {
        // 1. Existing Property Service API Connection
        const data = await getProperties();
        if (data && data.length > 0) {
          const masterNode = data[0]?.broker || data[0];
          if (masterNode?.email || masterNode?.phone || masterNode?.location) {
            setContactData({
              email: masterNode.email || "operations@estateease.com",
              phone: masterNode.phone || "+251 (905) 57 366 1",
              address: masterNode.location || masterNode.address || "742 Evergreen Terrace, Suite 400 - New York, NY",
            });
          }
        }
      } catch (error) {
        console.error("Footer properties fallback match error:", error);
      }

      // 🛠️ Locate the second try-catch routine inside the Footer's useEffect and update it to:
      try {
        const response = await fetch("http://localhost:5000/api/settings/footer");
        if (response.ok) {
          const data = await response.json();
          setDynamicSocials({
            footerText: data.footerText || "Nemo enim ipsam voluptatem...",
            facebookUrl: data.facebookUrl || "https://facebook.com",
            linkedinUrl: data.linkedinUrl || "https://linkedin.com",
            twitterUrl: data.twitterUrl || "https://twitter.com",
            instagramUrl: data.instagramUrl || "https://instagram.com"
          });
        }
      } catch (error) {
        console.error("Failed fetching live database configurations:", error);
      }
    };
    fetchLiveFooterMetrics();
  }, []);

  // 🎯 FIXED LOGOS: Replaced text shortcuts with raw, ultra-clean vector SVG graphics linked to Admin Manager
  const socialLinks = [
    {
      url: dynamicSocials.facebookUrl || "https://facebook.com",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      url: dynamicSocials.linkedinUrl || "https://linkedin.com",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      url: dynamicSocials.twitterUrl || "https://twitter.com",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      url: dynamicSocials.instagramUrl || "https://instagram.com",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  const aboutLinks = [
    { label: "How It Works", path: "/how-it-works" },
    { label: "Customers", path: "/review" },
    { label: "Our Story", path: "/about" },
    { label: "Career", path: "/contact?purpose=career" }, 
    { label: "Contact Us", path: "/contact?purpose=general" }, 
    { label: "FAQs", path: "/faqs" } 
  ];

  const supportLinks = [
    { label: "Questions", path: "/contact?purpose=questions" }, 
    { label: "Helping Center", path: "/contact?purpose=help" }, 
    { label: "Privacy Policy", path: "/terms-policy" }, 
    { label: "Buy or Rent", path: "/search" }, 
    { label: "Properties", path: "/search" },
    { label: "Blogs", path: "/blog" }
  ];

  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 select-none text-left transition-colors duration-200">
      <div className="max-w-[1320px] mx-auto px-4 pt-12 pb-6">
        
                {/* UPPER FOOTER GRID STRUCTURE - ALIGNED & BALANCED */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 pb-10 w-full items-start">
          
          {/* COLUMN 1: BRAND IDENTITY */}
          <div className="lg:col-span-4 flex flex-col justify-start text-left max-w-[320px]">
            <Link to="/" className="text-base font-black flex items-center gap-1.5 select-none border-0 leading-none">
              <span className="text-xl select-none leading-none mt-[-2px]">🏠</span>
              <span className="uppercase tracking-wider font-extrabold text-blue-600 dark:text-blue-500">EstateEase</span>
            </Link>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-medium leading-relaxed mt-4">
              {dynamicSocials?.footerText || "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur magni dolores eos qui ratione."}
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">Follow Us</h4>
              <div className="flex items-center gap-2">
                {socialLinks.map((soc, idx) => (
                  <a 
                    key={idx}
                    href={soc.url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-blue-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    {soc.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMN 2: ABOUT DIRECTORY */}
          <div className="lg:col-span-2 flex flex-col justify-start text-left">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white mb-4 leading-none">
              About Us
            </h3>
            <ul className="space-y-2.5 list-none pl-0 mt-0 text-xs font-semibold">
              {aboutLinks.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.path} 
                    className={`transition-colors duration-150 block w-max ${
                      idx === 0 
                        ? "text-blue-600 dark:text-blue-400 font-extrabold" 
                        : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  >
                    {idx === 0 ? `• ${link.label}` : link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: SUPPORT DIRECTORY */}
          <div className="lg:col-span-2 flex flex-col justify-start text-left">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white mb-4 leading-none">
              Support & Summary
            </h3>
            <ul className="space-y-2.5 list-none pl-0 mt-0 text-xs font-semibold text-slate-400 dark:text-slate-500">
              {supportLinks.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors block w-max">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: CONTACT METADATA */}
          <div className="lg:col-span-4 flex flex-col justify-start text-left space-y-3.5 w-full">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white mb-4 leading-none">
              Contact Us
            </h3>
            
            {/* E-mail Block */}
            <div className="flex items-start gap-3 w-full max-w-[340px]">
              <div className="w-8 h-8 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center rounded-lg text-blue-600 dark:text-blue-400 shrink-0 shadow-xs">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <h5 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide leading-none mb-1">E-mail</h5>
                <a href={`mailto:${contactData.email}`} className="text-xs font-bold text-slate-400 dark:text-slate-500 truncate block hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {contactData.email}
                </a>
              </div>
            </div>

            {/* Phone Block */}
            <div className="flex items-start gap-3 w-full max-w-[340px]">
              <div className="w-8 h-8 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center rounded-lg text-blue-600 dark:text-blue-400 shrink-0 shadow-xs">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <h5 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide leading-none mb-1">Contact</h5>
                <a href={`tel:${contactData.phone.replace(/\s+/g, "")}`} className="text-xs font-bold text-slate-400 dark:text-slate-500 truncate block hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {contactData.phone}
                </a>
              </div>
            </div>

            {/* Location Block */}
            <div className="flex items-start gap-3 w-full max-w-[340px]">
              <div className="w-8 h-8 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center rounded-lg text-blue-600 dark:text-blue-400 shrink-0 shadow-xs">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 text-left">
                <h5 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide leading-none mb-1">Location</h5>
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 leading-relaxed tracking-wide">
                  {contactData.address}
                </p>
              </div>
            </div>
          </div>
          
        </div>


        {/* LOWER COPYRIGHT BAR (MAXIMIZED LEFT & RIGHT ALIGNMENT) */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between text-xs font-semibold text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-800/60 pt-4 mt-4 gap-4">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span>Copyright &copy; {currentYear} Estate Ease. Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 shrink-0 inline animate-pulse" />
          </div>
          <div className="flex items-center gap-6 whitespace-nowrap">
            <Link to="/terms-policy" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors no-underline">
              Term Condition & Policy
            </Link>
          </div>
        </div>



      </div>
    </footer>
  );
}

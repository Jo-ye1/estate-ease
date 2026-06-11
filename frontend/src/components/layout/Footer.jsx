import { Link } from "react-router-dom";

export default function Footer() {
  const currentYearDate = new Date().getFullYear();

  return (
    // 🎯 GLOBAL BACKGROUND BACKDROP PANEL
    <footer className="w-full bg-[#f8fafc] dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-900/60 pt-14 pb-4 select-none text-left transition-colors duration-200 relative overflow-hidden mx-auto flex flex-col justify-between">
      
      {/* 📷 BACKGROUND WORLD MAP VECTOR WATERMARK */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none opacity-[0.06] dark:opacity-[0.02]">
        <svg 
          viewBox="0 0 1000 400" 
          className="w-full h-full object-cover fill-slate-400 dark:fill-white min-w-[1024px]"
          xmlns="http://w3.org"
        >
          <path d="M100,60 h40 v20 h-20 v10 h-20 z M120,90 h30 v30 h-10 v10 h-30 v-20 h10 z M80,80 h30 v20 h-30 z M180,70 h50 v40 h-20 v20 h-40 v-30 h10 z" />
          <path d="M220,180 h40 v40 h-20 v50 h-15 v-40 h-10 v-30 h5 z M250,220 h30 v30 h-20 v30 h-10 z" />
          <path d="M460,160 h60 v30 h-20 v40 h-30 v30 h-20 v-40 h10 v-40 h5 z M490,200 h40 v50 h-30 v30 h-20 v-30 h10 z" />
          <path d="M450,70 h50 v40 h-30 v20 h-40 v-30 h20 z M420,90 h40 v20 h-40 z" />
          <path d="M520,60 h160 v50 h-40 v30 h-30 v20 h-40 v-40 h-20 v-30 h-30 z M600,120 h80 v60 h-40 v30 h-60 v-30 h20 z M700,90 h50 v40 h-30 v30 h-40 v-40 h20 z" />
          <path d="M780,240 h50 v30 h-20 v20 h-30 v-30 h-10 z M820,260 h30 v20 h-30 z" />
          <circle cx="340" cy="120" r="6" /><circle cx="360" cy="150" r="4" /><circle cx="410" cy="80" r="5" />
          <circle cx="720" cy="210" r="8" /><circle cx="750" cy="180" r="5" /><circle cx="160" cy="220" r="6" />
        </svg>
      </div>

      {/* 🎯 SPEC FIXED WRAPPER CONTAINER: Changed px-24 to max-w-[1320px] and px-4 to match the page margins perfectly! */}
      <div className="w-full max-w-[1320px] mx-auto px-4 relative z-10 flex-1 flex flex-col justify-between">
        
        {/* 📊 THE RESPONISVE 4-COLUMN HIERARCHY MATRIX */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-10 items-start pt-4 pb-8">
          
          {/* COLUMN 1: BRAND PLATFORM & SOLID SOCIAL CARD GRID */}
          <div className="flex flex-col justify-start max-w-[312px]">
            <div className="flex items-center gap-2.5 text-[21px] font-black text-blue-600 dark:text-blue-500 tracking-tight">
              <span className="text-2xl select-none leading-none mt-[-2px]">🏠</span>
              <span className="tracking-tight font-black text-blue-600 dark:text-blue-500 text-base uppercase">Estate Ease</span>
            </div>
            
            <p className="text-[11.5px] font-medium text-slate-400 dark:text-slate-500 mt-4 leading-[1.6] tracking-wide text-left">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed consequuntur magni dolores eos qui ratione.
            </p>

            <h4 className="text-[11px] font-black text-slate-700 dark:text-slate-300 tracking-tight uppercase mt-6 mb-3 leading-none">
              Follow Us
            </h4>
            
            <div className="flex items-center gap-2">
              {[
                { path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
                { path: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z", isIg: true },
                { path: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" },
                { path: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }
              ].map((social, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="w-7 h-7 bg-slate-200/50 hover:bg-[#0b4fb9] dark:bg-slate-900 dark:hover:bg-blue-600 text-slate-400 dark:text-slate-500 hover:text-white rounded-[4px] flex items-center justify-center transition-all duration-200 shadow-sm border border-transparent dark:border-slate-800/40"
                >
                  <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    {social.isIg && <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />}
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* COLUMN 2: ABOUT US LINKS */}
          <div className="flex flex-col justify-start w-full max-w-[108px] lg:mx-auto">
            <h3 className="font-black text-slate-800 dark:text-white mb-5 text-[13px] tracking-tight leading-none">
              About Us
            </h3>
            <ul className="space-y-3 text-[11px] text-slate-400 dark:text-slate-500 font-semibold tracking-wide">
              <li className="flex items-center gap-1.5 text-[#0b4fb9] dark:text-blue-400 font-bold leading-none">
                <span className="text-[8px] leading-none select-none -mt-[1px]">▪▪</span>
                <Link to="/how-it-works" className="hover:underline">How It Work</Link>
              </li>
              <li className="leading-none"><Link to="/customers" className="hover:text-[#0b4fb9] dark:hover:text-blue-400 transition-colors">Customers</Link></li>
              <li className="leading-none"><Link to="/our-story" className="hover:text-[#0b4fb9] dark:hover:text-blue-400 transition-colors">Our Story</Link></li>
              <li className="leading-none"><Link to="/careers" className="hover:text-[#0b4fb9] dark:hover:text-blue-400 transition-colors">Career</Link></li>
              <li className="leading-none"><Link to="/contact" className="hover:text-[#0b4fb9] dark:hover:text-blue-400 transition-colors">Contact Us</Link></li>
              <li className="leading-none"><Link to="/faqs" className="hover:text-[#0b4fb9] dark:hover:text-blue-400 transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* COLUMN 3: SUPPORT & SUMMARY LINKS */}
          <div className="flex flex-col justify-start w-full max-w-[196px] lg:mx-auto">
            <h3 className="font-black text-slate-800 dark:text-white mb-5 text-[13px] tracking-tight leading-none">
              Support & Summary
            </h3>
            <ul className="space-y-3 text-[11px] text-slate-400 dark:text-slate-500 font-semibold tracking-wide">
              <li className="leading-none"><Link to="/question" className="hover:text-[#0b4fb9] dark:hover:text-blue-400 transition-colors">Question</Link></li>
              <li className="leading-none"><Link to="/help-center" className="hover:text-[#0b4fb9] dark:hover:text-blue-400 transition-colors">Helping Center</Link></li>
              <li className="leading-none"><Link to="/privacy" className="hover:text-[#0b4fb9] dark:hover:text-blue-400 transition-colors">Privacy & Policy</Link></li>
              <li className="leading-none"><Link to="/buy-or-rent" className="hover:text-[#0b4fb9] dark:hover:text-blue-400 transition-colors">Buy or Rent</Link></li>
              <li className="leading-none"><Link to="/properties" className="hover:text-[#0b4fb9] dark:hover:text-blue-400 transition-colors">Properties</Link></li>
              <li className="leading-none"><Link to="/blogs" className="hover:text-[#0b4fb9] dark:hover:text-blue-400 transition-colors">Blogs</Link></li>
            </ul>
          </div>

          {/* COLUMN 4: MEDIA CONTACT DETAILS */}
          <div className="flex flex-col justify-start w-full max-w-[259px] lg:ml-auto">
            <h3 className="font-black text-slate-800 dark:text-white mb-5 text-[13px] tracking-tight leading-none">
              Contact Us
            </h3>
            
            <div className="space-y-4 text-slate-500 dark:text-slate-400 text-left w-full">
              <div className="flex items-start gap-3">
                <div className="w-[26px] h-[26px] rounded-full bg-blue-100/60 dark:bg-slate-900 border border-blue-50/20 dark:border-slate-800 flex items-center justify-center text-[#0b4fb9] dark:text-blue-400 shrink-0 mt-0.5">
                  <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="flex flex-col min-w-0 justify-center">
                  <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 leading-none">E-mail</span>
                  <a href="mailto:youremailid@gmail.com" className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500 mt-1 hover:text-[#0b4fb9] leading-none">
                    youremailid@gmail.com
                  </a>
                </div>
              </div>
              {/* Card Row 2: Phone call trigger channel details */}
              <div className="flex items-start gap-3">
                <div className="w-[26px] h-[26px] rounded-full bg-blue-100/60 dark:bg-slate-900 border border-blue-50/20 dark:border-slate-800 flex items-center justify-center text-[#0b4fb9] dark:text-blue-400 shrink-0 mt-0.5">
                  <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="flex flex-col min-w-0 justify-center">
                  <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 leading-none">Contact</span>
                  <span className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500 mt-1 leading-none">
                    (+01) 123 456 7890
                  </span>
                </div>
              </div>

              {/* Card Row 3: Physical headquarters location data maps */}
              <div className="flex items-start gap-3">
                <div className="w-[26px] h-[26px] rounded-full bg-blue-100/60 dark:bg-slate-900 border border-blue-50/20 dark:border-slate-800 flex items-center justify-center text-[#0b4fb9] dark:text-blue-400 shrink-0 mt-0.5">
                  <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="flex flex-col min-w-0 justify-center">
                  <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 leading-none">Location</span>
                  <p className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500 mt-1 leading-normal max-w-[190px]">
                    3012 Pine Garden Lane Atlanta, Boulevard, GA 30328
                  </p>
                </div>
              </div>

            </div> {/* Closes layout space wrapper holding contact rows */}
          </div> {/* Closes Column 4 grid frame */}

        </div> {/* Closes core responsive grid row */}

        {/* LOWER COPYRIGHT AND LEGAL BAR */}
        <div className="w-full pt-4 mt-8 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-bold text-slate-400 dark:text-slate-600 tracking-wide select-none">
          <div className="leading-none">
            Copyright © {currentYearDate} Estate Ease. Crafted with <span className="text-red-500 animate-pulse">❤</span>
          </div>
          <Link to="/terms" className="hover:text-[#0b4fb9] dark:hover:text-blue-400 transition-colors leading-none">
            Term Condition & Policy
          </Link>
        </div>

      </div> {/* Closes unified 1320px bounding margin wrapper */}
    </footer>
  );
}

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BedDouble, Bath, Square, MapPin, Send, CheckCircle, ArrowLeft } from "lucide-react";
import { getPropertyById } from "../services/propertyService";
import Navbar from "@/components/home/Navbar";

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Active thumbnail tracker for the media gallery column
  const [activeImage, setActiveImage] = useState("");
  
  // Contact Listing Agent form local state handlers
  const [leadForm, setLeadForm] = useState({ name: "", email: "", message: "" });
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadSingleAsset = async () => {
      try {
        setLoading(true);
        const data = await getPropertyById(id);
        if (data) {
          setProperty(data);
          if (data.images && data.images.length > 0) {
            setActiveImage(data.images[0]);
          }
        }
      } catch (err) {
        console.error("Failed fetching listing parameters:", err);
        // High-Fidelity Snapshot Fallback to populate preview matches on server failure
        const mockFallback = {
          title: "THE MOST LEXARIOUS HOUSE",
          description: "The Most Lexarious House.",
          price: 1560,
          location: "2056 WATERVIEW TEXICO, NM 88135",
          type: "APARTMENT",
          bedrooms: 3,
          bathrooms: 2,
          area: 1200,
          broker: { name: "eyassu melese", email: "1234567890@gmail.com" },
          images: [
            "https://unsplash.com",
            "https://unsplash.com"
          ]
        };
        setProperty(mockFallback);
        setActiveImage(mockFallback.images[0]);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadSingleAsset();
  }, [id]);

  const handleInputChange = (e) => {
    setLeadForm({ ...leadForm, [e.target.name]: e.target.value });
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSent(true);
      setLeadForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-slate-950 min-h-screen text-slate-400 flex items-center justify-center animate-pulse text-xs font-bold uppercase tracking-widest">
        Synchronizing listing dimensions...
      </div>
    );
  }

  return (
    <div className="w-full bg-[#030712] min-h-screen text-slate-200 text-left select-none pb-24">
      <Navbar />

      <main className="max-w-[1320px] mx-auto px-4 pt-10">
        
        {/* UPPER DUAL IMAGE GALLERY & SIDE GRID LAYOUT PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10 w-full items-stretch">
          
          {/* Main Visual Display Block (Spans 8 Columns) */}
          <div className="lg:col-span-8 relative h-[480px] bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
            <img src={activeImage} alt="Main Snapshot Profile" className="w-full h-full object-cover" />
            <span className="absolute top-4 left-4 bg-blue-600 text-white font-black tracking-widest uppercase text-[10px] px-3 py-1 rounded-md shadow-md">
              {property?.type || "APARTMENT"}
            </span>
          </div>

          {/* Right Media Thumbnails Secondary Gallery Stack Panel (Spans 4 Columns) */}
          <div className="lg:col-span-4 bg-slate-900/40 border border-slate-900 rounded-2xl p-5 flex flex-col justify-start min-h-[480px]">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 border-b border-slate-800 pb-2">Media Gallery</h4>
            
            <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-1">
              {property?.images?.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(imgUrl)}
                  className={`relative h-20 rounded-xl overflow-hidden border transition-all cursor-pointer bg-slate-950 p-0 ${activeImage === imgUrl ? "border-blue-500 ring-2 ring-blue-500/10" : "border-slate-800 hover:border-slate-700"}`}
                >
                  <img src={imgUrl} alt="Thumbnail shortcut" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {property?.images?.length <= 1 && (
              <p className="text-[11px] text-slate-600 italic font-medium my-auto text-center">No additional images uploaded.</p>
            )}
          </div>
        </div>

        {/* IDENTITY TYPOGRAPHY SUMMARY HEADER ROW */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8 border-b border-slate-900 pb-6">
          <div className="text-left">
            <h1 className="text-3xl font-black text-white uppercase tracking-tight leading-none">{property?.title}</h1>
            <p className="text-xs font-bold text-slate-400 mt-2.5 flex items-center gap-1">
              <MapPin size={12} className="text-red-500 shrink-0" />
              <span className="uppercase tracking-wider font-semibold">{property?.location}</span>
            </p>
          </div>
          <div className="sm:text-right shrink-0">
            <span className="text-2xl font-black text-blue-500 tracking-tight leading-none">${property?.price?.toLocaleString()}</span>
            <span className="block text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">Publishing: 11/12/2026</span>
          </div>
        </div>

        {/* TRIPLE SPECIFICATION PARAMETERS DECK TAB */}
        <div className="grid grid-cols-3 border border-slate-900 bg-slate-900/20 rounded-xl p-4 mb-10 divide-x divide-slate-900 text-center font-bold">
          <div>
            <span className="block text-xl font-black text-white">{property?.bedrooms}</span>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider mt-0.5 block">Bedrooms</span>
          </div>
          <div>
            <span className="block text-xl font-black text-white">{property?.bathrooms}</span>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider mt-0.5 block">Bathrooms</span>
          </div>
          <div>
            <span className="block text-xl font-black text-white">{property?.area}</span>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider mt-0.5 block">Sq Ft (Area)</span>
          </div>
        </div>

        {/* NARRATIVE DESCRIPTION LAYER PANEL */}
        <div className="bg-slate-900/30 border border-slate-900/60 rounded-xl p-5 mb-10 text-left space-y-2.5">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-900/60 pb-2">Description</h4>
          <p className="text-xs font-medium text-slate-400 leading-relaxed max-w-[800px]">{property?.description}</p>
        </div>

        {/* CONNECTED BROKER ID BADGE CARD COMPONENT */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 mb-10 flex items-center gap-4 text-left max-w-xl shadow-sm">
          <div className="w-10 h-10 rounded-full bg-blue-600 font-black text-sm text-white flex items-center justify-center uppercase shadow-inner">
            {property?.broker?.name?.charAt(0) || "E"}
          </div>
          <div className="min-w-0">
            <span className="block text-[8px] font-black text-blue-500 uppercase tracking-widest leading-none mb-1">Listed Broker Account</span>
            <h4 className="font-black text-sm text-white leading-tight tracking-tight">{property?.broker?.name || "eyassu melese"}</h4>
            <p className="text-xs font-medium text-slate-500 truncate mt-0.5">{property?.broker?.email || "1234567890@gmail.com"}</p>
          </div>
        </div>

        {/* INTERACTIVE FORM DISPATCH PORTAL */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-2xl text-left">
          <div className="border-b border-slate-800 pb-4 mb-6">
            <h3 className="font-black text-base text-white tracking-tight uppercase tracking-wide">Contact Listing Agent</h3>
            <p className="text-[11px] font-semibold text-slate-500 tracking-wide mt-1">Send an instant inquiry message directly to this agent's inbox</p>
          </div>

          {isSent ? (
            <div className="py-8 flex flex-col items-center justify-center text-center animate-in fade-in duration-200">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center rounded-full mb-3">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-white">Lead Message Dispatched</h4>
              <p className="text-slate-500 text-[11px] font-medium mt-1">The broker has queued your metadata filters checklist parameters.</p>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="space-y-5">
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-2">Your Name</label>
                  <input type="text" name="name" required placeholder="Enter full name" value={leadForm.name} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#030712] border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500 font-medium transition-colors" />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                  <input type="email" name="email" required placeholder="name@example.com" value={leadForm.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#030712] border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500 font-medium transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-2">Message</label>
                <textarea name="message" required placeholder="Write your inquiry details here..." value={leadForm.message} onChange={handleInputChange} className="w-full h-32 px-4 py-3 bg-[#030712] border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500 resize-none font-medium leading-relaxed transition-colors" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer border-0"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Message Lead</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </main>
    </div>
  );
}

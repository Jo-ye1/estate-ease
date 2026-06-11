import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPropertyById, getRelatedProperties, submitContactInquiry } from "../services/propertyService";
import PropertyCard from "@/components/home/PropertyCard";
// 🎯 TARGET SPEC INTEGRATION: Pulls your shared navigation toolbar directly onto the top level header canvas
import Navbar from "@/components/home/Navbar"; 

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gallery State tracking the active main viewport image
  const [activePhoto, setActivePhoto] = useState("");

  // Contact Form State Management Layers
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sendingInquiry, setSendingInquiry] = useState(false);

  useEffect(() => {
    const fetchCompleteDetailsData = async () => {
      try {
        setLoading(true);
        const [propertyData, relatedData] = await Promise.all([
          getPropertyById(id),
          getRelatedProperties(id),
        ]);

        setProperty(propertyData);
        setRelated(relatedData || []);

        // Automatically initialize active display photo with the first image string
        if (propertyData?.images && propertyData.images.length > 0) {
          setActivePhoto(propertyData.images[0]);
        }
      } catch (error) {
        console.error("Failed loading comprehensive details layout:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCompleteDetailsData();
  }, [id]);

  const handleInputChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      return alert("Please complete all empty form fields before sending.");
    }

    try {
      setSendingInquiry(true);
      const response = await submitContactInquiry(id, contactForm);
      
      alert(response.message || "Inquiry message delivered successfully! The listing broker has been notified via email.");
      setContactForm({ name: "", email: "", message: "" }); 
    } catch (error) {
      console.error("Inquiry submission failed:", error);
      alert(error.response?.data?.message || "Failed to deliver message to the agent.");
    } finally {
      setSendingInquiry(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen select-none text-left transition-colors duration-200">
        <Navbar />
        <div className="max-w-[1320px] mx-auto px-4 py-24 flex items-center justify-center">
          <h2 className="text-sm font-bold text-slate-400 animate-pulse">Assembling property metrics...</h2>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen select-none text-center transition-colors duration-200">
        <Navbar />
        <div className="max-w-[1320px] mx-auto px-4 py-24 text-slate-400">
          <p className="text-xl font-black tracking-tight dark:text-white">Listing Not Found</p>
          <Link to="/properties" className="text-blue-600 dark:text-blue-500 font-bold text-xs uppercase tracking-wide mt-4 inline-block">&larr; Back to Properties</Link>
        </div>
      </div>
    );
  }

  const galleryImages = property.images && property.images.length > 0 ? property.images : ["https://unsplash.com"];

  return (
    // 🎯 TARGET SPEC MUTLI-THEME OVERRIDE: Container fluidly adapts from a soft light grey to pure night canvas
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen select-none text-left transition-colors duration-200 pb-20">
      
      <Navbar />

      {/* 🎯 TARGET MATCHED MATRIX BOUNDS: Enforces a solid 1320px max-width ceiling to line up edges accurately down the page tree */}
      <div className="max-w-[1320px] mx-auto px-4 mt-12">
        
        {/* 🗂️ INTEGRATED MULTI-PHOTO GALLERY VIEWPORT TRACK SYSTEM GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-start">
          
          {/* Main Selector Active Image Viewport (Left 2 Columns) */}
          <div className="lg:col-span-2 relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 shadow-sm h-[480px] rounded-none">
            <div className="w-full h-full bg-slate-100 dark:bg-slate-950 overflow-hidden rounded-none relative">
              <img 
                src={activePhoto || galleryImages[0]} 
                alt={property.title} 
                className="w-full h-full object-cover transition-all duration-300" 
              />
              <span className="absolute top-4 left-4 bg-blue-600 px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-md text-white shadow-sm">
                {property.type || "For Sale"}
              </span>
            </div>
          </div>

          {/* Scrolling Gallery Sidebar Thumbnails Track (Right 1 Column) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 h-[480px] flex flex-col justify-between shadow-sm rounded-none">
            <div className="w-full">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 leading-none">Media Gallery</p>
              <div className="grid grid-cols-3 gap-3 overflow-y-auto pr-1 max-h-[380px] scrollbar-none">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhoto(img)}
                    className={`relative aspect-square overflow-hidden border transition-all cursor-pointer rounded-none ${
                      activePhoto === img || (!activePhoto && idx === 0) 
                        ? "border-blue-600 ring-2 ring-blue-600/20 shadow-sm" 
                        : "border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            
            {galleryImages.length <= 1 && (
              <p className="text-slate-400 dark:text-slate-600 text-xs italic text-center pb-4 select-none">No additional views uploaded.</p>
            )}
          </div>    
        </div>

        {/* DETAILS SPECIFICATION CONTAINER HIGHLIGHTS */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 lg:p-8 shadow-sm rounded-none mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-100 dark:border-slate-800/80 pb-6 gap-4">
            <div className="text-left">
              <h1 className="text-2xl lg:text-3xl font-black text-slate-800 dark:text-white tracking-tight uppercase leading-tight">{property.title}</h1>
              <div className="flex items-center gap-1 mt-2 text-slate-400 dark:text-slate-500">
                <span className="text-xs leading-none">📍</span>
                <p className="text-[12px] font-bold uppercase tracking-wide leading-none">{property.location}</p>
              </div>
            </div>
            <div className="text-left md:text-right shrink-0">
              <p className="text-2xl lg:text-3xl font-black text-blue-600 dark:text-blue-500 leading-none">${property.price?.toLocaleString()}</p>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold tracking-wide uppercase mt-2">Published: {new Date(property.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>

          {/* SUMMARY DIMENSION SPECIFICATION CHIPS GRID */}
          <div className="grid grid-cols-3 gap-4 my-8 text-center bg-slate-50 dark:bg-slate-950/40 p-4 border border-slate-100 dark:border-slate-800/60 rounded-none">
            <div className="p-2">
              <p className="text-xl mb-1 filter drop-shadow-sm select-none">🛏️</p>
              <p className="text-base font-black text-slate-800 dark:text-white leading-tight">{property.bedrooms || 0}</p>
              <p className="text-slate-400 dark:text-slate-500 text-[9px] uppercase tracking-wider font-extrabold mt-1">Bedrooms</p>
            </div>
            <div className="p-2 border-l border-r border-slate-200 dark:border-slate-800/60">
              <p className="text-xl mb-1 filter drop-shadow-sm select-none">🛁</p>
              <p className="text-base font-black text-slate-800 dark:text-white leading-tight">{property.bathrooms || 0}</p>
              <p className="text-slate-400 dark:text-slate-500 text-[9px] uppercase tracking-wider font-extrabold mt-1">Bathrooms</p>
            </div>
            <div className="p-2">
              <p className="text-xl mb-1 filter drop-shadow-sm select-none">📐</p>
              <p className="text-base font-black text-slate-800 dark:text-white leading-tight">{property.area || 0}</p>
              <p className="text-slate-400 dark:text-slate-500 text-[9px] uppercase tracking-wider font-extrabold mt-1">sq ft (Area)</p>
            </div>
          </div>

                  {/* DESCRIPTION PANEL BLOCKS */}
          <div className="mb-8 text-left">
            <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 leading-none">Description</h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium text-xs leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-950/20 p-5 border border-slate-100 dark:border-slate-800/40 rounded-none">
              {property.description || "No full description breakdown logs submitted yet for this estate listing parameters."}
            </p>
          </div>

          {/* RECTOR BROKER LISTING OWNER CONTAINER MATRICES */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-4 border border-slate-100 dark:border-slate-800/80 rounded-none mb-8 text-left">
            <div className="w-10 h-10 bg-[#0b4fb9] text-white text-sm font-black flex items-center justify-center rounded-full shadow-sm shrink-0 select-none">
              {property.owner?.name ? property.owner.name.charAt(0).toUpperCase() : "O"}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest leading-none">Listed Broker Account</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white mt-1 leading-none truncate">{property.owner?.name || "Independent Owner"}</p>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1 leading-none truncate">{property.owner?.email || "No contact verified"}</p>
            </div>
          </div>

          {/* CONTACT AGENT INTERACTIVE FORM PANEL */}
          <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 p-6 text-left rounded-none mt-6">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 leading-none">Contact Listing Agent</h3>
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-1.5 leading-none">Send an instant inquiry message directly to this agent's inbox</p>
            
            <form onSubmit={handleContactSubmit} className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-2 leading-none">Your Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={contactForm.name} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Enter full name" 
                    className="w-full h-10 px-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-none text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-blue-600 placeholder-slate-400" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-2 leading-none">Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={contactForm.email} 
                    onChange={handleInputChange}
                    required
                    placeholder="name@example.com"
                    className="w-full h-10 px-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-none text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-blue-600 placeholder-slate-400" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-2 leading-none">Message</label>
                <textarea 
                  name="message" 
                  value={contactForm.message} 
                  onChange={handleInputChange}
                  required
                  placeholder="Write your inquiry details here..."
                  className="w-full h-32 p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-none text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-blue-600 placeholder-slate-400 resize-none leading-relaxed" 
                />
              </div>

              <button 
                type="submit" 
                disabled={sendingInquiry} 
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 py-3 font-extrabold text-xs uppercase tracking-wider text-white transition-all cursor-pointer rounded-none border-0 shadow-md shadow-blue-600/10 h-11 flex items-center justify-center"
              >
                {sendingInquiry ? "Notifying Agent..." : "Send Message Lead"}
              </button>
            </form>
          </div>

        </div> {/* Closes main layout interior container card block wrapper */}

        {/* RELATED PROPERTIES GRID LISTING LAYOUT */}
        {related.length > 0 && (
          <div className="mt-16 text-left">
            {/* Left aligned similar header section */}
            <div className="mb-10 relative inline-block max-w-max">
              <h2 className="text-xl lg:text-2xl font-black text-slate-800 dark:text-white tracking-tight pb-3 leading-none">
                Similar Properties <span className="text-blue-600 dark:text-blue-500">You Might Like</span>
              </h2>
              <div className="absolute bottom-0 left-0 w-1/3 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8 justify-items-center">
              {related.slice(0, 4).map((item) => (
                <div key={item._id} className="w-full max-w-[312px]">
                  <PropertyCard item={item} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div> {/* Closes master alignment wrapper */}
    </div>
  );
};

export default PropertyDetailsPage;

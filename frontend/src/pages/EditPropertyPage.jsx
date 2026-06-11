import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit3, FileText, UploadCloud, ChevronLeft, Save } from "lucide-react"; // 🎯 MODERNIZED: Swapped text emojis for premium vectors
import { getPropertyById, updateProperty, uploadPropertyImage } from "../services/propertyService";
import Navbar from "@/components/home/Navbar"; // 🎯 MODULAR: Integrated core shell header

const EditPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Stored Image Reference States
  const [existingImage, setExistingImage] = useState(""); 
  const [newImageFile, setNewImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(""); // 📷 Handles instant local preview generation for new uploads
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    type: "House",
    status: "For Sale", // Ensure listing status tracking remains consistent
    bedrooms: "",
    bathrooms: "",
    area: "",
  });

  useEffect(() => {
    const loadPropertyData = async () => {
      try {
        setLoading(true);
        const data = await getPropertyById(id);
        
        setFormData({
          title: data.title || "",
          description: data.description || "",
          price: data.price || "",
          location: data.location || "",
          type: data.type || "House",
          status: data.status || "For Sale",
          bedrooms: data.bedrooms || "",
          bathrooms: data.bathrooms || "",
          area: data.area || "",
        });

        if (data.images && data.images.length > 0) {
          setExistingImage(data.images[0]);
        }
      } catch (error) {
        console.error("Failed to fetch property details:", error);
        alert("Could not load the requested property details.");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadPropertyData();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ⚡ UPDATED: Captures new binary image picks and handles local URL previews seamlessly
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setNewImageFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🛡️ Strict Validation Safeguards for Editing
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      return alert("Text fields cannot be empty or contain only blank spaces.");
    }
    if (Number(formData.price) <= 0) {
      return alert("Validation Failure: Price must be a positive number greater than 0.");
    }
    if (Number(formData.bedrooms) < 0 || Number(formData.bathrooms) < 0) {
      return alert("Validation Failure: Room counts cannot be negative numbers.");
    }
    if (!formData.area || Number(formData.area) <= 0) {
      return alert("Validation Failure: Area measurement must be greater than 0 sq ft.");
    }

    try {
      setSubmitting(true);

      const updatedPayload = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
      };

      // STEP 1: Push structural updates text modifications to MongoDB database routing paths
      await updateProperty(id, updatedPayload);

      // STEP 2: ➕ IMAGE UPDATE INTEGRATION: If a fresh file is chosen, dispatch a secondary multipart binary request stream
      if (newImageFile) {
        await uploadPropertyImage(id, newImageFile);
      }

      alert("Property updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Update process encountered an issue:", error);
      alert(error.response?.data?.message || "Failed to update property listing.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-200 flex flex-col select-none">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-32 text-center">
          <div className="text-xs font-bold text-slate-400 dark:text-slate-600 animate-pulse uppercase tracking-widest">
            Loading listing parameters...
          </div>
        </div>
      </div>
    );
  }

  return (
    // 🎯 TARGET SPEC MULTI-THEME OVERRIDE CANVAS
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen select-none text-left transition-colors duration-200 pb-24 flex flex-col">
      
      <Navbar />

      {/* 🎯 MAIN CANVASES FRAMEWORK ENVELOPE: Locked precisely to your global 1320px constraints */}
      <section className="max-w-[1320px] mx-auto w-full px-4 pt-12 flex-1 flex flex-col justify-start">
        
        {/* LEFT FLUSH HEADER COMPONENT ROW WITH ACCENT LINE */}
        <div className="mb-10 relative inline-block max-w-max">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full mb-3 block w-max">
            Modification Suite
          </span>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-white tracking-tight pb-3">
            Edit Property <span className="text-blue-600 dark:text-blue-500">Listing</span>
          </h1>
          <div className="absolute bottom-0 left-0 w-1/4 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full" />
        </div>

        {/* COMPOSITE TWIN-COLUMN MANAGEMENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          
          {/* Main Core Editing Inputs form Column Panel */}
          <div className="lg:col-span-8 w-full">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 lg:p-8 rounded-2xl shadow-sm text-left"
            >
              {/* Cover Display Preview Frame System */}
              {/* 🎯 ADAPTIVE PREVIEW SYSTEM: Renders the fresh file update first, falling back to database source references if left unchanged */}
              {(previewUrl || existingImage) && (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 h-64 bg-slate-100 dark:bg-slate-950 shadow-inner">
                  <img 
                    src={previewUrl || existingImage} 
                    alt="Active Property Asset Display View" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 border border-slate-700 backdrop-blur-sm text-xs text-slate-200 px-3 py-1 rounded-md">
                    {previewUrl ? "New Cover Selection Preview" : "Current Active Image Display"}
                  </div>
                </div>
              )}

              {/* Title Input Row */}
              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Property Listing Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                />
              </div>

              {/* Description Textarea Input Row */}
              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Detailed Narrative Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  required
                  onChange={handleChange}
                  className="w-full h-36 px-4 py-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all resize-none leading-relaxed"
                />
              </div>

              {/* Price and Location Responsive Split Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Target Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    required
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                  />
                </div>
                                <div>
                  <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Physical Location / Address</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    required
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              {/* Type and Listing Status dropdowns configuration row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Property Core Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-700 dark:text-slate-200 font-bold outline-none focus:border-blue-500 cursor-pointer transition-colors"
                  >
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Warehouse">Warehouse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Listing Status</label>
                  <select
                    name="status"
                    value={formData.status || "For Sale"}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-700 dark:text-slate-200 font-bold outline-none focus:border-blue-500 cursor-pointer transition-colors"
                  >
                    <option value="For Sale">For Sale</option>
                    <option value="For Rent">For Rent</option>
                  </select>
                </div>
              </div>

              {/* 🎯 ADDED IMAGE MODIFIER SLOT: Allows updating the background listing file image on the backend */}
              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Update Cover Asset Image (Optional)</label>
                <div className="relative w-full border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100/50 dark:hover:bg-slate-900/40 transition-all rounded-xl p-5 flex items-center justify-center gap-3 cursor-pointer">
                  <UploadCloud className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Choose New Binary Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
              </div>

              {/* Physical specifications amenity triple grid rows */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    required
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    required
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Area (sq ft)</label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    required
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              {/* Action buttons footer section layout trigger */}
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="w-1/3 h-11 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 font-extrabold text-[11px] uppercase tracking-wider rounded-xl bg-white dark:bg-slate-800 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-2/3 h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-600/10 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {submitting ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Save Modifications</span>
                      <Save className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* 📄 RIGHT COLUMN PANEL: SECURITY NOTES SIDEBAR */}
          <div className="lg:col-span-4 space-y-6 w-full text-left">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-white">Audit Security Notes</h3>
              </div>
              <ul className="space-y-3.5 text-slate-400 dark:text-slate-500 text-xs font-medium leading-relaxed list-none pl-0">
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 dark:text-blue-500 text-xs select-none mt-0.5">▪</span>
                  <span>Modifications to area parameters or listing prices re-triggers background filtering checks across index feeds.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 dark:text-blue-500 text-xs select-none mt-0.5">▪</span>
                  <span>Leaving the cover image slot blank preserves your existing verified background asset cover photo automatically.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default EditPropertyPage;

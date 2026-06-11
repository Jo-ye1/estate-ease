import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, FileText, LayoutGrid, PlusCircle } from "lucide-react"; // 🎯 MODERNIZED: Swapped text emojis for premium vectors
import { createProperty, uploadPropertyImage } from "../services/propertyService";
import Navbar from "@/components/home/Navbar"; // 🎯 MODULAR: Integrated core shell header

const AddPropertyPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(""); 

  // 📝 STATUS TRACKER INITIALIZED: Sets up state to switch between Sale and Rent options
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    type: "House", 
    status: "For Sale", 
    bedrooms: "",
    bathrooms: "",
    area: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]; 
      setImage(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🛡️ Strict Client-Side Field Validation Checks
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      return alert("Text inputs cannot contain only blank spacing elements.");
    }
    if (Number(formData.price) <= 0) {
      return alert("Validation Failure: Price parameters must be positive numbers greater than 0.");
    }
    if (Number(formData.bedrooms) < 0 || Number(formData.bathrooms) < 0) {
      return alert("Validation Failure: Physical amenity room counts cannot fall below zero.");
    }
    if (!formData.area || Number(formData.area) <= 0) {
      return alert("Validation Failure: Area measurement cannot be empty and must be greater than 0.");
    }
    if (!image) {
      return alert("Please select a property cover image before submitting.");
    }

    try {
      setLoading(true);

      const cleanDataForBackend = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
      };

      // STEP 1: Create text database listing entries inside MongoDB
      const createdProperty = await createProperty(cleanDataForBackend);
      console.log("Created Property Data Payload:", createdProperty);

      // STEP 2: Pass the raw binary image state directly to your helper function
      if (image && createdProperty && createdProperty._id) {
        const uploadResponse = await uploadPropertyImage(
          createdProperty._id,
          image 
        );
        console.log("Local Upload Response:", uploadResponse);
      }

      alert("Property created successfully!");

      setTimeout(() => {
        navigate("/properties");
      }, 500);
    } catch (error) {
      console.error("Full Error Context Object:", error);
      const backendMessage = error?.response?.data?.message;
      const networkStatus = error?.response?.status;
      
      alert(
        `Error Status: ${networkStatus || "Network Failure"}\nReason: ${backendMessage || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // 🎯 TARGET SPEC MULTI-THEME OVERRIDE CANVAS
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen select-none text-left transition-colors duration-200 pb-24 flex flex-col">
      
      <Navbar />

      {/* 🎯 MAIN CANVASES FRAMEWORK ENVELOPE: Locked precisely to your global 1320px constraints */}
      <section className="max-w-[1320px] mx-auto w-full px-4 pt-12 flex-1 flex flex-col justify-start">
        
        {/* LEFT FLUSH HEADER COMPONENT ROW WITH ACCENT LINE */}
        <div className="mb-10 relative inline-block max-w-max">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full mb-3 block w-max">
            Creator Wizard
          </span>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-white tracking-tight pb-3">
            Add New <span className="text-blue-600 dark:text-blue-500">Property</span> Listing
          </h1>
          <div className="absolute bottom-0 left-0 w-1/4 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full" />
        </div>

        {/* COMPOSITE INTERACTION FORM CARD GRID DECK PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          
          {/* Main Form Entry Column Panel */}
          <div className="lg:col-span-8 w-full">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 lg:p-8 rounded-2xl shadow-sm text-left"
            >
              {/* 🛠️ Live Image Preview Window */}
              {previewUrl && (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 h-64 bg-slate-100 dark:bg-slate-950 shadow-inner">
                  <img 
                    src={previewUrl} 
                    alt="Selected Asset Snapshot Preview" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 border border-slate-700 backdrop-blur-sm text-xs text-slate-200 px-3 py-1 rounded-md">
                    Selected Cover File Preview
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
                  placeholder="e.g., Flint Hint Luxurious House"
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                />
              </div>

              {/* Description Input Row */}
              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Detailed Narrative Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  placeholder="Specify key architectural specifications, neighborhood advantages, and environment accessibility features..."
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
                    placeholder="Price Parameters"
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
                    placeholder="e.g., 2056 WaterView Texas, NM 88135"
                    required
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              {/* Dropdowns Configuration Split Row */}
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

              {/* Cover File Upload Input Slot */}
              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Property Cover Asset Image</label>
                <div className="relative w-full border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100/50 dark:hover:bg-slate-900/40 transition-all rounded-xl p-5 flex items-center justify-center gap-3 cursor-pointer">
                  <UploadCloud className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Choose Asset File Binary</span>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
              </div>

              {/* Amenity Specifications Triple Grid Input Row */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    placeholder="Count"
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
                    placeholder="Count"
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
                    placeholder="Size"
                    required
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              {/* Form Submission Action Dispatch Trigger */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-md shadow-blue-600/10 cursor-pointer flex items-center justify-center gap-2 h-11"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Index Property Asset</span>
                    <PlusCircle className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* 📄 RIGHT COLUMN PANEL: HELPFUL GUIDELINES INFO BOX */}
          <div className="lg:col-span-4 space-y-6 w-full text-left">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-white">Listing Guidelines</h3>
              </div>
              <ul className="space-y-3.5 text-slate-400 dark:text-slate-500 text-xs font-medium leading-relaxed list-none pl-0">
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 dark:text-blue-500 text-xs select-none mt-0.5">▪</span>
                  <span>Ensure your pricing values are correct; multi-million valuations should not contain comma markers in form entries.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 dark:text-blue-500 text-xs select-none mt-0.5">▪</span>
                  <span>Uploading high-resolution landscaping or facade image binaries drastically upgrades asset transaction matching ratios.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 dark:text-blue-500 text-xs select-none mt-0.5">▪</span>
                  <span>Double-check your city postal indexes on location address lines before submitting data records.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
};

export default AddPropertyPage;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, FileText, MapPin, Bed, Bath, Maximize, DollarSign, Calendar, Sliders, ChevronLeft } from "lucide-react";
import { createProperty, uploadPropertyImage } from "../services/propertyService";
import Navbar from "@/components/home/Navbar";

const AddPropertyPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [priceSuggestion, setPriceSuggestion] =
  useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    listingType: "sale",
    propertyCategory: "house",
    location: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    leaseDuration: "",
    availabilityStatus: "available",
    salePrice: "",
    monthlyRent: "",
    dailyRate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    const fetchPriceSuggestion =
  async (
    location,
    propertyCategory,
    bedrooms,
    listingType
  ) => {
    try {
      if (
        !location ||
        !propertyCategory ||
        !bedrooms ||
        !listingType
      ) {
        return;
      }

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/intelligence/price-suggestion",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            location,
            propertyCategory,
            bedrooms: Number(bedrooms),
            listingType,
          }),
        }
      );

      const data =
        await response.json();

      setPriceSuggestion(data);
    } catch (error) {
      console.error(
        "Price suggestion failed:",
        error
      );
    }
  };


    const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 🟢 Keep the file as a raw object (not wrapped in brackets)
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image first");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        listingType: formData.listingType,
        propertyCategory: formData.propertyCategory,
        location: formData.location.trim(),
        bedrooms: Number(formData.bedrooms || 0),
        bathrooms: Number(formData.bathrooms || 0),
        area: Number(formData.area || 0),
        leaseDuration: formData.leaseDuration || undefined,
        availabilityStatus: formData.availabilityStatus,
        pricing: {
          salePrice: formData.listingType === "sale" ? Number(formData.salePrice) : undefined,
          monthlyRent: formData.listingType === "rent" ? Number(formData.monthlyRent) : undefined,
          dailyRate: formData.listingType === "hotel" ? Number(formData.dailyRate) : undefined,
        },
      };

      const property = await createProperty(payload);

      if (!property?._id) {
        throw new Error("Property creation failed");
      }

      // 🟢 Pass the raw file straight to your service
      await uploadPropertyImage(property._id, image);

      alert("Property created successfully");
      navigate("/properties");
    } catch (error) {
      console.error("Add property error:", error);
      alert(error?.response?.data?.message || error?.message || "Failed creating property");
    } finally {
      setLoading(false);
    }
  };


useEffect(() => {
  fetchPriceSuggestion(
    formData.location,
    formData.propertyCategory,
    formData.bedrooms,
    formData.listingType
  );
}, [
  formData.location,
  formData.propertyCategory,
  formData.bedrooms,
  formData.listingType,
]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200 pb-20">
      <Navbar />

      <section className="max-w-4xl mx-auto px-4 pt-10">
        {/* Navigation / Header Title Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 text-left">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md mb-2 inline-block">
              Listing Creator
            </span>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Add New Property
            </h1>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
              Create and dispatch marketplace listings for sale, rent, or hotel stays into the stream database.
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs w-max cursor-pointer outline-none"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 📷 IMAGE BANNER UPLOAD ZONE */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-5 rounded-3xl shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-3 text-left">Media Assets</h3>
            {previewUrl ? (
              <div className="relative w-full h-[320px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-200/40 dark:border-slate-800/50 group">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <label className="px-4 py-2 bg-white text-slate-900 text-xs font-bold rounded-xl cursor-pointer shadow-md hover:bg-slate-100 transition-colors">
                    Change Photo
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Upload Cover Image</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-semibold">Supports PNG, JPG, or JPEG up to 50MB</span>
                <input type="file" accept="image/*" required onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          {/* 📝 PRIMARY TEXT DESCRIPTIONS GRID */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-3xl shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-2 text-left">Basic Details</h3>
            
            <div className="relative">
              <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                name="title"
                required
                placeholder="Property Title Heading"
                value={formData.title}
                onChange={handleChange}
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="relative">
              <textarea
                name="description"
                required
                rows={4}
                placeholder="Detailed listing description regarding features, highlights, surroundings, etc..."
                value={formData.description}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* 🛠️ TRANSACTION TYPES & DYNAMIC PRICE MATRIX */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-3xl shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-left">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5 ml-1">Listing Operation</label>
              <div className="relative">
                <Sliders className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  name="listingType"
                  value={formData.listingType}
                  onChange={handleChange}
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-xs font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer appearance-none"
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                  <option value="hotel">Hotel Stay</option>
                </select>
              </div>
            </div>

            <div className="text-left">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5 ml-1">Financial Parameters</label>

{priceSuggestion?.suggestedPrice && (
  <div className="mb-4 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/20">
    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">
      Smart Pricing Insight
    </p>

    <div className="space-y-1 text-xs font-bold">
      <p>
        Suggested Price:
        <span className="text-emerald-600 ml-2">
          $
          {priceSuggestion.suggestedPrice.toLocaleString()}
        </span>
      </p>

      <p>
        Market Average:
        <span className="ml-2">
          $
          {priceSuggestion.marketAverage?.toLocaleString()}
        </span>
      </p>

      <p>
        Competition:
        <span className="ml-2">
          {priceSuggestion.competitionCount}
        </span>
      </p>
    </div>
  </div>
)}

                            {formData.listingType === "sale" && (
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    name="salePrice"
                    type="number"
                    required
                    placeholder="Sale Price (USD)"
                    value={formData.salePrice}
                    onChange={handleChange}
                    className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              )}

              {formData.listingType === "rent" && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      name="monthlyRent"
                      type="number"
                      required
                      placeholder="Monthly Rent"
                      value={formData.monthlyRent}
                      onChange={handleChange}
                      className="w-full h-11 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      name="leaseDuration"
                      required
                      value={formData.leaseDuration}
                      onChange={handleChange}
                      className="w-full h-11 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-xs font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
                    >
                      <option value="">Lease Type</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>
              )}

              {formData.listingType === "hotel" && (
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    name="dailyRate"
                    type="number"
                    required
                    placeholder="Daily Rate Charge (USD)"
                    value={formData.dailyRate}
                    onChange={handleChange}
                    className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 🏷️ SCHEMA CATEGORIES & GEOLOCATION LAYERS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-3xl shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-left">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5 ml-1">Asset Architecture</label>
              <select
                name="propertyCategory"
                value={formData.propertyCategory}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-xs font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="hotel">Hotel Block</option>
                <option value="office">Office Space</option>
                <option value="land">Commercial Land</option>
              </select>
            </div>

            <div className="text-left">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5 ml-1">Physical Address</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="location"
                  required
                  placeholder="Location / Address"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* 📐 STRUCTURAL SPECIFICATIONS PANEL MATRIX */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-3xl shadow-xs text-left">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-4">Structural Specifications</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="relative">
                <Bed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="bedrooms"
                  type="number"
                  required
                  min="0"
                  placeholder="Bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="relative">
                <Bath className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="bathrooms"
                  type="number"
                  required
                  min="0"
                  placeholder="Bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="relative">
                <Maximize className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="area"
                  type="number"
                  required
                  min="1"
                  placeholder="Area (Sq. Ft.)"
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5 ml-1">Asset Availability Status</label>
              <select
                name="availabilityStatus"
                value={formData.availabilityStatus}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-xs font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>

          {/* 🏁 SUBMISSION DISPATCH BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/40 text-white font-extrabold uppercase text-xs tracking-wider rounded-xl transition-all shadow-md border-0 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Listing Record...</span>
              </>
            ) : (
              <span>Create Property Listing</span>
            )}
          </button>
        </form>
      </section>
    </div>
  );
};

export default AddPropertyPage;

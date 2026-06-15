import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UploadCloud, ChevronLeft, Save, FileText, MapPin, Bed, Bath, Maximize, DollarSign, Calendar, Sliders } from "lucide-react";
import {
  getPropertyById,
  updateProperty,
  uploadPropertyImage,
} from "../services/propertyService";
import Navbar from "@/components/home/Navbar";

const EditPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [existingImage, setExistingImage] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    listingType: "sale",
    propertyCategory: "house",
    location: "",
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    leaseDuration: "",
    availabilityStatus: "available",
    salePrice: "",
    monthlyRent: "",
    dailyRate: "",
  });

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const property = await getPropertyById(id);

        setFormData({
          title: property?.title || "",
          description: property?.description || "",
          listingType: property?.listingType || "sale",
          propertyCategory: property?.propertyCategory || "house",
          location: property?.location || "",
          bedrooms: property?.bedrooms || 0,
          bathrooms: property?.bathrooms || 0,
          area: property?.area || 0,
          leaseDuration: property?.leaseDuration || "",
          availabilityStatus: property?.availabilityStatus || "available",
          salePrice: property?.pricing?.salePrice || "",
          monthlyRent: property?.pricing?.monthlyRent || "",
          dailyRate: property?.pricing?.dailyRate || "",
        });

        if (property?.images?.length > 0) {
          const img = property.images[0];
          setExistingImage(
            img.startsWith("http")
              ? img
              : `http://localhost:5000${img}`
          );
        }
      } catch (error) {
        alert(
          error?.response?.data?.message ||
            "Failed to load property"
        );
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const payload = {
        title: formData.title,
        description: formData.description,
        listingType: formData.listingType,
        propertyCategory: formData.propertyCategory,
        location: formData.location,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
        leaseDuration:
          formData.listingType === "rent"
            ? formData.leaseDuration
            : undefined,
        availabilityStatus: formData.availabilityStatus,
        pricing: {
          salePrice:
            formData.listingType === "sale"
              ? Number(formData.salePrice)
              : undefined,
          monthlyRent:
            formData.listingType === "rent"
              ? Number(formData.monthlyRent)
              : undefined,
          dailyRate:
            formData.listingType === "hotel"
              ? Number(formData.dailyRate)
              : undefined,
        },
      };

      await updateProperty(id, payload);

      if (newImageFile) {
        await uploadPropertyImage(id, newImageFile);
      }

      alert("Property updated successfully");
      navigate("/dashboard");
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Failed updating property"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh] text-slate-700 dark:text-white">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200 pb-20">
      <Navbar />

      <section className="max-w-4xl mx-auto px-4 pt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 text-left">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md mb-2 inline-block">
              Listing Editor
            </span>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Edit Property
            </h1>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
              Modify and save changes for your active marketplace listing document records.
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
          
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-5 rounded-3xl shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-3 text-left">Media Assets</h3>
            {(previewUrl || existingImage) ? (
              <div className="relative w-full h-[320px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-200/40 dark:border-slate-800/50 group">
                <img src={previewUrl || existingImage} alt="Preview" className="w-full h-full object-cover" />
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
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

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
                placeholder="Detailed listing description..."
                value={formData.description}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
              />
            </div>
          </div>

                   <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-3xl shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-left">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5 ml-1">Listing Operation</label>
              <div className="relative">
                <Sliders className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  name="listingType"
                  value={formData.listingType}
                  onChange={handleChange}
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-xs font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                  <option value="hotel">Hotel Stay</option>
                </select>
              </div>
            </div>

            <div className="text-left">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5 ml-1">Financial Parameters</label>
              
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

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex-1 h-12 border border-slate-200 dark:border-slate-800 rounded-xl font-extrabold uppercase text-xs tracking-wider flex justify-center items-center gap-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-xs cursor-pointer"
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/40 text-white font-extrabold uppercase text-xs tracking-wider rounded-xl transition-all shadow-md border-0 cursor-pointer flex items-center justify-center gap-2"
            >
              <Save size={16} />
              <span>{submitting ? "Saving changes..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default EditPropertyPage;

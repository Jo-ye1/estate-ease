import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyById, updateProperty } from "../services/propertyService";

const EditPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingImage, setExistingImage] = useState(""); 
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    type: "House",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🛡️ B7: Strict Validation Safeguards for Editing
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

      await updateProperty(id, updatedPayload);
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <h2 className="text-xl font-medium text-slate-400 animate-pulse">Loading listing details...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 min-h-screen bg-slate-950">
      <h1 className="text-4xl font-bold mb-8 text-white">Edit Property Listing</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl"
      >
        {/* B6: Stored Active Image Snapshot Preview Frame */}
        {existingImage && (
          <div className="relative rounded-xl overflow-hidden border border-slate-700 h-64 bg-slate-950 shadow-inner">
            <img 
              src={existingImage} 
              alt="Current Property Display" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute bottom-3 left-3 bg-blue-900/80 border border-blue-700 backdrop-blur-sm text-xs text-white px-3 py-1 rounded-md">
              Current Active Image Display
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            required
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-700 rounded-xl bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            required
            onChange={handleChange}
            className="w-full h-32 px-4 py-3 border border-slate-700 rounded-xl bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              required
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-700 rounded-xl bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              required
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-700 rounded-xl bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Property Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-700 rounded-xl bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Hotel">Hotel</option>
            <option value="Warehouse">Warehouse</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              required
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-700 rounded-xl bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              required
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-700 rounded-xl bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Area (sq ft)</label>
            <input
              type="number"
              name="area"
              value={formData.area}
              required
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-700 rounded-xl bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-1/3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="w-2/3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold py-3 rounded-xl transition-colors shadow-lg cursor-pointer"
          >
            {submitting ? "Saving changes..." : "Save Modifications"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPropertyPage;

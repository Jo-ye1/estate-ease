import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createProperty,
  uploadPropertyImage,
} from "../services/propertyService";

const AddPropertyPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    type: "House", // This matches the top option value explicitly
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
    setImage(e.target.files[0]);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      return alert("Please select a property cover image before submitting.");
    }

    try {
      setLoading(true);

      // 🛠️ FIX: Force strings into numbers matching your Mongoose schema rules precisely
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

      // STEP 2: Capture generated MongoDB Hex Identifier to dispatch multipart FormData to Cloudinary
      if (image && createdProperty && createdProperty._id) {
        const uploadResponse = await uploadPropertyImage(
          createdProperty._id,
          image
        );

        console.log("Cloudinary Upload Response:", uploadResponse);
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
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8 text-white">
        Add Property
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-slate-900 p-8 rounded-2xl border border-slate-800"
      >
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            placeholder="Title"
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
            placeholder="Description"
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
              placeholder="Price"
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
              placeholder="Location"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-700 rounded-xl bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
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

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Property Cover Image</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-dashed border-slate-700 rounded-xl text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              placeholder="Bedrooms"
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
              placeholder="Bathrooms"
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
              placeholder="Area"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-700 rounded-xl bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold py-3 rounded-xl transition-colors shadow-lg"
        >
          {loading ? "Publishing..." : "Submit Property"}
        </button>
      </form>
    </div>
  );
};

export default AddPropertyPage;

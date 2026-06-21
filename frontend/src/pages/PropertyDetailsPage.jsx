import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Heart,
  Edit,
  Trash2,
  MapPin,
  Send,
  MessageSquare,
  User,
  Mail,
  Layers,
  Bed,
  Bath,
  Square,
  Sparkles ,
  Home,
} from "lucide-react";

import {
  getPropertyById,
  deleteProperty,
  contactPropertyAgent,
  updatePropertyStatus,
} from "../services/propertyService";

import Navbar from "@/components/home/Navbar";
import { useFavorites } from "@/context/FavoritesContext";
import SubmitPropertyReviewCard from "@/pages/dashboard/SubmitPropertyReviewCard";


export default function PropertyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [relatedProperties, setRelatedProperties] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    const loadRelatedPortfolioData = async () => {
      if (!id) return;
      try {
        setLoadingRelated(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/properties/${id}/related`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dynamicArray = Array.isArray(res.data) ? res.data : (res.data?.properties || []);
        setRelatedProperties(dynamicArray.slice(0, 3));
      } catch (err) {
        console.error("Failed loading related portfolio recommendations:", err);
        setRelatedProperties([]);
      } finally {
        setLoadingRelated(false);
      }
    };
    loadRelatedPortfolioData();
  }, [id]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const loadProperty = async () => {
    try {
      const data = await getPropertyById(id);
      setProperty(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperty();
  }, [id]);

  const isOwner = user?._id === property?.owner?._id;

  const isFavorited = favorites.some(
    (fav) => fav._id === property?._id || fav.property?._id === property?._id
  );

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this property?"
      )
    ) {
      await deleteProperty(id);
      navigate("/dashboard");
    }
  };

  const handleStatusChange = async (status) => {
    await updatePropertyStatus(property._id, status);
    loadProperty();
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const res = await contactPropertyAgent(id, leadForm);

      setLeadForm({
        name: "",
        email: "",
        message: "",
      });

      if (res?.conversationId) {
        navigate(`/inbox?conversation=${res.conversationId}`);
      } else {
        navigate("/inbox");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="flex items-center justify-center py-40">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!property) return null;

  const displayImage =
    property.images?.length > 0
      ? property.images[0].startsWith("http")
        ? property.images[0]
        : `http://localhost:5000${property.images[0]}`
      : "/placeholder.jpg";

  const propertyPrice =
    property?.pricing?.salePrice ||
    property?.pricing?.monthlyRent ||
    property?.pricing?.dailyRate ||
    0;


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* HERO */}
        <div className="relative h-[500px] rounded-3xl overflow-hidden mb-8">
          <img
            src={displayImage}
            alt={property.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <button
            onClick={() => toggleFavorite(property._id)}
            className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorited ? "fill-red-500 text-red-500" : "text-slate-700"
              }`}
            />
          </button>

          <div className="absolute bottom-8 left-8 text-white">
            <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
              {property.propertyCategory}
            </span>

            <h1 className="text-4xl font-black mt-4">
              {property.title}
            </h1>

            <div className="flex items-center gap-2 mt-2 text-sm text-white/80">
              <MapPin size={15} />
              {property.location}
            </div>

            <p className="text-3xl font-black mt-4">
              ${propertyPrice.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* STATS */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl">
                <Bed className="mb-2" />
                <p>{property.bedrooms} Bedrooms</p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl">
                <Bath className="mb-2" />
                <p>{property.bathrooms} Bathrooms</p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl">
                <Square className="mb-2" />
                <p>{property.area} sqft</p>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl">
              <h2 className="text-xl font-black mb-4">
                Description
              </h2>

              <p className="text-slate-500 leading-relaxed">
                {property.description}
              </p>
            </div>
        {/* 🟢 PHASE 8 INTEGRATION: Buyer Feedback Module Section */}
        {/* Only allow logged-in Users/Buyers to submit reviews, avoiding self-reviews for owners */}
        {String(user?.role).toLowerCase() === "user" && property?.owner?._id !== user?._id && (
          <div className="max-w-7xl mx-auto px-4 mt-10 border-t border-slate-200 dark:border-slate-800/80 pt-10">
            <div className="flex flex-col gap-1">
              <span className="text-blue-500 font-bold text-[10px] uppercase tracking-widest">Client Trust Index</span>
              <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">Evaluate Transaction Quality</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">Share your closing feedback to refine agent scores and platform accountability records.</p>
            </div>
            
            <SubmitPropertyReviewCard 
              targetUserId={property?.assignedAgent || property?.owner?._id} // Routes score to the assigned agent or owner
              propertyId={property?._id}
              onReviewSuccess={() => {
                // Optional callback function trigger to refresh parent page indicators dynamically
                if (typeof fetchPropertyDetails === "function") fetchPropertyDetails();
              }}
            />
          </div>
        )}

 <section className="border-t border-slate-200 dark:border-slate-800/80 pt-10 mt-12 max-w-7xl mx-auto px-4">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={16} className="text-blue-500" />
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
          Recommended Similar Properties Nearby
        </h2>
      </div>

      {loadingRelated ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : relatedProperties.length === 0 ? (
        <div className="text-left py-6 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          No alternative listings tracked within this category parameters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedProperties.map((item) => {
            const displayPrice = item?.pricing?.salePrice || item?.pricing?.monthlyRent || item?.pricing?.dailyRate || item?.price || 0;
            const itemImage = item?.images?.[0] || item?.images;

            return (
              <div 
                key={item._id} 
                onClick={() => {
                  // Directs page focus straight to the selected asset node ID smoothly
                  navigate(`/properties/${item._id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="w-full h-40 bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center text-slate-400 border border-slate-200/50 dark:border-slate-800/50">
                    {itemImage ? (
                      <img 
                        src={itemImage.startsWith("http") ? itemImage : `http://localhost:5000${itemImage}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        alt="" 
                      />
                    ) : (
                      <Home size={22} />
                    )}
                  </div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-white mt-3 truncate group-hover:text-blue-500 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                    {item.location} • {item.propertyCategory}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/50 flex justify-between items-center">
                  <span className="text-xs font-black text-blue-500">${displayPrice} / {item.listingType === "sale" ? "total" : item.listingType === "rent" ? "mo" : "day"}</span>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-800/80 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    View Unit
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
</section>



            {/* OWNER PANEL */}
            {isOwner && (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl space-y-4">
                <h3 className="font-black text-lg">
                  Owner Controls
                </h3>

                <select
                  value={property.listingStatus}
                  onChange={(e) =>
                    handleStatusChange(e.target.value)
                  }
                  className="w-full border rounded-xl px-4 py-3"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                  <option value="sold">Sold</option>
                  <option value="closed">Closed</option>
                </select>

                <div className="flex gap-3">
                  <Link
                    to={`/edit-property/${property._id}`}
                    className="flex-1 bg-blue-600 text-white text-center py-3 rounded-xl font-bold"
                  >
                    Edit Property
                  </Link>

                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div>
            {!isOwner && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sticky top-24 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare />
                  <h3 className="font-black text-lg">
                    Contact Owner
                  </h3>
                </div>

                <form
                  onSubmit={handleLeadSubmit}
                  className="space-y-4"
                >
                  <input
                    required
                    value={leadForm.name}
                    onChange={(e) =>
                      setLeadForm({
                        ...leadForm,
                        name: e.target.value,
                      })
                    }
                    placeholder="Your name"
                    className="w-full border rounded-xl px-4 py-3"
                  />

                  <input
                    required
                    type="email"
                    value={leadForm.email}
                    onChange={(e) =>
                      setLeadForm({
                        ...leadForm,
                        email: e.target.value,
                      })
                    }
                    placeholder="Your email"
                    className="w-full border rounded-xl px-4 py-3"
                  />

                  <textarea
                    required
                    rows={5}
                    value={leadForm.message}
                    onChange={(e) =>
                      setLeadForm({
                        ...leadForm,
                        message: e.target.value,
                      })
                    }
                    placeholder="Write your message..."
                    className="w-full border rounded-xl px-4 py-3"
                  />

                  <button
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <Send size={15} />
                    {isSubmitting
                      ? "Sending..."
                      : "Start Conversation"}
                  </button>
                </form>
              </div>
            )}


            {isOwner && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 text-center">
                <Layers className="mx-auto mb-3" />
                <h3 className="font-black mb-2">
                  Owner Mode Active
                </h3>
                <p className="text-sm text-slate-500">
                  You cannot message yourself.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
} from "lucide-react";

import {
  getPropertyById,
  deleteProperty,
  contactPropertyAgent,
  updatePropertyStatus,
} from "../services/propertyService";

import Navbar from "@/components/home/Navbar";
import { useFavorites } from "@/context/FavoritesContext";

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
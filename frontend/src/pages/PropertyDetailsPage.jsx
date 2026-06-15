import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Heart, Edit, Trash2, MapPin, Send, MessageSquare, User, Mail, Calendar, DollarSign, Layers } from "lucide-react";

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
  const [isSent, setIsSent] = useState(false);

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
    if (window.confirm("Are you sure you want to permanently delete this property listing?")) {
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
      await contactPropertyAgent(id, leadForm);
      setLeadForm({ name: "", email: "", message: "" });
      setIsSent(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-40">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!property) return null;

  const displayImage = property.images?.length > 0
    ? property.images[0].startsWith("http")
      ? property.images[0]
      : `http://localhost:5000${property.images[0]}`
    : "https://unsplash.com";

  const propertyPrice =
    property?.pricing?.salePrice ||
    property?.pricing?.monthlyRent ||
    property?.pricing?.dailyRate ||
    property?.price ||
    0;

  const statusColors = {
    draft: "bg-yellow-500 text-white",
    published: "bg-green-600 text-white",
    archived: "bg-gray-500 text-white",
    sold: "bg-red-600 text-white",
    closed: "bg-black text-white",
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-200 transition-colors duration-200 pb-20">
      <Navbar />

      <main className="max-w-6xl mx-auto pt-8 px-4">
        {isOwner && (
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-4 rounded-2xl shadow-xs mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Management Options:</span>
              <select
                value={property.listingStatus || "draft"}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`border rounded-lg px-3 py-1.5 text-xs font-black uppercase tracking-wider cursor-pointer focus:outline-none ${statusColors[property.listingStatus] || "bg-white text-slate-700"}`}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
                <option value="sold">Sold</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="flex gap-3">
              <Link
                to={`/edit-property/${property._id}`}
                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all no-underline text-slate-700 dark:text-slate-300 shadow-xs"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </Link>

              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 rounded-xl border-0 cursor-pointer transition-all shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}

        <div className="relative w-full h-[460px] bg-slate-950 rounded-3xl overflow-hidden shadow-sm border border-slate-200/40 dark:border-slate-800/50">
          <img
            src={displayImage}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

          <button
            onClick={() => toggleFavorite(property._id)}
            className="absolute top-4 right-4 w-11 h-11 bg-white/80 hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-900 backdrop-blur-md rounded-full flex items-center justify-center transition-all border-0 shadow-sm cursor-pointer z-10 outline-none"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorited ? "fill-red-500 text-red-500" : "text-slate-700 dark:text-white"
              }`}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-xs">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md mb-2 inline-block">
                    {property.propertyCategory || "Property"}
                  </span>
                  <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-1.5 mt-2 text-slate-400 dark:text-slate-500 text-xs font-semibold">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span>{property.location}</span>
                  </div>
                </div>

                <div className="text-left lg:text-right shrink-0">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Listed Price</p>
                  <p className="text-3xl font-black text-blue-600 dark:text-blue-500 tracking-tight mt-0.5">
                    ${propertyPrice.toLocaleString()}
                  </p>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">
                    {property.listingType === "rent" ? "/ Month" : "/ Total"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-y border-slate-100 dark:border-slate-800 my-6 py-4 text-center">
                <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Bedrooms</p>
                  <p className="text-base font-black text-slate-800 dark:text-white mt-1">🛏️ {property.bedrooms || 0}</p>
                </div>
                <div className="border-x border-slate-100 dark:border-slate-800">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Bathrooms</p>
                  <p className="text-base font-black text-slate-800 dark:text-white mt-1">🛁 {property.bathrooms || 0}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Square Area</p>
                  <p className="text-base font-black text-slate-800 dark:text-white mt-1">📐 {property.area || 0} sqft</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white mb-3">About This Listing</h3>
                <p className="text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400 whitespace-pre-line bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-900">
                  {property.description || "No further descriptions provided for this property allocation asset."}
                </p>
              </div>
            </div>
          </div>

            <div className="lg:col-span-4 w-full">
            {!isOwner ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-xs space-y-4">
                <div className="flex items-center gap-2 mb-2 text-left">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Inquire Agent</h3>
                </div>
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 leading-normal">
                  Drop your coordinates and message parameters down below to directly stream a lead hook forward into the owner workspace board channel.
                </p>

                <form onSubmit={handleLeadSubmit} className="space-y-3.5 pt-2">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      name="name"
                      required
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      placeholder="Your Full Name"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      name="email"
                      type="email"
                      required
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      placeholder="Your Email Address"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div className="relative">
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={leadForm.message}
                      onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                      placeholder="Type your inquiry message details..."
                      className="w-full p-3 pt-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-extrabold uppercase text-xs tracking-wider rounded-xl transition-all shadow-xs border-0 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? "Submitting Inquiry..." : "Send Inquiry Link"}</span>
                  </button>

                  {isSent && (
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 text-xs font-bold rounded-xl text-center border border-green-100 dark:border-green-900/30">
                      ✨ Inquiry sent to owner successfully.
                    </div>
                  )}
                </form>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-xs space-y-4 text-center">
                <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Workspace View Mode</h3>
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 leading-normal">
                  You are viewing this real estate asset listing as its authenticated developer owner. Inquiry generation operations are blocked for you.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

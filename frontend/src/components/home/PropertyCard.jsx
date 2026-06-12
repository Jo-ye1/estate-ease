import React from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesContext";

export default function PropertyCard({ item }) {
  const { favorites, toggleFavorite } = useFavorites();

  if (!item) {
    return (
      <div className="w-full max-w-[312px] h-[385px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse flex items-center justify-center text-slate-400 dark:text-slate-600 font-medium mx-auto">
        Loading property details...
      </div>
    );
  }

  const safeFavorites = Array.isArray(favorites) ? favorites : [];
  const isFavorited = safeFavorites.some(
    (fav) => (fav._id === item._id || fav.property?._id === item._id)
  );

  // 👑 FIXED DATA LAYER RESOLVER: Merges backend array streams and wizard base64 parameters cleanly
  const displayImage = (() => {
    // A. Check if it's a dynamic image string from local storage wizard
    if (item.image && typeof item.image === "string" && item.image.trim() !== "") {
      return item.image;
    }
    // B. Check if it's an image string inside a backend database array
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      const firstImg = item.images[0];
      if (firstImg && firstImg.trim() !== "") {
        return firstImg.startsWith("http") || firstImg.startsWith("data:") ? firstImg : `http://localhost:5000${firstImg}`;
      }
    }
    // C. High-quality real estate stock fallback if both checks are missing or blank
    return "https://unsplash.com";
  })();

  // Multi-key resolvers for structural variations across datasets
  const listingStatus = item.status || "For Sale";
  const propertyTitle = item.title || "Untitled Property Listing";
  const bedroomsCount = item.bedrooms !== undefined ? item.bedrooms : (item.beds || 0);
  const bathroomsCount = item.bathrooms !== undefined ? item.bathrooms : (item.baths || 0);
  const propertyGeoLocation = item.location || item.address || "Location not provided";

  return (
    <Link 
      to={`/properties/${item._id || item.id}`}
      className="w-full max-w-[312px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between text-slate-800 dark:text-slate-200 group block no-underline mx-auto h-[385px]"
    >
      {/* 📷 IMAGE CONTAINER */}
      <div className="relative w-full h-[195px] overflow-hidden bg-slate-950 shrink-0 border-b border-slate-100 dark:border-slate-800/20">
        <img 
          src={displayImage} 
          alt={propertyTitle} 
          loading="lazy" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          onError={(e) => {
            // Hard network level fallback link loop protection
            e.target.src = "https://unsplash.com";
          }}
        />
        
        {/* 🏷️ STATUS BADGE */}
        <span className="absolute top-3 left-3 bg-white/95 text-slate-700 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm border border-transparent dark:border-slate-800">
          {listingStatus}
        </span>

        {/* Favorite Button */}
        <button 
          type="button" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(item._id || item.id);
          }} 
          className="absolute top-3 right-3 w-7 h-7 bg-white/40 hover:bg-white/80 dark:bg-slate-900/40 dark:hover:bg-slate-900/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all shadow-sm border-0 cursor-pointer z-10 outline-none"
        >
          <Heart className={`w-4 h-4 transition-colors ${isFavorited ? "fill-red-500 text-red-500" : "text-white dark:text-slate-300"}`} />
        </button>
      </div>

      {/* CARD CONTENT LAYER */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="text-left">
          {/* Title */}
          <h3 className="font-bold text-sm text-slate-800 dark:text-white tracking-tight leading-snug line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {propertyTitle}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 mt-1.5 text-slate-400 dark:text-slate-500">
            <span className="text-[10px] shrink-0">📍</span>
            <p className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 line-clamp-1 tracking-wide">
              {propertyGeoLocation}
            </p>
          </div>

          {/* Specifications Flex Line */}
          <div className="flex items-center gap-2 mt-4 text-slate-500 dark:text-slate-400 text-[11px] font-semibold">
            <div className="flex items-center gap-1">
              <span className="text-slate-400 dark:text-slate-500">🛏️</span>
              <span className="whitespace-nowrap">{bedroomsCount} {bedroomsCount === 1 ? 'Bedroom' : 'Bedrooms'}</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700 font-light select-none text-[8px]">•</span>
            <div className="flex items-center gap-1">
              <span className="text-slate-400 dark:text-slate-500">🛁</span>
              <span className="whitespace-nowrap">{bathroomsCount} {bathroomsCount === 1 ? 'Bathroom' : 'Bathrooms'}</span>
            </div>
          </div>
        </div>

        {/* LOWER PRICING FOOTER */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="text-left">
            <span className="text-base font-black text-blue-600 dark:text-blue-500">
              ${item.price ? item.price.toLocaleString() : "0"}
            </span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wide uppercase ml-0.5">
              {listingStatus.toLowerCase().includes("rent") ? "/ Month" : "/ Total"}
            </span>
          </div>
          
          <span className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-[10.5px] font-extrabold uppercase tracking-wide rounded-md border border-slate-200 dark:border-slate-700 transition-colors shadow-sm">
            View More
          </span>
        </div>
      </div>
    </Link>
  );
}

import { Heart } from "lucide-react";
import { useFavorites } from "../../context/FavoritesContext";

export default function PropertyCard({ item }) {
  const { favorites, toggleFavorite } = useFavorites();

  // If item data hasn't loaded yet, return a clean loading skeleton card
  if (!item) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 h-80 animate-pulse flex items-center justify-center text-slate-500">
        Loading listing parameters...
      </div>
    );
  }

  const safeFavorites = Array.isArray(favorites) ? favorites : [];

  // 🛠️ C5 — Check if this specific property is already favorited inside MongoDB state
  const isFavorited = safeFavorites.some(
    (fav) => (fav._id === item._id || fav.property?._id === item._id)
  );

  const displayImage = item.images && item.images.length > 0 
    ? item.images 
    : "/assets/about-house.jpg"; 

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 transition-all duration-200 hover:border-slate-700 shadow-md">
      
      {/* Floating Heart Icon Button */}
      <button
        type="button"
        onClick={() => toggleFavorite(item._id)}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-sm transition-all duration-200 cursor-pointer"
      >
        <Heart 
          className={`w-5 h-5 transition-colors duration-200 ${
            isFavorited ? "fill-red-500 text-red-500" : "text-white hover:text-red-400"
          }`} 
        />
      </button>

      {/* Property Media Asset */}
      <img
        src={displayImage}
        alt={item.title || "Property"}
        className="h-48 w-full object-cover"
      />

      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-lg text-white truncate max-w-[75%]">
            {item.title || "Untitled Property"}
          </h3>
          <span className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded-md">
            {item.type || "House"}
          </span>
        </div>

        <p className="text-slate-400 text-sm mb-2 truncate">
          {item.location || "Location not provided"}
        </p>

        <div className="flex gap-3 text-xs text-slate-400 mb-3 border-t border-b border-slate-800/60 py-2">
          <span>🛏️ {item.bedrooms || 0} Beds</span>
          <span>🛁 {item.bathrooms || 0} Baths</span>
          <span>📐 {item.area || 0} sq ft</span>
        </div>

        <p className="text-blue-500 font-bold text-xl">
          ${item.price ? item.price.toLocaleString() : "0"}
        </p>

        {/* 🛠️ C5 — Dynamic Heart State Action Text Button */}
        <button
          type="button"
          onClick={() => toggleFavorite(item._id)}
          className={`w-full mt-3 rounded-lg py-2 font-semibold text-sm transition-all duration-200 shadow-sm cursor-pointer ${
            isFavorited 
              ? "bg-red-600 hover:bg-red-700 text-white" 
              : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
          }`}
        >
          {isFavorited ? "❤️ Saved" : "🤍 Save"}
        </button>
      </div>
    </div>
  );
}

import React from "react";
import { Heart, MapPin, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesContext";

export default function PropertyCard({
  item,
  showStatusDropdown = false,
  handleStatusChange,
}) {
  const { toggleFavorite, isFavorited } = useFavorites();

  if (!item) return null;

  const favorited = isFavorited(item._id);

  const displayImage = (() => {
    if (!item.images) {
      return "https://unsplash.com";
    }
    
    let targetImg = "";
    if (Array.isArray(item.images) && item.images.length > 0) {
      targetImg = item.images[0];
    } else if (typeof item.images === "string") {
      targetImg = item.images;
    }

    if (!targetImg) {
      return "https://unsplash.com";
    }

    return targetImg.startsWith("http") || targetImg.startsWith("data:")
      ? targetImg
      : `http://localhost:5000${targetImg}`;
  })();

  const propertyPrice =
    item?.pricing?.salePrice ||
    item?.pricing?.monthlyRent ||
    item?.pricing?.dailyRate ||
    item?.price ||
    0;

  const priceSuffix =
    item.listingType === "rent"
      ? " / mo"
      : item.listingType === "hotel"
      ? " / night"
      : "";

  const operationBadgeColors =
    item.listingType === "sale"
      ? "bg-emerald-600 text-white border-emerald-700 font-black text-[10px]"
      : item.listingType === "rent"
      ? "bg-blue-600 text-white border-blue-700 font-black text-[10px]"
      : "bg-purple-600 text-white border-purple-700 font-black text-[10px]";

  const operationLabel =
    item.listingType === "sale"
      ? "FOR SALE"
      : item.listingType === "rent"
      ? "FOR RENT"
      : "HOTEL STAY";

  return (
    <Link
      to={`/properties/${item._id}`}
      className="w-full max-w-[312px] min-h-[440px] h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between text-slate-800 dark:text-slate-200 group no-underline mx-auto"
    >
      <div className="relative w-full h-[180px] overflow-hidden bg-slate-950 shrink-0 border-b border-slate-200 dark:border-slate-800/60">
        <img
          src={displayImage}
          alt={item.title || "Property Asset"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute top-3 left-3 flex gap-1.5 z-10">
          <span className={`px-2.5 py-1 rounded-md tracking-wider border ${operationBadgeColors}`}>
            {operationLabel}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(item._id);
          }}
          className="absolute top-3 right-3 w-9 h-9 bg-white/80 hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-900 backdrop-blur-md rounded-full flex items-center justify-center transition-all border-0 shadow-xs cursor-pointer z-10 outline-none"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              favorited ? "fill-red-500 text-red-500" : "text-slate-800 dark:text-white"
            }`}
          />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between text-left">
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
            <span className="capitalize">{item.propertyCategory || "House"}</span>
          </div>

          <h3 className="font-black text-base text-slate-900 dark:text-white tracking-tight line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mt-1">
            {item.title || "Untitled Listing"}
          </h3>
          
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 min-h-[16px]">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
            <p className="text-xs font-bold line-clamp-1 text-slate-600 dark:text-slate-400">
              {item.location || "Location unlisted"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 text-slate-700 dark:text-slate-300 text-[11px] font-black">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg">
              <span>🛏️</span> 
              <span>{item.bedrooms || 0}</span> 
              <span className="font-bold text-slate-400 dark:text-slate-500">Beds</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg">
              <span>🛁</span> 
              <span>{item.bathrooms || 0}</span> 
              <span className="font-bold text-slate-400 dark:text-slate-500">Baths</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg">
              <span>📐</span> 
              <span>{item.area || 0}</span> 
              <span className="font-bold text-slate-400 dark:text-slate-500">sqft</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-200 dark:border-slate-800/80 shrink-0">
          <div className="text-left min-w-0 flex-1 pr-2">
            <span className="text-lg font-black text-blue-600 dark:text-blue-400 tracking-tight leading-none block sm:inline">
              ${propertyPrice.toLocaleString()}
            </span>
            <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 tracking-wide lowercase ml-0.5">
              {priceSuffix}
            </span>
          </div>

          {showStatusDropdown && (
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="mr-2"
            >
              <select
                value={item.listingStatus || "published"}
                onChange={(e) => handleStatusChange(item._id, e.target.value)}
                className="border border-slate-300 dark:border-slate-700 rounded-xl px-2 py-1.5 text-xs font-black bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
                <option value="sold">Sold</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          )}

          <span className="px-3.5 py-2 bg-slate-900 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-500 text-white font-black uppercase text-xs tracking-wider rounded-xl border-0 transition-all shadow-xs shrink-0">
            Details
          </span>
        </div>
      </div>
    </Link>
  );
}

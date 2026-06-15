import React from "react";
import { Heart, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesContext";

export default function PropertyCard({
  item,
  isOwner = false,
  onDelete,
}) {
  const { favorites, toggleFavorite } = useFavorites();

  const safeFavorites = Array.isArray(favorites) ? favorites : [];

  const isFavorited = safeFavorites.some(
    (fav) => fav._id === item._id
  );

  const displayImage =
    item?.images?.length > 0
      ? item.images[0].startsWith("http")
        ? item.images[0]
        : `http://localhost:5000${item.images[0]}`
      : "https://via.placeholder.com/400";

  // 👑 NESTED PRICING RESOLVER MATRIX
  const price =
    item?.listingType === "sale"
      ? item?.pricing?.salePrice
      : item?.listingType === "rent"
      ? item?.pricing?.monthlyRent
      : item?.pricing?.dailyRate;

  // 👑 RE-CALCULATED DISPLAY STRING DECK
  const priceLabel =
    item?.listingType === "sale"
      ? "Sale"
      : item?.listingType === "rent"
      ? "/month"
      : "/day";

  return (
    <div className="relative">
      <Link
        to={`/properties/${item._id}`}
        className="block bg-white rounded-2xl overflow-hidden shadow"
      >
        <img
          src={displayImage}
          alt={item.title}
          className="w-full h-52 object-cover"
        />

        <div className="p-4">
          <h3 className="font-bold text-lg">
            {item.title}
          </h3>

          <p className="text-gray-500 text-sm">
            {item.location}
          </p>

          <div className="flex gap-4 mt-3 text-sm">
            <span>{item.bedrooms} Beds</span>
            <span>{item.bathrooms} Baths</span>
            <span>{item.area} sqft</span>
          </div>

          {/* 👑 ADAPTIVE DISPLAY BLOCKS INTEGRATION */}
          <div className="mt-4">
            <span className="text-blue-600 font-bold text-xl">
              ${price?.toLocaleString()} {priceLabel}
            </span>
          </div>
        </div>
      </Link>

      <button
        onClick={() => toggleFavorite(item._id)}
        className="absolute top-3 right-3"
      >
        <Heart
          className={
            isFavorited
              ? "fill-red-500 text-red-500"
              : "text-white"
          }
        />
      </button>

      {isOwner && (
        <div className="absolute bottom-3 right-3 flex gap-2">
          <Link
            to={`/properties/edit/${item._id}`}
            className="bg-blue-600 p-2 rounded"
          >
            <Pencil size={16} color="white" />
          </Link>

          <button
            onClick={() => onDelete(item._id)}
            className="bg-red-600 p-2 rounded"
          >
            <Trash2 size={16} color="white" />
          </button>
        </div>
      )}
    </div>
  );
}

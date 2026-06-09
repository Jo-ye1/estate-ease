import { Heart } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";

export default function PropertyCard({
  title,
  image,
  price,
  location,
}) {
  const { addFavorite } = useFavorites();

  return (
    /* Added 'relative' here so the absolute heart button anchors inside this card box container */
    <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
      
      {/* Floating Heart Icon Button */}
      <button
        type="button"
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white hover:text-red-500 backdrop-blur-sm transition-all duration-200"
      >
        <Heart className="w-5 h-5" />
      </button>

      <img
        src={image}
        alt={title}
        className="h-48 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="font-semibold text-lg text-white">
          {title}
        </h3>

        <p className="text-slate-400">
          {location}
        </p>

        <p className="text-blue-500 font-bold mt-2">
          {price}
        </p>

        {/* Existing step 3 action row retains full functionality */}
        <button
          onClick={() => addFavorite({ title, image, price, location })}
          className="w-full mt-4 border border-slate-700 hover:border-slate-500 rounded-lg py-2 text-white bg-slate-800 hover:bg-slate-700 transition-colors duration-200"
        >
          ❤️ Save
        </button>
      </div>
    </div>
  );
}

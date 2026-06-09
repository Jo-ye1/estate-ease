import { useFavorites } from "../../context/FavoritesContext";

export default function PropertyInfo({
  property,
}) {
  const { addFavorite } = useFavorites();

  return (
    <div>
      <h1 className="text-5xl font-bold">
        {property.title}
      </h1>

      <p className="text-slate-500 mt-2">
        {property.location}
      </p>

      <p className="text-blue-600 text-3xl font-bold mt-4">
        ${property.price.toLocaleString()}
      </p>

      <button
        onClick={() => addFavorite(property)}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 shadow-sm"
      >
        ❤️ Save Property
      </button>

      <div className="mt-10">
        <h2 className="text-2xl font-bold">
          Description
        </h2>

        <p className="mt-4 text-slate-600">
          Beautiful property located in a
          prime area with modern amenities
          and excellent investment value.
        </p>
      </div>
    </div>
  );
}

import { useFavorites } from "../context/FavoritesContext"; // 👈 Relative path fallback safeguard
import PropertyCard from "@/components/home/PropertyCard"; // 👈 Reuses your unified card engine

export default function FavoritesPage() {
  const { favorites, loading } = useFavorites();

  if (loading) {
    return <h2 className="p-10 text-center text-xl text-slate-400">Loading Favorites...</h2>;
  }

  // 🧹 Extract nested property sub-documents from the backend populated array safely
  const cleanPropertiesList = favorites.map((fav) => {
    // If the backend returns a flat property document, use it; otherwise extract the nested property object
    return fav.property ? fav.property : fav;
  }).filter(Boolean); // Filters out any null objects to avoid rendering crashes

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen bg-slate-950">
      <h1 className="text-4xl font-bold mb-2 text-white">Your Favorites</h1>
      <p className="text-slate-400 text-sm mb-8">Quickly view or remove listings you've bookmarked</p>

      {cleanPropertiesList.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
          <p className="text-xl text-slate-400 font-medium mb-2">No bookmarked properties yet</p>
        </div>
      ) : (
        // 🔁 Reuses your core card component container seamlessly
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cleanPropertiesList.map((property) => (
            <PropertyCard key={property._id} item={property} />
          ))}
        </div>
      )}
    </div>
  );
}

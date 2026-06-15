import { useFavorites } from "../context/FavoritesContext";
import PropertyCard from "@/components/home/PropertyCard";
import Navbar from "@/components/home/Navbar";

export default function FavoritesPage() {
  const { favorites, loading } = useFavorites();

  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200 select-none">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 animate-pulse">
          Loading favorites...
        </div>
      </div>
    );
  }

  const safeFavoritesList = Array.isArray(favorites) 
    ? favorites 
    : favorites?.favorites || [];

  const validFavorites = safeFavoritesList.filter(
    (fav) => fav && (fav.property || fav._id)
  );

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 flex flex-col text-left select-none pb-20">
      <Navbar />

      <section className="max-w-7xl mx-auto w-full px-6 pt-16 pb-20 flex-1">
        <div className="mb-12">
          <span className="text-[11px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full inline-block mb-4">
            Saved Properties
          </span>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Your Favorite Listings
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md">
            All properties you bookmarked are stored here and synced directly from your MongoDB account.
          </p>
          <div className="w-24 h-[3px] bg-blue-600 rounded-full mt-4" />
        </div>

        {validFavorites.length === 0 ? (
          <div className="w-full py-24 flex flex-col items-center justify-center text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900 shadow-xs">
            <span className="text-4xl mb-4">❤️</span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              No favorites yet
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              Start exploring properties and save the ones you love.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center sm:justify-items-start">
            {validFavorites.map((fav) => {
              const propertyItem = fav.property || fav;
              const uniqueKey = fav._id || propertyItem._id;
              return (
                <div key={uniqueKey} className="w-full max-w-[312px]">
                  <PropertyCard item={propertyItem} />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

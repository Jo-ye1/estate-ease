import {
  useFavorites,
} from "@/context/FavoritesContext";

import PropertyGrid from
"@/components/properties/PropertyGrid";

export default function FavoritesPage() {

  const { favorites } =
    useFavorites();

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <h1 className="text-5xl font-bold mb-10">
        Favorites
      </h1>

      <PropertyGrid
        properties={favorites}
      />

    </div>
  );
}
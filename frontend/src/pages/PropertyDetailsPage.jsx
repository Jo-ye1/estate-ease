import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Heart } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";
import { getPropertyById } from "@/services/propertyService";

import PropertyGallery from "@/components/property/PropertyGallery";
import PropertyInfo from "@/components/property/PropertyInfo";
import AgentCard from "@/components/property/AgentCard";
import ContactAgentForm from "@/components/property/ContactAgentForm";
import SimilarProperties from "@/components/property/SimilarProperties";

export default function PropertyDetailsPage() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize the favorites global context state hooks
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading Property...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-10 text-center">
        Property Not Found
      </div>
    );
  }

  // Cross-reference MongoDB entries to determine if listing is bookmarked
  const isFavorite = favorites.some(
    (fav) => fav._id === property._id
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <PropertyGallery property={property} />

      <div className="grid lg:grid-cols-3 gap-10 mt-10">

        <div className="lg:col-span-2">

          {/* Dynamic interactive heart button tracking bookmark arrays */}
          <button
            onClick={() => toggleFavorite(property._id)}
            className="mb-6 flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Heart
              className={
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-500"
              }
            />
            <span className="text-sm font-medium">
              {isFavorite ? "Saved to Favorites" : "Save Property"}
            </span>
          </button>

          <PropertyInfo property={property} />

          <ContactAgentForm />

        </div>

        <div>

          <AgentCard owner={property?.owner} />

        </div>

      </div>

      <SimilarProperties currentId={property?._id} />

    </div>
  );
}

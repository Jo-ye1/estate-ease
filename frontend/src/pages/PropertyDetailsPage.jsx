import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPropertyById, getRelatedProperties } from "../services/propertyService";
import PropertyCard from "@/components/home/PropertyCard";

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompleteDetailsData = async () => {
      try {
        setLoading(true);
        // Execute both queries concurrently to optimize network performance
        const [propertyData, relatedData] = await Promise.all([
          getPropertyById(id),
          getRelatedProperties(id),
        ]);

        setProperty(propertyData);
        setRelated(relatedData || []);
      } catch (error) {
        console.error("Failed loading comprehensive details layout:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCompleteDetailsData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <h2 className="text-xl font-medium text-slate-400 animate-pulse">Assembling property metrics...</h2>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-950 text-center py-20 text-slate-400">
        <p className="text-xl font-semibold">Listing Not Found</p>
        <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">&larr; Return Home</Link>
      </div>
    );
  }

  // Handle local disk path arrays fallback smoothly
  const coverImage = property.images && property.images.length > 0 ? property.images[0] : "/placeholder.jpg";

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* 🏢 C3 — MAIN CONTENT SECTION HERO VIEW */}
        <div className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl mb-10">
          <div className="h-[450px] w-full bg-slate-950 relative">
            <img src={coverImage} alt={property.title} className="w-full h-full object-cover" />
            <span className="absolute top-4 left-4 bg-blue-600 border border-blue-500 px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md">
              {property.type}
            </span>
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6 gap-4">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight">{property.title}</h1>
                <p className="text-slate-400 text-lg mt-2 flex items-center gap-1">📍 {property.location}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-blue-500">${property.price?.toLocaleString()}</p>
                <p className="text-slate-500 text-xs mt-1">Published: {new Date(property.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* 📊 SUMMARY DIMENSION SPECIFICATION CHIPS GRID */}
            <div className="grid grid-cols-3 gap-4 my-8 text-center bg-slate-950/40 p-5 rounded-2xl border border-slate-800/60">
              <div className="p-2">
                <p className="text-2xl mb-1">🛏️</p>
                <p className="text-lg font-bold text-white">{property.bedrooms || 0}</p>
                <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Bedrooms</p>
              </div>
              <div className="p-2 border-l border-r border-slate-800/60">
                <p className="text-2xl mb-1">🛁</p>
                <p className="text-lg font-bold text-white">{property.bathrooms || 0}</p>
                <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Bathrooms</p>
              </div>
              <div className="p-2">
                <p className="text-2xl mb-1">📐</p>
                <p className="text-lg font-bold text-white">{property.area || 0}</p>
                <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">sq ft (Area)</p>
              </div>
            </div>

            {/* DESCRIPTION PANEL BLOCKS */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-200 mb-3">Description</h2>
              <p className="text-slate-300 leading-relaxed text-base whitespace-pre-line bg-slate-950/20 p-5 rounded-xl border border-slate-800/40">
                {property.description}
              </p>
            </div>

            {/* 👤 RECTOR BROKER LISTING OWNER CONTAINER MATRICES */}
            <div className="flex items-center gap-4 bg-slate-950 p-5 rounded-2xl border border-slate-800/80">
              <div className="w-12 h-12 bg-blue-600 text-white text-xl font-black flex items-center justify-center rounded-full shadow-inner">
                {property.owner?.name ? property.owner.name[0].toUpperCase() : "O"}
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Listed Broker Account</p>
                <p className="text-lg font-bold text-white mt-0.5">{property.owner?.name || "Independent Owner"}</p>
                <p className="text-sm text-slate-400">{property.owner?.email || "No contact verified"}</p>
              </div>
            </div>

          </div>
        </div>

        {/* 🛠️ C4 — RELATED PROPERTIES CAROUSEL SEGMENT ROW */}
        <div className="border-t border-slate-800 pt-10">
          <h2 className="text-2xl font-black tracking-tight text-white mb-2">You May Also Like</h2>
          <p className="text-slate-400 text-sm mb-6">Explore similar properties based on your active selection attributes</p>
          
          {related.length === 0 ? (
            <p className="text-slate-500 italic text-sm">No alternative comparable properties listed at this time.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((item) => (
                <PropertyCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PropertyDetailsPage;

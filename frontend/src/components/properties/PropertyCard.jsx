import { Link } from "react-router-dom";

export default function PropertyCard(props) {
  // CRUCIAL DEFENSIVE FIX:
  // If property object is explicitly passed (like in PropertyGrid), use props.property.
  // If properties are spread out {...property} (like in PropertyDeals), use raw props instead.
  const item = props.property || props;

  // Render nothing if the data object is completely empty to prevent crashing
  if (!item) return null;

  return (
    <div className="border rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
      <img
        src={
          item.images?.[0] ||
          "/placeholder.jpg"
        }
        alt={item.title || "Property"}
        className="h-52 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="font-bold text-xl text-slate-900 dark:text-white line-clamp-1">
          {item.title}
        </h3>

        <p className="text-slate-500 dark:text-slate-400 mt-1">{item.location}</p>

        <p className="text-blue-500 font-bold mt-2">
          {item.price ? `$${item.price.toLocaleString()}` : "Price N/A"}
        </p>

        <Link
          to={`/properties/${item._id}`}
          className="block mt-4 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg font-medium transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

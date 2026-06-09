// FavoriteCard.jsx

export default function FavoriteCard({
  property,
  removeFavorite,
}) {
  return (
    <div className="border rounded-2xl overflow-hidden">
      <img
        src={property.image}
        alt={property.title}
        className="h-48 w-full object-cover"
      />

      <div className="p-4">

        <h3 className="font-bold">
          {property.title}
        </h3>

        <p>{property.location}</p>

        <button
          onClick={() =>
            removeFavorite(
              property.id
            )
          }
          className="
            mt-4
            bg-red-500
            text-white
            px-4
            py-2
            rounded-lg
          "
        >
          Remove
        </button>

      </div>
    </div>
  );
}